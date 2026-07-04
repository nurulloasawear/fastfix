import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { Pagination } from '@/components/ui/Pagination'
import { Table, Th, Tr } from '@/components/ui/Table'
import { TableRowSkeleton } from '@/components/ui/Skeleton'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import { useToast } from '@/components/ui/Toast'
import {
  DownloadIcon,
  RotateCcwIcon,
  ReturnStatusTabs,
  useExportReturns,
  useReturnRequests,
  useReturnsUi,
} from '@/features/orders'
import type { ReturnSort } from '@/features/orders'
import { ReturnTableRow } from './ReturnTableRow'

const PAGE_SIZE = 20

// The return/refund management body (status sub-tabs + filters + table). Shared by
// the dedicated ReturnsPage AND the My-Orders "Return/Refund" tab.
export function ReturnsPanel() {
  const { t } = useTranslation()
  const toast = useToast()
  const exportReturns = useExportReturns()

  const primaryTab    = useReturnsUi((s) => s.primaryTab)
  const status        = useReturnsUi((s) => s.status)
  const priority      = useReturnsUi((s) => s.priority)
  const searchText    = useReturnsUi((s) => s.searchText)
  const setStatus     = useReturnsUi((s) => s.setStatus)
  const setPriority   = useReturnsUi((s) => s.setPriority)
  const setSearchText = useReturnsUi((s) => s.setSearchText)
  const resetFilters  = useReturnsUi((s) => s.resetFilters)

  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<ReturnSort>('newest')

  // Reset to page 1 whenever the filter set changes.
  useEffect(() => { setPage(1) }, [primaryTab, status, priority, searchText, sort])

  const { data, isLoading, isError, refetch } = useReturnRequests({
    primaryTab,
    status,
    priority,
    q: searchText || undefined,
    sort,
    page,
    limit: PAGE_SIZE,
  })

  const requests = data?.requests ?? []
  const total    = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const PRIORITY_TABS: TabItem[] = [
    { key: 'all',        label: t('orders.returns.priority.all') },
    { key: 'due_1_day',  label: t('orders.returns.priority.due_1_day') },
    { key: 'due_2_days', label: t('orders.returns.priority.due_2_days') },
  ]

  return (
    <>
      {/* Status sub-tabs with live counts (RET-001) */}
      <ReturnStatusTabs active={status} onChange={setStatus} summary={data?.summary} />

      {/* Priority pills */}
      <div className="flex items-center gap-3 px-4 py-2">
        <span className="text-xs font-semibold text-text-secondary">
          {t('orders.returns.priorityLabel', { defaultValue: 'Muhimligi' })}
        </span>
        <Tabs items={PRIORITY_TABS} value={priority} onChange={(key) => setPriority(key as typeof priority)} />
      </div>

      {/* Search bar */}
      <div className="flex flex-wrap items-end gap-3 border-b border-border px-4 py-3">
        <div className="min-w-[260px] flex-1">
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void refetch() }}
            placeholder={t('orders.returns.searchPlaceholder')}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => { resetFilters(); void refetch() }}>
            {t('orders.reset')}
          </Button>
          <Button size="sm" onClick={() => void refetch()}>{t('orders.apply')}</Button>
        </div>
      </div>

      {/* Results bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-sm font-semibold text-text">
          {t('orders.returns.requests', { count: total })}
        </span>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as ReturnSort)}
            className="rounded-md border border-border-strong bg-surface px-2 py-1.5 text-sm text-text-secondary"
            aria-label={t('orders.sortBy')}
          >
            <option value="newest">{t('orders.sortNewest', { defaultValue: 'Eng yangi' })}</option>
            <option value="oldest">{t('orders.sortOldest', { defaultValue: 'Eng eski' })}</option>
            <option value="amount">{t('orders.sortAmount', { defaultValue: 'Summa boʻyicha' })}</option>
          </select>
          <Button
            size="sm"
            variant="outline"
            disabled={exportReturns.isPending}
            onClick={() => exportReturns.mutate(status === 'all' ? undefined : status, {
              onSuccess: (blob) => {
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url; a.download = 'returns.csv'; a.click()
                URL.revokeObjectURL(url)
                toast.success(t('orders.exportStarted', { defaultValue: 'Eksport yuklab olindi' }))
              },
              onError: () => toast.error(t('orders.exportFailed', { defaultValue: 'Eksport amalga oshmadi' })),
            })}
          >
            <DownloadIcon size={13} />
            {t('orders.export')}
          </Button>
        </div>
      </div>

      {/* Table — return rows with RETURN status/columns */}
      {isError ? (
        <ErrorState
          title={t('orders.loadError', { defaultValue: 'Maʼlumotni yuklab boʻlmadi' })}
          retryLabel={t('common.retry', { defaultValue: 'Qayta urinish' })}
          onRetry={() => void refetch()}
        />
      ) : !isLoading && requests.length === 0 ? (
        <EmptyState
          icon={<RotateCcwIcon size={24} />}
          title={t('orders.returns.empty')}
          description={t('orders.returns.emptyHint', { defaultValue: 'Tanlangan filtr boʻyicha qaytarish soʻrovlari yoʻq.' })}
        />
      ) : (
        <Table>
          <thead>
            <Tr className="border-0">
              <Th>{t('orders.returns.colProducts')}</Th>
              <Th>{t('orders.returns.colAmount')}</Th>
              <Th>{t('orders.returns.colReason')}</Th>
              <Th>{t('orders.returns.colReassessedReason')}</Th>
              <Th>{t('orders.returns.colSolution')}</Th>
              <Th>{t('orders.returns.colStatus')}</Th>
              <Th>{t('orders.returns.colForwardLogistic')}</Th>
              <Th>{t('orders.returns.colActions')}</Th>
            </Tr>
          </thead>
          <tbody>
            {isLoading && <TableRowSkeleton cols={8} />}
            {requests.map((req) => (
              <ReturnTableRow
                key={req.id}
                req={req}
                t={t}
                orderIdLabel={t('orders.orderId')}
                requestIdLabel={t('orders.returnDetail.requestId')}
              />
            ))}
          </tbody>
        </Table>
      )}

      {/* Pagination — hidden while a priority filter is active (results are client-filtered
          into a single page, so server pagination doesn't apply). */}
      {priority === 'all' && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border p-3">
          <span className="text-xs text-muted">
            {t('orders.pageOf', { page, pages: totalPages, defaultValue: '{{page}} / {{pages}}-sahifa' })}
          </span>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </>
  )
}
