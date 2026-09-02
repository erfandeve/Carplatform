from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import IsSupportOrAdmin
from .models import Ticket, TicketMessage
from .serializers import (
    TicketCreateSerializer,
    TicketMessageSerializer,
    TicketSerializer,
)


class TicketViewSet(viewsets.ModelViewSet):
    """Customer support tickets — own tickets only."""

    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        return TicketCreateSerializer if self.action == 'create' else TicketSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticket = serializer.save()
        return Response(TicketSerializer(ticket).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        ticket = self.get_object()
        body = request.data.get('body', '').strip()
        if not body:
            return Response({'detail': 'متن پیام الزامی است.'}, status=400)
        TicketMessage.objects.create(
            ticket=ticket, sender='user', author=request.user, body=body,
            attachment=request.data.get('attachment'),
        )
        ticket.status = 'open'
        ticket.save(update_fields=['status', 'updated_at'])
        return Response(TicketSerializer(ticket).data)


class AdminTicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsSupportOrAdmin]
    http_method_names = ['get', 'post', 'patch', 'head', 'options']
    filterset_fields = ['status']

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        ticket = self.get_object()
        body = request.data.get('body', '').strip()
        if not body:
            return Response({'detail': 'متن پاسخ الزامی است.'}, status=400)
        TicketMessage.objects.create(
            ticket=ticket, sender='admin', author=request.user, body=body,
        )
        ticket.status = 'answered'
        ticket.save(update_fields=['status', 'updated_at'])
        return Response(TicketSerializer(ticket).data)

    @action(detail=True, methods=['post'])
    def set_status(self, request, pk=None):
        ticket = self.get_object()
        new_status = request.data.get('status')
        if new_status not in ('open', 'answered', 'closed'):
            return Response({'detail': 'وضعیت نامعتبر است.'}, status=400)
        ticket.status = new_status
        ticket.save(update_fields=['status', 'updated_at'])
        return Response(TicketSerializer(ticket).data)
