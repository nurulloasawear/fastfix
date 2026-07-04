import { apiClient } from '@/lib/axios'
import type {
  NotificationListQuery,
  NotificationListResponse,
} from '../types/notifications.types'

const PATHS = {
  // [PENDING BACKEND] no seller-notifications route in the API contract yet.
  list: '/seller/notifications',
  // [PENDING BACKEND] mark a single notification read.
  read: (id: string) => `/seller/notifications/${id}/read`,
  // [PENDING BACKEND] mark every notification read.
  readAll: '/seller/notifications/read-all',
}

export async function getNotifications(
  query: NotificationListQuery,
): Promise<NotificationListResponse> {
  const { data } = await apiClient.get<NotificationListResponse>(PATHS.list, { params: query })
  return data
}

export async function markNotificationRead(id: string): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>(PATHS.read(id))
  return data
}

export async function markAllNotificationsRead(): Promise<{ read: number }> {
  const { data } = await apiClient.post<{ read: number }>(PATHS.readAll)
  return data
}
