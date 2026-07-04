import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { Spinner } from '@/components/ui/Spinner'
import {
  InsightsTabs,
  PromoBanner,
  DataPeriodBar,
  TrendChart,
  useTrafficOverview,
  useInsightsUi,
} from '@/features/insights'
import type { TrafficStats } from '@/features/insights'

type Terminal = 'all' | 'app' | 'web'

function DeltaCell({ value, delta }: { value: string | number; delta: number }) {
  const isPos = delta >= 0
  return (
    <div className="flex flex-col gap-0">
      <span className="font-semibold text-text">{value}</span>
      <span className={`text-xs font-medium ${isPos ? 'text-success' : 'text-error-text'}`}>
        {isPos ? '+' : ''}{delta.toFixed(2)}%
      </span>
    </div>
  )
}

export function TrafficInsightsPage() {
  const { t } = useTranslation()
  const [terminal, setTerminal] = useState<Terminal>('all')

  const mode = useInsightsUi((s) => s.mode)
  const orderType = useInsightsUi((s) => s.orderType)
  const setMode = useInsightsUi((s) => s.setMode)
  const setOrderType = useInsightsUi((s) => s.setOrderType)

  const { data, isLoading } = useTrafficOverview()

  function getStats(t_: Terminal): TrafficStats | undefined {
    if (!data) return undefined
    return data[t_]
  }

  const allStats = getStats('all')
  const appStats = getStats('app')
  const webStats = getStats('web')

  const terminals: Terminal[] = ['all', 'app', 'web']

  return (
    <Page>
      <PageHeader
        title={t('insights.title')}
        breadcrumb={`${t('insights.breadcrumbHome')} › ${t('insights.title')} › ${t('insights.tabs.traffic')}`}
        actions={
          <>
            <Button variant="ghost" size="sm">{t('insights.learnMore')}</Button>
            <Button variant="outline" size="sm">{t('insights.liveMonitor')}</Button>
          </>
        }
      />

      <PromoBanner />

      <Card className="overflow-hidden">
        <InsightsTabs />
        <DataPeriodBar mode={mode} orderType={orderType} onModeChange={setMode} onOrderTypeChange={setOrderType} supportedModes={['day', 'month']} />

        <div className="p-6">
          <h2 className="mb-1 text-base font-semibold text-text">{t('insights.traffic.title')}</h2>
          <p className="mb-6 text-xs text-muted">{t('insights.traffic.subtitle')}</p>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <>
              {/* 3-column overview table */}
              <div className="mb-6">
                <Table>
                  <thead>
                    <Tr>
                      <Th></Th>
                      <th className="border border-border bg-brand px-4 py-3 text-center text-xs font-semibold text-white">
                        {t('insights.traffic.allTerminal')}
                      </th>
                      <Th className="text-center">{t('insights.traffic.appTerminal')}</Th>
                      <Th className="text-center">{t('insights.traffic.webTerminal')}</Th>
                    </Tr>
                  </thead>
                  <tbody>
                    {/* Views Statistics group */}
                    <Tr>
                      <Td rowSpan={4} className="bg-brand/5 font-semibold text-brand">
                        <div className="flex flex-col gap-1">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M1 8s3-6 7-6 7 6 7 6-3 6-7 6-7-6-7-6z" stroke="currentColor" strokeWidth="1.2"/>
                            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
                          </svg>
                          {t('insights.traffic.viewsStats')}
                        </div>
                      </Td>
                      <Td className="text-center">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted">{t('insights.traffic.pageViews')}</span>
                          {allStats && <DeltaCell value={allStats.pageViews.value} delta={allStats.pageViews.delta} />}
                        </div>
                      </Td>
                      <Td className="text-center">
                        {appStats && <DeltaCell value={appStats.pageViews.value} delta={appStats.pageViews.delta} />}
                      </Td>
                      <Td className="text-center">
                        {webStats && <DeltaCell value={webStats.pageViews.value} delta={webStats.pageViews.delta} />}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td className="text-center">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted">{t('insights.traffic.avgPageViews')}</span>
                          {allStats && <DeltaCell value={allStats.avgPageViews.value.toFixed(2)} delta={allStats.avgPageViews.delta} />}
                        </div>
                      </Td>
                      <Td className="text-center">
                        {appStats && <DeltaCell value={appStats.avgPageViews.value.toFixed(2)} delta={appStats.avgPageViews.delta} />}
                      </Td>
                      <Td className="text-center">
                        {webStats && <DeltaCell value={webStats.avgPageViews.value.toFixed(2)} delta={webStats.avgPageViews.delta} />}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td className="text-center">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted">{t('insights.traffic.avgTimeSpent')}</span>
                          {allStats && <DeltaCell value={allStats.avgTimeSpent} delta={allStats.avgTimeSpentDelta} />}
                        </div>
                      </Td>
                      <Td className="text-center">
                        {appStats && <DeltaCell value={appStats.avgTimeSpent} delta={appStats.avgTimeSpentDelta} />}
                      </Td>
                      <Td className="text-center">
                        {webStats && <DeltaCell value={webStats.avgTimeSpent} delta={webStats.avgTimeSpentDelta} />}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td className="text-center">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted">{t('insights.traffic.bounceRate')}</span>
                          {allStats && <DeltaCell value={`${allStats.bounceRate.value.toFixed(2)}%`} delta={allStats.bounceRate.delta} />}
                        </div>
                      </Td>
                      <Td className="text-center">
                        {appStats && <DeltaCell value={`${appStats.bounceRate.value.toFixed(2)}%`} delta={appStats.bounceRate.delta} />}
                      </Td>
                      <Td className="text-center">
                        {webStats && <DeltaCell value={`${webStats.bounceRate.value.toFixed(2)}%`} delta={webStats.bounceRate.delta} />}
                      </Td>
                    </Tr>

                    {/* Visitor Statistics group */}
                    <Tr>
                      <Td rowSpan={4} className="bg-bg font-semibold text-text-secondary">
                        <div className="flex flex-col gap-1">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
                            <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                          {t('insights.traffic.visitorStats')}
                        </div>
                      </Td>
                      <Td className="text-center">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted">{t('insights.traffic.visitors')}</span>
                          {allStats && <DeltaCell value={allStats.visitors.value} delta={allStats.visitors.delta} />}
                        </div>
                      </Td>
                      <Td className="text-center">
                        {appStats && <DeltaCell value={appStats.visitors.value} delta={appStats.visitors.delta} />}
                      </Td>
                      <Td className="text-center">
                        {webStats && <DeltaCell value={webStats.visitors.value} delta={webStats.visitors.delta} />}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td className="text-center">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted">{t('insights.traffic.newVisitors')}</span>
                          {allStats && <DeltaCell value={allStats.newVisitors.value} delta={allStats.newVisitors.delta} />}
                        </div>
                      </Td>
                      <Td className="text-center">
                        {appStats && <DeltaCell value={appStats.newVisitors.value} delta={appStats.newVisitors.delta} />}
                      </Td>
                      <Td className="text-center">
                        {webStats && <DeltaCell value={webStats.newVisitors.value} delta={webStats.newVisitors.delta} />}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td className="text-center">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted">{t('insights.traffic.existingVisitors')}</span>
                          {allStats && <DeltaCell value={allStats.existingVisitors.value} delta={allStats.existingVisitors.delta} />}
                        </div>
                      </Td>
                      <Td className="text-center">
                        {appStats && <DeltaCell value={appStats.existingVisitors.value} delta={appStats.existingVisitors.delta} />}
                      </Td>
                      <Td className="text-center">
                        {webStats && <DeltaCell value={webStats.existingVisitors.value} delta={webStats.existingVisitors.delta} />}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td className="text-center">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted">{t('insights.traffic.newFollowers')}</span>
                          {allStats && <DeltaCell value={allStats.newFollowers.value} delta={allStats.newFollowers.delta} />}
                        </div>
                      </Td>
                      <Td className="text-center">
                        {appStats && <DeltaCell value={appStats.newFollowers.value} delta={appStats.newFollowers.delta} />}
                      </Td>
                      <Td className="text-center">
                        {webStats && <DeltaCell value={webStats.newFollowers.value} delta={webStats.newFollowers.delta} />}
                      </Td>
                    </Tr>
                  </tbody>
                </Table>
              </div>

              {/* Metric Trend */}
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text">{t('insights.traffic.metricTrend')}</h3>
                  <div className="flex overflow-hidden rounded-full border border-border-strong text-xs">
                    {terminals.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setTerminal(term)}
                        className={`px-3 py-1 font-semibold transition-colors ${terminal === term ? 'bg-brand text-white' : 'bg-surface text-muted hover:bg-bg'}`}
                      >
                        {t(`insights.traffic.${term}Terminal`)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chip groups */}
                <div className="mb-2 flex flex-wrap gap-2 text-xs">
                  <span className="font-semibold text-muted">{t('insights.traffic.viewsStats')}:</span>
                  {[t('insights.traffic.pageViews'), t('insights.traffic.avgPageViews'), t('insights.traffic.avgTimeSpent'), t('insights.traffic.bounceRate')].map((label) => (
                    <button key={label} type="button" className="rounded-full border border-border px-3 py-0.5 text-muted hover:border-brand hover:text-brand transition-colors">
                      {label}
                    </button>
                  ))}
                </div>
                <div className="mb-4 flex flex-wrap gap-2 text-xs">
                  <span className="font-semibold text-muted">{t('insights.traffic.visitorStats')}:</span>
                  {[t('insights.traffic.visitors'), t('insights.traffic.newVisitors'), t('insights.traffic.existingVisitors'), t('insights.traffic.newFollowers')].map((label) => (
                    <button key={label} type="button" className="rounded-full border border-border px-3 py-0.5 text-muted hover:border-brand hover:text-brand transition-colors">
                      {label}
                    </button>
                  ))}
                </div>

                <TrendChart
                  points={data?.trend ?? []}
                  seriesKeys={['pageViews', 'visitors']}
                  labels={[
                    { key: 'pageViews', label: t('insights.traffic.pageViews') },
                    { key: 'visitors', label: t('insights.traffic.visitors') },
                  ]}
                  height={140}
                />
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text">{t('insights.traffic.trendChart')}</h3>
                <span className="text-xs text-muted">{t('insights.traffic.metricsSelected', { n: 2 })}</span>
              </div>
            </>
          )}
        </div>
      </Card>
    </Page>
  )
}
