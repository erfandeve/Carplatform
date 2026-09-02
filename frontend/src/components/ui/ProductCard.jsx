import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import SmartImage from './SmartImage'
import StatusBadges from './StatusBadges'
import StarRating from './StarRating'
import Price from './Price'
import { toFa } from '../../lib/format'

export default function ProductCard({ product }) {
  const isCar = product.kind === 'car'
  const to = isCar ? `/product/${product.slug}` : `/product/${product.slug}`

  return (
    <article className="group relative">
      {/* glow that blooms on hover — sits behind the card */}
      <div
        aria-hidden
        className="absolute -inset-px rounded-[18px] opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.72 0.17 244 / 0.5), oklch(0.85 0.11 228 / 0.35))',
        }}
      />
      <Link
        to={to}
        className="relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface/80 transition-transform duration-500 [transition-timing-function:var(--ease-out-quint)] group-hover:-translate-y-1.5"
      >
        {/* Image */}
        <div className="relative aspect-[5/4] overflow-hidden">
          <SmartImage
            src={product.image}
            alt={product.name}
            className="absolute h-80 inset-0"
            imgClassName="scale-100 h-80 transition-transform duration-700 [transition-timing-function:var(--ease-out-quint)] group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />

          {product.tag && (
            <span className="absolute right-3 top-3 rounded-full bg-neon px-2.5 py-1 text-[11px] font-bold text-bg glow-sm">
              {product.tag}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-danger px-2 py-1 text-[11px] font-bold text-ink">
              {toFa(product.discountPercent)}٪ تخفیف
            </span>
          )}

          {isCar && (
            <div className="absolute inset-x-3 bottom-3">
              <StatusBadges statuses={product.statuses} />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold leading-snug text-ink">
              {product.name}
            </h3>
            {product.year && (
              <span className="shrink-0 rounded-md bg-bg-2 px-1.5 py-0.5 text-[11px] text-muted">
                {toFa(product.year)}
              </span>
            )}
          </div>

          <StarRating value={product.rating} count={product.reviews} />

          {/* color swatches preview for cars */}
          {isCar && product.colors?.length > 0 && (
            <div className="flex items-center gap-1.5">
              {product.colors.slice(0, 4).map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="h-4 w-4 rounded-full ring-1 ring-line-strong"
                  style={{ background: c.hex }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[11px] text-faint">
                  +{toFa(product.colors.length - 4)}
                </span>
              )}
            </div>
          )}

          <div className="mt-auto flex items-end justify-between gap-2 pt-1">
            <Price product={product} />
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors duration-300 group-hover:border-neon group-hover:bg-neon group-hover:text-bg">
              <ArrowLeft size={16} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
