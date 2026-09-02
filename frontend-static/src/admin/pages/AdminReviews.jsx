import { useEffect, useState } from 'react'
import { Check, Trash2, Star } from 'lucide-react'
import { aget, apost, adel } from '../lib'
import { toFa } from '../../lib/format'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [filter, setFilter] = useState('pending')

  const load = () => {
    const q = filter === 'pending' ? '?approved=false' : filter === 'approved' ? '?approved=true' : ''
    aget(`/admin/reviews/${q}`).then((d) => setReviews(d.results || d))
  }
  useEffect(() => { load() }, [filter])

  const approve = async (r) => { await apost(`/admin/reviews/${r.id}/approve/`, {}); load() }
  const remove = async (r) => { if (window.confirm('حذف این نظر؟')) { await adel(`/admin/reviews/${r.id}/`); load() } }

  return (
    <div className="space-y-5">
      <div className="flex gap-1 rounded-xl border border-admin-line bg-admin-surface p-1 w-fit">
        {[['pending', 'در انتظار تأیید'], ['approved', 'تأییدشده'], ['all', 'همه']].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${filter === k ? 'bg-admin-primary text-admin-primary-ink' : 'text-admin-muted'}`}>{l}</button>
        ))}
      </div>

      <div className="space-y-3">
        {reviews.length === 0 && <div className="admin-card p-10 text-center text-admin-muted">نظری وجود ندارد.</div>}
        {reviews.map((r) => (
          <div key={r.id} className="admin-card flex items-start justify-between gap-4 p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-admin-ink">{r.name}</span>
                <span className="flex items-center gap-0.5 text-admin-warning">
                  <Star size={13} fill="currentColor" /> {toFa(r.rating)}
                </span>
                {!r.approved && <span className="rounded-full bg-admin-warning/15 px-2 py-0.5 text-[10px] text-admin-warning">در انتظار</span>}
              </div>
              <p className="mt-1 text-sm text-admin-ink-2">{r.text}</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              {!r.approved && <button onClick={() => approve(r)} className="admin-btn text-xs"><Check size={14} /> تأیید</button>}
              <button onClick={() => remove(r)} className="admin-btn-ghost admin-btn-danger text-xs"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
