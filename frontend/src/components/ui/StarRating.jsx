import { toFa } from '../../lib/format'

export default function StarRating({ value = 0, count, size = 14 }) {
  const full = Math.round(value)
  return (
    <div className="flex items-center gap-1.5" aria-label={`امتیاز ${value} از ۵`}>
      <div className="flex" style={{ gap: 1 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={i < full ? 'currentColor' : 'none'}
            className={i < full ? 'text-gozar-temp' : 'text-line-strong'}
          >
            <path
              d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>
      {count != null && (
        <span className="text-xs text-faint">({toFa(count)})</span>
      )}
    </div>
  )
}
