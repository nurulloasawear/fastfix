import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  DeleteConfirmModal,
  DiscountFilters,
  DiscountFormModal,
  DiscountMobileList,
  DiscountStats,
  DiscountTable,
  Plus,
  TicketIcon,
  useDeleteDiscount,
  useDiscounts,
  useDiscountsUi,
  useToggleDiscountStatus,
} from '@/features/discounts'
import type { DiscountListQuery, DiscountSummary } from '@/features/discounts'

const EMPTY_SUMMARY: DiscountSummary = { total: 0, active: 0, expired: 0, totalUsed: 0 }

// THIN page: composes the discounts feature. All data/logic lives in the feature.
export function DiscountListPage() {
  const { t } = useTranslation()
  const ui = useDiscountsUi()

  const query = useMemo<DiscountListQuery>(
    () => ({
      status: ui.status,
      type: ui.type,
      search: ui.search || undefined,
    }),
    [ui.status, ui.type, ui.search],
  )

  const { data, isLoading } = useDiscounts(query)
  const toggle = useToggleDiscountStatus()
  const remove = useDeleteDiscount()

  const discounts = data?.discounts ?? []
  const summary = data?.summary ?? EMPTY_SUMMARY
  const hasResults = discounts.length > 0 || isLoading

  return (
    <Page>
      <PageHeader
        title={t('discounts.title')}
        breadcrumb={`${t('discounts.home')} › ${t('discounts.title')}`}
        actions={
          <Button onClick={ui.openCreate}>
            <Plus size={16} /> {t('discounts.create')}
          </Button>
        }
      />

      <DiscountStats summary={summary} status={ui.status} onSelect={ui.setStatus} />

      <DiscountFilters
        search={ui.search}
        status={ui.status}
        type={ui.type}
        onSearch={ui.setSearch}
        onStatus={ui.setStatus}
        onType={ui.setType}
      />

      {!hasResults ? (
        <EmptyState
          icon={<TicketIcon size={24} />}
          title={t('discounts.empty.title')}
          description={t('discounts.empty.desc')}
          action={
            <div className="flex flex-col items-center gap-2">
              <Button variant="ghost" onClick={ui.resetFilters}>
                {t('discounts.empty.reset')}
              </Button>
              <Link to="/discounts/create" className="text-sm font-semibold text-brand hover:underline">
                {t('discounts.create')}
              </Link>
            </div>
          }
        />
      ) : (
        <>
          <DiscountTable
            discounts={discounts}
            isLoading={isLoading}
            onToggle={(id) => toggle.mutate(id)}
            onEdit={ui.openEdit}
            onDelete={ui.requestDelete}
          />
          <DiscountMobileList
            discounts={discounts}
            onToggle={(id) => toggle.mutate(id)}
            onEdit={ui.openEdit}
            onDelete={ui.requestDelete}
          />
        </>
      )}

      <DiscountFormModal open={ui.formOpen} editing={ui.editing} todayStr={today()} onClose={ui.closeForm} />
      <DeleteConfirmModal
        open={ui.deleteId !== null}
        isPending={remove.isPending}
        onCancel={ui.cancelDelete}
        onConfirm={() => {
          if (ui.deleteId) remove.mutate(ui.deleteId, { onSuccess: ui.cancelDelete })
        }}
      />
    </Page>
  )
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}
