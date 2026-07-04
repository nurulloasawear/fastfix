import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Page } from '@/components/ui/Page'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Tabs } from '@/components/ui/Tabs'
import { Select } from '@/components/ui/Select'
import { pickLang } from '@/lib/lang'
import type { Language } from '@/i18n'
import { ChevronRight, MarketingNav, useCampaigns, Megaphone } from '@/features/marketing'
import type { CampaignSellerStatus, CampaignType } from '@/features/marketing'

const TYPE_FILTERS: { key: string; labelKey: string }[] = [
  { key: 'all', labelKey: 'marketing.campaigns.typeAll' },
  { key: 'product', labelKey: 'marketing.campaigns.typeProduct' },
  { key: 'voucher', labelKey: 'marketing.campaigns.typeVoucher' },
  { key: 'flash_sale', labelKey: 'marketing.campaigns.typeFlashSale' },
  { key: 'live_stream', labelKey: 'marketing.campaigns.typeLiveStream' },
]

function deadlineUrgent(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now()
  return diff < 3 * 86400000 && diff > 0
}

export function CampaignsPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language
  const [sellerTab, setSellerTab] = useState<CampaignSellerStatus>('available')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const { data, isLoading } = useCampaigns(sellerTab, typeFilter === 'all' ? undefined : typeFilter)

  const campaigns = data?.campaigns ?? []
  const counts = {
    available: data?.available ?? 0,
    invited: data?.invited ?? 0,
    pending: data?.pending ?? 0,
    nominated: data?.nominated ?? 0,
  }

  const sellerTabItems = [
    { key: 'available', label: t('marketing.campaigns.tabAvailable'), count: counts.available },
    { key: 'invited', label: t('marketing.campaigns.tabInvited'), count: counts.invited },
    { key: 'pending', label: t('marketing.campaigns.tabPending'), count: counts.pending },
    { key: 'nominated', label: t('marketing.campaigns.tabNominated'), count: counts.nominated },
  ]

  const typeTabItems = TYPE_FILTERS.map(({ key, labelKey }) => ({
    key,
    label: t(labelKey),
  }))

  return (
    <Page>
      <PageHeader
        title={t('marketing.campaigns.title')}
        breadcrumb={
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <span>{t('marketing.centre.home')}</span>
            <ChevronRight size={14} />
            <span className="text-text-secondary">{t('marketing.campaigns.title')}</span>
          </span>
        }
        actions={
          <Button variant="ghost" size="sm">{t('marketing.campaigns.learnMore')}</Button>
        }
      />

      <MarketingNav />

      {/* Sort + status tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs items={sellerTabItems} value={sellerTab} onChange={(k) => setSellerTab(k as CampaignSellerStatus)} />
        <Select className="w-52">
          <option>{t('marketing.campaigns.sortDefault')}</option>
        </Select>
      </div>

      {/* Campaign type filter */}
      <Tabs items={typeTabItems} value={typeFilter} onChange={(k) => setTypeFilter(k as CampaignType | 'all')} />

      {/* Campaign grid */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : campaigns.length === 0 ? (
        <Card className="p-0">
          <EmptyState
            icon={<Megaphone size={24} />}
            title={t('marketing.campaigns.empty')}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {campaigns.map((c) => {
            const isUrgent = deadlineUrgent(c.nominationDeadline)
            return (
              <Card key={c.id} className="flex flex-col gap-0 overflow-hidden p-0">
                {/* Banner */}
                <div className="h-32 w-full bg-table-header flex items-center justify-center text-muted text-sm">
                  {pickLang(c.name, lang)}
                </div>

                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge tone="info" className="mb-1 capitalize">
                        {t(`marketing.campaigns.type${c.type.charAt(0).toUpperCase()}${c.type.slice(1).replace('_', '')}`, c.type)}
                      </Badge>
                      <p className="text-sm font-semibold text-text">{pickLang(c.name, lang)}</p>
                      <p className="text-xs text-muted">{c.startAt} — {c.endAt}</p>
                    </div>
                  </div>

                  <p className={`text-xs font-medium ${isUrgent ? 'text-warning' : 'text-muted'}`}>
                    {t('marketing.campaigns.endsIn')} {c.nominationDeadline}
                  </p>

                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted">
                    <span>{t('marketing.campaigns.sessions', { count: c.sessionCount })}</span>
                    <span>{t('marketing.campaigns.pending', { count: c.pendingCount })}</span>
                    <span>{t('marketing.campaigns.nominated', { count: c.nominatedCount })}</span>
                  </div>

                  <div className="mt-1">
                    {c.sellerStatus === 'available' ? (
                      <Link to={`/marketing/campaigns/${c.id}`}>
                        <Button size="sm" className="w-full">
                          {t('marketing.campaigns.nominateNow')}
                        </Button>
                      </Link>
                    ) : (
                      <Link to={`/marketing/campaigns/${c.id}`}>
                        <Button size="sm" variant="outline" className="w-full">
                          {t('marketing.campaigns.viewDetails')}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </Page>
  )
}
