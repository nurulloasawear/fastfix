// Settings domain. String-union types + interfaces only (no enums).
// Money is integer UZS end-to-end; multi-language content is {uz,ru,en} (LangMap).
import type { Language } from '@/i18n'

// --- Account (real GET/PUT /me) ---
// Mirrors the backend `Me` DTO (snake_case at the boundary, mapped to camelCase here).
export type Gender = 'male' | 'female' | 'other' | ''

export const GENDERS: Exclude<Gender, ''>[] = ['male', 'female', 'other']

export interface Account {
  id: string
  phone: string
  fullName: string
  username: string
  email: string
  shopName: string
  avatarUrl: string | null
  language: Language
  gender: Gender
  dateOfBirth: string
  phoneVerified: boolean
  modes: string[]
}

// Only the fields the backend `PUT /me` accepts plus profile extras kept client-side.
export interface AccountUpdate {
  fullName: string
  username: string
  email: string
  shopName: string
  language: Language
  avatarUrl: string | null
  gender: Gender
  dateOfBirth: string
}

// --- Shop / Seller (real GET /sellers/me · POST /sellers/register) ---
// Backend status enum is pending | approved | suspended (default pending);
// `none` is the client-only state when the account has no seller row yet.
export type SellerStatus = 'pending' | 'approved' | 'suspended' | 'none'

export interface SellerProfile {
  id: string
  shopName: string
  status: SellerStatus
  registered: boolean
  registeredAt: string | null
  logoUrl: string | null
}

export interface SellerRegisterInput {
  shopName: string
}

// --- Notification settings (lives on the Shop Settings page) [PENDING BACKEND] ---
export type NotificationChannel =
  | 'orderUpdates'
  | 'promotions'
  | 'listingUpdates'
  | 'chatMessages'

export const NOTIFICATION_CHANNELS: NotificationChannel[] = [
  'orderUpdates',
  'promotions',
  'listingUpdates',
  'chatMessages',
]

export interface NotificationSettings {
  emailEnabled: boolean
  orderUpdates: boolean
  promotions: boolean
  listingUpdates: boolean
  chatMessages: boolean
}

// --- Addresses [PENDING BACKEND] ---
export type AddressKind = 'main' | 'pickup' | 'return'

export interface Address {
  id: string
  fullName: string
  phone: string
  countryRegion: string
  state: string
  townCity: string
  pincode: string
  companyAddress: string
  isDefault: boolean
  isPickup: boolean
  isReturn: boolean
}

export interface AddressInput {
  fullName: string
  phone: string
  countryRegion: string
  state: string
  townCity: string
  pincode: string
  companyAddress: string
  isDefault: boolean
  isPickup: boolean
  isReturn: boolean
}

export interface AddressListResponse {
  addresses: Address[]
  total: number
}

// --- Security [PENDING BACKEND] ---
export interface PasswordChangeInput {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
}

// --- Partner platform / API keys [PENDING BACKEND] ---
export interface ApiKey {
  id: string
  key: string
  createdAt: string
}

// --- Chat settings [PENDING BACKEND] ---
export interface ChatSettings {
  receiveBroadcasts: boolean
  receivePlatformMessages: boolean
  soundAlerts: boolean
  pushPopups: boolean
}

// --- Email notification prefs (new shape, Shopee-aligned) [PENDING BACKEND] ---
export interface EmailNotificationPrefs {
  emailAllDisabled: boolean
  notifOrderEmail: boolean
  notifListingEmail: boolean
  notifPolicyEmail: boolean
  notifPromotionsEmail: boolean
  notifSurveysEmail: boolean
}

// --- Payment settings [PENDING BACKEND] ---
export type WithdrawalFrequency = 'daily' | 'weekly' | 'monthly'

export interface PaymentSettings {
  autoWithdrawalEnabled: boolean
  autoWithdrawalFrequency: WithdrawalFrequency
  autoWithdrawalDay: number
  balancePinSet: boolean
}

// --- Product settings [PENDING BACKEND] ---
export interface ProductSettings {
  allowContentReuse: boolean
}

// --- Vacation mode [PENDING BACKEND] ---
export interface VacationSettings {
  vacationModeEnabled: boolean
  vacationAutoReplyText: string
  vacationEnabledAt: string | null
  vacationDisabledAt: string | null
}

// --- Partner integrations [PENDING BACKEND] ---
export type PartnerStatus = 'active' | 'frozen' | 'expired' | 'unlinked'

export interface PartnerIntegration {
  id: string
  appName: string
  developerName: string
  expiresAt: string
  status: PartnerStatus
}

export interface PartnerCounts {
  active: number
  frozen: number
  expired: number
  unlinked: number
}

export interface PartnersResponse {
  integrations: PartnerIntegration[]
  counts: PartnerCounts
}

// --- Approval tickets [PENDING BACKEND] ---
export type ApprovalTicketStatus = 'pending' | 'approved' | 'rejected'

export interface ApprovalTicket {
  id: string
  riskType: string
  requestedAt: string
  operator: string
  status: ApprovalTicketStatus
}

// --- SMS / account verification [PENDING BACKEND] ---
export interface AccountProtectionSettings {
  smsVerificationEnabled: boolean
  highRiskApprovalEnabled: boolean
  noticeAllCheckers: boolean
  approvalTickets: ApprovalTicket[]
}
