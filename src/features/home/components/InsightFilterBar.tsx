import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CalendarIcon, ChevronDownIcon, DownloadIcon } from './icons'

// Date-period + (optional) order-type + export controls. `showOrderType` is on
// for the dashboard/marketing tabs only, matching the original layout.
type Props = { showOrderType: boolean }

export function InsightFilterBar({ showOrderType }: Props) {
  const { t } = useTranslation()

  return (
    <Card className="flex flex-wrap items-center gap-4 p-4">
      <span className="text-sm font-semibold text-text-secondary">
        {t('home.insights.datePeriod')}
      </span>
      <button
        type="button"
        className="flex h-11 items-center gap-2 rounded-lg border border-border-strong bg-surface px-3.5 text-sm text-text transition-colors hover:bg-bg focus:border-brand focus:ring-4 focus:ring-[#f2f4f7]"
      >
        <CalendarIcon size={16} className="text-muted" />
        <span className="font-semibold">{t('home.insights.realTime')}</span>
        <span className="text-muted">{t('home.insights.todayUntil')}</span>
      </button>

      {showOrderType && (
        <button
          type="button"
          className="flex h-11 items-center gap-2 rounded-lg border border-border-strong bg-surface px-3.5 text-sm text-text-secondary transition-colors hover:bg-bg focus:border-brand focus:ring-4 focus:ring-[#f2f4f7]"
        >
          {t('home.insights.orderType')}
          <ChevronDownIcon size={16} className="text-muted" />
        </button>
      )}

      <Button variant="outline" className="ml-auto">
        <DownloadIcon size={16} />
        {t('home.insights.exportData')}
      </Button>
    </Card>
  )
}
