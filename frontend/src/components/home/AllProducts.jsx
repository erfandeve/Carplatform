import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import ProductCard from '../ui/ProductCard'
import { api } from '../../lib/api'
import { toFa } from '../../lib/format'

const PAGE_SIZE = 8

// Filter chips → query params understood by the products API.
// Only the two customs categories the site focuses on.
const FILTERS = [
  { key: 'all', label: 'همه محصولات', params: {} },
  { key: 'free', label: 'منطقه آزاد', params: { status: 'freePerm,freeTemp' } },
]

export default function AllProducts() {
  const reduce = useReducedMotion()
  const [filter, setFilter] = useState('all')
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const sentinel = useRef(null)
  const reqId = useRef(0)

  const buildQuery = useCallback(
    (p) => {
      const f = FILTERS.find((x) => x.key === filter) || FILTERS[0]
      const qs = new URLSearchParams({ page: String(p), page_size: String(PAGE_SIZE) })
      Object.entries(f.params).forEach(([k, v]) => qs.set(k, v))
      return qs.toString()
    },
    [filter],
  )

  // Load a page (page 1 replaces the list, later pages append).
  const load = useCallback(
    async (p) => {
      const id = ++reqId.current
      setLoading(true)
      try {
        const data = await api.get(`/products/?${buildQuery(p)}`)
        if (id !== reqId.current) return // a newer request superseded this one
        const results = data.results || data
        setItems((prev) => (p === 1 ? results : [...prev, ...results]))
        setTotal(data.count ?? results.length)
        setHasMore(Boolean(data.next))
        setPage(p)
      } catch {
        if (id === reqId.current) setHasMore(false)
      } finally {
        if (id === reqId.current) setLoading(false)
      }
    },
    [buildQuery],
  )

  // Reset + reload whenever the filter changes.
  useEffect(() => {
    setItems([])
    setHasMore(true)
    load(1)
  }, [filter, load])

  // Infinite scroll: load the next page when the sentinel scrolls into view.
  useEffect(() => {
    const el = sentinel.current
    if (!el || !hasMore || loading) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) load(page + 1)
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hasMore, loading, page, load])

  return (
    <section className="container-x py-12 md:py-16" id="products">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-ink md:text-3xl">محصولات</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            همه خودروها و لوازم یدکی در یک‌جا — با فیلتر وضعیت گمرکی مورد نظرتان.
          </p>
        </div>
        {total > 0 && (
          <span className="text-sm text-faint">{toFa(total)} مورد</span>
        )}
      </div>

      {/* Filter chips */}
      <div className="mb-7 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = f.key === filter
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                active
                  ? 'border-neon bg-neon text-bg'
                  : 'border-line bg-surface/60 text-muted hover:border-neon/60 hover:text-ink'
              }`}
              style={active ? { boxShadow: '0 0 20px -6px var(--color-neon)' } : undefined}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {items.length === 0 && !loading ? (
        <div className="rounded-card border border-line bg-surface/50 p-12 text-center text-muted">
          محصولی با این فیلتر یافت نشد.
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: reduce ? 0 : 0.05 } },
          }}
        >
          {items.map((p) => (
            <motion.div
              key={p.id}
              variants={{
                hidden: reduce ? {} : { opacity: 0, y: 24 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Skeletons while loading */}
      {loading && (
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-card border border-line">
              <div className="skeleton aspect-[5/4]" />
              <div className="space-y-3 p-4">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
                <div className="skeleton h-6 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Infinite-scroll sentinel + manual fallback */}
      <div ref={sentinel} className="h-px" />
      {hasMore && !loading && (
        <div className="mt-8 flex justify-center">
          <button onClick={() => load(page + 1)} className="btn-ghost">
            نمایش بیشتر
          </button>
        </div>
      )}
      {loading && items.length > 0 && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
          <Loader2 size={16} className="animate-spin" />
          در حال بارگذاری…
        </div>
      )}
      {!hasMore && items.length > 0 && (
        <p className="mt-8 text-center text-sm text-faint">همه محصولات نمایش داده شد.</p>
      )}
    </section>
  )
}
