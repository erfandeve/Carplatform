import { Link } from 'react-router-dom'
import { ShieldCheck, Globe2, FileCheck2, Headset, ArrowLeft } from 'lucide-react'
import Reveal from '../ui/Reveal'

const FEATURES = [
  {
    icon: Globe2,
    title: 'واردات مستقیم',
    text: 'تأمین خودرو از بازارهای معتبر امارات، عمان و قطر بدون واسطه‌های اضافی.',
  },
  {
    icon: FileCheck2,
    title: 'مدارک کامل و شفاف',
    text: 'ارائه اسناد گمرکی، وضعیت گذر یا منطقه آزاد و مدارک اصالت برای هر خودرو.',
  },
  {
    icon: ShieldCheck,
    title: 'ضمانت سلامت',
    text: 'کارشناسی فنی و تضمین سلامت بدنه و موتور، مخصوصاً برای خودروهای دسته دوم.',
  },
  {
    icon: Headset,
    title: 'پشتیبانی مرحله‌به‌مرحله',
    text: 'پیگیری سفارش در هشت مرحله شفاف و پاسخگویی از طریق سیستم تیکتینگ.',
  },
]

export default function AboutSection() {
  return (
    <section className="container-x py-14 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal>
          <span className="text-sm font-semibold text-sky">درباره شعبانی خودرو</span>
          <h2 className="mt-3 text-3xl font-black leading-tight text-ink md:text-4xl">
            تخصص ما، واردات مطمئن خودروهای لوکس
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted">
            بیش از یک دهه است که خرید ماشین وارداتی را برای مشتریان ساده و مطمئن
            کرده‌ایم. تمام خودروها از کشورهای حوزه خلیج فارس تأمین می‌شوند و با
            وضعیت مشخص گذر یا منطقه آزاد، همراه با قیمت‌گذاری شفاف درهمی و تومانی
            عرضه می‌گردند.
          </p>
          <Link to="/about" className="btn-ghost mt-7">
            بیشتر بدانید
            <ArrowLeft size={18} />
          </Link>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="group h-full rounded-card border border-line bg-surface/60 p-5 transition-colors duration-500 hover:border-neon/60">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-bg-2 text-sky transition-colors duration-500 group-hover:border-neon group-hover:text-neon-bright">
                  <f.icon size={20} />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
