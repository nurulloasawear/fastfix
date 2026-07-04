import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { InlineBarCell } from '@/features/insights'
import { formatUZS } from '@/utils/money'
import {
  InsightsTabs,
  PromoBanner,
  DataPeriodBar,
  TrendChart,
  FunnelDiagram,
  useSalesOverview,
  useSalesComposition,
  useInsightsUi,
} from '@/features/insights'

type SalesTab = 'overview' | 'composition'

// Delta display using token colors
function DeltaLine({ delta }: { delta: number }) {
  return (
    <span className={`text-xs font-medium ${delta >= 0 ? 'text-success' : 'text-error-text'}`}>
      {delta >= 0 ? '+' : ''}{delta.toFixed(2)}%
    </span>
  )
}

export function SalesInsightsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<SalesTab>('overview')

  const mode = useInsightsUi((s) => s.mode)
  const orderType = useInsightsUi((s) => s.orderType)
  const setMode = useInsightsUi((s) => s.setMode)
  const setOrderType = useInsightsUi((s) => s.setOrderType)

  const overviewQ = useSalesOverview()
  const compositionQ = useSalesComposition()

  const ov = overviewQ.data
  const comp = compositionQ.data

  const funnelTiers = [
    { label: t('insights.sales.visitors'), value: ov?.visitors.value ?? 100, color: '#3b82f6' },
    { label: t('insights.sales.placedOrder'), value: ov?.placedBuyers.value ?? 0, convRate: ov?.convVisitToPlaced ?? 0, color: '#f97316' },
    { label: t('insights.sales.paidOrder'), value: ov?.paidBuyers.value ?? 0, convRate: ov?.convPlacedToPaid ?? 0, color: '#ef4444' },
  ]

  const tabItems: { key: SalesTab; label: string }[] = [
    { key: 'overview', label: t('insights.sales.subTabOverview') },
    { key: 'composition', label: t('insights.sales.subTabComposition') },
  ]

  return (
    <Page>
      <PageHeader
        title={t('insights.title')}
        breadcrumb={`${t('insights.breadcrumbHome')} › ${t('insights.title')} › ${t('insights.tabs.sales')}`}
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
        <DataPeriodBar mode={mode} orderType={orderType} onModeChange={setMode} onOrderTypeChange={setOrderType} />

        <div className="border-b border-border px-6 pt-4">
          <Tabs
            items={tabItems}
            value={activeTab}
            onChange={(k) => setActiveTab(k as SalesTab)}
          />
        </div>

        <div className="p-6">
          {/* ── OVERVIEW TAB ───────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-base font-semibold text-text">{t('insights.sales.subTabOverview')}</h2>

              {overviewQ.isLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner />
                </div>
              ) : (
                <div className="flex gap-8">
                  {/* Left: KPI funnel rows */}
                  <div className="flex flex-1 flex-col divide-y divide-border">
                    {/* Visit */}
                    <div className="py-4">
                      <span className="mb-2 block text-xs font-semibold text-brand">{t('insights.sales.visitors')}</span>
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-lg font-bold text-text">{ov?.visitors.value ?? 0}</span>
                          <DeltaLine delta={ov?.visitors.delta ?? 0} />
                          <span className="text-[10px] text-muted">{t('insights.vsPrevMonth')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Placed Order */}
                    <div className="py-4">
                      <span className="mb-2 block text-xs font-semibold text-brand">{t('insights.sales.placedOrder')}</span>
                      <div className="flex flex-wrap gap-6">
                        {[
                          { label: t('insights.sales.buyers'), v: ov?.placedBuyers },
                          { label: t('insights.sales.salesAmount'), v: ov?.placedSales, monetary: true },
                        ].map(({ label, v, monetary }) => v && (
                          <div key={label} className="flex flex-col gap-0.5">
                            <span className="text-xs text-muted">{label}</span>
                            <span className="text-sm font-semibold text-text">
                              {monetary ? formatUZS(v.value) : v.value.toLocaleString('ru-RU')}
                            </span>
                            <DeltaLine delta={v.delta} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Paid Order */}
                    <div className="py-4">
                      <span className="mb-2 block text-xs font-semibold text-brand">{t('insights.sales.paidOrder')}</span>
                      <div className="flex flex-wrap gap-6">
                        {[
                          { label: t('insights.sales.buyers'), v: ov?.paidBuyers },
                          { label: t('insights.sales.salesAmount'), v: ov?.paidSales, monetary: true },
                          { label: t('insights.sales.salesPerBuyer'), v: ov?.salesPerBuyer, monetary: true },
                        ].map(({ label, v, monetary }) => v && (
                          <div key={label} className="flex flex-col gap-0.5">
                            <span className="text-xs text-muted">{label}</span>
                            <span className="text-sm font-semibold text-text">
                              {monetary ? formatUZS(v.value) : v.value.toLocaleString('ru-RU')}
                            </span>
                            <DeltaLine delta={v.delta} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: SVG Funnel — chart colors kept */}
                  <div className="hidden shrink-0 items-start justify-center lg:flex">
                    <FunnelDiagram tiers={funnelTiers} width={180} height={240} />
                  </div>
                </div>
              )}

              {/* Metric Trend */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-text">{t('insights.sales.metricTrend')}</h3>
                <TrendChart
                  points={ov?.trend ?? []}
                  seriesKeys={['visitors', 'sales']}
                  labels={[
                    { key: 'visitors', label: t('insights.sales.visitors') },
                    { key: 'sales', label: t('insights.sales.salesAmount') },
                  ]}
                  height={140}
                />
              </div>
            </div>
          )}

          {/* ── COMPOSITION TAB ─────────────────────────────────────────── */}
          {activeTab === 'composition' && (
            <div className="flex flex-col gap-6">
              {compositionQ.isLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner />
                </div>
              ) : (
                <>
                  {/* Category Composition */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-text">{t('insights.sales.categoryComposition')}</h3>
                    {(comp?.categoryTabs ?? []).length > 0 && (
                      <div className="mb-3">
                        <Tabs
                          items={(comp?.categoryTabs ?? []).map((c) => ({ key: c, label: c }))}
                          value={comp?.categoryTabs?.[0] ?? ''}
                          onChange={() => {}}
                        />
                      </div>
                    )}
                    <div className="mb-3 flex gap-4 text-sm">
                      <span className="text-muted">{t('insights.sales.colSales')} <strong className="text-text">{formatUZS(comp?.totalSales ?? 0)}</strong></span>
                      <span className="text-muted">{t('insights.sales.colSalesPct')} <strong className="text-text">100.00%</strong></span>
                    </div>
                    {(comp?.categoryRows ?? []).length === 0 ? (
                      <EmptyState title={t('insights.noData')} />
                    ) : (
                      <Table>
                        <thead>
                          <Tr>
                            <Th>{t('insights.sales.subCategory')}</Th>
                            <Th>{t('insights.sales.colSales')} ⇅</Th>
                            <Th>{t('insights.sales.colSalesPct')} ⇅</Th>
                            <Th>{t('insights.sales.colBuyers')} ⇅</Th>
                            <Th>{t('insights.sales.colConvRate')} ⇅</Th>
                          </Tr>
                        </thead>
                        <tbody>
                          {comp?.categoryRows.map((row, i) => (
                            <Tr key={i}>
                              <Td className="text-text">{row.subCategory}</Td>
                              <Td>{formatUZS(row.salesUzs)}</Td>
                              <Td><InlineBarCell value={row.salesPct} /></Td>
                              <Td className="text-muted">{row.buyers}</Td>
                              <Td className="text-muted">{row.convRate.toFixed(2)}%</Td>
                            </Tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>

                  {/* Order Price Composition */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-text">{t('insights.sales.orderPriceComposition')}</h3>
                    {(comp?.priceRangeRows ?? []).length === 0 ? (
                      <EmptyState title={t('insights.noData')} />
                    ) : (
                      <Table>
                        <thead>
                          <Tr>
                            <Th>{t('insights.sales.priceRange')}</Th>
                            <Th>{t('insights.sales.colBuyers')} ⇅</Th>
                            <Th>{t('insights.sales.colBuyersPct')} ⇅</Th>
                            <Th>{t('insights.sales.colSales')} ⇅</Th>
                            <Th>{t('insights.sales.colConvRate')} ⇅</Th>
                          </Tr>
                        </thead>
                        <tbody>
                          {comp?.priceRangeRows.map((row, i) => (
                            <Tr key={i}>
                              <Td className="text-text">{row.range} soʻm</Td>
                              <Td className="text-muted">{row.buyers}</Td>
                              <Td><InlineBarCell value={row.buyersPct} /></Td>
                              <Td>{formatUZS(row.salesUzs)}</Td>
                              <Td className="text-muted">{row.convRate.toFixed(2)}%</Td>
                            </Tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>

                  {/* Buyers Composition */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-text">{t('insights.sales.buyersComposition')}</h3>
                    {(comp?.buyerTypeRows ?? []).length === 0 ? (
                      <EmptyState title={t('insights.noData')} />
                    ) : (
                      <Table>
                        <thead>
                          <Tr>
                            <Th>{t('insights.sales.typeOfBuyers')}</Th>
                            <Th>{t('insights.sales.colBuyers')} ⇅</Th>
                            <Th>{t('insights.sales.colBuyersPct')} ⇅</Th>
                            <Th>{t('insights.sales.colSales')} ⇅</Th>
                            <Th>{t('insights.sales.colSalesPctBuyers')} ⇅</Th>
                            <Th>{t('insights.sales.colConvRate')} ⇅</Th>
                          </Tr>
                        </thead>
                        <tbody>
                          {comp?.buyerTypeRows.map((row, i) => (
                            <Tr key={i}>
                              <Td className="text-text">
                                {row.type === 'new' ? t('insights.sales.newBuyers') : t('insights.sales.existingBuyers')}
                              </Td>
                              <Td className="text-muted">{row.buyers}</Td>
                              <Td><InlineBarCell value={row.buyersPct} /></Td>
                              <Td>{formatUZS(row.salesUzs)}</Td>
                              <Td><InlineBarCell value={row.salesPct} /></Td>
                              <Td className="text-muted">{row.convRate.toFixed(2)}%</Td>
                            </Tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </Page>
  )
}
