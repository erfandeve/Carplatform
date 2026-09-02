from django.db import models


class Article(models.Model):
    title = models.CharField(max_length=220)
    slug = models.SlugField(max_length=240, unique=True, allow_unicode=True)
    excerpt = models.TextField(blank=True)
    content = models.TextField(blank=True)  # rich HTML from WYSIWYG
    image = models.CharField(max_length=500, blank=True)
    category = models.CharField(max_length=120, blank=True)
    read_min = models.PositiveIntegerField(default=5)

    # SEO fields
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.CharField(max_length=320, blank=True)
    keywords = models.CharField(max_length=300, blank=True)

    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
