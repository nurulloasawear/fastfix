import { create } from 'zustand'

// CLIENT/UI state ONLY (which settings section is open, address-modal visibility).
// All server data lives in TanStack Query.
export type SettingSection =
  | 'account'
  | 'addresses'
  | 'shop'
  | 'security'
  | 'partner'

export const SETTING_SECTIONS: SettingSection[] = [
  'account',
  'addresses',
  'shop',
  'security',
  'partner',
]

interface SettingUiState {
  section: SettingSection
  addressModalOpen: boolean
  setSection: (section: SettingSection) => void
  openAddressModal: () => void
  closeAddressModal: () => void
}

export const useSettingUi = create<SettingUiState>((set) => ({
  section: 'account',
  addressModalOpen: false,
  setSection: (section) => set({ section }),
  openAddressModal: () => set({ addressModalOpen: true }),
  closeAddressModal: () => set({ addressModalOpen: false }),
}))
