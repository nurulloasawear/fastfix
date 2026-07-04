import type { ReactNode } from 'react'

// KPI tile for dashboards. value is pre-formatted (e.g. formatUZS).
type Props = {
  label: string
  value: ReactNode
  delta?: { value: string; positive?: boolean }
  hint?: string
  className?: string
}

export function StatCard({ label, value, delta, hint, className = '' }: Props) {
  return (
    <div className={`flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 shadow-xs ${className}`}>
      <span className="text-xs font-medium text-muted">{label}</span>
      <div className="flex items-baseline gap-2">
        <strong className="text-xl font-semibold text-text">{value}</strong>
        {delta && (
          <span className={`text-xs font-medium ${delta.positive ? 'text-success' : 'text-error-text'}`}>
            {delta.value}
          </span>
        )}
      </div>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  )
}
