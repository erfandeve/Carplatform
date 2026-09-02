import { useState } from 'react'
import { NavLink, Outlet, Navigate, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, FolderTree, FileText, ShoppingCart,
  LifeBuoy, Star, Users, Settings, LogOut, ExternalLink, Menu, X, ScrollText,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/admin', label: 'داشبورد', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'محصولات', icon: Package },
  { to: '/admin/categories', label: 'دسته‌بندی‌ها', icon: FolderTree },
  { to: '/admin/articles', label: 'مقالات', icon: FileText },
  { to: '/admin/regulations', label: 'قوانین و مقررات', icon: ScrollText },
  { to: '/admin/orders', label: 'سفارش‌ها', icon: ShoppingCart },
  { to: '/admin/tickets', label: 'تیکت‌ها', icon: LifeBuoy },
  { to: '/admin/reviews', label: 'نظرات', icon: Star },
  { to: '/admin/users', label: 'کاربران', icon: Users },
  { to: '/admin/settings', label: 'تنظیمات', icon: Settings },
]

export default function AdminLayout() {
  const { user, ready, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  if (!ready)
    return <div className="admin-scope grid place-items-center text-admin-muted">در حال بارگذاری…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!user.isAdmin)
    return (
      <div className="admin-scope grid min-h-svh place-items-center">
        <div className="admin-card p-8 text-center">
          <p className="text-admin-ink">شما دسترسی به پنل مدیریت ندارید.</p>
          <Link to="/" className="admin-btn mt-4">بازگشت به سایت</Link>
        </div>
      </div>
    )

  const current = NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)))

  const Sidebar = (
    <nav className="flex h-full flex-col gap-1 p-4">
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-admin-primary text-admin-primary-ink font-black">A</span>
        <div>
          <p className="text-sm font-extrabold text-admin-sidebar-ink">شعبانی خودرو</p>
          <p className="text-[10px] text-admin-sidebar-ink/60">پنل مدیریت</p>
        </div>
      </div>
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-admin-primary text-admin-primary-ink'
                : 'text-admin-sidebar-ink/80 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <n.icon size={18} />
          {n.label}
        </NavLink>
      ))}
      <div className="mt-auto space-y-1 pt-4">
        <a
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-admin-sidebar-ink/70 hover:bg-white/10 hover:text-white"
        >
          <ExternalLink size={18} />
          مشاهده سایت
        </a>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-admin-sidebar-ink/70 hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} />
          خروج
        </button>
      </div>
    </nav>
  )

  return (
    <div className="admin-scope flex" dir="rtl">
      {/* Desktop sidebar */}
      <aside
        className="fixed inset-y-0 right-0 hidden w-64 lg:block"
        style={{ background: 'var(--color-admin-sidebar)' }}
      >
        {Sidebar}
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-modal lg:hidden" style={{ zIndex: 'var(--z-modal)' }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 right-0 w-64" style={{ background: 'var(--color-admin-sidebar)' }}>
            <button onClick={() => setOpen(false)} className="absolute left-3 top-4 text-white/70">
              <X size={20} />
            </button>
            {Sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 lg:mr-64">
        {/* Topbar */}
        <header className="sticky top-0 z-sticky flex h-16 items-center justify-between border-b border-admin-line bg-admin-surface/90 px-5 backdrop-blur" style={{ zIndex: 'var(--z-sticky)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="lg:hidden text-admin-ink">
              <Menu size={22} />
            </button>
            <h1 className="text-lg font-extrabold text-admin-ink">{current?.label || 'پنل مدیریت'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-left">
              <p className="text-sm font-semibold text-admin-ink">{user.fullName || user.phone}</p>
              <p className="text-[11px] text-admin-muted">{roleLabel(user.role)}</p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-admin-primary-weak font-bold text-admin-primary">
              {(user.fullName || 'A')[0]}
            </span>
          </div>
        </header>

        <main className="p-5 md:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

const roleLabel = (r) =>
  ({ admin: 'ادمین کل', support: 'پشتیبان', product_manager: 'مدیر محصول', customer: 'کاربر' }[r] || r)
