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
import { Spinner } from '@/components/ui/Spinner'
import { formatUZS } from '@/utils/money'
import {
  InsightsTabs,
  PromoBanner,
  DataPeriodBar,
  TrendChart,
  FunnelDiagram,
  useChatOverview,
  useInsightsUi,
} from '@/features/insights'

type ServicesTab = 'chat' | 'faq'
type ChatDetailsTab = 'non-responded' | 'responded'

// Delta display with token colors
function DeltaLine({ delta }: { delta: number }) {
  return (
    <span className={`text-xs font-medium ${delta >= 0 ? 'text-success' : 'text-error-text'}`}>
      {delta >= 0 ? '+' : ''}{delta.toFixed(2)}%
    </span>
  )
}

export function ServicesInsightsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<ServicesTab>('chat')
  const [chatDetailsTab, setChatDetailsTab] = useState<ChatDetailsTab>('non-responded')

  const mode = useInsightsUi((s) => s.mode)
  const orderType = useInsightsUi((s) => s.orderType)
  const setMode = useInsightsUi((s) => s.setMode)
  const setOrderType = useInsightsUi((s) => s.setOrderType)

  const { data, isLoading } = useChatOverview()

  const funnelTiers = [
    { label: t('insights.services.visitors'), value: data?.visitors.value ?? 10, color: '#3b82f6' },
    { label: t('insights.services.chatEnquired'), value: data?.chatEnquired.value ?? 0, convRate: 0, color: '#f97316' },
    { label: t('insights.services.respondedChats'), value: data?.respondedChats.value ?? 0, convRate: 0, color: '#10b981' },
    { label: 'Conversion', value: 0, convRate: 0, color: '#f59e0b' },
    { label: t('insights.sales.placedOrder'), value: data?.orders.value ?? 0, convRate: 0, color: '#ef4444' },
  ]

  const serviceTabItems = [
    { key: 'chat' as ServicesTab, label: t('insights.services.subTabChat') },
    { key: 'faq' as ServicesTab, label: t('insights.services.subTabFaq') },
  ]

  const chatDetailTabItems = [
    { key: 'non-responded' as ChatDetailsTab, label: t('insights.services.nonRespondedTab') },
    { key: 'responded' as ChatDetailsTab, label: t('insights.services.respondedTab') },
  ]

  return (
    <Page>
      <PageHeader
        title={t('insights.title')}
        breadcrumb={`${t('insights.breadcrumbHome')} › ${t('insights.title')} › ${t('insights.tabs.services')}`}
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

        <div className="border-b border-border px-6 pt-4">
          <Tabs
            items={serviceTabItems}
            value={activeTab}
            onChange={(k) => setActiveTab(k as ServicesTab)}
          />
        </div>

        <div className="p-6">
          {activeTab === 'chat' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-base font-semibold text-text">{t('insights.services.chatOverview')}</h2>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner />
                </div>
              ) : (
                <>
                  {/* KPI rows + Funnel */}
                  <div className="flex gap-8">
                    <div className="flex flex-1 flex-col divide-y divide-border">
                      {/* Enquiry row */}
                      <div className="py-4">
                        <span className="mb-2 block text-xs font-semibold text-brand">{t('insights.services.enquiry')}</span>
                        <div className="flex flex-wrap gap-6">
                          {[
                            { label: t('insights.services.visitors'), value: data?.visitors.value ?? 10, delta: data?.visitors.delta ?? 0 },
                            { label: t('insights.services.chatEnquired'), value: data?.chatEnquired.value ?? 0, delta: data?.chatEnquired.delta ?? 0 },
                            { label: t('insights.services.visitorsEnquired'), value: data?.visitorsEnquired.value ?? 0, delta: data?.visitorsEnquired.delta ?? 0 },
                          ].map(({ label, value, delta }) => (
                            <div key={label} className="flex flex-col gap-0.5">
                              <span className="text-xs text-muted">{label}</span>
                              <span className="text-sm font-semibold text-text">{value.toLocaleString('ru-RU')}</span>
                              <DeltaLine delta={delta} />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Response row */}
                      <div className="py-4">
                        <span className="mb-2 block text-xs font-semibold text-brand">{t('insights.services.response')}</span>
                        <div className="flex flex-wrap gap-6">
                          {[
                            { label: t('insights.services.respondedChats'), v: data?.respondedChats },
                            { label: t('insights.services.nonRespondedChats'), v: data?.nonRespondedChats },
                          ].map(({ label, v }) => v && (
                            <div key={label} className="flex flex-col gap-0.5">
                              <span className="text-xs text-muted">{label}</span>
                              <span className="text-sm font-semibold text-text">{v.value.toLocaleString('ru-RU')}</span>
                              <DeltaLine delta={v.delta} />
                            </div>
                          ))}
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-muted">{t('insights.services.avgResponseTime')}</span>
                            <span className="text-sm font-semibold text-text">{data?.avgResponseTime ?? '--:--:--'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Outcome row — use StatCards */}
                      <div className="py-4">
                        <span className="mb-3 block text-xs font-semibold text-brand">{t('insights.services.outcome')}</span>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {[
                            { label: t('insights.services.buyers'), v: data?.buyers },
                            { label: t('insights.services.orders'), v: data?.orders },
                            { label: t('insights.services.units'), v: data?.units },
                            { label: t('insights.services.sales'), v: data?.salesUzs, monetary: true },
                          ].map(({ label, v, monetary }) => v && (
                            <StatCard
                              key={label}
                              label={label}
                              value={monetary ? formatUZS(v.value) : v.value.toLocaleString('ru-RU')}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Funnel — chart colors kept */}
                    <div className="hidden shrink-0 items-start lg:flex">
                      <FunnelDiagram tiers={funnelTiers} width={160} height={250} />
                    </div>
                  </div>

                  {/* Metric Trend */}
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-text">{t('insights.services.metricTrend')}</h3>
                    <TrendChart
                      points={data?.trend ?? []}
                      seriesKeys={['visitors', 'enquired']}
                      labels={[
                        { key: 'visitors', label: t('insights.services.visitors') },
                        { key: 'enquired', label: t('insights.services.chatEnquired') },
                      ]}
                      height={130}
                    />
                  </div>

                  {/* Chat Details */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-text">{t('insights.services.chatDetails')}</h3>
                    <Tabs
                      items={chatDetailTabItems}
                      value={chatDetailsTab}
                      onChange={(k) => setChatDetailsTab(k as ChatDetailsTab)}
                      className="mb-4"
                    />
                    <Table>
                      <thead>
                        <Tr>
                          <Th>{t('insights.services.colSender')}</Th>
                          <Th>{t('insights.services.colTimestamp')}</Th>
                          <Th>{t('insights.services.colMessage')}</Th>
                        </Tr>
                      </thead>
                      <tbody>
                        <Tr>
                          <Td colSpan={3}>
                            <EmptyState title={t('insights.services.noDataChat')} />
                          </Td>
                        </Tr>
                      </tbody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'faq' && (
            <EmptyState
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              }
              title="FAQ Assistant"
              description="Coming soon"
            />
          )}
        </div>
      </Card>
    </Page>
  )
}
