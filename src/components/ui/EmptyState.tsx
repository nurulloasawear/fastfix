import type { ReactNode } from 'react'

// Consistent empty state: optional icon, title, description, optional action.
type Props = {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className = '' }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 px-6 py-16 text-center ${className}`}>
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg text-muted">{icon}</div>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-text">{title}</p>
        {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
