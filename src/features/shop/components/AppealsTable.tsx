// Appeals table — status sub-tabs + filter row + data table with empty state.
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import type { Appeal, AppealStatus, AppealType } from '../types/shop.types'
import { SearchIcon, ChevronIcon } from './AppealsIcons'

type StatusFilter = 'all' | AppealStatus

const STATUS_TABS: StatusFilter[] = ['all', 'reviewing', 'pending_resubmit', 'approved', 'rejected']

type Tone = 'gray' | 'info' | 'warning' | 'success' | 'error'
const STATUS_TONE: Record<AppealStatus, Tone> = {
  reviewing:        'info',
  pending_resubmit: 'warning',
  approved:         'success',
  rejected:         'error',
}

const STATUS_LABEL_KEY: Record<AppealStatus, string> = {
  reviewing:        'shop.appeals.statusReviewing',
  pending_resubmit: 'shop.appeals.statusPendingResubmit',
  approved:         'shop.appeals.statusApproved',
  rejected:         'shop.appeals.statusRejected',
}

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

type Props = {
  appeals: Appeal[]
  type: AppealType
  isLoading: boolean
  onFilterChange: (params: { status?: StatusFilter; appealId?: string }) => void
}

export function AppealsTable({ appeals, isLoading, onFilterChange }: Props) {
  const { t } = useTranslation()
  const [statusTab, setStatusTab] = useState<StatusFilter>('all')
  const [appealId, setAppealId] = useState('')
  const [appliedFilters, setAppliedFilters] = useState<{ status: StatusFilter; appealId: string }>({
    status: 'all',
    appealId: '',
  })

  const filtered = appeals.filter((a) => {
    if (appliedFilters.status !== 'all' && a.status !== appliedFilters.status) return false
    if (appliedFilters.appealId && !a.id.includes(appliedFilters.appealId)) return false
    return true
  })

  function handleApply() {
    const next = { status: statusTab, appealId }
    setAppliedFilters(next)
    onFilterChange({ status: next.status, appealId: next.appealId })
  }

  function handleReset() {
    setStatusTab('all')
    setAppealId('')
    setAppliedFilters({ status: 'all', appealId: '' })
    onFilterChange({})
  }

  const tabLabels: Record<StatusFilter, string> = {
    all:              t('shop.appeals.statusAll'),
    reviewing:        t('shop.appeals.statusReviewing'),
    pending_resubmit: t('shop.appeals.statusPendingResubmit'),
    approved:         t('shop.appeals.statusApproved'),
    rejected:         t('shop.appeals.statusRejected'),
  }

  return (
    <Card className="overflow-hidden">
      {/* Status sub-tabs */}
      <div className="flex gap-0 overflow-x-auto border-b border-border">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusTab(s)}
            className={`whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors ${
              statusTab === s
                ? 'border-b-2 border-brand text-brand'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            {tabLabels[s]}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3 border-b border-border px-4 py-4">
        <div className="w-64">
          <Input
            placeholder={t('shop.appeals.searchPlaceholder')}
            value={appealId}
            onChange={(e) => setAppealId(e.target.value)}
            trailing={<SearchIcon />}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-text-secondary">
            {t('shop.appeals.appealTypeLabel')}
          </span>
          <div className="flex h-11 w-48 items-center rounded-lg border border-border-strong bg-surface px-3 text-sm text-muted">
            {t('shop.appeals.appealTypePlaceholder')}
            <span className="ml-auto"><ChevronIcon /></span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-text-secondary">
            {t('shop.appeals.statusLabel')}
          </span>
          <div className="flex h-11 w-40 items-center rounded-lg border border-border-strong bg-surface px-3 text-sm text-muted">
            {t('shop.appeals.statusPlaceholder')}
            <span className="ml-auto"><ChevronIcon /></span>
          </div>
        </div>
        <Button size="sm" onClick={handleApply}>{t('shop.appeals.apply')}</Button>
        <Button variant="outline" size="sm" onClick={handleReset}>{t('shop.appeals.reset')}</Button>
      </div>

      {/* Results count */}
      <div className="px-4 py-2 text-sm text-muted">
        {t('shop.appeals.itemsCount', { count: filtered.length })}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6" aria-hidden="true">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2" />
            </svg>
          }
          title={t('shop.appeals.noData')}
        />
      ) : (
        <Table>
          <thead>
            <Tr>
              <Th>{t('shop.appeals.colAppealId')}</Th>
              <Th>{t('shop.appeals.colAppealType')}</Th>
              <Th>{t('shop.appeals.colStatus')}</Th>
              <Th>{t('shop.appeals.colLastUpdate')}</Th>
              <Th>{t('shop.appeals.colAction')}</Th>
            </Tr>
          </thead>
          <tbody>
            {filtered.map((appeal) => (
              <Tr key={appeal.id} className="hover:bg-bg/50">
                <Td className="font-mono text-xs text-text">{appeal.id}</Td>
                <Td className="capitalize text-text">{appeal.appealType.replace(/_/g, ' ')}</Td>
                <Td>
                  <Badge tone={STATUS_TONE[appeal.status]}>
                    {t(STATUS_LABEL_KEY[appeal.status])}
                  </Badge>
                </Td>
                <Td className="text-muted">{fmtDate(appeal.updatedAt)}</Td>
                <Td>
                  <Button variant="ghost" size="sm">View</Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  )
}
