import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function SectionHeader({ title, subtitle, moreHref, moreLabel = 'مشاهده همه' }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-extrabold text-ink md:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-xl text-sm text-muted">{subtitle}</p>}
      </div>
      {moreHref && (
        <Link
          to={moreHref}
          className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-sky transition-colors hover:text-neon-bright sm:inline-flex"
        >
          {moreLabel}
          <ArrowLeft
            size={16}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
        </Link>
      )}
    </div>
  )
}
