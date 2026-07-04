import type { ReactNode } from 'react'

type Props = {
  label: string
  value: ReactNode
  icon?: ReactNode
  iconClass?: string
  hint?: ReactNode
}

export function StatCard({ label, value, icon, iconClass = '', hint }: Props) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-5 shadow-xs">
      {icon && (
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconClass}`}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <div className="text-2xl font-semibold text-text">{value}</div>
        <div className="truncate text-xs font-medium text-muted">{label}</div>
        {hint}
      </div>
    </div>
  )
}
