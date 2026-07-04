/**
 * ============================================================================
 * Seller Verification API DTOs
 * ============================================================================
 *
 * Backend bilan almashiladigan barcha Request/Response modellari.
 *
 * MUHIM:
 *
 * Bu faylda faqat snake_case ishlatiladi.
 *
 * Sababi:
 *
 * Backend (Python/FastAPI)
 *            ↓
 *       snake_case
 *            ↓
 *         DTO Layer
 *            ↓
 *         Mapper
 *            ↓
 * Frontend Model
 *            ↓
 *       camelCase
 *
 * ============================================================================
 */

/* ============================================================================
 * COMMON
 * ============================================================================
 */

export interface ApiResponseDto<T> {
  success: boolean
  message: string
  data: T
}

/* ============================================================================
 * SELLER
 * ============================================================================
 */

export interface SellerProfileDto {
  id: string

  full_name: string

  phone: string

  email: string

  address: string

  verification_status: string

  created_at: string

  updated_at: string
}

export interface SellerVerificationStatusDto {
  completed_steps: number

  total_steps: number

  progress_percentage: number

  current_step: string

  verified: boolean
}

/* ============================================================================
 * EMAIL
 * ============================================================================
 */

export interface SendEmailDto {
  email: string
}

export interface VerifyEmailOtpDto {
  email: string

  otp: string
}

export interface EmailVerificationStatusDto {
  verified: boolean

  email: string

  verified_at: string | null
}

/* ============================================================================
 * PASSPORT (MyID)
 * ============================================================================
 */

export interface StartPassportVerificationDto {
  passport_number: string
}

export interface PassportVerificationSessionDto {
  session_id: string

  redirect_url: string

  expires_at: string
}

export interface PassportVerificationStatusDto {
  verified: boolean

  status: string

  full_name: string | null

  passport_number: string | null

  verified_at: string | null

  reject_reason: string | null
}

/* ============================================================================
 * INN
 * ============================================================================
 */

export interface VerifyInnDto {
  inn: string
}

export interface InnVerificationResponseDto {
  verified: boolean

  company_name: string | null

  owner_name: string | null

  inn: string

  message: string
}

export interface InnVerificationStatusDto {
  verified: boolean

  inn: string | null

  company_name: string | null

  owner_name: string | null

  checked_at: string | null
}

/* ============================================================================
 * BANK
 * ============================================================================
 */

export interface SaveBankAccountDto {
  card_holder: string

  card_number: string

  account_number?: string

  bank_name: string

  bank_code?: string
}

export interface SellerBankAccountDto {
  id: string

  card_holder: string

  card_number: string

  account_number: string | null

  bank_name: string

  bank_code: string | null

  is_primary: boolean

  verified: boolean

  created_at: string

  updated_at: string
}

/* ============================================================================
 * COMPANY
 * ============================================================================
 */

export interface SaveCompanyDto {
  company_name: string

  director_name: string

  inn: string

  registration_number: string

  legal_address: string

  business_type: string
}

export interface SellerCompanyDto {
  id: string

  company_name: string

  director_name: string

  inn: string

  registration_number: string

  legal_address: string

  business_type: string

  verified: boolean

  created_at: string

  updated_at: string
}

/* ============================================================================
 * CERTIFICATE
 * ============================================================================
 */

export interface UploadCertificateDto {
  document_type: string
}

export interface SellerCertificateDto {
  id: string

  file_name: string

  original_name: string

  mime_type: string

  file_size: number

  document_type: string

  verified: boolean

  uploaded_at: string

  download_url: string
}