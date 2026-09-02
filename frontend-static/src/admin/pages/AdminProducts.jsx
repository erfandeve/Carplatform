import { useEffect, useRef, useState } from 'react'
import { Plus, Pencil, Trash2, Search, Upload, Loader2, X } from 'lucide-react'
import { aget, apost, apatch, adel, aupload } from '../lib'
import AdminModal from '../components/AdminModal'
import { api, asList } from '../../lib/api'
import { STATUS } from '../../data/mock'
import { faNumber, toFa } from '../../lib/format'

const KINDS = [
  { key: 'car', label: 'خودروی صفر/نو' },
  { key: 'used', label: 'خودروی دسته دوم' },
  { key: 'part', label: 'لوازم یدکی و سایر' },
]

const blank = {
  kind: 'car', name: '', slug: '', category: '', year: '', description: '',
  price_aed: '', price_toman: '', discount_percent: 0, statuses: [],
  tag: '', featured: false, in_stock: true, image: '',
  gallery: [], colors: [], specs: {},
}

export default function AdminProducts() {
  const [items, setItems] = useState([])
  const [cats, setCats] = useState([])
  const [editing, setEditing] = useState(null)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () =>
    api.get('/products/?page_size=100').then((d) => setItems(asList(d))).finally(() => setLoading(false))

  useEffect(() => {
    load()
    api.get('/categories/flat/').then((d) => setCats(asList(d)))
  }, [])

  const remove = async (p) => {
    if (!window.confirm(`حذف «${p.name}»؟`)) return
    await adel(`/products/${p.slug}/`)
    load()
  }

  const filtered = items.filter((p) => p.name.includes(q))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجوی محصول…"
            className="admin-input w-64 pr-9"
          />
        </div>
        <button onClick={() => setEditing({ ...blank })} className="admin-btn">
          <Plus size={16} />
          محصول جدید
        </button>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-line bg-admin-surface-2 text-admin-muted">
                <Th>محصول</Th><Th>نوع</Th><Th>قیمت</Th><Th>وضعیت‌ها</Th><Th>عملیات</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-admin-muted">در حال بارگذاری…</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-b border-admin-line last:border-0 hover:bg-admin-surface-2">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.image && <img src={p.image} alt="" className="h-11 w-14 rounded-lg object-cover" />}
                      <div>
                        <p className="font-semibold text-admin-ink">{p.name}</p>
                        <p className="text-xs text-admin-muted">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-admin-ink-2">{KINDS.find((k) => k.key === p.kind)?.label}</td>
                  <td className="p-3 text-admin-ink-2">
                    {p.kind === 'part'
                      ? `${faNumber(p.priceToman || 0)} ت`
                      : `${faNumber(p.priceAed || 0)} درهم`}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {(p.statuses || []).map((s) => (
                        <span key={s} className="rounded-full bg-admin-primary-weak px-2 py-0.5 text-[10px] text-admin-primary">
                          {STATUS[s]?.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => setEditing(toForm(p))} className="rounded-lg border border-admin-line p-2 text-admin-ink-2 hover:bg-admin-surface-2">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => remove(p)} className="rounded-lg border border-admin-line p-2 text-admin-danger hover:bg-admin-surface-2">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <ProductForm
          data={editing}
          cats={cats}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load() }}
        />
      )}
    </div>
  )
}

function toForm(p) {
  return {
    kind: p.kind, name: p.name, slug: p.slug, category: p.category || '',
    year: p.year || '', description: p.description || '',
    price_aed: p.priceAed || '', price_toman: p.priceToman || '',
    discount_percent: p.discountPercent || 0, statuses: p.statuses || [],
    tag: p.tag || '', featured: p.featured, in_stock: p.inStock,
    image: p.image || '', gallery: p.gallery || [], colors: p.colors || [],
    specs: p.specs || {}, _slug: p.slug,
  }
}

