import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ScrollText } from 'lucide-react'
import { api } from '../lib/api'
import NotFound from './NotFound'

export default function Regulation() {
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [others, setOthers] = useState([])
  const [state, setState] = useState('loading') // loading | ok | missing

  useEffect(() => {
    let alive = true
    setState('loading')
    api
      .get(`/regulations/${slug}/`)
      .then((d) => {
        if (!alive) return
        setItem(d)
        setState('ok')
        document.title = `${d.title} | شعبانی خودرو`
      })
      .catch(() => alive && setState('missing'))

    api.get('/regulations/').then((d) => alive && setOthers(d || [])).catch(() => {})
    return () => {
      alive = false
    }
  }, [slug])

  if (state === 'missing') return <NotFound />

  if (state === 'loading') {
    return (
      <div className="container-x py-14">
        <div className="skeleton h-10 w-2/3 rounded" />
        <div className="skeleton mt-4 h-4 w-1/2 rounded" />
        <div className="skeleton mt-8 h-72 rounded-2xl" />
      </div>
    )
  }

  return (
    <article className="container-x py-10 md:py-14">
      {/* Header */}
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
        <div className="w-44 shrink-0 overflow-hidden rounded-xl border border-line-strong bg-white/95 p-2">
          <img src={item.image} alt={item.title} className="w-full object-contain" />
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/60 px-3 py-1 text-xs font-semibold text-sky">
            <ScrollText size={14} />
            قوانین و مقررات
          </span>
          <h1 className="mt-3 text-3xl font-black leading-tight text-ink md:text-4xl">
            {item.title}
          </h1>
          {item.subtitle && (
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{item.subtitle}</p>
          )}
        </div>
      </div>

      <div className="mt-8 h-px bg-line" />

      {/* Body */}
      <div
        className="prose-fa mt-8 max-w-3xl"
        dangerouslySetInnerHTML={{ __html: item.content }}
      />

      {/* Other regulations */}
      {others.filter((o) => o.slug !== slug).length > 0 && (
        <div className="mt-12 border-t border-line pt-8">
          <h2 className="mb-4 text-lg font-bold text-ink">سایر قوانین</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {others
              .filter((o) => o.slug !== slug)
              .map((o) => (
                <Link
                  key={o.slug}
                  to={`/regulations/${o.slug}`}
                  className="group flex items-center gap-4 rounded-card border border-line bg-surface/60 p-4 transition-colors hover:border-neon/60"
                >
                  <div className="w-24 shrink-0 overflow-hidden rounded-lg border border-line-strong bg-white/95 p-1.5">
                    <img src={o.image} alt={o.title} className="w-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-ink transition-colors group-hover:text-neon-bright">
                      {o.title}
                    </p>
                    <span className="mt-1 flex items-center gap-1 text-xs text-sky">
                      مطالعه
                      <ArrowLeft size={13} />
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      <Link to="/" className="btn-ghost mt-10">
        بازگشت به صفحه اصلی
        <ArrowLeft size={17} />
      </Link>
    </article>
  )
}
