from rest_framework import serializers

from catalog.models import Product
from core.serializers import StrIdMixin
from .models import Order, Stage


class StageSerializer(StrIdMixin, serializers.ModelSerializer):
    class Meta:
        model = Stage
        fields = ['id', 'order_type', 'title', 'description', 'position']
        read_only_fields = ['id']


class OrderProductMini(StrIdMixin, serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'slug', 'name', 'image', 'kind', 'price_aed', 'price_toman']


class OrderSerializer(StrIdMixin, serializers.ModelSerializer):
    orderType = serializers.CharField(source='order_type', read_only=True)
    product = OrderProductMini(read_only=True)
    selectedColor = serializers.CharField(source='selected_color', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    isCompleted = serializers.BooleanField(source='is_completed', read_only=True)
    currentStageId = serializers.SerializerMethodField()
    statusTitle = serializers.SerializerMethodField()
    steps = serializers.SerializerMethodField()
    contact = serializers.SerializerMethodField()
    custom = serializers.SerializerMethodField()
    deposit = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'orderType', 'product', 'selectedColor', 'note',
            'createdAt', 'isCompleted', 'currentStageId', 'statusTitle',
            'steps', 'contact', 'custom', 'deposit',
        ]

    def get_currentStageId(self, obj):
        return str(obj.current_stage_id) if obj.current_stage_id else None

    def get_statusTitle(self, obj):
        return obj.current_stage.title if obj.current_stage else 'ثبت‌شده'

    def get_steps(self, obj):
        stages = obj.pipeline()
        cur = obj.current_stage
        cur_idx = stages.index(cur) if cur in stages else 0
        out = []
        for i, s in enumerate(stages):
            state = 'done' if i < cur_idx else 'current' if i == cur_idx else 'pending'
            out.append({'id': str(s.id), 'title': s.title, 'state': state})
        return out

    def get_contact(self, obj):
        return {'fullName': obj.full_name, 'phone': obj.phone, 'email': obj.email}

    def get_custom(self, obj):
        if obj.order_type != 'custom':
            return None
        return {
            'carType': obj.custom_car_type,
            'specs': obj.custom_specs,
            'color': obj.custom_color,
            'budget': obj.custom_budget_toman,
        }

    def get_deposit(self, obj):
        return {
            'accepted': obj.deposit_terms_accepted,
            'acceptedAt': obj.deposit_terms_accepted_at,
            'paid': obj.deposit_paid,
        }


class OrderCreateSerializer(serializers.ModelSerializer):
    product = serializers.SlugRelatedField(
        slug_field='slug', queryset=Product.objects.all(),
        allow_null=True, required=False,
    )

    class Meta:
        model = Order
        fields = [
            'order_type', 'product', 'selected_color', 'note',
            'custom_car_type', 'custom_specs', 'custom_color',
            'custom_budget_toman',
        ]

    def create(self, validated_data):
        user = self.context['request'].user
        order = Order(user=user, **validated_data)
        # Snapshot contact info so admins can call quickly.
        order.full_name = user.full_name or user.phone
        order.phone = user.phone
        order.email = user.email
        order.ensure_first_stage()
        order.save()
        return order
