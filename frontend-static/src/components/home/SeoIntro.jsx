import { Link } from 'react-router-dom'

/**
 * Keyword-rich intro copy for the homepage. Provides the page's single
 * <h1> and crawlable internal links — important for ranking on
 * «اتوشعبانی» / «شعبانی خودرو» / «خرید خودرو منطقه آزاد».
 */
export default function SeoIntro() {
  return (
    <section className="container-x py-12 md:py-16">
      <div className="rounded-[24px] border border-line bg-surface/40 p-6 md:p-10">
        <h1 className="text-2xl font-black leading-tight text-ink md:text-3xl">
          شعبانی خودرو (اتوشعبانی) | خرید خودرو منطقه آزاد گلستان
        </h1>
        <div className="mt-5 grid gap-4 text-sm leading-8 text-muted md:grid-cols-2 md:gap-8">
          <p>
            <strong className="text-ink-2">شعبانی خودرو</strong> (با نام دامنه{' '}
            <strong className="text-ink-2">اتوشعبانی</strong>) مرجع تخصصی
            <Link to="/products" className="text-sky hover:text-neon-bright"> خرید خودرو منطقه آزاد</Link> در
            استان گلستان است. در شعبانی خودرو، خودروهای صفر کیلومتر وارداتی با
            <Link to="/regulations/mantaghe-azad" className="text-sky hover:text-neon-bright"> پلاک منطقه آزاد</Link> و
            قیمت شفاف عرضه می‌شوند. هدف ما این است که فرآیند خرید ماشین منطقه آزاد را
            ساده، مطمئن و کاملاً قابل پیگیری کنیم.
          </p>
          <p>
            در شعبانی خودرو می‌توانید مدل‌های موجود را ببینید، وضعیت گمرکی هر خودرو را
            شفاف مشاهده کنید، رنگ دلخواه را انتخاب کنید و سفارش خود را ثبت و پیگیری کنید.
            برای آشنایی بیشتر، مقالات
            <Link to="/articles/kharid-mashin-mantaghe-azad" className="text-sky hover:text-neon-bright"> خرید ماشین منطقه آزاد</Link> و
            <Link to="/articles/rahnamaye-kharid-mashin" className="text-sky hover:text-neon-bright"> راهنمای خرید ماشین</Link> را مطالعه کنید،
            قوانین
            <Link to="/regulations/mantaghe-azad" className="text-sky hover:text-neon-bright"> پلاک منطقه آزاد گلستان</Link> را ببینید یا با
            <Link to="/contact" className="text-sky hover:text-neon-bright"> کارشناسان اتوشعبانی</Link> در تماس باشید.
          </p>
        </div>
      </div>
    </section>
  )
}
