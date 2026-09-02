import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, ScrollText } from 'lucide-react'

const AUTOPLAY = 6000
const EASE = [0.16, 1, 0.3, 1]

/**
 * Full-width banner slider above the hero. Each slide is a regulation
 * (منطقه آزاد / گذر موقت) and links to its full rules page.
 */
export default function RegulationBanner({ items = [] }) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const paused = useRef(false)
  const count = items.length

  useEffect(() => {
    if (count <= 1 || reduce) return
    const id = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % count)
    }, AUTOPLAY)
    return () => clearInterval(id)
  }, [count, reduce])

  useEffect(() => {
    if (index >= count && count > 0) setIndex(0)
  }, [count, index])

  if (count === 0) return null

  const item = items[index] || items[0]
  const go = (i) => setIndex(((i % count) + count) % count)

  return (
    <section
      className="container-x pt-4 md:pt-6"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="relative overflow-hidden rounded-[20px] border border-line bg-surface/60">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: reduce ? 0 : 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Link
            to={`/regulations/${item.slug}`}
            className="group grid items-center gap-5 p-5 sm:grid-cols-[auto_1fr_auto] sm:p-6"
          >
            {/* Image (wide plate) */}
            <div className="mx-auto aspect-[2/1] w-56 shrink-0 overflow-hidden rounded-xl border border-line bg-black/50 sm:mx-0 sm:w-72">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Copy */}
            <div className="text-center sm:text-right">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-2/70 px-2.5 py-1 text-[11px] font-semibold text-sky">
                <ScrollText size={13} />
                قوانین و مقررات
              </span>
              <h2 className="mt-2 text-lg font-extrabold text-ink sm:text-xl md:text-2xl">
                {item.title}
              </h2>
              {item.subtitle && (
                <p className="mt-1.5 text-sm leading-7 text-muted">{item.subtitle}</p>
              )}
            </div>

            {/* CTA */}
            <span className="btn-neon mx-auto shrink-0 sm:mx-0">
              مطالعه کامل
              <ArrowLeft size={17} />
            </span>
          </Link>
        </motion.div>

        {/* Controls */}
        {count > 1 && (
          <div className="flex items-center justify-between border-t border-line/60 px-4 py-2.5">
            <div className="flex gap-1.5">
              {items.map((it, i) => (
                <button
                  key={it.id || i}
                  onClick={() => go(i)}
                  aria-label={it.title}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-6 bg-neon' : 'w-1.5 bg-line-strong hover:bg-muted'
                  }`}
                  style={i === index ? { boxShadow: '0 0 8px var(--color-neon)' } : undefined}
                />
              ))}
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => go(index - 1)}
                aria-label="قبلی"
                className="grid h-8 w-8 place-items-center rounded-full border border-line text-muted transition-colors hover:border-neon hover:text-neon-bright"
              >
                <ChevronRight size={15} />
              </button>
              <button
                onClick={() => go(index + 1)}
                aria-label="بعدی"
                className="grid h-8 w-8 place-items-center rounded-full border border-line text-muted transition-colors hover:border-neon hover:text-neon-bright"
              >
                <ChevronLeft size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
