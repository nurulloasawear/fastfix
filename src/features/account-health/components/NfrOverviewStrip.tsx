import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Spinner } from '@/components/ui/Spinner'

type Props = {
  myShopRate: number | null | undefined
  isLoading: boolean
  fromDate: string
  toDate: string
}

function fmtDate(iso: string) {
  return iso.replace(/-/g, '/')
}

export function NfrOverviewStrip({ myShopRate, isLoading, fromDate, toDate }: Props) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <Card className="p-5 flex items-center justify-center py-12">
        <Spinner />
      </Card>
    )
  }

  const rateDisplay =
    myShopRate !== null && myShopRate !== undefined ? `${myShopRate.toFixed(2)}%` : '–'

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text">{t('accountHealth.nfr.overview')}</h3>
        <span className="text-xs text-muted">
          {t('accountHealth.nfr.orderDate')}: {fmtDate(fromDate)} – {fmtDate(toDate)}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label={t('accountHealth.nfr.myShop')}
          value={rateDisplay}
          hint={`${t('accountHealth.nfr.target')} <5.00% · ${t('accountHealth.nfr.nextWeekPrediction')}: –`}
        />
        <StatCard
          label={t('accountHealth.nfr.weeklyPenaltyPoint')}
          value="–"
          hint={`${t('accountHealth.nfr.target')} – · ${t('accountHealth.nfr.issueDate')}: –`}
        />
        <StatCard
          label={t('accountHealth.nfr.weeklyVerifiedCriteria')}
          value="–"
          hint={`${t('accountHealth.nfr.target')} ≤4.99% · ${t('accountHealth.nfr.impactPeriod')}: –`}
        />
      </div>
    </Card>
  )
}
