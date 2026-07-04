import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SUB_NAV = [
  { to: '/live/analytics', key: 'analytics' },
  { to: '/live/streaming-price', key: 'streamingPrice' },
  { to: '/live/create', key: 'createStream' },
  { to: '/live/go-live', key: 'goLive' },
] as const

export function LiveSubNav() {
  const { t } = useTranslation()
  return (
    <nav className="flex items-center gap-1 border-b border-border bg-surface px-6">
      {SUB_NAV.map(({ to, key }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              isActive
                ? 'border-brand text-brand'
                : 'border-transparent text-text-secondary hover:text-text'
            }`
          }
        >
          {t(`live.nav.${key}`)}
        </NavLink>
      ))}
    </nav>
  )
}
