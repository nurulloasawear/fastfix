import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AlertTriangleIcon, CheckCircleIcon } from './icons'

type Props = {
  penaltyPoints: number
  penaltyMax: number
  punishmentActive: boolean
  isLoading?: boolean
}

export function PenaltyPanel({ penaltyPoints, penaltyMax, punishmentActive, isLoading }: Props) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <Card className="p-5">
        <div className="h-5 w-32 animate-pulse rounded bg-border mb-4" />
        <div className="h-24 animate-pulse rounded bg-border" />
      </Card>
    )
  }

  const pct = Math.min((penaltyPoints / penaltyMax) * 100, 100)
  const barColor = penaltyPoints >= 3 ? 'bg-error' : penaltyPoints > 0 ? 'bg-warning' : 'bg-success'

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text">{t('accountHealth.penalty.title')}</h3>
        <Button variant="ghost" size="sm" className="text-xs text-brand hover:underline px-0 h-auto">
          {t('accountHealth.viewMore')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left: Penalty points + progress */}
        <div>
          <p className="text-xs text-muted mb-1">{t('accountHealth.penalty.penaltyPoints')}</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-text">{penaltyPoints}</span>
            <span className="text-sm text-muted">
              {t('accountHealth.penalty.youCanGet', { max: penaltyMax })}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full rounded-full bg-border overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted">0</span>
            <span className="text-xs text-muted">{penaltyMax}</span>
          </div>

          {/* Warning at 3-point threshold */}
          {penaltyPoints < 3 && (
            <div className="mt-3 flex items-start gap-2 rounded-md bg-warning-bg px-3 py-2">
              <AlertTriangleIcon size={14} className="mt-0.5 text-warning shrink-0" />
              <p className="text-xs text-warning">
                {t('accountHealth.penalty.warningThreshold')}{' '}
                <Button variant="ghost" size="sm" className="inline p-0 h-auto text-xs font-semibold underline text-warning hover:text-warning">
                  {t('accountHealth.learnMore')}
                </Button>
              </p>
            </div>
          )}
        </div>

        {/* Right: Ongoing punishment */}
        <div>
          <p className="text-xs text-muted mb-2">{t('accountHealth.penalty.ongoingPunishment')}</p>
          {punishmentActive ? (
            <div className="flex items-center gap-2 text-error-text text-sm font-medium">
              <AlertTriangleIcon size={14} className="text-error-text" />
              {t('accountHealth.penalty.activePunishment')}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-success text-sm font-medium">
              <CheckCircleIcon size={14} className="text-success" />
              {t('accountHealth.penalty.noPunishment')}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
