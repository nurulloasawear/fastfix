/**
 * ============================================================================
 * Certificate Queries
 * ============================================================================
 *
 * React Query hooks for Seller Certificates.
 *
 * Mas'uliyati:
 *
 *  - Certificate List
 *  - Upload Certificate
 *  - Delete Certificate
 *  - Download Certificate
 *  - Cache Management
 *
 * ============================================================================
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getCertificates,
  uploadCertificate,
  deleteCertificate,
  downloadCertificate,
} from '../api/certificate.api'

import type {
  SellerCertificate,
  UploadCertificatePayload,
} from '../types/seller-verification.types'

import { sellerKeys } from './seller.query-keys'

/* ============================================================================
 * GET CERTIFICATES
 * ============================================================================
 */

/**
 * GET /seller/certificates
 *
 * Seller yuklagan barcha hujjatlar.
 */
export function useCertificates() {
  return useQuery({
    queryKey: sellerKeys.certificates(),

    queryFn: getCertificates,

    refetchOnWindowFocus: true,
  })
}

/* ============================================================================
 * UPLOAD CERTIFICATE
 * ============================================================================
 */

/**
 * POST /seller/certificates
 */
export function useUploadCertificate() {
  const qc = useQueryClient()

  return useMutation<
    SellerCertificate,
    Error,
    UploadCertificatePayload
  >({
    mutationFn: uploadCertificate,

    /**
     * Upload muvaffaqiyatli tugagach
     * certificate list va seller status
     * yangilanadi.
     */
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: sellerKeys.certificates(),
      })

      qc.invalidateQueries({
        queryKey: sellerKeys.status(),
      })
    },
  })
}

/* ============================================================================
 * DELETE CERTIFICATE
 * ============================================================================
 */

/**
 * DELETE /seller/certificates/{id}
 */
export function useDeleteCertificate() {
  const qc = useQueryClient()

  return useMutation<
    void,
    Error,
    string
  >({
    mutationFn: deleteCertificate,

    onSuccess: () => {
      /**
       * Certificate list qayta olinadi.
       */
      qc.invalidateQueries({
        queryKey: sellerKeys.certificates(),
      })

      /**
       * Verification progress
       * o'zgarishi mumkin.
       */
      qc.invalidateQueries({
        queryKey: sellerKeys.status(),
      })
    },
  })
}

/* ============================================================================
 * DOWNLOAD CERTIFICATE
 * ============================================================================
 */

/**
 * GET /seller/certificates/{id}/download
 *
 * File yuklab olish.
 */
export function useDownloadCertificate() {
  return useMutation<
    Blob,
    Error,
    string
  >({
    mutationFn: downloadCertificate,
  })
}

/* ============================================================================
 * REFRESH CERTIFICATES
 * ============================================================================
 */

/**
 * Certificate listni
 * qo'lda yangilash.
 *
 * const refresh = useRefreshCertificates()
 *
 * await refresh()
 */
export function useRefreshCertificates() {
  const qc = useQueryClient()

  return () =>
    qc.invalidateQueries({
      queryKey: sellerKeys.certificates(),
    })
}

/* ============================================================================
 * UPDATE CACHE
 * ============================================================================
 */

/**
 * Cache ni qo'lda update qilish.
 *
 * Optimistic Update uchun.
 */
export function useSetCertificates() {
  const qc = useQueryClient()

  return (
    certificates: SellerCertificate[],
  ) =>
    qc.setQueryData(
      sellerKeys.certificates(),
      certificates,
    )
}

/* ============================================================================
 * CLEAR CACHE
 * ============================================================================
 */

/**
 * Logout vaqtida
 * certificate cache tozalanadi.
 */
export function useClearCertificatesCache() {
  const qc = useQueryClient()

  return () =>
    qc.removeQueries({
      queryKey: sellerKeys.certificates(),
    })
}