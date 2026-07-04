import type { HTMLAttributes } from 'react'

// Zenith card: white surface, subtle Gray/200 border, xs shadow, 8px radius.
export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-lg border border-border bg-surface shadow-xs ${className}`} {...props} />
}
