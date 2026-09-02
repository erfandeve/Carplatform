import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/thumbs'
import { Check, Loader2, ShieldCheck, Star } from 'lucide-react'
import SmartImage from '../components/ui/SmartImage'
import StatusBadges from '../components/ui/StatusBadges'
import StarRating from '../components/ui/StarRating'
import Price from '../components/ui/Price'
import ProductCard from '../components/ui/ProductCard'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { toFa } from '../lib/format'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [thumbs, setThumbs] = useState(null)
  const [color, setColor] = useState('')
  const [msg, setMsg] = useState('')
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    setLoading(true)
    setMsg('')
    setColor('')
    api
      .get(`/products/${slug}/`)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
    window.scrollTo(0, 0)
  }, [slug])

  if (loading) {
    return (
      <div className="container-x grid gap-8 py-12 lg:grid-cols-2">
        <div className="skeleton aspect-[4/3] rounded-card" />
        <div className="space-y-4">
          <div className="skeleton h-8 w-2/3 rounded" />
          <div className="skeleton h-5 w-1/3 rounded" />
          <div className="skeleton h-10 w-1/2 rounded" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-x py-24 text-center text-muted">
        محصول یافت نشد. <Link to="/products" className="text-sky">بازگشت به محصولات</Link>
      </div>
    )
  }

  const isCar = product.kind === 'car' || product.kind === 'used'
  const images = product.gallery?.length ? product.gallery : [product.image]
  const specs = Object.entries(product.specs || {})

  const placeOrder = async () => {
    setMsg('')
    if (isCar && product.colors?.length && !color) {
      setMsg('لطفاً یک رنگ را انتخاب کنید.')
      return
    }
    if (!user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    setPlacing(true)
    try {
      await api.post(
        '/orders/',
        {
          order_type: product.kind === 'used' ? 'used' : 'normal',
          product: product.slug,
          selected_color: color,
        },
        { auth: true },
      )
      navigate('/dashboard', { state: { justOrdered: true } })
    } catch {
      setMsg('ثبت سفارش با خطا مواجه شد. دوباره تلاش کنید.')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="container-x py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-card border border-line">
            <Swiper modules={[Thumbs]} thumbs={{ swiper: thumbs }} spaceBetween={10}>
              {images.map((src, i) => (
                <SwiperSlide key={i}>
                  <SmartImage src={src} alt={product.name} className="aspect-[4/3]" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {images.length > 1 && (
            <Swiper
              modules={[Thumbs]}
              onSwiper={setThumbs}
              slidesPerView={4}
              spaceBetween={8}
              watchSlidesProgress
              className="mt-3"
            >
              {images.map((src, i) => (
                <SwiperSlide key={i} className="cursor-pointer overflow-hidden rounded-lg border border-line">
                  <SmartImage src={src} alt="" className="aspect-[4/3]" />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* Info */}
        <div>
          {product.tag && (
            <span className="mb-3 inline-block rounded-full bg-neon px-2.5 py-1 text-[11px] font-bold text-bg">
              {product.tag}
            </span>
          )}
          <h1 className="text-3xl font-black text-ink">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <StarRating value={product.rating} count={product.reviews} size={16} />
            {product.year && <span className="text-sm text-muted">مدل {toFa(product.year)}</span>}
          </div>

          {isCar && (
            <div className="mt-4">
              <StatusBadges statuses={product.statuses} size="md" />
            </div>
          )}

          <div className="mt-6 rounded-card border border-line bg-surface/60 p-5">
            <Price product={product} size="lg" />
          </div>

          {/* Color selection */}
          {isCar && product.colors?.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-ink">
                انتخاب رنگ خودرو {color && <span className="text-faint">— {color}</span>}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setColor(c.name)}
                    className={`grid h-10 w-10 place-items-center rounded-full ring-2 transition-all ${
                      color === c.name ? 'ring-neon' : 'ring-line-strong hover:ring-muted'
                    }`}
                    style={{ background: c.hex }}
                  >
                    {color === c.name && (
                      <Check size={16} className="text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {msg && (
            <p className="mt-4 rounded-lg bg-danger/15 px-3 py-2 text-sm text-danger">{msg}</p>
          )}

          <button onClick={placeOrder} disabled={placing} className="btn-neon mt-6 w-full sm:w-auto">
            {placing ? <Loader2 size={18} className="animate-spin" /> : 'ثبت سفارش'}
          </button>

          <div className="mt-5 flex items-center gap-2 text-sm text-muted">
            <ShieldCheck size={16} className="text-free-perm" />
            ضمانت اصالت، مدارک کامل و پشتیبانی مرحله‌به‌مرحله
          </div>

          {product.description && (
            <p className="mt-6 text-sm leading-8 text-ink-2">{product.description}</p>
          )}
        </div>
      </div>

      {/* Specs */}
      {specs.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-ink">مشخصات فنی</h2>
          <div className="grid gap-2 rounded-card border border-line bg-surface/50 p-5 sm:grid-cols-2">
            {specs.map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-line/60 py-2 text-sm">
                <span className="text-muted">{k}</span>
                <span className="font-semibold text-ink">{v}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold text-ink">نظرات کاربران</h2>
        {product.reviewList?.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {product.reviewList.map((r) => (
              <div key={r.id} className="rounded-card border border-line bg-surface/50 p-5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink">{r.name}</span>
                  <span className="flex items-center gap-1 text-gozar-temp">
                    <Star size={14} fill="currentColor" />
                    {toFa(r.rating)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-muted">{r.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">هنوز نظری ثبت نشده است.</p>
        )}
      </section>

      {/* Related */}
      {product.related?.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 text-xl font-bold text-ink">محصولات مرتبط</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {product.related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
