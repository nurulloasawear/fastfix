import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/finance', key: 'income', end: true },
  { to: '/finance/balance', key: 'balance', end: false },
  { to: '/finance/bank-accounts', key: 'bankAccounts', end: false },
  { to: '/finance/settings', key: 'settings', end: false },
] as const

export function FinanceNav() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-brand text-white'
                : 'border border-border-strong bg-surface text-text-secondary hover:bg-bg'
            }`
          }
        >
          {t(`finance.nav.${tab.key}`)}
        </NavLink>
      ))}
    </div>
  )
}
