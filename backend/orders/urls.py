from rest_framework.routers import DefaultRouter

from .views import AdminOrderViewSet, OrderViewSet, StageViewSet

router = DefaultRouter()
router.register('orders', OrderViewSet, basename='orders')
router.register('admin/orders', AdminOrderViewSet, basename='admin-orders')
router.register('admin/stages', StageViewSet, basename='admin-stages')

urlpatterns = router.urls
