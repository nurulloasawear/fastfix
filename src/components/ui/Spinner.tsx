// Brand loading spinner.
export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-border-strong border-t-brand ${className}`}
    />
  )
}
