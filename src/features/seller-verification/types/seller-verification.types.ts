/**
 * ============================================================================
 * Seller Verification Types
 * ============================================================================
 *
 * Frontend domain models.
 *
 * CamelCase ishlatiladi.
 */

import type {
  VerificationStatus,
  VerificationStep,
  EmailVerificationStatus,
  PassportVerificationStatus,
  InnVerificationStatus,
} from './enums'

/* ============================================================================
 * SELLER PROFILE
 * ============================================================================
 */

export interface SellerProfile {
  id: string

  fullName: string

  phone: string

  email: string

  address: string

  verificationStatus: VerificationStatus

  createdAt: string

  updatedAt: string
}

export interface SellerProfileUpdate {
  fullName?: string

  phone?: string

  email?: string

  address?: string
}

/* ============================================================================
 * SELLER STATUS
 * ============================================================================
 */

export interface SellerStatus {
  completedSteps: number

  totalSteps: number

  progressPercentage: number

  currentStep: VerificationStep

  verified: boolean

  verificationStatus: string;
}

/* ============================================================================
 * EMAIL
 * ============================================================================
 */

export interface SendVerificationEmailPayload {
  email: string
}

export interface VerifyEmailOtpPayload {
  email: string

  code: string
}

export interface EmailVerificationResponse {
  verified: boolean

  message: string
}

export interface EmailVerificationState {
  verified: boolean

  email: string

  status: EmailVerificationStatus

  verifiedAt: string | null
}

/**
 * ============================================================================
 * Backward Compatibility
 * ============================================================================
 */

export type SendEmailCodePayload = SendVerificationEmailPayload

export type VerifyEmailPayload = VerifyEmailOtpPayload

export type VerifyEmailResponse = EmailVerificationResponse
/* ============================================================================
 * PASSPORT (MyID)
 * ============================================================================
 */

export interface StartPassportVerificationPayload {
  passportNumber: string
}

export interface PassportVerificationSession {
  sessionId: string

  redirectUrl: string

  expiresAt: string
}

export interface PassportVerificationState {
  verified: boolean

  status: PassportVerificationStatus

  fullName: string | null

  passportNumber: string | null

  verifiedAt: string | null

  rejectReason: string | null
}

/* ============================================================================
 * INN
 * ============================================================================
 */

export interface VerifyInnPayload {
  inn: string
}

export interface InnVerificationResponse {
  verified: boolean

  companyName: string | null

  ownerName: string | null

  inn: string

  message: string
}

export interface InnVerificationState {
  verified: boolean

  status: InnVerificationStatus

  inn: string | null

  companyName: string | null

  ownerName: string | null

  checkedAt: string | null
}

/**
 * ============================================================================
 * Backward Compatibility
 * ============================================================================
 *
 * Eski importlarni buzmaslik uchun.
 */

export type PassportVerificationSessionResponse =
  PassportVerificationSession

export type PassportVerificationResponse =
  PassportVerificationState
/* ============================================================================
 * BANK
 * ============================================================================
 */

export interface SellerBankAccount {
  id: string

  cardHolder: string

  cardNumber: string

  accountNumber: string | null

  bankName: string

  bankCode: string | null

  isPrimary: boolean

  verified: boolean

  createdAt: string

  updatedAt: string
}

export interface SaveBankAccountPayload {
  cardHolder: string

  cardNumber: string

  accountNumber?: string

  bankName: string

  bankCode?: string
}

export interface UpdateBankAccountPayload {
  cardHolder?: string

  cardNumber?: string

  accountNumber?: string

  bankName?: string

  bankCode?: string
}

/* ============================================================================
 * COMPANY
 * ============================================================================
 */

export interface SellerCompany {
  id: string

  companyName: string

  directorName: string

  inn: string

  registrationNumber: string

  legalAddress: string

  businessType: string

  verified: boolean

  createdAt: string

  updatedAt: string
}

export interface SaveCompanyPayload {
  companyName: string

  directorName: string

  inn: string

  registrationNumber: string

  legalAddress: string

  businessType: string
}

export interface UpdateCompanyPayload {
  companyName?: string

  directorName?: string

  inn?: string

  registrationNumber?: string

  legalAddress?: string

  businessType?: string
}

/* ============================================================================
 * CERTIFICATES
 * ============================================================================
 */

export interface SellerCertificate {
  id: string

  fileName: string

  originalName: string

  mimeType: string

  fileSize: number

  documentType: string

  verified: boolean

