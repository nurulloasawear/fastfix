import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import type { MetricGroup, MetricId, MetricRow, PenaltyConsequence } from '../types/account-health.types'

const GROUP_ORDER: MetricGroup[] = ['fulfilment', 'listing', 'customer_service']

function groupMetrics(rows: MetricRow[]): Map<MetricGroup, MetricRow[]> {
  const map = new Map<MetricGroup, MetricRow[]>()
  for (const g of GROUP_ORDER) map.set(g, [])
  for (const row of rows) {
    map.get(row.group)?.push(row)
  }
  return map
}

const DETAIL_ROUTES: Partial<Record<MetricId, string>> = {
  nfr: '/account-health/metric/nfr',
  response_rate: '/account-health/metric/chat-response',
}

function ConsequenceBadges({ consequences }: { consequences: PenaltyConsequence[] }) {
  const { t } = useTranslation()
  const filtered = consequences.filter((c) => c !== 'none')
  if (filtered.length === 0) return <span className="text-muted text-xs">—</span>
  return (
    <div className="flex flex-wrap gap-1">
      {filtered.map((c) => (
        <Badge key={c} tone={c === 'penalty_points' ? 'error' : c === 'verified_seller_reset' ? 'warning' : 'gray'}>
          {t(`accountHealth.metrics.consequence.${c}`)}
        </Badge>
      ))}
    </div>
  )
}

type Props = { metrics: MetricRow[]; isLoading?: boolean }

export function MetricsTable({ metrics, isLoading }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const grouped = groupMetrics(metrics)

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="h-5 w-40 animate-pulse rounded bg-border" />
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3 border-b border-border">
            <div className="h-4 w-48 animate-pulse rounded bg-border" />
            <div className="h-4 w-16 animate-pulse rounded bg-border" />
          </div>
        ))}
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-bg">
        <h3 className="text-sm font-semibold text-text">{t('accountHealth.metrics.title')}</h3>
      </div>

      <Table>
        <thead>
          <Tr>
            <Th>{t('accountHealth.metrics.colMetric')}</Th>
            <Th>{t('accountHealth.metrics.colCurrentPeriod')}</Th>
            <Th>{t('accountHealth.metrics.colTarget')}</Th>
            <Th>{t('accountHealth.metrics.colAppliedTo')}</Th>
            <Th>{t('accountHealth.metrics.colAction')}</Th>
          </Tr>
        </thead>
        <tbody>
          {GROUP_ORDER.map((group) => {
            const rows = grouped.get(group) ?? []
            if (rows.length === 0) return null
            return (
              <>
                <Tr key={`group-${group}`} className="bg-bg">
                  <Td colSpan={5} className="py-2 text-xs font-bold text-text-secondary uppercase tracking-wide">
                    {t(`accountHealth.metrics.group.${group}`)}
                  </Td>
                </Tr>
                {rows.map((row) => (
                  <Tr key={row.id} className="hover:bg-bg/50 transition-colors">
                    <Td className="font-medium text-text">
                      {t(`accountHealth.metrics.name.${row.id}`)}
                    </Td>
                    <Td className="text-text-secondary">{row.currentValue ?? '–'}</Td>
                    <Td className="text-text-secondary">{row.target}</Td>
                    <Td>
                      <ConsequenceBadges consequences={row.appliedTo} />
                    </Td>
                    <Td>
                      {row.hasDetail && DETAIL_ROUTES[row.id] ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-brand hover:underline px-0 h-auto"
                          onClick={() => navigate(DETAIL_ROUTES[row.id]!)}
                        >
                          {t('accountHealth.viewDetails')}
                        </Button>
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </Td>
                  </Tr>
                ))}
              </>
            )
          })}
        </tbody>
      </Table>
    </Card>
  )
}
