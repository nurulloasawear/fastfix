// PUBLIC API of the notifications feature. Pages import ONLY from here
// (`@/features/notifications`) — never a deep path. ESLint enforces this.
export {
  notificationKeys,
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from './api/notifications.queries'
export { useNotificationsUi } from './stores/notifications.store'
export { notificationsHandlers } from './api/notifications.mocks'
export { notificationsMessages } from './i18n'

export { NotificationTabs } from './components/NotificationTabs'
export { NotificationList } from './components/NotificationList'
export { NotificationRow } from './components/NotificationRow'

export { NOTIFICATION_TABS } from './types/notifications.types'
export type {
  NotificationTab,
  NotificationCategory,
  NotificationItem,
  NotificationListQuery,
  NotificationListResponse,
  NotificationUnread,
} from './types/notifications.types'
