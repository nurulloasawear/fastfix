import type { SelectHTMLAttributes } from 'react'

// Select styled to match Input (44px, Gray/300 border, focus ring).
type Props = SelectHTMLAttributes<HTMLSelectElement> & { label?: string }

export function Select({ label, className = '', children, ...props }: Props) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-semibold text-text-secondary">{label}</span>}
      <select
        className={`h-11 rounded-lg border border-border-strong bg-surface px-3 text-sm text-text outline-none transition focus:border-brand focus:ring-4 focus:ring-[#f2f4f7] ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}
