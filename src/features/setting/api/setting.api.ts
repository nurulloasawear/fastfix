import { apiClient } from '@/lib/axios'
import { ApiError } from '@/lib/apiError'
import type { Language } from '@/i18n'
import { LANGUAGES } from '@/i18n'
import type {
  Account,
  AccountProtectionSettings,
  AccountUpdate,
  Address,
  AddressInput,
  AddressListResponse,
  ApiKey,
  ChatSettings,
  EmailNotificationPrefs,
  Gender,
  NotificationSettings,
  PartnerIntegration,
  PartnersResponse,
  PasswordChangeInput,
  PaymentSettings,
  ProductSettings,
  SecuritySettings,
  SellerProfile,
  SellerRegisterInput,
  VacationSettings,
} from '../types/setting.types'

const PATHS = {
  me: '/me', // ✅ real
  sellerMe: '/sellers/me', // ✅ real (GET shop + PUT updateShop)
  sellerRegister: '/sellers/register', // ✅ real
  staff: '/sellers/me/staff', // ✅ real — sub-accounts
  mediaUploadUrl: '/media/upload-url', // ✅ real
  // ✅ real — OTP-verified identity change (/account module)
  phoneRequest: '/account/phone/request-code',
  phoneConfirm: '/account/phone/confirm',
  emailRequest: '/account/email/request-code',
  emailConfirm: '/account/email/confirm',
  // ✅ real — addresses live in the shipping module (GET/POST/PUT/DELETE)
  addresses: '/sellers/me/addresses',
  address: (id: string) => `/sellers/me/addresses/${id}`,
  // [PENDING BACKEND] no notification-prefs route yet — served by MSW mocks.
  notifications: '/seller/settings/notifications',
  // [PENDING BACKEND] no security/2FA route yet — served by MSW mocks.
  security: '/seller/settings/security',
  // ✅ real — POST /sellers/me/settings/password
  password: '/sellers/me/settings/password',
  // [PENDING BACKEND] no API-key route yet — served by MSW mocks.
  apiKey: '/seller/settings/api-key',
  // ✅ real — GET/PUT /sellers/me/settings/chat
  chat: '/sellers/me/settings/chat',
  // ✅ real — GET/PUT /sellers/me/settings/email-notifications
  emailNotifications: '/sellers/me/settings/email-notifications',
  // [PENDING BACKEND] 404 — served by MSW mocks.
  payment: '/seller/settings/payment',
  // ✅ real — GET/PUT /sellers/me/settings/product
  product: '/sellers/me/settings/product',
  // ✅ real — GET/PUT /sellers/me/settings/vacation-mode
  vacation: '/sellers/me/settings/vacation-mode',
  // ✅ real — GET /sellers/me/settings/partners + sub-routes
  partners: '/sellers/me/settings/partners',
  // ✅ real — GET/PUT /sellers/me/settings/protection
  protection: '/sellers/me/settings/protection',
  // ✅ real — GET /sellers/me/coupons + sub-routes
  coupons: '/sellers/me/coupons',
} as const

// --- DTO boundary (snake_case backend ↔ camelCase feature) ---

interface MediaUploadUrlDto {
  key: string
  upload_url: string
  public_url: string
}

// --- Chat settings DTO ---
interface ChatSettingsDto {
  receive_broadcasts: boolean
  receive_platform_messages: boolean
  sound_alerts: boolean
  push_popups: boolean
  blocked_users?: { buyer_id: string; buyer_name: string; blocked_at: string }[]
}

function mapChatSettings(dto: ChatSettingsDto): ChatSettings {
  return {
    receiveBroadcasts: dto.receive_broadcasts,
    receivePlatformMessages: dto.receive_platform_messages,
    soundAlerts: dto.sound_alerts,
    pushPopups: dto.push_popups,
  }
}

