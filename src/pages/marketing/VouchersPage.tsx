import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Page } from '@/components/ui/Page'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatCard } from '@/components/ui/StatCard'
import { Tabs } from '@/components/ui/Tabs'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { formatUZS } from '@/utils/money'
import {
  ChevronRight, MarketingNav, SearchIcon, TicketIcon, useVouchers, useDeleteVoucher,
} from '@/features/marketing'
import type { VoucherStatus } from '@/features/marketing'
import { VoucherTypeTiles } from './VoucherTypeTiles'

function statusTone(s: VoucherStatus) {
  if (s === 'ongoing' || s === 'active') return 'success' as const
  if (s === 'upcoming') return 'info' as const
  return 'gray' as const
}

export function VouchersPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<string>('all')
  const [search, setSearch] = useState('')
  const { data, isLoading } = useVouchers(activeTab === 'all' ? undefined : activeTab, search)
  const remove = useDeleteVoucher()
  const vouchers = data?.vouchers ?? []
  const perf = data?.performance

  const tabs = [
    { key: 'all', label: t('marketing.vouchers.statusTab.all') },
    { key: 'ongoing', label: t('marketing.vouchers.statusTab.ongoing') },
    { key: 'upcoming', label: t('marketing.vouchers.statusTab.upcoming') },
    { key: 'expired', label: t('marketing.vouchers.statusTab.expired') },
  ]

  function onDelete(id: string) {
    if (window.confirm(t('marketing.vouchers.deleteConfirm'))) remove.mutate(id)
  }

  return (
    <Page>
      <PageHeader
        title={t('marketing.vouchers.title')}
        subtitle={t('marketing.vouchers.subtitle')}
        breadcrumb={
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <span>{t('marketing.centre.home')}</span>
            <ChevronRight size={14} />
            <span className="text-text-secondary">{t('marketing.vouchers.title')}</span>
          </span>
        }
        actions={
          <Link to="/marketing/vouchers/new?type=shop">
            <Button>{t('marketing.vouchers.create')}</Button>
          </Link>
        }
      />

      <MarketingNav />

      {/* Performance StatCards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('marketing.vouchers.performance.sales')} value={perf ? formatUZS(perf.salesUzs) : '—'} />
        <StatCard label={t('marketing.vouchers.performance.orders')} value={perf?.orders ?? '—'} />
        <StatCard label={t('marketing.vouchers.performance.usageRate')} value={perf ? `${perf.usageRate.toFixed(2)}%` : '—'} />
        <StatCard label={t('marketing.vouchers.performance.buyers')} value={perf?.buyers ?? '—'} />
      </div>

      {/* Create tiles */}
      <VoucherTypeTiles />

      {/* Voucher List */}
      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-text">{t('marketing.vouchers.title')}</h2>
        </div>

        <div className="border-b border-border px-5 py-3">
          <Tabs items={tabs} value={activeTab} onChange={setActiveTab} />
        </div>

        <div className="flex flex-wrap gap-2 border-b border-border px-5 py-3">
          <Input
            placeholder={t('marketing.vouchers.col.nameCode') + '...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            trailing={<SearchIcon size={15} />}
            className="flex-1 min-w-48"
          />
          <Button variant="outline">{t('common.search') || 'Search'}</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : vouchers.length === 0 ? (
          <EmptyState
            icon={<TicketIcon size={24} />}
            title={t('marketing.vouchers.empty')}
            action={
              <Link to="/marketing/vouchers/new?type=shop">
                <Button>{t('marketing.vouchers.create')}</Button>
              </Link>
            }
          />
        ) : (
          <Table>
            <thead>
              <Tr>
                <Th>{t('marketing.vouchers.col.nameCode')}</Th>
                <Th>{t('marketing.vouchers.col.type')}</Th>
                <Th>{t('marketing.vouchers.col.discountAmount')}</Th>
                <Th>{t('marketing.vouchers.col.usageQty')}</Th>
                <Th>{t('marketing.vouchers.col.claimPeriod')}</Th>
                <Th>{t('marketing.vouchers.col.action')}</Th>
              </Tr>
            </thead>
            <tbody>
              {vouchers.map((v) => (
                <Tr key={v.id}>
                  <Td>
                    <div className="flex items-start gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-brand">
                        <TicketIcon size={14} />
                      </div>
                      <div>
                        <p className="font-medium text-text">{v.name}</p>
                        <p className="font-mono text-xs text-muted">{v.code}</p>
                      </div>
                    </div>
                  </Td>
                  <Td className="text-text-secondary">{t(`marketing.vouchers.type.${v.type}`)}</Td>
                  <Td className="font-semibold text-success">
                    {v.discountType === 'fixed' ? formatUZS(v.discountValue) : `${v.discountValue}%`}
                  </Td>
                  <Td>{v.usageQtyTotal}</Td>
                  <Td className="text-xs text-muted">{v.claimStart} — {v.claimEnd}</Td>
                  <Td>
                    <div className="flex flex-col items-start gap-1.5">
                      <Badge tone={statusTone(v.status)}>
                        {t(`marketing.vouchers.status.${v.status}`)}
                      </Badge>
                      <Button variant="ghost" size="sm" className="px-0 text-brand">{t('marketing.vouchers.edit')}</Button>
                      <Button variant="ghost" size="sm" className="px-0 text-brand" onClick={() => onDelete(v.id)} disabled={remove.isPending}>
                        {t('marketing.vouchers.delete')}
                      </Button>
                      <Button variant="ghost" size="sm" className="px-0 text-brand">{t('marketing.vouchers.duplicate')}</Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text">{t('marketing.vouchers.education.title')}</p>
          <Button variant="ghost" size="sm">{t('marketing.vouchers.learnMore')}</Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-6 text-sm text-text-secondary">
          <span>• {t('marketing.vouchers.education.link1')}</span>
          <span>• {t('marketing.vouchers.education.link2')}</span>
        </div>
      </Card>
    </Page>
  )
}
