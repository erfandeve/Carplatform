import { Helmet } from 'react-helmet-async'
import { SITE } from '../lib/seo'

/**
 * Per-page SEO head: title, description, keywords, canonical, Open Graph,
 * Twitter card, and any JSON-LD structured data. Google renders these on
 * crawl; for maximum coverage add prerendering at deploy (see README).
 */
export default function Seo({
  title,
  description = SITE.defaultDescription,
  keywords,
  path = '',
  image = SITE.ogImage,
  type = 'website',
  jsonLd,
  noindex = false,
}) {
  const hasBrand =
    title && (title.includes(SITE.nameFa) || title.includes(SITE.nameEn))
  const fullTitle = title
    ? hasBrand
      ? title
      : `${title} | ${SITE.nameFa}`
    : SITE.defaultTitle
  const canonical = `${SITE.url}${path}`
  const ogImage = image.startsWith('http') ? image : `${SITE.url}${image}`
  const kw = (keywords && keywords.length ? keywords : SITE.keywords).join('، ')
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet prioritizeSeoTags>
      <html lang="fa" dir="rtl" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={kw} />
      <link rel="canonical" href={canonical} />
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}
      />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.nameFa} />
      <meta property="og:locale" content={SITE.locale} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content={SITE.twitter} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  )
}
