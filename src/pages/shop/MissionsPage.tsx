// Seller Missions page — Missions tab + Rewards tab; intro popup on first visit.
// Thin page: data/logic in @/features/shop.
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import {
  MissionsIntroModal,
  MissionsPanel,
  RewardsPanel,
  useMarkIntroSeen,
  useMissions,
  useRewardsList,
} from '@/features/shop'

type MissionTab = 'missions' | 'rewards'

export function MissionsPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<MissionTab>('missions')

  const { data: missionsData, isLoading: missionsLoading } = useMissions()
  const { data: rewardsData, isLoading: rewardsLoading } = useRewardsList()
  const markSeen = useMarkIntroSeen()

  const missions = missionsData?.missions ?? []
  const rewards = rewardsData?.rewards ?? []
  const showIntro = Boolean(missionsData && !missionsData.introSeen)

  function handleSkip() { markSeen.mutate() }
  function handleStart() { markSeen.mutate() }

  const tabItems: TabItem[] = [
    { key: 'missions', label: t('shop.missions.missionsTab') },
    { key: 'rewards',  label: t('shop.missions.rewardsTab') },
  ]

  return (
    <Page>
      <PageHeader
        title={t('shop.missions.title')}
        breadcrumb={`${t('shop.missions.breadcrumbHome')} › ${t('shop.missions.title')}`}
        actions={
          <Button variant="ghost" size="sm">{t('shop.missions.learnMore')}</Button>
        }
      />

      <Tabs items={tabItems} value={tab} onChange={(k) => setTab(k as MissionTab)} />

      {tab === 'missions' && (
        missionsLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <MissionsPanel missions={missions} />
        )
      )}

      {tab === 'rewards' && (
        rewardsLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <RewardsPanel
            rewards={rewards}
            onStart={() => setTab('missions')}
          />
        )
      )}

      {showIntro && (
        <MissionsIntroModal onSkip={handleSkip} onStart={handleStart} />
      )}
    </Page>
  )
}
