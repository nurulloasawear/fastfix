import { useState, type ChangeEvent, type DragEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { ApiError } from '@/lib/apiError'
import { tError } from '@/i18n'
import { useUploadCertificate } from '../../api/seller-verification.queries'
import { validateCertificateFile } from '../../lib/validators'
import type { CertificateType } from '../../types/seller-verification.types'

const CERTIFICATE_TYPES: readonly CertificateType[] = [
  'commercial_license',
  'vat_registration',
  'articles_of_association',
  'other',
]

export function CertificateUploader() {
  const { t } = useTranslation()
  const upload = useUploadCertificate()
  const [documentType, setDocumentType] = useState<CertificateType>('commercial_license')
  const [validationKey, setValidationKey] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const uploading = upload.isPending

  const handleFile = (file: File | undefined) => {
    if (uploading || !file) return
    const key = validateCertificateFile(file)
    setValidationKey(key)
    if (key) return
    upload.mutate({ file, documentType })
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0])
    // Reset so re-selecting the same file fires onChange again.
    e.target.value = ''
  }

  const onDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    if (!uploading) setDragActive(true)
  }

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragActive(false)
    handleFile(e.dataTransfer.files[0])
  }

  const uploadError = upload.isError
    ? tError(upload.error instanceof ApiError ? upload.error.code : 'internal_error')
    : null

  return (
    <div className="space-y-3">
      <Select
        label={t('sellerVerification.documents.documentType')}
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value as CertificateType)}
        disabled={uploading}
      >
        {CERTIFICATE_TYPES.map((type) => (
          <option key={type} value={type}>
            {t(`sellerVerification.documents.types.${type}`)}
          </option>
        ))}
      </Select>

      <label
        onDragOver={onDragOver}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center gap-2 rounded-lg border-2 border-dashed bg-bg p-8 text-center transition-colors ${
          uploading
            ? 'cursor-not-allowed border-border-strong opacity-70'
            : `cursor-pointer hover:border-brand ${dragActive ? 'border-brand' : 'border-border-strong'}`
        }`}
      >
        <input
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          className="hidden"
          onChange={onInputChange}
          disabled={uploading}
        />
        {uploading ? (
          <>
            <Spinner />
            <span className="text-sm font-medium text-text">
              {t('sellerVerification.documents.uploading')}
            </span>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted" aria-hidden="true" />
            <span className="text-sm font-medium text-text">
              {t('sellerVerification.documents.dropHint')}
            </span>
            <span className="text-xs text-muted">
              {t('sellerVerification.documents.formatsHint')}
            </span>
          </>
        )}
      </label>

      {validationKey && <p className="text-sm text-error-text">{t(validationKey)}</p>}
      {uploadError && <p className="text-sm text-error-text">{uploadError}</p>}
    </div>
  )
}
