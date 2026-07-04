import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import {
  DashboardPanel,
  InsightFilterBar,
  InsightTabs,
  MetricRows,
  useBusinessInsights,
  useHomeUi,
} from '@/features/home'

// THIN page: it composes the feature. All data/logic lives in @/features/home.
// Tab selection is UI state (zustand); the dataset comes from TanStack Query.
export function BusinessInsightsPage() {
  const { t } = useTranslation()
  const tab = useHomeUi((s) => s.insightTab)
  const setTab = useHomeUi((s) => s.setInsightTab)
  const { data, isLoading } = useBusinessInsights()

  const titleKey =
    tab === 'product'
      ? 'home.insights.productOverview'
      : tab === 'sales_services'
        ? 'home.insights.salesServices'
        : tab === 'marketing'
          ? 'home.insights.tab.marketing'
          : 'home.insights.title'

  const showOrderType = tab === 'dashboard' || tab === 'marketing'

  return (
    <Page>
      <PageHeader
        title={t(titleKey)}
        breadcrumb={
          <span>
            {t('home.insights.breadcrumbHome')} › {t('home.insights.title')}
            {tab !== 'dashboard' && ` › ${t(titleKey)}`}
          </span>
        }
      />

      <InsightTabs active={tab} onChange={setTab} />
      <InsightFilterBar showOrderType={showOrderType} />

      {isLoading || !data ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <>
          {tab === 'dashboard' && <DashboardPanel data={data.dashboard} showConversion />}
          {tab === 'marketing' && <DashboardPanel data={data.marketing} showConversion={false} />}
          {tab === 'product' && (
            <MetricRows titleKey="home.insights.productOverview" rows={data.productOverview} />
          )}
          {tab === 'sales_services' && (
            <MetricRows titleKey="home.insights.salesServices" rows={data.salesServices} />
          )}
        </>
      )}
    </Page>
  )
}
