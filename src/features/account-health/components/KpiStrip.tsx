import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

type Props = {
  adminSided: number
  penaltyPoints: number
  ongoingAppeals: number
  isLoading?: boolean
}

export function KpiStrip({ adminSided, penaltyPoints, ongoingAppeals, isLoading }: Props) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="p-4">
            <div className="h-4 w-32 animate-pulse rounded bg-border mb-2" />
            <div className="h-8 w-12 animate-pulse rounded bg-border" />
          </Card>
        ))}
      </div>
    )
  }

  const items = [
    {
      label: t('accountHealth.kpi.performanceMetric'),
      sub: t('accountHealth.kpi.adminSided'),
      value: adminSided,
    },
    {
      label: t('accountHealth.kpi.myPenalty'),
      sub: t('accountHealth.kpi.points'),
      value: penaltyPoints,
    },
    {
      label: t('accountHealth.kpi.ongoingAppeal'),
      sub: t('accountHealth.kpi.cases'),
      value: ongoingAppeals,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-xs text-muted">{item.label}</p>
            <p className="text-2xl font-bold text-text">{item.value}</p>
            <p className="text-xs text-muted">{item.sub}</p>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-brand hover:underline px-0 h-auto">
            {t('accountHealth.kpi.view')}
          </Button>
        </Card>
      ))}
    </div>
  )
}
