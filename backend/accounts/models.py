from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from core.constants import ROLE_CHOICES, ROLE_CUSTOMER, ROLE_ADMIN, STAFF_ROLES


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create(self, phone, password, **extra):
        if not phone:
            raise ValueError('شماره موبایل الزامی است')
        extra['email'] = self.normalize_email(extra.get('email', '') or '')
        user = self.model(phone=phone, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, phone, password=None, **extra):
        extra.setdefault('is_staff', False)
        extra.setdefault('is_superuser', False)
        extra.setdefault('role', ROLE_CUSTOMER)
        return self._create(phone, password, **extra)

    def create_superuser(self, phone, password=None, **extra):
        extra.update(is_staff=True, is_superuser=True, role=ROLE_ADMIN, is_active=True)
        return self._create(phone, password, **extra)


class User(AbstractBaseUser, PermissionsMixin):
    phone = models.CharField('شماره موبایل', max_length=15, unique=True)
    email = models.EmailField('ایمیل', blank=True)
    first_name = models.CharField('نام', max_length=60, blank=True)
    last_name = models.CharField('نام خانوادگی', max_length=60, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_CUSTOMER)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Optional OTP verification of the phone number.
    phone_verified = models.BooleanField(default=False)
    otp_code = models.CharField(max_length=6, blank=True)
    otp_sent_at = models.DateTimeField(null=True, blank=True)

    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = []

    class Meta:
        ordering = ['-date_joined']

    def __str__(self):
        return self.full_name or self.phone

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.strip()

    @property
    def is_admin_user(self):
        return self.is_superuser or self.role in STAFF_ROLES
