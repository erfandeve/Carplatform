from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    ProductViewSet,
    ReviewAdminViewSet,
    TestimonialViewSet,
)

router = DefaultRouter()
router.register('products', ProductViewSet, basename='products')
router.register('categories', CategoryViewSet, basename='categories')
router.register('testimonials', TestimonialViewSet, basename='testimonials')
router.register('admin/reviews', ReviewAdminViewSet, basename='admin-reviews')

urlpatterns = router.urls
