import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { formatUZS } from '@/utils/money'
import type { DiagnosisIssue, DiagnosisCount, DiagnosisProductRow } from '../types/insights.types'

const ISSUE_KEYS: DiagnosisIssue[] = [
  'decrease_sales', 'poor_reviews', 'high_returns',
  'high_late_shipped', 'high_cancellation', 'poor_conversion', 'decrease_views',
]

const ISSUE_I18N: Record<DiagnosisIssue, string> = {
  decrease_sales: 'insights.product.decreaseSales',
  poor_reviews: 'insights.product.poorReviews',
  high_returns: 'insights.product.highReturns',
  high_late_shipped: 'insights.product.highLateShipped',
  high_cancellation: 'insights.product.highCancellation',
  poor_conversion: 'insights.product.poorConversion',
  decrease_views: 'insights.product.decreaseViews',
}

type Props = {
  counts: DiagnosisCount[]
  products: DiagnosisProductRow[]
  isLoading: boolean
}

export function ProductDiagnosisTab({ counts, products, isLoading }: Props) {
  const { t } = useTranslation()
  const [activeIssue, setActiveIssue] = useState<DiagnosisIssue>('decrease_sales')

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-base font-semibold text-text">{t('insights.product.diagnosis')}</h2>

      {/* Issue tabs */}
      <div className="flex flex-wrap gap-2">
        {ISSUE_KEYS.map((issue) => {
          const count = counts.find((c) => c.issue === issue)?.count ?? 0
          const isActive = activeIssue === issue
          return (
            <button
              key={issue}
              type="button"
              onClick={() => setActiveIssue(issue)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? 'border-error-text bg-error-bg text-error-text'
                  : 'border-border bg-surface text-muted hover:bg-bg'
              }`}
            >
              {t(ISSUE_I18N[issue])}
              <Badge tone={isActive ? 'error' : 'gray'} className="text-[10px]">{count}</Badge>
            </button>
          )
        })}
      </div>

      {/* Definition */}
      {activeIssue === 'decrease_sales' && (
        <div className="rounded-lg border border-border bg-bg p-3 text-xs text-text">
          <p><span className="font-semibold">{t('insights.product.diagDefinition')}</span> {t('insights.product.decreaseSalesDef')}</p>
        </div>
      )}

      {/* Products table */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : products.length === 0 ? (
        <EmptyState title={t('insights.noData')} />
      ) : (
        <Table>
          <thead>
            <Tr>
              <Th>{t('insights.product.colProductDetails')}</Th>
              <Th>{t('insights.product.colSalesPrior', { range: '02/06 – 06/06' })}</Th>
              <Th>{t('insights.product.colSalesRecent', { range: '09/06 – 15/06' })}</Th>
              <Th>{t('insights.product.colAction')}</Th>
            </Tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <Tr key={p.productId}>
                <Td>
                  <div className="flex items-center gap-2">
                    <img src={p.thumb} alt="" className="h-8 w-8 rounded object-cover" />
                    <span className="font-medium text-text">{p.name}</span>
                  </div>
                </Td>
                <Td>{formatUZS(p.salesPrior)}</Td>
                <Td>{formatUZS(p.salesRecent)}</Td>
                <Td>
                  <Button variant="ghost" size="sm" className="text-brand">{t('insights.product.colAction')}</Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}
