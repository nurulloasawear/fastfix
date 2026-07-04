import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { formatUZS } from '@/utils/money'
import {
  InfoCircleIcon,
  useApproveReturn,
  useInspectReturnProduct,
  useRejectReturn,
  useReplyToReturn,
  useRetrieveReturnParcel,
  useReturnDetail,
  useSubmitReturnDispute,
  useSubmitReturnEvidence,
} from '@/features/orders'
import { EvidenceCard } from './ReturnEvidenceCards'
import {
  BuyerCard,
  DeliveryAddressCard,
  LogisticCard,
  RequestIdCard,
  ReturnHistorySidebar,
  ReturnProductCard,
} from './ReturnDetailSidebar'

type StatusTone = 'gray' | 'brand' | 'success' | 'error' | 'warning' | 'info'
const TONE: Record<string, StatusTone> = {
  under_review: 'gray', returning: 'info', refunded: 'success',
  disputed: 'warning', dispute_approved: 'success',
  dispute_rejected: 'error', rejected: 'error', claimed: 'success',
}

export function ReturnDetailPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const { id = '' } = useParams()
  const { data: req, isLoading, isError, refetch } = useReturnDetail(id)
  const submitDispute = useSubmitReturnDispute(id)
  const approve = useApproveReturn(id)
  const reject = useRejectReturn(id)
  const reply = useReplyToReturn(id)
  const evidence = useSubmitReturnEvidence(id)
  const retrieve = useRetrieveReturnParcel(id)
  const inspect = useInspectReturnProduct(id)
  const [disputeText, setDisputeText] = useState('')
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectNote, setRejectNote] = useState('')
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const [evidenceUrl, setEvidenceUrl] = useState('')
  const [inspectOpen, setInspectOpen] = useState(false)

  if (isLoading) {
    return (
      <Page>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4"><CardSkeleton lines={i === 0 ? 2 : 3} /></Card>
            ))}
          </div>
          <Card className="p-4"><CardSkeleton lines={6} /></Card>
        </div>
      </Page>
    )
  }

  if (isError) {
    return (
      <Page>
        <ErrorState
          title={t('orders.loadError', { defaultValue: 'Maʼlumotni yuklab boʻlmadi' })}
          retryLabel={t('common.retry', { defaultValue: 'Qayta urinish' })}
          onRetry={() => void refetch()}
        />
      </Page>
    )
  }

  if (!req) {
    return (
      <Page>
        <EmptyState title={t('orders.details.notFound')} />
      </Page>
    )
  }

  const status = req.status
  const canProvideEvidence = status === 'under_review' || status === 'returning'
  const canValidate  = status === 'returning'
  const canDispute   = status === 'disputed'
  const canApprove   = status === 'under_review' || status === 'returning'
  const isReadOnly   = status === 'dispute_rejected' || status === 'dispute_approved'

  function handleSubmitDispute() {
    if (!disputeText.trim()) return
    submitDispute.mutate({ disputeText, evidenceUrls: [] }, {
      onSuccess: () => {
        setDisputeText('')
        toast.success(t('orders.returns.disputeSent', { defaultValue: 'Bahs yuborildi' }))
      },
      onError: () => toast.error(t('orders.bulk.failed', { defaultValue: 'Amal bajarilmadi' })),
    })
  }

  function handleApprove() {
    approve.mutate(undefined, {
      onSuccess: () => toast.success(t('orders.returns.approved', { defaultValue: 'Qaytarish tasdiqlandi' })),
      onError: () => toast.error(t('orders.bulk.failed', { defaultValue: 'Amal bajarilmadi' })),
    })
  }

  function handleReject() {
    reject.mutate(rejectNote, {
      onSuccess: () => {
        setRejectOpen(false)
        setRejectNote('')
        toast.success(t('orders.returns.rejected', { defaultValue: 'Qaytarish rad etildi' }))
      },
      onError: () => toast.error(t('orders.bulk.failed', { defaultValue: 'Amal bajarilmadi' })),
    })
  }

  const actionOk = (msg: string) => () => toast.success(msg)
  const actionErr = () => toast.error(t('orders.bulk.failed', { defaultValue: 'Amal bajarilmadi' }))

  function handleReply() {
    if (!replyText.trim()) return
    reply.mutate(replyText, {
      onSuccess: () => { setReplyOpen(false); setReplyText(''); actionOk(t('orders.returns.actions.replied', { defaultValue: 'Javob yuborildi' }))() },
      onError: actionErr,
    })
  }
  function handleEvidence() {
    if (!evidenceUrl.trim()) return
    evidence.mutate([evidenceUrl.trim()], {
      onSuccess: () => { setEvidenceOpen(false); setEvidenceUrl(''); actionOk(t('orders.returns.actions.evidenceSent', { defaultValue: 'Dalil yuborildi' }))() },
      onError: actionErr,
    })
  }
  function handleRetrieve() {
    retrieve.mutate(undefined, {
      onSuccess: actionOk(t('orders.returns.actions.retrieved', { defaultValue: 'Posilka olib ketish tayinlandi' })),
      onError: actionErr,
    })
  }
  function handleInspect(result: string) {
    inspect.mutate({ result }, {
      onSuccess: () => { setInspectOpen(false); actionOk(t('orders.returns.actions.inspected', { defaultValue: 'Tekshiruv saqlandi' }))() },
      onError: actionErr,
    })
  }

  return (
    <Page>
      <PageHeader
        title={t('orders.returnDetail.title')}
        breadcrumb={
          <span>
            {t('orders.breadcrumbHome')} ›{' '}
            <Link to="/orders/returns" className="hover:underline">{t('orders.returns.title')}</Link>
            {' › '}{t('orders.returnDetail.title')}
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* ── Left column ──────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Status banner */}
          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone={TONE[status] ?? 'gray'} className="px-3 py-1 text-sm">
                {t(`orders.returns.status.${status}`)}
              </Badge>
            </div>
            <p className="text-sm text-text-secondary">{req.statusText}</p>
            {isReadOnly && (
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm">{t('orders.returnDetail.discussionHistory')}</Button>
                <Button variant="ghost" size="sm">{t('orders.returnDetail.viewDetails')}</Button>
              </div>
            )}
          </Card>

          {/* Amounts */}
          <Card className="grid grid-cols-2 gap-4 p-4">
            <div>
              <div className="text-xs text-muted">{t('orders.returnDetail.refundAmount')}</div>
              <div className="mt-1 text-lg font-semibold text-text">{formatUZS(req.refundAmountUzs)}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs text-muted">
                {t('orders.returnDetail.adjustedAmount')}
                <span title={t('orders.returnDetail.adjustedTooltip')}><InfoCircleIcon size={12} /></span>
              </div>
              <div className="mt-1 text-lg font-semibold text-brand">{formatUZS(req.adjustedAmountUzs)}</div>
            </div>
          </Card>

          <RequestIdCard requestId={req.requestId} orderId={req.orderId} t={t} />
          <EvidenceCard
            title={t('orders.returnDetail.reasonFromBuyer')}
            evidenceUrls={req.buyerEvidenceUrls}
            reasonCode={req.reasonCode}
            reasonText={req.reasonText}
            onOpenImage={setLightboxUrl}
          />

          {(req.disputeText || req.disputeEvidenceUrls.length > 0) && (
            <EvidenceCard
              title={t('orders.returnDetail.disputeReason')}
              evidenceUrls={req.disputeEvidenceUrls}
              disputeText={req.disputeText}
              onOpenImage={setLightboxUrl}
            />
          )}

          {/* Dispute text input */}
          {canDispute && !isReadOnly && (
            <Card className="p-4">
              <div className="mb-2 text-sm font-semibold text-text">
                {t('orders.returnDetail.actions.provideEvidence')}
              </div>
              <Textarea
                value={disputeText}
                onChange={(e) => setDisputeText(e.target.value)}
                placeholder={t('orders.returnDetail.disputeTextPlaceholder')}
                rows={4}
              />
              <Button className="mt-3 w-full"
                disabled={!disputeText.trim() || submitDispute.isPending}
                onClick={handleSubmitDispute}
              >
                {submitDispute.isPending && <Spinner className="h-4 w-4" />}
                {submitDispute.isPending
                  ? t('orders.returnDetail.actions.submitting')
                  : t('orders.returnDetail.actions.submitDispute')}
              </Button>
            </Card>
          )}

          {/* Action buttons */}
          {!isReadOnly && (
            <div className="flex flex-wrap gap-2">
              {canApprove && (
                <Button size="sm" onClick={handleApprove} disabled={approve.isPending}>
                  {approve.isPending && <Spinner className="h-4 w-4" />}
                  {t('orders.returns.actions.approve', { defaultValue: 'Tasdiqlash' })}
                </Button>
              )}
              {canApprove && (
                <Button size="sm" variant="destructive" onClick={() => setRejectOpen(true)} disabled={reject.isPending}>
                  {t('orders.returns.actions.reject', { defaultValue: 'Rad etish' })}
                </Button>
              )}
              {status === 'under_review' && (
                <Button size="sm" variant="outline" onClick={() => setReplyOpen(true)}>{t('orders.returnDetail.actions.replyToBuyer')}</Button>
              )}
              {canValidate && (
                <Button size="sm" variant="outline" onClick={() => setInspectOpen(true)}>{t('orders.returnDetail.actions.validateItem')}</Button>
              )}
              {canValidate && (
                <Button size="sm" variant="outline" onClick={handleRetrieve} disabled={retrieve.isPending}>
                  {t('orders.returnDetail.actions.retrieveParcel', { defaultValue: 'Posilkani olish' })}
                </Button>
              )}
              {canProvideEvidence && (
                <Button size="sm" variant="outline" onClick={() => setEvidenceOpen(true)}>{t('orders.returnDetail.actions.provideEvidence')}</Button>
              )}
            </div>
          )}

          <DeliveryAddressCard address={req.deliveryAddress} t={t} />
          <LogisticCard carrier={req.logisticsCarrier} service={req.logisticsService} trackingNumber={req.trackingNumber} t={t} />
          <BuyerCard buyerName={req.buyerName} t={t} />
          <ReturnProductCard req={req} t={t} />
        </div>

        {/* ── Right sidebar ─────────────────────────────────────── */}
        <ReturnHistorySidebar events={req.events} />
      </div>

      {/* Lightbox */}
      <Modal open={lightboxUrl !== null} onClose={() => setLightboxUrl(null)} size="sm">
        <div className="flex items-center justify-center">
          <div className="h-64 w-64 rounded-lg border border-border bg-bg" />
        </div>
      </Modal>

      {/* Reject reason */}
      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} size="sm">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text">
            {t('orders.returns.actions.rejectTitle', { defaultValue: 'Qaytarishni rad etish' })}
          </h3>
          <Textarea
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            placeholder={t('orders.returns.actions.rejectReason', { defaultValue: 'Sabab (ixtiyoriy)' })}
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setRejectOpen(false)}>
              {t('orders.reset', { defaultValue: 'Bekor qilish' })}
            </Button>
            <Button size="sm" variant="destructive" onClick={handleReject} disabled={reject.isPending}>
              {reject.isPending && <Spinner className="h-4 w-4" />}
              {t('orders.returns.actions.reject', { defaultValue: 'Rad etish' })}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reply to buyer */}
      <Modal open={replyOpen} onClose={() => setReplyOpen(false)} size="sm">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text">{t('orders.returnDetail.actions.replyToBuyer')}</h3>
          <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={3}
            placeholder={t('orders.returns.actions.replyPlaceholder', { defaultValue: 'Xaridorga xabar...' })} />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setReplyOpen(false)}>{t('orders.reset', { defaultValue: 'Bekor qilish' })}</Button>
            <Button size="sm" onClick={handleReply} disabled={!replyText.trim() || reply.isPending}>
              {reply.isPending && <Spinner className="h-4 w-4" />}
              {t('orders.returnDetail.actions.send', { defaultValue: 'Yuborish' })}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Provide evidence */}
      <Modal open={evidenceOpen} onClose={() => setEvidenceOpen(false)} size="sm">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text">{t('orders.returnDetail.actions.provideEvidence')}</h3>
          <Input value={evidenceUrl} onChange={(e) => setEvidenceUrl(e.target.value)}
            placeholder={t('orders.returns.actions.evidenceUrl', { defaultValue: 'Rasm/hujjat havolasi (URL)' })} />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setEvidenceOpen(false)}>{t('orders.reset', { defaultValue: 'Bekor qilish' })}</Button>
            <Button size="sm" onClick={handleEvidence} disabled={!evidenceUrl.trim() || evidence.isPending}>
              {evidence.isPending && <Spinner className="h-4 w-4" />}
              {t('orders.returnDetail.actions.send', { defaultValue: 'Yuborish' })}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Inspect product */}
      <Modal open={inspectOpen} onClose={() => setInspectOpen(false)} size="sm">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text">{t('orders.returnDetail.actions.validateItem')}</h3>
          <p className="text-sm text-muted">{t('orders.returns.actions.inspectPrompt', { defaultValue: 'Tekshiruv natijasi:' })}</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleInspect('pass')} disabled={inspect.isPending}>{t('orders.returns.actions.pass', { defaultValue: 'Yaroqli' })}</Button>
            <Button size="sm" variant="outline" onClick={() => handleInspect('partial')} disabled={inspect.isPending}>{t('orders.returns.actions.partial', { defaultValue: 'Qisman' })}</Button>
            <Button size="sm" variant="destructive" onClick={() => handleInspect('fail')} disabled={inspect.isPending}>{t('orders.returns.actions.fail', { defaultValue: 'Yaroqsiz' })}</Button>
          </div>
        </div>
      </Modal>
    </Page>
  )
}
