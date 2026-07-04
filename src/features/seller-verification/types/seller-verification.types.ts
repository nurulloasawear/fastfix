// Client-side domain models for the seller verification flow. Backend DTOs are
// snake_case and live in ../api/seller-verification.api.ts with their mappers.

/** Backend wizard steps, in the order the backend advances through them. */
export type ServerStep =
  | 'personal_info'
  | 'email'
  | 'passport'
  | 'inn'
  | 'bank'
  | 'company'
  | 'certificate'
  | 'completed'

/** Grouped UI steps — several similar server steps render as one screen. */
export type UiStepKey = 'profile' | 'identity' | 'bank' | 'company' | 'documents'

export type VerificationStatus =
  | 'unverified'
  | 'pending'
  | 'processing'
  | 'verified'
  | 'approved'
  | 'rejected'

export interface SellerStatus {
  currentStep: ServerStep
  completedSteps: number
  totalSteps: number
  progressPercentage: number
  verificationStatus: VerificationStatus
  verified: boolean
}

export interface SellerProfile {
  id: string
  fullName: string
  phone: string
  email: string
  address: string
  verificationStatus: VerificationStatus
  createdAt: string | null
  updatedAt: string | null
}

export interface UpdateProfilePayload {
  fullName: string
  phone: string
  email: string
  address: string
}

export type EmailVerificationStatus = 'idle' | 'otp_sent' | 'verified'

export interface EmailVerification {
  status: EmailVerificationStatus
  email: string
  verifiedAt: string | null
}

export type PassportVerificationStatus =
  | 'idle'
  | 'pending'
  | 'processing'
  | 'verified'
  | 'rejected'

export interface PassportVerification {
  status: PassportVerificationStatus
  fullName: string | null
  passportNumber: string | null
  verifiedAt: string | null
  rejectReason: string | null
}

export interface PassportSession {
  success: boolean
  /** MyID hand-off URL; absent in dev where the mock verifies instantly. */
  redirectUrl: string | null
}

export type InnVerificationStatus = 'idle' | 'verified' | 'rejected'

export interface InnVerification {
  status: InnVerificationStatus
  inn: string
  companyName: string
  ownerName: string
  checkedAt: string | null
}

export interface BankAccount {
  id: string
  cardHolder: string
  cardNumber: string
  accountNumber: string
  bankName: string
  bankCode: string
  verified: boolean
  isPrimary: boolean
  updatedAt: string | null
}

export interface SaveBankAccountPayload {
  cardHolder: string
  cardNumber: string
  accountNumber: string
  bankName: string
  bankCode: string
}

export type BusinessType = 'llc' | 'ie' | 'jsc' | 'other'

export interface Company {
  id: string
  companyName: string
  directorName: string
  inn: string
  registrationNumber: string
  legalAddress: string
  businessType: BusinessType
  verified: boolean
  updatedAt: string | null
}

export interface SaveCompanyPayload {
  companyName: string
  directorName: string
  inn: string
  registrationNumber: string
  legalAddress: string
  businessType: BusinessType
}

export type CertificateType =
  | 'commercial_license'
  | 'vat_registration'
  | 'articles_of_association'
  | 'other'

export interface Certificate {
  id: string
  fileName: string
  mimeType: string
  fileSize: number
  documentType: CertificateType
  verified: boolean
  uploadedAt: string | null
}

export interface UploadCertificatePayload {
  file: File
  documentType: CertificateType
}
