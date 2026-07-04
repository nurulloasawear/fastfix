import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  changePassword,
  confirmEmail,
  confirmPhone,
  createAddress,
  deleteAddress,
  getStaff,
  inviteStaff,
  removeStaff,
  requestEmailCode,
  requestPhoneCode,
  updateAddress,
  updateShop,
  getAccount,
  getAccountProtection,
  getAddresses,
  getApiKey,
  getChatSettings,
  getEmailNotifications,
  getNotifications,
  getPartners,
  getPaymentSettings,
  getProductSettings,
  getSecurity,
  getSeller,
  getVacationSettings,
  regenerateApiKey,
  registerSeller,
  removePartner,
  renewPartner,
  setTwoFactor,
  unlinkPartner,
  updateAccount,
  updateAccountProtection,
  updateChatSettings,
  updateEmailNotifications,
  updateNotifications,
  updatePaymentSettings,
  updateProductSettings,
  updateVacationSettings,
} from './setting.api'
import type {
  AccountProtectionSettings,
  AccountUpdate,
  AddressInput,
  ChatSettings,
  EmailNotificationPrefs,
  NotificationSettings,
  PasswordChangeInput,
  PaymentSettings,
  ProductSettings,
  SellerRegisterInput,
  VacationSettings,
} from '../types/setting.types'

import { toast } from '@/components/ui/Toast'
import i18n from '@/i18n'

// Centralized save feedback for the toggle/settings cards (fixes silent saves).
const savedToast = () => toast.success(i18n.t('setting.common.saved', { defaultValue: 'Saqlandi' }))
const saveErrToast = () => toast.error(i18n.t('setting.common.saveError', { defaultValue: 'Saqlashda xatolik' }))

// Stable, structured query keys → cache, dedupe, and invalidation just work.
export const settingKeys = {
  all: ['setting'] as const,
  account: () => [...settingKeys.all, 'account'] as const,
  seller: () => [...settingKeys.all, 'seller'] as const,
  notifications: () => [...settingKeys.all, 'notifications'] as const,
  addresses: () => [...settingKeys.all, 'addresses'] as const,
  security: () => [...settingKeys.all, 'security'] as const,
  apiKey: () => [...settingKeys.all, 'apiKey'] as const,
  chat: () => [...settingKeys.all, 'chat'] as const,
  emailNotifications: () => [...settingKeys.all, 'emailNotifications'] as const,
  payment: () => [...settingKeys.all, 'payment'] as const,
  product: () => [...settingKeys.all, 'product'] as const,
  vacation: () => [...settingKeys.all, 'vacation'] as const,
  partners: () => [...settingKeys.all, 'partners'] as const,
  protection: () => [...settingKeys.all, 'protection'] as const,
  staff: () => [...settingKeys.all, 'staff'] as const,
}

// --- Account (real) ---
export function useAccount() {
  return useQuery({ queryKey: settingKeys.account(), queryFn: getAccount })
}

export function useUpdateAccount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: AccountUpdate) => updateAccount(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingKeys.account() }),
  })
}

// --- Identity change (OTP phone/email) ---
export function useRequestPhoneCode() {
  return useMutation({ mutationFn: (newPhone: string) => requestPhoneCode(newPhone) })
}
export function useConfirmPhone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ newPhone, code }: { newPhone: string; code: string }) => confirmPhone(newPhone, code),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingKeys.account() }),
  })
}
export function useRequestEmailCode() {
  return useMutation({ mutationFn: (email: string) => requestEmailCode(email) })
}
export function useConfirmEmail() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => confirmEmail(email, code),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingKeys.account() }),
  })
}

// --- Shop / seller (real) ---
export function useSeller() {
  return useQuery({ queryKey: settingKeys.seller(), queryFn: getSeller })
}

export function useUpdateShop() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { shopName?: string; logoUrl?: string }) => updateShop(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: settingKeys.seller() })
      void qc.invalidateQueries({ queryKey: settingKeys.account() })
    },
  })
}

export function useStaff() {
  return useQuery({ queryKey: settingKeys.staff(), queryFn: getStaff })
}

export function useInviteStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ phone, role }: { phone: string; role: string }) => inviteStaff(phone, role),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingKeys.staff() }),
  })
}

export function useRemoveStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => removeStaff(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingKeys.staff() }),
  })
}

export function useRegisterSeller() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: SellerRegisterInput) => registerSeller(input),
    onSuccess: (data) => qc.setQueryData(settingKeys.seller(), data),
  })
}

