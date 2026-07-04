import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import {
  useLiveAnalytics,
  AnalyticsMetricCard,
  AnalyticsSectionCard,
  ExternalLinkIcon,
  ChevronDownIcon,
  CalendarIcon,
  InfoIcon,
} from '@/features/live'
import type { AnalyticsInnerTab, ConversionTab, TrafficTab } from '@/features/live'

export function LiveAnalyticsPage() {
  const { t } = useTranslation()
  const [topTab, setTopTab] = useState<'live' | 'video'>('live')
  const [transactionTab, setTransactionTab] = useState<AnalyticsInnerTab>('overview')
  const [trafficTab, setTrafficTab] = useState<TrafficTab>('performance')
  const [conversionTab, setConversionTab] = useState<ConversionTab>('performance')

  const { data } = useLiveAnalytics({})

  const transaction = data?.transaction
  const traffic = data?.traffic
  const conversion = data?.conversion
  const engagement = data?.engagement
  const promotion = data?.promotion

  const metricLabel = (key: string) =>
    t(`live.analytics.metrics.${key}`, { defaultValue: key.replace(/_/g, ' ') })

  const vsLabel = t('live.analytics.vsPrevious')

  return (
    <Page>
      <PageHeader
        title={t('live.tabs.live')}
        breadcrumb={`${t('live.nav.analytics')} › ${t('live.tabs.live')}`}
        actions={
          <>
            <Link to="/live/streaming-price">
              <Button variant="outline" size="sm">+ {t('live.streamingPrice.title')}</Button>
            </Link>
            <Link to="/live/create">
              <Button size="sm">▶ {t('live.nav.createStream')}</Button>
            </Link>
          </>
        }
      />

      {/* Warning banner */}
      <div className="flex items-center gap-2 rounded-lg border border-warning bg-warning-bg px-4 py-2.5 text-xs text-warning">
        <InfoIcon size={14} />
        <span>{t('live.analytics.warningBanner')}</span>
        <a href="#" className="ml-1 font-semibold underline">{t('live.analytics.learnMore')}</a>
      </div>

      {/* Incentive banner */}
      <div className="flex items-center justify-between gap-3 rounded-lg border border-warning bg-warning-bg px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm text-warning">
          <span aria-hidden="true">🎯</span>
          <span className="font-semibold">{t('live.analytics.incentiveBanner')}</span>
        </div>
        <Button variant="outline" size="sm">
          {t('live.analytics.viewDetails')} &rsaquo;
        </Button>
      </div>

      {/* Live / Video toggle tabs */}
      <Tabs
        items={[
          { key: 'live', label: t('live.tabs.live') },
          { key: 'video', label: t('live.tabs.video') },
        ]}
        value={topTab}
        onChange={(v) => setTopTab(v as 'live' | 'video')}
      />

      {/* Filter bar */}
      <Card className="flex flex-wrap items-center gap-3 p-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-text-secondary">{t('live.analytics.datePeriod')}</span>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-3 py-1.5 text-sm text-text hover:bg-bg"
          >
            <CalendarIcon size={14} className="text-muted" />
            2026-06-16
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-text-secondary">{t('live.analytics.orderType')}</span>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-3 py-1.5 text-sm text-text hover:bg-bg"
          >
            {t('live.analytics.confirmedOrder')}
            <ChevronDownIcon size={14} className="text-muted" />
          </button>
        </div>
        <div className="ml-auto">
          <Button variant="outline" size="sm">
            <ExternalLinkIcon size={14} />
            {t('live.analytics.exportData')}
          </Button>
        </div>
      </Card>

      {/* Transaction */}
      <AnalyticsSectionCard
        title={t('live.analytics.sections.transaction')}
        tabs={[
          { label: t('live.analytics.innerTabs.overview'), value: 'overview' },
          { label: t('live.analytics.innerTabs.myShop'), value: 'my_shop' },
          { label: t('live.analytics.innerTabs.otherShops'), value: 'other_shops' },
        ]}
        activeTab={transactionTab}
        onTabChange={(v) => setTransactionTab(v as AnalyticsInnerTab)}
      >
        <div className="grid grid-cols-2 gap-0 divide-x divide-border md:grid-cols-3 lg:grid-cols-4">
          {(transaction?.cards ?? []).map((card) => (
            <AnalyticsMetricCard
              key={card.key}
              card={{ ...card, delta: card.delta ?? vsLabel }}
              label={metricLabel(card.key)}
            />
          ))}
        </div>
      </AnalyticsSectionCard>

      {/* Traffic */}
      <AnalyticsSectionCard
        title={t('live.analytics.sections.traffic')}
        tabs={[
          { label: t('live.analytics.trafficTabs.performance'), value: 'performance' },
          { label: t('live.analytics.trafficTabs.trafficSource'), value: 'traffic_source' },
        ]}
        activeTab={trafficTab}
        onTabChange={(v) => setTrafficTab(v as TrafficTab)}
      >
        <div className="grid grid-cols-2 gap-0 divide-x divide-border md:grid-cols-3 lg:grid-cols-4">
          {(traffic?.cards ?? []).map((card) => (
            <AnalyticsMetricCard
              key={card.key}
              card={{ ...card, delta: card.delta ?? vsLabel }}
              label={metricLabel(card.key)}
            />
          ))}
        </div>
      </AnalyticsSectionCard>

      {/* Conversion */}
      <AnalyticsSectionCard
        title={t('live.analytics.sections.conversion')}
        tabs={[
          { label: t('live.analytics.conversionTabs.performance'), value: 'performance' },
          { label: t('live.analytics.conversionTabs.conversionFunnel'), value: 'conversion_funnel' },
        ]}
        activeTab={conversionTab}
        onTabChange={(v) => setConversionTab(v as ConversionTab)}
      >
        <div className="grid grid-cols-2 gap-0 divide-x divide-border md:grid-cols-3">
          {(conversion?.cards ?? []).map((card) => (
            <AnalyticsMetricCard
              key={card.key}
              card={{ ...card, delta: card.delta ?? vsLabel }}
              label={metricLabel(card.key)}
            />
          ))}
        </div>
      </AnalyticsSectionCard>

      {/* Engagement */}
      <AnalyticsSectionCard title={t('live.analytics.sections.engagement')}>
        <div className="grid grid-cols-2 gap-0 divide-x divide-border md:grid-cols-4">
          {(engagement?.cards ?? []).map((card) => (
            <AnalyticsMetricCard
              key={card.key}
              card={{ ...card, delta: card.delta ?? vsLabel }}
              label={metricLabel(card.key)}
            />
          ))}
        </div>
      </AnalyticsSectionCard>

      {/* Promotion */}
      <AnalyticsSectionCard title={t('live.analytics.sections.promotion')}>
        <div className="grid grid-cols-2 gap-0 divide-x divide-border md:grid-cols-3">
          {(promotion?.cards ?? []).map((card) => (
            <AnalyticsMetricCard
              key={card.key}
              card={{ ...card, delta: card.delta ?? vsLabel }}
              label={metricLabel(card.key)}
            />
          ))}
        </div>
      </AnalyticsSectionCard>
    </Page>
  )
}
