import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Pagination } from '@/components/ui/Pagination'
import { useToast } from '@/components/ui/Toast'
import { ReturnsPanel } from './ReturnsPanel'
import {
  CANCELLATION_SUB_STATUSES,
  ChevronDownIcon,
  DownloadIcon,
  ORDER_STATUSES,
  OrderFilters,
  OrderStatusTabs,
  OrderSubTabs,
  OrderTable,
  TO_SHIP_SUB_STATUSES,
  useBulkArrangeOrders,
  useBulkShip,
  useExportOrders,
  useGenerateDocuments,
  useOrders,
  useOrdersUi,
} from '@/features/orders'
import type { OrderStatus } from '@/features/orders'

const PAGE_SIZE = 20

export function MyOrdersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  const status          = useOrdersUi((s) => s.status)
  const subStatus       = useOrdersUi((s) => s.subStatus)
  const orderId         = useOrdersUi((s) => s.orderId)
  const shippingChannel = useOrdersUi((s) => s.shippingChannel)
  const setStatus       = useOrdersUi((s) => s.setStatus)
  const setSubStatus    = useOrdersUi((s) => s.setSubStatus)
  const setOrderId      = useOrdersUi((s) => s.setOrderId)
  const setChannel      = useOrdersUi((s) => s.setShippingChannel)
  const resetSearch     = useOrdersUi((s) => s.resetSearch)

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)

  // ── URL state (UX-001/012): hydrate once, then reflect status/q/page. ──────────
  const hydrated = useRef(false)
  useEffect(() => {
    const s = searchParams.get('status')
    const q = searchParams.get('q')
    const p = Number(searchParams.get('page'))
    if (s && (ORDER_STATUSES as string[]).includes(s)) setStatus(s as OrderStatus)
    if (q) setOrderId(q)
    if (p > 0) setPage(p)
    hydrated.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (!hydrated.current) return
    const next: Record<string, string> = {}
    if (status !== 'all') next.status = status
    if (orderId) next.q = orderId
    if (page > 1) next.page = String(page)
    setSearchParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, orderId, page])

  function changeStatus(s: OrderStatus) {
    setStatus(s)
    setSelectedIds([])
    setPage(1)
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const { data, isLoading, isError, refetch } = useOrders({
    status, subStatus,
    orderId: orderId || undefined,
    shippingChannel: shippingChannel || undefined,
    page, limit: PAGE_SIZE,
  })
  const exportOrders = useExportOrders()
  const bulkShip = useBulkShip()
  const bulkArrange = useBulkArrangeOrders()
  const genDocs = useGenerateDocuments()

  const orders = data?.orders ?? []
  const total  = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const subTabs =
    status === 'to_ship'       ? TO_SHIP_SUB_STATUSES
    : status === 'cancellation' ? CANCELLATION_SUB_STATUSES
    : null

  function handleExport() {
    exportOrders.mutate(status === 'all' ? undefined : status, {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = `orders-${status}.csv`; a.click()
        URL.revokeObjectURL(url)
        toast.success(t('orders.exportStarted', { defaultValue: 'Eksport yuklab olindi' }))
      },
      onError: () => toast.error(t('orders.exportFailed', { defaultValue: 'Eksport amalga oshmadi' })),
    })
  }

  function handleBulkShip() {
    bulkShip.mutate(selectedIds, {
      onSuccess: ({ processed }) => {
        toast.success(t('orders.bulk.shipped', { count: processed, defaultValue: '{{count}} ta buyurtma joʻnatildi' }))
        setSelectedIds([])
      },
      onError: () => toast.error(t('orders.bulk.failed', { defaultValue: 'Amal bajarilmadi' })),
    })
  }

  function handleBulkArrange() {
    bulkArrange.mutate({ orderIds: selectedIds }, {
      onSuccess: ({ processed }) => {
        toast.success(t('orders.bulk.arranged', { count: processed, defaultValue: '{{count}} ta buyurtma uchun yetkazib berish tayinlandi' }))
        setSelectedIds([])
      },
      onError: () => toast.error(t('orders.bulk.failed', { defaultValue: 'Amal bajarilmadi' })),
    })
  }

  function handleGenerateDocs() {
    genDocs.mutate({ orderIds: selectedIds, types: ['shipping_label'] }, {
      onSuccess: ({ downloadUrl }) => {
        if (downloadUrl && downloadUrl !== '#mock-download') window.open(downloadUrl, '_blank')
        toast.success(t('orders.bulk.docsReady', { defaultValue: 'Hujjatlar tayyor' }))
      },
      onError: () => toast.error(t('orders.bulk.failed', { defaultValue: 'Amal bajarilmadi' })),
    })
  }

  const bulkBusy = bulkShip.isPending || bulkArrange.isPending || genDocs.isPending

  return (
    <Page>
      <PageHeader
        title={t('orders.title')}
        breadcrumb={`${t('orders.breadcrumbHome')} › ${t('orders.title')}`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={exportOrders.isPending}>
              <DownloadIcon size={14} />
              {t('orders.export')}
            </Button>
            <Button variant="outline" size="sm">
              {t('orders.exportHistory')}
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden">
        {/* Primary tabs */}
        <OrderStatusTabs active={status} summary={data?.summary} onChange={changeStatus} />

        {/* Return/Refund tab → show the RETURN view instead of order rows. */}
        {status === 'return_refund' ? (
          <ReturnsPanel />
        ) : (
          <>
            {/* Sub-tabs (To Ship / Cancellation only) */}
            {subTabs && (
              <OrderSubTabs tabs={subTabs} active={subStatus} onChange={setSubStatus} />
            )}

            {/* Filter bar */}
            <OrderFilters
              orderId={orderId}
              shippingChannel={shippingChannel}
              onOrderIdChange={setOrderId}
              onShippingChannelChange={setChannel}
              onApply={() => { setPage(1); void refetch() }}
              onReset={() => { resetSearch(); setPage(1); void refetch() }}
            />

            {/* Inline bulk action bar (ORD-006) */}
            {selectedIds.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-b border-border bg-bg px-4 py-2">
                <span className="text-sm font-semibold text-text">
                  {t('orders.bulk.selected', { count: selectedIds.length, defaultValue: '{{count}} tanlandi' })}
                </span>
                <div className="ml-auto flex flex-wrap gap-2">
                  <Button size="sm" onClick={handleBulkShip} disabled={bulkBusy}>
                    {t('orders.bulk.ship', { defaultValue: 'Joʻnatish' })}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleBulkArrange} disabled={bulkBusy}>
                    {t('orders.bulk.arrange', { defaultValue: 'Yetkazishni tayinlash' })}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleGenerateDocs} disabled={bulkBusy}>
                    {t('orders.bulk.documents', { defaultValue: 'Hujjatlar' })}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
                    {t('orders.bulk.clear', { defaultValue: 'Bekor qilish' })}
                  </Button>
                </div>
              </div>
            )}

            {/* Results bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2">
              <span className="text-sm font-semibold text-text">
                {t('orders.parcels', { count: total })}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  {t('orders.sortBy')}: {t('orders.sortByDate')}
                  <ChevronDownIcon size={12} />
                </Button>
                {status === 'to_ship' && (
                  <Button size="sm" onClick={() => navigate('/orders/mass-ship')}>
                    {t('orders.massShip')}
                  </Button>
                )}
              </div>
            </div>

            {/* Table / error */}
            {isError ? (
              <ErrorState
                title={t('orders.loadError', { defaultValue: 'Maʼlumotni yuklab boʻlmadi' })}
                retryLabel={t('common.retry', { defaultValue: 'Qayta urinish' })}
                onRetry={() => void refetch()}
              />
            ) : (
              <OrderTable
                orders={orders}
                isLoading={isLoading}
                activeStatus={status}
                searchActive={Boolean(orderId) || Boolean(shippingChannel)}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onSelectAll={setSelectedIds}
                onArrangeShipment={(id) => navigate(`/orders/${id}`)}
              />
            )}

            {/* Completed tab footer */}
            {status === 'completed' && data?.archiveCutoffDate && (
              <div className="border-t border-border px-4 py-3 text-xs text-muted">
                {t('orders.archiveFooter', { date: data.archiveCutoffDate })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border p-3">
                <span className="text-xs text-muted">
                  {t('orders.pageOf', { page, pages: totalPages, defaultValue: '{{page}} / {{pages}}-sahifa' })}
                </span>
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            )}
          </>
        )}
      </Card>
    </Page>
  )
}
