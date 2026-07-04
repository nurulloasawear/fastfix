import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Page } from '@/components/ui/Page'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatCard } from '@/components/ui/StatCard'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { formatUZS } from '@/utils/money'
import { ChevronRight, MarketingNav, Plus, ZapIcon, AlertIcon, useFlashDeals } from '@/features/marketing'
import type { FlashDealStatus } from '@/features/marketing'

function statusTone(s: FlashDealStatus) {
  if (s === 'active') return 'success' as const
  if (s === 'upcoming') return 'info' as const
  if (s === 'expired') return 'gray' as const
  return 'gray' as const
}

export function FlashDealsPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useFlashDeals()
  const deals = data?.deals ?? []
  const perf = data?.performance

  return (
    <Page>
      <PageHeader
        title={t('marketing.flashDeals.title')}
        breadcrumb={
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <span>{t('marketing.centre.home')}</span>
            <ChevronRight size={14} />
            <span className="text-text-secondary">{t('marketing.flashDeals.title')}</span>
          </span>
        }
        actions={
          <Link to="/marketing/flash-deals/new">
            <Button>
              <Plus size={16} />
              {t('marketing.flashDeals.createBtn')}
            </Button>
          </Link>
        }
      />

      <MarketingNav />

      {/* Info banner */}
      <div className="flex items-start justify-between gap-3 rounded-lg border border-warning bg-warning-bg px-4 py-3 text-sm text-warning">
        <div className="flex items-start gap-2">
          <AlertIcon size={16} className="mt-0.5 shrink-0" />
          <span>{t('marketing.flashDeals.infoBanner')}</span>
        </div>
        <button type="button" className="shrink-0 text-warning transition-opacity hover:opacity-60">✕</button>
      </div>

      {/* Performance — StatCards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t('marketing.flashDeals.performanceSales')}
          value={perf ? formatUZS(perf.salesUzs) : '0'}
          delta={{ value: '0.00%', positive: true }}
          hint={t('marketing.flashDeals.prevDays')}
        />
        <StatCard
          label={t('marketing.flashDeals.performanceOrders')}
          value={perf?.orders ?? 0}
          delta={{ value: '0.00%', positive: true }}
          hint={t('marketing.flashDeals.prevDays')}
        />
        <StatCard
          label={t('marketing.flashDeals.performanceBuyers')}
          value={perf?.buyers ?? 0}
          delta={{ value: '0.00%', positive: true }}
          hint={t('marketing.flashDeals.prevDays')}
        />
        <StatCard
          label={t('marketing.flashDeals.performanceCtr')}
          value={perf ? `${perf.ctr}%` : '0%'}
          hint={t('marketing.flashDeals.prevDays') + ' —%'}
        />
      </div>

      {/* Promotion list */}
      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-text">
              {t('marketing.flashDeals.performanceTitle')}
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              {t('marketing.flashDeals.step3Desc')}{' '}
              <Button variant="ghost" size="sm" className="px-0 h-auto text-brand">
                {t('marketing.flashDeals.learnMore')}
              </Button>
            </p>
          </div>
          <Link to="/marketing/flash-deals/new">
            <Button>
              <Plus size={16} />
              {t('marketing.flashDeals.createBtn')}
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : deals.length === 0 ? (
          <EmptyState
            icon={<ZapIcon size={24} />}
            title={t('marketing.flashDeals.empty')}
            description={t('marketing.flashDeals.step1Desc')}
            action={
              <div className="flex flex-col items-center gap-8">
                <div className="grid grid-cols-3 gap-8">
                  {(['step1', 'step2', 'step3'] as const).map((step, i) => (
                    <div key={step} className="flex flex-col items-center gap-2 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-brand">
                        <span className="text-2xl font-bold text-brand">{i + 1}</span>
                      </div>
                      <p className="text-sm font-semibold text-brand">{t(`marketing.flashDeals.${step}`)}</p>
                      <p className="text-xs text-muted">{t(`marketing.flashDeals.${step}Desc`)}</p>
                    </div>
                  ))}
                </div>
                <Link to="/marketing/flash-deals/new">
                  <Button size="lg">
                    <Plus size={18} />
                    {t('marketing.flashDeals.createBigBtn')}
                  </Button>
                </Link>
              </div>
            }
          />
        ) : (
          <Table>
            <thead>
              <Tr>
                <Th>{t('marketing.flashDeals.colTimeSlot')}</Th>
                <Th>{t('marketing.flashDeals.colFlashPrice')}</Th>
                <Th>{t('marketing.flashDeals.colPromoStock')}</Th>
                <Th>{t('marketing.flashDeals.colStatus')}</Th>
                <Th>{t('marketing.flashDeals.colActions')}</Th>
              </Tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <Tr key={deal.id}>
                  <Td className="font-medium">{deal.timeSlot}</Td>
                  <Td>{formatUZS(deal.flashPriceUzs)}</Td>
                  <Td>{deal.promoStock}</Td>
                  <Td>
                    <Badge tone={statusTone(deal.status)}>
                      {t(`marketing.flashDeals.status.${deal.status}`)}
                    </Badge>
                  </Td>
                  <Td>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Page>
  )
}
