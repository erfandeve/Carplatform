// Central SEO/site config for شعبانی خودرو (اتوشعبانی / Shabanikhodro).
// ⚠️ قبل از دیپلوی: اگر پسوند دامنه فرق دارد (مثلاً .ir)، فقط همین `url` را عوض کن.
export const SITE = {
  // نام اصلی سایت «شعبانی خودرو» است؛ «اتوشعبانی» نام دامنه و کلیدواژه مهم دوم.
  nameFa: 'شعبانی خودرو',
  nameEn: 'Shabanikhodro',
  url: 'https://autoshabani.com',
  locale: 'fa_IR',
  phone: '+98-17-0000-0000',
  email: 'info@autoshabani.com',
  address: 'استان گلستان',
  defaultTitle:
    'شعبانی خودرو (اتوشعبانی) | خرید خودرو منطقه آزاد گلستان',
  defaultDescription:
    'شعبانی خودرو (اتوشعبانی) مرجع تخصصی خرید خودرو منطقه آزاد در گلستان؛ فروش خودروهای صفر وارداتی با پلاک منطقه آزاد، قیمت شفاف و فرآیند مطمئن.',
  keywords: [
    'شعبانی خودرو',
    'اتوشعبانی',
    'اتو شعبانی',
    'Shabanikhodro',
    'autoshabani',
    'خرید خودرو منطقه آزاد',
    'خرید ماشین منطقه آزاد',
    'پلاک منطقه آزاد',
    'خرید خودرو منطقه آزاد گلستان',
    'خرید ماشین وارداتی',
    'واردات خودرو',
  ],
  ogImage: '/og-cover.svg',
  twitter: '@autoshabani',
}

/** Organization / LocalBusiness JSON-LD reused across the site. */
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: SITE.nameFa,
  alternateName: ['اتوشعبانی', 'AutoShabani', 'Shabanikhodro'],
  url: SITE.url,
  image: `${SITE.url}${SITE.ogImage}`,
  logo: `${SITE.url}/favicon.svg`,
  description: SITE.defaultDescription,
  telephone: SITE.phone,
  email: SITE.email,
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'گلستان',
    addressCountry: 'IR',
  },
  areaServed: 'IR',
  knowsLanguage: ['fa', 'en'],
  sameAs: [
    'https://instagram.com/autoshabani',
    'https://t.me/autoshabani',
  ],
}

export const breadcrumbJsonLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${SITE.url}${it.path}`,
  })),
})
