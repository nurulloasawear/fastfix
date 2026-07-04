/**
 * ============================================================================
 * Company API
 * ============================================================================
 */

import { apiClient } from '@/lib/axios'

import type {
  SellerCompany,
  SaveCompanyPayload,
  UpdateCompanyPayload,
} from '../types/seller-verification.types'

const PATHS = {
  company: '/seller/company',
} as const

/* ============================================================================
 * DTO
 * ============================================================================
 */

interface SellerCompanyDto {
  id: string

  company_name: string

  director_name: string

  inn: string

  registration_number: string

  legal_address: string

  business_type: SellerCompany['businessType']

  verified: boolean

  created_at: string

  updated_at: string
}

interface SaveCompanyDto {
  company_name: string

  director_name: string

  inn: string

  registration_number: string

  legal_address: string

  business_type: SellerCompany['businessType']
}

/* ============================================================================
 * Mapper
 * ============================================================================
 */

function mapCompany(
  dto: SellerCompanyDto,
): SellerCompany {
  return {
    id: dto.id,

    companyName: dto.company_name,

    directorName: dto.director_name,

    inn: dto.inn,

    registrationNumber: dto.registration_number,

    legalAddress: dto.legal_address,

    businessType: dto.business_type,

    verified: dto.verified,

    createdAt: dto.created_at,

    updatedAt: dto.updated_at,
  }
}

/* ============================================================================
 * GET
 * ============================================================================
 */

export async function getCompany(): Promise<SellerCompany> {
  const { data } =
    await apiClient.get<SellerCompanyDto>(
      PATHS.company,
    )

  return mapCompany(data)
}

/* ============================================================================
 * CREATE
 * ============================================================================
 */

export async function saveCompany(
  payload: SaveCompanyPayload,
): Promise<SellerCompany> {
  const body: SaveCompanyDto = {
    company_name: payload.companyName,

    director_name: payload.directorName,

    inn: payload.inn,

    registration_number: payload.registrationNumber,

    legal_address: payload.legalAddress,

    business_type: payload.businessType,
  }

  const { data } =
    await apiClient.post<SellerCompanyDto>(
      PATHS.company,
      body,
    )

  return mapCompany(data)
}

/* ============================================================================
 * UPDATE
 * ============================================================================
 */

export async function updateCompany(
  payload: UpdateCompanyPayload,
): Promise<SellerCompany> {
  const body: Partial<SaveCompanyDto> = {}

  if (payload.companyName !== undefined) {
    body.company_name = payload.companyName
  }

  if (payload.directorName !== undefined) {
    body.director_name = payload.directorName
  }

  if (payload.inn !== undefined) {
    body.inn = payload.inn
  }

  if (payload.registrationNumber !== undefined) {
    body.registration_number = payload.registrationNumber
  }

  if (payload.legalAddress !== undefined) {
    body.legal_address = payload.legalAddress
  }

  if (payload.businessType !== undefined) {
    body.business_type = payload.businessType
  }

  const { data } =
    await apiClient.put<SellerCompanyDto>(
      PATHS.company,
      body,
    )

  return mapCompany(data)
}

/* ============================================================================
 * DELETE
 * ============================================================================
 */

export async function deleteCompany(): Promise<void> {
  await apiClient.delete(PATHS.company)
}