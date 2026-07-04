import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import {
  ReportFilters,
  ReportList,
  ReportStats,
  useGenerateReport,
  useReports,
  useShopUi,
} from '@/features/shop'

export function MyReportsPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useReports()
  const generate = useGenerateReport()
  const filter = useShopUi((s) => s.reportFilter)

  const all = data?.reports ?? []
  const reports = filter === 'all' ? all : all.filter((r) => r.type === filter)

  return (
    <Page>
      <PageHeader
        title={t('shop.reports.title')}
        subtitle={t('shop.reports.subtitle')}
        actions={
          <Button onClick={() => generate.mutate('sales')} disabled={generate.isPending}>
            {generate.isPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                {t('shop.reports.generate')}
              </span>
            ) : (
              t('shop.reports.generate')
            )}
          </Button>
        }
      />

      {data && <ReportStats summary={data.summary} count={all.length} />}

      <Card className="overflow-hidden">
        <ReportFilters />
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <ReportList reports={reports} />
        )}
      </Card>
    </Page>
  )
}
