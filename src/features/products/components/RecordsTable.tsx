import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { FileX2 } from './icons'
import { StatusBadge } from './StatusBadge'
import type { Brand } from '../types/products.types'

type Row = { kind: 'brand'; item: Brand }

export function RecordsTable({
  nameLabel,
  rows,
  isLoading,
}: {
  nameLabel: string
  rows: Row[]
  isLoading: boolean
}) {
  const { t } = useTranslation()

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Spinner />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<FileX2 size={32} />}
          title={t('products.brand.noData')}
        />
      ) : (
        <Table>
          <thead>
            <Tr>
              <Th>{nameLabel}</Th>
              <Th>{t('products.category')}</Th>
              <Th>{t('products.brand.regDate')}</Th>
              <Th>{t('products.col.status')}</Th>
            </Tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <Tr key={row.item.id}>
                <Td className="font-medium">{row.item.brandName}</Td>
                <Td className="text-xs text-muted">{row.item.category}</Td>
                <Td className="text-xs text-muted">{row.item.registrationDate}</Td>
                <Td>
                  <StatusBadge kind="brand" status={row.item.status} />
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}
