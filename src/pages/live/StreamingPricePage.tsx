import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  useStreamingPricePromotions,
  useDeletePromotion,
  PromotionStatusBadge,
  PROMOTION_STATUS_FILTERS,
  ChevronDownIcon,
  SearchIcon,
  CalendarIcon,
  MegaphoneIcon,
} from '@/features/live'
import type { PromotionStatusFilter } from '@/features/live'

function formatPeriod(startAt: string, endAt: string) {
  const fmt = (s: string) => {
    const d = new Date(s)
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
  return `${fmt(startAt)} – ${fmt(endAt)}`
}

export function StreamingPricePage() {
  const { t } = useTranslation()
  const [statusFilter, setStatusFilter] = useState<PromotionStatusFilter>('all')
  const [nameSearch, setNameSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data } = useStreamingPricePromotions({ status: statusFilter, name: appliedSearch })
  const deleteMutation = useDeletePromotion()

  const promotions = data?.promotions ?? []
  const total = data?.total ?? 0

  return (
    <Page>
      <PageHeader
        title={t('live.streamingPrice.title')}
        breadcrumb={`${t('live.nav.streamingPrice')} › ${t('live.streamingPrice.title')}`}
        actions={
          <>
            <Link to="/live/analytics">
              <Button variant="outline" size="sm">
                {t('live.streamingPrice.liveDashboard')} &rsaquo;
              </Button>
            </Link>
            <Link to="/live/streaming-price/create">
              <Button size="sm">+ {t('live.streamingPrice.create')}</Button>
            </Link>
          </>
        }
      />

      <Card className="overflow-hidden">
        {/* Filter bar */}
        <div className="flex flex-wrap items-end gap-3 border-b border-border p-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-text-secondary">
              {t('live.analytics.search', { defaultValue: 'Search' })}
            </span>
            <Input
              placeholder={t('live.streamingPrice.searchPlaceholder')}
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              trailing={<SearchIcon size={15} />}
              className="w-56"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-text-secondary">
              {t('live.streamingPrice.promotionPeriod')}
            </span>
            <button
              type="button"
              className="flex h-11 w-56 items-center gap-2 rounded-lg border border-border-strong bg-surface px-3.5 text-sm text-muted hover:bg-bg"
            >
              <CalendarIcon size={14} />
              {t('live.streamingPrice.startToEnd')}
            </button>
          </label>
          <div className="flex items-end gap-2 pb-0.5">
            <Button size="sm" onClick={() => setAppliedSearch(nameSearch)}>
              {t('live.streamingPrice.search')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setNameSearch(''); setAppliedSearch(''); setStatusFilter('all') }}
            >
              {t('live.streamingPrice.reset')}
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table>
          <thead>
            <Tr>
              <Th>
                <button
                  type="button"
                  className="flex items-center gap-1"
                  onClick={() => {
                    const idx = PROMOTION_STATUS_FILTERS.indexOf(statusFilter)
                    setStatusFilter(PROMOTION_STATUS_FILTERS[(idx + 1) % PROMOTION_STATUS_FILTERS.length])
                  }}
                >
                  {statusFilter === 'all'
                    ? t('live.streamingPrice.statusAll')
                    : t(`live.streamingPrice.status${statusFilter.charAt(0).toUpperCase()}${statusFilter.slice(1)}`)}
                  <ChevronDownIcon size={13} />
                </button>
              </Th>
              <Th>{t('live.streamingPrice.colProducts')}</Th>
              <Th>{t('live.streamingPrice.colPeriod')}</Th>
              <Th className="text-right">{t('live.streamingPrice.colActions')}</Th>
            </Tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <Tr key={promo.id}>
                <Td>
                  <PromotionStatusBadge status={promo.status} />
                </Td>
                <Td>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-text">{promo.name}</span>
                    <div className="flex flex-wrap gap-1">
                      {promo.products.slice(0, 3).map((p) => (
                        <span key={p.productId} className="rounded bg-bg px-1.5 py-0.5 text-xs text-text-secondary">
                          {p.productName}
                        </span>
                      ))}
                      {promo.products.length > 3 && (
                        <span className="rounded bg-bg px-1.5 py-0.5 text-xs text-muted">
                          +{promo.products.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Td>
                <Td className="text-xs text-text-secondary">
                  {formatPeriod(promo.startAt, promo.endAt)}
                </Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/live/streaming-price/${promo.id}/edit`}
                      className="text-xs font-medium text-brand hover:underline"
                    >
                      {t('live.streamingPrice.actionEdit')}
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-error-text hover:text-error-text"
                      onClick={() => setDeleteId(promo.id)}
                    >
                      {t('live.streamingPrice.actionDelete')}
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>

        {promotions.length === 0 && (
          <EmptyState
            icon={<MegaphoneIcon size={28} />}
            title={t('live.streamingPrice.noResults')}
          />
        )}

        {/* Footer count */}
        <div className="border-t border-border px-4 py-3 text-xs text-muted">
          {t('live.streamingPrice.resultsCount', { count: total })}
        </div>
      </Card>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title={t('live.streamingPrice.deleteConfirm')}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>
              {t('live.streamingPrice.deleteConfirmCancel')}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (!deleteId) return
                deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) })
              }}
            >
              {t('live.streamingPrice.deleteConfirmOk')}
            </Button>
          </>
        }
        size="sm"
      >
        <p className="text-sm text-text">{t('live.streamingPrice.deleteConfirm')}</p>
      </Modal>
    </Page>
  )
}
