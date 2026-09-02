from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import IsAdminRole
from .models import Order, Stage
from .serializers import (
    OrderCreateSerializer,
    OrderSerializer,
    StageSerializer,
)


class OrderViewSet(viewsets.ModelViewSet):
    """Customer-facing: manage one's own orders + custom requests."""

    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        qs = Order.objects.filter(user=self.request.user)
        order_type = self.request.query_params.get('order_type')
        if order_type:
            qs = qs.filter(order_type=order_type)
        if self.request.query_params.get('completed') == '1':
            qs = [o for o in qs if o.is_completed]
        return qs

    def get_serializer_class(self):
        return OrderCreateSerializer if self.action == 'create' else OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def accept_terms(self, request, pk=None):
        order = self.get_object()
        order.accept_terms()
        return Response(OrderSerializer(order).data)


class StageViewSet(viewsets.ModelViewSet):
    """Admin: define/rename/reorder/delete pipeline stages per order type."""

    queryset = Stage.objects.all()
    serializer_class = StageSerializer
    permission_classes = [IsAdminRole]
    filterset_fields = ['order_type']

    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """Body: {order_type, ids: [...]} — persist the new stage order."""
        ids = request.data.get('ids', [])
        for position, stage_id in enumerate(ids):
            Stage.objects.filter(pk=stage_id).update(position=position)
        return Response({'detail': 'ترتیب مراحل ذخیره شد.'})


class AdminOrderViewSet(viewsets.ModelViewSet):
    """Admin: three separate sections via ?order_type=normal|custom|used."""

    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminRole]
    http_method_names = ['get', 'post', 'patch', 'head', 'options']
    filterset_fields = ['order_type', 'deposit_paid']

    def get_queryset(self):
        qs = Order.objects.all()
        order_type = self.request.query_params.get('order_type')
        if order_type:
            qs = qs.filter(order_type=order_type)
        return qs

    @action(detail=True, methods=['post'])
    def move(self, request, pk=None):
        """Body: {direction: 1 | -1} — advance or rewind the order stage."""
        order = self.get_object()
        direction = int(request.data.get('direction', 1))
        moved = order.move(1 if direction >= 0 else -1)
        return Response({'moved': moved, 'order': OrderSerializer(order).data})

    @action(detail=False, methods=['get'])
    def deposit_acceptances(self, request):
        """Audit list of who accepted deposit terms and when."""
        orders = Order.objects.filter(deposit_terms_accepted=True)
        data = [{
            'orderId': str(o.id),
            'user': o.full_name,
            'phone': o.phone,
            'acceptedAt': o.deposit_terms_accepted_at,
            'orderType': o.order_type,
        } for o in orders]
        return Response(data)
