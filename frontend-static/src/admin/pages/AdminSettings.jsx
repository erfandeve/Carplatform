import { useEffect, useState } from 'react'
import { Check, Coins, CreditCard } from 'lucide-react'
import { aget, aput } from '../lib'
import { api } from '../../lib/api'
import { faNumber } from '../../lib/format'

export default function AdminSettings() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ExchangeRateCard />
      <DepositCard />
    </div>
  )
}

function ExchangeRateCard() {
  const [rate, setRate] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => { api.get('/settings/exchange-rate/').then((d) => setRate(d.rate)) }, [])

  const save = async () => {
    await aput('/settings/exchange-rate/', { rate: +rate })
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="admin-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Coins size={18} className="text-admin-primary" />
        <h2 className="font-bold text-admin-ink">نرخ تبدیل ارز</h2>
      </div>
      <p className="mb-4 text-sm text-admin-muted">
        قیمت هر ۱ درهم به تومان. با تغییر این مقدار، قیمت نهایی همه خودروها در کل سایت آنی به‌روز می‌شود.
      </p>
      <span className="admin-label">هر ۱ درهم = ؟ تومان</span>
      <input className="admin-input" type="number" dir="ltr" value={rate} onChange={(e) => setRate(e.target.value)} />
      <p className="mt-2 text-xs text-admin-muted">
        مثال: خودروی ۱۰۰٬۰۰۰ درهمی = {rate ? faNumber(100000 * (+rate)) : '—'} تومان
      </p>
      <button onClick={save} className="admin-btn mt-4">
        {saved ? <><Check size={16} /> ذخیره شد</> : 'ذخیره نرخ'}
      </button>
    </div>
  )
}

function DepositCard() {
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => { aget('/settings/deposit/').then(setForm) }, [])

  const save = async () => {
    await aput('/settings/deposit/', form)
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  if (!form) return <div className="admin-card h-64 animate-pulse" />

  return (
    <div className="admin-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <CreditCard size={18} className="text-admin-primary" />
        <h2 className="font-bold text-admin-ink">تنظیمات بیعانه</h2>
      </div>
      <div className="space-y-3">
        <div><span className="admin-label">متن قوانین بیعانه</span><textarea rows={4} className="admin-textarea" value={form.terms_text} onChange={(e) => set('terms_text', e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><span className="admin-label">شماره کارت</span><input className="admin-input" dir="ltr" value={form.card_number} onChange={(e) => set('card_number', e.target.value)} /></div>
          <div><span className="admin-label">مبلغ بیعانه (تومان)</span><input className="admin-input" type="number" dir="ltr" value={form.deposit_amount_toman} onChange={(e) => set('deposit_amount_toman', +e.target.value || 0)} /></div>
          <div><span className="admin-label">شماره شبا</span><input className="admin-input" dir="ltr" value={form.sheba} onChange={(e) => set('sheba', e.target.value)} /></div>
          <div><span className="admin-label">به نام</span><input className="admin-input" value={form.card_holder} onChange={(e) => set('card_holder', e.target.value)} /></div>
        </div>
      </div>
      <button onClick={save} className="admin-btn mt-4">
        {saved ? <><Check size={16} /> ذخیره شد</> : 'ذخیره تنظیمات'}
      </button>
    </div>
  )
}
