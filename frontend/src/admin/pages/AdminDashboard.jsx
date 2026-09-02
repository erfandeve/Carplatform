import { useEffect, useState } from 'react'
import { Users, ShoppingCart, LifeBuoy, Package, FileText, TrendingUp } from 'lucide-react'
import { aget } from '../lib'
import { faNumber } from '../../lib/format'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    aget('/admin/dashboard/').then(setStats).catch(() => {})
  }, [])

  if (!stats)
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="admin-card h-28 animate-pulse" />
        ))}
      </div>
    )

  const cards = [
    { label: 'کاربران', value: stats.users, icon: Users, tint: 'var(--color-admin-primary)' },
    { label: 'سفارش‌های در جریان', value: stats.ordersInProgress, icon: ShoppingCart, tint: 'var(--color-admin-warning)' },
    { label: 'تیکت‌های باز', value: stats.openTickets, icon: LifeBuoy, tint: 'var(--color-admin-danger)' },
    { label: 'کل محصولات', value: stats.products, icon: Package, tint: 'var(--color-admin-success)' },
  ]

  const maxSold = Math.max(1, ...stats.topProducts.map((p) => p.sold))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="admin-card p-5">
            <div className="flex items-center justify-between">
              <span
                className="grid h-11 w-11 place-items-center rounded-xl"
                style={{ background: `color-mix(in oklch, ${c.tint} 14%, white)`, color: c.tint }}
              >
                <c.icon size={20} />
              </span>
            </div>
            <p className="mt-4 text-3xl font-black text-admin-ink">{faNumber(c.value)}</p>
            <p className="mt-1 text-sm text-admin-muted">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-admin-primary" />
            <h2 className="font-bold text-admin-ink">محبوب‌ترین محصولات</h2>
          </div>
          <div className="space-y-3">
            {stats.topProducts.map((p) => (
              <div key={p.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-admin-ink-2">{p.name}</span>
                  <span className="font-semibold text-admin-ink">{faNumber(p.sold)} فروش</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-admin-surface-2">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(p.sold / maxSold) * 100}%`, background: 'var(--color-admin-primary)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card p-5">
          <h2 className="mb-4 font-bold text-admin-ink">خلاصه</h2>
          <ul className="space-y-3 text-sm">
            <Summary icon={ShoppingCart} label="کل سفارش‌ها" value={faNumber(stats.orders)} />
            <Summary icon={FileText} label="کل مقالات" value={faNumber(stats.articles)} />
            <Summary icon={Package} label="کل محصولات" value={faNumber(stats.products)} />
            <Summary icon={Users} label="کل کاربران" value={faNumber(stats.users)} />
          </ul>
        </div>
      </div>
    </div>
  )
}

function Summary({ icon: Icon, label, value }) {
  return (
    <li className="flex items-center justify-between rounded-xl border border-admin-line bg-admin-surface-2 px-4 py-3">
      <span className="flex items-center gap-2 text-admin-ink-2">
        <Icon size={16} className="text-admin-muted" />
        {label}
      </span>
      <span className="font-bold text-admin-ink">{value}</span>
    </li>
  )
}
