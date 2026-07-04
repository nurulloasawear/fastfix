import type { ComponentType, SVGProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Td, Th, Tr } from '@/components/ui/Table'
import { useCustomerServiceUi } from '../stores/customer-service.store'
import type { Ticket, TicketStatus } from '../types/customer-service.types'
import { AlertCircleIcon, CheckCircleIcon, ClockIcon, EyeIcon } from './icons'
import { PRIORITY_TONE, STATUS_TONE } from './ticketBadges'

type IconCmp = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

const STATUS_ICON: Record<TicketStatus, IconCmp> = {
  open: AlertCircleIcon,
  pending: ClockIcon,
  resolved: CheckCircleIcon,
}

type Props = { tickets: Ticket[]; isLoading: boolean }

export function TicketTable({ tickets, isLoading }: Props) {
  const { t } = useTranslation()
  const selectTicket = useCustomerServiceUi((s) => s.selectTicket)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <EmptyState title={t('customerService.ticket.empty')} />
    )
  }

  return (
    <Table>
      <thead>
        <Tr>
          <Th>{t('customerService.ticket.col.id')}</Th>
          <Th>{t('customerService.ticket.col.customer')}</Th>
          <Th>{t('customerService.ticket.col.subject')}</Th>
          <Th>{t('customerService.ticket.col.category')}</Th>
          <Th>{t('customerService.ticket.col.priority')}</Th>
          <Th>{t('customerService.ticket.col.status')}</Th>
          <Th>{t('customerService.ticket.col.date')}</Th>
          <Th className="text-right">{t('customerService.ticket.col.action')}</Th>
        </Tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => {
          const StatusIcon = STATUS_ICON[ticket.status]
          return (
            <Tr key={ticket.id} className="hover:bg-bg">
              <Td className="font-medium">{ticket.ref}</Td>
              <Td className="font-medium">{ticket.customerName}</Td>
              <Td className="max-w-[200px] truncate text-muted" title={ticket.subject}>
                {ticket.subject}
              </Td>
              <Td className="text-muted">
                {t(`customerService.ticket.category.${ticket.category}`)}
              </Td>
              <Td>
                <Badge tone={PRIORITY_TONE[ticket.priority]}>
                  {t(`customerService.ticket.priority.${ticket.priority}`)}
                </Badge>
              </Td>
              <Td>
                <Badge tone={STATUS_TONE[ticket.status]}>
                  <StatusIcon size={12} />
                  {t(`customerService.ticket.status.${ticket.status}`)}
                </Badge>
              </Td>
              <Td className="text-muted">{ticket.date}</Td>
              <Td className="text-right">
                <Button variant="outline" size="sm" onClick={() => selectTicket(ticket.id)}>
                  <EyeIcon size={12} className="text-muted" />
                  {t('customerService.ticket.view')}
                </Button>
              </Td>
            </Tr>
          )
        })}
      </tbody>
    </Table>
  )
}
