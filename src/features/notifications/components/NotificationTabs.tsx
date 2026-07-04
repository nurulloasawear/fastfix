import { useTranslation } from 'react-i18next'
import {
  NOTIFICATION_TABS,
  type NotificationTab,
  type NotificationUnread,
} from '../types/notifications.types'

type Props = {
  active: NotificationTab
  unread?: NotificationUnread
  onChange: (tab: NotificationTab) => void
}

export function NotificationTabs({ active, unread, onChange }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap gap-2">
      {NOTIFICATION_TABS.map((tab) => {
        const count = unread?.[tab]
        const isActive = active === tab
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-brand text-white'
                : 'border border-border-strong bg-surface text-text-secondary hover:bg-bg'
            }`}
          >
            {t(`notifications.tab.${tab}`)}
            {count ? (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs leading-none ${
                  isActive ? 'bg-white/20 text-white' : 'bg-brand text-white'
                }`}
              >
                {count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
