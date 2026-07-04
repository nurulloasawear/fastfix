import { useTranslation } from 'react-i18next'
import type { NotificationItem } from '../types/notifications.types'
import { NotificationRow } from './NotificationRow'
import { BellIcon } from './icons'

type Props = {
  notifications: NotificationItem[]
  isLoading: boolean
  onMarkRead: (id: string) => void
  isMarking: boolean
}

export function NotificationList({ notifications, isLoading, onMarkRead, isMarking }: Props) {
  const { t } = useTranslation()

  if (isLoading) return <div className="p-6 text-sm text-muted">{t('common.loading')}</div>

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-table-header text-muted">
          <BellIcon size={24} />
        </div>
        <p className="text-sm text-muted">{t('notifications.empty')}</p>
      </div>
    )
  }

  return (
    <div>
      {notifications.map((notification) => (
        <NotificationRow
          key={notification.id}
          notification={notification}
          onMarkRead={onMarkRead}
          isMarking={isMarking}
        />
      ))}
    </div>
  )
}