  uploadedAt: string

  downloadUrl: string
}

export interface UploadCertificatePayload {
  file: File

  documentType: string
}
/* ============================================================================
 * VERIFICATION PROGRESS
 * ============================================================================
 */

export interface VerificationProgress {
  completedSteps: number

  totalSteps: number

  progressPercentage: number

  currentStep: VerificationStep

  verified: boolean
}

/* ============================================================================
 * VERIFICATION SUMMARY
 * ============================================================================
 */

export interface VerificationSummary {
  profile: SellerProfile

  status: SellerStatus

  email: EmailVerificationState

  passport: PassportVerificationState

  inn: InnVerificationState

  bank: SellerBankAccount | null

  company: SellerCompany | null

  certificates: SellerCertificate[]
}

/* ============================================================================
 * FEATURE STATE
 * ============================================================================
 */

export interface SellerVerificationState {
  loading: boolean

  saving: boolean

  initialized: boolean

  summary: VerificationSummary | null

  error: string | null
}

/* ============================================================================
 * COMPONENT PROPS
 * ============================================================================
 */

export interface VerificationCardProps {
  disabled?: boolean

  readOnly?: boolean

  className?: string
}

export interface VerificationStepProps {
  currentStep: VerificationStep

  completed: boolean

  disabled?: boolean
}

export interface StatusBadgeProps {
  status: VerificationStatus
}

export interface VerificationProgressProps {
  progress: VerificationProgress
}

export interface VerificationCompletedProps {
  verifiedAt?: string

  className?: string
}

/* ============================================================================
 * COMMON
 * ============================================================================
 */

export interface SelectOption<T = string> {
  label: string

  value: T
}

export interface Pagination {
  page: number

  pageSize: number

  total: number
}

export interface ApiError {
  message: string

  code?: string
}

export interface AsyncState<T> {
  loading: boolean

  data: T | null

  error: string | null
}
/* ============================================================================
 * COMMON RESPONSE TYPES
 * ============================================================================
 */

export interface VerificationResult {
  success: boolean

  message: string
}

export interface VerificationError {
  code?: string

  message: string

  details?: unknown
}

export interface VerificationApiResponse<T> {
  success: boolean

  message: string

  data: T
}

/* ============================================================================
 * FILE UPLOAD
 * ============================================================================
 */

export interface UploadFileState {
  file: File | null

  progress: number

  uploaded: boolean

  error: string | null
}

/* ============================================================================
 * STEP STATUS
 * ============================================================================
 */

export interface VerificationStepStatus {
  step: VerificationStep

  completed: boolean

  required: boolean

  status: VerificationStatus
}

/* ============================================================================
 * DASHBOARD
 * ============================================================================
 */

export interface SellerVerificationDashboard {
  seller: SellerProfile

  verification: SellerStatus

  progress: VerificationProgress
}

/* ============================================================================
 * LEGACY TYPE ALIASES
 * ============================================================================
 *
 * Eski API fayllari buzilib qolmasligi uchun.
 */

export type EmailVerification = EmailVerificationState

export type PassportVerification = PassportVerificationState

export type InnVerification = InnVerificationState

export type BankAccount = SellerBankAccount

export type Company = SellerCompany

export type Certificate = SellerCertificate

/* ============================================================================
 * ARRAY TYPES
 * ============================================================================
 */

export type SellerCertificateList = SellerCertificate[]

export type VerificationStepList = VerificationStepStatus[]

/* ============================================================================
 * EXPORT HELPERS
 * ============================================================================
 */

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type ValueOf<T> = T[keyof T]

/* ============================================================================
 * END OF FILE
 * ============================================================================
 */
/* ============================================================================
 * UI STATUS BADGE & PROGRESS CONFIGURATIONS (ZERO HARDCODED)
 * ============================================================================
 */

