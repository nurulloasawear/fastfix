import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatCard } from '@/components/ui/StatCard'
import { Tabs } from '@/components/ui/Tabs'
import { Badge } from '@/components/ui/Badge'
import { formatUZS } from '@/utils/money'
import {
  AdsChart,
  AdsMetricGrid,
  AdsTable,
  ChevronRight,
  MarketingNav,
  Plus,
  AlertIcon,
  BarChartIcon,
  useAds,
} from '@/features/marketing'
import type { MetricKey } from '@/features/marketing'

const AD_TABS = [
  { key: 'all', label: 'marketing.ads.tabAll' },
  { key: 'product', label: 'marketing.ads.tabProduct' },
] as const

export function AdsPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useAds()
  const metrics = data?.metrics
  const recs = data?.recommendations ?? []
  const zeroBal = metrics ? metrics.adsCreditUzs === 0 : false

  const [adsTab, setAdsTab] = useState('all')
  const [activeMetric, setActiveMetric] = useState<MetricKey>('impressions')

  const tabItems = AD_TABS.map((tab) => ({ key: tab.key, label: t(tab.label) }))

  return (
    <Page>
      <PageHeader
        title={t('marketing.ads.title')}
        subtitle={t('marketing.ads.subtitle')}
        breadcrumb={
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <span>{t('marketing.centre.home')}</span>
            <ChevronRight size={14} />
            <span>{t('marketing.centre.title')}</span>
            <ChevronRight size={14} />
            <span className="text-text-secondary">{t('marketing.ads.title')}</span>
          </span>
        }
        actions={
          <Button>
            <Plus size={16} />
            {t('marketing.ads.createAd')}
          </Button>
        }
      />

      <MarketingNav />

      {/* KPI row — StatCards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t('marketing.ads.adsCredit')}
          value={metrics ? formatUZS(metrics.adsCreditUzs) : '—'}
          delta={zeroBal ? { value: t('marketing.ads.zeroBannerTitle'), positive: false } : undefined}
        />
        <StatCard
          label={t('marketing.ads.adsDeposit')}
          value={metrics ? formatUZS(metrics.adsDepositUzs) : '—'}
        />
        <StatCard
          label={t('marketing.ads.last7Days')}
          value={metrics ? formatUZS(metrics.gmvUzs) : '—'}
        />
        <StatCard
          label={t('marketing.ads.metric.roas')}
          value={metrics ? metrics.roas.toFixed(2) : '—'}
          hint={t('marketing.ads.campaignsCount') + ': ' + (data?.campaigns.length ?? '—')}
        />
      </div>

      {/* Zero balance warning */}
      {zeroBal && (
        <div className="flex items-start gap-3 rounded-lg border border-error-text bg-error-bg p-4">
          <AlertIcon size={18} className="mt-0.5 shrink-0 text-error-text" />
          <div>
            <p className="text-sm font-semibold text-error-text">{t('marketing.ads.zeroBannerTitle')}</p>
            <p className="mt-0.5 text-sm text-error-text">{t('marketing.ads.zeroBannerBody')}</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto shrink-0">
            {t('marketing.ads.enableAutoTopup')}
          </Button>
        </div>
      )}

      {/* Promo Credit panel */}
      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <span className="text-sm font-semibold text-text">{t('marketing.ads.promoCredit')}</span>
          <div className="mt-2 flex gap-6">
            <div>
              <p className="text-xs text-muted">{t('marketing.ads.discountRate')}</p>
              <p className="text-base font-semibold text-text">—</p>
            </div>
            <div>
              <p className="text-xs text-muted">{t('marketing.ads.discountAmount')}</p>
              <p className="text-base font-semibold text-text">—</p>
            </div>
          </div>
        </div>
        <Badge tone="gray">[PENDING BACKEND]</Badge>
      </Card>

      {/* Recommendations */}
      {recs.length > 0 && (
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-text">{t('marketing.ads.recommendations')}</span>
            <Button variant="ghost" size="sm">{t('marketing.ads.seeAll')}</Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {recs.map((rec) => (
              <div key={rec.id} className="rounded-lg border border-border bg-bg p-4 hover:border-brand transition-colors">
                <p className="text-sm font-semibold text-text">
                  {rec.title.en ?? rec.title.uz ?? ''}
                </p>
                <p className="mt-1 text-xs text-muted">{rec.body.en ?? rec.body.uz ?? ''}</p>
                <Button variant="ghost" size="sm" className="mt-2 px-0">
                  {rec.cta.en ?? rec.cta.uz ?? ''}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* All Ads Performance */}
      <Card className="flex flex-col gap-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-text">{t('marketing.ads.allStats')}</h2>
          <div className="flex items-center gap-3">
            <Tabs
              items={tabItems}
              value={adsTab}
              onChange={setAdsTab}
            />
            <Button variant="outline" size="sm">{t('marketing.ads.exportCsv')}</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : data ? (
          <>
            <AdsMetricGrid metrics={data.metrics} active={activeMetric} onSelect={setActiveMetric} />
            <AdsChart series={data.series} />
          </>
        ) : null}
      </Card>

      {/* Ads List table */}
      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : !data || data.campaigns.length === 0 ? (
          <EmptyState
            icon={<BarChartIcon size={24} />}
            title={t('marketing.ads.empty')}
            action={
              <Button>
                <Plus size={16} />
                {t('marketing.ads.createAd')}
              </Button>
            }
          />
        ) : (
          <AdsTable campaigns={data.campaigns} isLoading={false} />
        )}
      </Card>

      {/* Education */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text">{t('marketing.ads.education')}</span>
          <Button variant="ghost" size="sm">{t('marketing.ads.learnMore')}</Button>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm text-text-secondary">
          <span>• Product Ad Introduction</span>
          <span>• How to Choose the Right Products</span>
          <span>• Shop Ad Introduction</span>
          <span>• Top Up Your Ads Credit</span>
        </div>
      </Card>
    </Page>
  )
}
