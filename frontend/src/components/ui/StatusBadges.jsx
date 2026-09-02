import { STATUS } from '../../data/mock'

/**
 * A car can hold several customs states at once. Each active state
 * renders as its own small colored badge (its own hue), side by side.
 */
function normalize(statuses) {
  if (Array.isArray(statuses)) return statuses
  if (typeof statuses === 'string') {
    try {
      const parsed = JSON.parse(statuses)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

export default function StatusBadges({ statuses = [], size = 'sm' }) {
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
  return (
    <div className="flex flex-wrap gap-1.5">
      {normalize(statuses).map((key) => {
        const s = STATUS[key]
        if (!s) return null
        const c = `var(--color-${s.color})`
        return (
          <span
            key={key}
            className={`inline-flex items-center gap-1 rounded-full font-semibold ${pad}`}
            style={{
              color: c,
              background: `color-mix(in oklch, ${c} 14%, transparent)`,
              border: `1px solid color-mix(in oklch, ${c} 40%, transparent)`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: c, boxShadow: `0 0 8px ${c}` }}
            />
            {s.label}
          </span>
        )
      })}
    </div>
  )
}
