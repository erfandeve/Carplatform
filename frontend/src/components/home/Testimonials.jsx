import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { Quote } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/pagination'
import SectionHeader from '../ui/SectionHeader'
import StarRating from '../ui/StarRating'

const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

export default function Testimonials({ items = [] }) {
  const TESTIMONIALS = items
  if (TESTIMONIALS.length === 0) return null
  return (
    <section className="container-x py-12 md:py-16">
      <SectionHeader
        title="نظر مشتریان ما"
        subtitle="تجربه واقعی کسانی که خودروی خود را از شعبانی خودرو تهیه کرده‌اند."
      />
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true, el: '.tm-dots' }}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {TESTIMONIALS.map((t) => (
          <SwiperSlide key={t.id} className="h-auto pb-2">
            <figure className="flex h-full flex-col gap-4 rounded-card border border-line bg-surface/70 p-6">
              <Quote size={26} className="text-neon/60" />
              <blockquote className="flex-1 text-sm leading-7 text-ink-2">
                {t.text}
              </blockquote>
              <StarRating value={t.rating} />
              <figcaption className="flex items-center gap-3 border-t border-line pt-4">
                <span
                  className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-bg"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-sky), var(--color-neon))',
                  }}
                >
                  {initials(t.name)}
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink">
                    {t.name}
                  </span>
                  <span className="block text-xs text-faint">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="tm-dots mt-6 flex justify-center gap-2" />
    </section>
  )
}
