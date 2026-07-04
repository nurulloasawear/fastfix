import { apiClient } from '@/lib/axios'
import type {
  BankAccount,
  Certificate,
  CertificateType,
  Company,
  EmailVerification,
  EmailVerificationStatus,
  InnVerification,
  InnVerificationStatus,
  PassportSession,
  PassportVerification,
  PassportVerificationStatus,
  SaveBankAccountPayload,
  SaveCompanyPayload,
  SellerProfile,
  SellerStatus,
  ServerStep,
  UpdateProfilePayload,
  UploadCertificatePayload,
  VerificationStatus,
} from '../types/seller-verification.types'
import { SERVER_STEP_ORDER } from '../lib/constants'

const PATHS = {
  status: '/seller/status',
  profile: '/seller/profile',
  emailStatus: '/seller/email/status',
  emailSend: '/seller/email/send',
  emailVerify: '/seller/email/verify',
  passportStatus: '/seller/passport/status',
  passportStart: '/seller/passport/start',
  innStatus: '/seller/inn/status',
  innVerify: '/seller/inn/verify',
  bank: '/seller/bank',
  company: '/seller/company',
  certificates: '/seller/certificates',
  certificate: (id: string) => `/seller/certificates/${id}`,
} as const

/* ── Backend DTOs (snake_case) ─────────────────────────────────────────── */

interface SellerStatusDto {
  current_step?: string
  completed_steps?: number
  total_steps?: number
  progress_percentage?: number
  verification_status?: string
  verified?: boolean
}

interface SellerProfileDto {
  id?: string
  full_name?: string
  phone?: string
  email?: string
  address?: string
  verification_status?: string
  created_at?: string | null
  updated_at?: string | null
}

interface EmailStatusDto {
  status?: string
  verified?: boolean
  email?: string
  verified_at?: string | null
}

interface PassportStatusDto {
  status?: string
  full_name?: string | null
  passport_number?: string | null
  verified_at?: string | null
  reject_reason?: string | null
}

interface PassportStartDto {
  success?: boolean
  redirect_url?: string | null
}

interface InnStatusDto {
  status?: string
  verified?: boolean
  inn?: string
  company_name?: string
  owner_name?: string
  checked_at?: string | null
}

interface BankAccountDto {
  id?: string
  card_holder?: string
  card_number?: string
  account_number?: string
  bank_name?: string
  bank_code?: string
  verified?: boolean
  is_primary?: boolean
  updated_at?: string | null
}

interface CompanyDto {
  id?: string
  company_name?: string
  director_name?: string
  inn?: string
  registration_number?: string
  legal_address?: string
  business_type?: string
  verified?: boolean
  updated_at?: string | null
}

interface CertificateDto {
  id?: string
  file_name?: string
  original_name?: string
  mime_type?: string
  file_size?: number
  document_type?: string
  verified?: boolean
  uploaded_at?: string | null
}

/* ── Mappers — normalize loose backend strings into closed unions ──────── */

const VERIFICATION_STATUSES: readonly VerificationStatus[] = [
  'unverified', 'pending', 'processing', 'verified', 'approved', 'rejected',
]

function toVerificationStatus(value: string | undefined): VerificationStatus {
  const v = (value ?? '').toLowerCase()
  return (VERIFICATION_STATUSES as readonly string[]).includes(v)
    ? (v as VerificationStatus)
    : 'unverified'
}

function toServerStep(value: string | undefined): ServerStep {
  return (SERVER_STEP_ORDER as readonly string[]).includes(value ?? '')
    ? (value as ServerStep)
    : 'personal_info'
}

function toEmailStatus(dto: EmailStatusDto): EmailVerificationStatus {
  if (dto.verified || dto.status === 'verified') return 'verified'
  return dto.status === 'otp_sent' ? 'otp_sent' : 'idle'
}

function toPassportStatus(dto: PassportStatusDto): PassportVerificationStatus {
  const v = (dto.status ?? '').toLowerCase()
  if (v === 'verified' || v === 'pending' || v === 'processing' || v === 'rejected') return v
  return 'idle'
}

function toInnStatus(dto: InnStatusDto): InnVerificationStatus {
  if (dto.verified || dto.status === 'verified') return 'verified'
  return dto.status === 'rejected' ? 'rejected' : 'idle'
}

const CERTIFICATE_TYPES: readonly CertificateType[] = [
  'commercial_license', 'vat_registration', 'articles_of_association', 'other',
]

function toCertificateType(value: string | undefined): CertificateType {
  return (CERTIFICATE_TYPES as readonly string[]).includes(value ?? '')
    ? (value as CertificateType)
    : 'other'
}

function mapStatus(dto: SellerStatusDto): SellerStatus {
  return {
    currentStep: toServerStep(dto.current_step),
    completedSteps: dto.completed_steps ?? 0,
    totalSteps: dto.total_steps ?? SERVER_STEP_ORDER.length - 1,
    progressPercentage: dto.progress_percentage ?? 0,
    verificationStatus: toVerificationStatus(dto.verification_status),
    verified: dto.verified ?? false,
  }
}

function mapProfile(dto: SellerProfileDto): SellerProfile {
  return {
    id: dto.id ?? '',
    fullName: dto.full_name ?? '',
    phone: dto.phone ?? '',
    email: dto.email ?? '',
    address: dto.address ?? '',
    verificationStatus: toVerificationStatus(dto.verification_status),
    createdAt: dto.created_at ?? null,
    updatedAt: dto.updated_at ?? null,
  }
}

