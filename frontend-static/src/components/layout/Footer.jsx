import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'
import Logo from './Logo'

// lucide removed brand glyphs — inline the three we need.
const Instagram = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)
const Telegram = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M21.9 4.3 18.6 20c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.6 13.2l-4.7-1.5c-1-.3-1-1 .2-1.5L20.6 3c.9-.3 1.6.2 1.3 1.3Z" />
  </svg>
)
const WhatsApp = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2a10 10 0 0 0-8.7 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7s-3.7-3.2-3.8-3.4c-.1-.2-.9-1.2-.9-2.3s.6-1.6.8-1.8c.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .6.5l.7 1.8c.1.2.1.4 0 .5l-.4.5c-.1.2-.3.3-.1.6.1.2.6 1 1.3 1.6.9.8 1.6 1 1.8 1.1.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.7.8c.2.1.4.2.4.3.1.1.1.6-.1 1.2Z" />
  </svg>
)

const COLS = [
  {
    title: 'دسترسی سریع',
    links: [
      { to: '/products', label: 'همه محصولات' },
      { to: '/products?type=used', label: 'خودروهای دسته دوم' },
      { to: '/products?cat=parts', label: 'لوازم یدکی' },
      { to: '/articles', label: 'مقالات' },
    ],
  },
  {
    title: 'شرکت',
    links: [
      { to: '/about', label: 'درباره ما' },
      { to: '/contact', label: 'تماس با ما' },
      { to: '/dashboard', label: 'پنل کاربری' },
      { to: '/faq', label: 'سوالات متداول' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-bg-2/60">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-7 text-muted">
            مرجع تخصصی خرید ماشین وارداتی از کشورهای حوزه خلیج فارس؛ خرید ماشین
            گذر و منطقه آزاد با قیمت شفاف و فرآیند مطمئن.
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Telegram, WhatsApp].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted transition-colors hover:border-neon hover:text-neon-bright"
                aria-label="شبکه اجتماعی"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-sm font-bold text-ink">{col.title}</h3>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted transition-colors hover:text-sky"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-4 text-sm font-bold text-ink">اطلاعات تماس</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex items-center gap-2.5">
              <MapPin size={16} className="text-sky" />
              استان گلستان
            </li>
            <li className="flex items-center gap-2.5" dir="ltr">
              <Phone size={16} className="text-sky" />
              <span>۰۷۶ ۹۱۰۰ ۰۰۰۰</span>
            </li>
            <li className="flex items-center gap-2.5" dir="ltr">
              <Mail size={16} className="text-sky" />
              <span>info@autoshabani.com</span>
            </li>
          </ul>
          <div className="mt-5 flex gap-2">
            <span className="grid h-14 w-14 place-items-center rounded-xl border border-line bg-surface text-[10px] text-faint">
              نماد
            </span>
            <span className="grid h-14 w-14 place-items-center rounded-xl border border-line bg-surface text-[10px] text-faint">
              اینماد
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-faint sm:flex-row">
          <p>© ۱۴۰۳ شعبانی خودرو — تمامی حقوق محفوظ است.</p>
          <p>طراحی و توسعه با تمرکز بر تجربه کاربری</p>
        </div>
      </div>
    </footer>
  )
}
