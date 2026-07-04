import { create } from 'zustand'
import type { InsightTab } from '../types/home.types'

interface HomeUiState {
  insightTab: InsightTab
  setInsightTab: (tab: InsightTab) => void
}

// CLIENT/UI state ONLY (which business-insights tab is active). Server data
// lives in TanStack Query.
export const useHomeUi = create<HomeUiState>((set) => ({
  insightTab: 'dashboard',
  setInsightTab: (insightTab) => set({ insightTab }),
}))
