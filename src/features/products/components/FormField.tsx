import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { ChevronDown } from './icons'

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-text-secondary">{label}</span>
      {children}
    </label>
  )
}

const inputCls =
  'h-11 w-full rounded-lg border border-border-strong bg-surface px-3.5 text-sm text-text outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-[#f2f4f7]'

export function TextField(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ''}`} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${inputCls} h-auto min-h-24 resize-y py-2.5 ${props.className ?? ''}`}
    />
  )
}

// Placeholder dropdown (prototype categories are static selects). Shows current value.
export function SelectField({
  label,
  value,
  placeholder,
}: {
  label: string
  value?: string
  placeholder: string
}) {
  return (
    <FormField label={label}>
      <button
        type="button"
        className="flex h-11 items-center justify-between rounded-lg border border-border-strong bg-surface px-3.5 text-sm text-text transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-[#f2f4f7]"
      >
        <span className={value ? 'text-text' : 'text-muted'}>{value || placeholder}</span>
        <ChevronDown size={16} className="text-muted" />
      </button>
    </FormField>
  )
}
