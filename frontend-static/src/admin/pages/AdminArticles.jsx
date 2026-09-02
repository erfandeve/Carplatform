import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { apost, apatch, adel } from '../lib'
import AdminModal from '../components/AdminModal'
import { api, asList } from '../../lib/api'

const blank = {
  title: '', slug: '', excerpt: '', content: '', image: '', category: '',
  read_min: 5, meta_title: '', meta_description: '', keywords: '', published: true,
}

export default function AdminArticles() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)

  const load = () => api.get('/articles/').then((d) => setItems(asList(d)))
  useEffect(() => { load() }, [])

  const remove = async (a) => {
    if (!window.confirm(`حذف «${a.title}»؟`)) return
    await adel(`/articles/${a.slug}/`); load()
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => setEditing({ ...blank })} className="admin-btn"><Plus size={16} /> مقاله جدید</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <div key={a.id} className="admin-card overflow-hidden">
            {a.image && <img src={a.image} alt="" className="h-32 w-full object-cover" />}
            <div className="p-4">
              <span className="text-[11px] text-admin-primary">{a.category}</span>
              <h3 className="mt-1 font-bold text-admin-ink">{a.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-admin-muted">{a.excerpt}</p>
              <div className="mt-3 flex gap-1.5">
                <button onClick={() => setEditing({ ...blank, ...a, read_min: a.readMin })} className="admin-btn-ghost text-xs"><Pencil size={13} /> ویرایش</button>
                <button onClick={() => remove(a)} className="admin-btn-ghost admin-btn-danger text-xs"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && <ArticleForm data={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load() }} />}
    </div>
  )
}

function ArticleForm({ data, onClose, onSaved }) {
  const [form, setForm] = useState(data)
  const [err, setErr] = useState('')
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const isEdit = !!data.id

  const save = async () => {
    setErr('')
    try {
      if (isEdit) await apatch(`/articles/${data.slug}/`, form)
      else await apost('/articles/', form)
      onSaved()
    } catch (e) { setErr(e.data ? JSON.stringify(e.data) : 'خطا') }
  }

  return (
    <AdminModal title={isEdit ? 'ویرایش مقاله' : 'مقاله جدید'} onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <F label="عنوان" full><input className="admin-input" value={form.title} onChange={(e) => set('title', e.target.value)} /></F>
        <F label="اسلاگ"><input className="admin-input" dir="ltr" value={form.slug} onChange={(e) => set('slug', e.target.value)} /></F>
        <F label="دسته"><input className="admin-input" value={form.category} onChange={(e) => set('category', e.target.value)} /></F>
        <F label="تصویر شاخص (URL)"><input className="admin-input" dir="ltr" value={form.image} onChange={(e) => set('image', e.target.value)} /></F>
        <F label="زمان مطالعه (دقیقه)"><input className="admin-input" type="number" dir="ltr" value={form.read_min} onChange={(e) => set('read_min', +e.target.value || 1)} /></F>
        <F label="خلاصه" full><textarea rows={2} className="admin-textarea" value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} /></F>
        <F label="محتوا (HTML)" full><textarea rows={6} className="admin-textarea" value={form.content} onChange={(e) => set('content', e.target.value)} /></F>
        <F label="متا تایتل"><input className="admin-input" value={form.meta_title} onChange={(e) => set('meta_title', e.target.value)} /></F>
        <F label="کلمات کلیدی"><input className="admin-input" value={form.keywords} onChange={(e) => set('keywords', e.target.value)} /></F>
        <F label="متا دیسکریپشن" full><textarea rows={2} className="admin-textarea" value={form.meta_description} onChange={(e) => set('meta_description', e.target.value)} /></F>
        <label className="flex items-center gap-2 text-sm text-admin-ink"><input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} /> منتشر شود</label>
      </div>
      {err && <p className="mt-3 rounded-lg bg-admin-danger/10 px-3 py-2 text-xs text-admin-danger" dir="ltr">{err}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="admin-btn-ghost">انصراف</button>
        <button onClick={save} className="admin-btn">ذخیره</button>
      </div>
    </AdminModal>
  )
}

const F = ({ label, children, full }) => (
  <label className={`block ${full ? 'sm:col-span-2' : ''}`}><span className="admin-label">{label}</span>{children}</label>
)
