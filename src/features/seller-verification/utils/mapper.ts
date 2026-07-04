
/**
 * ============================================================================
 * Seller Verification Mappers
 * ============================================================================
 *
 * Purpose:
 * API DTO (snake_case)
 *          ↓
 * Frontend Model (camelCase)
 *
 * NOTE:
 * Hozircha barcha mapperlar umumiy joyda saqlanadi.
 * Keyinchalik kattalashsa mapperlarni alohida fayllarga ajratish mumkin.
 *
 * ============================================================================
 */

import type {
  SellerProfile,
  SellerStatus,
} from '../types/seller-verification.types'

/* ============================================================================
 * DTO
 * ============================================================================
 */

interface SellerProfileDto {
  id: string

  full_name: string

  phone: string

  email: string

  address: string

  verification_status: SellerProfile['verificationStatus']

  created_at: string

  updated_at: string
}

interface SellerStatusDto {
  completed_steps: number

  total_steps: number

  progress_percentage: number

  current_step: SellerStatus['currentStep']

  verification_status: SellerStatus['verificationStatus']

  verified: boolean
}

/* ============================================================================
 * SELLER PROFILE
 * ============================================================================
 */

export function mapSellerProfile(
  dto: SellerProfileDto,
): SellerProfile {
  return {
    id: dto.id,

    fullName: dto.full_name,

    phone: dto.phone,

    email: dto.email,

    address: dto.address,

    verificationStatus: dto.verification_status,

    createdAt: dto.created_at,

    updatedAt: dto.updated_at,
  }
}

/* ============================================================================
 * SELLER STATUS
 * ============================================================================
 */

export function mapSellerStatus(
  dto: SellerStatusDto,
): SellerStatus {
  return {
    completedSteps: dto.completed_steps,

    totalSteps: dto.total_steps,

    progressPercentage: dto.progress_percentage,

    currentStep: dto.current_step,

    verificationStatus: dto.verification_status,

    verified: dto.verified,
  }
}

/* ============================================================================
 * DATE
 * ============================================================================
 */

export function toIsoDate(
  value: string | Date,
): string {
  if (value instanceof Date) {
    return value.toISOString()
  }

  return new Date(value).toISOString()
}

/* ============================================================================
 * EMPTY VALUE
 * ============================================================================
 */

export function emptyToNull(
  value?: string | null,
): string | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim()

  return trimmed.length === 0 ? null : trimmed
}

/* ============================================================================
 * BOOLEAN
 * ============================================================================
 */

export function toBoolean(
  value: unknown,
): boolean {
  return Boolean(value)
}