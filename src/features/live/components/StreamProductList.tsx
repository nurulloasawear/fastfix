import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatUZS } from '@/utils/money'
import { GripVerticalIcon, ArrowUpIcon, TrashIcon } from './icons'
import type { StreamProductRow } from './StreamProductList.types'

type Props = {
  products: StreamProductRow[]
  onAdd: () => void
  onMoveToTop: (id: string) => void
  onRemove: (id: string) => void
  maxProducts?: number
}

export function StreamProductList({ products, onAdd, onMoveToTop, onRemove, maxProducts = 100 }: Props) {
  const { t } = useTranslation()
  const sorted = [...products].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className="flex-1">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onAdd}
          disabled={products.length >= maxProducts}
        >
          {t('live.createStream.addRelatedProducts', { count: products.length })}
        </Button>
        <span className="text-xs text-muted">
          {t('live.createStream.selected', { count: products.length, total: products.length })}
        </span>
        <Button variant="ghost" size="sm">
          <ArrowUpIcon size={13} /> {t('live.createStream.top')}
        </Button>
        <Button variant="ghost" size="sm" className="text-error-text hover:text-error-text">
          <TrashIcon size={13} /> {t('live.createStream.delete')}
        </Button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          title={t('live.createStream.relatedProducts')}
          description={t('live.createPromotion.noProductsAdded')}
          className="rounded-lg border border-dashed border-border py-10"
        />
      ) : (
        <Table>
          <thead>
            <Tr>
              <Th className="w-8 px-2" />
              <Th className="w-8 px-2">
                <input type="checkbox" className="rounded" readOnly />
              </Th>
              <Th>{t('live.createStream.colNo')}</Th>
              <Th>{t('live.createStream.colProduct')}</Th>
              <Th className="text-right">{t('live.createStream.colPrice')}</Th>
              <Th className="text-right">{t('live.createStream.colActions')}</Th>
            </Tr>
          </thead>
          <tbody>
            {sorted.map((p, idx) => (
              <Tr key={p.productId}>
                <Td className="px-2 text-muted">
                  <GripVerticalIcon size={14} />
                </Td>
                <Td className="px-2">
                  <input type="checkbox" className="rounded" readOnly />
                </Td>
                <Td className="text-xs text-muted">{idx + 1}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 shrink-0 rounded bg-bg" />
                    <span className="line-clamp-2 text-xs">{p.productName}</span>
                  </div>
                </Td>
                <Td className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-brand">{formatUZS(p.priceUzs)}</span>
                    <span className="text-xs text-muted">Comm {p.commissionRate}%</span>
                  </div>
                </Td>
                <Td className="text-right">
                  <div className="flex flex-col items-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onMoveToTop(p.productId)}>
                      {t('live.createStream.moveToTop')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(p.productId)}
                      className="text-error-text hover:text-error-text"
                    >
                      {t('live.createStream.remove')}
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}
