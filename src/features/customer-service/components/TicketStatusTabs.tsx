import { useTranslation } from 'react-i18next'
import { Tabs } from '@/components/ui/Tabs'
import { useCustomerServiceUi } from '../stores/customer-service.store'
import { TICKET_STATUS_FILTERS } from '../types/customer-service.types'
import type { TicketSummary } from '../types/customer-service.types'

type Props = { summary: TicketSummary }

// Segmented pill tabs for ticket status. Counts come from the derived summary.
export function TicketStatusTabs({ summary }: Props) {
  const { t } = useTranslation()
  const status = useCustomerServiceUi((s) => s.ticketStatus)
  const setStatus = useCustomerServiceUi((s) => s.setTicketStatus)

  const items = TICKET_STATUS_FILTERS.map((value) => ({
    key: value,
    label: t(`customerService.ticket.status.${value}`),
    count: summary[value],
  }))

  return (
    <Tabs
      items={items}
      value={status}
      onChange={(k) => setStatus(k as typeof status)}
    />
  )
}
