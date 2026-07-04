import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import type {
  AccountProtectionSettings,
  Address,
  AddressListResponse,
  ApiKey,
  ChatSettings,
  EmailNotificationPrefs,
  NotificationSettings,
  PartnerIntegration,
  PartnersResponse,
  PaymentSettings,
  ProductSettings,
  SecuritySettings,
  VacationSettings,
} from '../types/setting.types'

const base = env.apiBaseUrl

// In-memory state so mutations persist for the session. Real backend owns these in prod;
// the mock envelope mirrors the route shape so dev ≈ prod.

// --- /me (real route, mocked for dev — backend-shaped snake_case) ---
// seller.status enum: pending | approved | suspended (not 'active').
let me = {
  id: '0190c100-0001-7000-8000-000000000001',
  phone: '+998 90 123 45 67',
  full_name: 'Akmal Yusupov',
  username: 'akmal.yusupov',
  email: 'akmal@ozb-store.uz',
  avatar_url: null as string | null,
  language: 'uz',
  is_admin: false,
  modes: ['buyer', 'seller'],
  seller: { status: 'approved', shop_name: 'OZB Official Store' },
  gender: 'male' as string | null,
  date_of_birth: '1996-04-21' as string | null,
  phone_verified: true,
}

// --- /sellers/me (real route, mocked for dev). Status enum: pending|approved|suspended ---
let seller = {
  id: '0190c100-2001-7000-8000-000000002001' as string | null,
  shop_name: 'OZB Official Store' as string | null,
  status: 'approved',
  registered_at: '2026-05-12' as string | null,
}

// --- notifications [PENDING BACKEND] ---
let notifications: NotificationSettings = {
  emailEnabled: true,
  orderUpdates: true,
  promotions: true,
  listingUpdates: true,
  chatMessages: true,
}

// --- addresses [PENDING BACKEND] ---
let addresses: Address[] = [
  {
    id: '0190c100-3001-7000-8000-000000003001',
    fullName: 'Akmal Yusupov',
    phone: '+998 90 123 45 67',
    countryRegion: 'Uzbekistan',
    state: 'Toshkent',
    townCity: 'Chilonzor',
    pincode: '100115',
    companyAddress: 'Chilonzor tumani, 9-kvartal, 12-uy',
    isDefault: true,
    isPickup: false,
    isReturn: false,
  },
  {
    id: '0190c100-3002-7000-8000-000000003002',
    fullName: 'OZB Ombor',
    phone: '+998 71 200 00 00',
    countryRegion: 'Uzbekistan',
    state: 'Toshkent',
    townCity: 'Yashnobod',
    pincode: '100211',
    companyAddress: 'Yashnobod tumani, Sanoat koʻchasi, 4-bino',
    isDefault: false,
    isPickup: true,
    isReturn: true,
  },
]

// --- security [PENDING BACKEND] ---
let security: SecuritySettings = { twoFactorEnabled: false }

// --- API key [PENDING BACKEND] ---
let apiKey: ApiKey = {
  id: '0190c100-4001-7000-8000-000000004001',
  key: 'ozb_live_7Qk2Pn9Rs4Tv8Wx1Yz3Ab5Cd',
  createdAt: '2026-06-01',
}

// --- Chat settings [PENDING BACKEND] ---
let chatSettings: ChatSettings = {
  receiveBroadcasts: false,
  receivePlatformMessages: true,
  soundAlerts: true,
  pushPopups: true,
}

// --- Email notification prefs [PENDING BACKEND] ---
let emailNotifications: EmailNotificationPrefs = {
  emailAllDisabled: false,
  notifOrderEmail: true,
  notifListingEmail: true,
  notifPolicyEmail: true,
  notifPromotionsEmail: true,
  notifSurveysEmail: true,
}

// --- Payment settings [PENDING BACKEND] ---
let paymentSettings: PaymentSettings = {
  autoWithdrawalEnabled: false,
  autoWithdrawalFrequency: 'weekly',
  autoWithdrawalDay: 1,
  balancePinSet: false,
}

// --- Product settings [PENDING BACKEND] ---
let productSettings: ProductSettings = {
  allowContentReuse: true,
}

