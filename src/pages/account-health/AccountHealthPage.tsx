import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  HealthScoreHeader,
  IssuesToImprove,
  KpiStrip,
  MetricsTable,
  PenaltyPanel,
  VerifiedSellerWidget,
  useAccountHealthSummary,
} from '@/features/account-health'

export function AccountHealthPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useAccountHealthSummary()

  return (
    <Page>
      <PageHeader
        title={t('accountHealth.title')}
        breadcrumb={`${t('accountHealth.breadcrumbHome')} › ${t('accountHealth.title')}`}
      />

      {/* Health score + verified seller widget */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-1">
          <HealthScoreHeader
            label={data?.healthLabel ?? 'EXCELLENT'}
            isLoading={isLoading}
          />
        </div>
        <div className="w-full lg:w-64">
          <VerifiedSellerWidget />
        </div>
      </div>

      {/* KPI strip */}
      <KpiStrip
        adminSided={data?.adminSidedListings ?? 0}
        penaltyPoints={data?.penaltyPoints ?? 0}
        ongoingAppeals={data?.ongoingAppeals ?? 0}
        isLoading={isLoading}
      />

      {/* Penalty panel */}
      <PenaltyPanel
        penaltyPoints={data?.penaltyPoints ?? 0}
        penaltyMax={data?.penaltyMax ?? 6}
        punishmentActive={data?.punishmentActive ?? false}
        isLoading={isLoading}
      />

      {/* Metrics details table */}
      <MetricsTable
        metrics={data?.metrics ?? []}
        isLoading={isLoading}
      />

      {/* Issues to Improve */}
      <IssuesToImprove
        listingsWithIssues={data?.listingsWithIssues ?? 0}
        lateOrders={data?.lateOrders ?? 0}
        isLoading={isLoading}
      />
    </Page>
  )
}