function ProductForm({ data, cats, onClose, onSaved }) {
  const [form, setForm] = useState(data)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const isCar = form.kind === 'car' || form.kind === 'used'

  const save = async () => {
    setSaving(true); setErr('')
    const payload = {
      ...form,
      year: form.year || null,
      price_aed: form.price_aed || null,
      price_toman: form.price_toman || null,
      slug: form.slug || slugify(form.name),
    }
    delete payload._slug
    try {
      if (data._slug) await apatch(`/products/${data._slug}/`, payload)
      else await apost('/products/', payload)
      onSaved()
    } catch (e) {
      setErr(e.data ? JSON.stringify(e.data) : 'خطا در ذخیره')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminModal title={data._slug ? 'ویرایش محصول' : 'محصول جدید'} onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <L label="نوع محصول">
          <select className="admin-select" value={form.kind} onChange={(e) => set('kind', e.target.value)}>
            {KINDS.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}
          </select>
        </L>
        <L label="دسته‌بندی">
          <select className="admin-select" value={form.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">— انتخاب —</option>
            {cats.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          </select>
        </L>
        <L label="نام محصول"><input className="admin-input" value={form.name} onChange={(e) => set('name', e.target.value)} /></L>
        <L label="اسلاگ (خالی = خودکار)"><input className="admin-input" dir="ltr" value={form.slug} onChange={(e) => set('slug', e.target.value)} /></L>

        {isCar ? (
          <L label="قیمت به درهم (AED)"><input className="admin-input" type="number" dir="ltr" value={form.price_aed} onChange={(e) => set('price_aed', e.target.value)} /></L>
        ) : (
          <L label="قیمت به تومان"><input className="admin-input" type="number" dir="ltr" value={form.price_toman} onChange={(e) => set('price_toman', e.target.value)} /></L>
        )}
        <L label="درصد تخفیف"><input className="admin-input" type="number" dir="ltr" value={form.discount_percent} onChange={(e) => set('discount_percent', +e.target.value || 0)} /></L>
        <L label="سال مدل"><input className="admin-input" type="number" dir="ltr" value={form.year} onChange={(e) => set('year', e.target.value)} /></L>
        <L label="برچسب (مثلاً ویژه)"><input className="admin-input" value={form.tag} onChange={(e) => set('tag', e.target.value)} /></L>
        <div className="sm:col-span-2">
          <p className="admin-label">تصویر اصلی</p>
          <ImageUploader value={form.image} onChange={(v) => set('image', v)} />
        </div>

        <div className="sm:col-span-2 flex gap-6">
          <label className="flex items-center gap-2 text-sm text-admin-ink">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /> محصول ویژه
          </label>
          <label className="flex items-center gap-2 text-sm text-admin-ink">
            <input type="checkbox" checked={form.in_stock} onChange={(e) => set('in_stock', e.target.checked)} /> موجود
          </label>
        </div>

        {isCar && (
          <div className="sm:col-span-2">
            <p className="admin-label">وضعیت گمرکی (چندانتخابی)</p>
            <div className="flex flex-wrap gap-3">
              {Object.values(STATUS).map((s) => (
                <label key={s.key} className="flex items-center gap-2 rounded-lg border border-admin-line px-3 py-2 text-sm text-admin-ink">
                  <input
                    type="checkbox"
                    checked={form.statuses.includes(s.key)}
                    onChange={(e) => {
                      const set2 = new Set(form.statuses)
                      e.target.checked ? set2.add(s.key) : set2.delete(s.key)
                      set('statuses', [...set2])
                    }}
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {isCar && (
          <div className="sm:col-span-2">
            <p className="admin-label">رنگ‌های موجود خودرو</p>
            <ColorsEditor colors={form.colors} onChange={(v) => set('colors', v)} />
          </div>
        )}

        <div className="sm:col-span-2">
          <p className="admin-label">گالری تصاویر</p>
          <GalleryUploader items={form.gallery} onChange={(v) => set('gallery', v)} />
        </div>

        <div className="sm:col-span-2">
          <p className="admin-label">مشخصات فنی</p>
          <SpecsEditor specs={form.specs} onChange={(v) => set('specs', v)} />
        </div>

        <L label="توضیحات" full>
          <textarea rows={3} className="admin-textarea" value={form.description} onChange={(e) => set('description', e.target.value)} />
        </L>
      </div>

      {err && <p className="mt-3 rounded-lg bg-admin-danger/10 px-3 py-2 text-xs text-admin-danger" dir="ltr">{err}</p>}

      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="admin-btn-ghost">انصراف</button>
        <button onClick={save} disabled={saving} className="admin-btn">{saving ? 'در حال ذخیره…' : 'ذخیره'}</button>
      </div>
    </AdminModal>
  )
}

function ColorsEditor({ colors, onChange }) {
  const add = () => onChange([...colors, { name: '', hex: '#3b82f6' }])
  const upd = (i, k, v) => onChange(colors.map((c, j) => (j === i ? { ...c, [k]: v } : c)))
  const del = (i) => onChange(colors.filter((_, j) => j !== i))
  return (
    <div className="space-y-2">
      {colors.map((c, i) => (
        <div key={i} className="flex items-center gap-2">
          <input type="color" value={c.hex} onChange={(e) => upd(i, 'hex', e.target.value)} className="h-9 w-12 rounded border border-admin-line" />
          <input className="admin-input flex-1" placeholder="نام رنگ" value={c.name} onChange={(e) => upd(i, 'name', e.target.value)} />
          <button onClick={() => del(i)} className="rounded-lg border border-admin-line p-2 text-admin-danger"><Trash2 size={14} /></button>
        </div>
      ))}
      <button type="button" onClick={add} className="admin-btn-ghost text-xs"><Plus size={14} /> افزودن رنگ</button>
    </div>
  )
}

/** Main-image field: upload a file OR paste a URL, with live preview. */
function ImageUploader({ value, onChange }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const pick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file
    if (!file) return
    setBusy(true); setErr('')
    try {
      const url = await aupload(file)
      onChange(url)
    } catch (ex) {
      setErr(ex.message || 'خطا در آپلود')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="grid h-24 w-32 place-items-center overflow-hidden rounded-lg border border-admin-line bg-admin-surface-2">
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-[11px] text-admin-muted">بدون تصویر</span>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={pick} />
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="admin-btn text-xs">
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {busy ? 'در حال آپلود…' : 'آپلود تصویر'}
          </button>
          {value && (
            <button type="button" onClick={() => onChange('')} className="admin-btn-ghost admin-btn-danger text-xs">
              <X size={14} /> حذف
            </button>
          )}
        </div>
        <input
          className="admin-input text-xs"
          dir="ltr"
          placeholder="یا آدرس تصویر (URL) را وارد کنید"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {err && <p className="text-xs text-admin-danger">{err}</p>}
      </div>
    </div>
  )
}

/** Gallery: upload multiple files (or add URLs), shown as thumbnails. */
function GalleryUploader({ items, onChange }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const pick = async (e) => {
    const files = [...(e.target.files || [])]
    e.target.value = ''
    if (!files.length) return
    setBusy(true); setErr('')
    try {
      const urls = []
      for (const f of files) urls.push(await aupload(f))
      onChange([...items, ...urls])
    } catch (ex) {
      setErr(ex.message || 'خطا در آپلود')
    } finally {
      setBusy(false)
    }
  }
  const del = (i) => onChange(items.filter((_, j) => j !== i))

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((src, i) => (
            <div key={i} className="group relative h-20 w-24 overflow-hidden rounded-lg border border-admin-line">
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => del(i)}
                className="absolute left-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={pick} />
      <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="admin-btn-ghost text-xs">
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {busy ? 'در حال آپلود…' : 'افزودن تصویر به گالری'}
      </button>
      {err && <p className="text-xs text-admin-danger">{err}</p>}
    </div>
  )
}

function SpecsEditor({ specs, onChange }) {
  const entries = Object.entries(specs)
  const add = () => onChange({ ...specs, '': '' })
  const updKey = (oldK, newK) => {
    const next = {}
    Object.entries(specs).forEach(([k, v]) => { next[k === oldK ? newK : k] = v })
    onChange(next)
  }
  const updVal = (k, v) => onChange({ ...specs, [k]: v })
  const del = (k) => { const n = { ...specs }; delete n[k]; onChange(n) }
  return (
    <div className="space-y-2">
      {entries.map(([k, v], i) => (
        <div key={i} className="flex items-center gap-2">
          <input className="admin-input w-40" placeholder="ویژگی" value={k} onChange={(e) => updKey(k, e.target.value)} />
          <input className="admin-input flex-1" placeholder="مقدار" value={v} onChange={(e) => updVal(k, e.target.value)} />
          <button onClick={() => del(k)} className="rounded-lg border border-admin-line p-2 text-admin-danger"><Trash2 size={14} /></button>
        </div>
      ))}
      <button type="button" onClick={add} className="admin-btn-ghost text-xs"><Plus size={14} /> افزودن مشخصه</button>
    </div>
  )
}

const Th = ({ children }) => <th className="p-3 text-right font-semibold">{children}</th>
const L = ({ label, children, full }) => (
  <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
    <span className="admin-label">{label}</span>
    {children}
  </label>
)
const slugify = (s) => s.trim().replace(/\s+/g, '-').replace(/[^\w؀-ۿ-]/g, '').toLowerCase()
