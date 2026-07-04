import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import { Tabs } from '@/components/ui/Tabs'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatUZS } from '@/utils/money'
import {
  InsightsTabs,
  PromoBanner,
  DataPeriodBar,
  TrendChart,
  MarketingSubTabs,
  MarketingKpiRow,
  FunnelDiagram,
  MarketingDiscountTab,
  MarketingLivestreamTab,
  useMarketingDiscount,
  useMarketingVoucher,
  useMarketingShippingPromo,
  useMarketingLivestream,
  useMarketingStreamDeal,
  useMarketingExternalTraffic,
  useInsightsUi,
} from '@/features/insights'

type MktSubPage = 'discount' | 'voucher' | 'shipping' | 'livestream' | 'stream-deal' | 'external-traffic'

export function MarketingInsightsPage() {
  const { t } = useTranslation()
  const [subPage, setSubPage] = useState<MktSubPage>('discount')

  const mode = useInsightsUi((s) => s.mode)
  const orderType = useInsightsUi((s) => s.orderType)
  const setMode = useInsightsUi((s) => s.setMode)
  const setOrderType = useInsightsUi((s) => s.setOrderType)

  const discountQ = useMarketingDiscount()
  const voucherQ = useMarketingVoucher()
  const shippingQ = useMarketingShippingPromo()
  const livestreamQ = useMarketingLivestream()
  const streamDealQ = useMarketingStreamDeal()
  const externalQ = useMarketingExternalTraffic()

  const discount = discountQ.data
  const voucher = voucherQ.data
  const shipping = shippingQ.data
  const livestream = livestreamQ.data
  const streamDeal = streamDealQ.data
  const external = externalQ.data

  const SUB_PAGES: { key: MktSubPage; label: string }[] = [
    { key: 'discount', label: t('insights.marketing.subTabDiscount') },
    { key: 'voucher', label: t('insights.marketing.subTabVoucher') },
    { key: 'shipping', label: t('insights.marketing.subTabShipping') },
    { key: 'livestream', label: t('insights.marketing.subTabLivestream') },
    { key: 'stream-deal', label: t('insights.marketing.subTabStreamDeal') },
    { key: 'external-traffic', label: t('insights.marketing.subTabExternalTraffic') },
  ]

  return (
    <Page>
      <PageHeader
        title={t('insights.title')}
        breadcrumb={`${t('insights.breadcrumbHome')} › ${t('insights.title')} › ${t('insights.tabs.marketing')}`}
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
        <MarketingSubTabs />
        <DataPeriodBar mode={mode} orderType={orderType} onModeChange={setMode} onOrderTypeChange={setOrderType} />

        <div className="border-b border-border px-6 pt-4">
          <Tabs
            items={SUB_PAGES}
            value={subPage}
            onChange={(k) => setSubPage(k as MktSubPage)}
          />
        </div>

        <div className="p-6">
          {subPage === 'discount' && (
            <MarketingDiscountTab
              kpis={discount?.kpis}
              promos={discount?.promos ?? []}
              deltaLabel={t('insights.vsPrevMonth')}
            />
          )}

          {subPage === 'voucher' && (
            <div className="flex flex-col gap-5">
              {voucher?.kpis && (
                <MarketingKpiRow items={[
                  { label: t('insights.marketing.colSales'), value: voucher.kpis.sales.value, delta: voucher.kpis.sales.delta, isMonetary: true, deltaLabel: t('insights.vsPrevMonth') },
                  { label: t('insights.marketing.voucher.colClaims'), value: voucher.kpis.claims.value, delta: voucher.kpis.claims.delta, deltaLabel: t('insights.vsPrevMonth') },
                  { label: t('insights.marketing.colOrders'), value: voucher.kpis.orders.value, delta: voucher.kpis.orders.delta, deltaLabel: t('insights.vsPrevMonth') },
                  { label: t('insights.marketing.voucher.colUsageRate'), value: voucher.kpis.usageRate.value, delta: voucher.kpis.usageRate.delta, isPercent: true, deltaLabel: t('insights.vsPrevMonth') },
                  { label: t('insights.marketing.colBuyers'), value: voucher.kpis.buyers.value, delta: voucher.kpis.buyers.delta, deltaLabel: t('insights.vsPrevMonth') },
                ]} />
              )}
              <TrendChart points={[]} seriesKeys={['sales', 'claims']} labels={[{ key: 'sales', label: t('insights.marketing.colSales') }, { key: 'claims', label: t('insights.marketing.voucher.colClaims') }]} height={130} />
              <div className="flex flex-wrap gap-2">
                {[t('insights.marketing.allStatus'), t('insights.marketing.voucher.allVoucherTypes'), t('insights.marketing.voucher.allRewardTypes'), t('insights.marketing.voucher.allCreators')].map((label) => (
                  <button key={label} type="button" className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary hover:bg-bg">
                    {label}
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                ))}
              </div>
              <Table>
                <thead>
                  <Tr>
                    {[t('insights.marketing.voucher.colName'), t('insights.marketing.voucher.colClaimPeriod'), t('insights.marketing.voucher.colClaims'), t('insights.marketing.voucher.colOrders'), t('insights.marketing.voucher.colUsageRate'), t('insights.marketing.voucher.colSales'), t('insights.marketing.voucher.colCost'), t('insights.marketing.voucher.colUnits'), t('insights.marketing.voucher.colBuyers')].map((h) => <Th key={h}>{h}</Th>)}
                  </Tr>
                </thead>
                <tbody>
                  <Tr><Td colSpan={9} className="py-8 text-center text-muted">{t('insights.noData')}</Td></Tr>
                </tbody>
              </Table>
            </div>
          )}

          {subPage === 'shipping' && (
            <div className="flex flex-col gap-5">
              {shipping?.kpis && (
                <MarketingKpiRow items={[
                  { label: t('insights.marketing.colSales'), value: shipping.kpis.sales.value, delta: shipping.kpis.sales.delta, isMonetary: true },
                  { label: t('insights.marketing.colOrders'), value: shipping.kpis.orders.value, delta: shipping.kpis.orders.delta },
                  { label: t('insights.marketing.colBuyers'), value: shipping.kpis.buyers.value, delta: shipping.kpis.buyers.delta },
                  { label: t('insights.marketing.colSalesPerBuyer'), value: shipping.kpis.salesPerBuyer.value, delta: shipping.kpis.salesPerBuyer.delta, isMonetary: true },
                  { label: t('insights.marketing.shippingPromo.colShippingCost'), value: shipping.kpis.shippingCost.value, delta: shipping.kpis.shippingCost.delta, isMonetary: true },
                ]} />
              )}
              <TrendChart points={[]} seriesKeys={['sales', 'orders']} height={130} />
              <Table>
                <thead>
                  <Tr>
                    {[t('insights.marketing.colPromoName'), t('insights.marketing.shippingPromo.colFrom'), t('insights.marketing.shippingPromo.colTo'), t('insights.marketing.shippingPromo.colRule'), t('insights.marketing.shippingPromo.colBudget'), t('insights.marketing.colSales'), t('insights.marketing.colOrders'), t('insights.marketing.colBuyers'), t('insights.marketing.colSalesPerBuyer'), t('insights.marketing.shippingPromo.colShippingCost')].map((h) => <Th key={h}>{h}</Th>)}
                  </Tr>
                </thead>
                <tbody>
                  <Tr><Td colSpan={10} className="py-8 text-center text-muted">{t('insights.noData')}</Td></Tr>
                </tbody>
              </Table>
            </div>
          )}

          {subPage === 'livestream' && (
            <MarketingLivestreamTab
              overview={livestream?.overview}
              barChart={livestream?.barChart ?? []}
              streams={livestream?.streams ?? []}
            />
          )}

          {subPage === 'stream-deal' && (
            <div className="flex flex-col gap-5">
              {streamDeal?.kpis && (
                <MarketingKpiRow items={[
                  { label: t('insights.marketing.colSales'), value: streamDeal.kpis.sales.value, delta: streamDeal.kpis.sales.delta, isMonetary: true },
                  { label: t('insights.marketing.colOrders'), value: streamDeal.kpis.orders.value, delta: streamDeal.kpis.orders.delta },
                  { label: t('insights.marketing.colUnits'), value: streamDeal.kpis.units.value, delta: streamDeal.kpis.units.delta },
                  { label: t('insights.marketing.colBuyers'), value: streamDeal.kpis.buyers.value, delta: streamDeal.kpis.buyers.delta },
                ]} />
              )}
              <EmptyState
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 16l4-8 4 4 3-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
                title={t('insights.marketing.streamDeal.noDeals')}
                action={
                  <button type="button" className="text-sm font-semibold text-brand hover:underline">
                    {t('insights.marketing.streamDeal.createFirst')}
                  </button>
                }
              />
              <Table>
                <thead>
                  <Tr>
                    {[t('insights.marketing.colPromoName'), t('insights.marketing.colPromoType'), t('insights.marketing.colPeriod'), t('insights.marketing.colSales'), t('insights.marketing.colOrders'), t('insights.marketing.colUnits'), t('insights.marketing.colBuyers'), t('insights.marketing.colAction')].map((h) => <Th key={h}>{h}</Th>)}
                  </Tr>
                </thead>
                <tbody>
                  <Tr><Td colSpan={8} className="py-8 text-center text-muted">{t('insights.noData')}</Td></Tr>
                </tbody>
              </Table>
            </div>
          )}

          {subPage === 'external-traffic' && (
            <div className="flex flex-col gap-5">
              {/* Info banner */}
              <div className="rounded-lg border border-border bg-bg px-4 py-2.5 text-xs text-text-secondary">
                {t('insights.marketing.externalTraffic.infoBanner')}
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-text">{t('insights.marketing.externalTraffic.title')}</h2>
                <Button variant="outline" size="sm">{t('insights.marketing.externalTraffic.manageUtm')}</Button>
              </div>

              {external?.overview && (
                <div className="flex gap-6">
                  <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                    {[
                      { label: t('insights.marketing.externalTraffic.visitors'), v: external.overview.visitors },
                      { label: t('insights.marketing.externalTraffic.visits'), v: external.overview.visits },
                      { label: t('insights.marketing.externalTraffic.buyers'), v: external.overview.buyers },
                      { label: t('insights.marketing.externalTraffic.sales'), v: external.overview.salesUzs, monetary: true },
                      { label: t('insights.marketing.externalTraffic.orders'), v: external.overview.orders },
                    ].map(({ label, v, monetary }) => (
                      <StatCard
                        key={label}
                        label={label}
                        value={monetary ? formatUZS(v.value) : v.value.toLocaleString('ru-RU')}
                        delta={{ value: `${v.delta >= 0 ? '+' : ''}${v.delta.toFixed(2)}%`, positive: v.delta >= 0 }}
                      />
                    ))}
                  </div>
                  {/* Funnel — chart colors kept */}
                  <div className="hidden shrink-0 lg:block">
                    <FunnelDiagram tiers={[
                      { label: t('insights.marketing.externalTraffic.visitors'), value: external.overview.visitors.value || 100, color: '#3b82f6' },
                      { label: t('insights.marketing.externalTraffic.visits'), value: external.overview.visits.value, convRate: external.overview.convVisitToATC, color: '#f97316' },
                      { label: t('insights.marketing.externalTraffic.addToCartItems'), value: external.overview.addToCartItems.value, convRate: external.overview.convATCToBuyers, color: '#10b981' },
                      { label: t('insights.marketing.externalTraffic.buyers'), value: external.overview.buyers.value, convRate: external.overview.convVisitorToPlaced, color: '#ef4444' },
                    ]} width={160} height={200} />
                  </div>
                </div>
              )}

              <TrendChart points={external?.overview.trend ?? []} seriesKeys={['visitors', 'sales']} height={120} />

              {/* Campaign Performance */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-text">{t('insights.marketing.externalTraffic.campaignPerformance')}</h3>
                <Tabs
                  items={[
                    { key: 'campaign', label: t('insights.marketing.externalTraffic.byCampaign') },
                    { key: 'tag', label: t('insights.marketing.externalTraffic.byTag') },
                  ]}
                  value="campaign"
                  onChange={() => {}}
                  className="mb-3"
                />
                <Table>
                  <thead>
                    <Tr>
                      {[t('insights.marketing.externalTraffic.colChannel'), t('insights.marketing.externalTraffic.colCampaignDesc'), t('insights.marketing.externalTraffic.colUsers'), t('insights.marketing.externalTraffic.colOrders'), t('insights.marketing.externalTraffic.colUnits'), t('insights.marketing.externalTraffic.colVisitors'), t('insights.marketing.externalTraffic.colBuyers'), t('insights.marketing.externalTraffic.colNewBuyers'), t('insights.marketing.externalTraffic.colConvRate'), t('insights.marketing.externalTraffic.colAddToCart')].map((h) => <Th key={h}>{h}</Th>)}
                    </Tr>
                  </thead>
                  <tbody>
                    <Tr><Td colSpan={10} className="py-8 text-center text-muted">{t('insights.noData')}</Td></Tr>
                  </tbody>
                </Table>
              </div>

              {/* Product Performance */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-text">{t('insights.marketing.externalTraffic.productPerformance')}</h3>
                <Tabs
                  items={[
                    { key: 'item', label: t('insights.marketing.externalTraffic.byItem') },
                    { key: 'tag', label: t('insights.marketing.externalTraffic.byTag') },
                  ]}
                  value="item"
                  onChange={() => {}}
                  className="mb-3"
                />
                <Table>
                  <thead>
                    <Tr>
                      {[t('insights.marketing.externalTraffic.colProductInfo'), t('insights.marketing.externalTraffic.colChannels'), t('insights.marketing.externalTraffic.colAddToCart'), t('insights.marketing.externalTraffic.colUnits'), t('insights.marketing.externalTraffic.colSales')].map((h) => <Th key={h}>{h}</Th>)}
                    </Tr>
                  </thead>
                  <tbody>
                    <Tr><Td colSpan={5} className="py-8 text-center text-muted">{t('insights.noData')}</Td></Tr>
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Page>
  )
}
