import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { InfoIcon } from './icons'
import { Link } from 'react-router-dom'
import type { Product } from '../types/products.types'
import { ProductThumb, PriceRange, RowActions, PackagePlaceholder } from './ProductTableRow'

type Props = {
  products: Product[]
  isLoading: boolean
  showDiagnosis?: boolean
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onSelectAll: (ids: string[]) => void
  onDelist: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

export function ProductTable({
  products, isLoading, showDiagnosis = false,
  selectedIds, onToggleSelect, onSelectAll,
  onDelist, onDelete, onDuplicate,
}: Props) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<PackagePlaceholder />}
        title={t('products.noProductFound')}
      />
    )
  }

  const allSelected = products.length > 0 && products.every((p) => selectedIds.includes(p.id))

  return (
    <Table>
      <thead>
        <Tr>
          <Th className="w-10">
            <input type="checkbox" checked={allSelected}
              onChange={() => onSelectAll(products.map((p) => p.id))}
              aria-label="select all" className="rounded" />
          </Th>
          <Th>{t('products.col.product')}</Th>
          <Th>{t('products.col.price')}</Th>
          <Th>{t('products.col.stock')}</Th>
          <Th>{t('products.col.performance')}</Th>
          {showDiagnosis && (
            <Th>
              <span className="inline-flex items-center gap-1">
                {t('products.col.diagnosis')} <InfoIcon size={12} className="text-muted" />
              </span>
            </Th>
          )}
          <Th>{t('products.col.action')}</Th>
        </Tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <Tr key={p.id} className="align-top hover:bg-bg">
            <Td>
              <input type="checkbox" checked={selectedIds.includes(p.id)}
                onChange={() => onToggleSelect(p.id)} aria-label={p.name} className="rounded" />
            </Td>
            <Td>
              <div className="flex gap-3">
                <ProductThumb thumbnails={p.thumbnails} />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="line-clamp-2 font-medium text-text">{p.name}</span>
                  <span className="text-xs text-muted">{t('products.col.productName')}: {p.parentSku}</span>
                  <span className="text-xs text-muted">Item ID: {p.itemId}</span>
                </div>
              </div>
            </Td>
            <Td className="whitespace-nowrap">
              <PriceRange min={p.minPriceUzs} max={p.maxPriceUzs} />
            </Td>
            <Td>
              {p.totalStock === 0
                ? <Badge tone="error">{t('products.soldOut')}</Badge>
                : <span>{p.totalStock}</span>}
            </Td>
            <Td>
              <div className="flex flex-col gap-0.5 text-xs text-muted">
                <span>{t('products.sold')}: {p.salesCount}</span>
                <span>{t('products.visits')}: {p.impressions}</span>
                <span>{p.searchCount} {t('products.fromSearch')}</span>
              </div>
            </Td>
            {showDiagnosis && (
              <Td>
                {p.listingIssueCount > 0 ? (
                  <Link to="/products?tab=live&sub=quality"
                    className="inline-flex items-center gap-1 text-xs text-error hover:underline">
                    <span className="h-2 w-2 rounded-full bg-error" />
                    {p.listingIssueCount}
                  </Link>
                ) : (
                  <span className="inline-flex h-2 w-2 rounded-full bg-success" />
                )}
              </Td>
            )}
            <Td>
              <RowActions productId={p.id}
                onDelist={() => onDelist(p.id)}
                onDelete={() => onDelete(p.id)}
                onDuplicate={() => onDuplicate(p.id)} />
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  )
}
