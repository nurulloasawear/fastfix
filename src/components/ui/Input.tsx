import type { InputHTMLAttributes, ReactNode } from 'react'

// Zenith input: 44px tall, Gray/300 border, 8px radius, bold label, gray placeholder,
// 4px focus ring.
type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
  error?: string
  trailing?: ReactNode
}

export function Input({ label, hint, error, trailing, className = '', ...props }: Props) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-semibold text-text-secondary">{label}</span>}
      <span className="relative flex items-center">
        <input
          className={`h-11 w-full rounded-lg border bg-surface px-3.5 text-sm text-text outline-none transition placeholder:text-muted focus:ring-4 focus:ring-[#f2f4f7] ${
            error ? 'border-error focus:border-error' : 'border-border-strong focus:border-brand'
          } ${trailing ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {trailing && <span className="absolute right-3 text-muted">{trailing}</span>}
      </span>
      {error ? (
        <span className="text-xs text-error-text">{error}</span>
      ) : (
        hint && <span className="text-xs text-muted">{hint}</span>
      )}
    </label>
  )
}
