import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DownloadIcon } from './icons'
import { formatBytes } from './format'
import type { ShopReport } from '../types/shop.types'

const FORMAT_TONE: Record<ShopReport['format'], string> = {
  excel: 'bg-success-bg text-success',
  pdf: 'bg-error-bg text-error-text',
}

function ReportRow({ report }: { report: ShopReport }) {
  const { t } = useTranslation()
  const generating = report.status === 'generating'

  return (
    <div className="flex flex-col items-start justify-between gap-4 p-4 transition hover:bg-bg sm:flex-row sm:items-center">
      <div className="flex items-center gap-3.5">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg text-xs font-semibold uppercase ${FORMAT_TONE[report.format]}`}>
          {report.format}
        </div>
        <div className="space-y-0.5">
          <h4 className="text-sm font-medium leading-snug text-text">{report.title}</h4>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted">
            <span>{report.dateRange}</span>
            <span>•</span>
            <span>
              {t('shop.reports.formatLabel')}:{' '}
              <b className={report.format === 'excel' ? 'text-success' : 'text-error-text'}>
                {report.format.toUpperCase()}
              </b>
            </span>
            <span>•</span>
            <span>
              {t('shop.reports.sizeLabel')}: {formatBytes(report.fileSizeBytes)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
        <Badge tone={generating ? 'warning' : 'success'}>
          {generating ? t('shop.reports.generating') : t('shop.reports.ready')}
        </Badge>
        <Button variant="outline" size="sm" disabled={generating} className="text-text">
          <DownloadIcon className="h-3.5 w-3.5" />
          <span>{t('shop.reports.download')}</span>
        </Button>
      </div>
    </div>
  )
}

export function ReportList({ reports }: { reports: ShopReport[] }) {
  const { t } = useTranslation()
  if (reports.length === 0) {
    return <div className="p-8 text-center text-sm text-muted">{t('shop.reports.empty')}</div>
  }
  return (
    <div className="divide-y divide-border">
      {reports.map((r) => (
        <ReportRow key={r.id} report={r} />
      ))}
    </div>
  )
}
