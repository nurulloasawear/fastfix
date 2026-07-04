import { create } from 'zustand'
import type {
  DeadlineBucket, OrderStatus, OrderSubStatus,
  ReturnPrimaryTab, ReturnPriority, ReturnStatus,
} from '../types/orders.types'

// ── My Orders UI ──────────────────────────────────────────────────────────────
interface OrdersUiState {
  status: OrderStatus
  subStatus: OrderSubStatus
  orderId: string
  shippingChannel: string
  setStatus: (status: OrderStatus) => void
  setSubStatus: (subStatus: OrderSubStatus) => void
  setOrderId: (orderId: string) => void
  setShippingChannel: (channel: string) => void
  resetSearch: () => void
}

export const useOrdersUi = create<OrdersUiState>((set) => ({
  status: 'all',
  subStatus: 'all',
  orderId: '',
  shippingChannel: '',
  setStatus: (status) => set({ status, subStatus: 'all', orderId: '', shippingChannel: '' }),
  setSubStatus: (subStatus) => set({ subStatus }),
  setOrderId: (orderId) => set({ orderId }),
  setShippingChannel: (shippingChannel) => set({ shippingChannel }),
  resetSearch: () => set({ orderId: '', shippingChannel: '' }),
}))

// ── Mass Ship UI ──────────────────────────────────────────────────────────────
interface MassShipUiState {
  massShipTab: 'orders_to_ship' | 'generate_documents'
  deadlineBucket: DeadlineBucket
  channel: string
  processStatus: 'all' | 'processed' | 'to_process'
  page: number
  selectedIds: string[]
  arrangeMethod: 'dropoff' | 'pickup'
  docTypes: string[]
  setMassShipTab: (tab: 'orders_to_ship' | 'generate_documents') => void
  setDeadlineBucket: (bucket: DeadlineBucket) => void
  setChannel: (channel: string) => void
  setProcessStatus: (s: 'all' | 'processed' | 'to_process') => void
  setPage: (page: number) => void
  resetFilters: () => void
  toggleSelect: (id: string) => void
  selectAll: (ids: string[]) => void
  clearSelection: () => void
  setArrangeMethod: (method: 'dropoff' | 'pickup') => void
  toggleDocType: (type: string) => void
}

export const useMassShipUi = create<MassShipUiState>((set) => ({
  massShipTab: 'orders_to_ship',
  deadlineBucket: 'all',
  channel: 'all',
  processStatus: 'all',
  page: 1,
  selectedIds: [],
  arrangeMethod: 'dropoff',
  docTypes: ['label'],
  setMassShipTab: (massShipTab) => set({ massShipTab, selectedIds: [], page: 1 }),
  // filter changes clear the (now-stale) selection and reset to page 1
  setDeadlineBucket: (deadlineBucket) => set({ deadlineBucket, selectedIds: [], page: 1 }),
  setChannel: (channel) => set({ channel, selectedIds: [], page: 1 }),
  setProcessStatus: (processStatus) => set({ processStatus, selectedIds: [], page: 1 }),
  setPage: (page) => set({ page, selectedIds: [] }),
  resetFilters: () => set({ deadlineBucket: 'all', channel: 'all', processStatus: 'all', page: 1, selectedIds: [] }),
  toggleSelect: (id) => set((s) => ({
    selectedIds: s.selectedIds.includes(id)
      ? s.selectedIds.filter((x) => x !== id)
      : [...s.selectedIds, id],
  })),
  selectAll: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),
  setArrangeMethod: (arrangeMethod) => set({ arrangeMethod }),
  toggleDocType: (type) => set((s) => ({
    docTypes: s.docTypes.includes(type)
      ? s.docTypes.filter((x) => x !== type)
      : [...s.docTypes, type],
  })),
}))

// ── Returns UI ────────────────────────────────────────────────────────────────
interface ReturnsUiState {
  primaryTab: ReturnPrimaryTab
  status: ReturnStatus
  priority: ReturnPriority
  searchText: string
  setPrimaryTab: (tab: ReturnPrimaryTab) => void
  setStatus: (status: ReturnStatus) => void
  setPriority: (priority: ReturnPriority) => void
  setSearchText: (text: string) => void
  resetFilters: () => void
}

export const useReturnsUi = create<ReturnsUiState>((set) => ({
  primaryTab: 'all',
  status: 'all',
  priority: 'all',
  searchText: '',
  setPrimaryTab: (primaryTab) => set({ primaryTab, status: 'all' }),
  setStatus: (status) => set({ status }),
  setPriority: (priority) => set({ priority }),
  setSearchText: (searchText) => set({ searchText }),
  resetFilters: () => set({ status: 'all', priority: 'all', searchText: '' }),
}))
