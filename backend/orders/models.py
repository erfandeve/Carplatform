from django.db import models
from django.utils import timezone

from core.constants import ORDER_TYPE_CHOICES, ORDER_NORMAL


class Stage(models.Model):
    """A step in an order pipeline. Each order_type has its own ordered set;
    admins can add, rename, delete, and reorder stages globally."""

    order_type = models.CharField(max_length=10, choices=ORDER_TYPE_CHOICES)
    title = models.CharField(max_length=120)
    description = models.CharField(max_length=300, blank=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order_type', 'position']

    def __str__(self):
        return f'[{self.order_type}] {self.position}. {self.title}'


class Order(models.Model):
    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='orders',
    )
    order_type = models.CharField(
        max_length=10, choices=ORDER_TYPE_CHOICES, default=ORDER_NORMAL,
    )
    product = models.ForeignKey(
        'catalog.Product', null=True, blank=True, on_delete=models.SET_NULL,
        related_name='orders',
    )
    selected_color = models.CharField(max_length=120, blank=True)

    # Current position in the pipeline (index into ordered stages of this type).
    current_stage = models.ForeignKey(
        Stage, null=True, blank=True, on_delete=models.SET_NULL,
        related_name='orders',
    )

    # Contact snapshot captured at order time (so admin can call fast).
    full_name = models.CharField(max_length=140, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)
    note = models.TextField(blank=True)

    # Custom request fields (order_type == custom).
    custom_car_type = models.CharField(max_length=160, blank=True)
    custom_specs = models.TextField(blank=True)
    custom_color = models.CharField(max_length=120, blank=True)
    custom_budget_toman = models.BigIntegerField(null=True, blank=True)

    # Deposit (بیعانه) terms acceptance — auditable.
    deposit_terms_accepted = models.BooleanField(default=False)
    deposit_terms_accepted_at = models.DateTimeField(null=True, blank=True)
    deposit_paid = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'سفارش #{str(self.pk)[-6:]} · {self.full_name}'

    def pipeline(self):
        return list(Stage.objects.filter(order_type=self.order_type))

    def ensure_first_stage(self):
        if self.current_stage is None:
            first = Stage.objects.filter(order_type=self.order_type).first()
            if first:
                self.current_stage = first

    def accept_terms(self):
        self.deposit_terms_accepted = True
        self.deposit_terms_accepted_at = timezone.now()
        self.save(update_fields=['deposit_terms_accepted', 'deposit_terms_accepted_at'])

    def move(self, direction):
        """direction: +1 next, -1 previous. Returns True if moved."""
        stages = self.pipeline()
        if not stages:
            return False
        idx = 0
        if self.current_stage in stages:
            idx = stages.index(self.current_stage)
        new_idx = max(0, min(len(stages) - 1, idx + direction))
        if new_idx == idx and self.current_stage is not None:
            return False
        self.current_stage = stages[new_idx]
        self.save(update_fields=['current_stage', 'updated_at'])
        return True

    @property
    def is_completed(self):
        stages = self.pipeline()
        return bool(stages) and self.current_stage == stages[-1]