// --- Email notification prefs DTO ---
interface EmailNotifDto {
  email_all_disabled: boolean
  notif_order_email: boolean
  notif_listing_email: boolean
  notif_policy_email: boolean
  notif_promotions_email: boolean
  notif_surveys_email: boolean
}

function mapEmailNotif(dto: EmailNotifDto): EmailNotificationPrefs {
  return {
    emailAllDisabled: dto.email_all_disabled,
    notifOrderEmail: dto.notif_order_email,
    notifListingEmail: dto.notif_listing_email,
    notifPolicyEmail: dto.notif_policy_email,
    notifPromotionsEmail: dto.notif_promotions_email,
    notifSurveysEmail: dto.notif_surveys_email,
  }
}

// --- Product settings DTO ---
interface ProductSettingsDto {
  allow_content_reuse: boolean
}

function mapProductSettings(dto: ProductSettingsDto): ProductSettings {
  return { allowContentReuse: dto.allow_content_reuse }
}

// --- Vacation mode DTO ---
interface VacationDto {
  vacation_mode_enabled: boolean
  vacation_auto_reply_text: string | null
  vacation_enabled_at: string | null
  vacation_disabled_at: string | null
  vacation_effective_at?: string | null
  cooldown_remaining_seconds?: number
}

function mapVacation(dto: VacationDto): VacationSettings {
  return {
    vacationModeEnabled: dto.vacation_mode_enabled,
    vacationAutoReplyText: dto.vacation_auto_reply_text ?? '',
    vacationEnabledAt: dto.vacation_enabled_at,
    vacationDisabledAt: dto.vacation_disabled_at,
  }
}

// --- Partner integrations DTO ---
interface PartnerIntegrationDto {
  id: string
  app_name: string
  developer_name: string
  expires_at: string
  status: 'active' | 'frozen' | 'expired' | 'unlinked'
  granted_at?: string
  scopes?: string[]
}

interface PartnersDto {
  integrations: PartnerIntegrationDto[]
  counts: { active: number; frozen: number; expired: number; unlinked: number }
}

function mapPartnerIntegration(dto: PartnerIntegrationDto): PartnerIntegration {
  return {
    id: dto.id,
    appName: dto.app_name,
    developerName: dto.developer_name,
    expiresAt: dto.expires_at,
    status: dto.status,
  }
}

function mapPartnersResponse(dto: PartnersDto): PartnersResponse {
  return {
    integrations: dto.integrations.map(mapPartnerIntegration),
    counts: dto.counts,
  }
}

// --- Account protection DTO ---
interface HighRiskRuleDto {
  risk_type: string
  approval_required: boolean
  notice_all_checkers: boolean
}

interface ApprovalTicketDto {
  id: string
  risk_type: string
  requested_at: string
  operator: string | null
  status: 'pending' | 'approved' | 'rejected'
  resolved_at?: string | null
}

interface ProtectionDto {
  sms_verification_enabled: boolean
  high_risk_rules: HighRiskRuleDto[]
  approval_tickets: ApprovalTicketDto[]
}

function mapProtection(dto: ProtectionDto): AccountProtectionSettings {
  // Backend uses high_risk_rules array; FE type uses flat booleans.
  // Derive flat booleans from the add_bank_account rule (primary rule).
  const primaryRule = dto.high_risk_rules.find((r) => r.risk_type === 'add_bank_account')
  return {
    smsVerificationEnabled: dto.sms_verification_enabled,
    highRiskApprovalEnabled: primaryRule?.approval_required ?? false,
    noticeAllCheckers: primaryRule?.notice_all_checkers ?? false,
    approvalTickets: (dto.approval_tickets ?? []).map((t) => ({
      id: t.id,
      riskType: t.risk_type,
      requestedAt: t.requested_at,
      operator: t.operator ?? '',
      status: t.status,
    })),
  }
}

export interface MediaUploadUrlResult {
  key: string
  uploadUrl: string
  publicUrl: string
}

