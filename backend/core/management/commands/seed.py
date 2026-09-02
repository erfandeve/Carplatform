"""Seed the database with the same content the frontend showcases,
plus demo users and the three order-stage pipelines. Idempotent."""

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from blog.models import Article
from catalog.models import Category, Product, Review, Testimonial
from core.models import DepositSettings, ExchangeRate
from orders.models import Stage

User = get_user_model()


def img(pid, w=900):
    return f'https://images.unsplash.com/photo-{pid}?auto=format&fit=crop&w={w}&q=80'


CATEGORIES = [
    ('cars', 'خودرو', 'car', None, [
        ('suv', 'شاسی‌بلند / SUV'), ('sedan', 'سدان'),
        ('coupe', 'کوپه / اسپرت'), ('ev', 'برقی'),
    ]),
    ('used-cars', 'خودروهای دسته دوم', 'history', None, [
        ('used-suv', 'شاسی‌بلند کارکرده'), ('used-sedan', 'سدان کارکرده'),
    ]),
    ('parts', 'لوازم یدکی', 'wrench', None, [
        ('oil', 'روغن ماشین', [('oil-fuchs', 'روغن فوکس'), ('oil-motul', 'روغن موتول')]),
        ('tires', 'لاستیک'), ('brake', 'لنت و ترمز'),
    ]),
]

CARS = [
    dict(slug='mercedes-g63-2024', name='مرسدس‌بنز G63 AMG', year=2024, category='suv',
         price_aed=128000, discount_percent=6, statuses=['freePerm', 'gozarPerm'],
         featured=True, tag='ویژه', rating=4.9, reviews=42, sold=31,
         image=img('1520031441872-265e4ff70366'),
         colors=[{'name': 'مشکی اوبسیدین', 'hex': '#0b0b0d'},
                 {'name': 'سفید قطبی', 'hex': '#eef1f4'},
                 {'name': 'خاکستری سلنیت', 'hex': '#5b606a'}]),
    dict(slug='porsche-911-carrera', name='پورشه ۹۱۱ کررا S', year=2023, category='coupe',
         price_aed=96000, discount_percent=0, statuses=['freePerm'],
         featured=True, tag='اسپرت', rating=5, reviews=31, sold=22,
         image=img('1503376780353-7e6692767b70'),
         colors=[{'name': 'قرمز گوارد', 'hex': '#c1121f'},
                 {'name': 'نقره‌ای GT', 'hex': '#c8ccd1'}]),
    dict(slug='bmw-x7-m60i', name='بی‌ام‌و X7 M60i', year=2024, category='suv',
         price_aed=84000, discount_percent=4, statuses=['freeTemp', 'gozarTemp'],
         featured=True, tag='جدید', rating=4.7, reviews=18, sold=14,
         image=img('1555215695-3004980ad54e'),
         colors=[{'name': 'آبی تانزانیت', 'hex': '#1f3a5f'},
                 {'name': 'مشکی کربن', 'hex': '#111317'}]),
    dict(slug='lamborghini-urus-s', name='لامبورگینی اوروس S', year=2024, category='suv',
         price_aed=165000, discount_percent=0,
         statuses=['freePerm', 'freeTemp', 'gozarPerm'],
         featured=True, tag='لوکس', rating=5, reviews=27, sold=9,
         image=img('1552519507-da3b142c6e3d'),
         colors=[{'name': 'زرد نئون', 'hex': '#f2c200'},
                 {'name': 'خاکستری نمه', 'hex': '#3f4145'}]),
    dict(slug='tesla-model-s-plaid', name='تسلا مدل S پلید', year=2023, category='ev',
         price_aed=72000, discount_percent=8, statuses=['freeTemp'],
         featured=False, tag='', rating=4.6, reviews=12, sold=19,
         image=img('1560958089-b8a1929cea89'),
         colors=[{'name': 'مشکی مروارید', 'hex': '#0d0f12'},
                 {'name': 'سفید صدفی', 'hex': '#f4f6f8'}]),
    dict(slug='range-rover-autobiography', name='رنج‌روور آتوبیوگرافی', year=2024,
         category='suv', price_aed=118000, discount_percent=5,
         statuses=['gozarPerm', 'gozarTemp'], featured=False, tag='',
         rating=4.8, reviews=20, sold=11, image=img('1553440569-bcc63803a83d'),
         colors=[{'name': 'سبز بریتیش', 'hex': '#22392c'}]),
    dict(slug='audi-rs7-sportback', name='آئودی RS7 اسپرت‌بک', year=2023, category='sedan',
         price_aed=89000, discount_percent=0, statuses=['freePerm', 'gozarPerm'],
         featured=False, tag='', rating=4.9, reviews=15, sold=8,
         image=img('1606664515524-ed2f786a0bd6'),
         colors=[{'name': 'خاکستری نارود', 'hex': '#4b4e52'}]),
    dict(slug='bentley-continental-gt', name='بنتلی کانتیننتال GT', year=2024,
         category='coupe', price_aed=210000, discount_percent=0, statuses=['freePerm'],
         featured=False, tag='لوکس', rating=5, reviews=9, sold=4,
         image=img('1621135802920-133df287f89c'),
         colors=[{'name': 'آبی سکوئنشال', 'hex': '#20406b'}]),
]

