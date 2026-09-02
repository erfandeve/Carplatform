import { Link } from 'react-router-dom'

export default function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label="شعبانی خودرو — صفحه اصلی"
    >
      <span className="relative grid h-10 w-10 place-items-center">
        <span
          className="absolute inset-0 rounded-xl opacity-70 blur-md transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'oklch(0.72 0.17 244 / 0.6)' }}
        />
        <svg
          viewBox="0 0 40 40"
          className="relative h-10 w-10"
          fill="none"
          aria-hidden
        >
          <rect
            x="1.5"
            y="1.5"
            width="37"
            height="37"
            rx="11"
            fill="oklch(0.21 0.033 258)"
            stroke="oklch(0.72 0.17 244)"
            strokeWidth="1.5"
          />
          <path
            d="M10 26l2.4-7.2A3 3 0 0 1 15.2 17h9.6a3 3 0 0 1 2.8 1.8L30 26M10 26h20M10 26v3M30 26v3M14 22h12"
            stroke="oklch(0.85 0.11 228)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-extrabold text-ink">شعبانی خودرو</span>
        <span className="text-[10px] tracking-wide text-faint">
          SHABANIKHODRO
        </span>
      </span>
    </Link>
  )
}
