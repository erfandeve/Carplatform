import { useEffect, useState } from 'react'
import {
  ChevronRight, ChevronLeft, Phone, Mail, User, Palette, Wallet,
  Settings2, Plus, Trash2, ArrowUp, ArrowDown, Check,
} from 'lucide-react'
import { aget, apost, apatch, adel } from '../lib'
import AdminModal from '../components/AdminModal'
import { faNumber } from '../../lib/format'

const SECTIONS = [
  { key: 'normal', label: 'سفارش‌های عادی' },
  { key: 'custom', label: 'درخواست‌های سفارشی' },
  { key: 'used', label: 'خودروهای دسته دوم' },
]

export default function AdminOrders() {
  const [tab, setTab] = useState('normal')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [manageStages, setManageStages] = useState(false)

  const load = () => {
    setLoading(true)
    aget(`/admin/orders/?order_type=${tab}`).then((d) => setOrders(d.results || d)).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [tab])

  const move = async (o, direction) => {
    await apost(`/admin/orders/${o.id}/move/`, { direction })
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl border border-admin-line bg-admin-surface p-1">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setTab(s.key)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                tab === s.key ? 'bg-admin-primary text-admin-primary-ink' : 'text-admin-muted hover:text-admin-ink'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button onClick={() => setManageStages(true)} className="admin-btn-ghost">
          <Settings2 size={16} /> مدیریت مراحل
        </button>
      </div>

      {loading ? (
        <p className="text-admin-muted">در حال بارگذاری…</p>
      ) : orders.length === 0 ? (
        <div className="admin-card p-12 text-center text-admin-muted">سفارشی در این بخش وجود ندارد.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => <OrderCard key={o.id} order={o} onMove={move} />)}
        </div>
      )}

      {manageStages && <StagesManager orderType={tab} onClose={() => { setManageStages(false); load() }} />}
    </div>
  )
}

function OrderCard({ order, onMove }) {
  const steps = order.steps || []
  const curIdx = steps.findIndex((s) => s.state === 'current')
  return (
    <div className="admin-card p-5">
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        {/* Contact / details panel */}
        <div className="rounded-xl border border-admin-line bg-admin-surface-2 p-4">
          <div className="mb-3 flex items-center gap-2">
            {order.product?.image && <img src={order.product.image} alt="" className="h-12 w-16 rounded-lg object-cover" />}
            <div>
              <p className="font-bold text-admin-ink">{order.product?.name || order.custom?.carType || 'درخواست سفارشی'}</p>
              <p className="text-xs text-admin-muted">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</p>
            </div>
          </div>
          <ul className="space-y-1.5 text-sm">
            <Info icon={User} text={order.contact?.fullName} />
            <Info icon={Phone} text={order.contact?.phone} ltr />
            <Info icon={Mail} text={order.contact?.email} ltr />
            {order.selectedColor && <Info icon={Palette} text={`رنگ: ${order.selectedColor}`} />}
            {order.custom?.color && <Info icon={Palette} text={`رنگ درخواستی: ${order.custom.color}`} />}
            {order.custom?.budget != null && <Info icon={Wallet} text={`بودجه: ${faNumber(order.custom.budget)} تومان`} />}
            {order.deposit?.accepted && (
              <li className="flex items-center gap-2 text-admin-success">
                <Check size={15} /> قوانین بیعانه پذیرفته شده
              </li>
            )}
          </ul>
          {order.custom?.specs && <p className="mt-2 rounded-lg bg-admin-surface p-2 text-xs text-admin-ink-2">{order.custom.specs}</p>}
          {order.note && <p className="mt-2 text-xs text-admin-muted">یادداشت: {order.note}</p>}
        </div>

        {/* Stage control */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-admin-muted">مرحله فعلی: <span className="font-bold text-admin-ink">{order.statusTitle}</span></p>
            <div className="flex gap-2">
              <button onClick={() => onMove(order, -1)} disabled={curIdx <= 0} className="admin-btn-ghost text-xs disabled:opacity-40">
                <ChevronRight size={15} /> مرحله قبل
              </button>
              <button onClick={() => onMove(order, 1)} disabled={curIdx >= steps.length - 1} className="admin-btn text-xs disabled:opacity-40">
                مرحله بعد <ChevronLeft size={15} />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {steps.map((s) => (
              <span
                key={s.id}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium ${
                  s.state === 'done' ? 'bg-admin-success/15 text-admin-success'
                    : s.state === 'current' ? 'bg-admin-primary text-admin-primary-ink'
                    : 'bg-admin-surface-2 text-admin-muted'
                }`}
              >
                {s.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StagesManager({ orderType, onClose }) {
  const [stages, setStages] = useState([])
  const [title, setTitle] = useState('')

  const load = () => aget(`/admin/stages/?order_type=${orderType}`).then((d) => setStages((d.results || d).sort((a, b) => a.position - b.position)))
  useEffect(() => { load() }, [])

  const add = async () => {
    if (!title.trim()) return
    await apost('/admin/stages/', { order_type: orderType, title, position: stages.length })
    setTitle(''); load()
  }
  const rename = async (s) => {
    const t = window.prompt('نام جدید مرحله:', s.title)
    if (t == null) return
    await apatch(`/admin/stages/${s.id}/`, { title: t }); load()
  }
  const del = async (s) => { if (window.confirm('حذف این مرحله؟')) { await adel(`/admin/stages/${s.id}/`); load() } }
  const swap = async (i, j) => {
    if (j < 0 || j >= stages.length) return
    const arr = [...stages];[arr[i], arr[j]] = [arr[j], arr[i]]
    setStages(arr)
    await apost('/admin/stages/reorder/', { ids: arr.map((s) => s.id) })
  }

  return (
    <AdminModal title={`مدیریت مراحل — ${SECTIONS.find((s) => s.key === orderType)?.label}`} onClose={onClose}>
      <div className="space-y-2">
        {stages.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 rounded-xl border border-admin-line px-3 py-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-admin-primary-weak text-xs font-bold text-admin-primary">{faNumber(i + 1)}</span>
            <span className="flex-1 text-sm text-admin-ink">{s.title}</span>
            <button onClick={() => swap(i, i - 1)} className="p-1 text-admin-muted hover:text-admin-ink"><ArrowUp size={15} /></button>
            <button onClick={() => swap(i, i + 1)} className="p-1 text-admin-muted hover:text-admin-ink"><ArrowDown size={15} /></button>
            <button onClick={() => rename(s)} className="p-1 text-admin-ink-2">ویرایش</button>
            <button onClick={() => del(s)} className="p-1 text-admin-danger"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input className="admin-input flex-1" placeholder="نام مرحله جدید" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button onClick={add} className="admin-btn"><Plus size={16} /> افزودن</button>
      </div>
    </AdminModal>
  )
}

const Info = ({ icon: Icon, text, ltr }) =>
  text ? (
    <li className="flex items-center gap-2 text-admin-ink-2" dir={ltr ? 'ltr' : undefined} style={ltr ? { justifyContent: 'flex-end' } : undefined}>
      {!ltr && <Icon size={15} className="text-admin-muted" />}
      {text}
      {ltr && <Icon size={15} className="text-admin-muted" />}
    </li>
  ) : null
