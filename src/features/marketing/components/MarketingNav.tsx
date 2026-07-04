import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/marketing', key: 'centre', end: true },
  { to: '/marketing/promotions', key: 'promotions', end: false },
  { to: '/marketing/ads', key: 'ads', end: false },
  { to: '/marketing/flash-deals', key: 'flashDeals', end: false },
  { to: '/marketing/vouchers', key: 'vouchers', end: false },
  { to: '/marketing/campaigns', key: 'campaigns', end: false },
  { to: '/marketing/creators', key: 'creators', end: false },
  { to: '/marketing/review-prize', key: 'reviewPrize', end: false },
] as const

export function MarketingNav() {
  const { t } = useTranslation()

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `whitespace-nowrap border-b-2 px-3 pb-2 pt-1 text-sm font-medium transition-colors ${
              isActive
                ? 'border-brand text-brand'
                : 'border-transparent text-text-secondary hover:text-text'
            }`
          }
        >
          {t(`marketing.nav.${tab.key}`)}
        </NavLink>
      ))}
    </nav>
  )
}
