/**
 * ============================================================================
 * Passport Verification API (MyID)
 * ============================================================================
 */

import { apiClient } from '@/lib/axios'

import type {
  PassportVerificationState,
  PassportVerificationSession,
  StartPassportVerificationPayload,
} from '../types/seller-verification.types'

/* ============================================================================
 * API PATHS
 * ============================================================================
 */

const PATHS = {
  start: '/seller/passport/start',

  status: '/seller/passport/status',
} as const

/* ============================================================================
 * DTO
 * ============================================================================
 */

interface PassportVerificationSessionDto {
  session_id: string

  redirect_url: string

  expires_at: string
}

interface PassportVerificationStatusDto {
  verified: boolean

  status: string

  full_name: string | null

  passport_number: string | null

  verified_at: string | null

  reject_reason: string | null
}

/* ============================================================================
 * Mapper
 * ============================================================================
 */

function mapPassportSession(
  dto: PassportVerificationSessionDto,
): PassportVerificationSession {
  return {
    sessionId: dto.session_id,

    redirectUrl: dto.redirect_url,

    expiresAt: dto.expires_at,
  }
}

function mapPassportStatus(
  dto: PassportVerificationStatusDto,
): PassportVerificationState {
  return {
    verified: dto.verified,

    status:
      dto.status as PassportVerificationState['status'],

    fullName: dto.full_name,

    passportNumber: dto.passport_number,

    verifiedAt: dto.verified_at,

    rejectReason: dto.reject_reason,
  }
}

/* ============================================================================
 * API
 * ============================================================================
 */

export async function startPassportVerification(
  payload: StartPassportVerificationPayload,
): Promise<PassportVerificationSession> {
  const { data } =
    await apiClient.post<PassportVerificationSessionDto>(
      PATHS.start,
      {
        passport_number: payload.passportNumber,
      },
    )

  return mapPassportSession(data)
}

export async function getPassportVerificationStatus(): Promise<PassportVerificationState> {
  const { data } =
    await apiClient.get<PassportVerificationStatusDto>(
      PATHS.status,
    )

  return mapPassportStatus(data)
}