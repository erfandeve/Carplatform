from rest_framework import serializers

from .models import ExchangeRate, DepositSettings, Regulation


class StrIdMixin(serializers.Serializer):
    """MongoDB primary keys are ObjectId; expose them as strings."""

    id = serializers.CharField(read_only=True)


class ExchangeRateSerializer(serializers.ModelSerializer):
    rate = serializers.IntegerField(source='toman_per_aed')

    class Meta:
        model = ExchangeRate
        fields = ['rate', 'updated_at']


class DepositSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepositSettings
        fields = [
            'terms_text', 'card_number', 'sheba', 'card_holder',
            'deposit_amount_toman',
        ]


class RegulationSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Regulation
        fields = [
            'id', 'slug', 'title', 'subtitle', 'image', 'content',
            'position', 'published', 'updated_at',
        ]
