import { Link } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'
import Reveal from '../ui/Reveal'

export default function CustomRequestCTA() {
  return (
    <section className="container-x py-12 md:py-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-[24px] border border-line bg-surface/60 p-8 md:p-12">
          <div
            aria-hidden
            className="absolute -left-10 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: 'oklch(0.6 0.16 250 / 0.35)' }}
          />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-bg-2 text-neon-bright">
                <Search size={22} />
              </span>
              <h2 className="mt-5 text-2xl font-black text-ink md:text-3xl">
                خودروی موردنظرتان را پیدا نکردید؟
              </h2>
              <p className="mt-3 text-base leading-8 text-muted">
                فرم «درخواست خودروی جدید» را پر کنید؛ مشخصات، رنگ و بودجه دلخواه
                خود را ثبت کنید تا کارشناسان ما آن را برایتان تأمین کنند.
              </p>
            </div>
            <Link to="/dashboard/custom-request" className="btn-neon shrink-0">
              ثبت درخواست خودرو
              <ArrowLeft size={18} />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