export const VERIFICATION_STATUS_CONFIG = {
  pending: {
    labelKey: 'seller.status.pending',
    tooltipKey: 'seller.status.pendingTooltip',
    icon: 'Clock',
    styles: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400',
    progressTheme: 'bg-amber-500 dark:bg-amber-400',
  },
  processing: {
    labelKey: 'seller.status.processing',
    tooltipKey: 'seller.status.processingTooltip',
    icon: 'Loader2',
    styles: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-400 animate-pulse',
    progressTheme: 'bg-blue-500 dark:bg-blue-400',
  },
  in_progress: {
    labelKey: 'seller.status.processing',
    tooltipKey: 'seller.status.processingTooltip',
    icon: 'Loader2',
    styles: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-400',
    progressTheme: 'bg-blue-500 dark:bg-blue-400',
  },
  verified: {
    labelKey: 'seller.status.verified',
    tooltipKey: 'seller.status.verifiedTooltip',
    icon: 'ShieldCheck',
    styles: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-900/40 dark:text-green-400',
    progressTheme: 'bg-green-500 dark:bg-green-400',
  },
  approved: {
    labelKey: 'seller.status.approved',
    tooltipKey: 'seller.status.approvedTooltip',
    icon: 'CheckCircle2',
    styles: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400',
    progressTheme: 'bg-emerald-500 dark:bg-emerald-400',
  },
  rejected: {
    labelKey: 'seller.status.rejected',
    tooltipKey: 'seller.status.rejectedTooltip',
    icon: 'XCircle',
    styles: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400',
    progressTheme: 'bg-red-500 dark:bg-red-400',
  },
  failed: {
    labelKey: 'seller.status.failed',
    tooltipKey: 'seller.status.failedTooltip',
    icon: 'AlertTriangle',
    styles: 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400',
    progressTheme: 'bg-rose-500 dark:bg-rose-400',
  },
  expired: {
    labelKey: 'seller.status.expired',
    tooltipKey: 'seller.status.expiredTooltip',
    icon: 'History',
    styles: 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400',
    progressTheme: 'bg-slate-500 dark:bg-slate-400',
  },
  not_sent: {
    labelKey: 'seller.status.notSent',
    tooltipKey: 'seller.status.notSentTooltip',
    icon: 'Circle',
    styles: 'bg-white border-slate-200 text-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-500',
    progressTheme: 'bg-slate-300 dark:bg-slate-700',
  },
  completed: {
    labelKey: 'seller.status.completed',
    tooltipKey: 'seller.status.completedTooltip',
    icon: 'FileCheck',
    styles: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-400',
    progressTheme: 'bg-indigo-500 dark:bg-indigo-400',
  },
  active: {
    labelKey: 'seller.status.active',
    tooltipKey: 'seller.status.activeTooltip',
    icon: 'PlayCircle',
    styles: 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/20 dark:border-teal-900/40 dark:text-teal-400',
    progressTheme: 'bg-teal-500 dark:bg-teal-400',
  },
  inactive: {
    labelKey: 'seller.status.inactive',
    tooltipKey: 'seller.status.inactiveTooltip',
    icon: 'AlertCircle',
    styles: 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400',
    progressTheme: 'bg-gray-400 dark:bg-gray-600',
  },
  default: {
    labelKey: 'seller.status.pending',
    tooltipKey: 'seller.status.pendingTooltip',
    icon: 'Clock',
    styles: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400',
    progressTheme: 'bg-blue-500 dark:bg-blue-400',
  },
} as const

export const VERIFICATION_STEPS_META = {
  personal_info: {
    labelKey: "seller.steps.personal_info",
    descriptionKey: "seller.steps.personal_info_desc",
    icon: "User",
  },
  email: {
    labelKey: "seller.steps.email",
    descriptionKey: "seller.steps.email_desc",
    icon: "Mail",
  },
  passport: {
    labelKey: "seller.steps.passport",
    descriptionKey: "seller.steps.passport_desc",
    icon: "Shield",
  },
  inn: {
    labelKey: "seller.steps.inn",
    descriptionKey: "seller.steps.inn_desc",
    icon: "Key",
  },
  bank: {
    labelKey: "seller.steps.bank",
    descriptionKey: "seller.steps.bank_desc",
    icon: "Landmark",
  },
  company: {
    labelKey: "seller.steps.company",
    descriptionKey: "seller.steps.company_desc",
    icon: "Building2",
  },
  certificate: {
    labelKey: "seller.steps.certificate",
    descriptionKey: "seller.steps.certificate_desc",
    icon: "FileCheck2",
  },
  completed: {
    labelKey: "seller.steps.completed",
    descriptionKey: "seller.steps.completed_desc",
    icon: "CheckCircle2",
  },
} as const

export const STEP_STATUS_INDICATORS = {
  done: {
    icon: "CheckCircle2",
    styles: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50",
  },
  current: {
    icon: "Clock",
    styles: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50 animate-pulse",
  },
  upcoming: {
    icon: "HelpCircle",
    styles: "text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800",
  },
  failed: {
    icon: "ShieldAlert",
    styles: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50",
  },
} as const