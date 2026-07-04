import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatCard } from '@/components/ui/StatCard'
import { Tabs } from '@/components/ui/Tabs'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import {
  ChevronRight,
  MarketingNav,
  Plus,
  StarIcon,
  useReviewPrizes,
  useEndReviewPrize,
  useDuplicateReviewPrize,
} from '@/features/marketing'
import type { ReviewPrizeStatus } from '@/features/marketing'

function statusTone(s: ReviewPrizeStatus) {
  if (s === 'active') return 'success' as const
  return 'gray' as const
}

export function ReviewPrizePage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<string>('all')
  const { data, isLoading } = useReviewPrizes(activeTab === 'all' ? undefined : activeTab)
  const endMutation = useEndReviewPrize()
  const duplicateMutation = useDuplicateReviewPrize()

  const prizes = data?.prizes ?? []
  const metrics = data?.metrics

  function handleEnd(id: string) {
    if (window.confirm(t('marketing.reviewPrize.endConfirm'))) endMutation.mutate(id)
  }

  const tabItems = [
    { key: 'all', label: t('marketing.reviewPrize.tabAll'), count: data?.total },
    { key: 'active', label: t('marketing.reviewPrize.tabActive'), count: data?.active },
    { key: 'inactive', label: t('marketing.reviewPrize.tabInactive'), count: data?.inactive },
  ]

  return (
    <Page>
      <PageHeader
        title={t('marketing.reviewPrize.title')}
        breadcrumb={
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <span>{t('marketing.centre.home')}</span>
            <ChevronRight size={14} />
            <span className="text-text-secondary">{t('marketing.reviewPrize.title')}</span>
          </span>
        }
        actions={
          <Button size="sm">
            <Plus size={16} />
            {t('marketing.reviewPrize.createBtn')}
          </Button>
        }
      />

      <MarketingNav />

      {/* Key Metrics — StatCards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label={t('marketing.reviewPrize.reviewsGained')}
          value={metrics?.reviewsGained ?? 0}
          hint={t('marketing.reviewPrize.metricsDate', { from: '09-06-2026', to: '16-06-2026' })}
        />
        <StatCard
          label={t('marketing.reviewPrize.views')}
          value={metrics?.views ?? 0}
        />
        <StatCard
          label={t('marketing.reviewPrize.orders')}
          value={metrics?.orders ?? 0}
        />
      </div>

      {/* Prize List */}
      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-text">{t('marketing.reviewPrize.title')}</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">{t('marketing.reviewPrize.learnMore')}</Button>
            <Button size="sm">
              <Plus size={15} />
              {t('marketing.reviewPrize.createBtn')}
            </Button>
          </div>
        </div>

        <div className="border-b border-border px-5 py-3">
          <Tabs items={tabItems} value={activeTab} onChange={setActiveTab} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : prizes.length === 0 ? (
          <EmptyState
            icon={<StarIcon size={24} />}
            title={t('marketing.reviewPrize.empty')}
            action={
              <Button size="sm">
                <Plus size={15} />
                {t('marketing.reviewPrize.createBtn')}
              </Button>
            }
          />
        ) : (
          <Table>
            <thead>
              <Tr>
                <Th>{t('marketing.reviewPrize.colItems')}</Th>
                <Th>{t('marketing.reviewPrize.colUnusedBudget')}</Th>
                <Th>{t('marketing.reviewPrize.colReviewsGained')}</Th>
                <Th>{t('marketing.reviewPrize.colOrders')}</Th>
                <Th>{t('marketing.reviewPrize.colStatus')}</Th>
                <Th>{t('marketing.reviewPrize.colActions')}</Th>
              </Tr>
            </thead>
            <tbody>
              {prizes.map((prize) => (
                <Tr key={prize.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {prize.productThumbs.length > 0
                          ? prize.productThumbs.slice(0, 3).map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt=""
                                className="h-10 w-10 rounded-md border border-border object-cover"
                              />
                            ))
                          : [0, 1, 2].map((i) => (
                              <div key={i} className="h-10 w-10 rounded-md border border-border bg-bg" />
                            ))}
                      </div>
                      <p className="font-medium text-text">{prize.name}</p>
                    </div>
                  </Td>
                  <Td>
                    {prize.unusedBudget}{' '}
                    <span className="text-muted text-xs">{t('marketing.reviewPrize.points', { count: prize.unusedBudget })}</span>
                  </Td>
                  <Td>
                    {prize.reviewsGained > 0 ? (
                      <span>
                        {prize.reviewsGained}{' '}
                        <Button variant="ghost" size="sm" className="px-0 text-brand h-auto">
                          {t('marketing.reviewPrize.viewReviews')}
                        </Button>
                      </span>
                    ) : (
                      <span className="text-text">{prize.reviewsGained}</span>
                    )}
                  </Td>
                  <Td>{prize.orders > 0 ? prize.orders : '—'}</Td>
                  <Td>
                    <Badge tone={statusTone(prize.status)}>
                      {t(`marketing.reviewPrize.status.${prize.status}`)}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex flex-col items-start gap-1">
                      {prize.status === 'active' ? (
                        <>
                          <Button variant="ghost" size="sm" className="px-0 text-brand">
                            {t('marketing.reviewPrize.edit')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-0 text-brand"
                            onClick={() => handleEnd(prize.id)}
                            disabled={endMutation.isPending}
                          >
                            {endMutation.isPending ? <Spinner className="h-3 w-3" /> : null}
                            {t('marketing.reviewPrize.end')}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" className="px-0 text-brand">
                            {t('marketing.reviewPrize.details')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-0 text-brand"
                            onClick={() => duplicateMutation.mutate(prize.id)}
                            disabled={duplicateMutation.isPending}
                          >
                            {t('marketing.reviewPrize.duplicate')}
                          </Button>
                        </>
                      )}
                    </div>
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
