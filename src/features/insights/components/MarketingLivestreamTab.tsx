import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/Input'
import { StatCard } from '@/components/ui/StatCard'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatUZS } from '@/utils/money'
import type { LivestreamOverview, LivestreamBarPoint, LivestreamRow } from '../types/insights.types'

type Props = {
  overview?: LivestreamOverview
  barChart: LivestreamBarPoint[]
  streams: LivestreamRow[]
}

export function MarketingLivestreamTab({ overview, barChart, streams }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      {/* Info banner */}
      <div className="rounded-lg border border-border bg-bg px-4 py-2.5 text-xs text-text-secondary">
        {t('insights.marketing.livestream.infoBanner')}
      </div>

      {/* Overview KPI row */}
      <div className="rounded-lg border border-border p-4">
        <p className="mb-3 text-sm text-muted">
          {t('insights.marketing.livestream.totalProduced')}:{' '}
          <strong className="text-text">{overview?.totalProduced ?? 0}</strong>
        </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: t('insights.marketing.livestream.uniqueViewers'), value: String(overview?.uniqueViewers ?? 0) },
            { label: t('insights.marketing.livestream.peakViewers'), value: String(overview?.peakViewers ?? 0) },
            { label: t('insights.marketing.livestream.avgWatchTime'), value: overview?.avgWatchTime ?? '00:00:00' },
            { label: t('insights.marketing.livestream.orders'), value: String(overview?.orders ?? 0) },
            { label: t('insights.marketing.livestream.sales'), value: formatUZS(overview?.salesUzs ?? 0) },
          ].map(({ label, value }) => (
            <StatCard key={label} label={label} value={value} />
          ))}
        </div>
      </div>

      {/* Bar chart — inline SVG, chart colors intentionally kept */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-text">{t('insights.marketing.livestream.barChart')}</h3>
        <div className="flex h-24 items-end gap-0.5 overflow-hidden rounded-lg border border-border bg-surface px-2 pb-2 pt-4">
          {barChart.map((pt, i) => (
            <div
              key={i}
              className="flex-1 rounded-t opacity-80 transition-opacity hover:opacity-100"
              style={{ height: `${Math.max(pt.count * 20, 2)}px`, backgroundColor: '#e55b2b' }}
              title={pt.date}
            />
          ))}
          {barChart.length === 0 && (
            <div className="flex w-full items-center justify-center text-xs text-muted">
              {t('insights.noData')}
            </div>
          )}
        </div>
      </div>

      {/* Livestream list */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text">{t('insights.marketing.livestream.listTitle')}</h3>
          <Input className="h-9 w-44" placeholder={t('insights.marketing.livestream.searchTitle')} />
        </div>

        {streams.length === 0 ? (
          <EmptyState
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 8l6 4-6 4V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            }
            title={t('insights.marketing.livestream.noStreams')}
          />
        ) : (
          <Table>
            <thead>
              <Tr>
                {[
                  t('insights.marketing.livestream.colInfo'),
                  t('insights.marketing.livestream.colUniqueViewers'),
                  t('insights.marketing.livestream.colPeakViewers'),
                  t('insights.marketing.livestream.colAvgWatch'),
                  t('insights.marketing.livestream.colGuidedOrders'),
                  t('insights.marketing.livestream.colGuidedSales'),
                  t('insights.marketing.livestream.colAction'),
                ].map((h) => <Th key={h}>{h}</Th>)}
              </Tr>
            </thead>
            <tbody>
              {streams.map((s) => (
                <Tr key={s.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <img src={s.thumb} alt="" className="h-8 w-8 rounded object-cover" />
                      <div>
                        <p className="font-medium text-text">{s.title}</p>
                        <p className="text-xs text-muted">{s.datetime}</p>
                      </div>
                    </div>
                  </Td>
                  <Td className="text-muted">{s.uniqueViewers}</Td>
                  <Td className="text-muted">{s.peakViewers}</Td>
                  <Td className="text-muted">{s.avgWatchTime}</Td>
                  <Td className="text-muted">{s.guidedOrders}</Td>
                  <Td>{formatUZS(s.guidedSalesUzs)}</Td>
                  <Td>
                    <button type="button" className="text-xs font-semibold text-brand hover:underline">
                      {t('insights.marketing.viewDetails')}
                    </button>
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
