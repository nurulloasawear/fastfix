import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  NotificationList,
  NotificationTabs,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useNotificationsUi,
} from '@/features/notifications'

// THIN page: it composes the feature. All data/logic lives in @/features/notifications.
export function NotificationPage() {
  const { t } = useTranslation()
  const tab = useNotificationsUi((s) => s.tab)
  const setTab = useNotificationsUi((s) => s.setTab)

  const { data, isLoading } = useNotifications({ tab })
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const notifications = data?.notifications ?? []
  const hasUnread = (data?.unread.all ?? 0) > 0

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <PageHeader
        title={t('notifications.title')}
        breadcrumb={`${t('notifications.breadcrumbHome')} › ${t('notifications.title')}`}
        actions={
          <Button
            variant="outline"
            disabled={!hasUnread || markAllRead.isPending}
            onClick={() => markAllRead.mutate()}
          >
            {t('notifications.markAllRead')}
          </Button>
        }
      />

      <NotificationTabs active={tab} unread={data?.unread} onChange={setTab} />

      <Card className="overflow-hidden">
        <NotificationList
          notifications={notifications}
          isLoading={isLoading}
          onMarkRead={(id) => markRead.mutate(id)}
          isMarking={markRead.isPending}
        />
      </Card>
    </div>
  )
}
