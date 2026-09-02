import { motion, useReducedMotion } from 'framer-motion'

/**
 * Scroll-in reveal. Content is visible by default (opacity animates
 * from a real element, never gated behind display:none) and the whole
 * effect collapses to an instant show under reduced-motion.
 */
export default function Reveal({ children, delay = 0, y = 24, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
