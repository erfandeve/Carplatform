# اتوگلکسی — بک‌اند (Django + DRF + MongoDB)

API پلتفرم فروش خودروی وارداتی. Django 6 + Django REST Framework + JWT، دیتابیس
MongoDB از طریق `django-mongodb-backend` رسمی.

## راه‌اندازی

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# MongoDB باید در حال اجرا باشد (localhost:27017)
python manage.py migrate
python manage.py seed          # داده نمونه + کاربران دمو
python manage.py runserver 8000
```

**کاربران دمو (بعد از seed):**
- ادمین: `09120000000` / `admin12345`
- کاربر: `09121111111` / `user12345`

## معماری اپ‌ها

| اپ | مسئولیت |
|----|---------|
| `accounts` | کاربر سفارشی (لاگین با موبایل)، JWT، OTP، نقش‌ها (RBAC)، مدیریت کاربران |
| `catalog` | دسته‌بندی درختی، محصول (خودرو/لوازم/دسته‌دوم)، نظر، Testimonial، Wishlist |
| `orders` | مراحل قابل‌ویرایش (۳ پایپ‌لاین)، سفارش، درخواست سفارشی، بیعانه |
| `support` | تیکتینگ (کاربر + ادمین) |
| `blog` | مقالات با فیلدهای سئو |
| `core` | نرخ ارز سراسری، تنظیمات بیعانه، داشبورد آماری، لاگ فعالیت |

## مهم‌ترین Endpointها (پیشوند `/api/`)

**عمومی / فروشگاه**
- `GET products/` — فیلتر: `kind`, `cat` (+زیردسته‌ها)، `status` (چندتایی)، `min/max`, `sort`, `q`, `featured`, صفحه‌بندی
- `GET products/<slug>/` — جزئیات + نظرات + محصولات مرتبط
- `GET|POST products/<slug>/reviews/` — نمایش/ثبت نظر
- `GET categories/` — درخت مگامنو · `GET testimonials/` · `GET articles/`
- `GET settings/exchange-rate/` — نرخ درهم→تومان

**احراز هویت** — `auth/register/`, `auth/login/`, `auth/token/refresh/`, `auth/me/`, `auth/otp/{request,verify}/`

**کاربر (JWT لازم)**
- `GET|POST orders/` — سفارش‌ها و درخواست سفارشی (`order_type=custom`)
- `POST orders/<id>/accept_terms/` — پذیرش قوانین بیعانه (زمان ذخیره می‌شود)
- `GET|POST tickets/` + `tickets/<id>/reply/`

**ادمین (نقش staff لازم)**
- `products` / `categories` / `articles` / `testimonials` — CRUD کامل
- `admin/orders/?order_type=normal|custom|used` — سه بخش مجزا + `admin/orders/<id>/move/` (جلو/عقب) + `admin/orders/deposit_acceptances/`
- `admin/stages/` + `admin/stages/reorder/` — تعریف/ترتیب مراحل
- `admin/tickets/` + `reply/` + `set_status/` · `admin/reviews/` + `approve/`
- `admin/users/` · `PUT settings/exchange-rate/` · `PUT settings/deposit/` · `GET admin/dashboard/`

## منطق قیمت‌گذاری ارزی

قیمت خودرو به **درهم** ذخیره می‌شود؛ نرخ سراسری `ExchangeRate` (تکی، قابل‌ویرایش
توسط ادمین) قیمت نهایی تومانی را محاسبه می‌کند: `تومان = درهم × نرخ`. تغییر نرخ،
قیمت همه خودروها را آنی به‌روز می‌کند (سریالایزر هنگام هر پاسخ محاسبه می‌کند).

## نکته فنی MongoDB

- کلید اصلی همه مدل‌ها `ObjectId` است؛ در سریالایزرها به‌صورت رشته خروجی داده می‌شود
  (`StrIdMixin`).
- فیلد چندوضعیتی `statuses` با `ArrayField` مونگو ذخیره و در سریالایزر به لیست
  نرمال می‌شود.
- مهاجرت اپ‌های داخلی جنگو (auth/admin/contenttypes) از `mongo_migrations/`
  (تمپلیت رسمی MongoDB) استفاده می‌کند.
