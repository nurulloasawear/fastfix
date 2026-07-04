import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { ArrowUpDown, InfoIcon, PackageIcon } from './icons'
import { formatUZS } from '@/utils/money'
import type { ReviewProduct } from '../types/products.types'

type Props = {
  products: ReviewProduct[]
  isLoading: boolean
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onSelectAll: (ids: string[]) => void
  onWithdraw: (id: string) => void
}

export function ReviewTable({
  products,
  isLoading,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onWithdraw,
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
              {t('products.col.updatedOn')} <ArrowUpDown size={12} />
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
            <Td className="whitespace-nowrap text-muted">{p.updatedAt}</Td>
            <Td>{formatUZS(p.priceUzs)}</Td>
            <Td>{p.stock}</Td>
            <Td>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWithdraw(p.id)}
              >
                {t('products.action.withdraw')}
              </Button>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  )
}
