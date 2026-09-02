import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p
        className="text-[7rem] font-black leading-none text-neon md:text-[10rem]"
        style={{ textShadow: '0 0 40px oklch(0.72 0.17 244 / 0.5)' }}
      >
        ۴۰۴
      </p>
      <h1 className="mt-2 text-2xl font-black text-ink">صفحه پیدا نشد</h1>
      <p className="mt-3 max-w-sm text-sm leading-7 text-muted">
        صفحه‌ای که دنبالش بودید وجود ندارد یا جابه‌جا شده است.
      </p>
      <Link to="/" className="btn-neon mt-7">
        بازگشت به خانه
        <ArrowLeft size={18} />
      </Link>
    </div>
  )
}
