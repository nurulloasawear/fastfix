import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StarIcon } from './icons'
import { useReplyToReview } from '../api/shop.queries'
import type { ShopReview } from '../types/shop.types'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon
          key={i}
          filled={i < rating}
          className={`h-4 w-4 ${i < rating ? 'text-warning' : 'text-border-strong'}`}
        />
      ))}
    </div>
  )
}

function ReviewRow({ review }: { review: ShopReview }) {
  const { t } = useTranslation()
  const reply = useReplyToReview()
  const [draft, setDraft] = useState('')

  const submit = () => {
    if (!draft.trim()) return
    reply.mutate({ id: review.id, reply: draft.trim() }, { onSuccess: () => setDraft('') })
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-text">{review.userName}</h4>
          <span className="text-xs text-muted">{review.date}</span>
        </div>
        <Stars rating={review.rating} />
      </div>

      <div className="rounded-lg border border-border bg-bg p-3 text-xs text-muted">
        <span className="font-medium text-text">{t('shop.rating.product')}:</span>{' '}
        {review.productName}
      </div>

      <p className="text-sm leading-relaxed text-text">{review.comment}</p>

      {review.reply ? (
        <div className="ml-6 space-y-1 rounded-lg border border-brand/20 bg-brand/5 p-3">
          <span className="block text-xs font-semibold text-brand">{t('shop.rating.yourReply')}:</span>
          <p className="text-sm text-muted">{review.reply}</p>
        </div>
      ) : (
        <div className="ml-6 flex items-center gap-2 pt-2">
          <div className="flex-1">
            <Input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t('shop.rating.replyPlaceholder')}
            />
          </div>
          <Button type="button" onClick={submit} disabled={reply.isPending}>
            {t('shop.rating.send')}
          </Button>
        </div>
      )}
    </div>
  )
}

export function ReviewList({ reviews }: { reviews: ShopReview[] }) {
  const { t } = useTranslation()
  if (reviews.length === 0) {
    return <div className="p-8 text-center text-sm text-muted">{t('shop.rating.empty')}</div>
  }
  return (
    <div className="divide-y divide-border">
      {reviews.map((r) => (
        <ReviewRow key={r.id} review={r} />
      ))}
    </div>
  )
}
