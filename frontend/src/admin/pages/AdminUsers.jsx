import { useEffect, useState } from 'react'
import { Trash2, ShieldCheck } from 'lucide-react'
import { aget, apatch, adel } from '../lib'

const ROLES = [
  ['customer', 'مشتری'], ['admin', 'ادمین کل'],
  ['support', 'پشتیبان'], ['product_manager', 'مدیر محصول'],
]

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [acceptances, setAcceptances] = useState([])

  const load = () => {
    aget('/admin/users/').then((d) => setUsers(d.results || d))
    aget('/admin/orders/deposit_acceptances/').then(setAcceptances).catch(() => {})
  }
  useEffect(() => { load() }, [])

  const acceptedPhones = new Set(acceptances.map((a) => a.phone))

  const setRole = async (u, role) => { await apatch(`/admin/users/${u.id}/`, { role }); load() }
  const remove = async (u) => { if (window.confirm(`حذف کاربر ${u.phone}؟`)) { await adel(`/admin/users/${u.id}/`); load() } }

  return (
    <div className="space-y-6">
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-line bg-admin-surface-2 text-admin-muted">
                <th className="p-3 text-right">کاربر</th>
                <th className="p-3 text-right">موبایل</th>
                <th className="p-3 text-right">نقش</th>
                <th className="p-3 text-right">بیعانه</th>
                <th className="p-3 text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-admin-line last:border-0 hover:bg-admin-surface-2">
                  <td className="p-3 font-semibold text-admin-ink">{u.fullName || '—'}</td>
                  <td className="p-3 text-admin-ink-2" dir="ltr">{u.phone}</td>
                  <td className="p-3">
                    <select value={u.role} onChange={(e) => setRole(u, e.target.value)} className="admin-select py-1 text-xs">
                      {ROLES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                    </select>
                  </td>
                  <td className="p-3">
                    {acceptedPhones.has(u.phone)
                      ? <span className="inline-flex items-center gap-1 text-admin-success"><ShieldCheck size={14} /> پذیرفته</span>
                      : <span className="text-admin-muted">—</span>}
                  </td>
                  <td className="p-3">
                    <button onClick={() => remove(u)} className="rounded-lg border border-admin-line p-2 text-admin-danger hover:bg-admin-surface-2"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {acceptances.length > 0 && (
        <div className="admin-card p-5">
          <h2 className="mb-3 font-bold text-admin-ink">سوابق پذیرش قوانین بیعانه</h2>
          <div className="space-y-2">
            {acceptances.map((a, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-admin-line px-4 py-2 text-sm">
                <span className="text-admin-ink">{a.user} <span className="text-admin-muted" dir="ltr">({a.phone})</span></span>
                <span className="text-admin-muted">{a.acceptedAt ? new Date(a.acceptedAt).toLocaleString('fa-IR') : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
