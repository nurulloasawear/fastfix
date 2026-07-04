/**
 * ============================================================================
 * Bank API
 * ============================================================================
 */

import { apiClient } from '@/lib/axios'

import type {
  SellerBankAccount,
  SaveBankAccountPayload,
  UpdateBankAccountPayload,
} from '../types/seller-verification.types'

const PATHS = {
  bank: '/seller/bank',
} as const

/* ============================================================================
 * DTO
 * ============================================================================
 */

interface SellerBankAccountDto {
  id: string

  card_holder: string

  card_number: string

  account_number: string | null

  bank_name: string

  bank_code: string | null

  account_type: SellerBankAccount['accountType']

  verified: boolean

  is_primary: boolean

  created_at: string

  updated_at: string
}

interface SaveBankAccountDto {
  card_holder: string

  card_number: string

  account_number?: string

  bank_name: string

  bank_code?: string

  account_type?: SellerBankAccount['accountType']
}

/* ============================================================================
 * Mapper
 * ============================================================================
 */

function mapBankAccount(
  dto: SellerBankAccountDto,
): SellerBankAccount {
  return {
    id: dto.id,

    cardHolder: dto.card_holder,

    cardNumber: dto.card_number,

    accountNumber: dto.account_number,

    bankName: dto.bank_name,

    bankCode: dto.bank_code,

    accountType: dto.account_type,

    verified: dto.verified,

    isPrimary: dto.is_primary,

    createdAt: dto.created_at,

    updatedAt: dto.updated_at,
  }
}

/* ============================================================================
 * GET
 * ============================================================================
 */

export async function getBankAccount(): Promise<SellerBankAccount> {
  const { data } =
    await apiClient.get<SellerBankAccountDto>(
      PATHS.bank,
    )

  return mapBankAccount(data)
}

/* ============================================================================
 * SAVE
 * ============================================================================
 */

export async function saveBankAccount(
  payload: SaveBankAccountPayload,
): Promise<SellerBankAccount> {
  const body: SaveBankAccountDto = {
    card_holder: payload.cardHolder,

    card_number: payload.cardNumber,

    account_number: payload.accountNumber,

    bank_name: payload.bankName,

    bank_code: payload.bankCode,

    account_type: payload.accountType,
  }

  await apiClient.post(PATHS.bank, body)

  return getBankAccount()
}

/* ============================================================================
 * UPDATE
 * ============================================================================
 */

export async function updateBankAccount(
  payload: UpdateBankAccountPayload,
): Promise<SellerBankAccount> {
  const body: Partial<SaveBankAccountDto> = {}

  if (payload.cardHolder !== undefined) {
    body.card_holder = payload.cardHolder
  }

  if (payload.cardNumber !== undefined) {
    body.card_number = payload.cardNumber
  }

  if (payload.accountNumber !== undefined) {
    body.account_number = payload.accountNumber
  }

  if (payload.bankName !== undefined) {
    body.bank_name = payload.bankName
  }

  if (payload.bankCode !== undefined) {
    body.bank_code = payload.bankCode
  }

  if (payload.accountType !== undefined) {
    body.account_type = payload.accountType
  }

  await apiClient.put(PATHS.bank, body)

  return getBankAccount()
}

/* ============================================================================
 * DELETE
 * ============================================================================
 */

export async function deleteBankAccount(): Promise<void> {
  await apiClient.delete(PATHS.bank)
}