import {
  faNumber,
  formatAed,
  tomanFromAed,
  applyDiscount,
} from '../../lib/format'
import { useSettings } from '../../context/SettingsContext'

/**
 * Dual price for cars (AED small/muted + final Toman large/neon).
 * For non-car products only a Toman price is shown. Discounts render
 * the pre-discount Toman struck through. The rate comes live from the
 * admin exchange-rate setting, so changing it reprices every car.
 */
export default function Price({ product, rate: rateProp, size = 'md' }) {
  const { rate: ctxRate } = useSettings()
  const rate = rateProp ?? ctxRate
  const isCar = product.kind === 'car'
  const baseToman = isCar
    ? tomanFromAed(product.priceAed, rate)
    : product.priceToman
  const finalToman = applyDiscount(baseToman, product.discountPercent)
  const hasDiscount = product.discountPercent > 0

  const big = size === 'lg' ? 'text-2xl md:text-3xl' : 'text-xl'

  return (
    <div className="flex flex-col gap-0.5">
      {isCar && (
        <span className={`font-semibold text-muted ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
          {formatAed(product.priceAed)}
        </span>
      )}
      <div className="flex items-baseline gap-2 flex-wrap">
        {hasDiscount && (
          <span className="text-sm text-faint line-through decoration-danger/70">
            {faNumber(baseToman)}
          </span>
        )}
        <span className={`font-extrabold text-sky ${big}`}>
          {faNumber(finalToman)}
        </span>
        <span className="text-xs text-muted">تومان</span>
      </div>
    </div>
  )
}
