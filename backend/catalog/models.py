from django.db import models
from django_mongodb_backend.fields import ArrayField

from core.constants import KIND_CHOICES, KIND_CAR, STATUS_CHOICES


class Category(models.Model):
    """Multi-level category tree: main → sub → sub-sub."""

    title = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True, allow_unicode=True)
    parent = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.CASCADE,
        related_name='children',
    )
    icon = models.CharField(max_length=40, blank=True)  # lucide icon name
    image = models.CharField(max_length=500, blank=True)  # url for mega-menu
    position = models.IntegerField(default=0)

    class Meta:
        ordering = ['position', 'title']
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.title


class Product(models.Model):
    kind = models.CharField(max_length=10, choices=KIND_CHOICES, default=KIND_CAR)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, allow_unicode=True)
    category = models.ForeignKey(
        Category, null=True, blank=True, on_delete=models.SET_NULL,
        related_name='products',
    )
    year = models.PositiveIntegerField(null=True, blank=True)
    description = models.TextField(blank=True)

    # Pricing — cars are priced in AED, other products directly in Toman.
    price_aed = models.PositiveIntegerField(null=True, blank=True)
    price_toman = models.BigIntegerField(null=True, blank=True)
    discount_percent = models.PositiveIntegerField(default=0)

    # A car can hold several customs states at once.
    statuses = ArrayField(
        models.CharField(max_length=20, choices=STATUS_CHOICES),
        default=list, blank=True,
    )

    tag = models.CharField(max_length=30, blank=True)
    featured = models.BooleanField(default=False)
    in_stock = models.BooleanField(default=True)

    image = models.CharField(max_length=500, blank=True)  # main image url
    gallery = models.JSONField(default=list, blank=True)  # [url, ...]
    colors = models.JSONField(default=list, blank=True)  # [{name, hex}, ...]
    specs = models.JSONField(default=dict, blank=True)  # {key: value}

    views = models.PositiveIntegerField(default=0)
    sold_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def base_toman(self, rate):
        """Pre-discount Toman price using the global exchange rate."""
        if self.kind == KIND_CAR or self.price_aed:
            return int((self.price_aed or 0) * rate)
        return int(self.price_toman or 0)

    def final_toman(self, rate):
        base = self.base_toman(rate)
        if self.discount_percent:
            return int(base - base * self.discount_percent / 100)
        return base

    @property
    def avg_rating(self):
        approved = self.reviews.filter(approved=True)
        vals = [r.rating for r in approved]
        return round(sum(vals) / len(vals), 1) if vals else 0

    @property
    def review_count(self):
        return self.reviews.filter(approved=True).count()


class Review(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='reviews',
    )
    user = models.ForeignKey(
        'accounts.User', null=True, blank=True, on_delete=models.SET_NULL,
        related_name='reviews',
    )
    name = models.CharField(max_length=120)
    rating = models.PositiveSmallIntegerField(default=5)
    text = models.TextField()
    approved = models.BooleanField(default=False)  # moderated before public
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} → {self.product}'


class WishlistItem(models.Model):
    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='wishlist',
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('user', 'product')


class Testimonial(models.Model):
    """Homepage customer testimonials (separate from product reviews)."""

    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120, blank=True)
    rating = models.PositiveSmallIntegerField(default=5)
    text = models.TextField()
    avatar = models.CharField(max_length=500, blank=True)
    published = models.BooleanField(default=True)
    position = models.IntegerField(default=0)

    class Meta:
        ordering = ['position', '-id']

    def __str__(self):
        return self.name
