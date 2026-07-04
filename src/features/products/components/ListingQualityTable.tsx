import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { InfoIcon, PackageIcon } from './icons'
import type { IssueType, ListingIssue } from '../types/products.types'

type IssueChipProps = {
  label: string
  active: boolean
  onClick: () => void
}

function IssueChip({ label, active, onClick }: IssueChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? 'border-brand bg-brand text-white'
          : 'border-border-strong bg-surface text-text-secondary hover:bg-bg'
      }`}
    >
      {label}
    </button>
  )
}

type Props = {
  issues: ListingIssue[]
  isLoading: boolean
  activeFilter: IssueType | 'all'
  onFilterChange: (f: IssueType | 'all') => void
}

const FILTER_TYPES = ['all', 'wrong_value', 'image_issue', 'missing_info', 'other'] as const

export function ListingQualityTable({ issues, isLoading, activeFilter, onFilterChange }: Props) {
  const { t } = useTranslation()

  const filtered = activeFilter === 'all' ? issues : issues.filter((iss) => {
    if (activeFilter === 'wrong_value') return iss.wrongValueCount > 0
    if (activeFilter === 'image_issue') return iss.imageIssueCount > 0
    if (activeFilter === 'missing_info') return iss.missingInfoCount > 0
    return iss.otherCount > 0
  })

  return (
    <div className="flex flex-col gap-0">
      {/* Issue filter chips */}
      <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-border">
        {FILTER_TYPES.map((ft) => (
          <IssueChip
            key={ft}
            label={t(`products.issueFilter.${ft}`)}
            active={activeFilter === ft}
            onClick={() => onFilterChange(ft as IssueType | 'all')}
          />
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<PackageIcon size={32} />}
          title={t('products.noProductFound')}
        />
      ) : (
        <Table>
          <thead>
            <Tr>
              <Th className="w-10">
                <input type="checkbox" aria-label="select all" className="rounded" />
              </Th>
              <Th>{t('products.col.product')}</Th>
              <Th>
                <span className="inline-flex items-center gap-1">
                  {t('products.col.wrongValue')} <InfoIcon size={12} className="text-muted" />
                </span>
              </Th>
              <Th>
                <span className="inline-flex items-center gap-1">
                  {t('products.col.imageIssues')} <InfoIcon size={12} className="text-muted" />
                </span>
              </Th>
              <Th>
                <span className="inline-flex items-center gap-1">
                  {t('products.col.missingKeyInfo')} <InfoIcon size={12} className="text-muted" />
                </span>
              </Th>
              <Th>
                <span className="inline-flex items-center gap-1">
                  {t('products.col.otherIssues')} <InfoIcon size={12} className="text-muted" />
                </span>
              </Th>
              <Th>{t('products.col.action')}</Th>
            </Tr>
          </thead>
          <tbody>
            {filtered.map((iss) => (
              <Tr key={iss.productId} className="align-top hover:bg-bg">
                <Td>
                  <input type="checkbox" aria-label={iss.productName} className="rounded" />
                </Td>
                <Td>
                  <div className="flex gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-md bg-bg border border-border" />
                    <span className="font-medium text-text">{iss.productName}</span>
                  </div>
                </Td>
                <Td>
                  <IssueCount count={iss.wrongValueCount} />
                </Td>
                <Td>
                  <IssueCount count={iss.imageIssueCount} />
                </Td>
                <Td>
                  <IssueCount count={iss.missingInfoCount} />
                </Td>
                <Td>
                  <IssueCount count={iss.otherCount} />
                </Td>
                <Td>
                  <Link
                    to={`/products/${iss.productId}/edit`}
                    className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold text-brand hover:bg-bg transition-colors"
                  >
                    {t('products.action.fix')}
                  </Link>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}

function IssueCount({ count }: { count: number }) {
  if (count === 0) return <span className="text-muted">—</span>
  return (
    <span className="inline-flex items-center gap-1 text-error-text">
      {count} <InfoIcon size={12} />
    </span>
  )
}
