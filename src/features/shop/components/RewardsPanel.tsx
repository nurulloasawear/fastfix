// Rewards tab content — empty state with gift box + populated reward cards.
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatUZS } from '@/utils/money'
import type { SellerReward } from '../types/shop.types'

type Tone = 'success' | 'gray' | 'error'
const REWARD_STATUS_TONE: Record<SellerReward['status'], Tone> = {
  active: 'success',
  used: 'gray',
  expired: 'error',
}

type Props = {
  rewards: SellerReward[]
  onStart: () => void
}

export function RewardsPanel({ rewards, onStart }: Props) {

  if (rewards.length === 0) {
    return <RewardsEmptyState onStart={onStart} />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rewards.map((r) => (
        <RewardCard key={r.id} reward={r} />
      ))}
    </div>
  )
}

function RewardCard({ reward }: { reward: SellerReward }) {
  const { t } = useTranslation()
  const tone = REWARD_STATUS_TONE[reward.status]
  const statusLabel = t(`shop.missions.rewardStatus.${reward.status}`)
  const typeLabel = t(`shop.missions.rewardType.${reward.rewardType}`)

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-text">{typeLabel}</p>
        <Badge tone={tone}>{statusLabel}</Badge>
      </div>
      {reward.rewardType === 'ad_credit' && (
        <p className="text-lg font-bold text-brand">{formatUZS(reward.valueUzs)}</p>
      )}
      <p className="text-xs text-muted">{reward.missionTitle}</p>
      <p className="text-xs text-warning">
        {t('shop.missions.expires', {
          date: new Date(reward.expiresAt).toLocaleDateString('ru-RU'),
        })}
      </p>
    </Card>
  )
}

function RewardsEmptyState({ onStart }: { onStart: () => void }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center gap-4 py-20">
      <GiftBoxIllo />
      <p className="text-lg font-bold text-text">{t('shop.missions.rewardsEmpty')}</p>
      <p className="text-sm text-muted">{t('shop.missions.rewardsEmptySub')}</p>
      <Button onClick={onStart}>{t('shop.missions.rewardsStart')}</Button>
    </div>
  )
}

function GiftBoxIllo() {
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24" fill="none" aria-hidden="true">
      {/* Box bottom */}
      <rect x="15" y="48" width="70" height="40" rx="4" fill="#f5cba7" />
      {/* Box lid */}
      <rect x="12" y="38" width="76" height="14" rx="3" fill="#e8a87c" />
      {/* Ribbon vertical */}
      <rect x="46" y="38" width="8" height="50" fill="#e74c3c" opacity=".8" />
      {/* Ribbon horizontal */}
      <rect x="12" y="42" width="76" height="8" fill="#e74c3c" opacity=".8" />
      {/* Bow left */}
      <ellipse cx="38" cy="38" rx="12" ry="7" fill="#e74c3c" transform="rotate(-20 38 38)" />
      {/* Bow right */}
      <ellipse cx="62" cy="38" rx="12" ry="7" fill="#e74c3c" transform="rotate(20 62 38)" />
      {/* Bow centre */}
      <circle cx="50" cy="38" r="5" fill="#c0392b" />
      {/* Lid open angle */}
      <rect x="12" y="32" width="76" height="10" rx="3" fill="#e8a87c" transform="rotate(-5 12 32)" />
      {/* Sparkles */}
      <circle cx="80" cy="25" r="2.5" fill="#f5c842" />
      <circle cx="20" cy="28" r="2" fill="#f5c842" />
      <path d="M85 15 L87 20 L85 25 L83 20 Z" fill="#ffd700" />
    </svg>
  )
}
