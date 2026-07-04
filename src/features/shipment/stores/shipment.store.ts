import { create } from 'zustand'
import type { ShipmentStatusFilter } from '../types/shipment.types'

interface ShipmentUiState {
  // List page filters.
  status: ShipmentStatusFilter
  search: string
  setStatus: (status: ShipmentStatusFilter) => void
  setSearch: (search: string) => void
  resetSearch: () => void

  // Mass-ship page selection (set of order ids).
  selected: string[]
  toggleSelected: (orderId: string) => void
  setAllSelected: (orderIds: string[]) => void
  clearSelected: () => void
}

// CLIENT/UI state ONLY (active tab, search box, mass-ship checkbox selection).
// Server data lives in TanStack Query.
export const useShipmentUi = create<ShipmentUiState>((set) => ({
  status: 'all',
  search: '',
  setStatus: (status) => set({ status }),
  setSearch: (search) => set({ search }),
  resetSearch: () => set({ search: '' }),

  selected: [],
  toggleSelected: (orderId) =>
    set((state) => ({
      selected: state.selected.includes(orderId)
        ? state.selected.filter((id) => id !== orderId)
        : [...state.selected, orderId],
    })),
  setAllSelected: (orderIds) => set({ selected: orderIds }),
  clearSelected: () => set({ selected: [] }),
}))
