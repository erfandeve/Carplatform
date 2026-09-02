import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search,
  User,
  LayoutGrid,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'
import Logo from './Logo'
import MegaMenu from './MegaMenu'
import { useSettings } from '../../context/SettingsContext'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/', label: 'صفحه اصلی', end: true },
  { to: '/products', label: 'محصولات' },
  { mega: true, label: 'دسته‌بندی‌ها' },
  { to: '/products?type=used', label: 'خودروهای دسته دوم' },
  { to: '/dashboard/custom-request', label: 'خودروی سفارشی' },
  { to: '/about', label: 'درباره ما' },
  { to: '/contact', label: 'تماس با ما' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const closeTimer = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openMega = () => {
    clearTimeout(closeTimer.current)
    setMegaOpen(true)
  }
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120)
  }

  const linkClass = ({ isActive }) =>
    `relative px-1 py-2 text-sm font-semibold transition-colors ${
      isActive ? 'text-ink' : 'text-muted hover:text-ink'
    }`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-sticky transition-all duration-500 ${
        scrolled ? 'glass' : 'bg-transparent'
      }`}
      style={{ zIndex: 'var(--z-sticky)' }}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 md:h-[72px]">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) =>
            item.mega ? (
              <div
                key="mega"
                className="relative"
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <button
                  className="flex items-center gap-1 px-1 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
                  aria-expanded={megaOpen}
                >
                  {item.label}
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-300 ${
                      megaOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            ) : (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={`absolute inset-x-1 -bottom-0.5 h-0.5 origin-center rounded-full bg-neon transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                      style={{ boxShadow: '0 0 8px var(--color-neon)' }}
                    />
                  </>
                )}
              </NavLink>
            )
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <IconBtn label="جستجو">
            <Search size={18} />
          </IconBtn>
          <Link
            to={user ? '/dashboard' : '/login'}
            className="hidden items-center gap-2 rounded-xl border border-line bg-surface/60 px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:border-neon sm:flex"
          >
            <User size={16} />
            {user ? user.fullName || user.phone : 'ورود / ثبت‌نام'}
          </Link>
          <Link
            to="/dashboard"
            className="hidden md:inline-flex"
            aria-label="پنل کاربری"
          >
            <IconBtn label="پنل کاربری" as="span">
              <LayoutGrid size={18} />
            </IconBtn>
          </Link>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink lg:hidden"
            onClick={() => setDrawer(true)}
            aria-label="منو"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mega panel */}
      <AnimatePresence>
        {megaOpen && (
          <div
            className="absolute inset-x-0 top-full"
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
          >
            <div className="container-x pt-1">
              <MegaMenu onNavigate={() => setMegaOpen(false)} />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <MobileDrawer onClose={() => setDrawer(false)} user={user} />
        )}
      </AnimatePresence>
    </header>
  )
}

function IconBtn({ children, label, as = 'button' }) {
  const Comp = as
  return (
    <Comp
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted transition-colors hover:border-neon hover:text-ink"
    >
      {children}
    </Comp>
  )
}

function MobileDrawer({ onClose, user }) {
  const { categories } = useSettings()
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-bg/70 backdrop-blur-sm lg:hidden"
        style={{ zIndex: 'var(--z-backdrop)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        className="fixed inset-y-0 right-0 w-[86%] max-w-sm overflow-y-auto border-l border-line bg-bg-2 p-5 lg:hidden"
        style={{ zIndex: 'var(--z-modal)' }}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-6 flex items-center justify-between">
          <Logo />
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink"
            aria-label="بستن"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1">
          {NAV.filter((n) => !n.mega).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="block rounded-xl px-3 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="my-5 h-px bg-line" />

        <p className="mb-2 px-3 text-xs font-bold text-faint">دسته‌بندی‌ها</p>
        <nav className="space-y-1">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?cat=${cat.slug}`}
              onClick={onClose}
              className="block rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              {cat.title}
            </Link>
          ))}
        </nav>

        <div className="mt-6 grid gap-2">
          {user ? (
            <Link to="/dashboard" onClick={onClose} className="btn-neon w-full">
              پنل کاربری
            </Link>
          ) : (
            <Link to="/login" onClick={onClose} className="btn-neon w-full">
              ورود / ثبت‌نام
            </Link>
          )}
        </div>
      </motion.aside>
    </>
  )
}
