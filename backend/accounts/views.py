import random

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from core.permissions import IsAdminRole
from .serializers import (
    PhoneTokenObtainSerializer,
    RegisterSerializer,
    UserSerializer,
)

User = get_user_model()


def tokens_for(user):
    refresh = RefreshToken.for_user(user)
    return {'access': str(refresh.access_token), 'refresh': str(refresh)}


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {'user': UserSerializer(user).data, **tokens_for(user)},
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    serializer_class = PhoneTokenObtainSerializer
    permission_classes = [AllowAny]


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class OTPRequestView(APIView):
    """Generate an OTP for a phone. In dev the code is returned in the response
    (in production this would be sent by SMS)."""

    permission_classes = [AllowAny]

    def post(self, request):
        phone = request.data.get('phone', '').strip()
        if not phone:
            return Response({'detail': 'شماره موبایل الزامی است.'}, status=400)
        user, _ = User.objects.get_or_create(phone=phone)
        code = f'{random.randint(0, 999999):06d}'
        user.otp_code = code
        user.otp_sent_at = timezone.now()
        user.save(update_fields=['otp_code', 'otp_sent_at'])
        return Response({'detail': 'کد ارسال شد.', 'dev_code': code})


class OTPVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone = request.data.get('phone', '').strip()
        code = request.data.get('code', '').strip()
        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response({'detail': 'کاربر یافت نشد.'}, status=404)
        if not user.otp_code or user.otp_code != code:
            return Response({'detail': 'کد نامعتبر است.'}, status=400)
        user.phone_verified = True
        user.otp_code = ''
        user.save(update_fields=['phone_verified', 'otp_code'])
        return Response({'user': UserSerializer(user).data, **tokens_for(user)})


class AdminUserViewSet(viewsets.ModelViewSet):
    """Admin: list / edit / delete users, and see who accepted deposit terms."""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminRole]
    search_fields = ['phone', 'email', 'first_name', 'last_name']
    filterset_fields = ['role']
