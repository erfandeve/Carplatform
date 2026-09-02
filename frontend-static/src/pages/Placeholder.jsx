import { Link } from 'react-router-dom'
import { ArrowLeft, Hammer } from 'lucide-react'

export default function Placeholder({ title = 'این بخش', note }) {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl border border-line bg-surface text-neon-bright glow-sm">
        <Hammer size={26} />
      </span>
      <h1 className="mt-6 text-2xl font-black text-ink md:text-3xl">{title}</h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-muted">
        {note ||
          'این صفحه در فاز بعدی توسعه ساخته می‌شود. ساختار داده، API و طراحی صفحه اصلی آماده است.'}
      </p>
      <Link to="/" className="btn-ghost mt-7">
        بازگشت به صفحه اصلی
        <ArrowLeft size={18} />
      </Link>
    </div>
  )
}
