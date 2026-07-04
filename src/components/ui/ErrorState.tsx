import { Button } from './Button'

// Consistent API-error state with retry (OD-008, RTS-009, UX-006, UX-010).
// Callers pass i18n-resolved strings so this stays locale-agnostic.
type Props = {
  title?: string
  description?: string
  retryLabel?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Failed to load data',
  description,
  retryLabel = 'Retry',
  onRetry,
  className = '',
}: Props) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 px-6 py-16 text-center ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-bg text-lg font-bold text-error-text">
        !
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-text">{title}</p>
        {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
