import { useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import { aget, apost } from '../lib'

const STATUS = { open: 'باز', answered: 'پاسخ داده‌شده', closed: 'بسته' }
const cls = {
  open: 'bg-admin-warning/15 text-admin-warning',
  answered: 'bg-admin-success/15 text-admin-success',
  closed: 'bg-admin-surface-2 text-admin-muted',
}

export default function AdminTickets() {
  const [tickets, setTickets] = useState([])
  const [active, setActive] = useState(null)
  const [reply, setReply] = useState('')

  const load = () => aget('/admin/tickets/').then((d) => setTickets(d.results || d))
  useEffect(() => { load() }, [])

  const openTicket = (id) => aget(`/admin/tickets/${id}/`).then(setActive)

  const send = async () => {
    if (!reply.trim()) return
    const u = await apost(`/admin/tickets/${active.id}/reply/`, { body: reply })
    setActive(u); setReply(''); load()
  }
  const setStatus = async (s) => {
    const u = await apost(`/admin/tickets/${active.id}/set_status/`, { status: s })
    setActive(u); load()
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
      <div className="admin-card divide-y divide-admin-line">
        {tickets.length === 0 && <p className="p-6 text-center text-sm text-admin-muted">تیکتی وجود ندارد.</p>}
        {tickets.map((t) => (
          <button
            key={t.id}
            onClick={() => openTicket(t.id)}
            className={`flex w-full items-center justify-between px-4 py-3 text-right hover:bg-admin-surface-2 ${active?.id === t.id ? 'bg-admin-surface-2' : ''}`}
          >
            <div>
              <p className="font-semibold text-admin-ink">{t.subject}</p>
              <p className="text-xs text-admin-muted">{t.userName} · {t.userPhone}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] ${cls[t.status]}`}>{STATUS[t.status]}</span>
          </button>
        ))}
      </div>

      <div className="admin-card p-5">
        {!active ? (
          <p className="py-16 text-center text-admin-muted">یک تیکت را انتخاب کنید.</p>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-admin-ink">{active.subject}</h3>
              <div className="flex gap-1.5">
                {['open', 'answered', 'closed'].map((s) => (
                  <button key={s} onClick={() => setStatus(s)} className={`rounded-lg px-2.5 py-1 text-xs ${active.status === s ? 'bg-admin-primary text-admin-primary-ink' : 'border border-admin-line text-admin-muted'}`}>
                    {STATUS[s]}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-h-80 space-y-3 overflow-y-auto">
              {active.messages.map((m) => (
                <div key={m.id} className={`max-w-[80%] rounded-xl p-3 text-sm ${m.sender === 'admin' ? 'mr-auto bg-admin-primary-weak text-admin-ink' : 'bg-admin-surface-2 text-admin-ink-2'}`}>
                  <p className="mb-1 text-[11px] text-admin-muted">{m.sender === 'admin' ? 'پشتیبانی' : 'کاربر'}</p>
                  {m.body}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="پاسخ…" className="admin-input flex-1" />
              <button onClick={send} className="admin-btn"><Send size={16} /></button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