// --- Notifications [PENDING BACKEND] ---
export function useNotifications() {
  return useQuery({ queryKey: settingKeys.notifications(), queryFn: getNotifications })
}

export function useUpdateNotifications() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (settings: NotificationSettings) => updateNotifications(settings),
    onSuccess: (data) => qc.setQueryData(settingKeys.notifications(), data),
  })
}

// --- Addresses [LIVE: /sellers/me/addresses] ---
export function useAddresses() {
  return useQuery({ queryKey: settingKeys.addresses(), queryFn: getAddresses })
}

export function useCreateAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: AddressInput) => createAddress(input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingKeys.addresses() }),
  })
}

export function useUpdateAddress(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: AddressInput) => updateAddress(id, input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingKeys.addresses() }),
  })
}

export function useDeleteAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingKeys.addresses() }),
  })
}

// --- Security [PENDING BACKEND] ---
export function useSecurity() {
  return useQuery({ queryKey: settingKeys.security(), queryFn: getSecurity })
}

export function useSetTwoFactor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (enabled: boolean) => setTwoFactor(enabled),
    onSuccess: (data) => qc.setQueryData(settingKeys.security(), data),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: PasswordChangeInput) => changePassword(input),
  })
}

// --- Partner platform / API key [PENDING BACKEND] ---
export function useApiKey() {
  return useQuery({ queryKey: settingKeys.apiKey(), queryFn: getApiKey })
}

export function useRegenerateApiKey() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => regenerateApiKey(),
    onSuccess: (data) => qc.setQueryData(settingKeys.apiKey(), data),
  })
}

// --- Chat settings [PENDING BACKEND] ---
export function useChatSettings() {
  return useQuery({ queryKey: settingKeys.chat(), queryFn: getChatSettings })
}

export function useUpdateChatSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (s: ChatSettings) => updateChatSettings(s),
    onSuccess: (data) => { qc.setQueryData(settingKeys.chat(), data); savedToast() },
    onError: saveErrToast,
  })
}

// --- Email notification prefs [PENDING BACKEND] ---
export function useEmailNotifications() {
  return useQuery({ queryKey: settingKeys.emailNotifications(), queryFn: getEmailNotifications })
}

export function useUpdateEmailNotifications() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (prefs: EmailNotificationPrefs) => updateEmailNotifications(prefs),
    onSuccess: (data) => { qc.setQueryData(settingKeys.emailNotifications(), data); savedToast() },
    onError: saveErrToast,
  })
}

// --- Payment settings [PENDING BACKEND] ---
export function usePaymentSettings() {
  return useQuery({ queryKey: settingKeys.payment(), queryFn: getPaymentSettings })
}

export function useUpdatePaymentSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (s: PaymentSettings) => updatePaymentSettings(s),
    onSuccess: (data) => qc.setQueryData(settingKeys.payment(), data),
  })
}

// --- Product settings [PENDING BACKEND] ---
export function useProductSettings() {
  return useQuery({ queryKey: settingKeys.product(), queryFn: getProductSettings })
}

export function useUpdateProductSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (s: ProductSettings) => updateProductSettings(s),
    onSuccess: (data) => { qc.setQueryData(settingKeys.product(), data); savedToast() },
    onError: saveErrToast,
  })
}

// --- Vacation mode [PENDING BACKEND] ---
export function useVacationSettings() {
  return useQuery({ queryKey: settingKeys.vacation(), queryFn: getVacationSettings })
}

export function useUpdateVacationSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (s: VacationSettings) => updateVacationSettings(s),
    onSuccess: (data) => { qc.setQueryData(settingKeys.vacation(), data); savedToast() },
    onError: saveErrToast,
  })
}

// --- Partner integrations [PENDING BACKEND] ---
export function usePartners() {
  return useQuery({ queryKey: settingKeys.partners(), queryFn: getPartners })
}

export function useUnlinkPartner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => unlinkPartner(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingKeys.partners() }),
  })
}

export function useRemovePartner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => removePartner(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingKeys.partners() }),
  })
}

export function useRenewPartner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => renewPartner(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingKeys.partners() }),
  })
}

// --- Account protection [PENDING BACKEND] ---
export function useAccountProtection() {
  return useQuery({ queryKey: settingKeys.protection(), queryFn: getAccountProtection })
}

export function useUpdateAccountProtection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (s: Omit<AccountProtectionSettings, 'approvalTickets'>) =>
      updateAccountProtection(s),
    onSuccess: (data) => { qc.setQueryData(settingKeys.protection(), data); savedToast() },
    onError: saveErrToast,
  })
}
