import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, ArrowLeft } from 'lucide-react'
import Seo from '../components/Seo'
import SmartImage from '../components/ui/SmartImage'
import { api, asList } from '../lib/api'
import { SITE, breadcrumbJsonLd } from '../lib/seo'
import { toFa } from '../lib/format'

export default function Articles() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/articles/').then((d) => setItems(asList(d))).finally(() => setLoading(false))
  }, [])

  const jsonLd = [
    breadcrumbJsonLd([
      { name: 'خانه', path: '/' },
      { name: 'مقالات', path: '/articles' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'مقالات شعبانی خودرو',
      url: `${SITE.url}/articles`,
      description: 'راهنمای خرید خودرو گذر موقت و منطقه آزاد، قوانین گمرکی و نکات واردات خودرو.',
    },
  ]

  return (
    <div className="container-x py-12 md:py-16">
      <Seo
        title="مقالات و راهنمای خرید خودرو — شعبانی خودرو"
        description="مقالات تخصصی شعبانی خودرو درباره خرید خودرو گذر موقت، خرید ماشین منطقه آزاد، قوانین گمرکی و راهنمای کامل خرید ماشین وارداتی."
        path="/articles"
        keywords={['خرید خودرو گذر موقت', 'خرید ماشین منطقه آزاد', 'راهنمای خرید ماشین', 'شعبانی خودرو']}
        jsonLd={jsonLd}
      />

      <nav className="mb-6 flex items-center gap-2 text-xs text-faint" aria-label="مسیر">
        <Link to="/" className="hover:text-sky">خانه</Link>
        <span>/</span>
        <span className="text-muted">مقالات</span>
      </nav>

      <header className="max-w-2xl">
        <h1 className="text-3xl font-black leading-tight text-ink md:text-4xl">
          مقالات و راهنمای خرید خودرو
        </h1>
        <p className="mt-4 text-base leading-8 text-muted">
          هر آنچه درباره خرید خودرو گذر موقت، خرید ماشین منطقه آزاد و واردات خودرو باید بدانید؛
          نوشته کارشناسان شعبانی خودرو.
        </p>
      </header>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-card border border-line">
                <div className="skeleton aspect-[16/10]" />
                <div className="space-y-3 p-5">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                </div>
              </div>
            ))
          : items.map((a) => (
              <article key={a.id} className="group">
                <Link
                  to={`/articles/${a.slug}`}
                  className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface/70 transition-transform duration-500 hover:-translate-y-1.5"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <SmartImage src={a.image} alt={a.title} className="absolute inset-0"
                      imgClassName="transition-transform duration-700 group-hover:scale-105" />
                    {a.category && (
                      <span className="absolute right-3 top-3 rounded-full bg-bg/80 px-2.5 py-1 text-[11px] font-semibold text-sky backdrop-blur">
                        {a.category}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-center gap-3 text-xs text-faint">
                      <span>{a.date}</span>
                      {a.readMin != null && (
                        <span className="flex items-center gap-1"><Clock size={13} /> {toFa(a.readMin)} دقیقه</span>
                      )}
                    </div>
                    <h2 className="text-base font-bold leading-snug text-ink transition-colors group-hover:text-neon-bright">
                      {a.title}
                    </h2>
                    <p className="text-sm leading-7 text-muted">{a.excerpt}</p>
                    <span className="mt-auto flex items-center gap-1.5 pt-1 text-sm font-semibold text-sky">
                      ادامه مطلب <ArrowLeft size={15} />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
      </div>
    </div>
  )
}
