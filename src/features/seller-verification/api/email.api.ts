/**
 * ============================================================================
 * Email Verification API
 * ============================================================================
 */

import { apiClient } from '@/lib/axios'

import type {
  EmailVerificationState,
  EmailVerificationResponse,
  SendVerificationEmailPayload,
  VerifyEmailOtpPayload,
} from '../types/seller-verification.types'

const PATHS = {
  sendCode: '/seller/email/send-code',

  verify: '/seller/email/verify',

  status: '/seller/email/status',
} as const

/* ============================================================================
 * DTO
 * ============================================================================
 */

interface EmailStatusDto {
  verified: boolean

  email: string

  verified_at: string | null

  status: string
}

interface VerifyEmailResponseDto {
  verified: boolean

  message: string
}

/* ============================================================================
 * Mapper
 * ============================================================================
 */

function mapEmailStatus(
  dto: EmailStatusDto,
): EmailVerificationState {
  return {
    verified: dto.verified,

    email: dto.email,

    status: dto.status as EmailVerificationState['status'],

    verifiedAt: dto.verified_at,
  }
}

function mapVerifyResponse(
  dto: VerifyEmailResponseDto,
): EmailVerificationResponse {
  return {
    verified: dto.verified,

    message: dto.message,
  }
}

/* ============================================================================
 * SEND EMAIL
 * ============================================================================
 */

export async function sendVerificationEmail(
  payload: SendVerificationEmailPayload,
): Promise<void> {
  await apiClient.post(PATHS.sendCode, {
    email: payload.email,
  })
}

/* ============================================================================
 * VERIFY OTP
 * ============================================================================
 */

export async function verifyEmailOtp(
  payload: VerifyEmailOtpPayload,
): Promise<EmailVerificationResponse> {
  const { data } =
    await apiClient.post<VerifyEmailResponseDto>(
      PATHS.verify,
      {
        email: payload.email,

        code: payload.code,
      },
    )

  return mapVerifyResponse(data)
}

/* ============================================================================
 * GET STATUS
 * ============================================================================
 */

export async function getEmailVerificationStatus(): Promise<EmailVerificationState> {
  const { data } =
    await apiClient.get<EmailStatusDto>(
      PATHS.status,
    )

  return mapEmailStatus(data)
}

/* ============================================================================
 * Backward Compatibility
 * ============================================================================
 */

export const sendEmailCode = sendVerificationEmail

export const verifyEmailCode = verifyEmailOtp