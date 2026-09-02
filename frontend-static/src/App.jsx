import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Regulation from './pages/Regulation'
import About from './pages/About'
import Contact from './pages/Contact'
import Articles from './pages/Articles'
import Article from './pages/Article'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Placeholder from './pages/Placeholder'
import NotFound from './pages/NotFound'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminProducts from './admin/pages/AdminProducts'
import AdminCategories from './admin/pages/AdminCategories'
import AdminArticles from './admin/pages/AdminArticles'
import AdminRegulations from './admin/pages/AdminRegulations'
import AdminOrders from './admin/pages/AdminOrders'
import AdminTickets from './admin/pages/AdminTickets'
import AdminReviews from './admin/pages/AdminReviews'
import AdminUsers from './admin/pages/AdminUsers'
import AdminSettings from './admin/pages/AdminSettings'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Storefront */}
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/regulations/:slug" element={<Regulation />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<Article />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login mode="login" />} />
          <Route path="/register" element={<Login mode="register" />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/faq" element={<Placeholder title="سوالات متداول" />} />
        </Route>

        {/* Admin panel — independent layout & theme */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="regulations" element={<AdminRegulations />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
