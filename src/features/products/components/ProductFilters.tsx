import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { ChevronDown } from './icons'

// Shopee-style two-row filter bar: search + category on row 1, label on row 2.
type Props = {
  searchValue: string
  onSearchChange: (v: string) => void
  onApply: () => void
  onReset: () => void
  showLabelFilter?: boolean
  labelValue?: string
  onLabelChange?: (v: string) => void
}

export function ProductFilters({
  searchValue,
  onSearchChange,
  onApply,
  onReset,
  showLabelFilter = false,
  labelValue = '',
}: Props) {
  const { t } = useTranslation()

  return (
    <Card className="p-4">
      {/* Row 1: search + category */}
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-1 items-end gap-2 min-w-[200px]">
          <div className="flex-1">
            <Input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onApply()}
              placeholder={t('products.searchPlaceholder')}
            />
          </div>
          <button
            type="button"
            className="flex h-11 items-center gap-2 rounded-lg border border-border-strong bg-surface px-3 text-sm text-muted hover:bg-bg transition-colors"
          >
            <span className="truncate max-w-[140px]">{t('products.searchByCategory')}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
            </svg>
          </button>
        </div>
        <Button size="sm" onClick={onApply}>{t('products.apply')}</Button>
        <Button size="sm" variant="outline" onClick={onReset}>{t('products.reset')}</Button>
      </div>

      {/* Row 2: product label (shown on Live + Unpublished tabs) */}
      {showLabelFilter && (
        <div className="mt-2 flex flex-wrap items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text-secondary">{t('products.productLabel')}:</span>
            <button
              type="button"
              className="flex h-9 items-center gap-1 rounded-lg border border-border-strong bg-surface px-3 text-sm text-muted hover:bg-bg transition-colors"
            >
              {labelValue || t('products.selectLabel')}
              <ChevronDown size={14} />
            </button>
          </div>
          <Button size="sm" onClick={onApply}>{t('products.apply')}</Button>
          <Button size="sm" variant="outline" onClick={onReset}>{t('products.reset')}</Button>
        </div>
      )}
    </Card>
  )
}
