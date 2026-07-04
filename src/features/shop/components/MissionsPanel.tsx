// Missions tab content — motivational banner + mission cards (or all-complete state).
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Mission } from '../types/shop.types'

type Props = {
  missions: Mission[]
}

export function MissionsPanel({ missions }: Props) {
  const { t } = useTranslation()
  const hasActive = missions.some((m) => m.status !== 'completed')

  return (
    <div className="flex flex-col gap-4">
      {/* Motivational banner */}
      <div className="relative overflow-hidden rounded-xl bg-warning-bg px-8 py-6">
        <p className="text-lg font-bold text-warning">{t('shop.missions.banner')}</p>
        {/* Decorative SVG illustration right side */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-60">
          <TrophyIlloBanner />
        </div>
      </div>

      {/* Mission cards or all-complete */}
      {hasActive ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {missions.map((m) => (
            <MissionCard key={m.id} mission={m} />
          ))}
        </div>
      ) : (
        <AllCompletedState />
      )}
    </div>
  )
}

function MissionCard({ mission }: { mission: Mission }) {
  const { t } = useTranslation()
  const done = mission.tasks.filter((tk) => tk.isCompleted).length
  const total = mission.tasks.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-text">{mission.title}</p>
        <StatusDot status={mission.status} />
      </div>
      <p className="text-xs text-muted">{mission.description}</p>
      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-bg">
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted">{mission.rewardDescription}</p>
      <div className="mt-auto">
        <Button size="sm" className="w-full">
          {t('shop.missions.missionStart')}
        </Button>
      </div>
    </Card>
  )
}

function StatusDot({ status }: { status: Mission['status'] }) {
  const cls =
    status === 'completed'
      ? 'bg-success'
      : status === 'in_progress'
        ? 'bg-warning'
        : 'bg-border-strong'
  return <div className={`h-2 w-2 shrink-0 rounded-full ${cls}`} />
}

function AllCompletedState() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <TrophyIlloLarge />
      <p className="text-xl font-bold text-text">{t('shop.missions.allCompleted')}</p>
      <p className="text-sm text-muted">{t('shop.missions.allCompletedSub')}</p>
    </div>
  )
}

// Inline SVG illustrations ────────────────────────────────────────────────────
function TrophyIlloBanner() {
  return (
    <svg viewBox="0 0 120 80" className="h-20 w-32" fill="none" aria-hidden="true">
      <ellipse cx="60" cy="75" rx="30" ry="4" fill="#c4a882" opacity=".3" />
      <rect x="40" y="55" width="40" height="8" rx="4" fill="#c4a882" />
      <rect x="50" y="45" width="20" height="12" rx="3" fill="#e8b89a" />
      <path d="M30 20 Q20 35 35 45 Q55 50 60 40 Q65 50 85 45 Q100 35 90 20 Z" fill="#f5c842" />
      <circle cx="60" cy="28" r="10" fill="#ffd700" />
      <path d="M57 26l2 4 4-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* Stars */}
      <circle cx="35" cy="15" r="2" fill="#ffd700" />
      <circle cx="85" cy="12" r="1.5" fill="#ffd700" />
      <circle cx="95" cy="30" r="2.5" fill="#f5c842" />
    </svg>
  )
}

function TrophyIlloLarge() {
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24" fill="none" aria-hidden="true">
      <ellipse cx="50" cy="95" rx="22" ry="4" fill="#c4a882" opacity=".4" />
      <rect x="32" y="73" width="36" height="9" rx="4" fill="#e8b89a" />
      <rect x="38" y="60" width="24" height="15" rx="3" fill="#f5c842" />
      <path d="M15 20 Q8 45 28 60 Q48 65 50 52 Q52 65 72 60 Q92 45 85 20 Z" fill="#ffd700" />
      <circle cx="50" cy="38" r="13" fill="#fff176" />
      <path d="M46 36l3 6 5-9" stroke="#e65100" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="12" r="3" fill="#f5c842" />
      <circle cx="76" cy="10" r="2.5" fill="#ffd700" />
      <circle cx="88" cy="35" r="3.5" fill="#f5c842" />
    </svg>
  )
}