interface MeDto {
  id: string
  phone: string
  full_name: string | null
  username: string | null
  email?: string | null
  avatar_url: string | null
  language: string
  is_admin: boolean
  modes: string[]
  seller: { status: string; shop_name?: string } | null
  gender?: string | null
  date_of_birth?: string | null
  phone_verified?: boolean
}

interface SellerDto {
  id?: string
  shop_name?: string | null
  status?: string
  logo_url?: string | null
  registered_at?: string | null
}

function asLanguage(value: string): Language {
  return (LANGUAGES as readonly string[]).includes(value) ? (value as Language) : 'uz'
}

function asGender(value: string | null | undefined): Gender {
  return value === 'male' || value === 'female' || value === 'other' ? value : ''
}

function mapMe(dto: MeDto): Account {
  return {
    id: dto.id,
    phone: dto.phone,
    fullName: dto.full_name ?? '',
    username: dto.username ?? '',
    email: dto.email ?? '',
    shopName: dto.seller?.shop_name ?? '',
    avatarUrl: dto.avatar_url,
    language: asLanguage(dto.language),
    gender: asGender(dto.gender),
    dateOfBirth: dto.date_of_birth ?? '',
    phoneVerified: dto.phone_verified ?? true,
    modes: dto.modes,
  }
}

function mapSeller(dto: SellerDto): SellerProfile {
  const registered = Boolean(dto.id)
  const status = dto.status
  return {
    id: dto.id ?? '',
    shopName: dto.shop_name ?? '',
    status:
      status === 'approved' || status === 'pending' || status === 'suspended'
        ? status
        : registered
          ? 'approved'
          : 'none',
    registered,
    registeredAt: dto.registered_at ?? null,
    logoUrl: dto.logo_url ?? null,
  }
}

// --- Account (real) ---
export async function getAccount(): Promise<Account> {
  const { data } = await apiClient.get<MeDto>(PATHS.me)
  return mapMe(data)
}

export async function updateAccount(input: AccountUpdate): Promise<{ updated: boolean }> {
  // Backend PUT /me accepts ONLY these four fields (see ozb-backend user.update).
  // email / gender / dateOfBirth are captured in the UI but have no backend column yet,
  // so they are intentionally NOT sent — they round-trip via the mock in dev only.
  const body = {
    full_name: input.fullName,
    username: input.username,
    language: input.language,
    avatar_url: input.avatarUrl,
  }
  const { data } = await apiClient.put<{ updated: boolean }>(PATHS.me, body)
  return data
}

// --- Shop / seller (real) ---
// Backend returns 404 `not_a_seller` when the account has no shop yet — map that to an
// unregistered profile (so the page shows the register form, not an error).
const NOT_REGISTERED: SellerProfile = {
  id: '',
  shopName: '',
  status: 'none',
  registered: false,
  registeredAt: null,
  logoUrl: null,
}

export async function getSeller(): Promise<SellerProfile> {
  try {
    const { data } = await apiClient.get<SellerDto>(PATHS.sellerMe)
    return mapSeller(data)
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.code === 'not_a_seller')) {
      return NOT_REGISTERED
    }
    throw err
  }
}

export async function registerSeller(input: SellerRegisterInput): Promise<SellerProfile> {
  const { data } = await apiClient.post<SellerDto>(PATHS.sellerRegister, {
    shop_name: input.shopName,
  })
  return mapSeller(data)
}

// ✅ PUT /sellers/me — update shop name + logo (shop logo is an R2 public URL).
export async function updateShop(input: { shopName?: string; logoUrl?: string }): Promise<void> {
  await apiClient.put(PATHS.sellerMe, {
    shop_name: input.shopName,
    logo_url: input.logoUrl,
  })
}

