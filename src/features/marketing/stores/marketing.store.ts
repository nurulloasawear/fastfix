import { create } from 'zustand'

// CLIENT/UI state ONLY. Server data lives in TanStack Query.
interface MarketingUiState {
  // Legacy modal flag (kept for backward compat)
  voucherModalOpen: boolean
  openVoucherModal: () => void
  closeVoucherModal: () => void
  // Creators onboarding modal
  creatorsOnboardingOpen: boolean
  openCreatorsOnboarding: () => void
  closeCreatorsOnboarding: () => void
  // Voucher status tab
  voucherStatusTab: string
  setVoucherStatusTab: (tab: string) => void
  // Review Prize status tab
  reviewPrizeTab: string
  setReviewPrizeTab: (tab: string) => void
  // Campaign seller status tab
  campaignTab: string
  setCampaignTab: (tab: string) => void
  // Ads tab
  adsTab: string
  setAdsTab: (tab: string) => void
}

export const useMarketingUi = create<MarketingUiState>((set) => ({
  voucherModalOpen: false,
  openVoucherModal: () => set({ voucherModalOpen: true }),
  closeVoucherModal: () => set({ voucherModalOpen: false }),

  creatorsOnboardingOpen: false,
  openCreatorsOnboarding: () => set({ creatorsOnboardingOpen: true }),
  closeCreatorsOnboarding: () => set({ creatorsOnboardingOpen: false }),

  voucherStatusTab: 'all',
  setVoucherStatusTab: (tab) => set({ voucherStatusTab: tab }),

  reviewPrizeTab: 'all',
  setReviewPrizeTab: (tab) => set({ reviewPrizeTab: tab }),

  campaignTab: 'available',
  setCampaignTab: (tab) => set({ campaignTab: tab }),

  adsTab: 'all',
  setAdsTab: (tab) => set({ adsTab: tab }),
}))
