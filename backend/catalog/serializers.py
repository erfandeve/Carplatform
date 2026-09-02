from rest_framework import serializers

from core.serializers import StrIdMixin
from .models import Category, Product, Review, Testimonial


class CategorySerializer(StrIdMixin, serializers.ModelSerializer):
    """Recursive tree for the mega-menu."""

    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'slug', 'title', 'icon', 'image', 'children']

    def get_children(self, obj):
        kids = obj.children.all()
        return CategorySerializer(kids, many=True, context=self.context).data


class CategoryFlatSerializer(StrIdMixin, serializers.ModelSerializer):
    parent = serializers.SlugRelatedField(
        slug_field='slug', queryset=Category.objects.all(),
        allow_null=True, required=False,
    )

    class Meta:
        model = Category
        fields = ['id', 'slug', 'title', 'icon', 'image', 'parent', 'position']


class ReviewSerializer(StrIdMixin, serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'name', 'rating', 'text', 'approved', 'created_at']
        read_only_fields = ['id', 'approved', 'created_at']


class ProductSerializer(StrIdMixin, serializers.ModelSerializer):
    """Emits the shape the React frontend already consumes (camelCase keys)."""

    priceAed = serializers.IntegerField(source='price_aed')
    priceToman = serializers.IntegerField(source='price_toman')
    discountPercent = serializers.IntegerField(source='discount_percent')
    category = serializers.SlugRelatedField(slug_field='slug', read_only=True)
    rating = serializers.FloatField(source='avg_rating', read_only=True)
    reviews = serializers.IntegerField(source='review_count', read_only=True)
    statuses = serializers.SerializerMethodField()
    baseToman = serializers.SerializerMethodField()
    finalToman = serializers.SerializerMethodField()
    inStock = serializers.BooleanField(source='in_stock')

    def get_statuses(self, obj):
        # MongoDB ArrayField can round-trip as a JSON string; normalize to a list.
        val = obj.statuses
        if isinstance(val, str):
            import json
            try:
                return json.loads(val)
            except (ValueError, TypeError):
                return []
        return list(val or [])

    class Meta:
        model = Product
        fields = [
            'id', 'kind', 'slug', 'name', 'year', 'category',
            'priceAed', 'priceToman', 'discountPercent',
            'statuses', 'tag', 'featured', 'inStock',
            'image', 'gallery', 'colors', 'rating', 'reviews',
            'baseToman', 'finalToman',
        ]

    def _rate(self):
        return self.context.get('rate', 26500)

    def get_baseToman(self, obj):
        return obj.base_toman(self._rate())

    def get_finalToman(self, obj):
        return obj.final_toman(self._rate())


class ProductDetailSerializer(ProductSerializer):
    reviewList = serializers.SerializerMethodField()

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + [
            'description', 'specs', 'reviewList',
        ]

    def get_reviewList(self, obj):
        qs = obj.reviews.filter(approved=True)
        return ReviewSerializer(qs, many=True).data


class ProductWriteSerializer(StrIdMixin, serializers.ModelSerializer):
    """Admin create/update — accepts raw model fields."""

    category = serializers.SlugRelatedField(
        slug_field='slug', queryset=Category.objects.all(),
        allow_null=True, required=False,
    )

    class Meta:
        model = Product
        fields = [
            'id', 'kind', 'name', 'slug', 'category', 'year', 'description',
            'price_aed', 'price_toman', 'discount_percent', 'statuses',
            'tag', 'featured', 'in_stock', 'image', 'gallery', 'colors', 'specs',
        ]


class TestimonialSerializer(StrIdMixin, serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'name', 'role', 'rating', 'text', 'avatar']
