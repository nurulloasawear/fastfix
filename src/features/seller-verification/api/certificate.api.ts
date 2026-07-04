/**
 * ============================================================================
 * Certificate API
 * ============================================================================
 *
 * Seller verification hujjatlari.
 *
 * Backend:
 * multipart/form-data
 */

import { apiClient } from '@/lib/axios'

import type {
  SellerCertificate,
  UploadCertificatePayload,
} from '../types/seller-verification.types'

const PATHS = {
  certificates: '/seller/certificates',
} as const

/* ============================================================================
 * DTO
 * ============================================================================
 */

interface SellerCertificateDto {
  id: string

  file_name: string

  original_name: string

  mime_type: string

  file_size: number

  document_type: string

  verified: boolean

  uploaded_at: string

  download_url: string
}

/* ============================================================================
 * Mapper
 * ============================================================================
 */

function mapCertificate(
  dto: SellerCertificateDto,
): SellerCertificate {
  return {
    id: dto.id,

    fileName: dto.file_name,

    originalName: dto.original_name,

    mimeType: dto.mime_type,

    fileSize: dto.file_size,

    documentType:
      dto.document_type as SellerCertificate['documentType'],

    verified: dto.verified,

    uploadedAt: dto.uploaded_at,

    downloadUrl: dto.download_url,
  }
}

/* ============================================================================
 * GET CERTIFICATES
 * ============================================================================
 */

export async function getCertificates(): Promise<SellerCertificate[]> {
  const { data } =
    await apiClient.get<SellerCertificateDto[]>(
      PATHS.certificates,
    )

  return data.map(mapCertificate)
}

/* ============================================================================
 * UPLOAD CERTIFICATE
 * ============================================================================
 */

export async function uploadCertificate(
  payload: UploadCertificatePayload,
): Promise<SellerCertificate> {
  const formData = new FormData()

  formData.append('file', payload.file)

  formData.append(
    'document_type',
    payload.documentType,
  )

  const { data } =
    await apiClient.post<SellerCertificateDto>(
      PATHS.certificates,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

  return mapCertificate(data)
}

/* ============================================================================
 * DELETE CERTIFICATE
 * ============================================================================
 */

export async function deleteCertificate(
  certificateId: string,
): Promise<void> {
  await apiClient.delete(
    `${PATHS.certificates}/${certificateId}`,
  )
}

/* ============================================================================
 * DOWNLOAD CERTIFICATE
 * ============================================================================
 */

export async function downloadCertificate(
  certificateId: string,
): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(
    `${PATHS.certificates}/${certificateId}/download`,
    {
      responseType: 'blob',
    },
  )

  return data
}