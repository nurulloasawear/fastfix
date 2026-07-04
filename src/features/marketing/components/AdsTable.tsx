import { useTranslation } from 'react-i18next'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { formatUZS } from '@/utils/money'
import type { AdCampaign } from '../types/marketing.types'
import { ArrowUpDown, BarChartIcon } from './icons'

type Props = { campaigns: AdCampaign[]; isLoading: boolean }

const SORTABLE = ['budget', 'impressions', 'clicks', 'ctr', 'expense', 'gmv'] as const

export function AdsTable({ campaigns, isLoading }: Props) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    )
  }
  if (campaigns.length === 0) {
    return (
      <EmptyState
        icon={<BarChartIcon size={24} />}
        title={t('marketing.ads.empty')}
      />
    )
  }

  return (
    <Table>
      <thead>
        <Tr>
          <Th>{t('marketing.ads.col.product')}</Th>
          <Th>{t('marketing.ads.col.type')}</Th>
          {SORTABLE.map((col) => (
            <Th key={col}>
              <span className="inline-flex items-center gap-1">
                {t(`marketing.ads.col.${col}`)}
                <ArrowUpDown size={13} className="text-muted" />
              </span>
            </Th>
          ))}
        </Tr>
      </thead>
      <tbody>
        {campaigns.map((c) => (
          <Tr key={c.id}>
            <Td>
              <div className="flex gap-3">
                <div className="h-12 w-12 shrink-0 rounded-md border border-border bg-bg" />
                <div>
                  <div className="font-medium text-text">{c.productName}</div>
                  <div className="text-xs text-muted">x{c.quantity}</div>
                  <div className="text-xs text-muted">{c.variation}</div>
                </div>
              </div>
            </Td>
            <Td>
              <Badge tone="gray">{t(`marketing.ads.type.${c.matchType}`)}</Badge>
            </Td>
            <Td className="text-text-secondary">
              {c.budgetUzs === null ? t('marketing.ads.noLimit') : formatUZS(c.budgetUzs)}
            </Td>
            <Td>{c.impressions.toLocaleString('ru-RU')}</Td>
            <Td>{c.clicks.toLocaleString('ru-RU')}</Td>
            <Td>{c.ctr}%</Td>
            <Td>{formatUZS(c.expenseUzs)}</Td>
            <Td className="font-medium">{formatUZS(c.gmvUzs)}</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  )
}
