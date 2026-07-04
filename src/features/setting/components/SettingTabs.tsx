import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SETTING_SECTIONS } from '../stores/setting.store'
import type { SettingSection } from '../stores/setting.store'

// Sub-navigation across the 5 setting pages. Routed so each page is deep-linkable.
const SECTION_PATH: Record<SettingSection, string> = {
  account: '/setting',
  addresses: '/setting/addresses',
  shop: '/setting/shop',
  security: '/setting/security',
  partner: '/setting/partner',
}

export function SettingTabs() {
  const { t } = useTranslation()
  return (
    <nav className="flex flex-wrap gap-2">
      {SETTING_SECTIONS.map((section) => (
        <NavLink
          key={section}
          to={SECTION_PATH[section]}
          end={section === 'account'}
          className={({ isActive }) =>
            `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-brand text-white'
                : 'border border-border-strong bg-surface text-text-secondary hover:bg-bg'
            }`
          }
        >
          {t(`setting.nav.${section}`)}
        </NavLink>
      ))}
    </nav>
  )
}
