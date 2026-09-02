import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Header from './Header'
import Footer from './Footer'

export default function SiteLayout() {
  return (
    // dir="rtl" is enforced here (and via <html> below) so every storefront
    // route stays right-to-left regardless of per-page head tags.
    <div dir="rtl" className="relative flex min-h-svh flex-col">
      <Helmet>
        <html lang="fa" dir="rtl" />
        <body dir="rtl" />
      </Helmet>
      <Header />
      <main className="relative z-10 flex-1 pt-16 md:pt-[72px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
