import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatUZS } from '@/utils/money'
import { Button } from '@/components/ui/Button'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import type { TrafficSourceRow } from '../types/insights.types'

type Props = { rows: TrafficSourceRow[] }

type Toggle = 'source' | 'product'

export function TrafficSourcesTable({ rows }: Props) {
  const { t } = useTranslation()
  const [toggle, setToggle] = useState<Toggle>('source')

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">
          {t('insights.overview.trafficOfProductCard')}
        </h3>
        <div className="flex overflow-hidden rounded-full border border-border-strong">
          {(['source', 'product'] as Toggle[]).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setToggle(opt)}
              className={`px-3 py-1 text-xs font-semibold transition-colors ${
                toggle === opt ? 'bg-brand text-white' : 'bg-surface text-muted hover:bg-bg'
              }`}
            >
              {opt === 'source'
                ? t('insights.overview.sourceContribution')
                : t('insights.overview.productContribution')}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          }
          title={t('insights.noData')}
        />
      ) : (
        <Table>
          <thead>
            <Tr>
              <Th>Traffic Source</Th>
              <Th>Sales Ratio</Th>
              <Th>{t('insights.overview.sales')}</Th>
              <Th>{t('insights.overview.colImpressions')}</Th>
              <Th>{t('insights.overview.colClicks')}</Th>
              <Th>{t('insights.overview.colOrders')}</Th>
              <Th>{t('insights.overview.colUnits')}</Th>
              <Th>{t('insights.overview.colCtr')}</Th>
              <Th>{t('insights.overview.colConvRate')}</Th>
              <Th>{t('insights.viewTrend')}</Th>
            </Tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <Tr key={i}>
                <Td className="font-medium text-text">{row.source}</Td>
                <Td className="text-muted">{row.salesRatioPct.toFixed(2)}%</Td>
                <Td>
                  <div className="flex flex-col">
                    <span>{formatUZS(row.salesUzs)}</span>
                    <span className={row.salesDeltaPct >= 0 ? 'text-success text-xs' : 'text-error-text text-xs'}>
                      {row.salesDeltaPct >= 0 ? '+' : ''}{row.salesDeltaPct.toFixed(2)}%
                    </span>
                  </div>
                </Td>
                <Td className="text-muted">{row.impressions.toLocaleString('ru-RU')}</Td>
                <Td className="text-muted">{row.clicks.toLocaleString('ru-RU')}</Td>
                <Td className="text-muted">{row.orders.toLocaleString('ru-RU')}</Td>
                <Td className="text-muted">{row.units.toLocaleString('ru-RU')}</Td>
                <Td className="text-muted">{row.ctrPct.toFixed(2)}%</Td>
                <Td className="text-muted">{row.convRatePct.toFixed(2)}%</Td>
                <Td>
                  <Button variant="ghost" size="sm" className="text-brand">
                    {t('insights.viewTrend')}
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}
