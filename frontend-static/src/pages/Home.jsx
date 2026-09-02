import { useEffect, useState } from 'react'
import Seo from '../components/Seo'
import RegulationBanner from '../components/home/RegulationBanner'
import Hero from '../components/home/Hero'
import SeoIntro from '../components/home/SeoIntro'
import AllProducts from '../components/home/AllProducts'
import Testimonials from '../components/home/Testimonials'
import AboutSection from '../components/home/AboutSection'
import CustomRequestCTA from '../components/home/CustomRequestCTA'
import ArticlesSection from '../components/home/ArticlesSection'
import { api, asList } from '../lib/api'
import { SITE } from '../lib/seo'

export default function Home() {
  const [data, setData] = useState({
    heroCars: [],
    articles: [],
    testimonials: [],
    regulations: [],
  })

  useEffect(() => {
    let alive = true
    Promise.all([
      api.get('/products/?featured=1'),
      api.get('/products/?kind=car&sort=new&page_size=8'),
      api.get('/articles/'),
      api.get('/testimonials/'),
      api.get('/regulations/'),
    ])
      .then(([featured, newest, articles, testimonials, regulations]) => {
        if (!alive) return
        const feat = asList(featured)
        // If nothing is flagged «ویژه», fall back to the newest cars so the
        // hero slider is never stuck on an empty loading state.
        // Cap the hero to at most 4 cars.
        const heroCars = (feat.length ? feat : asList(newest)).slice(0, 4)
        setData({
          heroCars,
          articles: asList(articles),
          testimonials: asList(testimonials),
          regulations: asList(regulations),
        })
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.nameFa,
      alternateName: SITE.nameEn,
      url: SITE.url,
      inLanguage: 'fa-IR',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE.url}/products?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]

  return (
    <>
      <Seo path="/" jsonLd={jsonLd} />
      <RegulationBanner items={data.regulations} />
      <Hero cars={data.heroCars} />
      <SeoIntro />
      <AllProducts />
      <Testimonials items={data.testimonials} />
      <AboutSection />
      <CustomRequestCTA />
      <ArticlesSection items={data.articles} />
    </>
  )
}
