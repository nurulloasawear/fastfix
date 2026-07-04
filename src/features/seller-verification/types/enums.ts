/**
 * ============================================================================
 * Seller Verification Constants & Types
 * ============================================================================
 *
 * IMPORTANT:
 *
 * This project uses:
 *
 *   "erasableSyntaxOnly": true
 *
 * Therefore native TypeScript enums CANNOT be used.
 *
 * Instead we use:
 *
 *   const object + literal type
 *
 * This gives:
 *
 * ✅ IntelliSense
 * ✅ Autocomplete
 * ✅ Type Safety
 * ✅ Tree Shaking
 * ✅ No Runtime Enum
 *
 * ============================================================================
 */

/* ============================================================================
 * Verification Status
 * ============================================================================
 */

export const VerificationStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const

export type VerificationStatus =
  (typeof VerificationStatus)[keyof typeof VerificationStatus]

/* ============================================================================
 * Verification Step
 * ============================================================================
 */

export const VerificationStep = {
  PERSONAL_INFO: 'personal_info',
  EMAIL: 'email',
  PASSPORT: 'passport',
  INN: 'inn',
  BANK: 'bank',
  COMPANY: 'company',
  CERTIFICATE: 'certificate',
  COMPLETED: 'completed',
} as const

export type VerificationStep =
  (typeof VerificationStep)[keyof typeof VerificationStep]

/* ============================================================================
 * Email Verification
 * ============================================================================
 */

export const EmailVerificationStatus = {
  NOT_SENT: 'not_sent',
  PENDING: 'pending',
  VERIFIED: 'verified',
  FAILED: 'failed',
  EXPIRED: 'expired',
} as const

export type EmailVerificationStatus =
  (typeof EmailVerificationStatus)[keyof typeof EmailVerificationStatus]

/* ============================================================================
 * Passport Verification
 * ============================================================================
 */

export const PassportVerificationStatus = {
  NOT_STARTED: 'not_started',
  PENDING: 'pending',
  REDIRECTED: 'redirected',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const

export type PassportVerificationStatus =
  (typeof PassportVerificationStatus)[keyof typeof PassportVerificationStatus]

/* ============================================================================
 * INN Verification
 * ============================================================================
 */

export const InnVerificationStatus = {
  NOT_VERIFIED: 'not_verified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  FAILED: 'failed',
} as const

export type InnVerificationStatus =
  (typeof InnVerificationStatus)[keyof typeof InnVerificationStatus]

/* ============================================================================
 * Certificate Type
 * ============================================================================
 */

export const CertificateType = {
  PRODUCT_CERTIFICATE: 'product_certificate',
  QUALITY_CERTIFICATE: 'quality_certificate',
  CONFORMITY_CERTIFICATE: 'conformity_certificate',
  LICENSE: 'license',
  PERMIT: 'permit',
  OTHER: 'other',
} as const

export type CertificateType =
  (typeof CertificateType)[keyof typeof CertificateType]

/* ============================================================================
 * Business Type
 * ============================================================================
 */

export const BusinessType = {
  INDIVIDUAL: 'individual',
  SOLE_PROPRIETOR: 'sole_proprietor',
  LLC: 'llc',
  JSC: 'jsc',
  PRIVATE_ENTERPRISE: 'private_enterprise',
  OTHER: 'other',
} as const

export type BusinessType =
  (typeof BusinessType)[keyof typeof BusinessType]

/* ============================================================================
 * Bank Account Type
 * ============================================================================
 */

export const BankAccountType = {
  CARD: 'card',
  ACCOUNT: 'account',
} as const

export type BankAccountType =
  (typeof BankAccountType)[keyof typeof BankAccountType]

/* ============================================================================
 * Identity Document
 * ============================================================================
 */

export const IdentityDocumentType = {
  PASSPORT: 'passport',
  ID_CARD: 'id_card',
} as const

export type IdentityDocumentType =
  (typeof IdentityDocumentType)[keyof typeof IdentityDocumentType]

/* ============================================================================
 * OTP Channel
 * ============================================================================
 */

export const OtpChannel = {
  EMAIL: 'email',
} as const

export type OtpChannel =
  (typeof OtpChannel)[keyof typeof OtpChannel]

/* ============================================================================
 * Upload Status
 * ============================================================================
 */

export const UploadStatus = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const

export type UploadStatus =
  (typeof UploadStatus)[keyof typeof UploadStatus]

/* ============================================================================
 * Mime Type
 * ============================================================================
 */

export const MimeType = {
  PDF: 'application/pdf',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
} as const

export type MimeType =
  (typeof MimeType)[keyof typeof MimeType]

/* ============================================================================
 * Seller Type
 * ============================================================================
 */

export const SellerType = {
  INDIVIDUAL: 'individual',
  BUSINESS: 'business',
} as const

export type SellerType =
  (typeof SellerType)[keyof typeof SellerType]

/* ============================================================================
 * Verification Result
 * ============================================================================
 */

export const VerificationResult = {
  SUCCESS: 'success',
  FAILED: 'failed',
} as const

export type VerificationResult =
  (typeof VerificationResult)[keyof typeof VerificationResult]

/* ============================================================================
 * HTTP Method
 * ============================================================================
 */

export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const

export type HttpMethod =
  (typeof HttpMethod)[keyof typeof HttpMethod]

/* ============================================================================
 * Verification Provider
 * ============================================================================
 */

export const VerificationProvider = {
  MY_ID: 'myid',
  MANUAL: 'manual',
  TEST: 'test',
} as const

export type VerificationProvider =
  (typeof VerificationProvider)[keyof typeof VerificationProvider]

/* ============================================================================
 * Yes / No
 * ============================================================================
 */

export const YesNo = {
  YES: 'yes',
  NO: 'no',
} as const

export type YesNo =
  (typeof YesNo)[keyof typeof YesNo]

/* ============================================================================
 * Loading State
 * ============================================================================
 */

export const LoadingState = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const

export type LoadingState =
  (typeof LoadingState)[keyof typeof LoadingState]