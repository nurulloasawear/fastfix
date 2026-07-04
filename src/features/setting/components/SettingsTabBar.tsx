import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Shopee-style horizontal tab bar: active tab gets brand underline (not pill).
// Used by all /settings/* pages.

interface Tab {
  path: string
  labelKey: string
}

const TABS: Tab[] = [
  { path: '/settings/account', labelKey: 'setting.tabs.account' },
  { path: '/settings/chat', labelKey: 'setting.tabs.chat' },
  { path: '/settings/payment', labelKey: 'setting.tabs.payment' },
  { path: '/settings/product', labelKey: 'setting.tabs.product' },
  { path: '/settings/notifications', labelKey: 'setting.tabs.notifications' },
  { path: '/settings/vacation', labelKey: 'setting.tabs.vacation' },
  { path: '/settings/partners', labelKey: 'setting.tabs.partners' },
]

export function SettingsTabBar() {
  const { t } = useTranslation()
  return (
    <nav className="flex gap-0 overflow-x-auto border-b border-border">
      {TABS.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end
          className={({ isActive }) =>
            `shrink-0 px-4 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${
              isActive
                ? 'border-brand text-brand'
                : 'border-transparent text-text-secondary hover:text-text'
            }`
          }
        >
          {t(tab.labelKey)}
        </NavLink>
      ))}
    </nav>
  )
}
