// CertificateUploadCard.tsx
import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  useCertificates,
  useUploadCertificate,
  useDeleteCertificate,
  useDownloadCertificate,
} from "../queries/certificate.queries"
import type {
  SellerCertificate,
  UploadCertificatePayload,
} from "../types/seller-verification.types"

interface CertificateUploadCardProps {
  disabled?: boolean
  readOnly?: boolean
  className?: string
}

export function CertificateUploadCard({
  disabled = false,
  readOnly = false,
  className = "",
}: CertificateUploadCardProps): React.JSX.Element {
  const { t } = useTranslation()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  
  const [dragActive, setDragActive] = React.useState<boolean>(false)
  const [selectedDocumentType, setSelectedDocumentType] = React.useState<string>("COMMERCIAL_LICENSE")
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null)
  const [validationError, setValidationError] = React.useState<string | null>(null)

  const {
    data: certificates = [],
    isLoading: isFetchLoading,
    isError: isFetchError,
    error: fetchError,
  } = useCertificates()

  const {
    mutate: uploadCertificate,
    isPending: isUploading,
    error: uploadError,
    reset: resetUploadError,
  } = useUploadCertificate()

  const {
    mutate: deleteCertificate,
    isPending: isDeleting,
    error: deleteError,
    reset: resetDeleteError,
  } = useDeleteCertificate()

  const {
    mutate: downloadCertificate,
    isPending: isDownloading,
  } = useDownloadCertificate()

  const isInteractionDisabled = disabled || readOnly || isUploading || isDeleting || isDownloading

  const clearErrors = (): void => {
    setValidationError(null)
    resetUploadError()
    resetDeleteError()
  }

  const handleFileAction = (file: File): void => {
    clearErrors()

    if (!file) {
      setValidationError(t("seller.cert.errors.emptyFile"))
      return
    }

    const maxSizeBytes = 10 * 1024 * 1024 // 10MB default
    if (file.size > maxSizeBytes) {
      setValidationError(t("seller.cert.errors.maxSizeExceeded"))
      return
    }

    const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"]
    if (!allowedMimeTypes.includes(file.type)) {
      setValidationError(t("seller.cert.errors.invalidMimeType"))
      return
    }

    const isDuplicate = certificates.some(
      (c) => c.originalName === file.name && c.documentType === selectedDocumentType
    )
    if (isDuplicate) {
      setValidationError(t("seller.cert.errors.duplicateFile"))
      return
    }

    const payload: UploadCertificatePayload = {
      file,
      documentType: selectedDocumentType as SellerCertificate["documentType"],
    }

    uploadCertificate(payload)
  }

  const handleDrag = (e: React.DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (isInteractionDisabled) return

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileAction(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      handleFileAction(e.target.files[0])
    }
  }

  const triggerFileInput = (): void => {
    if (isInteractionDisabled) return
    fileInputRef.current?.click()
  }

  const handleDownload = (certificateId: string, fileName: string): void => {
    if (isInteractionDisabled) return
    clearErrors()
    downloadCertificate(certificateId, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      },
    })
  }

  const handleDeleteRequest = (id: string): void => {
    if (isInteractionDisabled) return
    clearErrors()
    setDeleteTargetId(id)
  }

  const confirmDelete = (): void => {
    if (!deleteTargetId || isInteractionDisabled) return
    deleteCertificate(deleteTargetId, {
      onSuccess: () => {
        setDeleteTargetId(null)
      },
    })
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (isFetchLoading) {
    return (
      <div className={`w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}>
        <div className="space-y-4 animate-pulse">
          <div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-2/3 rounded bg-slate-100 dark:bg-slate-900" />
          <div className="h-32 w-full rounded-lg bg-slate-100 dark:bg-slate-900" />
        </div>
      </div>
    )
  }

  const combinedError = validationError || uploadError?.message || deleteError?.message || fetchError?.message

  return (
    <div className={`w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {t("seller.cert.title")}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("seller.cert.subtitle")}
        </p>
      </div>

      {combinedError && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400" role="alert">
          <div className="flex items-start space-x-2">
            <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <span className="font-semibold">{t("seller.cert.errorTitle")}:</span> {combinedError}
            </div>
          </div>
        </div>
      )}

      {!readOnly && (
        <div className="mb-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="documentTypeSelect" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("seller.cert.documentType")}
            </label>
            <select
              id="documentTypeSelect"
              value={selectedDocumentType}
              disabled={isInteractionDisabled}
              onChange={(e) => setSelectedDocumentType(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="COMMERCIAL_LICENSE">{t("seller.cert.types.commercialLicense")}</option>
              <option value="VAT_REGISTRATION">{t("seller.cert.types.vatRegistration")}</option>
              <option value="ARTICLES_OF_ASSOCIATION">{t("seller.cert.types.articlesOfAssociation")}</option>
              <option value="OTHER">{t("seller.cert.types.other")}</option>
            </select>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 ${
              dragActive
                ? "border-blue-500 bg-blue-50/30 dark:border-blue-400 dark:bg-blue-950/10"
                : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/20 dark:hover:bg-slate-900/30"
            } ${isInteractionDisabled ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              disabled={isInteractionDisabled}
              onChange={handleFileInputChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
            {isUploading ? (
              <div className="flex flex-col items-center space-y-3">
                <svg className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t("seller.cert.uploading")}
                </p>
              </div>
            ) : (
              <>
                <svg className="h-10 w-10 text-slate-400 dark:text-slate-500 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50 mb-1">
                  {t("seller.cert.dropAction")}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t("seller.cert.allowedFormats")}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {certificates.length === 0 && !isFetchError && (
        <div className="flex flex-col items-center justify-center border border-slate-100 rounded-xl p-8 text-center bg-slate-50/30 dark:border-slate-900 dark:bg-slate-950/20">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {t("seller.cert.noCertificates")}
          </p>
        </div>
      )}

      {certificates.length > 0 && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between border border-slate-200 rounded-lg p-4 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 gap-4"
            >
              <div className="flex items-start space-x-3 min-w-0">
                <div className="rounded-lg bg-slate-50 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-400 flex-shrink-0">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                    {cert.originalName}
                  </h4>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400 items-center">
                    <span className="font-medium px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {t(`seller.cert.types.${cert.documentType.toLowerCase().replace(/_([a-z])/g, (_, g) => g.toUpperCase())}` as any, cert.documentType)}
                    </span>
                    <span>•</span>
                    <span>{formatFileSize(cert.fileSize)}</span>
                    <span>•</span>
                    <span>{cert.uploadedAt.split("T")[0]}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                <div>
                  {cert.verified ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
                      {t("seller.cert.verified")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                      {t("seller.cert.pending")}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    disabled={isInteractionDisabled}
                    onClick={() => handleDownload(cert.id, cert.originalName)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
                    title={t("seller.cert.download")}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </button>
                  {!readOnly && (
                    <button
                      type="button"
                      disabled={isInteractionDisabled}
                      onClick={() => handleDeleteRequest(cert.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                      title={t("seller.cert.delete")}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {t("seller.cert.deleteTitle")}
            </h4>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {t("seller.cert.deleteConfirm")}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTargetId(null)}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                {t("seller.cert.cancel")}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-400"
              >
                {isDeleting ? t("seller.cert.deleting") : t("seller.cert.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}