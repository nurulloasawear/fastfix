import type { LangMap } from '@/lib/lang'

// Top-of-sidebar notification centre. Tab = category filter (`all` is the union).
// Content (title/body) is multi-language LangMap, resolved with pickLang at render.
export type NotificationTab =
  | 'all'
  | 'order_updates'
  | 'rating'
  | 'return_refund'
  | 'listing'
  | 'marketing_centre'
  | 'seller_balance'

// `all` is a UI-only filter; a stored notification always has a concrete category.
export type NotificationCategory = Exclude<NotificationTab, 'all'>

export const NOTIFICATION_TABS: NotificationTab[] = [
  'all',
  'order_updates',
  'rating',
  'return_refund',
  'listing',
  'marketing_centre',
  'seller_balance',
]

export interface NotificationItem {
  id: string
  category: NotificationCategory
  title: LangMap
  body: LangMap
  read: boolean
  createdAt: string
}

export interface NotificationListQuery {
  tab?: NotificationTab
}

// Per-tab unread counts. `all` is the grand total of unread, every other key is
// the unread count for that category — DERIVED from the data, never hardcoded.
export type NotificationUnread = Record<NotificationTab, number>

export interface NotificationListResponse {
  notifications: NotificationItem[]
  total: number
  unread: NotificationUnread
}
