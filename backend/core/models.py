from django.db import models


class Singleton(models.Model):
    """Base for site-wide settings rows: only one instance may exist."""

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        # Force a single row by reusing the first existing pk.
        existing = type(self).objects.first()
        if existing and existing.pk != self.pk:
            self.pk = existing.pk
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj = cls.objects.first()
        if obj is None:
            obj = cls.objects.create()
        return obj


class ExchangeRate(Singleton):
    """Global Toman-per-AED rate. Editing it reprices every car at once."""

    toman_per_aed = models.PositiveIntegerField(default=26500)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'۱ درهم = {self.toman_per_aed} تومان'


class DepositSettings(Singleton):
    """Deposit (بیعانه) terms text + payment card shown after acceptance."""

    terms_text = models.TextField(
        default='لطفاً پیش از واریز بیعانه، شرایط و قوانین را با دقت مطالعه کنید. '
        'مبلغ بیعانه غیرقابل بازگشت است مگر طبق شرایط قرارداد. پس از واریز، فیش '
        'را از طریق سیستم تیکتینگ ارسال نمایید.'
    )
    card_number = models.CharField(max_length=32, default='6037-9975-0000-0000')
    sheba = models.CharField(max_length=40, default='IR000000000000000000000000')
    card_holder = models.CharField(max_length=120, default='شرکت اتوگلکسی')
    deposit_amount_toman = models.BigIntegerField(default=500000000)

    def __str__(self):
        return 'تنظیمات بیعانه'


class Regulation(models.Model):
    """A rules/regulations page (منطقه آزاد، گذر موقت …). Shown as a banner
    slide on the home page and as a full page at /regulations/<slug>."""

    slug = models.SlugField(max_length=120, unique=True, allow_unicode=True)
    title = models.CharField(max_length=160)
    subtitle = models.CharField(max_length=240, blank=True)
    image = models.CharField(max_length=500, blank=True)  # plate/banner image
    content = models.TextField(blank=True)  # rich text / HTML
    position = models.IntegerField(default=0)
    published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['position', 'id']

    def __str__(self):
        return self.title


class ActivityLog(models.Model):
    """Lightweight audit log for admin traceability."""

    actor = models.ForeignKey(
        'accounts.User', null=True, blank=True, on_delete=models.SET_NULL,
        related_name='activity_logs',
    )
    action = models.CharField(max_length=120)
    detail = models.CharField(max_length=400, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.action} · {self.created_at:%Y-%m-%d %H:%M}'
