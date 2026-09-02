"""Seed the regulation page(s). گذر موقت فعلاً کنسل است؛ فقط منطقه آزاد."""
from django.core.management.base import BaseCommand

from core.models import Regulation

FREE_ZONE = """
<h2>قوانین پلاک منطقه آزاد</h2>
<ul>
  <li>تردد بین استان‌های گلستان، مازندران، گیلان و اردبیل <strong>بدون مرخصی</strong> مجاز می‌باشد.</li>
  <li>تردد در کل کشور با گرفتن مرخصی مجاز می‌شود؛ تایم مرخصی <strong>۳ تا ۳۰ روز</strong> به‌صورت جداگانه است.</li>
  <li>واردات خودروهای کارکرده فعلاً مجاز نیست و فقط ماشین‌های صفر کیلومتر با سال ساخت <strong>۲۰۲۵ و ۲۰۲۶</strong> تا حجم موتور <strong>۲۵۰۰ سی‌سی</strong> مجاز به واردات هستند.</li>
  <li>پلاک منطقه آزاد مانند پلاک ملی است و هیچ محدودیتی در نگهداری ماشین پس از چند سال وجود ندارد.</li>
  <li>خرید و فروش پلاک منطقه آزاد هیچ محدودیتی ندارد، اما فقط داخل خودِ استان قابلیت فروش دارد.</li>
  <li>تمام ساکنین استان گلستان می‌توانند خودرو با پلاک منطقه آزاد خریداری کنند و نیازی به بومی بودن نیست.</li>
  <li>ماشین‌ها پس از تحویل، بیمه شخص ثالث دارند و بیمه بدنه نیز مانند خودروهای پلاک ملی قابل انجام است که به عهده خریدار می‌باشد.</li>
</ul>
"""

DATA = [
    {
        'slug': 'mantaghe-azad',
        'title': 'قوانین و مقررات منطقه آزاد',
        'subtitle': 'تردد، مرخصی، واردات و شرایط خرید و فروش پلاک منطقه آزاد گلستان',
        'image': '/regulations/pelak.png',
        'content': FREE_ZONE.strip(),
        'position': 0,
    },
]


class Command(BaseCommand):
    help = 'Seed the regulation pages (idempotent).'

    def handle(self, *args, **options):
        for item in DATA:
            obj, created = Regulation.objects.update_or_create(
                slug=item['slug'], defaults=item,
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f'{"created" if created else "updated"}: {obj.title}'
                )
            )