// --- Vacation mode [PENDING BACKEND] ---
let vacationSettings: VacationSettings = {
  vacationModeEnabled: true,
  vacationAutoReplyText:
    'Auto-Reply Message: Thank you for your message! Our team is availability limited during vacation mode.',
  vacationEnabledAt: '2026-06-15T08:00:00Z',
  vacationDisabledAt: null,
}

// --- Partner integrations [PENDING BACKEND] ---
let partnerIntegrations: PartnerIntegration[] = []

// --- Account protection [PENDING BACKEND] ---
let accountProtection: AccountProtectionSettings = {
  smsVerificationEnabled: true,
  highRiskApprovalEnabled: false,
  noticeAllCheckers: false,
  approvalTickets: [],
}

function randomKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'ozb_live_'
  for (let i = 0; i < 24; i += 1) result += chars.charAt(Math.floor(Math.random() * chars.length))
  return result
}

function addressList(): AddressListResponse {
  return { addresses, total: addresses.length }
}

export const settingHandlers = [
  // --- /me ---
  http.get(`${base}/me`, () => HttpResponse.json(me)),
  http.put(`${base}/me`, async ({ request }) => {
    // Mirror the real backend: only these four fields are accepted/persisted.
    const body = (await request.json()) as {
      full_name?: string
      username?: string
      language?: string
      avatar_url?: string | null
    }
    me = {
      ...me,
      full_name: body.full_name ?? me.full_name,
      username: body.username ?? me.username,
      language: body.language ?? me.language,
      avatar_url: 'avatar_url' in body ? (body.avatar_url ?? null) : me.avatar_url,
    }
    return HttpResponse.json({ updated: true })
  }),

  // --- /sellers/me + register ---
  http.get(`${base}/sellers/me`, () => HttpResponse.json(seller)),
  http.post(`${base}/sellers/register`, async ({ request }) => {
    const body = (await request.json()) as { shop_name?: string }
    // Upsert: a brand-new seller row defaults to `pending`; an existing one keeps its status.
    const isNew = seller.id == null
    seller = {
      id: seller.id ?? '0190c100-2001-7000-8000-000000002001',
      shop_name: body.shop_name ?? seller.shop_name,
      status: isNew ? 'pending' : seller.status,
      registered_at: seller.registered_at ?? new Date().toISOString().slice(0, 10),
    }
    return HttpResponse.json(seller)
  }),

  // --- /media/upload-url (real route, backend-shaped) ---
  // kind: avatar | product | video → returns {key, upload_url, public_url}.
  // Caller PUTs binary to upload_url; stores public_url as avatar_url / image_url.
  http.post(`${base}/media/upload-url`, async ({ request }) => {
    const body = (await request.json()) as { content_type?: string; kind?: string }
    const key = `uploads/${body.kind ?? 'avatar'}/${crypto.randomUUID()}`
    return HttpResponse.json({
      key,
      upload_url: `https://r2.ozb.ac/${key}?X-Mock-Signed=1`,
      public_url: `https://cdn.ozb.ac/${key}`,
    })
  }),

  // --- notifications [PENDING BACKEND] ---
  http.get(`${base}/seller/settings/notifications`, () => HttpResponse.json(notifications)),
  http.put(`${base}/seller/settings/notifications`, async ({ request }) => {
    notifications = (await request.json()) as NotificationSettings
    return HttpResponse.json(notifications)
  }),

  // --- addresses [PENDING BACKEND] ---
  http.get(`${base}/seller/settings/addresses`, () => HttpResponse.json(addressList())),
  http.post(`${base}/seller/settings/addresses`, async ({ request }) => {
    const input = (await request.json()) as Omit<Address, 'id'>
    const created: Address = { ...input, id: crypto.randomUUID() }
    addresses = [...addresses, created]
    return HttpResponse.json(addressList())
  }),

  // --- security [PENDING BACKEND] ---
  http.get(`${base}/seller/settings/security`, () => HttpResponse.json(security)),
  http.put(`${base}/seller/settings/security`, async ({ request }) => {
    const body = (await request.json()) as { enabled?: boolean }
    security = { twoFactorEnabled: Boolean(body.enabled) }
    return HttpResponse.json(security)
  }),
  http.post(`${base}/seller/settings/password`, () => HttpResponse.json({ updated: true })),

  // --- API key [PENDING BACKEND] ---
  http.get(`${base}/seller/settings/api-key`, () => HttpResponse.json(apiKey)),
  http.post(`${base}/seller/settings/api-key`, () => {
    apiKey = { id: apiKey.id, key: randomKey(), createdAt: new Date().toISOString().slice(0, 10) }
    return HttpResponse.json(apiKey)
  }),

  // --- Chat settings [PENDING BACKEND] ---
  http.get(`${base}/seller/settings/chat`, () => HttpResponse.json(chatSettings)),
  http.put(`${base}/seller/settings/chat`, async ({ request }) => {
    chatSettings = (await request.json()) as ChatSettings
    return HttpResponse.json(chatSettings)
  }),

  // --- Email notification prefs [PENDING BACKEND] ---
  http.get(`${base}/seller/settings/email-notifications`, () =>
    HttpResponse.json(emailNotifications),
  ),
  http.put(`${base}/seller/settings/email-notifications`, async ({ request }) => {
    emailNotifications = (await request.json()) as EmailNotificationPrefs
    return HttpResponse.json(emailNotifications)
  }),

  // --- Payment settings [PENDING BACKEND] ---
  http.get(`${base}/seller/settings/payment`, () => HttpResponse.json(paymentSettings)),
  http.put(`${base}/seller/settings/payment`, async ({ request }) => {
    paymentSettings = (await request.json()) as PaymentSettings
    return HttpResponse.json(paymentSettings)
  }),

  // --- Product settings [PENDING BACKEND] ---
  http.get(`${base}/seller/settings/product`, () => HttpResponse.json(productSettings)),
  http.put(`${base}/seller/settings/product`, async ({ request }) => {
    productSettings = (await request.json()) as ProductSettings
    return HttpResponse.json(productSettings)
  }),

  // --- Vacation mode [PENDING BACKEND] ---
  http.get(`${base}/seller/settings/vacation-mode`, () => HttpResponse.json(vacationSettings)),
  http.put(`${base}/seller/settings/vacation-mode`, async ({ request }) => {
    vacationSettings = (await request.json()) as VacationSettings
    return HttpResponse.json(vacationSettings)
  }),

  // --- Partner integrations [PENDING BACKEND] ---
  http.get(`${base}/seller/settings/partners`, () => {
    const counts = {
      active: partnerIntegrations.filter((p) => p.status === 'active').length,
      frozen: partnerIntegrations.filter((p) => p.status === 'frozen').length,
      expired: partnerIntegrations.filter((p) => p.status === 'expired').length,
      unlinked: partnerIntegrations.filter((p) => p.status === 'unlinked').length,
    }
    const resp: PartnersResponse = { integrations: partnerIntegrations, counts }
    return HttpResponse.json(resp)
  }),
  http.post(`${base}/seller/settings/partners/:id/unlink`, ({ params }) => {
    partnerIntegrations = partnerIntegrations.map((p) =>
      p.id === params.id ? { ...p, status: 'unlinked' } : p,
    )
    return HttpResponse.json({ ok: true })
  }),
  http.delete(`${base}/seller/settings/partners/:id`, ({ params }) => {
    partnerIntegrations = partnerIntegrations.filter((p) => p.id !== params.id)
    return HttpResponse.json({ ok: true })
  }),
  http.post(`${base}/seller/settings/partners/:id/renew`, ({ params }) => {
    const found = partnerIntegrations.find((p) => p.id === params.id)
    if (!found) return HttpResponse.json({ error: 'not_found' }, { status: 404 })
    const renewed = { ...found, status: 'active' as const, expiresAt: '2027-06-16' }
    partnerIntegrations = partnerIntegrations.map((p) => (p.id === params.id ? renewed : p))
    return HttpResponse.json(renewed)
  }),

  // --- Account protection [PENDING BACKEND] ---
  http.get(`${base}/seller/settings/protection`, () => HttpResponse.json(accountProtection)),
  http.put(`${base}/seller/settings/protection`, async ({ request }) => {
    const body = (await request.json()) as Partial<AccountProtectionSettings>
    accountProtection = {
      ...accountProtection,
      smsVerificationEnabled: body.smsVerificationEnabled ?? accountProtection.smsVerificationEnabled,
      highRiskApprovalEnabled: body.highRiskApprovalEnabled ?? accountProtection.highRiskApprovalEnabled,
      noticeAllCheckers: body.noticeAllCheckers ?? accountProtection.noticeAllCheckers,
    }
    return HttpResponse.json(accountProtection)
  }),
]
