from django.db import models

TICKET_STATUS = [
    ('open', 'باز'),
    ('answered', 'پاسخ داده‌شده'),
    ('closed', 'بسته‌شده'),
]


class Ticket(models.Model):
    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='tickets',
    )
    subject = models.CharField(max_length=200)
    status = models.CharField(max_length=10, choices=TICKET_STATUS, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.subject


class TicketMessage(models.Model):
    ticket = models.ForeignKey(
        Ticket, on_delete=models.CASCADE, related_name='messages',
    )
    sender = models.CharField(
        max_length=10, choices=[('user', 'کاربر'), ('admin', 'پشتیبانی')],
        default='user',
    )
    author = models.ForeignKey(
        'accounts.User', null=True, blank=True, on_delete=models.SET_NULL,
    )
    body = models.TextField()
    attachment = models.FileField(upload_to='tickets/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'{self.sender}: {self.body[:30]}'
