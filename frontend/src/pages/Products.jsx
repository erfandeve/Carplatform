import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import { api } from '../lib/api'
import { STATUS } from '../data/mock'
import { useSettings } from '../context/SettingsContext'
import { toFa } from '../lib/format'

const SORTS = [
  { key: 'new', label: 'جدیدترین' },
  { key: 'price_asc', label: 'ارزان‌ترین' },
  { key: 'price_desc', label: 'گران‌ترین' },
  { key: 'popular', label: 'پرفروش‌ترین' },
]

export default function Products() {
  const [params, setParams] = useSearchParams()
  const { categories } = useSettings()
  const [data, setData] = useState({ count: 0, results: [] })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const cat = params.get('cat') || ''
  const type = params.get('type') || ''
  const sort = params.get('sort') || 'new'
  const statuses = (params.get('status') || '').split(',').filter(Boolean)

  const query = useMemo(() => {
    const q = new URLSearchParams()
    if (cat) q.set('cat', cat)
    if (type) q.set('type', type)
    if (sort) q.set('sort', sort)
    if (statuses.length) q.set('status', statuses.join(','))
    q.set('page', String(page))
    return q.toString()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat, type, sort, params.get('status'), page])

  useEffect(() => {
    setLoading(true)
    api
      .get(`/products/?${query}`)
      .then((d) => setData(d))
      .catch(() => setData({ count: 0, results: [] }))
      .finally(() => setLoading(false))
  }, [query])

  useEffect(() => {
    setPage(1)
  }, [cat, type, sort, params.get('status')])

  const patch = (updates) => {
    const next = new URLSearchParams(params)
    Object.entries(updates).forEach(([k, v]) => {
      if (v == null || v === '') next.delete(k)
      else next.set(k, v)
    })
    setParams(next)
  }

  const toggleStatus = (key) => {
    const set = new Set(statuses)
    set.has(key) ? set.delete(key) : set.add(key)
    patch({ status: [...set].join(',') })
  }

  const perPage = 12
  const totalPages = Math.max(1, Math.ceil(data.count / perPage))

  const Filters = (
    <div className="space-y-7">
      <FilterGroup title="مرتب‌سازی">
        <div className="space-y-1.5">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => patch({ sort: s.key })}
              className={`block w-full rounded-lg px-3 py-2 text-right text-sm transition-colors ${
                sort === s.key
                  ? 'bg-neon/15 font-semibold text-neon-bright'
                  : 'text-muted hover:bg-surface-2 hover:text-ink'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="وضعیت گمرکی">
        <div className="space-y-2">
          {/* گذر موقت/دائم فعلاً کنسل است؛ فقط منطقه آزاد. */}
          {Object.values(STATUS)
            .filter((s) => s.key === 'freePerm' || s.key === 'freeTemp')
            .map((s) => (
            <label key={s.key} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={statuses.includes(s.key)}
                onChange={() => toggleStatus(s.key)}
                className="h-4 w-4 accent-[var(--color-neon)]"
              />
              <span className="text-sm text-muted">{s.label}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="دسته‌بندی">
        <div className="space-y-1.5">
          <button
            onClick={() => patch({ cat: '', type: '' })}
            className={`block w-full rounded-lg px-3 py-1.5 text-right text-sm transition-colors ${
              !cat ? 'font-semibold text-neon-bright' : 'text-muted hover:text-ink'
            }`}
          >
            همه محصولات
          </button>
          {categories.map((c) => (
            <div key={c.slug}>
              <button
                onClick={() => patch({ cat: c.slug, type: '' })}
                className={`block w-full rounded-lg px-3 py-1.5 text-right text-sm transition-colors ${
                  cat === c.slug ? 'font-semibold text-neon-bright' : 'text-ink hover:text-sky'
                }`}
              >
                {c.title}
              </button>
              {c.children?.length > 0 && (
                <div className="mr-3 border-r border-line pr-2">
                  {c.children.map((sub) => (
                    <button
                      key={sub.slug}
                      onClick={() => patch({ cat: sub.slug, type: '' })}
                      className={`block w-full rounded-lg px-3 py-1 text-right text-[13px] transition-colors ${
                        cat === sub.slug
                          ? 'font-semibold text-neon-bright'
                          : 'text-faint hover:text-sky'
                      }`}
                    >
                      {sub.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </FilterGroup>
    </div>
  )

  return (
    <div className="container-x py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-ink">همه محصولات</h1>
          <p className="mt-2 text-sm text-muted">
            {loading ? 'در حال بارگذاری…' : `${toFa(data.count)} محصول یافت شد`}
          </p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="btn-ghost lg:hidden"
        >
          <SlidersHorizontal size={16} />
          فیلترها
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">{Filters}</aside>

        <div>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[3/4] rounded-card" />
              ))}
            </div>
          ) : data.results.length === 0 ? (
            <div className="rounded-card border border-line bg-surface/50 py-20 text-center text-muted">
              محصولی با این فیلترها یافت نشد.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {data.results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-10 w-10 rounded-xl border text-sm font-semibold transition-colors ${
                    page === i + 1
                      ? 'border-neon bg-neon text-bg'
                      : 'border-line text-muted hover:border-neon'
                  }`}
                >
                  {toFa(i + 1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-modal lg:hidden" style={{ zIndex: 'var(--z-modal)' }}>
          <div className="absolute inset-0 bg-bg/70 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[86%] max-w-sm overflow-y-auto border-l border-line bg-bg-2 p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">فیلترها</h2>
              <button onClick={() => setDrawerOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink">
                <X size={18} />
              </button>
            </div>
            {Filters}
          </div>
        </div>
      )}
    </div>
  )
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-ink">{title}</h3>
      {children}
    </div>
  )
}