USED = [
    dict(slug='used-cayenne-2019', name='پورشه کاین ۲۰۱۹ (کارکرده)', year=2019,
         category='used-suv', price_aed=52000, discount_percent=4,
         statuses=['gozarPerm'], rating=4.5, reviews=6, sold=3,
         image=img('1614026480197-38d8d1e1f1e8')),
    dict(slug='used-e300-2020', name='مرسدس E300 مدل ۲۰۲۰ (کارکرده)', year=2020,
         category='used-sedan', price_aed=41000, discount_percent=0,
         statuses=['freeTemp'], rating=4.4, reviews=5, sold=2,
         image=img('1502877338535-766e1452684a')),
]

PARTS = [
    dict(slug='fuchs-titan-5w40', name='روغن موتور فوکس تیتان ۵W-۴۰', category='oil-fuchs',
         price_toman=4850000, discount_percent=10, rating=4.7, reviews=64, sold=210,
         image=img('1635830625698-3b9bd74671ca', 600)),
    dict(slug='michelin-pilot-sport', name='لاستیک میشلن پایلوت اسپرت ۴', category='tires',
         price_toman=12500000, discount_percent=0, rating=4.9, reviews=38, sold=140,
         image=img('1449426468159-d96dbf08f19f', 600)),
    dict(slug='brembo-brake-kit', name='کیت لنت و دیسک برمبو', category='brake',
         price_toman=21800000, discount_percent=6, rating=4.8, reviews=21, sold=76,
         image=img('1486262715619-67b85e0b08d3', 600)),
    dict(slug='motul-8100-5w30', name='روغن موتور موتول ۸۱۰۰ ۵W-۳۰', category='oil-motul',
         price_toman=5600000, discount_percent=0, rating=4.6, reviews=47, sold=132,
         image=img('1621939514649-280e2ee25f60', 600)),
]

ARTICLES = [
    dict(slug='rahnamaye-kharid-mashin-gozar',
         title='راهنمای کامل خرید ماشین گذر موقت و دائم',
         excerpt='همه‌چیز درباره خرید ماشین گذر؛ از تفاوت گذر موقت و دائم تا مدارک لازم و '
                 'نکات حقوقی واردات خودرو از کشورهای حوزه خلیج فارس.',
         category='راهنمای خرید', read_min=7, image=img('1449965408869-eaa3f722e40d', 800),
         keywords='خرید ماشین، خرید ماشین گذر، واردات خودرو'),
    dict(slug='tafavot-gozar-mantaghe-azad',
         title='تفاوت خرید ماشین منطقه آزاد با گذر چیست؟',
         excerpt='مقایسه کامل خرید ماشین منطقه آزاد و گذر از نظر قوانین، هزینه ترخیص، '
                 'امکان پلاک ملی و محدودیت‌های تردد.',
         category='قوانین گمرکی', read_min=6, image=img('1493238792000-8113da705763', 800),
         keywords='خرید ماشین منطقه آزاد، گذر، منطقه آزاد'),
    dict(slug='mohasebe-hazine-tarkhis',
         title='محاسبه هزینه ترخیص و گمرک خودرو وارداتی',
         excerpt='چگونه هزینه نهایی خرید ماشین وارداتی را پیش از سفارش تخمین بزنیم؟ '
                 'فرمول‌ها و نکات کاهش هزینه ترخیص.',
         category='راهنمای خرید', read_min=9, image=img('1517524008697-84bbe3c3fd98', 800),
         keywords='هزینه ترخیص، گمرک خودرو، خرید ماشین'),
]

TESTIMONIALS = [
    ('امیر رضایی', 'خریدار G63', 5,
     'کل فرآیند از سفارش تا تحویل شفاف بود و مرحله‌به‌مرحله در پنل کاربری پیگیری کردم. '
     'قیمت درهمی و تومانی دقیقاً همان چیزی بود که اعلام شده بود.'),
    ('سارا محمدی', 'خریدار پورشه ۹۱۱', 5,
     'انتخاب رنگ خودرو و ثبت سفارش خیلی ساده بود. پشتیبانی از طریق تیکت سریع جواب می‌داد '
     'و واریز بیعانه کاملاً امن انجام شد.'),
    ('حسین کاظمی', 'خریدار رنج‌روور', 4,
     'برای واردات از منطقه آزاد راهنمایی کامل گرفتم. مقالات سایت هم در تصمیم‌گیری بین گذر '
     'و منطقه آزاد خیلی کمکم کرد.'),
    ('مریم اسدی', 'خریدار مدل S', 5,
     'اولین بار بود ماشین وارداتی می‌خریدم و نگران بودم، ولی استپر مراحل سفارش باعث شد '
     'همیشه بدانم کجای کار هستم.'),
]

