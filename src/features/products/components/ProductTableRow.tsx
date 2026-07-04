// Helper sub-components for ProductTable — extracted to keep ProductTable ≤200 lines.
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatUZS } from '@/utils/money'

export function ProductThumb({ thumbnails }: { thumbnails: string[] }) {
  return (
    <div className="flex gap-1">
      {[0, 1].map((i) => (
        <div key={i} className="h-12 w-12 shrink-0 rounded-md bg-bg border border-border overflow-hidden">
          {thumbnails[i] ? (
            <img src={thumbnails[i]} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-bg" />
          )}
        </div>
      ))}
    </div>
  )
}

export function PriceRange({ min, max }: { min: number; max: number }) {
  if (min === max) return <span>{formatUZS(min)}</span>
  const fmt = (n: number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(n)
  return <span>{fmt(min)} – {fmt(max)} so'm</span>
}

type RowActionsProps = {
  productId: string
  onDelist: () => void
  onDelete: () => void
  onDuplicate: () => void
}

export function RowActions({ productId, onDelist, onDelete, onDuplicate }: RowActionsProps) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-0.5 text-xs font-semibold">
      <Link to={`/products/${productId}/edit`} className="text-brand hover:text-accent">
        {t('products.action.edit')}
      </Link>
      <button type="button" className="text-left text-brand hover:text-accent" onClick={() => void 0}>
        {t('products.action.boost')}
      </button>
      <div className="relative group">
        <button type="button" className="text-left text-brand hover:text-accent">
          {t('products.action.more')}
        </button>
        <div className="absolute right-0 top-5 z-10 hidden min-w-[130px] flex-col rounded-lg border border-border bg-surface shadow-md group-focus-within:flex">
          <button type="button" onClick={onDelist} className="px-4 py-2 text-left text-xs hover:bg-bg">
            {t('products.action.delist')}
          </button>
          <button type="button" onClick={onDuplicate} className="px-4 py-2 text-left text-xs hover:bg-bg">
            {t('products.action.duplicate')}
          </button>
          <button type="button" onClick={onDelete} className="px-4 py-2 text-left text-xs text-error hover:bg-bg">
            {t('products.action.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}

export function PackagePlaceholder() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="8" y="20" width="48" height="36" rx="4" fill="#f2f4f7" stroke="#e4e7ec" strokeWidth="2" />
      <path d="M8 28h48" stroke="#e4e7ec" strokeWidth="2" />
      <path d="M24 20V14a8 8 0 0 1 16 0v6" stroke="#e4e7ec" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="40" r="5" fill="#d0d5dd" />
    </svg>
  )
}
