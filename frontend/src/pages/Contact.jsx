import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import Seo from '../components/Seo'
import { SITE, breadcrumbJsonLd } from '../lib/seo'

const WHATSAPP = '989000000000' // ← شماره واتس‌اپ واقعی را جایگزین کنید

const CHANNELS = [
  { icon: Phone, label: 'تلفن تماس', value: '۰۷۶ ۹۱۰۰ ۰۰۰۰', href: 'tel:+987691000000', ltr: true },
  { icon: MessageCircle, label: 'واتس‌اپ', value: 'گفتگوی آنلاین', href: `https://wa.me/${WHATSAPP}` },
  { icon: Mail, label: 'ایمیل', value: SITE.email, href: `mailto:${SITE.email}`, ltr: true },
  { icon: MapPin, label: 'آدرس', value: 'کیش، مرکز تجارت جهانی' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    const text = `سلام، من ${form.name} هستم.\nشماره تماس: ${form.phone}\n${form.message}`
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank')
  }

  const jsonLd = [
    breadcrumbJsonLd([
      { name: 'خانه', path: '/' },
      { name: 'تماس با ما', path: '/contact' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: `تماس با ${SITE.nameFa}`,
      url: `${SITE.url}/contact`,
    },
  ]

  return (
    <div className="container-x py-12 md:py-16">
      <Seo
        title="تماس با ما — شعبانی خودرو (Shabanikhodro)"
        description="راه‌های ارتباط با شعبانی خودرو (Shabanikhodro)؛ مشاوره خرید خودرو گذر موقت و منطقه آزاد از طریق تلفن، واتس‌اپ و ایمیل. کارشناسان ما پاسخگوی شما هستند."
        path="/contact"
        jsonLd={jsonLd}
      />

      <nav className="mb-6 flex items-center gap-2 text-xs text-faint" aria-label="مسیر">
        <Link to="/" className="hover:text-sky">خانه</Link>
        <span>/</span>
        <span className="text-muted">تماس با ما</span>
      </nav>

      <header className="max-w-3xl">
        <span className="text-sm font-semibold text-sky">در ارتباط باشیم</span>
        <h1 className="mt-3 text-3xl font-black leading-tight text-ink md:text-5xl">
          تماس با شعبانی خودرو
        </h1>
        <p className="mt-5 text-base leading-8 text-muted">
          برای مشاوره رایگان درباره <strong className="text-ink-2">خرید خودرو گذر موقت</strong>،
          خرید ماشین منطقه آزاد یا ثبت درخواست خودروی دلخواه، از هر یک از راه‌های زیر با
          کارشناسان <strong className="text-ink-2">شعبانی خودرو</strong> در ارتباط باشید.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        {/* channels */}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {CHANNELS.map((c) => {
              const Inner = (
                <>
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-bg-2 text-sky">
                    <c.icon size={20} />
                  </span>
                  <div>
                    <p className="text-xs text-faint">{c.label}</p>
                    <p className="mt-0.5 font-bold text-ink" dir={c.ltr ? 'ltr' : undefined}>{c.value}</p>
                  </div>
                </>
              )
              return c.href ? (
                <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  className="flex items-center gap-3 rounded-card border border-line bg-surface/60 p-4 transition-colors hover:border-neon/60">
                  {Inner}
                </a>
              ) : (
                <div key={c.label} className="flex items-center gap-3 rounded-card border border-line bg-surface/60 p-4">
                  {Inner}
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-3 rounded-card border border-line bg-surface/60 p-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-bg-2 text-sky">
              <Clock size={20} />
            </span>
            <div>
              <p className="text-xs text-faint">ساعات پاسخگویی</p>
              <p className="mt-0.5 font-bold text-ink">شنبه تا پنجشنبه، ۹ تا ۱۸</p>
            </div>
          </div>
        </div>

        {/* form */}
        <form onSubmit={submit} className="rounded-card border border-line bg-surface/60 p-6">
          <h2 className="text-lg font-bold text-ink">ارسال پیام سریع</h2>
          <p className="mt-1 text-sm text-muted">فرم را پر کنید تا گفتگو در واتس‌اپ باز شود.</p>
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-muted">نام و نام خانوادگی</label>
              <input required value={form.name} onChange={(e) => set('name', e.target.value)}
                className="w-full rounded-xl border border-line bg-bg-2 px-4 py-2.5 text-ink outline-none focus:border-neon" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted">شماره تماس</label>
              <input required value={form.phone} onChange={(e) => set('phone', e.target.value)} dir="ltr"
                className="w-full rounded-xl border border-line bg-bg-2 px-4 py-2.5 text-ink outline-none focus:border-neon" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted">پیام شما</label>
              <textarea required rows={4} value={form.message} onChange={(e) => set('message', e.target.value)}
                className="w-full rounded-xl border border-line bg-bg-2 px-4 py-2.5 text-ink outline-none focus:border-neon" />
            </div>
            <button type="submit" className="btn-neon w-full">
              <Send size={17} /> ارسال پیام
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
