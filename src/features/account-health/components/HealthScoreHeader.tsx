import { useTranslation } from 'react-i18next'
import type { HealthLabel } from '../types/account-health.types'

const LABEL_COLORS: Record<HealthLabel, string> = {
  EXCELLENT: 'text-success',
  GOOD: 'text-success',
  FAIR: 'text-warning',
  POOR: 'text-error-text',
}

type Props = { label: HealthLabel; isLoading?: boolean }

export function HealthScoreHeader({ label, isLoading }: Props) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1">
        <div className="h-9 w-36 animate-pulse rounded bg-border" />
        <div className="h-4 w-72 animate-pulse rounded bg-border" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <h2 className={`text-3xl font-bold ${LABEL_COLORS[label]}`}>
        {t(`accountHealth.label.${label}`)}
      </h2>
      <p className="text-sm text-muted">{t('accountHealth.tagline')}</p>
    </div>
  )
}
