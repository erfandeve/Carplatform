import { motion, useReducedMotion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'
import ProductCard from '../ui/ProductCard'

export default function ProductSection({ title, subtitle, items = [], moreHref }) {
  const reduce = useReducedMotion()

  if (items.length === 0) {
    return (
      <section className="container-x py-10 md:py-12">
        <SectionHeader title={title} subtitle={subtitle} moreHref={moreHref} />
        <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-card border border-line">
              <div className="skeleton aspect-[4/3]" />
              <div className="space-y-3 p-4">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
                <div className="skeleton h-6 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="container-x py-10 md:py-12">
      <SectionHeader title={title} subtitle={subtitle} moreHref={moreHref} />
      <motion.div
        className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
        }}
      >
        {items.map((p) => (
          <motion.div
            key={p.id}
            variants={{
              hidden: reduce ? {} : { opacity: 0, y: 26 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
