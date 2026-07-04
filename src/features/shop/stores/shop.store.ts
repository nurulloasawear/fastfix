import { create } from 'zustand'
import type { MediaType, ReportType } from '../types/shop.types'

export type ReviewFilter = 'all' | 'positive' | 'negative'
export type MediaFilter = 'all' | MediaType
export type ReportFilter = 'all' | ReportType

interface ShopUiState {
  reviewFilter: ReviewFilter
  reviewSearch: string
  mediaFilter: MediaFilter
  mediaSearch: string
  reportFilter: ReportFilter
  categorySearch: string
  showCategoryForm: boolean
  setReviewFilter: (f: ReviewFilter) => void
  setReviewSearch: (s: string) => void
  setMediaFilter: (f: MediaFilter) => void
  setMediaSearch: (s: string) => void
  setReportFilter: (f: ReportFilter) => void
  setCategorySearch: (s: string) => void
  setShowCategoryForm: (open: boolean) => void
}

// CLIENT/UI state ONLY (filters, search, form visibility). Server data lives in TanStack Query.
export const useShopUi = create<ShopUiState>((set) => ({
  reviewFilter: 'all',
  reviewSearch: '',
  mediaFilter: 'all',
  mediaSearch: '',
  reportFilter: 'all',
  categorySearch: '',
  showCategoryForm: false,
  setReviewFilter: (reviewFilter) => set({ reviewFilter }),
  setReviewSearch: (reviewSearch) => set({ reviewSearch }),
  setMediaFilter: (mediaFilter) => set({ mediaFilter }),
  setMediaSearch: (mediaSearch) => set({ mediaSearch }),
  setReportFilter: (reportFilter) => set({ reportFilter }),
  setCategorySearch: (categorySearch) => set({ categorySearch }),
  setShowCategoryForm: (showCategoryForm) => set({ showCategoryForm }),
}))
