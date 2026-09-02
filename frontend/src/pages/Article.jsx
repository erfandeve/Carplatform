import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Clock, ArrowLeft, CalendarDays } from 'lucide-react'
import Seo from '../components/Seo'
import SmartImage from '../components/ui/SmartImage'
import { api, asList } from '../lib/api'
import { SITE, breadcrumbJsonLd } from '../lib/seo'
import { toFa } from '../lib/format'
import NotFound from './NotFound'

export default function Article() {
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [others, setOthers] = useState([])
  const [state, setState] = useState('loading')

  useEffect(() => {
    let alive = true
    setState('loading')
    api.get(`/articles/${slug}/`)
      .then((d) => { if (alive) { setItem(d); setState('ok') } })
      .catch(() => alive && setState('missing'))
    api.get('/articles/').then((d) => alive && setOthers(asList(d))).catch(() => {})
    return () => { alive = false }
  }, [slug])

  if (state === 'missing') return <NotFound />
  if (state === 'loading') {
    return (
      <div className="container-x py-14">
        <div className="skeleton h-10 w-3/4 rounded" />
        <div className="skeleton mt-6 aspect-[16/8] rounded-2xl" />
      </div>
    )
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    description: item.meta_description || item.excerpt,
    image: item.image ? [item.image] : undefined,
    articleSection: item.category,
    keywords: item.keywords,
    inLanguage: 'fa-IR',
    author: { '@type': 'Organization', name: SITE.nameFa },
    publisher: {
      '@type': 'Organization',
      name: SITE.nameFa,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/favicon.svg` },
    },
    mainEntityOfPage: `${SITE.url}/articles/${slug}`,
  }
  const jsonLd = [
    articleJsonLd,
    breadcrumbJsonLd([
      { name: 'خانه', path: '/' },
      { name: 'مقالات', path: '/articles' },
      { name: item.title, path: `/articles/${slug}` },
    ]),
  ]

  const related = others.filter((o) => o.slug !== slug).slice(0, 3)

  return (
    <article className="container-x py-10 md:py-14">
      <Seo
        title={item.meta_title || item.title}
        description={item.meta_description || item.excerpt}
        keywords={item.keywords ? item.keywords.split('،').map((s) => s.trim()) : undefined}
        path={`/articles/${slug}`}
        image={item.image || undefined}
        type="article"
        jsonLd={jsonLd}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-faint" aria-label="مسیر">
        <Link to="/" className="hover:text-sky">خانه</Link>
        <span>/</span>
        <Link to="/articles" className="hover:text-sky">مقالات</Link>
        <span>/</span>
        <span className="text-muted line-clamp-1">{item.title}</span>
      </nav>

      <header className="max-w-3xl">
        {item.category && <span className="text-sm font-semibold text-sky">{item.category}</span>}
        <h1 className="mt-3 text-3xl font-black leading-tight text-ink md:text-4xl">{item.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-faint">
          <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {item.date}</span>
          {item.readMin != null && (
            <span className="flex items-center gap-1.5"><Clock size={14} /> {toFa(item.readMin)} دقیقه مطالعه</span>
          )}
        </div>
      </header>

      {item.image && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-line">
          <SmartImage src={item.image} alt={item.title} className="aspect-[16/8]" />
        </div>
      )}

      <div className="prose-fa mt-8 max-w-3xl" dangerouslySetInnerHTML={{ __html: item.content }} />

      {related.length > 0 && (
        <div className="mt-12 border-t border-line pt-8">
          <h2 className="mb-4 text-lg font-bold text-ink">مقالات مرتبط</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((o) => (
              <Link key={o.slug} to={`/articles/${o.slug}`}
                className="group rounded-card border border-line bg-surface/60 p-4 transition-colors hover:border-neon/60">
                <p className="text-[11px] text-sky">{o.category}</p>
                <p className="mt-1 font-bold text-ink transition-colors group-hover:text-neon-bright">{o.title}</p>
                <span className="mt-2 flex items-center gap-1 text-xs text-sky">ادامه مطلب <ArrowLeft size={13} /></span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link to="/articles" className="btn-ghost mt-10">
        بازگشت به مقالات <ArrowLeft size={17} />
      </Link>
    </article>
  )
}
