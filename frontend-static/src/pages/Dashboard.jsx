import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import {
  Package, PlusCircle, LifeBuoy, LogOut, Wallet, Loader2, Send,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api, asList } from '../lib/api'
import Stepper from '../components/ui/Stepper'
import DepositModal from '../components/dashboard/DepositModal'
import { faNumber } from '../lib/format'

const TABS = [
  { key: 'orders', label: 'سفارش‌ها', icon: Package },
  { key: 'custom', label: 'درخواست خودرو', icon: PlusCircle },
  { key: 'tickets', label: 'تیکت‌ها', icon: LifeBuoy },
]

const tabFromPath = (pathname) => {
  if (pathname.includes('custom-request') || pathname.includes('custom')) return 'custom'
  if (pathname.includes('tickets')) return 'tickets'
  return 'orders'
}

export default function Dashboard() {
  const { user, ready, logout } = useAuth()
  const location = useLocation()
  const [tab, setTab] = useState(() => tabFromPath(location.pathname))

  // Open the matching tab when arriving via a deep link (e.g. «خودروی سفارشی»).
  useEffect(() => {
    setTab(tabFromPath(location.pathname))
  }, [location.pathname])

  if (ready && !user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!ready) return <div className="container-x py-24 text-center text-muted">در حال بارگذاری…</div>

  return (
    <div className="container-x py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink">پنل کاربری</h1>
          <p className="mt-1 text-sm text-muted">
            خوش آمدید، {user.fullName || user.phone}
          </p>
        </div>
        <button onClick={logout} className="btn-ghost">
          <LogOut size={16} />
          خروج
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === t.key
                ? 'border-neon text-ink'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'orders' && <OrdersTab />}
      {tab === 'custom' && <CustomTab onDone={() => setTab('orders')} />}
      {tab === 'tickets' && <TicketsTab />}
    </div>
  )
}

// ---------- Orders ----------
function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [deposit, setDeposit] = useState(null)

  const load = () =>
    api.get('/orders/', { auth: true }).then((d) => setOrders(asList(d))).finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  if (loading) return <p className="text-muted">در حال بارگذاری سفارش‌ها…</p>
  if (!orders.length)
    return (
      <div className="rounded-card border border-line bg-surface/50 py-16 text-center text-muted">
        هنوز سفارشی ثبت نکرده‌اید.
      </div>
    )

  return (
    <div className="space-y-6">
      {orders.map((o) => (
        <div key={o.id} className="rounded-card border border-line bg-surface/50 p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {o.product?.image && (
                <img src={o.product.image} alt="" className="h-16 w-20 rounded-lg object-cover" />
              )}
              <div>
                <h3 className="font-bold text-ink">
                  {o.product?.name || o.custom?.carType || 'درخواست سفارشی'}
                </h3>
                <p className="mt-1 text-xs text-muted">
                  {labelType(o.orderType)}
                  {o.selectedColor && ` · رنگ: ${o.selectedColor}`}
                </p>
                <p className="mt-0.5 text-xs text-faint">
                  وضعیت فعلی: <span className="text-sky">{o.statusTitle}</span>
                </p>
              </div>
            </div>
            {!o.deposit?.paid && (
              <button onClick={() => setDeposit(o)} className="btn-neon text-sm">
                <Wallet size={16} />
                {o.deposit?.accepted ? 'مشاهده اطلاعات واریز' : 'واریز بیعانه'}
              </button>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-line bg-bg-2/40 p-4">
            <Stepper steps={o.steps} />
          </div>
        </div>
      ))}

      {deposit && (
        <DepositModal
          order={deposit}
          onClose={() => setDeposit(null)}
          onAccepted={load}
        />
      )}
    </div>
  )
}

