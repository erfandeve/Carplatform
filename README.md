# اتوگلکسی (AutoGalaxy) — پلتفرم فروش خودروی وارداتی

پلتفرم فروش خودروهای خارجی وارداتی از کشورهای حوزه خلیج فارس (گذر و منطقه آزاد).

## استک فنی

| بخش | تکنولوژی |
|-----|----------|
| فرانت‌اند | React 19 + Vite + React Router |
| استایل | Tailwind CSS v4 (CSS-first، OKLCH) |
| انیمیشن | Framer Motion |
| اسلایدر | Swiper.js |
| آیکون | lucide-react |
| فونت فارسی | Vazirmatn Variable |
| بک‌اند (فاز بعد) | Django + Django REST Framework |
| دیتابیس (فاز بعد) | MongoDB via `django-mongodb-backend` (رسمی) |
| احراز هویت (فاز بعد) | JWT |

## اجرا (فرانت‌اند)

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

## هویت بصری

- **تم:** دارک‌مود لوکس، سرمه‌ای تیره + نئون‌آبی و آبی روشن (استراتژی رنگ Committed).
- **RTL** کامل، فونت Vazirmatn.
- توکن‌های رنگ/فاصله/موشن در `src/index.css` داخل `@theme` تعریف شده‌اند.
- انیمیشن‌ها با احترام به `prefers-reduced-motion`.

## ساختار فعلی فرانت‌اند

```
frontend/src/
├── index.css                 # دیزاین‌سیستم: توکن‌ها، گلو، دکمه‌ها، اسکلتون، swiper
├── App.jsx                   # روتینگ (سایت + placeholderها + 404)
├── data/mock.js              # داده نمونه: نرخ ارز، دسته‌ها، خودروها، لوازم، مقالات، نظرات
├── lib/format.js             # اعداد فارسی + منطق قیمت درهم→تومان + تخفیف
├── components/
│   ├── layout/               # Header (+ MegaMenu, mobile drawer), Footer, Logo, SiteLayout
│   ├── ui/                   # ProductCard, Price, StatusBadges, StarRating, SmartImage, Reveal, SectionHeader
│   └── home/                 # Hero, FeaturedSlider, ProductSection, Testimonials, AboutSection, CustomRequestCTA, ArticlesSection
└── pages/                    # Home, Placeholder, NotFound
```

## منطق قیمت‌گذاری ارزی (پیاده‌سازی‌شده)

قیمت هر خودرو به **درهم** ثبت می‌شود و نرخ سراسری `EXCHANGE_RATE` (تومان به‌ازای هر درهم)
در `data/mock.js` نگهداری می‌شود. قیمت نهایی به‌صورت خودکار محاسبه می‌شود:

```
قیمت نهایی (تومان) = قیمت درهمی × نرخ تبدیل
```

تغییر یک مقدار `EXCHANGE_RATE` قیمت همه خودروها را هم‌زمان به‌روز می‌کند
(معادل تنظیم سراسری «نرخ ارز» در پنل ادمین). لوازم یدکی مستقیم به تومان قیمت می‌خورند.

## وضعیت (این فاز)

✅ صفحه اصلی کامل + دیزاین‌سیستم + هدر/فوتر/مگامنو + کارت محصول (قیمت دوگانه، بج‌های
چندگانه وضعیت، گلو) + اسلایدرها + ریسپانسیو + RTL + سئوی پایه (`lang/dir`, meta, title).

## نقشه راه فازهای بعدی

1. **بک‌اند:** مدل‌های Django (Product, Category, Order, OrderStage, User, Ticket, Article, Review, ExchangeRate) + DRF + JWT + اتصال MongoDB.
2. **صفحات فروشگاه:** لیست محصولات با فیلتر پیشرفته (AJAX)، صفحه محصول تکی (گالری، انتخاب رنگ، ثبت سفارش).
3. **احراز هویت + پنل کاربری:** سفارش‌ها با Stepper ۸ مرحله‌ای، بیعانه (مودال قوانین)، تیکتینگ، درخواست خودروی سفارشی، خودروی دسته دوم.
4. **پنل ادمین:** روت `/admin` با Layout و تم مستقل (روشن/داشبوردی) — مدیریت محصولات، قیمت‌گذاری ارزی، دسته‌ها، مقالات، کاربران، سفارش‌ها (سه بخش مجزا)، تیکت‌ها، نظرات، داشبورد آماری.
5. **سئوی پیشرفته:** Schema.org، sitemap.xml، robots.txt، SSR/prerender در صورت نیاز.

## یادداشت

تصاویر خودروها فعلاً از Unsplash بارگذاری می‌شوند و صرفاً placeholder هستند؛ در فاز
ادمین با تصاویر واقعی هر محصول جایگزین می‌شوند. برخی نام خودرو با تصویر placeholder
هم‌خوان نیست (طبیعی است چون داده نمونه است).
