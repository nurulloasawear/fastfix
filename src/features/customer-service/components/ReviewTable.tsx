import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Td, Th, Tr } from '@/components/ui/Table'
import type { Review } from '../types/customer-service.types'
import { FlagIcon } from './icons'

type Props = {
  reviews: Review[]
  isLoading: boolean
  onReply: (reviewId: string) => void
}

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={13}
          height={13}
          viewBox="0 0 24 24"
          fill={i < rating ? '#f59e0b' : 'none'}
          stroke={i < rating ? '#f59e0b' : '#d1d5db'}
          strokeWidth={1.5}
        >
          <path d="M12 2 15.1 8.3 22 9.3l-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1L12 2Z" />
        </svg>
      ))}
    </span>
  )
}

export function ReviewTable({ reviews, isLoading, onReply }: Props) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <EmptyState title={t('customerService.reviews.empty')} />
    )
  }

  return (
    <Table>
      <thead>
        <Tr>
          <Th>{t('customerService.reviews.colProduct')}</Th>
          <Th>{t('customerService.reviews.colReview')}</Th>
          <Th>{t('customerService.reviews.colSupport')}</Th>
          <Th>{t('customerService.reviews.colAction')}</Th>
        </Tr>
      </thead>
      <tbody>
        {reviews.map((review) => (
          <Tr key={review.id} className="align-top hover:bg-bg">
            {/* Product Information */}
            <Td className="max-w-xs">
              <div className="flex gap-3">
                <div className="h-12 w-12 shrink-0 rounded-md bg-bg" />
                <div className="min-w-0">
                  <p className="line-clamp-2 text-xs font-medium text-text">{review.productTitle}</p>
                  <p className="mt-1 text-xs text-muted">
                    {review.productVariants.slice(0, 2).join(' · ')}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-brand">
                    <span>{review.orderId}</span>
                  </div>
                  <p className="text-xs text-muted">{review.buyerUsername}</p>
                  <p className="text-xs text-muted">{review.orderDate}</p>
                </div>
              </div>
            </Td>

            {/* Buyer's Review */}
            <Td>
              <StarRow rating={review.rating} />
              <p className="mt-1 text-sm leading-relaxed text-text">{review.reviewText}</p>
              {review.hasReply && (
                <p className="mt-1 text-xs italic text-muted">
                  {review.replyText}
                </p>
              )}
            </Td>

            {/* Support Review */}
            <Td>
              <button
                type="button"
                className="rounded p-1.5 text-muted hover:bg-bg hover:text-text"
                aria-label={t('customerService.reviews.flagReview')}
              >
                <FlagIcon size={16} />
              </button>
            </Td>

            {/* Action */}
            <Td>
              {!review.hasReply ? (
                <Button size="sm" onClick={() => onReply(review.id)}>
                  {t('customerService.reviews.replyBtn')}
                </Button>
              ) : (
                <span className="text-xs text-success">{t('customerService.reviews.replied')}</span>
              )}
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  )
}
