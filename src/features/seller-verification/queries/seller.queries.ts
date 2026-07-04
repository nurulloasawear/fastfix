/**
 * ============================================================================
 * Seller Verification Queries
 * ============================================================================
 *
 * React Query hooks for Seller Verification.
 *
 * Ushbu fayl faqat:
 *
 *  - Seller Profile
 *  - Seller Status
 *
 * bilan ishlaydi.
 *
 * Email, Passport, INN, Bank ...
 * alohida query fayllarda yoziladi.
 * ============================================================================
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getSellerProfile,
  getSellerStatus,
  updateSellerProfile,
} from '../api/seller-verification.api'

import type {
  SellerProfileUpdate,
} from '../types/seller-verification.types'

import { sellerKeys } from './seller.query-keys'

export { sellerKeys } from './seller.query-keys'

/* ============================================================================
 * Profile
 * ============================================================================
 */

/**
 * GET /seller/profile
 */
export function useSellerProfile() {
  return useQuery({
    queryKey: sellerKeys.profile(),

    queryFn: getSellerProfile,
  })
}

/**
 * PUT /seller/profile
 */
export function useUpdateSellerProfile() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: SellerProfileUpdate) =>
      updateSellerProfile(payload),

    /**
     * Profile update bo'lgandan keyin
     * cache ni yangilaymiz.
     */
    onSuccess: (data) =>
      qc.setQueryData(
        sellerKeys.profile(),
        data,
      ),
  })
}

/* ============================================================================
 * Seller Verification Status
 * ============================================================================
 */

/**
 * GET /seller/status
 */
export function useSellerStatus() {
  return useQuery({
    queryKey: sellerKeys.status(),

    queryFn: getSellerStatus,

    /**
     * Verification status tez-tez
     * o'zgarishi mumkin.
     *
     * Shu sabab polling yoqilgan.
     */
    refetchInterval: 5000,

    /**
     * User tabga qaytsa
     * status yana tekshiriladi.
     */
    refetchOnWindowFocus: true,
  })
}

/* ============================================================================
 * Helpers
 * ============================================================================
 */

/**
 * Seller verification cache ni
 * tozalash.
 *
 * Logout vaqtida ishlatiladi.
 */
export function useInvalidateSellerVerification() {
  const qc = useQueryClient()

  return () =>
    qc.invalidateQueries({
      queryKey: sellerKeys.all,
    })
}

/**
 * Seller verification cache ni
 * to'liq remove qilish.
 *
 * Logout uchun foydali.
 */
export function useClearSellerVerificationCache() {
  const qc = useQueryClient()

  return () =>
    qc.removeQueries({
      queryKey: sellerKeys.all,
    })
}