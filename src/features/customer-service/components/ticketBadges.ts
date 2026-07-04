import type { TicketPriority, TicketStatus } from '../types/customer-service.types'

// Shared Zenith Badge tones so the table and the detail modal stay in sync.
type Tone = 'gray' | 'brand' | 'success' | 'error' | 'warning' | 'info'

export const PRIORITY_TONE: Record<TicketPriority, Tone> = {
  high: 'error',
  medium: 'warning',
  low: 'info',
}

export const STATUS_TONE: Record<TicketStatus, Tone> = {
  open: 'error',
  pending: 'warning',
  resolved: 'success',
}
