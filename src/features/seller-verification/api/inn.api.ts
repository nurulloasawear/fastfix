/**
 * ============================================================================
 * INN Verification API
 * ============================================================================
 */

import { apiClient } from '@/lib/axios'

import type {
  VerifyInnPayload,
  InnVerificationResponse,
  InnVerificationState,
} from '../types/seller-verification.types'

const PATHS = {
  verify: '/seller/inn/verify',

  status: '/seller/inn/status',
} as const

/* ============================================================================
 * DTO
 * ============================================================================
 */

interface InnVerificationResponseDto {
  verified: boolean

  company_name: string | null

  owner_name: string | null

  inn: string

  message: string
}

interface InnVerificationStatusDto {
  verified: boolean

  inn: string | null

  company_name: string | null

  owner_name: string | null

  checked_at: string | null

  status: string
}

/* ============================================================================
 * Mapper
 * ============================================================================
 */

function mapVerifyInnResponse(
  dto: InnVerificationResponseDto,
): InnVerificationResponse {
  return {
    verified: dto.verified,

    inn: dto.inn,

    companyName: dto.company_name,

    ownerName: dto.owner_name,

    message: dto.message,
  }
}

function mapInnStatus(
  dto: InnVerificationStatusDto,
): InnVerificationState {
  return {
    verified: dto.verified,

    inn: dto.inn,

    companyName: dto.company_name,

    ownerName: dto.owner_name,

    checkedAt: dto.checked_at,

    status:
      dto.status as InnVerificationState['status'],
  }
}

/* ============================================================================
 * VERIFY INN
 * ============================================================================
 */

export async function verifyInn(
  payload: VerifyInnPayload,
): Promise<InnVerificationResponse> {
  const { data } =
    await apiClient.post<InnVerificationResponseDto>(
      PATHS.verify,
      {
        inn: payload.inn,
      },
    )

  return mapVerifyInnResponse(data)
}

/* ============================================================================
 * GET INN STATUS
 * ============================================================================
 */

export async function getInnVerificationStatus(): Promise<InnVerificationState> {
  const { data } =
    await apiClient.get<InnVerificationStatusDto>(
      PATHS.status,
    )

  return mapInnStatus(data)
}