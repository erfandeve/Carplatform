from rest_framework import serializers

from core.serializers import StrIdMixin
from .models import Article


class ArticleListSerializer(StrIdMixin, serializers.ModelSerializer):
    readMin = serializers.IntegerField(source='read_min')
    date = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            'id', 'slug', 'title', 'excerpt', 'image', 'category',
            'readMin', 'date',
        ]

    def get_date(self, obj):
        return obj.created_at.strftime('%Y/%m/%d')


class ArticleDetailSerializer(ArticleListSerializer):
    class Meta(ArticleListSerializer.Meta):
        fields = ArticleListSerializer.Meta.fields + [
            'content', 'meta_title', 'meta_description', 'keywords',
        ]


class ArticleWriteSerializer(StrIdMixin, serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'image', 'category',
            'read_min', 'meta_title', 'meta_description', 'keywords', 'published',
        ]
