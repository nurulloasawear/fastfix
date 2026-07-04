import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
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
  ProductSubTabs,
  useProductOverview,
  useProductTraffic,
  useProductPerformance,
  useProductDiagnosis,
  useInsightsUi,
  ProductPerformanceTab,
  ProductDiagnosisTab,
} from '@/features/insights'

type ProductTab = 'overview' | 'traffic' | 'performance' | 'diagnosis'

// ── Funnel row for Product Overview ──────────────────────────────────────────
function FunnelRow({ stage, metrics }: { stage: string; metrics: Record<string, { value: number; delta: number; isMonetary?: boolean; isPercent?: boolean }> }) {
  function fmt(v: number, isMonetary?: boolean, isPercent?: boolean) {
    if (isMonetary) return formatUZS(v)
    if (isPercent) return `${v.toFixed(2)}%`
    return v.toLocaleString('ru-RU')
  }
  return (
    <div className="flex flex-col gap-1 border-b border-border py-4">
      <span className="text-xs font-semibold text-brand">{stage}</span>
      <div className="flex flex-wrap gap-4">
        {Object.entries(metrics).map(([key, m]) => (
          <div key={key} className="flex flex-col gap-0.5">
            <span className="text-xs text-muted">{key}</span>
            <span className="text-sm font-semibold text-text">{fmt(m.value, m.isMonetary, m.isPercent)}</span>
            <span className={`text-xs font-medium ${m.delta >= 0 ? 'text-success' : 'text-error-text'}`}>
              {m.delta >= 0 ? '+' : ''}{m.delta.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductInsightsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<ProductTab>('overview')
  const [productRankTab, setProductRankTab] = useState(0)

  const mode = useInsightsUi((s) => s.mode)
  const orderType = useInsightsUi((s) => s.orderType)
  const setMode = useInsightsUi((s) => s.setMode)
  const setOrderType = useInsightsUi((s) => s.setOrderType)

  const overviewQ = useProductOverview()
  const trafficQ = useProductTraffic()
  const performanceQ = useProductPerformance()
  const diagnosisQ = useProductDiagnosis('2026-06-15')

  const overview = overviewQ.data
  const traffic = trafficQ.data
  const performance = performanceQ.data ?? []
  const diagnosis = diagnosisQ.data

  const tabItems: { key: ProductTab; label: string }[] = [
    { key: 'overview', label: t('insights.product.subTabOverview') },
    { key: 'traffic', label: t('insights.product.subTabTraffic') },
    { key: 'performance', label: t('insights.product.subTabPerformance') },
    { key: 'diagnosis', label: t('insights.product.subTabDiagnosis') },
  ]

  const rankingTabLabels = [
    t('insights.product.byPageViews'),
    t('insights.product.bySalesPaid'),
    t('insights.product.byOrdersPlaced'),
    t('insights.product.byConvRate'),
    t('insights.product.byUnitsSold'),
  ]

  return (
    <Page>
      <PageHeader
        title={t('insights.title')}
        breadcrumb={`${t('insights.breadcrumbHome')} › ${t('insights.title')} › ${t('insights.tabs.product')}`}
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
        <ProductSubTabs />
        <DataPeriodBar mode={mode} orderType={orderType} onModeChange={setMode} onOrderTypeChange={setOrderType} />

        <div className="border-b border-border px-6 pt-4">
          <Tabs
            items={tabItems}
            value={activeTab}
            onChange={(k) => setActiveTab(k as ProductTab)}
          />
        </div>

        <div className="p-6">
          {/* ── OVERVIEW TAB ─────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-5">
              <h2 className="text-base font-semibold text-text">{t('insights.product.subTabOverview')}</h2>

              {overviewQ.isLoading ? (
                <div className="flex justify-center py-12"><Spinner /></div>
              ) : overview ? (
                <div className="flex flex-col">
                  <FunnelRow stage={t('insights.product.funnelVisit')} metrics={{
                    [t('insights.product.colVisitors')]: overview.visit.visitors ?? { value: 0, delta: 0 },
                    'Page Views': overview.visit.pageViews ?? { value: 0, delta: 0 },
                    'Items Visited': overview.visit.itemsVisited ?? { value: 0, delta: 0 },
                    'Bounce Visitors': overview.visit.bounceVisitors ?? { value: 0, delta: 0 },
                    'Bounce Rate': { ...(overview.visit.bounceRate ?? { value: 0, delta: 0 }), isPercent: true },
                    'Liked': overview.visit.liked ?? { value: 0, delta: 0 },
                    'Units': overview.visit.units ?? { value: 0, delta: 0 },
                  }} />
                  <FunnelRow stage={t('insights.product.funnelAddToCart')} metrics={{
                    [t('insights.product.colVisitors')]: overview.addToCart.visitors ?? { value: 0, delta: 0 },
                    'Units': overview.addToCart.units ?? { value: 0, delta: 0 },
                    'Conv Rate': { ...(overview.addToCart.convRate ?? { value: 0, delta: 0 }), isPercent: true },
                  }} />
                  <FunnelRow stage={t('insights.product.funnelPlacedOrder')} metrics={{
                    'Buyers': overview.placedOrder.buyers ?? { value: 0, delta: 0 },
                    'Units': overview.placedOrder.units ?? { value: 0, delta: 0 },
                    'Items Placed': overview.placedOrder.items ?? { value: 0, delta: 0 },
                    'Sales': { ...(overview.placedOrder.salesUzs ?? { value: 0, delta: 0 }), isMonetary: true },
                    'Conv Rate': { ...(overview.placedOrder.convRate ?? { value: 0, delta: 0 }), isPercent: true },
                  }} />
                  <FunnelRow stage={t('insights.product.funnelPaidOrder')} metrics={{
                    'Buyers': overview.paidOrder.buyers ?? { value: 0, delta: 0 },
                    'Units': overview.paidOrder.units ?? { value: 0, delta: 0 },
                    'Items Paid': overview.paidOrder.items ?? { value: 0, delta: 0 },
                    'Sales': { ...(overview.paidOrder.salesUzs ?? { value: 0, delta: 0 }), isMonetary: true },
                    'Conv Rate': { ...(overview.paidOrder.convRate ?? { value: 0, delta: 0 }), isPercent: true },
                  }} />
                </div>
              ) : null}

              {/* Metric Trend */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text">{t('insights.product.metricTrend')}</h3>
                  <button type="button" className="text-xs font-semibold text-brand hover:underline">
                    {t('insights.product.viewSingleProduct')}
                  </button>
                </div>
                <TrendChart points={overview?.trend ?? []} seriesKeys={['visitors', 'orders']} height={120} />
              </div>

              {/* Product Rankings */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text">{t('insights.product.productRankings')}</h3>
                  <button type="button" className="text-xs font-semibold text-brand hover:underline">
                    {t('insights.more')} &gt;
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {rankingTabLabels.map((label, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setProductRankTab(i)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                        productRankTab === i
                          ? 'border-brand bg-brand text-white'
                          : 'border-border-strong bg-surface text-muted hover:bg-bg'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {(overview?.rankings ?? []).length === 0 && (
                  <EmptyState title={t('insights.noData')} className="py-8" />
                )}
              </div>
            </div>
          )}

          {/* ── TRAFFIC TAB ──────────────────────────────────────────────── */}
          {activeTab === 'traffic' && (
            <div className="flex flex-col gap-5">
              <h2 className="text-base font-semibold text-text">{t('insights.product.productTraffic')}</h2>
              {trafficQ.isLoading ? (
                <div className="flex justify-center py-12"><Spinner /></div>
              ) : (
                <>
                  <ChannelBreakdown channels={traffic?.channelBreakdown ?? []} />
                  <TrafficSourcesTable rows={traffic?.trafficSources ?? []} />
                </>
              )}
            </div>
          )}

          {/* ── PERFORMANCE TAB ──────────────────────────────────────────── */}
          {activeTab === 'performance' && (
            <ProductPerformanceTab
              performance={performance}
              isLoading={performanceQ.isLoading}
            />
          )}

          {/* ── DIAGNOSIS TAB ────────────────────────────────────────────── */}
          {activeTab === 'diagnosis' && (
            <ProductDiagnosisTab
              counts={diagnosis?.counts ?? []}
              products={diagnosis?.products ?? []}
              isLoading={diagnosisQ.isLoading}
            />
          )}
        </div>
      </Card>
    </Page>
  )
}
