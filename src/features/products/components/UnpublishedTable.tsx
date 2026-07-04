import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { ArrowUpDown, InfoIcon, PackageIcon } from './icons'
import { formatUZS } from '@/utils/money'
import type { UnpublishedProduct } from '../types/products.types'

type Props = {
  products: UnpublishedProduct[]
  isLoading: boolean
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onSelectAll: (ids: string[]) => void
  onPublish: (id: string) => void
  onDelete: (id: string) => void
}

export function UnpublishedTable({
  products,
  isLoading,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onPublish,
  onDelete,
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
        icon={<PackageIcon size={32} />}
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
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => onSelectAll(products.map((p) => p.id))}
              aria-label="select all"
              className="rounded"
            />
          </Th>
          <Th>{t('products.col.product')}</Th>
          <Th>
            <span className="inline-flex items-center gap-1">
              {t('products.col.salesHistory')} <InfoIcon size={12} /> <ArrowUpDown size={12} />
            </span>
          </Th>
          <Th>
            <span className="inline-flex items-center gap-1">
              {t('products.col.price')} <ArrowUpDown size={12} />
            </span>
          </Th>
          <Th>
            <span className="inline-flex items-center gap-1">
              {t('products.col.stock')} <InfoIcon size={12} /> <ArrowUpDown size={12} />
            </span>
          </Th>
          <Th>{t('products.col.action')}</Th>
        </Tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <Tr key={p.id} className="align-top hover:bg-bg">
            <Td>
              <input
                type="checkbox"
                checked={selectedIds.includes(p.id)}
                onChange={() => onToggleSelect(p.id)}
                aria-label={p.productName}
                className="rounded"
              />
            </Td>
            <Td>
              <div className="flex gap-3">
                <div className="h-10 w-10 shrink-0 rounded-md bg-bg border border-border" />
                <span className="font-medium text-text">{p.productName}</span>
              </div>
            </Td>
            <Td>{p.salesCount}</Td>
            <Td>{formatUZS(p.priceUzs)}</Td>
            <Td>{p.stock}</Td>
            <Td>
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="sm" onClick={() => onPublish(p.id)}>
                  {t('products.action.publish')}
                </Button>
                <Link
                  to={`/products/${p.id}/edit`}
                  className="inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold text-brand hover:bg-bg transition-colors"
                >
                  {t('products.action.edit')}
                </Link>
                <Button variant="ghost" size="sm" onClick={() => onDelete(p.id)}>
                  <span className="text-error-text">{t('products.action.delete')}</span>
                </Button>
              </div>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  )
}
