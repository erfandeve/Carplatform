import os
import uuid

from django.core.files.storage import default_storage
from rest_framework import generics, viewsets
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from blog.models import Article
from catalog.models import Product
from orders.models import Order
from support.models import Ticket
from .models import ExchangeRate, DepositSettings, Regulation
from .permissions import IsAdminRole
from .serializers import (
    ExchangeRateSerializer, DepositSettingsSerializer, RegulationSerializer,
)


class ExchangeRateView(APIView):
    """Public read of the global rate; admin PUT to update (reprices all cars)."""

    def get_permissions(self):
        return [IsAdminRole()] if self.request.method == 'PUT' else [AllowAny()]

    def get(self, request):
        return Response(ExchangeRateSerializer(ExchangeRate.load()).data)

    def put(self, request):
        obj = ExchangeRate.load()
        serializer = ExchangeRateSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class DepositSettingsView(APIView):
    def get_permissions(self):
        return [IsAdminRole()] if self.request.method == 'PUT' else [IsAuthenticated()]

    def get(self, request):
        return Response(DepositSettingsSerializer(DepositSettings.load()).data)

    def put(self, request):
        obj = DepositSettings.load()
        serializer = DepositSettingsSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class AdminDashboardView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        orders = Order.objects.all()
        in_progress = sum(1 for o in orders if not o.is_completed)
        top = list(Product.objects.order_by('-sold_count', '-views')[:5])
        return Response({
            'users': User.objects.count(),
            'orders': orders.count(),
            'ordersInProgress': in_progress,
            'openTickets': Ticket.objects.exclude(status='closed').count(),
            'products': Product.objects.count(),
            'articles': Article.objects.count(),
            'topProducts': [
                {'name': p.name, 'views': p.views, 'sold': p.sold_count}
                for p in top
            ],
        })


class RegulationViewSet(viewsets.ModelViewSet):
    """Public read of published regulations; staff can manage them."""

    serializer_class = RegulationSerializer
    lookup_field = 'slug'
    pagination_class = None

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return [IsAdminRole()]

    def get_queryset(self):
        qs = Regulation.objects.all()
        user = self.request.user
        is_admin = user.is_authenticated and user.is_admin_user
        if not is_admin:
            qs = qs.filter(published=True)
        return qs


class UploadView(APIView):
    """Admin image upload → saves under MEDIA/uploads and returns an
    absolute URL (so the frontend on :5173 can load it from :8000)."""

    permission_classes = [IsAdminRole]
    parser_classes = [MultiPartParser, FormParser]

    ALLOWED = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'}
    MAX_BYTES = 8 * 1024 * 1024  # 8MB

    def post(self, request):
        f = request.FILES.get('file')
        if not f:
            return Response({'detail': 'فایلی ارسال نشد.'}, status=400)
        ext = os.path.splitext(f.name)[1].lower()
        if ext not in self.ALLOWED:
            return Response(
                {'detail': 'فرمت تصویر مجاز نیست (jpg, png, webp, gif).'},
                status=400,
            )
        if f.size > self.MAX_BYTES:
            return Response({'detail': 'حجم تصویر باید کمتر از ۸ مگابایت باشد.'}, status=400)

        name = f'uploads/{uuid.uuid4().hex}{ext}'
        saved = default_storage.save(name, f)
        url = request.build_absolute_uri(default_storage.url(saved))
        return Response({'url': url}, status=201)
