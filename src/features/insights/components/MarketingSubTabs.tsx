import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'

type MktTab =
  | 'discount'
  | 'flash-deals'
  | 'voucher'
  | 'shipping-promo'
  | 'livestream'
  | 'stream-deal'
  | 'external-traffic'

const MKT_ROUTES: Record<MktTab, string> = {
  discount: '/insights/marketing/discount',
  'flash-deals': '/insights/marketing/flash-deals',
  voucher: '/insights/marketing/voucher',
  'shipping-promo': '/insights/marketing/shipping-promo',
  livestream: '/insights/marketing/livestream',
  'stream-deal': '/insights/marketing/stream-deal',
  'external-traffic': '/insights/marketing/external-traffic',
}

const MKT_TABS: MktTab[] = [
  'discount',
  'flash-deals',
  'voucher',
  'shipping-promo',
  'livestream',
  'stream-deal',
  'external-traffic',
]

const LABEL_KEYS: Record<MktTab, string> = {
  discount: 'marketing.subTabDiscount',
  'flash-deals': 'marketing.subTabFlashDeals',
  voucher: 'marketing.subTabVoucher',
  'shipping-promo': 'marketing.subTabShipping',
  livestream: 'marketing.subTabLivestream',
  'stream-deal': 'marketing.subTabStreamDeal',
  'external-traffic': 'marketing.subTabExternalTraffic',
}

export function MarketingSubTabs() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function activeTab(): MktTab {
    for (const tab of MKT_TABS) {
      if (pathname.startsWith(MKT_ROUTES[tab])) return tab
    }
    return 'discount'
  }

  const current = activeTab()

  return (
    <div className="flex flex-wrap gap-0 border-b border-border bg-surface px-4 pt-2">
      {MKT_TABS.map((tab) => {
        const isActive = current === tab
        return (
          <button
            key={tab}
            type="button"
            onClick={() => navigate(MKT_ROUTES[tab])}
            className={`-mb-px whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
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
