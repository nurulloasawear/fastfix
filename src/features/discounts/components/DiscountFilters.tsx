import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import {
  STATUS_FILTERS,
  TYPE_FILTERS,
  type StatusFilter,
  type TypeFilter,
} from '../types/discounts.types'
import { Search, X } from './icons'

type Props = {
  search: string
  status: StatusFilter
  type: TypeFilter
  onSearch: (value: string) => void
  onStatus: (status: StatusFilter) => void
  onType: (type: TypeFilter) => void
}

const STATUS_LABEL: Record<StatusFilter, string> = {
  all: 'discounts.filter.all',
  active: 'discounts.filter.active',
  expired: 'discounts.filter.expired',
}

const TYPE_LABEL: Record<TypeFilter, string> = {
  all: 'discounts.filter.allTypes',
  percentage: 'discounts.filter.typePercent',
  fixed: 'discounts.filter.typeFixed',
}

export function DiscountFilters({ search, status, type, onSearch, onStatus, onType }: Props) {
  const { t } = useTranslation()

  const statusItems: TabItem[] = STATUS_FILTERS.map((s) => ({
    key: s,
    label: t(STATUS_LABEL[s]),
  }))

  return (
    <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted"
        />
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t('discounts.filter.searchPh')}
          className="pl-10"
          trailing={
            search ? (
              <button
                type="button"
                onClick={() => onSearch('')}
                aria-label={t('discounts.empty.reset')}
                className="text-muted hover:text-text"
              >
                <X size={16} />
              </button>
            ) : undefined
          }
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs items={statusItems} value={status} onChange={(k) => onStatus(k as StatusFilter)} />

        <Select
          value={type}
          onChange={(e) => onType(e.target.value as TypeFilter)}
        >
          {TYPE_FILTERS.map((ty) => (
            <option key={ty} value={ty}>
              {t(TYPE_LABEL[ty])}
            </option>
          ))}
        </Select>
      </div>
    </Card>
  )
}
