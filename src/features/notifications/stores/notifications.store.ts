import { create } from 'zustand'
import type { NotificationTab } from '../types/notifications.types'

interface NotificationsUiState {
  tab: NotificationTab
  setTab: (tab: NotificationTab) => void
}

// CLIENT/UI state ONLY (the active category tab). Server data lives in TanStack Query.
export const useNotificationsUi = create<NotificationsUiState>((set) => ({
  tab: 'all',
  setTab: (tab) => set({ tab }),
}))
