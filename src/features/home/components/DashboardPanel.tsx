import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import type { InsightDashboard } from '../types/home.types'
import { MetricCardGrid } from './MetricCardGrid'
import { TrendChart } from './TrendChart'

// Shared layout for the dashboard and marketing tabs: a KPI grid above a trend
// chart. The conversion line only shows on the dashboard tab.
type Props = { data: InsightDashboard; showConversion: boolean }

export function DashboardPanel({ data, showConversion }: Props) {
  const { t } = useTranslation()

  return (
    <Card className="flex flex-col gap-5 p-6">
      <h2 className="text-base font-semibold text-text">{t('home.insights.keyMetrics')}</h2>
      <MetricCardGrid metrics={data.metrics} />

      <h2 className="text-base font-semibold text-text">{t('home.insights.trendChart')}</h2>
      <TrendChart chart={data.chart} showConversion={showConversion} />
    </Card>
  )
}
