import { useEffect, useRef, useState } from 'react'

/**
 * Image with skeleton-while-loading and a graceful neon gradient
 * fallback if the source fails (e.g. offline). Keeps layout stable.
 * Handles cached images (whose `load` event may not fire after a
 * remount) by checking `complete` on mount and whenever `src` changes.
 */
export default function SmartImage({ src, alt, className = '', imgClassName = '' }) {
  const [state, setState] = useState('loading') // loading | ok | error
  const imgRef = useRef(null)

  useEffect(() => {
    setState('loading')
    const img = imgRef.current
    if (img && img.complete) {
      setState(img.naturalWidth > 0 ? 'ok' : 'error')
    }
  }, [src])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {state === 'loading' && <div className="skeleton absolute inset-0" />}
      {state === 'error' && (
        <div
          className="absolute inset-0 grid place-items-center"
          style={{
            background:
              'radial-gradient(120% 120% at 70% 0%, oklch(0.3 0.09 250), oklch(0.17 0.03 258))',
          }}
          aria-label={alt}
        >
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-neon/60" fill="none">
            <path
              d="M5 17h14M6.5 17l1-4.5A2 2 0 0 1 9.4 11h5.2a2 2 0 0 1 1.9 1.5l1 4.5M7 17v2M17 17v2M8 14h8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        decoding="async"
        onLoad={() => setState('ok')}
        onError={() => setState('error')}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          state === 'ok' ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  )
}
