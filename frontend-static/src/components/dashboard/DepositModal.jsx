import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, CreditCard, Loader2 } from 'lucide-react'
import { api } from '../../lib/api'
import { faNumber } from '../../lib/format'

/**
 * Deposit flow: show scrollable terms → user checks acceptance → the
 * "reveal card" button enables → card details appear. Acceptance time
 * is persisted on the order for admin auditing.
 */
export default function DepositModal({ order, onClose, onAccepted }) {
  const [settings, setSettings] = useState(null)
  const [accepted, setAccepted] = useState(order.deposit?.accepted || false)
  const [revealed, setRevealed] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/settings/deposit/', { auth: true }).then(setSettings).catch(() => {})
  }, [])

  const confirm = async () => {
    setSaving(true)
    try {
      if (!order.deposit?.accepted) {
        await api.post(`/orders/${order.id}/accept_terms/`, {}, { auth: true })
        onAccepted?.()
      }
      setRevealed(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 grid place-items-center p-4" style={{ zIndex: 'var(--z-modal)' }}>
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg rounded-[20px] border border-line bg-bg-2 p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black text-ink">پرداخت بیعانه</h3>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink">
            <X size={18} />
          </button>
        </div>

        {!revealed ? (
          <>
            <div className="max-h-56 overflow-y-auto rounded-xl border border-line bg-surface/60 p-4 text-sm leading-7 text-muted">
              {settings?.terms_text || 'در حال بارگذاری قوانین…'}
            </div>
            <label className="mt-4 flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[var(--color-neon)]"
              />
              <span className="text-sm text-ink">
                قوانین و شرایط پرداخت بیعانه را مطالعه کردم و می‌پذیرم.
              </span>
            </label>
            <button
              onClick={confirm}
              disabled={!accepted || saving}
              className="btn-neon mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  <CreditCard size={18} />
                  مشاهده شماره کارت
                </>
              )}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-neon/40 bg-neon/10 p-5 text-center">
              <p className="text-xs text-muted">مبلغ قابل واریز</p>
              <p className="mt-1 text-2xl font-black text-sky">
                {faNumber(settings?.deposit_amount_toman || 0)} تومان
              </p>
            </div>
            <Row label="شماره کارت" value={settings?.card_number} />
            <Row label="شماره شبا" value={settings?.sheba} />
            <Row label="به نام" value={settings?.card_holder} />
            <p className="text-xs text-faint">
              پس از واریز، فیش پرداخت را از طریق سیستم تیکتینگ ارسال کنید.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-surface/60 px-4 py-3">
      <span className="text-sm text-muted">{label}</span>
      <span className="font-mono text-sm font-bold text-ink" dir="ltr">{value}</span>
    </div>
  )
}
