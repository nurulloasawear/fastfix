import { useTranslation } from 'react-i18next'
import { useShopUi, type ReportFilter } from '../stores/shop.store'

const FILTERS: ReportFilter[] = ['all', 'sales', 'finance', 'inventory']

export function ReportFilters() {
  const { t } = useTranslation()
  const active = useShopUi((s) => s.reportFilter)
  const setFilter = useShopUi((s) => s.setReportFilter)

  return (
    <div className="flex flex-wrap gap-2 border-b border-border p-4">
      {FILTERS.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => setFilter(f)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            active === f
              ? 'bg-brand text-white'
              : 'border border-border-strong bg-surface text-text-secondary hover:bg-bg'
          }`}
        >
          {t(`shop.reports.filter.${f}`)}
        </button>
      ))}
    </div>
  )
}
