import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { tError } from '@/i18n'
import { ApiError } from '@/lib/apiError'
import { useResolveTicket } from '../api/customer-service.queries'
import { useCustomerServiceUi } from '../stores/customer-service.store'
import type { Ticket } from '../types/customer-service.types'
import { PRIORITY_TONE, STATUS_TONE } from './ticketBadges'

type Props = { ticket: Ticket }

// Modal view of one ticket. "Mark as Resolved" runs the mutation; on success the
// list invalidates and the modal closes. Errors surface via tError(code).
export function TicketDetailModal({ ticket }: Props) {
  const { t } = useTranslation()
  const close = useCustomerServiceUi((s) => s.selectTicket)
  const resolve = useResolveTicket()

  function handleResolve() {
    resolve.mutate(ticket.id, { onSuccess: () => close(null) })
  }

  const errorCode = resolve.error instanceof ApiError ? resolve.error.code : null

  return (
    <Modal
      open
      onClose={() => close(null)}
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={() => close(null)}>
            {t('customerService.ticket.modal.close')}
          </Button>
          {ticket.status !== 'resolved' && (
            <Button size="sm" onClick={handleResolve} disabled={resolve.isPending}>
              {resolve.isPending ? <Spinner className="mr-1" /> : null}
              {resolve.isPending
                ? t('customerService.ticket.modal.resolving')
                : t('customerService.ticket.modal.resolve')}
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-4 text-sm">
        <div className="mb-1">
          <span className="text-xs font-semibold text-muted">{t('customerService.ticket.modal.eyebrow')}</span>
          <h3 className="text-sm font-semibold text-text">{ticket.ref}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="block text-xs text-muted">{t('customerService.ticket.modal.customer')}</span>
            <strong className="text-text">{ticket.customerName}</strong>
          </div>
          <div>
            <span className="block text-xs text-muted">{t('customerService.ticket.modal.category')}</span>
            <strong className="text-text">{t(`customerService.ticket.category.${ticket.category}`)}</strong>
          </div>
        </div>

        <div>
          <span className="block text-xs text-muted">{t('customerService.ticket.modal.subject')}</span>
          <p className="font-semibold text-text">{ticket.subject}</p>
        </div>

        <div className="rounded-lg border border-border bg-bg p-3">
          <span className="mb-1.5 block text-xs font-semibold text-muted">
            {t('customerService.ticket.modal.description')}
          </span>
          <p className="leading-relaxed text-text">{ticket.description}</p>
        </div>

        <div className="flex items-end gap-4">
          <div>
            <span className="mb-1 block text-xs text-muted">{t('customerService.ticket.modal.priority')}</span>
            <Badge tone={PRIORITY_TONE[ticket.priority]}>
              {t(`customerService.ticket.priority.${ticket.priority}`)}
            </Badge>
          </div>
          <div>
            <span className="mb-1 block text-xs text-muted">{t('customerService.ticket.modal.currentStatus')}</span>
            <Badge tone={STATUS_TONE[ticket.status]}>
              {t(`customerService.ticket.status.${ticket.status}`)}
            </Badge>
          </div>
        </div>

        {errorCode && <p className="text-xs text-error-text">{tError(errorCode)}</p>}
      </div>
    </Modal>
  )
}
