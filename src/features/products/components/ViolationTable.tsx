import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { ArrowUpDown, PackageIcon } from './icons'
import type { ViolationProduct } from '../types/products.types'

type Props = {
  products: ViolationProduct[]
  isLoading: boolean
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onSelectAll: (ids: string[]) => void
  onAppeal: (id: string) => void
}

export function ViolationTable({
  products,
  isLoading,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onAppeal,
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
          <Th>{t('products.col.productName')}</Th>
          <Th>{t('products.col.updatedOn')}</Th>
          <Th>
            <span className="inline-flex items-center gap-1">
              {t('products.col.vType')} <ArrowUpDown size={12} />
            </span>
          </Th>
          <Th>{t('products.col.vReason')}</Th>
          <Th>{t('products.col.deadline')}</Th>
          <Th>{t('products.col.suggestion')}</Th>
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
            <Td className="font-medium">{p.productName}</Td>
            <Td className="whitespace-nowrap text-muted">{p.updatedAt}</Td>
            <Td className="text-error-text">{p.violationType}</Td>
            <Td className="max-w-[180px] text-muted">{p.violationReason}</Td>
            <Td className="whitespace-nowrap text-muted">{p.deadline}</Td>
            <Td className="max-w-[180px] text-muted">{p.suggestion}</Td>
            <Td>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAppeal(p.id)}
              >
                {t('products.action.appeal')}
              </Button>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  )
}
