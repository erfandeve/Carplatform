import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { apost, apatch, adel } from '../lib'
import AdminModal from '../components/AdminModal'
import { api } from '../../lib/api'

const blank = {
  slug: '', title: '', subtitle: '', image: '', content: '',
  position: 0, published: true,
}

export default function AdminRegulations() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)

  const load = () => api.get('/regulations/').then((d) => setItems(d || []))
  useEffect(() => { load() }, [])

  const remove = async (r) => {
    if (!window.confirm(`حذف «${r.title}»؟`)) return
    await adel(`/regulations/${r.slug}/`); load()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-admin-muted">
          متن این صفحات در بنر بالای صفحه اصلی و صفحه قوانین نمایش داده می‌شود.
        </p>
        <button onClick={() => setEditing({ ...blank })} className="admin-btn">
          <Plus size={16} /> قانون جدید
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((r) => (
          <div key={r.id} className="admin-card p-4">
            <div className="flex items-start gap-4">
              {r.image && (
                <div className="w-28 shrink-0 rounded-lg border border-admin-line bg-white p-1.5">
                  <img src={r.image} alt="" className="w-full object-contain" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-admin-ink">{r.title}</h3>
                <p className="mt-1 text-xs text-admin-muted">{r.subtitle}</p>
                <p className="mt-1 text-[11px] text-admin-muted" dir="ltr">/{r.slug}</p>
                {!r.published && (
                  <span className="mt-1 inline-block rounded bg-admin-warning/15 px-2 py-0.5 text-[10px] text-admin-warning">
                    منتشر نشده
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3 flex gap-1.5">
              <button onClick={() => setEditing({ ...r })} className="admin-btn-ghost text-xs">
                <Pencil size={13} /> ویرایش متن
              </button>
              <button onClick={() => remove(r)} className="admin-btn-ghost admin-btn-danger text-xs">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <RegulationForm
          data={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load() }}
        />
      )}
    </div>
  )
}

function RegulationForm({ data, onClose, onSaved }) {
  const [form, setForm] = useState(data)
  const [err, setErr] = useState('')
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const isEdit = !!data.id

  const save = async () => {
    setErr('')
    try {
      if (isEdit) await apatch(`/regulations/${data.slug}/`, form)
      else await apost('/regulations/', form)
      onSaved()
    } catch (e) {
      setErr(e.data ? JSON.stringify(e.data) : 'خطا در ذخیره')
    }
  }

  return (
    <AdminModal title={isEdit ? 'ویرایش قوانین' : 'قانون جدید'} onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <L label="عنوان" full>
          <input className="admin-input" value={form.title} onChange={(e) => set('title', e.target.value)} />
        </L>
        <L label="اسلاگ (آدرس صفحه)">
          <input className="admin-input" dir="ltr" value={form.slug} onChange={(e) => set('slug', e.target.value)} />
        </L>
        <L label="ترتیب نمایش">
          <input className="admin-input" type="number" dir="ltr" value={form.position} onChange={(e) => set('position', +e.target.value || 0)} />
        </L>
        <L label="تصویر (آدرس)" full>
          <input className="admin-input" dir="ltr" value={form.image} onChange={(e) => set('image', e.target.value)} />
        </L>
        <L label="زیرعنوان (متن کوتاه بنر)" full>
          <input className="admin-input" value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
        </L>
        <L label="متن کامل قوانین (HTML — از تگ‌های h2، p، ul و li استفاده کنید)" full>
          <textarea
            rows={16}
            className="admin-textarea font-mono text-xs leading-6"
            value={form.content}
            onChange={(e) => set('content', e.target.value)}
          />
        </L>
        <label className="flex items-center gap-2 text-sm text-admin-ink">
          <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} />
          منتشر شود
        </label>
      </div>

      {err && <p className="mt-3 rounded-lg bg-admin-danger/10 px-3 py-2 text-xs text-admin-danger" dir="ltr">{err}</p>}

      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="admin-btn-ghost">انصراف</button>
        <button onClick={save} className="admin-btn">ذخیره</button>
      </div>
    </AdminModal>
  )
}

const L = ({ label, children, full }) => (
  <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
    <span className="admin-label">{label}</span>
    {children}
  </label>
)
