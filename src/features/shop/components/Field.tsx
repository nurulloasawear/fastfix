const INPUT_CLASS =
  'h-11 w-full rounded-lg border border-border-strong bg-surface px-3.5 text-sm text-text outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-[#f2f4f7]'

const LABEL_CLASS = 'block text-sm font-semibold text-text-secondary'

type FieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  required?: boolean
  className?: string
}

export function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  className = '',
}: FieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className={LABEL_CLASS}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={INPUT_CLASS}
      />
    </div>
  )
}

type TextAreaProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export function TextAreaField({ label, value, onChange, placeholder, rows = 4 }: TextAreaProps) {
  return (
    <div className="space-y-1.5">
      <label className={LABEL_CLASS}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${INPUT_CLASS} h-auto resize-none py-2.5 leading-relaxed`}
      />
    </div>
  )
}
