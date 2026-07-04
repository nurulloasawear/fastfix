import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Page } from '@/components/ui/Page'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  AnnouncementCard,
  ChevronRight,
  MarketingNav,
  ZapIcon,
  TicketIcon,
  TruckIcon,
  Megaphone,
  UsersIcon,
  GiftIcon,
  StarIcon,
  useMarketingCentre,
} from '@/features/marketing'

const TOOLS = [
  { labelKey: 'promotions.title', route: '/marketing/promotions', Icon: ZapIcon, comingSoon: false },
  { labelKey: 'marketing.nav.centre', route: '/marketing/discount', Icon: TicketIcon, comingSoon: false },
  { labelKey: 'marketing.nav.flashDeals', route: '/marketing/flash-deals', Icon: TruckIcon, comingSoon: false },
  { labelKey: 'marketing.nav.vouchers', route: '/marketing/vouchers', Icon: TicketIcon, comingSoon: false },
  { labelKey: 'marketing.nav.ads', route: '/marketing/ads', Icon: Megaphone, comingSoon: false },
  { labelKey: 'marketing.nav.creators', route: '/marketing/creators', Icon: UsersIcon, comingSoon: false },
  { labelKey: 'marketing.nav.reviewPrize', route: '/marketing/review-prize', Icon: StarIcon, comingSoon: false },
  { labelKey: 'marketing.nav.shipping', route: '#', Icon: GiftIcon, comingSoon: true },
] as const

export function MarketingCentrePage() {
  const { t } = useTranslation()
  const { data, isLoading } = useMarketingCentre()
  const announcements = data?.announcements ?? []

  return (
    <Page>
      <PageHeader
        title={t('marketing.centre.title')}
        breadcrumb={
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <span>{t('marketing.centre.home')}</span>
            <ChevronRight size={14} />
            <span className="text-text-secondary">{t('marketing.centre.title')}</span>
          </span>
        }
      />

      <MarketingNav />

      {/* Marketing Tools grid */}
      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-text">{t('marketing.centre.tools')}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {TOOLS.map(({ labelKey, route, Icon, comingSoon }) => (
            <Link
              key={labelKey}
              to={comingSoon ? '#' : route}
              className="group flex flex-col gap-3 rounded-lg border border-border bg-bg p-4 transition-colors hover:border-brand hover:bg-surface"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-brand">
                <Icon size={20} />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-text">{t(labelKey)}</p>
                {comingSoon && (
                  <Badge tone="gray" className="text-xs">{t('marketing.centre.comingSoon')}</Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="mt-4">
          {t('marketing.centre.viewMoreTools')}
        </Button>
      </Card>

      {/* OZB Campaigns */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text">{t('marketing.centre.campaigns')}</h2>
          <Link to="/marketing/campaigns">
            <Button variant="ghost" size="sm">
              {t('marketing.centre.more')} →
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : announcements.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">{t('marketing.centre.noCampaigns')}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        )}
      </Card>
    </Page>
  )
}
