import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Clock, ArrowLeft } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import SmartImage from '../ui/SmartImage'
import { toFa } from '../../lib/format'

export default function ArticlesSection({ items = [] }) {
  const reduce = useReducedMotion()
  const ARTICLES = items
  if (ARTICLES.length === 0) return null
  return (
    <section className="container-x py-12 md:py-16">
      <SectionHeader
        title="از وبلاگ شعبانی خودرو"
        subtitle="راهنمای خرید، قوانین گمرکی و همه‌چیز درباره خرید ماشین گذر و منطقه آزاد."
        moreHref="/articles"
        moreLabel="همه مقالات"
      />
      <div className="grid gap-5 md:grid-cols-3">
        {ARTICLES.map((a, i) => (
          <motion.article
            key={a.id}
            initial={reduce ? false : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group"
          >
            <Link
              to={`/articles/${a.slug}`}
              className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface/70 transition-transform duration-500 [transition-timing-function:var(--ease-out-quint)] hover:-translate-y-1.5"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <SmartImage
                  src={a.image}
                  alt={a.title}
                  className="absolute inset-0"
                  imgClassName="transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute right-3 top-3 rounded-full bg-bg/80 px-2.5 py-1 text-[11px] font-semibold text-sky backdrop-blur">
                  {a.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center gap-3 text-xs text-faint">
                  <span>{a.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {toFa(a.readMin)} دقیقه
                  </span>
                </div>
                <h3 className="text-base font-bold leading-snug text-ink transition-colors group-hover:text-neon-bright">
                  {a.title}
                </h3>
                <p className="text-sm leading-7 text-muted">{a.excerpt}</p>
                <span className="mt-auto flex items-center gap-1.5 pt-1 text-sm font-semibold text-sky">
                  ادامه مطلب
                  <ArrowLeft
                    size={15}
                    className="transition-transform duration-300 group-hover:-translate-x-1"
                  />
                </span>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
