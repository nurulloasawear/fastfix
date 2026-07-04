import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'

type InsightsTab = 'overview' | 'product' | 'sales' | 'services' | 'traffic' | 'marketing'

const TAB_ROUTES: Record<InsightsTab, string> = {
  overview: '/insights/overview',
  product: '/insights/product',
  sales: '/insights/sales',
  services: '/insights/services',
  traffic: '/insights/traffic',
  marketing: '/insights/marketing',
}

const TABS: InsightsTab[] = ['overview', 'product', 'sales', 'services', 'traffic', 'marketing']

export function InsightsTabs() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function activeTab(): InsightsTab {
    for (const tab of TABS) {
      if (pathname.startsWith(TAB_ROUTES[tab])) return tab
    }
    return 'overview'
  }

  const current = activeTab()

  return (
    <div className="flex gap-1 border-b border-border bg-surface px-4 pt-3">
      {TABS.map((tab) => {
        const isActive = current === tab
        return (
          <button
            key={tab}
            type="button"
            onClick={() => navigate(TAB_ROUTES[tab])}
            className={`-mb-px px-4 py-2.5 text-sm font-semibold transition-colors ${
              isActive
                ? 'border-b-2 border-brand text-brand'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            {t(`insights.tabs.${tab}`)}
          </button>
        )
      })}
    </div>
  )
}
