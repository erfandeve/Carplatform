from rest_framework import serializers

from core.serializers import StrIdMixin
from .models import Ticket, TicketMessage


class TicketMessageSerializer(StrIdMixin, serializers.ModelSerializer):
    authorName = serializers.SerializerMethodField()

    class Meta:
        model = TicketMessage
        fields = ['id', 'sender', 'authorName', 'body', 'attachment', 'created_at']
        read_only_fields = ['id', 'sender', 'created_at']

    def get_authorName(self, obj):
        return obj.author.full_name if obj.author else ''


class TicketSerializer(StrIdMixin, serializers.ModelSerializer):
    messages = TicketMessageSerializer(many=True, read_only=True)
    userName = serializers.SerializerMethodField()
    userPhone = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = [
            'id', 'subject', 'status', 'created_at', 'updated_at',
            'messages', 'userName', 'userPhone',
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

    def get_userName(self, obj):
        return obj.user.full_name or obj.user.phone

    def get_userPhone(self, obj):
        return obj.user.phone


class TicketCreateSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=200)
    body = serializers.CharField()
    attachment = serializers.FileField(required=False, allow_null=True)

    def create(self, validated_data):
        user = self.context['request'].user
        ticket = Ticket.objects.create(user=user, subject=validated_data['subject'])
        TicketMessage.objects.create(
            ticket=ticket, sender='user', author=user,
            body=validated_data['body'],
            attachment=validated_data.get('attachment'),
        )
        return ticket
