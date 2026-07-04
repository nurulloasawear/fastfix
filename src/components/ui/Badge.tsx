import type { ReactNode } from 'react'

// Untitled-UI status pill: light bg + dark text, rounded-md (not a full pill).
// purple/orange added (RT-015, RTS-016) so adjacent statuses (e.g. Under Review
// vs Returning, Paid vs Processing) are visually distinct.
type Tone = 'gray' | 'brand' | 'success' | 'error' | 'warning' | 'info' | 'purple' | 'orange'

const TONES: Record<Tone, string> = {
  gray: 'bg-[#f2f4f7] text-[#344054]',
  brand: 'bg-[#f5efea] text-brand',
  success: 'bg-success-bg text-success',
  error: 'bg-error-bg text-error-text',
  warning: 'bg-warning-bg text-warning',
  info: 'bg-[#eff8ff] text-[#175cd3]',
  purple: 'bg-[#f4f3ff] text-[#5925dc]',
  orange: 'bg-[#fff6ed] text-[#c4320a]',
}

type Props = { tone?: Tone; children: ReactNode; className?: string }

export function Badge({ tone = 'gray', children, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
