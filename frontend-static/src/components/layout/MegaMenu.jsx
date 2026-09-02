import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Car, History, Wrench } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

const ICONS = { car: Car, history: History, wrench: Wrench }

/**
 * Master–detail mega panel: a category list on the right (RTL); hovering
 * a category reveals only its subcategories on the left. The first
 * category is active by default.
 */
export default function MegaMenu({ onNavigate }) {
  const { categories: CATEGORIES } = useSettings()
  const [active, setActive] = useState(0)

  if (!CATEGORIES?.length) return null
  const current = CATEGORIES[active] || CATEGORIES[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="glass overflow-hidden rounded-b-2xl border border-line/60 shadow-2xl"
      style={{ boxShadow: '0 30px 60px -20px oklch(0.1 0.03 258 / 0.8)' }}
    >
      <div className="grid" style={{ gridTemplateColumns: '250px 1fr' }}>
        {/* Category list (right in RTL) */}
        <ul className="border-l border-line/50 p-3">
          {CATEGORIES.map((cat, i) => {
            const Icon = ICONS[cat.icon] || Car
            const isActive = i === active
            return (
              <li key={cat.slug}>
                <Link
                  to={`/products?cat=${cat.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={onNavigate}
                  className={`group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 transition-colors ${
                    isActive ? 'bg-surface-2 text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors ${
                        isActive
                          ? 'border-neon text-neon-bright'
                          : 'border-line text-sky group-hover:border-neon/60'
                      }`}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="text-sm font-semibold">{cat.title}</span>
                  </span>
                  <ChevronLeft
                    size={15}
                    className={`transition-all ${
                      isActive ? 'text-neon-bright' : 'opacity-30 group-hover:opacity-60'
                    }`}
                  />
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Active category's subcategories (left in RTL) */}
        <div className="min-h-[240px] p-6">
          <motion.div
            key={current.slug}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-ink">{current.title}</h3>
              <Link
                to={`/products?cat=${current.slug}`}
                onClick={onNavigate}
                className="flex items-center gap-1 text-xs font-semibold text-sky hover:text-neon-bright"
              >
                مشاهده همه
                <ChevronLeft size={13} />
              </Link>
            </div>

            {current.children?.length ? (
              <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
                {current.children.map((sub) => (
                  <div key={sub.slug} className="py-1">
                    <Link
                      to={`/products?cat=${sub.slug}`}
                      onClick={onNavigate}
                      className="group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-neon-bright"
                    >
                      <span>{sub.title}</span>
                      <ChevronLeft
                        size={14}
                        className="opacity-0 transition-opacity group-hover:opacity-60"
                      />
                    </Link>
                    {/* third level (e.g. روغن فوکس) */}
                    {sub.children?.length > 0 && (
                      <ul className="mb-1 mr-4 mt-0.5 space-y-0.5 border-r border-line pr-3">
                        {sub.children.map((leaf) => (
                          <li key={leaf.slug}>
                            <Link
                              to={`/products?cat=${leaf.slug}`}
                              onClick={onNavigate}
                              className="block rounded-md px-2 py-1 text-[13px] text-faint transition-colors hover:text-sky"
                            >
                              {leaf.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">
                زیردسته‌ای برای این دسته تعریف نشده است.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
