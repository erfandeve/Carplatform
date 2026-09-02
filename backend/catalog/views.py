from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from core.models import ExchangeRate
from core.permissions import IsProductManagerOrAdmin, IsAdminRole
from .models import Category, Product, Review, Testimonial
from .serializers import (
    CategoryFlatSerializer,
    CategorySerializer,
    ProductDetailSerializer,
    ProductSerializer,
    ProductWriteSerializer,
    ReviewSerializer,
    TestimonialSerializer,
)


def current_rate():
    return ExchangeRate.load().toman_per_aed


def descendant_slugs(slug):
    """A category slug plus all of its descendants (for tree filtering)."""
    try:
        root = Category.objects.get(slug=slug)
    except Category.DoesNotExist:
        return [slug]
    result, stack = [root.slug], [root]
    while stack:
        node = stack.pop()
        for child in node.children.all():
            result.append(child.slug)
            stack.append(child)
    return result


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    permission_classes = [IsProductManagerOrAdmin]
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return CategorySerializer
        return CategoryFlatSerializer

    def list(self, request, *args, **kwargs):
        # Only root categories, each with nested children (mega-menu shape).
        roots = Category.objects.filter(parent__isnull=True)
        data = CategorySerializer(
            roots, many=True, context=self.get_serializer_context(),
        ).data
        return Response(data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def flat(self, request):
        data = CategoryFlatSerializer(Category.objects.all(), many=True).data
        return Response(data)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    permission_classes = [IsProductManagerOrAdmin]
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return ProductWriteSerializer
        return ProductSerializer

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['rate'] = current_rate()
        return ctx

    def _filter_sort(self, request):
        qp = request.query_params
        items = list(Product.objects.all())
        rate = current_rate()

        kind = qp.get('kind')
        if kind:
            items = [p for p in items if p.kind == kind]
        if qp.get('type') == 'used':
            items = [p for p in items if p.kind == 'used']

        cat = qp.get('cat')
        if cat:
            slugs = set(descendant_slugs(cat))
            items = [p for p in items if p.category and p.category.slug in slugs]

        statuses = qp.get('status')
        if statuses:
            wanted = set(s for s in statuses.split(',') if s)
            items = [p for p in items if wanted & set(p.statuses or [])]

        if qp.get('featured') in ('1', 'true'):
            items = [p for p in items if p.featured]

        q = qp.get('q')
        if q:
            ql = q.strip().lower()
            items = [p for p in items if ql in p.name.lower()]

        rate_price = lambda p: p.final_toman(rate)  # noqa: E731
        try:
            if qp.get('min'):
                items = [p for p in items if rate_price(p) >= int(qp['min'])]
            if qp.get('max'):
                items = [p for p in items if rate_price(p) <= int(qp['max'])]
        except ValueError:
            pass

        sort = qp.get('sort', 'new')
        if sort == 'price_asc':
            items.sort(key=rate_price)
        elif sort == 'price_desc':
            items.sort(key=rate_price, reverse=True)
        elif sort == 'popular':
            items.sort(key=lambda p: p.sold_count, reverse=True)
        else:  # new
            items.sort(key=lambda p: p.created_at, reverse=True)
        return items

    def list(self, request, *args, **kwargs):
        items = self._filter_sort(request)
        ctx = self.get_serializer_context()
        page = self.paginate_queryset(items)
        if page is not None:
            data = ProductSerializer(page, many=True, context=ctx).data
            return self.get_paginated_response(data)
        return Response(ProductSerializer(items, many=True, context=ctx).data)

    def retrieve(self, request, *args, **kwargs):
        product = self.get_object()
        product.views = (product.views or 0) + 1
        product.save(update_fields=['views'])
        ctx = self.get_serializer_context()
        data = ProductDetailSerializer(product, context=ctx).data
        related = Product.objects.filter(
            category=product.category,
        ).exclude(pk=product.pk)[:4]
        data['related'] = ProductSerializer(related, many=True, context=ctx).data
        return Response(data)

    @action(detail=True, methods=['get', 'post'], permission_classes=[AllowAny])
    def reviews(self, request, slug=None):
        product = self.get_object()
        if request.method == 'GET':
            qs = product.reviews.filter(approved=True)
            return Response(ReviewSerializer(qs, many=True).data)
        serializer = ReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user if request.user.is_authenticated else None
        serializer.save(product=product, user=user, approved=False)
        return Response(
            {'detail': 'نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود.'},
            status=status.HTTP_201_CREATED,
        )


class TestimonialViewSet(viewsets.ModelViewSet):
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminRole]

    def get_queryset(self):
        qs = Testimonial.objects.all()
        user = self.request.user
        is_admin = user.is_authenticated and user.is_admin_user
        if self.action == 'list' and not is_admin:
            qs = qs.filter(published=True)
        return qs

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return super().get_permissions()


class ReviewAdminViewSet(viewsets.ModelViewSet):
    """Admin moderation of product reviews."""

    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminRole]
    filterset_fields = ['approved', 'product']

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        review = self.get_object()
        review.approved = True
        review.save(update_fields=['approved'])
        return Response(ReviewSerializer(review).data)
