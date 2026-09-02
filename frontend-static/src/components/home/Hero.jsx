import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react'
import SmartImage from '../ui/SmartImage'
import StatusBadges from '../ui/StatusBadges'
import Price from '../ui/Price'
import { toFa } from '../../lib/format'

const AUTOPLAY = 5500
const EASE = [0.16, 1, 0.3, 1]

export default function Hero({ cars = [] }) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const count = cars.length
  const paused = useRef(false)

  // Autoplay — one interval, guarded by a hover ref.
  useEffect(() => {
    if (count <= 1 || reduce) return
    const id = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % count)
    }, AUTOPLAY)
    return () => clearInterval(id)
  }, [count, reduce])

  // Keep index valid if the number of cars changes.
  useEffect(() => {
    if (index >= count && count > 0) setIndex(0)
  }, [count, index])

  if (count === 0) {
    return (
      <section className="container-x py-14">
        <div className="skeleton h-[560px] rounded-[28px]" />
      </section>
    )
  }

  const car = cars[index] || cars[0]
  const go = (i) => setIndex(((i % count) + count) % count)

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {/* Ambient neon field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55rem 34rem at 78% 12%, oklch(0.5 0.16 250 / 0.32), transparent 60%),' +
            'radial-gradient(44rem 30rem at 10% 90%, oklch(0.55 0.12 220 / 0.18), transparent 55%)',
        }}
      />

      <div className="container-x relative flex min-h-[600px] flex-col justify-center py-10 md:min-h-[84vh] md:py-0">
        {/* Giant faint car name behind everything */}
        <motion.span
          key={`word-${index}`}
          initial={{ opacity: 0, x: reduce ? 0 : 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-black leading-none"
          style={{
            fontSize: 'clamp(3.5rem, 13vw, 12rem)',
            color: 'transparent',
            WebkitTextStroke: '1px oklch(0.72 0.17 244 / 0.15)',
            letterSpacing: '-0.03em',
            whiteSpace: 'nowrap',
            zIndex: 0,
          }}
        >
          {car.name}
        </motion.span>

        {/* Slide */}
        <motion.div
          key={index}
          initial={{ opacity: 0, x: reduce ? 0 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.05fr_1fr]"
        >
          {/* Content (right in RTL) */}
          <div className="order-2 text-center lg:order-1 lg:text-right">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 text-xs font-semibold text-sky">
              <Sparkles size={14} />
              خودروی ویژه · مدل {toFa(car.year || '')}
            </span>

            <h2
              className="mt-4 text-4xl font-black leading-[1.12] text-ink sm:text-5xl md:text-6xl"
              style={{ letterSpacing: '-0.03em' }}
            >
              {car.name}
            </h2>

            <div className="mt-4 flex justify-center lg:justify-start">
              <StatusBadges statuses={car.statuses} size="md" />
            </div>

            <div className="mt-5 flex justify-center lg:justify-start">
              <Price product={car} size="lg" />
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link to={`/product/${car.slug}`} className="btn-neon">
                مشاهده و ثبت سفارش
                <ArrowLeft size={18} />
              </Link>
              <Link to="/products" className="btn-ghost">
                همه محصولات
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-muted lg:justify-start">
              <ShieldCheck size={15} className="text-free-perm" />
              اصالت و سلامت تضمینی · واردات از حوزه خلیج فارس
            </div>
          </div>

          {/* Car visual (left in RTL) */}
          <div className="relative order-1 lg:order-2">
            <div
              aria-hidden
              className="absolute inset-x-6 bottom-4 h-40 rounded-full blur-3xl"
              style={{
                background:
                  'radial-gradient(60% 60% at 50% 50%, oklch(0.72 0.17 244 / 0.55), transparent 70%)',
              }}
            />
            <motion.div
              animate={reduce ? undefined : { y: [0, -16, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="overflow-hidden rounded-[24px] border border-line/70 bg-surface/30 p-2 backdrop-blur-sm">
                <SmartImage
                  src={car.image}
                  alt={car.name}
                  className="aspect-[5/4] rounded-[18px]"
                />
              </div>
              {car.tag && (
                <span className="glass absolute -top-3 right-5 rounded-full border border-line/60 px-3 py-1.5 text-xs font-bold text-sky shadow-xl">
                  {car.tag}
                </span>
              )}
              {car.colors?.length > 0 && (
                <div className="glass absolute -bottom-4 left-5 flex items-center gap-2 rounded-2xl border border-line/60 px-3 py-2.5 shadow-xl">
                  {car.colors.slice(0, 4).map((c) => (
                    <span
                      key={c.name}
                      title={c.name}
                      className="h-5 w-5 rounded-full ring-1 ring-line-strong"
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom controls: counter · car tabs · arrows */}
        <div className="relative z-10 mt-8 flex flex-col gap-4 border-t border-line/50 pt-5 md:mt-12 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-ink">
              {toFa(String(index + 1).padStart(2, '0'))}
              <span className="text-faint"> / {toFa(String(count).padStart(2, '0'))}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => go(index - 1)}
                aria-label="قبلی"
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-neon hover:text-neon-bright"
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => go(index + 1)}
                aria-label="بعدی"
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-neon hover:text-neon-bright"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {cars.map((c, i) => (
              <button
                key={c.id}
                onClick={() => go(i)}
                className={`relative pb-1 text-sm font-semibold transition-colors ${
                  i === index ? 'text-neon-bright' : 'text-faint hover:text-ink'
                }`}
              >
                {c.name}
                {i === index && (
                  <span
                    className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-neon"
                    style={{ boxShadow: '0 0 8px var(--color-neon)' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