STAGES = {
    'normal': ['ثبت سفارش و بررسی اولیه', 'تایید موجودی و قیمت نهایی', 'پرداخت بیعانه',
               'عقد قرارداد', 'در حال ترخیص/آماده‌سازی', 'حمل و ارسال',
               'تحویل به نمایندگی/گمرک', 'تحویل نهایی به مشتری'],
    'custom': ['ثبت درخواست و بررسی اولیه', 'تأمین و اعلام موجودی', 'تایید قیمت نهایی',
               'پرداخت بیعانه', 'عقد قرارداد', 'در حال ترخیص/آماده‌سازی', 'حمل و ارسال',
               'تحویل نهایی به مشتری'],
    'used': ['ثبت سفارش و بررسی اولیه', 'کارشناسی فنی خودرو', 'تایید سلامت بدنه و موتور',
             'تایید موجودی و قیمت نهایی', 'پرداخت بیعانه', 'عقد قرارداد',
             'در حال ترخیص/آماده‌سازی', 'حمل و ارسال', 'تحویل به نمایندگی/گمرک',
             'تحویل نهایی به مشتری'],
}


class Command(BaseCommand):
    help = 'Seed demo data (idempotent).'

    def handle(self, *args, **opts):
        self.stdout.write('پاک‌سازی داده‌های قبلی...')
        for model in (Review, Product, Category, Article, Testimonial, Stage):
            model.objects.all().delete()

        ExchangeRate.load()  # ensures singleton with default 26500
        DepositSettings.load()

        # Categories (build tree)
        cat_map = {}
        for slug, title, icon, _parent, children in CATEGORIES:
            root = Category.objects.create(slug=slug, title=title, icon=icon, position=0)
            cat_map[slug] = root
            for i, child in enumerate(children):
                if len(child) == 3:
                    cslug, ctitle, grandchildren = child
                else:
                    cslug, ctitle = child
                    grandchildren = []
                sub = Category.objects.create(
                    slug=cslug, title=ctitle, parent=root, position=i)
                cat_map[cslug] = sub
                for j, (gslug, gtitle) in enumerate(grandchildren):
                    leaf = Category.objects.create(
                        slug=gslug, title=gtitle, parent=sub, position=j)
                    cat_map[gslug] = leaf

        def make_product(d, kind):
            reviews = d.pop('reviews', 0)
            rating = d.pop('rating', 5)
            sold = d.pop('sold', 0)
            cat = cat_map.get(d.pop('category'))
            p = Product.objects.create(kind=kind, category=cat, sold_count=sold, **d)
            # A few approved reviews so the star rating renders.
            for k in range(min(reviews, 5)):
                Review.objects.create(
                    product=p, name=f'خریدار {k + 1}', rating=round(rating),
                    text='کیفیت و فرآیند خرید عالی بود.', approved=True)
            return p

        for d in CARS:
            make_product(dict(d), 'car')
        for d in USED:
            make_product(dict(d), 'used')
        for d in PARTS:
            make_product(dict(d), 'part')

        for d in ARTICLES:
            Article.objects.create(**d)

        for i, (name, role, rating, text) in enumerate(TESTIMONIALS):
            Testimonial.objects.create(
                name=name, role=role, rating=rating, text=text, position=i)

        for order_type, titles in STAGES.items():
            for pos, title in enumerate(titles):
                Stage.objects.create(order_type=order_type, title=title, position=pos)

        # Demo accounts
        admin, created = User.objects.get_or_create(
            phone='09120000000',
            defaults=dict(first_name='ادمین', last_name='کل', role='admin',
                          is_staff=True, is_superuser=True, email='admin@autogalaxy.ir'),
        )
        admin.is_staff = True
        admin.is_superuser = True
        admin.role = 'admin'
        admin.set_password('admin12345')
        admin.save()

        customer, _ = User.objects.get_or_create(
            phone='09121111111',
            defaults=dict(first_name='کاربر', last_name='نمونه',
                          email='user@example.com'),
        )
        customer.set_password('user12345')
        customer.save()

        self.stdout.write(self.style.SUCCESS(
            f'✅ Seed کامل شد: {Product.objects.count()} محصول، '
            f'{Category.objects.count()} دسته، {Article.objects.count()} مقاله، '
            f'{Stage.objects.count()} مرحله سفارش. '
            'ادمین: 09120000000 / admin12345 — کاربر: 09121111111 / user12345'))
