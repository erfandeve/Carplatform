from rest_framework.routers import DefaultRouter

from .views import AdminTicketViewSet, TicketViewSet

router = DefaultRouter()
router.register('tickets', TicketViewSet, basename='tickets')
router.register('admin/tickets', AdminTicketViewSet, basename='admin-tickets')

urlpatterns = router.urls
