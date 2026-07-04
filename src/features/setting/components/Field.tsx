import type { InputHTMLAttributes, ReactNode } from 'react'

// Labeled input row shared by the account + address forms. `trailing` renders an
// icon/badge on the right (e.g. the edit pencil). Falls through native input props.
interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  trailing?: ReactNode
}

export function Field({ label, trailing, className = '', ...props }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-text-secondary">{label}</span>
      <div className="flex h-11 items-center gap-2 rounded-lg border border-border-strong bg-surface px-3.5 transition focus-within:border-brand focus-within:ring-4 focus-within:ring-[#f2f4f7]">
        <input
          className={`w-full bg-transparent text-sm text-text outline-none placeholder:text-muted disabled:text-muted ${className}`}
          {...props}
        />
        {trailing}
      </div>
    </label>
  )
}
