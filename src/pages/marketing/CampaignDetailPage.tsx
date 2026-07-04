import { useTranslation } from 'react-i18next'
import { useParams, Link } from 'react-router-dom'
import { Page } from '@/components/ui/Page'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { Select } from '@/components/ui/Select'
import { Tabs } from '@/components/ui/Tabs'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { pickLang } from '@/lib/lang'
import type { Language } from '@/i18n'
import { ChevronRight, MarketingNav, useCampaignDetail, DownloadIcon } from '@/features/marketing'
import type { SessionSellerStatus } from '@/features/marketing'

function sessionTone(s: SessionSellerStatus) {
  if (s === 'active') return 'warning' as const
  if (s === 'nominated') return 'info' as const
  if (s === 'closed') return 'gray' as const
  return 'success' as const
}

export function CampaignDetailPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const lang = i18n.language as Language
  const { data, isLoading } = useCampaignDetail(id ?? '')

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </Page>
    )
  }
  if (!data) return null

  const sessionTabItems = [
    { key: 'waiting', label: t('marketing.campaigns.detail.tabWaiting') },
    { key: 'pending', label: t('marketing.campaigns.detail.tabPending') },
  ]

  return (
    <Page>
      <PageHeader
        title={pickLang(data.name, lang)}
        breadcrumb={
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <span>{t('marketing.centre.home')}</span>
            <ChevronRight size={14} />
            <Link to="/marketing/campaigns" className="hover:underline">
              {t('marketing.campaigns.detail.breadcrumbNominations')}
            </Link>
            <ChevronRight size={14} />
            <span className="text-text-secondary">{t('marketing.campaigns.detail.breadcrumbDetail')}</span>
          </span>
        }
        actions={
          <Button variant="outline" size="sm">
            {t('marketing.campaigns.detail.viewReport')}
          </Button>
        }
      />

      <MarketingNav />

      {/* Campaign banner */}
      <div className="h-44 w-full rounded-xl bg-table-header flex items-center justify-center text-muted text-base font-medium">
        {pickLang(data.name, lang)}
      </div>

      {/* Campaign info */}
      <Card className="p-5">
        <p className="text-base font-semibold text-text">{pickLang(data.name, lang)}</p>
        <p className="mt-1 text-sm text-muted">{data.startAt} — {data.endAt}</p>
        <p className="mt-2 text-sm text-text-secondary">{pickLang(data.description, lang)}</p>
      </Card>

      {/* Sessions */}
      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-4">
          <Select className="w-44">
            <option>{t('marketing.campaigns.detail.sessionFilter')}</option>
          </Select>
          <Tabs items={sessionTabItems} value="waiting" onChange={() => {}} />
        </div>

        <Table>
          <thead>
            <Tr>
              <Th>{t('marketing.campaigns.detail.colDate')}</Th>
              <Th>{t('marketing.campaigns.detail.colSubEvent')}</Th>
              <Th>{t('marketing.campaigns.detail.colNomination')}</Th>
              <Th>{t('marketing.campaigns.detail.colMechanic')}</Th>
              <Th>{t('marketing.campaigns.detail.colActions')}</Th>
            </Tr>
          </thead>
          <tbody>
            {data.sessions.map((session) => (
              <Tr key={session.id}>
                <Td className="text-xs text-text-secondary">{session.date}</Td>
                <Td>
                  <div>
                    <span className="font-medium text-text">
                      {pickLang(session.subEventName, lang)}
                    </span>
                    {session.isLocal && (
                      <Badge tone="gray" className="ml-2">
                        {t('marketing.campaigns.localLabel')}
                      </Badge>
                    )}
                    <div className="mt-0.5 text-xs text-muted">
                      {t('marketing.campaigns.nominated', { count: session.nominatedCount })}
                    </div>
                  </div>
                </Td>
                <Td className="text-xs text-text-secondary">
                  {session.nominationStart} — {session.nominationEnd}
                </Td>
                <Td className="text-xs text-text-secondary">{session.mechanic}</Td>
                <Td>
                  <div className="flex flex-col items-start gap-2">
                    <Badge tone={sessionTone(session.sellerStatus)}>
                      {t(`marketing.campaigns.detail.sessionStatus.${session.sellerStatus}`)}
                    </Badge>
                    {session.sellerStatus === 'available' && (
                      <Button size="sm" variant="outline">
                        {t('marketing.campaigns.detail.viewDetailsBtn')}
                      </Button>
                    )}
                    {(session.sellerStatus === 'nominated' || session.sellerStatus === 'closed') && (
                      <Button size="sm" variant="outline">
                        <DownloadIcon size={14} />
                        {t('marketing.campaigns.detail.downloadBanner')}
                      </Button>
                    )}
                    {session.sellerStatus === 'active' && (
                      <Button size="sm">
                        {t('marketing.campaigns.detail.promoteNow')}
                      </Button>
                    )}
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Page>
  )
}
