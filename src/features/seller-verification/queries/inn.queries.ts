/**
 * ============================================================================
 * INN Verification Queries
 * ============================================================================
 *
 * React Query hooks for Seller INN (STIR) Verification.
 *
 * Mas'uliyati:
 *
 *  - STIR verification
 *  - STIR status
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
  verifyInn,
  getInnVerificationStatus,
} from '../api/inn.api'

import type {
  VerifyInnPayload,
  InnVerificationResponse,
  InnVerificationState,
} from '../types/seller-verification.types'

import { sellerKeys } from './seller.query-keys'

/* ============================================================================
 * GET INN STATUS
 * ============================================================================
 */

/**
 * GET /seller/inn/status
 *
 * Seller STIR holatini olish.
 */
export function useInnVerificationStatus() {
  return useQuery({
    queryKey: sellerKeys.inn(),

    queryFn: getInnVerificationStatus,

    /**
     * Status backend tomonidan
     * keyinchalik yangilanishi mumkin.
     */
    refetchOnWindowFocus: true,

    /**
     * Har 5 sekundda tekshirib turadi.
     */
    refetchInterval: 5000,
  })
}

/* ============================================================================
 * VERIFY INN
 * ============================================================================
 */

/**
 * POST /seller/inn/verify
 */
export function useVerifyInn() {
  const qc = useQueryClient()

  return useMutation<
    InnVerificationResponse,
    Error,
    VerifyInnPayload
  >({
    mutationFn: verifyInn,

    /**
     * Verification muvaffaqiyatli bo'lsa
     * status cache yangilanadi.
     */
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: sellerKeys.inn(),
      })
    },
  })
}

/* ============================================================================
 * REFRESH STATUS
 * ============================================================================
 */

/**
 * STIR statusni qo'lda yangilash.
 *
 * const refresh = useRefreshInnStatus()
 *
 * await refresh()
 */
export function useRefreshInnStatus() {
  const qc = useQueryClient()

  return () =>
    qc.invalidateQueries({
      queryKey: sellerKeys.inn(),
    })
}

/* ============================================================================
 * UPDATE CACHE
 * ============================================================================
 */

/**
 * Cache ni qo'lda update qilish.
 *
 * Optimistic update yoki
 * websocket uchun foydali.
 */
export function useSetInnStatus() {
  const qc = useQueryClient()

  return (
    status: InnVerificationState,
  ) =>
    qc.setQueryData(
      sellerKeys.inn(),
      status,
    )
}

/* ============================================================================
 * CLEAR CACHE
 * ============================================================================
 */

/**
 * Logout vaqtida
 * STIR cache ni tozalaydi.
 */
export function useClearInnCache() {
  const qc = useQueryClient()

  return () =>
    qc.removeQueries({
      queryKey: sellerKeys.inn(),
    })
}