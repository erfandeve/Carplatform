from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminDashboardView,
    DepositSettingsView,
    ExchangeRateView,
    RegulationViewSet,
    UploadView,
)

router = DefaultRouter()
router.register('regulations', RegulationViewSet, basename='regulation')

urlpatterns = [
    path('settings/exchange-rate/', ExchangeRateView.as_view(), name='exchange-rate'),
    path('settings/deposit/', DepositSettingsView.as_view(), name='deposit-settings'),
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('uploads/', UploadView.as_view(), name='upload'),
    path('', include(router.urls)),
]
