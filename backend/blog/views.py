from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from core.permissions import IsProductManagerOrAdmin
from .models import Article
from .serializers import (
    ArticleDetailSerializer,
    ArticleListSerializer,
    ArticleWriteSerializer,
)


class ArticleViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    permission_classes = [IsProductManagerOrAdmin]

    def get_queryset(self):
        qs = Article.objects.all()
        user = self.request.user
        is_admin = user.is_authenticated and user.is_admin_user
        if not is_admin:
            qs = qs.filter(published=True)
        return qs

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ArticleDetailSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return ArticleWriteSerializer
        return ArticleListSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return super().get_permissions()
