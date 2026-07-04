
/**
 * ============================================================================
 * Seller Verification Constants
 * ============================================================================
 *
 * Ushbu faylda feature bo'yicha barcha o'zgarmas qiymatlar saqlanadi.
 *
 * Maqsad:
 *  - Magic stringlardan qutulish
 *  - Magic numberlardan qutulish
 *  - Bir joydan boshqarish
 *
 * ============================================================================
 */

/* ============================================================================
 * OTP
 * ============================================================================
 */

export const OTP_LENGTH = 6

export const OTP_EXPIRE_SECONDS = 300

export const OTP_RESEND_SECONDS = 60

/* ============================================================================
 * FILE UPLOAD
 * ============================================================================
 */

export const MAX_CERTIFICATE_SIZE = 10 * 1024 * 1024 // 10 MB

export const MAX_CERTIFICATE_COUNT = 10

export const ALLOWED_CERTIFICATE_EXTENSIONS = [
  'pdf',
  'jpg',
  'jpeg',
  'png',
] as const

export const ALLOWED_CERTIFICATE_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const

/* ============================================================================
 * PASSPORT
 * ============================================================================
 */

export const PASSPORT_MIN_LENGTH = 9

export const PASSPORT_MAX_LENGTH = 9

/* ============================================================================
 * INN
 * ============================================================================
 */

export const INN_LENGTH = 9

/* ============================================================================
 * CARD
 * ============================================================================
 */

export const CARD_NUMBER_LENGTH = 16

export const CARD_MASK = '#### #### #### ####'

/* ============================================================================
 * COMPANY
 * ============================================================================
 */

export const COMPANY_NAME_MAX_LENGTH = 255

export const LEGAL_ADDRESS_MAX_LENGTH = 500

/* ============================================================================
 * PROFILE
 * ============================================================================
 */

export const FULL_NAME_MAX_LENGTH = 150

export const PHONE_MAX_LENGTH = 20

export const EMAIL_MAX_LENGTH = 255

/* ============================================================================
 * REACT QUERY
 * ============================================================================
 */

export const DEFAULT_STALE_TIME = 1000 * 60 * 5 // 5 min

export const DEFAULT_GC_TIME = 1000 * 60 * 30 // 30 min

export const DEFAULT_RETRY = 1

/* ============================================================================
 * POLLING
 * ============================================================================
 */

export const PASSPORT_STATUS_POLL_INTERVAL = 5000

export const EMAIL_STATUS_POLL_INTERVAL = 3000

export const INN_STATUS_POLL_INTERVAL = 3000

/* ============================================================================
 * ROUTES
 * ============================================================================
 */

export const SELLER_VERIFICATION_ROUTE =
  '/seller/verification'

export const MYID_CALLBACK_ROUTE =
  '/seller/verification/passport/callback'

/* ============================================================================
 * STORAGE KEYS
 * ============================================================================
 */

export const STORAGE_KEYS = {
  EMAIL: 'seller_verification_email',

  PASSPORT_SESSION: 'passport_session',

  CURRENT_STEP: 'seller_verification_step',
} as const

/* ============================================================================
 * API
 * ============================================================================
 */

export const API_TIMEOUT = 30000

/* ============================================================================
 * UI
 * ============================================================================
 */

export const STEP_ANIMATION_DURATION = 300

export const SUCCESS_MESSAGE_DURATION = 3000

/* ============================================================================
 * STEP ORDER
 * ============================================================================
 */

export const VERIFICATION_STEP_ORDER = [
  'personal_info',
  'email',
  'passport',
  'inn',
  'bank',
  'company',
  'certificate',
  'completed',
] as const

/* ============================================================================
 * REGEX
 * ============================================================================
 */

export const REGEX = {
  EMAIL:
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  PHONE:
    /^\+?[0-9]{9,15}$/,

  PASSPORT:
    /^[A-Z]{2}[0-9]{7}$/,

  INN:
    /^[0-9]{9}$/,

  CARD:
    /^[0-9]{16}$/,
} as const

// Append this configuration to constants.ts
export const VERIFICATION_STATUS_CONFIG = {
  pending: {
    labelKey: 'seller.status.pending',
    tooltipKey: 'seller.status.pendingTooltip',
    icon: 'Clock',
    styles: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400',
  },
  processing: {
    labelKey: 'seller.status.processing',
    tooltipKey: 'seller.status.processingTooltip',
    icon: 'Loader2',
    styles: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-400 animate-pulse',
  },
  verified: {
    labelKey: 'seller.status.verified',
    tooltipKey: 'seller.status.verifiedTooltip',
    icon: 'ShieldCheck',
    styles: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-900/40 dark:text-green-400',
  },
  approved: {
    labelKey: 'seller.status.approved',
    tooltipKey: 'seller.status.approvedTooltip',
    icon: 'CheckCircle2',
    styles: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400',
  },
  rejected: {
    labelKey: 'seller.status.rejected',
    tooltipKey: 'seller.status.rejectedTooltip',
    icon: 'XCircle',
    styles: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400',
  },
  failed: {
    labelKey: 'seller.status.failed',
    tooltipKey: 'seller.status.failedTooltip',
    icon: 'AlertTriangle',
    styles: 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400',
  },
  expired: {
    labelKey: 'seller.status.expired',
    tooltipKey: 'seller.status.expiredTooltip',
    icon: 'History',
    styles: 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400',
  },
  not_sent: {
    labelKey: 'seller.status.notSent',
    tooltipKey: 'seller.status.notSentTooltip',
    icon: 'Circle',
    styles: 'bg-white border-slate-200 text-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-500',
  },
  completed: {
    labelKey: 'seller.status.completed',
    tooltipKey: 'seller.status.completedTooltip',
    icon: 'FileCheck',
    styles: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-400',
  },
  active: {
    labelKey: 'seller.status.active',
    tooltipKey: 'seller.status.activeTooltip',
    icon: 'PlayCircle',
    styles: 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/20 dark:border-teal-900/40 dark:text-teal-400',
  },
  inactive: {
    labelKey: 'seller.status.inactive',
    tooltipKey: 'seller.status.inactiveTooltip',
    icon: 'AlertCircle',
    styles: 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400',
  },
} as const