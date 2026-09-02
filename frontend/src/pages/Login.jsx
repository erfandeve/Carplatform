import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login({ mode = 'login' }) {
  const isRegister = mode === 'register'
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/dashboard'

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        await register(form)
      } else {
        await login(form.phone, form.password)
      }
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(
        err.data?.phone?.[0] ||
          err.data?.detail ||
          'ورود ناموفق بود. اطلاعات را بررسی کنید.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-x flex min-h-[80vh] items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-[20px] border border-line bg-surface/70 p-7 md:p-9"
      >
        <h1 className="text-2xl font-black text-ink">
          {isRegister ? 'ساخت حساب کاربری' : 'ورود به شعبانی خودرو'}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {isRegister
            ? 'برای ثبت سفارش و پیگیری خرید، ثبت‌نام کنید.'
            : 'با شماره موبایل و رمز عبور وارد شوید.'}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="نام" value={form.first_name} onChange={set('first_name')} />
              <Field label="نام خانوادگی" value={form.last_name} onChange={set('last_name')} />
            </div>
          )}
          <Field
            label="شماره موبایل"
            value={form.phone}
            onChange={set('phone')}
            dir="ltr"
            placeholder="09xxxxxxxxx"
          />
          {isRegister && (
            <Field
              label="ایمیل (اختیاری)"
              value={form.email}
              onChange={set('email')}
              dir="ltr"
              type="email"
              required={false}
            />
          )}
          <Field
            label="رمز عبور"
            value={form.password}
            onChange={set('password')}
            type="password"
          />

          {error && (
            <p className="rounded-lg bg-danger/15 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-neon w-full">
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                {isRegister ? 'ثبت‌نام' : 'ورود'}
                <ArrowLeft size={18} />
              </>
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {isRegister ? 'قبلاً ثبت‌نام کرده‌اید؟ ' : 'حساب کاربری ندارید؟ '}
          <Link
            to={isRegister ? '/login' : '/register'}
            state={location.state}
            className="font-bold text-sky hover:text-neon-bright"
          >
            {isRegister ? 'ورود' : 'ثبت‌نام'}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted">{label}</span>
      <input
        {...props}
        required={props.required !== false}
        className="w-full rounded-xl border border-line bg-bg-2 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-neon"
      />
    </label>
  )
}
