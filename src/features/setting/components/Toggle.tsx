// Reusable switch toggle. Brand-coloured when on; used by notifications + 2FA.
interface ToggleProps {
  checked: boolean
  disabled?: boolean
  onChange: () => void
  label?: string
}

export function Toggle({ checked, disabled = false, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors ${
        checked ? 'bg-brand' : 'bg-border'
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
