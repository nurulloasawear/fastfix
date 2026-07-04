import { useState } from 'react'

// <img> with a graceful fallback (RT-014, RTS-019) — shows a neutral product
// placeholder instead of a broken-image icon when src is missing or fails.
type Props = {
  src?: string | null
  alt?: string
  className?: string
}

export function Image({ src, alt = '', className = '' }: Props) {
  const [errored, setErrored] = useState(false)

  if (!src || errored) {
    return (
      <div className={`flex items-center justify-center bg-bg text-muted ${className}`} aria-label={alt || 'no image'}>
        <svg width="40%" height="40%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setErrored(true)} />
}
