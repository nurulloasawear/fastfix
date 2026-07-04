import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  ReviewReplyModal,
  ReviewTable,
  useCustomerServiceUi,
  useRatingsSummary,
  useReviews,
  useSubmitReviewReply,
} from '@/features/customer-service'
import type { ReviewTab } from '@/features/customer-service'
import { InfoIcon } from '@/features/customer-service'

function StarBadge({ n, count, active, onClick }: { n: number; count: number; active: boolean; onClick: () => void }) {
  return (
    <Button
      variant={active ? 'primary' : 'outline'}
      size="sm"
      onClick={onClick}
    >
      <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2 15.1 8.3 22 9.3l-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1L12 2Z" />
      </svg>
      {n}★ ({count})
    </Button>
  )
}

// Review Management page matching Shopee screenshot.
// Two-panel header (Shop Rating card + Review Tools) + tabbed review list.
export function ReviewsPage() {
  const { t } = useTranslation()

  const reviewTab = useCustomerServiceUi((s) => s.reviewTab)
  const reviewStars = useCustomerServiceUi((s) => s.reviewStars)
  const reviewSearch = useCustomerServiceUi((s) => s.reviewSearch)
  const replyModalReviewId = useCustomerServiceUi((s) => s.replyModalReviewId)
  const setReviewTab = useCustomerServiceUi((s) => s.setReviewTab)
  const setReviewStars = useCustomerServiceUi((s) => s.setReviewStars)
  const setReviewSearch = useCustomerServiceUi((s) => s.setReviewSearch)
  const openReplyModal = useCustomerServiceUi((s) => s.openReplyModal)
  const closeReplyModal = useCustomerServiceUi((s) => s.closeReplyModal)

  const { data: summaryData } = useRatingsSummary()
  const { data: reviewsData, isLoading, refetch } = useReviews({
    tab: reviewTab,
    stars: reviewStars.length > 0 ? reviewStars : undefined,
    search: reviewSearch || undefined,
  })
  const submitReply = useSubmitReviewReply()

  const reviews = reviewsData?.reviews ?? []
  const summary = reviewsData?.summary ?? summaryData

  const reviewTabs: { id: ReviewTab; label: string }[] = [
    { id: 'all', label: `${t('customerService.reviews.tabAll')} (${summary?.total ?? 0})` },
    { id: 'to_reply', label: `${t('customerService.reviews.tabToReply')} (${summary?.toReply ?? 0})` },
    { id: 'replied', label: `${t('customerService.reviews.tabReplied')} (${summary?.replied ?? 0})` },
  ]

  const starCounts = summary?.starCounts ?? { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

  function toggleStar(n: number) {
    setReviewStars(
      reviewStars.includes(n) ? reviewStars.filter((s) => s !== n) : [...reviewStars, n],
    )
  }

  const activeReview = reviews.find((r) => r.id === replyModalReviewId)

  function handleSubmitReply(replyText: string) {
    if (!replyModalReviewId) return
    submitReply.mutate(
      { reviewId: replyModalReviewId, replyText },
      {
        onSuccess: () => {
          closeReplyModal()
          void refetch()
        },
      },
    )
  }

  return (
    <Page>
      <PageHeader
        title={t('customerService.reviews.title')}
        breadcrumb={`${t('customerService.breadcrumbHome')} › ${t('customerService.reviews.crumb')}`}
      />

      {/* Two-panel header */}
      <div className="flex gap-4">
        {/* Shop Rating card */}
        <Card className="flex-1 p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl font-bold text-text">
              {summary?.overallRating.toFixed(1) ?? '—'}
            </span>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
              <path d="M12 2 15.1 8.3 22 9.3l-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1L12 2Z" />
            </svg>
            <InfoIcon size={14} className="text-muted" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted">
                {t('customerService.reviews.ratingsReceived')}
              </div>
              <div className="text-lg font-semibold text-text">{summary?.ratingsReceived ?? 0}</div>
            </div>
            <div>
              <div className="text-xs text-muted">{t('customerService.reviews.reviewRateOfOrders')}</div>
              <div className="text-lg font-semibold text-text">{summary?.reviewRateOfOrders ?? 0}%</div>
            </div>
            <div>
              <div className="text-xs text-muted">{t('customerService.reviews.goodRatingRate')}</div>
              <div className="text-lg font-semibold text-text">{summary?.goodRatingRate ?? 0}%</div>
            </div>
          </div>

          <div className="mt-4 flex gap-8">
            <div>
              <div className="flex items-center gap-1 text-sm font-semibold text-text">
                {t('customerService.reviews.unresolvedBad')}
                <InfoIcon size={13} className="text-muted" />
              </div>
              <button type="button" onClick={() => { setReviewTab('to_reply'); setReviewStars([1, 2]) }} className="text-xl font-bold text-error-text hover:underline">
                {summary?.unresolvedBadRatings ?? 0}
              </button>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm font-semibold text-text">
                {t('customerService.reviews.newRatings')}
                <InfoIcon size={13} className="text-muted" />
              </div>
              <button type="button" onClick={() => setReviewTab('to_reply')} className="text-xl font-bold text-brand hover:underline">
                {summary?.newRatingsReceived ?? 0}
              </button>
            </div>
          </div>
        </Card>

        {/* Review Tools card */}
        <Card className="w-56 shrink-0 p-5">
          <p className="mb-3 text-sm font-semibold text-text">{t('customerService.reviews.reviewTools')}</p>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">R</span>
            <div className="flex-1 text-xs font-medium text-text">{t('customerService.reviews.reviewPrize')}</div>
            <Button size="sm">{t('customerService.reviews.replyNow')}</Button>
          </div>
        </Card>
      </div>

      {/* Shop Rating List */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 font-semibold text-text">
          {t('customerService.reviews.shopRating')} {t('customerService.reviews.tabAll').toLowerCase()}
        </div>

        {/* Underline tab bar */}
        <div className="flex border-b border-border px-2">
          {reviewTabs.map((tab) => {
            const active = tab.id === reviewTab
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setReviewTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
                  active ? 'border-b-2 border-brand text-brand' : 'text-text-secondary hover:text-text'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Star filter */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-3">
          <span className="text-xs font-semibold text-muted">{t('customerService.reviews.filterStar')}:</span>
          <Button
            variant={reviewStars.length === 0 ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setReviewStars([])}
          >
            {t('customerService.reviews.filterAll')}
          </Button>
          {([5, 4, 3, 2, 1] as const).map((n) => (
            <StarBadge
              key={n}
              n={n}
              count={starCounts[n]}
              active={reviewStars.includes(n)}
              onClick={() => toggleStar(n)}
            />
          ))}
        </div>

        {/* Search + date filter */}
        <div className="flex flex-wrap items-end gap-3 border-b border-border px-5 py-3">
          <div className="flex-1 min-w-48">
            <Input
              placeholder={t('customerService.reviews.searchPlaceholder')}
              value={reviewSearch}
              onChange={(e) => setReviewSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">{t('customerService.reviews.requestTime')}</span>
            <div className="w-40">
              <Input
                type="text"
                placeholder={t('customerService.reviews.setPeriod')}
              />
            </div>
            <Button size="sm" onClick={() => void refetch()}>
              {t('customerService.reviews.apply')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setReviewSearch(''); setReviewStars([]); void refetch() }}>
              {t('customerService.reviews.reset')}
            </Button>
          </div>
        </div>

        {/* Table */}
        <ReviewTable reviews={reviews} isLoading={isLoading} onReply={openReplyModal} />
      </Card>

      {/* Reply modal */}
      {activeReview && (
        <ReviewReplyModal
          review={activeReview}
          onClose={closeReplyModal}
          onSubmit={handleSubmitReply}
          isSubmitting={submitReply.isPending}
        />
      )}
    </Page>
  )
}
