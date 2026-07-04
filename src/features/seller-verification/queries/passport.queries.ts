/**
 * ============================================================================
 * Passport Verification Queries
 * ============================================================================
 *
 * React Query hooks for MyID Passport Verification.
 *
 * Vazifalari:
 *
 *  - Passport verification boshlash
 *  - Passport verification status olish
 *  - Cache boshqarish
 *
 * ============================================================================
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  startPassportVerification,
  getPassportVerificationStatus,
} from '../api/passport.api'

import type {
  PassportVerificationSession,
  PassportVerificationState,
  StartPassportVerificationPayload,
} from '../types/seller-verification.types'

import { sellerKeys } from './seller.query-keys'

/* ============================================================================
 * Passport Status
 * ============================================================================
 */

/**
 * GET /seller/passport/status
 */
export function usePassportVerificationStatus() {
  return useQuery({
    queryKey: sellerKeys.passport(),

    queryFn: getPassportVerificationStatus,

    /**
     * MyID verification webhook ishlashi mumkin.
     * Shu sabab status har 5 sekundda yangilanadi.
     */
    refetchInterval: 5000,

    /**
     * User browser tabiga qaytsa
     * status yana tekshiriladi.
     */
    refetchOnWindowFocus: true,
  })
}

/* ============================================================================
 * Start Passport Verification
 * ============================================================================
 */

/**
 * POST /seller/passport/start
 */
export function useStartPassportVerification() {
  const qc = useQueryClient()

  return useMutation<
    PassportVerificationSession,
    Error,
    StartPassportVerificationPayload
  >({
    mutationFn: startPassportVerification,

    /**
     * Verification boshlangandan keyin
     * status cache yangilanadi.
     */
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: sellerKeys.passport(),
      })
    },
  })
}

/* ============================================================================
 * Refresh Passport Status
 * ============================================================================
 */

/**
 * Statusni qo'lda yangilash.
 *
 * Masalan:
 *
 * const refresh = useRefreshPassportStatus()
 *
 * await refresh()
 */
export function useRefreshPassportStatus() {
  const qc = useQueryClient()

  return () =>
    qc.invalidateQueries({
      queryKey: sellerKeys.passport(),
    })
}

/* ============================================================================
 * Update Passport Cache
 * ============================================================================
 */

/**
 * Ba'zi hollarda backend webhook orqali
 * verified holatini qaytaradi.
 *
 * UI refresh qilmasdan cache yangilanadi.
 */
export function useSetPassportStatus() {
  const qc = useQueryClient()

  return (
    status: PassportVerificationState,
  ) =>
    qc.setQueryData(
      sellerKeys.passport(),
      status,
    )
}

/* ============================================================================
 * Clear Passport Cache
 * ============================================================================
 */

/**
 * Logout vaqtida passport cache ni tozalaydi.
 */
export function useClearPassportCache() {
  const qc = useQueryClient()

  return () =>
    qc.removeQueries({
      queryKey: sellerKeys.passport(),
    })
}