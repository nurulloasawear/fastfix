import { create } from 'zustand'
import type { DataPeriodMode, OrderTypeFilter } from '../types/insights.types'

type InsightsUiState = {
  mode: DataPeriodMode
  orderType: OrderTypeFilter
  setMode: (m: DataPeriodMode) => void
  setOrderType: (t: OrderTypeFilter) => void
}

export const useInsightsUi = create<InsightsUiState>((set) => ({
  mode: 'realtime',
  orderType: 'paid',
  setMode: (mode) => set({ mode }),
  setOrderType: (orderType) => set({ orderType }),
}))
