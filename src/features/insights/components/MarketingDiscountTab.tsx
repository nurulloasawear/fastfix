import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatUZS } from '@/utils/money'
import { TrendChart } from './TrendChart'
import { MarketingKpiRow } from './MarketingKpiRow'
import type { MarketingKpis, PromoRow } from '../types/insights.types'

type Props = {
  kpis?: MarketingKpis
  promos: PromoRow[]
  deltaLabel: string
}

export function MarketingDiscountTab({ kpis, promos, deltaLabel }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      {kpis && (
        <MarketingKpiRow items={[
          { label: t('insights.marketing.colSales'), value: kpis.sales.value, delta: kpis.sales.delta, isMonetary: true, deltaLabel },
          { label: t('insights.marketing.colOrders'), value: kpis.orders.value, delta: kpis.orders.delta, deltaLabel },
          { label: t('insights.marketing.colUnits'), value: kpis.units.value, delta: kpis.units.delta, deltaLabel },
          { label: t('insights.marketing.colBuyers'), value: kpis.buyers.value, delta: kpis.buyers.delta, deltaLabel },
          { label: t('insights.marketing.colSalesPerBuyer'), value: kpis.salesPerBuyer.value, delta: kpis.salesPerBuyer.delta, isMonetary: true, deltaLabel },
        ]} />
      )}

      <div>
        <h3 className="mb-2 text-sm font-semibold text-text">{t('insights.marketing.trendChart')}</h3>
        <TrendChart
          points={[]}
          seriesKeys={['sales', 'orders']}
          labels={[
            { key: 'sales', label: t('insights.marketing.colSales') },
            { key: 'orders', label: t('insights.marketing.colOrders') },
          ]}
          height={130}
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text">{t('insights.marketing.performanceList')}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">{t('insights.marketing.status')}</span>
            <button type="button" className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary hover:bg-bg">
              {t('insights.marketing.allStatus')}
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <Input className="h-9 w-40" placeholder={t('insights.marketing.searchPromo')} />
          </div>
        </div>

        {promos.length === 0 ? (
          <EmptyState
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
            title={t('insights.noData')}
          />
        ) : (
          <Table>
            <thead>
              <Tr>
                {[
                  t('insights.marketing.colPromoName'),
                  t('insights.marketing.colPromoType'),
                  t('insights.marketing.colPeriod'),
                  t('insights.marketing.colSales'),
                  t('insights.marketing.colOrders'),
                  t('insights.marketing.colUnits'),
                  t('insights.marketing.colBuyers'),
                  t('insights.marketing.colSalesPerBuyer'),
                  t('insights.marketing.colAction'),
                ].map((h) => <Th key={h}>{h}</Th>)}
              </Tr>
            </thead>
            <tbody>
              {promos.map((row) => (
                <Tr key={row.id}>
                  <Td className="font-medium text-text">{row.name}</Td>
                  <Td className="text-muted">{row.type}</Td>
                  <Td className="whitespace-nowrap text-muted">{row.periodFrom} – {row.periodTo}</Td>
                  <Td>{formatUZS(row.salesUzs)}</Td>
                  <Td className="text-muted">{row.orders}</Td>
                  <Td className="text-muted">{row.units}</Td>
                  <Td className="text-muted">{row.buyers}</Td>
                  <Td>{formatUZS(row.salesPerBuyer)}</Td>
                  <Td>
                    <Button variant="ghost" size="sm" className="text-brand">
                      {t('insights.marketing.viewDetails')}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  )
}
