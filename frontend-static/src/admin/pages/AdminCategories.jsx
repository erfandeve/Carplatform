import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, CornerDownLeft } from 'lucide-react'
import { apost, apatch, adel } from '../lib'
import AdminModal from '../components/AdminModal'
import { api, asList } from '../../lib/api'

const blank = { title: '', slug: '', parent: '', icon: '', image: '', position: 0 }

export default function AdminCategories() {
  const [cats, setCats] = useState([])
  const [editing, setEditing] = useState(null)

  const load = () => api.get('/categories/flat/').then((d) => setCats(asList(d)))
  useEffect(() => { load() }, [])

  const remove = async (c) => {
    if (!window.confirm(`حذف «${c.title}» و همه زیردسته‌هایش؟`)) return
    await adel(`/categories/${c.slug}/`)
    load()
  }

  // Build ordered tree rows with depth for indentation.
  const roots = cats.filter((c) => !c.parent)
  const rows = []
  const walk = (node, depth) => {
    rows.push({ ...node, depth })
    cats.filter((c) => c.parent === node.slug).forEach((ch) => walk(ch, depth + 1))
  }
  roots.forEach((r) => walk(r, 0))

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => setEditing({ ...blank })} className="admin-btn"><Plus size={16} /> دسته جدید</button>
      </div>
      <div className="admin-card divide-y divide-admin-line">
        {rows.map((c) => (
          <div key={c.slug} className="flex items-center justify-between px-4 py-3 hover:bg-admin-surface-2">
            <div className="flex items-center gap-2" style={{ paddingRight: c.depth * 24 }}>
              {c.depth > 0 && <CornerDownLeft size={14} className="text-admin-muted" />}
              <span className={`text-sm ${c.depth === 0 ? 'font-bold text-admin-ink' : 'text-admin-ink-2'}`}>{c.title}</span>
              <span className="text-xs text-admin-muted" dir="ltr">/{c.slug}</span>
              {c.icon && <span className="rounded bg-admin-surface-2 px-1.5 text-[10px] text-admin-muted">{c.icon}</span>}
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setEditing({ ...c, parent: c.parent || '' })} className="rounded-lg border border-admin-line p-2 text-admin-ink-2 hover:bg-admin-surface-2"><Pencil size={14} /></button>
              <button onClick={() => remove(c)} className="rounded-lg border border-admin-line p-2 text-admin-danger hover:bg-admin-surface-2"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <CategoryForm data={editing} cats={cats} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load() }} />
      )}
    </div>
  )
}

function CategoryForm({ data, cats, onClose, onSaved }) {
  const [form, setForm] = useState(data)
  const [err, setErr] = useState('')
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const isEdit = !!data.id

  const save = async () => {
    setErr('')
    const payload = { ...form, parent: form.parent || null }
    try {
      if (isEdit) await apatch(`/categories/${data.slug}/`, payload)
      else await apost('/categories/', payload)
      onSaved()
    } catch (e) { setErr(e.data ? JSON.stringify(e.data) : 'خطا') }
  }

  return (
    <AdminModal title={isEdit ? 'ویرایش دسته' : 'دسته جدید'} onClose={onClose}>
      <div className="space-y-4">
        <div><span className="admin-label">عنوان</span><input className="admin-input" value={form.title} onChange={(e) => set('title', e.target.value)} /></div>
        <div><span className="admin-label">اسلاگ</span><input className="admin-input" dir="ltr" value={form.slug} onChange={(e) => set('slug', e.target.value)} /></div>
        <div>
          <span className="admin-label">دسته والد</span>
          <select className="admin-select" value={form.parent} onChange={(e) => set('parent', e.target.value)}>
            <option value="">— دسته اصلی —</option>
            {cats.filter((c) => c.slug !== form.slug).map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><span className="admin-label">آیکون (نام lucide)</span><input className="admin-input" dir="ltr" placeholder="car / wrench …" value={form.icon} onChange={(e) => set('icon', e.target.value)} /></div>
          <div><span className="admin-label">ترتیب</span><input className="admin-input" type="number" dir="ltr" value={form.position} onChange={(e) => set('position', +e.target.value || 0)} /></div>
        </div>
        <div><span className="admin-label">تصویر (URL)</span><input className="admin-input" dir="ltr" value={form.image} onChange={(e) => set('image', e.target.value)} /></div>
        {err && <p className="rounded-lg bg-admin-danger/10 px-3 py-2 text-xs text-admin-danger" dir="ltr">{err}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="admin-btn-ghost">انصراف</button>
          <button onClick={save} className="admin-btn">ذخیره</button>
        </div>
      </div>
    </AdminModal>
  )
}
