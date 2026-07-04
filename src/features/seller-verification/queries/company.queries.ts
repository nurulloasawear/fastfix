/**
 * ============================================================================
 * Company Queries
 * ============================================================================
 *
 * React Query hooks for Seller Company.
 *
 * Mas'uliyati:
 *
 *  - Company ma'lumotlarini olish
 *  - Company yaratish
 *  - Company yangilash
 *  - Company o'chirish
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
  getCompany,
  saveCompany,
  updateCompany,
  deleteCompany,
} from '../api/company.api'

import type {
  SellerCompany,
  SaveCompanyPayload,
  UpdateCompanyPayload,
} from '../types/seller-verification.types'

import { sellerKeys } from './seller.query-keys'

/* ============================================================================
 * GET COMPANY
 * ============================================================================
 */

/**
 * GET /seller/company
 *
 * Seller kompaniya ma'lumotlarini olish.
 */
export function useCompany() {
  return useQuery({
    queryKey: sellerKeys.company(),

    queryFn: getCompany,

    /**
     * Browser tabiga qaytganda
     * ma'lumot yangilanadi.
     */
    refetchOnWindowFocus: true,
  })
}

/* ============================================================================
 * CREATE COMPANY
 * ============================================================================
 */

/**
 * POST /seller/company
 */
export function useCreateCompany() {
  const qc = useQueryClient()

  return useMutation<
    SellerCompany,
    Error,
    SaveCompanyPayload
  >({
    mutationFn: saveCompany,

    onSuccess: (data) => {
      /**
       * Company cache yangilanadi.
       */
      qc.setQueryData(
        sellerKeys.company(),
        data,
      )

      /**
       * Seller verification status ham
       * o'zgarishi mumkin.
       */
      qc.invalidateQueries({
        queryKey: sellerKeys.status(),
      })
    },
  })
}

/* ============================================================================
 * UPDATE COMPANY
 * ============================================================================
 */

/**
 * PUT /seller/company
 */
export function useUpdateCompany() {
  const qc = useQueryClient()

  return useMutation<
    SellerCompany,
    Error,
    UpdateCompanyPayload
  >({
    mutationFn: updateCompany,

    onSuccess: (data) => {
      qc.setQueryData(
        sellerKeys.company(),
        data,
      )

      qc.invalidateQueries({
        queryKey: sellerKeys.status(),
      })
    },
  })
}

/* ============================================================================
 * DELETE COMPANY
 * ============================================================================
 */

/**
 * DELETE /seller/company
 */
export function useDeleteCompany() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteCompany,

    onSuccess: () => {
      /**
       * Company cache o'chiriladi.
       */
      qc.removeQueries({
        queryKey: sellerKeys.company(),
      })

      /**
       * Verification progress
       * qayta hisoblanadi.
       */
      qc.invalidateQueries({
        queryKey: sellerKeys.status(),
      })
    },
  })
}

/* ============================================================================
 * REFRESH COMPANY
 * ============================================================================
 */

/**
 * Company ma'lumotlarini
 * qo'lda yangilash.
 *
 * const refresh = useRefreshCompany()
 *
 * await refresh()
 */
export function useRefreshCompany() {
  const qc = useQueryClient()

  return () =>
    qc.invalidateQueries({
      queryKey: sellerKeys.company(),
    })
}

/* ============================================================================
 * UPDATE CACHE
 * ============================================================================
 */

/**
 * Optimistic Update yoki
 * websocket uchun.
 */
export function useSetCompany() {
  const qc = useQueryClient()

  return (
    company: SellerCompany,
  ) =>
    qc.setQueryData(
      sellerKeys.company(),
      company,
    )
}

/* ============================================================================
 * CLEAR CACHE
 * ============================================================================
 */

/**
 * Logout vaqtida
 * Company cache tozalanadi.
 */
export function useClearCompanyCache() {
  const qc = useQueryClient()

  return () =>
    qc.removeQueries({
      queryKey: sellerKeys.company(),
    })
}