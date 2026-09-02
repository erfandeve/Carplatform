import { Link } from 'react-router-dom'
import {
  ShieldCheck, Globe2, FileCheck2, Headset, Award, Users, ArrowLeft,
} from 'lucide-react'
import Seo from '../components/Seo'
import { SITE, breadcrumbJsonLd } from '../lib/seo'

const STATS = [
  { value: '۲٬۴۰۰+', label: 'خودروی تحویل‌شده' },
  { value: '۱۲', label: 'سال تجربه واردات' },
  { value: '۹۸٪', label: 'رضایت مشتریان' },
  { value: '۴', label: 'کشور مبدأ واردات' },
]

const VALUES = [
  { icon: Globe2, title: 'واردات مستقیم', text: 'تأمین خودرو از بازارهای معتبر امارات، عمان، قطر و کویت بدون واسطه‌های اضافی.' },
  { icon: FileCheck2, title: 'شفافیت کامل', text: 'ارائه اسناد گمرکی، وضعیت گذر موقت یا منطقه آزاد و مدارک اصالت برای هر خودرو.' },
  { icon: ShieldCheck, title: 'ضمانت سلامت', text: 'کارشناسی فنی و تضمین سلامت بدنه و موتور برای همه خودروها.' },
  { icon: Headset, title: 'پشتیبانی مرحله‌به‌مرحله', text: 'پیگیری سفارش در هشت مرحله شفاف و پاسخگویی از طریق سیستم تیکتینگ.' },
]

export default function About() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: 'خانه', path: '/' },
      { name: 'درباره ما', path: '/about' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: `درباره ${SITE.nameFa}`,
      url: `${SITE.url}/about`,
      description:
        'درباره شعبانی خودرو؛ مرجع تخصصی خرید خودرو گذر موقت و منطقه آزاد و واردات خودروهای لوکس.',
    },
  ]

  return (
    <div className="container-x py-12 md:py-16">
      <Seo
        title="درباره ما — شعبانی خودرو (Shabanikhodro)"
        description="درباره شعبانی خودرو (Shabanikhodro)؛ مرجع تخصصی خرید خودرو گذر موقت و منطقه آزاد با بیش از یک دهه تجربه واردات مستقیم خودروهای لوکس از حوزه خلیج فارس."
        path="/about"
        jsonLd={jsonLd}
      />

      {/* breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-faint" aria-label="مسیر">
        <Link to="/" className="hover:text-sky">خانه</Link>
        <span>/</span>
        <span className="text-muted">درباره ما</span>
      </nav>

      <header className="max-w-3xl">
        <span className="text-sm font-semibold text-sky">درباره شعبانی خودرو</span>
        <h1 className="mt-3 text-3xl font-black leading-tight text-ink md:text-5xl">
          شعبانی خودرو؛ مرجع تخصصی خرید خودرو گذر موقت و منطقه آزاد
        </h1>
        <p className="mt-5 text-base leading-8 text-muted">
          <strong className="text-ink-2">شعبانی خودرو (Shabanikhodro)</strong> با بیش از یک دهه
          تجربه در زمینه واردات و فروش خودروهای وارداتی فعالیت می‌کند. تخصص اصلی ما
          <strong className="text-ink-2"> خرید خودرو گذر موقت</strong> و
          <strong className="text-ink-2"> خرید ماشین منطقه آزاد</strong> است؛ خودروهایی که
          مستقیماً از کشورهای حوزه خلیج فارس تأمین می‌شوند و با قیمت‌گذاری شفاف درهمی و
          تومانی به دست مشتری می‌رسند.
        </p>
      </header>

      {/* stats */}
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-card border border-line bg-surface/60 p-5 text-center">
            <div className="text-3xl font-black text-ink">{s.value}</div>
            <div className="mt-1 text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* story */}
      <div className="prose-fa mt-12 max-w-3xl">
        <h2>داستان ما</h2>
        <p>
          مجموعه شعبانی خودرو با هدف ساده و مطمئن‌کردن فرآیند خرید خودروی وارداتی شکل گرفت.
          در سال‌هایی که خرید ماشین گذر موقت و خرید خودرو منطقه آزاد برای بسیاری از خریداران
          پیچیده و پرریسک بود، ما تصمیم گرفتیم مسیری شفاف بسازیم: از انتخاب خودرو در کشور مبدأ
          تا ترخیص، انتقال سند و تحویل نهایی، همه مراحل به‌صورت مرحله‌به‌مرحله و قابل پیگیری.
        </p>
        <h2>چرا خرید خودرو گذر موقت و منطقه آزاد؟</h2>
        <p>
          خودروهای گذر موقت و منطقه آزاد به دلیل ساختار گمرکی خاص خود، معمولاً قیمت مناسب‌تری
          نسبت به خودروهای پلاک ملی دارند و امکان دسترسی به مدل‌های روز دنیا را فراهم می‌کنند.
          کارشناسان شعبانی خودرو در تمام مراحل، تفاوت‌ها و شرایط قانونی هر وضعیت را برای شما
          شفاف می‌کنند تا با آگاهی کامل تصمیم بگیرید. برای آشنایی بیشتر می‌توانید مقالات
          <Link to="/articles/kharid-mashin-mantaghe-azad"> خرید ماشین منطقه آزاد</Link> و
          <Link to="/articles/kharid-mashin-gozar-movaghat"> خرید ماشین گذر موقت</Link> را مطالعه کنید.
        </p>
        <h2>تعهد ما به مشتری</h2>
        <p>
          اصالت اسناد، سلامت فنی خودرو و قیمت‌گذاری منصفانه سه اصل ثابت ما هستند. هر خودرو پیش از
          عرضه کارشناسی می‌شود و وضعیت گمرکی آن (منطقه آزاد دائم، منطقه آزاد موقت، گذر دائم یا
          گذر موقت) به‌صورت شفاف اعلام می‌گردد.
        </p>
      </div>

      {/* values */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((v) => (
          <div key={v.title} className="group rounded-card border border-line bg-surface/60 p-5 transition-colors hover:border-neon/60">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-bg-2 text-sky transition-colors group-hover:border-neon group-hover:text-neon-bright">
              <v.icon size={20} />
            </span>
            <h3 className="mt-4 text-base font-bold text-ink">{v.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{v.text}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 flex flex-wrap items-center gap-3 rounded-card border border-line bg-surface/50 p-6">
        <Award size={22} className="text-neon-bright" />
        <p className="flex-1 text-sm text-ink-2">
          برای مشاهده خودروهای موجود یا ثبت درخواست خودروی دلخواه با کارشناسان ما در ارتباط باشید.
        </p>
        <Link to="/products" className="btn-neon">
          مشاهده محصولات <ArrowLeft size={17} />
        </Link>
        <Link to="/contact" className="btn-ghost">
          <Users size={17} /> تماس با ما
        </Link>
      </div>
    </div>
  )
}
