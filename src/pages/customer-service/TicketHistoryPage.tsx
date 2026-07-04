import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  SearchIcon,
  TicketDetailModal,
  TicketStatusTabs,
  TicketTable,
  useCustomerServiceUi,
  useTickets,
} from '@/features/customer-service'
import type { TicketListQuery, TicketSummary } from '@/features/customer-service'

const EMPTY_SUMMARY: TicketSummary = { all: 0, open: 0, pending: 0, resolved: 0 }

// THIN page: ticket history table + detail modal. Filters live in the UI store.
export function TicketHistoryPage() {
  const { t } = useTranslation()
  const status = useCustomerServiceUi((s) => s.ticketStatus)
  const search = useCustomerServiceUi((s) => s.ticketSearch)
  const setSearch = useCustomerServiceUi((s) => s.setTicketSearch)
  const selectedId = useCustomerServiceUi((s) => s.selectedTicketId)

  const query = useMemo<TicketListQuery>(
    () => ({ status, search: search.trim() || undefined }),
    [status, search],
  )

  const { data, isLoading } = useTickets(query)
  const tickets = data?.tickets ?? []
  const summary = data?.summary ?? EMPTY_SUMMARY
  const selected = tickets.find((tkt) => tkt.id === selectedId)

  return (
    <Page>
      <PageHeader
        title={t('customerService.ticket.title')}
        breadcrumb={`${t('customerService.breadcrumbHome')} › ${t('customerService.breadcrumb')} › ${t('customerService.ticket.crumb')}`}
      />

      <Card className="p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <Input
            className="max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('customerService.ticket.searchPlaceholder')}
            trailing={<SearchIcon size={16} />}
          />
          <TicketStatusTabs summary={summary} />
        </div>

        <TicketTable tickets={tickets} isLoading={isLoading} />
      </Card>

      {selected && <TicketDetailModal ticket={selected} />}
    </Page>
  )
}
