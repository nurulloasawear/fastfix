// PUBLIC API of the setting feature. Pages import ONLY from here
// (`@/features/setting`) — never a deep path. ESLint enforces it.
export {
  useAccount,
  useUpdateAccount,
  useSeller,
  useRegisterSeller,
  useNotifications,
  useUpdateNotifications,
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useUpdateShop,
  useStaff,
  useInviteStaff,
  useRemoveStaff,
  useRequestPhoneCode,
  useConfirmPhone,
  useRequestEmailCode,
  useConfirmEmail,
  useSecurity,
  useSetTwoFactor,
  useChangePassword,
  useApiKey,
  useRegenerateApiKey,
  // New hooks — shop settings tabs
  useChatSettings,
  useUpdateChatSettings,
  useEmailNotifications,
  useUpdateEmailNotifications,
  usePaymentSettings,
  useUpdatePaymentSettings,
  useProductSettings,
  useUpdateProductSettings,
  useVacationSettings,
  useUpdateVacationSettings,
  usePartners,
  useUnlinkPartner,
  useRemovePartner,
  useRenewPartner,
  useAccountProtection,
  useUpdateAccountProtection,
  settingKeys,
} from './api/setting.queries'
export { useSettingUi, SETTING_SECTIONS } from './stores/setting.store'
export { settingHandlers } from './api/setting.mocks'
export { settingMessages } from './i18n'

// Composed UI building blocks the thin pages assemble.
export { SettingHeader } from './components/SettingHeader'
export { SettingTabs } from './components/SettingTabs'
export { SettingsTabBar } from './components/SettingsTabBar'
export { AccountForm } from './components/AccountForm'
export { AccountInfoCard } from './components/AccountInfoCard'
export { AccountProtectionCard } from './components/AccountProtectionCard'
export { ChatSettingsCard } from './components/ChatSettingsCard'
export { EmailNotificationCard } from './components/EmailNotificationCard'
export { PaymentSettingCard } from './components/PaymentSettingCard'
export { ProductSettingCard } from './components/ProductSettingCard'
export { VacationModeCard } from './components/VacationModeCard'
export { PartnerManagementCard } from './components/PartnerManagementCard'
export { AddressList } from './components/AddressList'
export { AddressModal } from './components/AddressModal'
export { ShopProfileCard } from './components/ShopProfileCard'
export { NotificationSettingsCard } from './components/NotificationSettingsCard'
export { PasswordForm } from './components/PasswordForm'
export { TwoFactorCard } from './components/TwoFactorCard'
export { ApiKeyCard } from './components/ApiKeyCard'
export { PlusIcon } from './components/icons'

export type { SettingSection } from './stores/setting.store'
export type {
  Account,
  AccountUpdate,
  Gender,
  SellerProfile,
  SellerStatus,
  SellerRegisterInput,
  NotificationChannel,
  NotificationSettings,
  Address,
  AddressInput,
  AddressListResponse,
  AddressKind,
  PasswordChangeInput,
  SecuritySettings,
  ApiKey,
  // New types
  ChatSettings,
  EmailNotificationPrefs,
  PaymentSettings,
  WithdrawalFrequency,
  ProductSettings,
  VacationSettings,
  PartnerIntegration,
  PartnerCounts,
  PartnersResponse,
  PartnerStatus,
  ApprovalTicket,
  ApprovalTicketStatus,
  AccountProtectionSettings,
} from './types/setting.types'