// ✅ Identity change (OTP). Phone OTP → new phone; email OTP → current phone.
export async function requestPhoneCode(newPhone: string): Promise<void> {
  await apiClient.post(PATHS.phoneRequest, { new_phone: newPhone })
}
export async function confirmPhone(newPhone: string, code: string): Promise<void> {
  await apiClient.post(PATHS.phoneConfirm, { new_phone: newPhone, code })
}
export async function requestEmailCode(email: string): Promise<void> {
  await apiClient.post(PATHS.emailRequest, { email })
}
export async function confirmEmail(email: string, code: string): Promise<void> {
  await apiClient.post(PATHS.emailConfirm, { email, code })
}

// ✅ Sub-account / member management (GET/POST /sellers/me/staff, DELETE /{id}).
export interface StaffMember {
  id: string
  name: string
  phone: string
  role: string
  status: string
}
export async function getStaff(): Promise<StaffMember[]> {
  const { data } = await apiClient.get<{ staff?: { id: string; full_name?: string; name?: string; phone?: string; role?: string; status?: string }[] }>(PATHS.staff)
  return (data.staff ?? []).map((s) => ({
    id: s.id,
    name: s.full_name || s.name || '—',
    phone: s.phone || '',
    role: s.role || 'viewer',
    status: s.status || 'pending',
  }))
}
export async function inviteStaff(phone: string, role: string): Promise<void> {
  await apiClient.post(PATHS.staff, { phone, role })
}
export async function removeStaff(id: string): Promise<void> {
  await apiClient.delete(`${PATHS.staff}/${id}`)
}

// --- Media upload (real POST /media/upload-url) ---
// Use kind='avatar' for account avatar uploads.
// Returns camelCase result; caller PUTs binary to uploadUrl, then stores publicUrl.
export async function uploadMediaUrl(
  contentType: string,
  kind: 'avatar' | 'product' | 'video',
): Promise<MediaUploadUrlResult> {
  const { data } = await apiClient.post<MediaUploadUrlDto>(PATHS.mediaUploadUrl, {
    content_type: contentType,
    kind,
  })
  return {
    key: data.key,
    uploadUrl: data.upload_url,
    publicUrl: data.public_url,
  }
}

// --- Notifications [PENDING BACKEND] ---
export async function getNotifications(): Promise<NotificationSettings> {
  const { data } = await apiClient.get<NotificationSettings>(PATHS.notifications)
  return data
}

export async function updateNotifications(
  settings: NotificationSettings,
): Promise<NotificationSettings> {
  const { data } = await apiClient.put<NotificationSettings>(PATHS.notifications, settings)
  return data
}

// --- Addresses [LIVE: /sellers/me/addresses — shipping module] ---
// Backend uses {label, full_name, region, district, street, house, flat, postal_code,
// is_*}. The settings UI uses {countryRegion, state, townCity, companyAddress, pincode}.
interface BackendAddress {
  id: string
  label: string
  full_name: string
  phone: string
  region: string
  district: string
  street: string
  house: string
  flat: string
  postal_code: string
  is_default: boolean
  is_pickup: boolean
  is_return: boolean
}

function addrToClient(a: BackendAddress): Address {
  return {
    id: a.id,
    fullName: a.full_name,
    phone: a.phone,
    countryRegion: a.label || 'Uzbekistan',
    state: a.region,
    townCity: a.district,
    pincode: a.postal_code,
    companyAddress: [a.street, a.house, a.flat].filter(Boolean).join(', '),
    isDefault: a.is_default,
    isPickup: a.is_pickup,
    isReturn: a.is_return,
  }
}

function addrToBackend(input: AddressInput): Record<string, unknown> {
  return {
    label: input.countryRegion,
    full_name: input.fullName,
    phone: input.phone,
    region: input.state,
    district: input.townCity,
    street: input.companyAddress,
    postal_code: input.pincode,
    is_default: input.isDefault,
    is_pickup: input.isPickup,
    is_return: input.isReturn,
  }
}

export async function getAddresses(): Promise<AddressListResponse> {
  const { data } = await apiClient.get<{ addresses: BackendAddress[] }>(PATHS.addresses)
  const addresses = (data.addresses ?? []).map(addrToClient)
  return { addresses, total: addresses.length }
}

