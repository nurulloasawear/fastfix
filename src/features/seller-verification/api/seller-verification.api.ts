/**
 * ============================================================================
 * Seller Verification API
 * ============================================================================
 */

import { apiClient } from '@/lib/axios'

import type {
  SellerProfile,
  SellerProfileUpdate,
  SellerStatus,
} from '../types/seller-verification.types'

const PATHS = {
  profile: '/seller/profile',

  status: '/seller/status',
} as const

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

  verification_status: string

  created_at: string

  updated_at: string
}

interface SellerStatusDto {
  completed_steps: number

  total_steps: number

  progress_percentage: number

  current_step: string

  verification_status: string

  verified: boolean
}

interface SellerProfileUpdateDto {
  full_name?: string

  phone?: string

  email?: string

  address?: string
}

/* ============================================================================
 * Mapper
 * ============================================================================
 */

function mapSellerProfile(dto: SellerProfileDto): SellerProfile {
  return {
    id: dto.id,

    fullName: dto.full_name,

    phone: dto.phone,

    email: dto.email,

    address: dto.address,

    verificationStatus:
      dto.verification_status as SellerProfile['verificationStatus'],

    createdAt: dto.created_at,

    updatedAt: dto.updated_at,
  }
}

function mapSellerStatus(dto: SellerStatusDto): SellerStatus {
  return {
    completedSteps: dto.completed_steps,

    totalSteps: dto.total_steps,

    progressPercentage: dto.progress_percentage,

    currentStep:
      dto.current_step as SellerStatus['currentStep'],

    verificationStatus:
      dto.verification_status as SellerStatus['verificationStatus'],

    verified: dto.verified,
  }
}

/* ============================================================================
 * API
 * ============================================================================
 */

export async function getSellerProfile(): Promise<SellerProfile> {
  const { data } = await apiClient.get<SellerProfileDto>(
    PATHS.profile,
  )

  return mapSellerProfile(data)
}

export async function updateSellerProfile(
  payload: SellerProfileUpdate,
): Promise<SellerProfile> {
  const body: SellerProfileUpdateDto = {
    full_name: payload.fullName,

    phone: payload.phone,

    email: payload.email,

    address: payload.address,
  }

  await apiClient.put(PATHS.profile, body)

  return getSellerProfile()
}

export async function getSellerStatus(): Promise<SellerStatus> {
  const { data } = await apiClient.get<SellerStatusDto>(
    PATHS.status,
  )

  return mapSellerStatus(data)
}