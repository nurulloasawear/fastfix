import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { formatUZS } from '@/utils/money'
import type { ReportsSummary } from '../types/shop.types'

export function ReportStats({ summary, count }: { summary: ReportsSummary; count: number }) {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="p-4">
        <span className="text-xs font-semibold uppercase text-muted">{t('shop.reports.monthSales')}</span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-text">{formatUZS(summary.monthSalesUzs)}</span>
          <span className="text-xs font-semibold text-success">
            +{summary.monthSalesChange.toFixed(1)}%
          </span>
        </div>
      </Card>
      <Card className="p-4">
        <span className="text-xs font-semibold uppercase text-muted">{t('shop.reports.itemsSold')}</span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-text">{summary.itemsSold.toLocaleString('ru-RU')}</span>
          <span className="text-xs font-semibold text-text-secondary">{t('shop.reports.itemsSoldUnit')}</span>
        </div>
      </Card>
      <Card className="p-4 sm:col-span-2 lg:col-span-1">
        <span className="text-xs font-semibold uppercase text-muted">{t('shop.reports.storeCount')}</span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-text">
            {count} {t('shop.reports.filesTotal')}
          </span>
          <span className="text-xs text-muted">{t('shop.reports.filesUnit')}</span>
        </div>
      </Card>
    </div>
  )
}
