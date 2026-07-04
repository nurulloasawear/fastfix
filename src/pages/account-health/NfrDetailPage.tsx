import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  DonutChart,
  LineChart,
  useNfrDetail,
  CalendarIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
} from '@/features/account-health'
import type { NfrToggle } from '@/features/account-health'
import { NfrOverviewStrip, NfrAffectedOrdersTable } from '@/features/account-health'

function defaultDates() {
  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - 7)
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) }
}

function fmtDate(iso: string) {
  return iso.replace(/-/g, '/')
}

export function NfrDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [dates] = useState(defaultDates)
  const [donutToggle, setDonutToggle] = useState<NfrToggle>('amount')
  const { data, isLoading } = useNfrDetail(dates.from, dates.to)

  const trend = (data?.trend ?? []).map((s) => ({
    label: s.weekStart.slice(5).replace('-', ' '),
    value: s.rate,
  }))

  const breadcrumb = (
    <span className="flex items-center gap-1 text-sm text-muted">
      <button type="button" onClick={() => navigate('/account-health')} className="hover:underline">
        {t('accountHealth.breadcrumbHome')}
      </button>
      {' › '}
      <button type="button" onClick={() => navigate('/account-health')} className="hover:underline">
        {t('accountHealth.title')}
      </button>
      {' › '}
      <span className="text-text">{t('accountHealth.nfr.breadcrumb')}</span>
    </span>
  )

  return (
    <Page>
      <PageHeader
        title={t('accountHealth.nfr.title')}
        breadcrumb={breadcrumb}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-text-secondary">
              <CalendarIcon size={14} />
              <span>{fmtDate(dates.from)} – {fmtDate(dates.to)}</span>
            </div>
            <Button variant="outline" size="sm">{t('accountHealth.learnMore')}</Button>
          </div>
        }
      />

      <NfrOverviewStrip
        myShopRate={data?.myShopRate}
        isLoading={isLoading}
        fromDate={dates.from}
        toDate={dates.to}
      />

      {/* Metric Diagnosis */}
      <Card className={`flex items-start gap-3 px-5 py-4 ${data?.passing !== false ? 'border-l-4 border-l-success' : 'border-l-4 border-l-error'}`}>
        {data?.passing !== false ? (
          <CheckCircleIcon size={16} className="mt-0.5 text-success shrink-0" />
        ) : (
          <AlertTriangleIcon size={16} className="mt-0.5 text-error-text shrink-0" />
        )}
        <div>
          <p className="text-xs font-semibold text-text-secondary mb-0.5">{t('accountHealth.nfr.diagnosis')}</p>
          <p className="text-sm text-text">{t('accountHealth.nfr.diagnosisPassing')}</p>
        </div>
      </Card>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text">{t('accountHealth.nfr.salesOfIncomplete')}</h3>
            <div className="flex overflow-hidden rounded-full border border-border">
              {(['amount', 'count'] as const).map((opt) => (
                <Button
                  key={opt}
                  type="button"
                  variant={donutToggle === opt ? 'primary' : 'ghost'}
                  size="sm"
                  className="rounded-none first:rounded-l-full last:rounded-r-full h-8 px-3 text-xs"
                  onClick={() => setDonutToggle(opt)}
                >
                  {t(`accountHealth.nfr.by${opt.charAt(0).toUpperCase()}${opt.slice(1)}`)}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center py-4">
            <DonutChart
              slices={data?.donutSlices ?? []}
              toggle={donutToggle}
              noDataLabel={t('accountHealth.nfr.noData')}
              size={160}
            />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text">{t('accountHealth.nfr.trendTitle')}</h3>
            <div className="flex items-center gap-2 text-xs text-muted">
              <svg width="24" height="8" viewBox="0 0 24 8" aria-hidden="true">
                <line x1="0" y1="4" x2="24" y2="4" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" />
              </svg>
              <span>{t('accountHealth.nfr.threshold')}</span>
            </div>
          </div>
          <LineChart
            data={trend}
            maxY={5}
            thresholdY={5}
            yLabels={['5.00%', '4.00%', '3.00%', '2.00%', '1.00%', '0.00%']}
            lineColor="#2d201c"
            dotColor="#2d201c"
            height={200}
          />
        </Card>
      </div>

      <NfrAffectedOrdersTable orders={data?.affectedOrders ?? []} />
    </Page>
  )
}
