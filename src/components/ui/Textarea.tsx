import type { TextareaHTMLAttributes } from 'react'

// Textarea styled to match Input.
type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; hint?: string }

export function Textarea({ label, hint, className = '', ...props }: Props) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-semibold text-text-secondary">{label}</span>}
      <textarea
        className={`min-h-[88px] rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-[#f2f4f7] ${className}`}
        {...props}
      />
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  )
}
