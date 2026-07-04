import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LANGUAGES, setLanguage } from '@/i18n'
import { useAuth } from '@/features/auth'

// The 10 Shopee Seller Centre sections (exact sidebar order) + a Home landing.
const NAV = [
  { to: '/home', key: 'nav.home' },
  { to: '/orders', key: 'nav.orders' },
  { to: '/products', key: 'nav.products' },
  { to: '/marketing', key: 'nav.marketing' },
  { to: '/customer-service', key: 'nav.customerService' },
  { to: '/finance', key: 'nav.finance' },
  { to: '/insights', key: 'nav.insights' },
  { to: '/shop', key: 'nav.shop' },
  { to: '/live', key: 'nav.live' },
  { to: '/account-health', key: 'nav.accountHealth' },
  { to: '/settings', key: 'nav.settings' },
]

export function Sidebar() {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const name = user?.full_name || user?.username || user?.phone || 'Seller'
  const initials = name.slice(0, 1).toUpperCase()

  return (
    <aside className="flex h-screen w-[280px] shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
          OZB
        </span>
        <span className="text-lg font-semibold text-text">Seller</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `mb-1 block rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                isActive ? 'bg-brand text-white' : 'text-text-secondary hover:bg-bg'
              }`
            }
          >
            {t(item.key)}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-4">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-brand">
            {initials}
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-text">{name}</span>
            <span className="truncate text-xs text-muted">{user?.seller?.shop_name ?? user?.phone ?? ''}</span>
          </div>
          <button
            type="button"
            onClick={logout}
            title={t('auth.logout')}
            aria-label={t('auth.logout')}
            className="ml-auto shrink-0 rounded-md p-1.5 text-muted transition-colors hover:bg-bg hover:text-text"
          >
            ⎋
          </button>
        </div>
        <div className="flex gap-1.5">
          {LANGUAGES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLanguage(l)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
                i18n.language === l ? 'bg-brand text-white' : 'bg-bg text-muted hover:text-text'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
