import { useTranslation } from 'react-i18next'
import { FileText, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ApiError } from '@/lib/apiError'
import { tError } from '@/i18n'
import { useCertificates, useDeleteCertificate } from '../../api/seller-verification.queries'
import { StatusBadge } from '../StatusBadge'
import { CertificateUploader } from './CertificateUploader'

function formatFileSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${(bytes / 1024).toFixed(1)} KB`
}

export function DocumentsStep() {
  const { t } = useTranslation()
  const certificates = useCertificates()
  const deleteCert = useDeleteCertificate()

  const deleteError = deleteCert.isError
    ? tError(deleteCert.error instanceof ApiError ? deleteCert.error.code : 'internal_error')
    : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-text">
          {t('sellerVerification.documents.heading')}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {t('sellerVerification.documents.description')}
        </p>
      </div>

      <CertificateUploader />

      {certificates.isLoading && <CardSkeleton lines={4} />}

      {certificates.isError && (
        <div className="flex items-center gap-3">
          <p className="text-sm text-error-text">{t('sellerVerification.loadFailed')}</p>
          <Button variant="outline" size="sm" onClick={() => { void certificates.refetch() }}>
            {t('sellerVerification.retry')}
          </Button>
        </div>
      )}

      {certificates.data &&
        (certificates.data.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">
            {t('sellerVerification.documents.empty')}
          </p>
        ) : (
          <ul className="space-y-3">
            {certificates.data.map((cert) => {
              const deleting = deleteCert.isPending && deleteCert.variables === cert.id
              return (
                <li
                  key={cert.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text">{cert.fileName}</p>
                      <p className="text-xs text-muted">
                        {t(`sellerVerification.documents.types.${cert.documentType}`)}
                        {' · '}
                        {formatFileSize(cert.fileSize)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <StatusBadge status={cert.verified ? 'verified' : 'pending'} />
                    <button
                      type="button"
                      aria-label={t('sellerVerification.documents.delete')}
                      disabled={deleting}
                      onClick={() => deleteCert.mutate(cert.id)}
                      className="text-muted transition-colors hover:text-error disabled:cursor-not-allowed"
                    >
                      {deleting ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        ))}

      {deleteError && <p className="text-sm text-error-text">{deleteError}</p>}
    </div>
  )
}
