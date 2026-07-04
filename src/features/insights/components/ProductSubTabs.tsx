import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'

type ProductTab = 'overview' | 'traffic' | 'performance' | 'diagnosis'

const PRODUCT_ROUTES: Record<ProductTab, string> = {
  overview: '/insights/product/overview',
  traffic: '/insights/product/traffic',
  performance: '/insights/product/performance',
  diagnosis: '/insights/product/diagnosis',
}

const PRODUCT_TABS: ProductTab[] = ['overview', 'traffic', 'performance', 'diagnosis']

const LABEL_KEYS: Record<ProductTab, string> = {
  overview: 'product.subTabOverview',
  traffic: 'product.subTabTraffic',
  performance: 'product.subTabPerformance',
  diagnosis: 'product.subTabDiagnosis',
}

export function ProductSubTabs() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function activeTab(): ProductTab {
    for (const tab of PRODUCT_TABS) {
      if (pathname === PRODUCT_ROUTES[tab] || pathname.startsWith(PRODUCT_ROUTES[tab] + '/')) {
        return tab
      }
    }
    return 'overview'
  }

  const current = activeTab()

  return (
    <div className="flex gap-1 border-b border-border bg-surface px-4 pt-2">
      {PRODUCT_TABS.map((tab) => {
        const isActive = current === tab
        return (
          <button
            key={tab}
            type="button"
            onClick={() => navigate(PRODUCT_ROUTES[tab])}
            className={`-mb-px px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'border-b-2 border-brand text-brand'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            {t(`insights.${LABEL_KEYS[tab]}`)}
          </button>
        )
      })}
    </div>
  )
}
