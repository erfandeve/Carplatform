import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function AdminModal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 grid place-items-center p-4" style={{ zIndex: 'var(--z-modal)' }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`admin-card relative max-h-[90vh] w-full overflow-y-auto ${wide ? 'max-w-3xl' : 'max-w-lg'}`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-admin-line bg-admin-surface px-5 py-4">
          <h3 className="font-bold text-admin-ink">{title}</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg border border-admin-line text-admin-muted hover:text-admin-ink">
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </div>
  )
}
