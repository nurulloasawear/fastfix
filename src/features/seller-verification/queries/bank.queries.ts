/**
 * ============================================================================
 * Bank Account Queries
 * ============================================================================
 *
 * React Query hooks for Seller Bank Account.
 *
 * Mas'uliyati:
 *
 *  - Bank Account olish
 *  - Bank Account yaratish
 *  - Bank Account yangilash
 *  - Bank Account o'chirish
 *  - Cache management
 *
 * ============================================================================
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getBankAccount,
  saveBankAccount,
  updateBankAccount,
  deleteBankAccount,
} from '../api/bank.api'

import type {
  SellerBankAccount,
  SaveBankAccountPayload,
  UpdateBankAccountPayload,
} from '../types/seller-verification.types'

import { sellerKeys } from './seller.query-keys'

/* ============================================================================
 * GET BANK ACCOUNT
 * ============================================================================
 */

/**
 * GET /seller/bank
 *
 * Sellerning bank ma'lumotlarini olish.
 */
export function useBankAccount() {
  return useQuery({
    queryKey: sellerKeys.bank(),

    queryFn: getBankAccount,

    /**
     * User tabga qaytsa
     * ma'lumot qayta tekshiriladi.
     */
    refetchOnWindowFocus: true,
  })
}

/* ============================================================================
 * CREATE BANK ACCOUNT
 * ============================================================================
 */

/**
 * POST /seller/bank
 */
export function useCreateBankAccount() {
  const qc = useQueryClient()

  return useMutation<
    SellerBankAccount,
    Error,
    SaveBankAccountPayload
  >({
    mutationFn: saveBankAccount,

    onSuccess: (data) => {
      /**
       * Cache ni darhol yangilaymiz.
       */
      qc.setQueryData(
        sellerKeys.bank(),
        data,
      )
    },
  })
}

/* ============================================================================
 * UPDATE BANK ACCOUNT
 * ============================================================================
 */

/**
 * PUT /seller/bank
 */
export function useUpdateBankAccount() {
  const qc = useQueryClient()

  return useMutation<
    SellerBankAccount,
    Error,
    UpdateBankAccountPayload
  >({
    mutationFn: updateBankAccount,

    onSuccess: (data) => {
      qc.setQueryData(
        sellerKeys.bank(),
        data,
      )
    },
  })
}

/* ============================================================================
 * DELETE BANK ACCOUNT
 * ============================================================================
 */

/**
 * DELETE /seller/bank
 */
export function useDeleteBankAccount() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteBankAccount,

    onSuccess: () => {
      /**
       * Cache tozalanadi.
       */
      qc.removeQueries({
        queryKey: sellerKeys.bank(),
      })
    },
  })
}

/* ============================================================================
 * REFRESH BANK ACCOUNT
 * ============================================================================
 */

/**
 * Bank ma'lumotlarini qo'lda yangilash.
 *
 * const refresh = useRefreshBankAccount()
 *
 * await refresh()
 */
export function useRefreshBankAccount() {
  const qc = useQueryClient()

  return () =>
    qc.invalidateQueries({
      queryKey: sellerKeys.bank(),
    })
}

/* ============================================================================
 * UPDATE CACHE
 * ============================================================================
 */

/**
 * Cache ni qo'lda yangilash.
 *
 * Optimistic Update uchun.
 */
export function useSetBankAccount() {
  const qc = useQueryClient()

  return (
    bank: SellerBankAccount,
  ) =>
    qc.setQueryData(
      sellerKeys.bank(),
      bank,
    )
}

/* ============================================================================
 * CLEAR CACHE
 * ============================================================================
 */

/**
 * Logout vaqtida
 * Bank Account cache tozalanadi.
 */
export function useClearBankAccountCache() {
  const qc = useQueryClient()

  return () =>
    qc.removeQueries({
      queryKey: sellerKeys.bank(),
    })
}