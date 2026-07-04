import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { formatUZS } from '@/utils/money'
import type { ProductPerformanceRow } from '../types/insights.types'

type Props = {
  performance: ProductPerformanceRow[]
  isLoading: boolean
}

export function ProductPerformanceTab({ performance, isLoading }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-base font-semibold text-text">{t('insights.product.performance')}</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-bg">
          {t('insights.product.filterByCategory')}
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button type="button" className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-bg">
          {t('insights.product.allCategories')}
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <Input
          className="h-9 w-48"
          placeholder={t('insights.product.searchProducts')}
          trailing={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M9.5 9.5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          }
        />
        <Button variant="outline" size="sm" className="ml-auto">
          {t('insights.product.selectMetrics')}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : performance.length === 0 ? (
        <EmptyState
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          }
          title={t('insights.noProducts')}
        />
      ) : (
        <Table>
          <thead>
            <Tr>
              <Th>{t('insights.overview.colProductInfo')}</Th>
              <Th>{t('insights.product.colSales')} ⇅</Th>
              <Th>{t('insights.product.colImpressions')} ⇅</Th>
              <Th>{t('insights.product.colClicks')} ⇅</Th>
              <Th>{t('insights.product.colCtr')} ⇅</Th>
              <Th>{t('insights.product.colConvRate')} ⇅</Th>
              <Th>{t('insights.product.colOrders')} ⇅</Th>
              <Th>{t('insights.product.colUnits')} ⇅</Th>
              <Th>{t('insights.product.colAction')}</Th>
            </Tr>
          </thead>
          <tbody>
            {performance.map((p) => (
              <Tr key={p.productId}>
                <Td>
                  <div className="flex items-center gap-2">
                    <img src={p.thumb} alt="" className="h-8 w-8 rounded object-cover" />
                    <span className="font-medium text-text">{p.name}</span>
                  </div>
                </Td>
                <Td>{formatUZS(p.salesUzs)}</Td>
                <Td className="text-muted">{p.impressions}</Td>
                <Td className="text-muted">{p.clicks}</Td>
                <Td className="text-muted">{p.ctrPct.toFixed(2)}%</Td>
                <Td className="text-muted">{p.convRatePct.toFixed(2)}%</Td>
                <Td className="text-muted">{p.orders}</Td>
                <Td className="text-muted">{p.units}</Td>
                <Td>
                  <Button variant="ghost" size="sm" className="text-brand">{t('insights.viewTrend')}</Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}