// ---------- Custom request ----------
function CustomTab({ onDone }) {
  const [form, setForm] = useState({
    custom_car_type: '', custom_specs: '', custom_color: '', custom_budget_toman: '',
  })
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post(
        '/orders/',
        {
          order_type: 'custom',
          ...form,
          custom_budget_toman: form.custom_budget_toman || null,
        },
        { auth: true },
      )
      onDone()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-card border border-line bg-surface/50 p-6">
      <p className="text-sm text-muted">
        خودروی موردنظرتان را پیدا نکردید؟ مشخصات دلخواه را وارد کنید تا کارشناسان ما آن را تأمین کنند.
      </p>
      <F label="نوع / مدل خودرو" value={form.custom_car_type} onChange={set('custom_car_type')} required />
      <F label="رنگ موردنظر" value={form.custom_color} onChange={set('custom_color')} />
      <F label="بودجه پیشنهادی (تومان)" value={form.custom_budget_toman} onChange={set('custom_budget_toman')} type="number" dir="ltr" />
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-muted">توضیحات و مشخصات</span>
        <textarea
          value={form.custom_specs}
          onChange={set('custom_specs')}
          rows={4}
          className="w-full rounded-xl border border-line bg-bg-2 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-neon"
        />
      </label>
      <button type="submit" disabled={saving} className="btn-neon">
        {saving ? <Loader2 size={18} className="animate-spin" /> : 'ثبت درخواست'}
      </button>
    </form>
  )
}

// ---------- Tickets ----------
function TicketsTab() {
  const [tickets, setTickets] = useState([])
  const [active, setActive] = useState(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [reply, setReply] = useState('')

  const load = () => api.get('/tickets/', { auth: true }).then((d) => setTickets(asList(d)))
  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    if (!subject || !body) return
    await api.post('/tickets/', { subject, body }, { auth: true })
    setSubject(''); setBody(''); load()
  }

  const sendReply = async () => {
    if (!reply.trim()) return
    const updated = await api.post(`/tickets/${active.id}/reply/`, { body: reply }, { auth: true })
    setActive(updated); setReply(''); load()
  }

  if (active) {
    return (
      <div className="max-w-2xl">
        <button onClick={() => setActive(null)} className="mb-4 text-sm text-sky">→ بازگشت به تیکت‌ها</button>
        <div className="rounded-card border border-line bg-surface/50 p-5">
          <h3 className="font-bold text-ink">{active.subject}</h3>
          <div className="mt-4 space-y-3">
            {active.messages.map((m) => (
              <div key={m.id} className={`max-w-[80%] rounded-xl p-3 text-sm ${
                m.sender === 'admin' ? 'ml-auto bg-neon/10 text-ink' : 'bg-bg-2 text-ink-2'
              }`}>
                <p className="mb-1 text-[11px] text-faint">{m.sender === 'admin' ? 'پشتیبانی' : 'شما'}</p>
                {m.body}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="پاسخ شما…"
              className="flex-1 rounded-xl border border-line bg-bg-2 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-neon"
            />
            <button onClick={sendReply} className="btn-neon"><Send size={16} /></button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        {tickets.length === 0 && <p className="text-muted">تیکتی ندارید.</p>}
        {tickets.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t)}
            className="flex w-full items-center justify-between rounded-card border border-line bg-surface/50 p-4 text-right transition-colors hover:border-neon"
          >
            <span className="font-semibold text-ink">{t.subject}</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] ${statusClass(t.status)}`}>
              {statusLabel(t.status)}
            </span>
          </button>
        ))}
      </div>
      <form onSubmit={create} className="h-fit space-y-3 rounded-card border border-line bg-surface/50 p-5">
        <h3 className="font-bold text-ink">تیکت جدید</h3>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="موضوع"
          className="w-full rounded-xl border border-line bg-bg-2 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-neon"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="پیام شما…"
          className="w-full rounded-xl border border-line bg-bg-2 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-neon"
        />
        <button type="submit" className="btn-neon w-full">ارسال تیکت</button>
      </form>
    </div>
  )
}

function F({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted">{label}</span>
      <input {...props} className="w-full rounded-xl border border-line bg-bg-2 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-neon" />
    </label>
  )
}

const labelType = (t) =>
  ({ normal: 'سفارش محصول', custom: 'درخواست سفارشی', used: 'خودروی دسته دوم' }[t] || t)
const statusLabel = (s) => ({ open: 'باز', answered: 'پاسخ داده‌شده', closed: 'بسته' }[s] || s)
const statusClass = (s) =>
  ({
    open: 'bg-gozar-temp/15 text-gozar-temp',
    answered: 'bg-free-perm/15 text-free-perm',
    closed: 'bg-faint/15 text-faint',
  }[s] || '')
