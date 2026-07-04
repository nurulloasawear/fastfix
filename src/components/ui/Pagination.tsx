// Minimal pagination (prev / page-count / next).
type Props = { page: number; totalPages: number; onChange: (page: number) => void; className?: string }

export function Pagination({ page, totalPages, onChange, className = '' }: Props) {
  if (totalPages <= 1) return null
  const btn = 'rounded-md border border-border-strong px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40'
  return (
    <div className={`flex items-center justify-end gap-1 ${className}`}>
      <button type="button" className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        ‹
      </button>
      <span className="px-2 text-sm text-muted">
        {page} / {totalPages}
      </span>
      <button type="button" className={btn} disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
        ›
      </button>
    </div>
  )
}
