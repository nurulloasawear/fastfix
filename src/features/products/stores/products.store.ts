import { create } from 'zustand'
import type {
  LiveSubTab,
  ProductStatusTab,
  SortOption,
  UnpublishedSubTab,
  ViolationSubTab,
} from '../types/products.types'

// UI-only state (active tabs, filters, selected rows).
// Server data lives in TanStack Query — not here.
interface ProductsUiState {
  // top-level tab
  statusTab: ProductStatusTab
  // sub-tabs per top-level tab
  liveSubTab: LiveSubTab
  violationSubTab: ViolationSubTab
  unpublishedSubTab: UnpublishedSubTab
  // filters (draft while user types, applied on search/apply)
  draftSearch: string
  appliedSearch: string
  sort: SortOption
  selectedLabel: string
  // bulk selection
  selectedIds: string[]
  // payment banner dismissed
  paymentBannerDismissed: boolean
  // AI popup shown
  aiPopupShown: boolean

  // setters
  setStatusTab: (tab: ProductStatusTab) => void
  setLiveSubTab: (sub: LiveSubTab) => void
  setViolationSubTab: (sub: ViolationSubTab) => void
  setUnpublishedSubTab: (sub: UnpublishedSubTab) => void
  setDraftSearch: (v: string) => void
  applySearch: () => void
  resetSearch: () => void
  setSort: (sort: SortOption) => void
  setSelectedLabel: (label: string) => void
  toggleSelect: (id: string) => void
  selectAll: (ids: string[]) => void
  clearSelection: () => void
  dismissPaymentBanner: () => void
  dismissAiPopup: () => void
}

export const useProductsUi = create<ProductsUiState>((set, get) => ({
  statusTab: 'all',
  liveSubTab: 'all',
  violationSubTab: 'banned',
  unpublishedSubTab: 'draft',
  draftSearch: '',
  appliedSearch: '',
  sort: 'recommended',
  selectedLabel: '',
  selectedIds: [],
  paymentBannerDismissed:
    typeof window !== 'undefined' &&
    localStorage.getItem('ozb_payment_banner_dismissed') === '1',
  aiPopupShown:
    typeof window !== 'undefined' &&
    localStorage.getItem('ozb_ai_popup_shown') === '1',

  setStatusTab: (statusTab) =>
    set({ statusTab, liveSubTab: 'all', violationSubTab: 'banned', unpublishedSubTab: 'draft', selectedIds: [] }),
  setLiveSubTab: (liveSubTab) => set({ liveSubTab }),
  setViolationSubTab: (violationSubTab) => set({ violationSubTab }),
  setUnpublishedSubTab: (unpublishedSubTab) => set({ unpublishedSubTab }),
  setDraftSearch: (draftSearch) => set({ draftSearch }),
  applySearch: () => set((s) => ({ appliedSearch: s.draftSearch })),
  resetSearch: () => set({ draftSearch: '', appliedSearch: '', selectedLabel: '' }),
  setSort: (sort) => set({ sort }),
  setSelectedLabel: (selectedLabel) => set({ selectedLabel }),
  toggleSelect: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : [...s.selectedIds, id],
    })),
  selectAll: (ids) => {
    const current = get().selectedIds
    const allSelected = ids.every((id) => current.includes(id))
    set({ selectedIds: allSelected ? [] : ids })
  },
  clearSelection: () => set({ selectedIds: [] }),
  dismissPaymentBanner: () => {
    localStorage.setItem('ozb_payment_banner_dismissed', '1')
    set({ paymentBannerDismissed: true })
  },
  dismissAiPopup: () => {
    localStorage.setItem('ozb_ai_popup_shown', '1')
    set({ aiPopupShown: true })
  },
}))
