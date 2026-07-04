import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from './notifications.api'
import type { NotificationListQuery } from '../types/notifications.types'

// Stable, structured query keys → cache, dedupe, and invalidation just work.
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (query: NotificationListQuery) => [...notificationKeys.lists(), query] as const,
}

export function useNotifications(query: NotificationListQuery) {
  return useQuery({
    queryKey: notificationKeys.list(query),
    queryFn: () => getNotifications(query),
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
    },
  })
}
