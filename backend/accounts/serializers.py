from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from core.serializers import StrIdMixin

User = get_user_model()


class UserSerializer(StrIdMixin, serializers.ModelSerializer):
    fullName = serializers.CharField(source='full_name', read_only=True)
    isAdmin = serializers.BooleanField(source='is_admin_user', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'phone', 'email', 'first_name', 'last_name',
            'fullName', 'role', 'isAdmin', 'phone_verified', 'date_joined',
        ]
        read_only_fields = ['id', 'role', 'phone_verified', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone', 'email', 'password']

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError('این شماره موبایل قبلاً ثبت شده است.')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, **validated_data)


class PhoneTokenObtainSerializer(TokenObtainPairSerializer):
    """Login with phone + password; embeds the user in the response."""

    username_field = User.USERNAME_FIELD

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data