function mapBank(dto: BankAccountDto): BankAccount | null {
  if (!dto.id) return null
  return {
    id: dto.id,
    cardHolder: dto.card_holder ?? '',
    cardNumber: dto.card_number ?? '',
    accountNumber: dto.account_number ?? '',
    bankName: dto.bank_name ?? '',
    bankCode: dto.bank_code ?? '',
    verified: dto.verified ?? false,
    isPrimary: dto.is_primary ?? false,
    updatedAt: dto.updated_at ?? null,
  }
}

function mapCompany(dto: CompanyDto): Company | null {
  if (!dto.id) return null
  const business = dto.business_type ?? 'other'
  return {
    id: dto.id,
    companyName: dto.company_name ?? '',
    directorName: dto.director_name ?? '',
    inn: dto.inn ?? '',
    registrationNumber: dto.registration_number ?? '',
    legalAddress: dto.legal_address ?? '',
    businessType: business === 'llc' || business === 'ie' || business === 'jsc' ? business : 'other',
    verified: dto.verified ?? false,
    updatedAt: dto.updated_at ?? null,
  }
}

function mapCertificate(dto: CertificateDto): Certificate {
  return {
    id: dto.id ?? '',
    fileName: dto.original_name ?? dto.file_name ?? '',
    mimeType: dto.mime_type ?? '',
    fileSize: dto.file_size ?? 0,
    documentType: toCertificateType(dto.document_type),
    verified: dto.verified ?? false,
    uploadedAt: dto.uploaded_at ?? null,
  }
}

/* ── API functions ─────────────────────────────────────────────────────── */

export async function getSellerStatus(): Promise<SellerStatus> {
  const { data } = await apiClient.get<SellerStatusDto>(PATHS.status)
  return mapStatus(data)
}

export async function getSellerProfile(): Promise<SellerProfile> {
  const { data } = await apiClient.get<SellerProfileDto>(PATHS.profile)
  return mapProfile(data)
}

export async function updateSellerProfile(payload: UpdateProfilePayload): Promise<SellerProfile> {
  const { data } = await apiClient.put<SellerProfileDto>(PATHS.profile, {
    full_name: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    address: payload.address,
  })
  return mapProfile(data)
}

export async function getEmailVerification(): Promise<EmailVerification> {
  const { data } = await apiClient.get<EmailStatusDto>(PATHS.emailStatus)
  return { status: toEmailStatus(data), email: data.email ?? '', verifiedAt: data.verified_at ?? null }
}

export async function sendEmailOtp(email: string): Promise<void> {
  await apiClient.post(PATHS.emailSend, { email })
}

export async function verifyEmailOtp(email: string, code: string): Promise<void> {
  await apiClient.post(PATHS.emailVerify, { email, code })
}

export async function getPassportVerification(): Promise<PassportVerification> {
  const { data } = await apiClient.get<PassportStatusDto>(PATHS.passportStatus)
  return {
    status: toPassportStatus(data),
    fullName: data.full_name ?? null,
    passportNumber: data.passport_number ?? null,
    verifiedAt: data.verified_at ?? null,
    rejectReason: data.reject_reason ?? null,
  }
}

export async function startPassportVerification(passportNumber: string): Promise<PassportSession> {
  const { data } = await apiClient.post<PassportStartDto>(PATHS.passportStart, {
    passport_number: passportNumber,
  })
  return { success: data.success ?? false, redirectUrl: data.redirect_url ?? null }
}

export async function getInnVerification(): Promise<InnVerification> {
  const { data } = await apiClient.get<InnStatusDto>(PATHS.innStatus)
  return {
    status: toInnStatus(data),
    inn: data.inn ?? '',
    companyName: data.company_name ?? '',
    ownerName: data.owner_name ?? '',
    checkedAt: data.checked_at ?? null,
  }
}

export async function verifyInn(inn: string): Promise<InnVerification> {
  const { data } = await apiClient.post<InnStatusDto>(PATHS.innVerify, { inn })
  return {
    status: toInnStatus(data),
    inn: data.inn ?? inn,
    companyName: data.company_name ?? '',
    ownerName: data.owner_name ?? '',
    checkedAt: data.checked_at ?? null,
  }
}

export async function getBankAccount(): Promise<BankAccount | null> {
  const { data } = await apiClient.get<BankAccountDto>(PATHS.bank)
  return mapBank(data)
}

export async function saveBankAccount(payload: SaveBankAccountPayload): Promise<BankAccount | null> {
  const { data } = await apiClient.put<BankAccountDto>(PATHS.bank, {
    card_holder: payload.cardHolder,
    card_number: payload.cardNumber,
    account_number: payload.accountNumber,
    bank_name: payload.bankName,
    bank_code: payload.bankCode,
  })
  return mapBank(data)
}

export async function getCompany(): Promise<Company | null> {
  const { data } = await apiClient.get<CompanyDto>(PATHS.company)
  return mapCompany(data)
}

export async function saveCompany(payload: SaveCompanyPayload): Promise<Company | null> {
  const { data } = await apiClient.put<CompanyDto>(PATHS.company, {
    company_name: payload.companyName,
    director_name: payload.directorName,
    inn: payload.inn,
    registration_number: payload.registrationNumber,
    legal_address: payload.legalAddress,
    business_type: payload.businessType,
  })
  return mapCompany(data)
}

export async function getCertificates(): Promise<Certificate[]> {
  const { data } = await apiClient.get<CertificateDto[]>(PATHS.certificates)
  return (Array.isArray(data) ? data : []).map(mapCertificate)
}

export async function uploadCertificate(payload: UploadCertificatePayload): Promise<Certificate> {
  const form = new FormData()
  form.append('file', payload.file)
  form.append('document_type', payload.documentType)
  const { data } = await apiClient.post<CertificateDto>(PATHS.certificates, form)
  return mapCertificate(data)
}

export async function deleteCertificate(id: string): Promise<void> {
  await apiClient.delete(PATHS.certificate(id))
}