export async function createAddress(input: AddressInput): Promise<void> {
  await apiClient.post(PATHS.addresses, addrToBackend(input))
}

export async function updateAddress(id: string, input: AddressInput): Promise<void> {
  await apiClient.put(PATHS.address(id), addrToBackend(input))
}

export async function deleteAddress(id: string): Promise<void> {
  await apiClient.delete(PATHS.address(id))
}

// --- Security [PENDING BACKEND] ---
export async function getSecurity(): Promise<SecuritySettings> {
  const { data } = await apiClient.get<SecuritySettings>(PATHS.security)
  return data
}

export async function setTwoFactor(enabled: boolean): Promise<SecuritySettings> {
  const { data } = await apiClient.put<SecuritySettings>(PATHS.security, { enabled })
  return data
}

export async function changePassword(input: PasswordChangeInput): Promise<{ updated: boolean }> {
  // Real route: POST /sellers/me/settings/password — expects snake_case.
  const { data } = await apiClient.post<{ updated: boolean }>(PATHS.password, {
    current_password: input.currentPassword,
    new_password: input.newPassword,
  })
  return data
}

// --- Partner platform / API key [PENDING BACKEND] ---
export async function getApiKey(): Promise<ApiKey> {
  const { data } = await apiClient.get<ApiKey>(PATHS.apiKey)
  return data
}

export async function regenerateApiKey(): Promise<ApiKey> {
  const { data } = await apiClient.post<ApiKey>(PATHS.apiKey, {})
  return data
}

// --- Chat settings [LIVE: /sellers/me/settings/chat] ---
export async function getChatSettings(): Promise<ChatSettings> {
  const { data } = await apiClient.get<ChatSettingsDto>(PATHS.chat)
  return mapChatSettings(data)
}

export async function updateChatSettings(settings: ChatSettings): Promise<ChatSettings> {
  const body = {
    receive_broadcasts: settings.receiveBroadcasts,
    receive_platform_messages: settings.receivePlatformMessages,
    sound_alerts: settings.soundAlerts,
    push_popups: settings.pushPopups,
  }
  const { data } = await apiClient.put<ChatSettingsDto>(PATHS.chat, body)
  return mapChatSettings(data)
}

// --- Email notification prefs [LIVE: /sellers/me/settings/email-notifications] ---
export async function getEmailNotifications(): Promise<EmailNotificationPrefs> {
  const { data } = await apiClient.get<EmailNotifDto>(PATHS.emailNotifications)
  return mapEmailNotif(data)
}

export async function updateEmailNotifications(
  prefs: EmailNotificationPrefs,
): Promise<EmailNotificationPrefs> {
  const body = {
    email_all_disabled: prefs.emailAllDisabled,
    notif_order_email: prefs.notifOrderEmail,
    notif_listing_email: prefs.notifListingEmail,
    notif_policy_email: prefs.notifPolicyEmail,
    notif_promotions_email: prefs.notifPromotionsEmail,
    notif_surveys_email: prefs.notifSurveysEmail,
  }
  const { data } = await apiClient.put<EmailNotifDto>(PATHS.emailNotifications, body)
  return mapEmailNotif(data)
}

// --- Payment settings [PENDING BACKEND: 404] — served by MSW mocks ---
export async function getPaymentSettings(): Promise<PaymentSettings> {
  const { data } = await apiClient.get<PaymentSettings>(PATHS.payment)
  return data
}

export async function updatePaymentSettings(settings: PaymentSettings): Promise<PaymentSettings> {
  const { data } = await apiClient.put<PaymentSettings>(PATHS.payment, settings)
  return data
}

// --- Product settings [LIVE: /sellers/me/settings/product] ---
export async function getProductSettings(): Promise<ProductSettings> {
  const { data } = await apiClient.get<ProductSettingsDto>(PATHS.product)
  return mapProductSettings(data)
}

