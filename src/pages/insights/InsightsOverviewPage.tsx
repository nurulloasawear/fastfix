import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import { Tabs } from '@/components/ui/Tabs'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { formatUZS } from '@/utils/money'
import {
  InsightsTabs,
  PromoBanner,
  DataPeriodBar,
  TrendChart,
  ChannelBreakdown,
  TrafficSourcesTable,
  useInsightsOverview,
  useInsightsUi,
} from '@/features/insights'

const PRODUCT_SUBTAB_KEYS = ['topPerforming', 'newlyListed', 'adsStrategy'] as const
type ProductSubTab = typeof PRODUCT_SUBTAB_KEYS[number]

export function InsightsOverviewPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useInsightsOverview()
  const [productSubTab, setProductSubTab] = useState<ProductSubTab>('topPerforming')

  const mode = useInsightsUi((s) => s.mode)
  const orderType = useInsightsUi((s) => s.orderType)
  const setMode = useInsightsUi((s) => s.setMode)
  const setOrderType = useInsightsUi((s) => s.setOrderType)

  const kpis = data?.kpis
  const rt = data?.realtime
  const trend = data?.trend ?? []

  const productSubTabItems = PRODUCT_SUBTAB_KEYS.map((k) => ({
    key: k,
    label: t(`insights.overview.${k}`),
  }))

  return (
    <Page>
      <PageHeader
        title={t('insights.title')}
        breadcrumb={`${t('insights.breadcrumbHome')} › ${t('insights.title')}`}
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
        <DataPeriodBar
          mode={mode}
          orderType={orderType}
          onModeChange={setMode}
          onOrderTypeChange={setOrderType}
        />

        <div className="flex gap-0">
          {/* Main content */}
          <div className="flex-1 overflow-hidden p-6">
            {/* Key Metrics */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">{t('insights.overview.keyMetrics')}</h2>
              <button type="button" className="text-xs font-semibold text-brand hover:underline">
                {t('insights.more')} &gt;
              </button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
              {isLoading ? (
                <div className="col-span-2 flex items-center justify-center py-8 xl:col-span-4">
                  <Spinner />
                </div>
              ) : kpis ? (
                <>
                  <StatCard
                    label={`${t('insights.overview.sales')} ①`}
                    value={formatUZS(kpis.sales.value)}
                    delta={{ value: `${kpis.sales.delta >= 0 ? '+' : ''}${kpis.sales.delta.toFixed(2)}%`, positive: kpis.sales.delta >= 0 }}
                  />
                  <StatCard
                    label={t('insights.overview.salesWithRebate')}
                    value={formatUZS(kpis.salesWithRebate.value)}
                    delta={{ value: `${kpis.salesWithRebate.delta >= 0 ? '+' : ''}${kpis.salesWithRebate.delta.toFixed(2)}%`, positive: kpis.salesWithRebate.delta >= 0 }}
                  />
                  <StatCard
                    label={t('insights.overview.orders')}
                    value={kpis.orders.value.toLocaleString('ru-RU')}
                    delta={{ value: `${kpis.orders.delta >= 0 ? '+' : ''}${kpis.orders.delta.toFixed(2)}%`, positive: kpis.orders.delta >= 0 }}
                  />
                  <StatCard
                    label={t('insights.overview.convRate')}
                    value={`${kpis.convRate.value.toFixed(2)}%`}
                    delta={{ value: `${kpis.convRate.delta >= 0 ? '+' : ''}${kpis.convRate.delta.toFixed(2)}%`, positive: kpis.convRate.delta >= 0 }}
                  />
                </>
              ) : null}
            </div>

            {/* Trend Chart */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-semibold text-text">
                {t('insights.overview.trendChart')}
              </h3>
              <TrendChart
                points={trend}
                seriesKeys={['sales', 'visitors']}
                labels={[
                  { key: 'sales', label: t('insights.overview.sales') },
                  { key: 'visitors', label: t('insights.traffic.visitors') },
                ]}
                height={140}
              />
            </div>

            {/* Traffic Sources */}
            <div className="mb-6 flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-text">{t('insights.overview.trafficSources')}</h3>
              <ChannelBreakdown channels={data?.channelBreakdown ?? []} />
              <TrafficSourcesTable rows={data?.trafficSources ?? []} />
            </div>

            {/* Product section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text">{t('insights.overview.product')}</h3>
                <button type="button" className="text-xs font-semibold text-brand hover:underline">
                  {t('insights.more')} &gt;
                </button>
              </div>

              {/* Product sub-tabs */}
              <Tabs
                items={productSubTabItems}
                value={productSubTab}
                onChange={(k) => setProductSubTab(k as ProductSubTab)}
              />

              {/* Filter row */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">{t('insights.overview.rankingBy')}</span>
                <button type="button" className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary hover:bg-bg">
                  {t('insights.overview.sales')}
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <span className="text-xs text-muted">{t('insights.overview.category')}</span>
                <button type="button" className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary hover:bg-bg">
                  {t('insights.overview.allCategories')}
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>

              {/* Product table */}
              {(data?.topProducts ?? []).length === 0 ? (
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
                      <Th>{t('insights.overview.colRanking')}</Th>
                      <Th>{t('insights.overview.colProductInfo')}</Th>
                      <Th>{t('insights.overview.colImpressions')}</Th>
                      <Th>{t('insights.overview.colClicks')}</Th>
                      <Th>{t('insights.overview.colCtr')}</Th>
                      <Th>{t('insights.overview.colConvRate')}</Th>
                      <Th>{t('insights.overview.colOrders')}</Th>
                      <Th>{t('insights.overview.colUnits')}</Th>
                      <Th>{t('insights.overview.colBuyers')}</Th>
                    </Tr>
                  </thead>
                  <tbody>
                    {data?.topProducts.map((p) => (
                      <Tr key={p.productId}>
                        <Td className="text-center font-semibold text-brand">{p.rank}</Td>
                        <Td>
                          <div className="flex items-center gap-2">
                            <img src={p.thumb} alt="" className="h-8 w-8 rounded object-cover" />
                            <span className="line-clamp-2 max-w-[140px] font-medium text-text">{p.name}</span>
                          </div>
                        </Td>
                        <Td className="text-muted">{p.impressions.toLocaleString('ru-RU')}</Td>
                        <Td className="text-muted">{p.clicks.toLocaleString('ru-RU')}</Td>
                        <Td className="text-muted">{p.ctrPct.toFixed(2)}%</Td>
                        <Td className="text-muted">{p.convRatePct.toFixed(2)}%</Td>
                        <Td className="text-muted">{p.orders.toLocaleString('ru-RU')}</Td>
                        <Td className="text-muted">{p.units.toLocaleString('ru-RU')}</Td>
                        <Td className="text-muted">{p.buyers.toLocaleString('ru-RU')}</Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </div>

          {/* Real-time sidebar */}
          <aside className="hidden w-52 shrink-0 border-l border-border bg-bg p-4 xl:flex xl:flex-col xl:gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-text">
                {t('insights.overview.realTimeMetrics')}
              </h3>
              <Badge tone="success" className="text-[10px]">
                {t('insights.realTime')}
              </Badge>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: t('insights.overview.salesToday'), value: formatUZS(rt?.salesToday ?? 0) },
                { label: t('insights.overview.units'), value: rt?.units ?? 0 },
                { label: t('insights.overview.productOrders'), value: rt?.productOrders ?? 0 },
                { label: t('insights.overview.orders'), value: rt?.orders ?? 0 },
                { label: t('insights.overview.convRate'), value: `${rt?.convRate ?? 0}%` },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5 rounded-lg border border-border bg-surface p-2.5">
                  <span className="text-[10px] text-muted">{item.label}</span>
                  <span className="text-sm font-semibold text-text">{item.value}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </Card>
    </Page>
  )
}
