import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  ChevronRight,
  MarketingNav,
  MessageIcon,
  UsersIcon,
  CheckIcon,
  useCreators,
  useActivateCreators,
} from '@/features/marketing'

export function CreatorsPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useCreators()
  const activate = useActivateCreators()
  const [tosChecked, setTosChecked] = useState(false)
  const [commissionPct, setCommissionPct] = useState('9')
  const creators = data?.creators ?? []
  const isActivated = data?.activated ?? false

  function handleStart() {
    if (!tosChecked) return
    activate.mutate({ tosAccepted: true })
  }

  return (
    <Page>
      <PageHeader
        title={t('marketing.creators.title')}
        breadcrumb={
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <span>{t('marketing.centre.home')}</span>
            <ChevronRight size={14} />
            <span className="text-text-secondary">{t('marketing.creators.title')}</span>
          </span>
        }
      />

      <MarketingNav />

      {/* Onboarding modal */}
      <Modal
        open={!isActivated && !isLoading}
        onClose={() => {}}
        title={t('marketing.creators.welcomeTitle')}
        size="md"
        footer={
          <Button className="w-full" disabled={!tosChecked || activate.isPending} onClick={handleStart}>
            {activate.isPending ? <><Spinner className="h-4 w-4" /> …</> : t('marketing.creators.startBtn')}
          </Button>
        }
      >
        <p className="mb-5 text-sm text-muted">{t('marketing.creators.welcomeSubtitle')}</p>

        <div className="mb-6 grid grid-cols-3 gap-4">
          {([1, 2, 3] as const).map((n) => (
            <div key={n} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-brand">
                {n === 1 ? <UsersIcon size={24} /> : n === 2 ? <ChevronRight size={24} /> : <CheckIcon size={24} />}
              </div>
              <p className="text-xs font-semibold text-text">{t(`marketing.creators.prop${n}Title`)}</p>
              <p className="text-xs text-muted">{t(`marketing.creators.prop${n}Body`)}</p>
            </div>
          ))}
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            id="tos"
            checked={tosChecked}
            onChange={(e) => setTosChecked(e.target.checked)}
            className="h-4 w-4 rounded border-border-strong accent-brand"
          />
          <span className="text-sm text-text-secondary">{t('marketing.creators.tosLabel')}</span>
        </label>
      </Modal>

      {/* Open Campaign banner */}
      <Card className="flex flex-wrap items-center gap-6 bg-table-header p-5">
        <div className="flex-1 min-w-52">
          <p className="text-sm font-semibold text-brand">{t('marketing.creators.openCampaignBanner')}</p>
          <p className="mt-1 text-xs text-muted">{t('marketing.creators.openCampaignDesc')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <p className="text-xs text-muted">{t('marketing.creators.commissionLabel')}</p>
            <p className="text-xs text-muted">{t('marketing.creators.suggestedRate')} 9%–14%</p>
          </div>
          <Input
            type="number"
            value={commissionPct}
            onChange={(e) => setCommissionPct(e.target.value)}
            className="w-20"
            trailing={<span className="text-xs">%</span>}
            min="0"
            max="100"
          />
          <Button size="sm">{t('marketing.creators.quickCreate')}</Button>
        </div>
      </Card>

      {/* Recommended Creators */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-text">{t('marketing.creators.recommendedCreators')}</h2>
        <Button variant="ghost" size="sm">{t('marketing.creators.moreCreators')}</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : creators.length === 0 ? (
        <Card className="p-0">
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <UsersIcon size={24} className="text-muted" />
            <p className="text-sm text-muted">{t('marketing.creators.recommendedCreators')}</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {creators.map((creator) => (
            <Card key={creator.id} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-brand">{creator.handle}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {creator.categories.map((cat) => (
                      <Badge key={cat} tone="gray">{cat}</Badge>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MessageIcon size={16} />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted">{t('marketing.creators.followers')}</p>
                  <p className="font-semibold text-text">
                    {creator.followers >= 1000
                      ? `${(creator.followers / 1000).toFixed(1)}k`
                      : creator.followers}
                  </p>
                </div>
                <div>
                  <p className="text-muted">{t('marketing.creators.totalOrders')}</p>
                  <p className="font-semibold text-text">{creator.totalOrders}</p>
                </div>
                <div>
                  <p className="text-muted">{t('marketing.creators.totalClicks')}</p>
                  <p className="font-semibold text-text">{creator.totalClicks}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Popular Tools */}
      <h2 className="text-base font-semibold text-text">{t('marketing.creators.popularTools')}</h2>
      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="font-semibold text-text">{t('marketing.creators.freeSample')}</p>
          <p className="mt-0.5 text-sm text-muted">{t('marketing.creators.freeSampleDesc')}</p>
        </div>
        <Button variant="outline" size="sm">{t('marketing.creators.createSample')}</Button>
      </Card>

      {/* Education */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text">{t('marketing.creators.education')}</span>
          <Button variant="ghost" size="sm">{t('marketing.centre.more')} →</Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-6 text-sm text-text-secondary">
          <span>• {t('marketing.creators.userGuide')}</span>
          <span>• {t('marketing.creators.faq')}</span>
        </div>
      </Card>
    </Page>
  )
}
