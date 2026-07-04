import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  useCreateStream,
  useUploadCoverImage,
  StreamProductList,
  StreamProductPickerModal,
  UploadIcon,
  InfoIcon,
} from '@/features/live'
import type { SellerProduct, StreamProductRow } from '@/features/live'
import { ApiError } from '@/lib/apiError'

export function CreateStreamPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const createMutation = useCreateStream()
  const uploadCover = useUploadCoverImage()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [products, setProducts] = useState<StreamProductRow[]>([])
  const [streamType, setStreamType] = useState<'normal' | 'test'>('normal')
  const [showPicker, setShowPicker] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [errorCode, setErrorCode] = useState<string | null>(null)

  const submitting = uploadCover.isPending || createMutation.isPending
  const isValid = coverFile !== null && title.trim().length > 0

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  function handleAddProduct(product: SellerProduct) {
    setProducts((prev) => [
      ...prev,
      {
        productId: product.id,
        productName: product.name,
        priceUzs: product.priceUzs,
        commissionRate: product.commissionRate,
        sortOrder: prev.length,
      },
    ])
    setShowPicker(false)
  }

  function handleRemove(productId: string) {
    setProducts((prev) =>
      prev.filter((p) => p.productId !== productId).map((p, i) => ({ ...p, sortOrder: i })),
    )
  }

  function handleMoveToTop(productId: string) {
    setProducts((prev) => {
      const target = prev.find((p) => p.productId === productId)
      if (!target) return prev
      return [target, ...prev.filter((p) => p.productId !== productId)].map((p, i) => ({ ...p, sortOrder: i }))
    })
  }

  async function handleNext() {
    if (!isValid || !coverFile || submitting) return
    setErrorCode(null)
    try {
      // 1. cover must be a real https URL, not a blob: object URL — upload to R2 first.
      const coverImageUrl = await uploadCover.mutateAsync(coverFile)
      // 2. create the stream session (status=scheduled).
      const created = await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        coverImageUrl,
        isTest: streamType === 'test',
        products: products.map((p) => ({ productId: p.productId, sortOrder: p.sortOrder })),
      })
      // 3. go to the pre-live console; "Go Live" there provisions RealtimeKit.
      navigate(`/live/preview/${created.streamSessionId}`)
    } catch (err) {
      // Surface the failure — previously this was a silent no-op (no onError).
      setErrorCode(err instanceof ApiError ? err.code : 'internal_error')
    }
  }

  return (
    <>
      <Page>
        {/* Policy banner */}
        <div className="flex items-center gap-2 rounded-lg border border-warning bg-warning-bg px-4 py-2.5 text-xs text-warning">
          <InfoIcon size={14} />
          <span>{t('live.createStream.policyBanner')}</span>
          <a href="#" className="ml-1 font-semibold underline">{t('live.createStream.policyLearnMore')}</a>
        </div>

        <PageHeader
          title={t('live.createStream.title')}
          breadcrumb={`${t('live.nav.createStream')} › ${t('live.createStream.title')}`}
        />

        <Card className="mx-auto w-full max-w-3xl p-8">
          <div className="flex flex-col gap-6">
            {/* Cover image */}
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start">
              <label className="w-44 shrink-0 pt-1 text-sm font-semibold text-text-secondary">
                <span className="text-error-text">* </span>{t('live.createStream.coverImage')}
              </label>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border-strong bg-bg hover:border-brand"
                >
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover" className="h-full w-full object-cover" />
                  ) : (
                    <UploadIcon size={24} className="text-muted" />
                  )}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                <p className="text-xs text-muted">{t('live.createStream.coverImageHint')}</p>
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start">
              <label className="w-44 shrink-0 pt-1 text-sm font-semibold text-text-secondary">
                <span className="text-error-text">* </span>{t('live.createStream.streamTitle')}
              </label>
              <div className="flex-1">
                <Input maxLength={40} value={title} onChange={(e) => setTitle(e.target.value)} hint={t('live.createStream.streamTitleHint')} />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start">
              <label className="w-44 shrink-0 pt-1 text-sm font-semibold text-text-secondary">
                {t('live.createStream.description')}
              </label>
              <div className="relative flex-1">
                <Textarea
                  maxLength={200}
                  rows={3}
                  placeholder={t('live.createStream.descriptionPlaceholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="pb-6"
                />
                <span className="absolute bottom-2 right-3 text-xs text-muted">{description.length}/200</span>
              </div>
            </div>

            {/* Related Products */}
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start">
              <label className="w-44 shrink-0 pt-1 text-sm font-semibold text-text-secondary">
                {t('live.createStream.relatedProducts')}
              </label>
              <StreamProductList
                products={products}
                onAdd={() => setShowPicker(true)}
                onMoveToTop={handleMoveToTop}
                onRemove={handleRemove}
              />
            </div>

            {/* Streaming type */}
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
              <span className="w-44 shrink-0 text-sm font-semibold text-text-secondary">
                {t('live.createStream.streamingType')}
              </span>
              <div className="flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="radio" name="streamType" value="normal" checked={streamType === 'normal'} onChange={() => setStreamType('normal')} className="accent-brand" />
                  <span className="text-sm text-text">{t('live.createStream.normal')}</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="radio" name="streamType" value="test" checked={streamType === 'test'} onChange={() => setStreamType('test')} className="accent-brand" />
                  <span className="text-sm text-text">{t('live.createStream.test')}</span>
                </label>
                <div className="relative">
                  <button type="button" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} className="text-muted">
                    <InfoIcon size={14} />
                  </button>
                  {showTooltip && (
                    <div className="absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-lg bg-text px-3 py-2 text-xs text-white shadow-lg">
                      {t('live.createStream.testTooltip')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Error feedback — previously ДАЛЕЕ failed silently */}
          {errorCode && (
            <p className="mt-6 rounded-lg bg-error-bg px-3 py-2 text-sm text-error-text">
              {t([`live.createStream.errors.${errorCode}`, 'live.createStream.errors.generic'])}
            </p>
          )}

          {/* Footer */}
          <div className="mt-8 flex justify-start gap-3">
            <Button variant="outline" disabled={submitting} onClick={() => navigate('/live/analytics')}>
              {t('live.createPromotion.cancel')}
            </Button>
            <Button disabled={!isValid || submitting} onClick={() => void handleNext()}>
              {submitting ? t('live.createStream.creating') : `${t('live.createStream.next')} ›`}
            </Button>
          </div>
        </Card>
      </Page>

      {showPicker && (
        <StreamProductPickerModal
          onClose={() => setShowPicker(false)}
          onAdd={handleAddProduct}
          selectedIds={products.map((p) => p.productId)}
        />
      )}
    </>
  )
}
