import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Pagination } from '@/components/ui/Pagination'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import { useToast } from '@/components/ui/Toast'
import {
  DownloadIcon,
  ListIcon,
  useExportOrders,
  useBulkArrange,
  useGenerateDocuments,
  useMassShipOrders,
  useMassShipUi,
} from '@/features/orders'
import type { DeadlineBucket, MassShipItem } from '@/features/orders'
import {
  FilterPillRow,
  GenerateDocSelects,
  GenerateDocsPanel,
  MassShipPanel,
} from './MassShipPanels'
import { MassShipTable } from './MassShipTable'

const PAGE_SIZE = 50

function channelMatches(name: string, key: string): boolean {
  if (key === 'all') return true
  const n = name.toLowerCase()
  if (key === 'yandex') return n.includes('yandex')
  if (key === 'cdek') return n.includes('cdek')
  if (key === 'self') return n.includes('self')
  return true
}

export function MassShipPage() {
  const { t } = useTranslation()
  const toast = useToast()

  const massShipTab    = useMassShipUi((s) => s.massShipTab)
  const deadlineBucket = useMassShipUi((s) => s.deadlineBucket)
  const channel        = useMassShipUi((s) => s.channel)
  const processStatus  = useMassShipUi((s) => s.processStatus)
  const page           = useMassShipUi((s) => s.page)
  const selectedIds    = useMassShipUi((s) => s.selectedIds)
  const arrangeMethod  = useMassShipUi((s) => s.arrangeMethod)
  const docTypes       = useMassShipUi((s) => s.docTypes)

  const setMassShipTab    = useMassShipUi((s) => s.setMassShipTab)
  const setDeadlineBucket = useMassShipUi((s) => s.setDeadlineBucket)
  const setChannel        = useMassShipUi((s) => s.setChannel)
  const setProcessStatus  = useMassShipUi((s) => s.setProcessStatus)
  const setPage           = useMassShipUi((s) => s.setPage)
  const resetFilters      = useMassShipUi((s) => s.resetFilters)
  const toggleSelect      = useMassShipUi((s) => s.toggleSelect)
  const selectAll         = useMassShipUi((s) => s.selectAll)
  const clearSelection    = useMassShipUi((s) => s.clearSelection)
  const setArrangeMethod  = useMassShipUi((s) => s.setArrangeMethod)
  const toggleDocType     = useMassShipUi((s) => s.toggleDocType)

  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')

  // The channel filter is client-side (the backend takes channel UUIDs, not the FE pill
  // keys), so when it's active server pagination/total don't apply — fetch the whole set
  // in one page and show all filtered rows (no pager). Datasets here are small.
  const channelActive = channel !== 'all'

  const { data, isLoading, isError, refetch } = useMassShipOrders({
    deadlineBucket: deadlineBucket === 'all' ? undefined : deadlineBucket,
    channel: undefined,                                    // never sent to backend
    processStatus: massShipTab === 'generate_documents' ? processStatus : undefined,
    page: channelActive ? 1 : page,
    limit: channelActive ? 500 : PAGE_SIZE,
  })
  const bulkArrange  = useBulkArrange()
  const generateDocs = useGenerateDocuments()
  const exportOrders = useExportOrders()

  // Channel filter (RTS-006) + sort (RTS-013) applied client-side.
  const orders: MassShipItem[] = [...(data?.orders ?? [])]
    .filter((o) => channelMatches(o.channel, channel))
    .sort((a, b) => sort === 'oldest'
      ? a.confirmedTime.localeCompare(b.confirmedTime)
      : b.confirmedTime.localeCompare(a.confirmedTime))
  // total/pager must match the displayed list: filtered count when channel-filtering,
  // else the backend total. Channel-active shows all filtered rows in one page.
  const total = channelActive ? orders.length : (data?.total ?? 0)
  const totalPages = channelActive ? 1 : Math.max(1, Math.ceil(total / PAGE_SIZE))
  const allSelected = orders.length > 0 && orders.every((o) => selectedIds.includes(o.id))

  function handleExport() {
    exportOrders.mutate('to_ship', {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = 'mass-ship.csv'; a.click()
        URL.revokeObjectURL(url)
        toast.success(t('orders.exportStarted', { defaultValue: 'Eksport yuklab olindi' }))
      },
      onError: () => toast.error(t('orders.exportFailed', { defaultValue: 'Eksport amalga oshmadi' })),
    })
  }

  function handleArrange() {
    if (selectedIds.length === 0) return
    const count = selectedIds.length
    bulkArrange.mutate({ orderIds: selectedIds, method: arrangeMethod }, {
      onSuccess: () => {
        clearSelection()
        toast.success(t('orders.bulk.arranged', { count, defaultValue: '{{count}} ta buyurtma uchun yetkazib berish tayinlandi' }))
      },
      onError: () => toast.error(t('orders.bulk.failed', { defaultValue: 'Amal bajarilmadi' })),
    })
  }

  function handleGenerate() {
    if (selectedIds.length === 0 || docTypes.length === 0) return
    generateDocs.mutate({ orderIds: selectedIds, types: docTypes }, {
      onSuccess: ({ downloadUrl }) => {
        if (downloadUrl && downloadUrl !== '#mock-download') {
          const a = document.createElement('a')
          a.href = downloadUrl; a.download = 'shipping-documents.pdf'; a.click()
        }
        toast.success(t('orders.bulk.docsReady', { defaultValue: 'Hujjatlar tayyor' }))
      },
      onError: () => toast.error(t('orders.bulk.failed', { defaultValue: 'Amal bajarilmadi' })),
    })
  }

  const primaryTabs: TabItem[] = [
    { key: 'orders_to_ship', label: t('orders.massShipPage.tabOrders') },
    { key: 'generate_documents', label: t('orders.massShipPage.tabDocs') },
  ]

  return (
    <Page>
      <PageHeader
        title={t('orders.massShipPage.title')}
        breadcrumb={`${t('orders.breadcrumbHome')} › ${t('orders.massShipPage.title')}`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={exportOrders.isPending}>
              <DownloadIcon size={14} />
              {t('orders.export')}
            </Button>
            <Button variant="outline" size="sm">
              <ListIcon size={15} />
              {t('orders.massShipPage.arrangeTasks')}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
        <Card className="overflow-hidden">
          {/* Primary tabs */}
          <div className="border-b border-border px-4 py-2">
            <Tabs
              items={primaryTabs}
              value={massShipTab}
              onChange={(key) => setMassShipTab(key as typeof massShipTab)}
            />
          </div>

          {/* Filter rows */}
          <div className="flex flex-col gap-3 border-b border-border px-4 py-3">
            <FilterPillRow
              label="Shipping Deadline"
              items={[
                { key: 'all', label: t('orders.massShipPage.deadlineAll') },
                { key: 'overdue', label: `${t('orders.massShipPage.deadlineOverdue')} (${data?.deadlineCounts.overdue ?? 0})` },
                { key: 'within_24h', label: `${t('orders.massShipPage.deadlineWithin24')} (${data?.deadlineCounts.within_24h ?? 0})` },
                { key: 'beyond_24h', label: `${t('orders.massShipPage.deadlineBeyond24')} (${data?.deadlineCounts.beyond_24h ?? 0})` },
              ]}
              active={deadlineBucket}
              onChange={(v) => setDeadlineBucket(v as DeadlineBucket)}
            />
            <FilterPillRow
              label={t('orders.shippingChannel')}
              items={[
                { key: 'all', label: t('orders.massShipPage.channelAll') },
                { key: 'yandex', label: `Yandex (${data?.channelCounts['Yandex Delivery'] ?? 0})` },
                { key: 'cdek', label: `CDEK (${data?.channelCounts['CDEK'] ?? 0})` },
                { key: 'self', label: `Self-Delivery (${data?.channelCounts['Self-Delivery'] ?? 0})` },
              ]}
              active={channel}
              onChange={setChannel}
            />
            {massShipTab === 'generate_documents' && (
              <>
                <FilterPillRow
                  label={t('orders.massShipPage.orderStatus')}
                  items={[
                    { key: 'all', label: t('orders.massShipPage.processAll') },
                    { key: 'processed', label: t('orders.massShipPage.processed') },
                    { key: 'to_process', label: t('orders.massShipPage.toProcess') },
                  ]}
                  active={processStatus}
                  onChange={(v) => setProcessStatus(v as 'all' | 'processed' | 'to_process')}
                />
                <GenerateDocSelects
                  printStatusLabel={t('orders.massShipPage.printStatus')}
                  parcelsLabel={t('orders.massShipPage.parcelsContent')}
                />
              </>
            )}
            <Button variant="ghost" size="sm" className="self-start" onClick={() => resetFilters()}>
              {t('orders.reset', { defaultValue: 'Filtrlarni tozalash' })}
            </Button>
          </div>

          {/* Results count + sort */}
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm font-semibold text-text">
              {t('orders.parcels', { count: total })}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
              className="rounded-md border border-border-strong bg-surface px-2 py-1.5 text-sm text-text-secondary"
              aria-label={t('orders.sortBy')}
            >
              <option value="newest">{t('orders.sortNewest', { defaultValue: 'Eng yangi' })}</option>
              <option value="oldest">{t('orders.sortOldest', { defaultValue: 'Eng eski' })}</option>
            </select>
          </div>

          {isError ? (
            <ErrorState
              title={t('orders.loadError', { defaultValue: 'Maʼlumotni yuklab boʻlmadi' })}
              retryLabel={t('common.retry', { defaultValue: 'Qayta urinish' })}
              onRetry={() => void refetch()}
            />
          ) : (
            <MassShipTable
              orders={orders}
              isLoading={isLoading}
              massShipTab={massShipTab}
              selectedIds={selectedIds}
              allSelected={allSelected}
              onToggle={toggleSelect}
              onToggleAll={() => allSelected ? clearSelection() : selectAll(orders.map((o) => o.id))}
              t={t}
              noDataLabel={t('orders.massShipPage.noData')}
            />
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border p-3">
              <span className="text-xs text-muted">
                {t('orders.pageOf', { page, pages: totalPages, defaultValue: '{{page}} / {{pages}}-sahifa' })}
              </span>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          )}
        </Card>

        {/* ── Right panel ────────────────────────────────────────── */}
        <Card className="self-start p-5">
          {massShipTab === 'orders_to_ship' ? (
            <MassShipPanel
              selectedCount={selectedIds.length}
              arrangeMethod={arrangeMethod}
              onSetMethod={setArrangeMethod}
              onArrange={handleArrange}
              isPending={bulkArrange.isPending}
              t={t}
            />
          ) : (
            <GenerateDocsPanel
              selectedCount={selectedIds.length}
              docTypes={docTypes}
              onToggleDocType={toggleDocType}
              onGenerate={handleGenerate}
              isPending={generateDocs.isPending}
              t={t}
            />
          )}
        </Card>
      </div>
    </Page>
  )
}
