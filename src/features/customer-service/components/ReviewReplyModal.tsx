import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { Textarea } from '@/components/ui/Textarea'
import type { Review } from '../types/customer-service.types'

type Props = {
  review: Review
  onClose: () => void
  onSubmit: (replyText: string) => void
  isSubmitting: boolean
}

const MAX = 500

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={14}
          height={14}
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

// Centred overlay modal for replying to a review. Uses the kit <Modal> component.
export function ReviewReplyModal({ review, onClose, onSubmit, isSubmitting }: Props) {
  const { t } = useTranslation()
  const [text, setText] = useState('')

  const canSubmit = text.trim().length > 0 && !isSubmitting

  function handleSubmit() {
    if (canSubmit) onSubmit(text.trim())
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={t('customerService.replyModal.title')}
      size="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('customerService.replyModal.cancel')}
          </Button>
          <Button size="sm" disabled={!canSubmit} onClick={handleSubmit}>
            {isSubmitting ? <Spinner className="mr-1" /> : null}
            {isSubmitting
              ? t('customerService.replyModal.submitting')
              : t('customerService.replyModal.submit')}
          </Button>
        </>
      }
    >
      {/* Review context */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text">{review.buyerUsername}</span>
          <StarRow rating={review.rating} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{review.reviewText}</p>
      </div>

      {/* Reply textarea */}
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX))}
        placeholder={t('customerService.replyModal.placeholder')}
        rows={4}
        hint={t('customerService.replyModal.counter', { count: text.length })}
      />
    </Modal>
  )
}