export async function updateProductSettings(settings: ProductSettings): Promise<ProductSettings> {
  const { data } = await apiClient.put<ProductSettingsDto>(PATHS.product, {
    allow_content_reuse: settings.allowContentReuse,
  })
  return mapProductSettings(data)
}

// --- Vacation mode [LIVE: /sellers/me/settings/vacation-mode] ---
export async function getVacationSettings(): Promise<VacationSettings> {
  const { data } = await apiClient.get<VacationDto>(PATHS.vacation)
  return mapVacation(data)
}

export async function updateVacationSettings(settings: VacationSettings): Promise<VacationSettings> {
  const body = {
    vacation_mode_enabled: settings.vacationModeEnabled,
    vacation_auto_reply_text: settings.vacationAutoReplyText || null,
  }
  const { data } = await apiClient.put<VacationDto>(PATHS.vacation, body)
  return mapVacation(data)
}

// --- Partner integrations [LIVE: /sellers/me/settings/partners] ---
export async function getPartners(): Promise<PartnersResponse> {
  const { data } = await apiClient.get<PartnersDto>(PATHS.partners)
  return mapPartnersResponse(data)
}

export async function unlinkPartner(id: string): Promise<{ ok: boolean }> {
  const { data } = await apiClient.post<{ ok: boolean }>(`${PATHS.partners}/${id}/unlink`, {})
  return data
}

export async function removePartner(id: string): Promise<{ ok: boolean }> {
  const { data } = await apiClient.delete<{ ok: boolean }>(`${PATHS.partners}/${id}`)
  return data
}

export async function renewPartner(id: string): Promise<PartnerIntegration> {
  const { data } = await apiClient.post<PartnerIntegrationDto>(`${PATHS.partners}/${id}/renew`, {})
  return mapPartnerIntegration(data)
}

// --- Account protection [LIVE: /sellers/me/settings/protection] ---
export async function getAccountProtection(): Promise<AccountProtectionSettings> {
  const { data } = await apiClient.get<ProtectionDto>(PATHS.protection)
  return mapProtection(data)
}

export async function updateAccountProtection(
  settings: Omit<AccountProtectionSettings, 'approvalTickets'>,
): Promise<AccountProtectionSettings> {
  // Backend expects high_risk_rules array; FE sends flat booleans — expand them.
  const body = {
    sms_verification_enabled: settings.smsVerificationEnabled,
    high_risk_rules: [
      {
        risk_type: 'add_bank_account',
        approval_required: settings.highRiskApprovalEnabled,
        notice_all_checkers: settings.noticeAllCheckers,
      },
      {
        risk_type: 'withdraw_funds',
        approval_required: settings.highRiskApprovalEnabled,
        notice_all_checkers: settings.noticeAllCheckers,
      },
    ],
  }
  const { data } = await apiClient.put<ProtectionDto>(PATHS.protection, body)
  return mapProtection(data)
}

// --- Coupons [LIVE: /sellers/me/coupons] ---
export interface CouponDto {
  id: string
  type: string
  value_uzs: number
  description: { uz: string; ru: string; en: string }
  expires_at: string
  claimed_at: string | null
}

export interface CouponsResponse {
  unclaimed_count: number
  coupons: CouponDto[]
}

export async function getCoupons(): Promise<CouponsResponse> {
  const { data } = await apiClient.get<CouponsResponse>(PATHS.coupons)
  return data
}

export async function claimCoupon(id: string): Promise<{ ok: boolean; claimed_at: string }> {
  const { data } = await apiClient.post<{ ok: boolean; claimed_at: string }>(
    `${PATHS.coupons}/${id}/claim`,
    {},
  )
  return data
}

export async function dismissCoupon(id: string): Promise<{ ok: boolean }> {
  const { data } = await apiClient.post<{ ok: boolean }>(`${PATHS.coupons}/${id}/dismiss`, {})
  return data
}
