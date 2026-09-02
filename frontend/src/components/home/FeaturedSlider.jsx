import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import SmartImage from '../ui/SmartImage'
import StatusBadges from '../ui/StatusBadges'
import Price from '../ui/Price'
import { toFa } from '../../lib/format'

export default function FeaturedSlider({ items = [] }) {
  const featured = items
  if (featured.length === 0) {
    return (
      <section className="container-x py-14 md:py-16">
        <div className="skeleton h-[280px] rounded-[24px] md:h-[440px]" />
      </section>
    )
  }
  return (
    <section className="container-x py-14 md:py-16">
      <div className="relative overflow-hidden rounded-[24px] border border-line bg-surface/50">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop
          speed={800}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, el: '.featured-dots' }}
          navigation={{ prevEl: '.featured-prev', nextEl: '.featured-next' }}
          className="featured-swiper"
        >
          {featured.map((car) => (
            <SwiperSlide key={car.id}>
              <div className="grid items-stretch md:grid-cols-2">
                {/* image */}
                <div className="relative min-h-[280px] md:min-h-[440px]">
                  <SmartImage
                    src={car.image}
                    alt={car.name}
                    className="absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-surface via-surface/20 to-transparent md:from-surface md:via-surface/40" />
                  {car.tag && (
                    <span className="absolute right-5 top-5 rounded-full bg-neon px-3 py-1 text-xs font-bold text-bg glow-sm">
                      {car.tag}
                    </span>
                  )}
                </div>

                {/* details */}
                <div className="relative flex flex-col justify-center gap-5 p-7 md:p-12">
                  <span className="text-xs font-semibold text-sky">
                    خودروی ویژه · مدل {toFa(car.year)}
                  </span>
                  <h3 className="text-3xl font-black leading-tight text-ink md:text-4xl">
                    {car.name}
                  </h3>
                  <StatusBadges statuses={car.statuses} size="md" />
                  <Price product={car} size="lg" />
                  <div className="mt-1 flex flex-wrap gap-3">
                    <Link to={`/product/${car.slug}`} className="btn-neon">
                      مشاهده و ثبت سفارش
                      <ArrowLeft size={18} />
                    </Link>
                    <div className="flex items-center gap-2">
                      {car.colors.slice(0, 4).map((c) => (
                        <span
                          key={c.name}
                          title={c.name}
                          className="h-6 w-6 rounded-full ring-1 ring-line-strong"
                          style={{ background: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* controls */}
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex items-center justify-between px-5">
          <div className="featured-dots pointer-events-auto flex gap-2" />
          <div className="pointer-events-auto flex gap-2">
            <NavBtn className="featured-prev">
              <ChevronRight size={20} />
            </NavBtn>
            <NavBtn className="featured-next">
              <ChevronLeft size={20} />
            </NavBtn>
          </div>
        </div>
      </div>
    </section>
  )
}

function NavBtn({ children, className }) {
  return (
    <button
      className={`${className} grid h-11 w-11 place-items-center rounded-full border border-line bg-bg/70 text-ink backdrop-blur transition-colors hover:border-neon hover:text-neon-bright`}
    >
      {children}
    </button>
  )
}
