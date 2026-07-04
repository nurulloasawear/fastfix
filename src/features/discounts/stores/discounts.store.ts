import { create } from 'zustand'
import type { Discount, StatusFilter, TypeFilter } from '../types/discounts.types'

// CLIENT/UI state ONLY (list filters + which modal is open + the row being
// edited/deleted). Server data lives in TanStack Query. `editing` is the
// Discount under edit, or `null` for "create new".
interface DiscountsUiState {
  search: string
  status: StatusFilter
  type: TypeFilter
  formOpen: boolean
  editing: Discount | null
  deleteId: string | null
  setSearch: (search: string) => void
  setStatus: (status: StatusFilter) => void
  setType: (type: TypeFilter) => void
  resetFilters: () => void
  openCreate: () => void
  openEdit: (discount: Discount) => void
  closeForm: () => void
  requestDelete: (id: string) => void
  cancelDelete: () => void
}

export const useDiscountsUi = create<DiscountsUiState>((set) => ({
  search: '',
  status: 'all',
  type: 'all',
  formOpen: false,
  editing: null,
  deleteId: null,
  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
  setType: (type) => set({ type }),
  resetFilters: () => set({ search: '', status: 'all', type: 'all' }),
  openCreate: () => set({ formOpen: true, editing: null }),
  openEdit: (editing) => set({ formOpen: true, editing }),
  closeForm: () => set({ formOpen: false, editing: null }),
  requestDelete: (deleteId) => set({ deleteId }),
  cancelDelete: () => set({ deleteId: null }),
}))
