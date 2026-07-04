import { useTranslation } from 'react-i18next'
import type { ProductStatusTab, ProductSummary } from '../types/products.types'
import { PRODUCT_STATUS_TABS } from '../types/products.types'

type Props = {
  active: ProductStatusTab
  summary: ProductSummary
  onChange: (tab: ProductStatusTab) => void
}

// Tab bar matches Shopee: underline-on-active style, count badge in parens.
export function ProductStatusTabs({ active, summary, onChange }: Props) {
  const { t } = useTranslation()

  const countFor = (tab: ProductStatusTab): number => {
    if (tab === 'all') return summary.all
    if (tab === 'live') return summary.live
    if (tab === 'no_stock') return summary.no_stock
    if (tab === 'violation') return summary.violation
    if (tab === 'under_review') return summary.under_review
    return summary.unpublished
  }

  return (
    <div className="flex flex-wrap gap-0 border-b border-border">
      {PRODUCT_STATUS_TABS.map((tab) => {
        const isActive = active === tab
        const count = countFor(tab)
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`relative px-5 py-3 text-sm font-semibold transition-colors ${
              isActive
                ? 'text-brand after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            {t(`products.tab.${tab}`)}
            {' '}
            <span className={isActive ? 'text-brand' : 'text-muted'}>
              ({count})
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ── Sub-tab components ────────────────────────────────────────────────────────

type SubTabProps<T extends string> = {
  tabs: readonly T[]
  active: T
  labelKey: (v: T) => string
  dotOn?: T[]
  onChange: (v: T) => void
}

function SubTabBar<T extends string>({ tabs, active, labelKey, dotOn = [], onChange }: SubTabProps<T>) {
  return (
    <div className="flex flex-wrap gap-0 border-b border-border px-1">
      {tabs.map((tab) => {
        const isActive = active === tab
        const hasDot = dotOn.includes(tab)
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`relative flex items-center gap-1 px-4 py-2.5 text-sm font-semibold transition-colors ${
              isActive
                ? 'text-brand after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            {labelKey(tab)}
            {hasDot && (
              <span className="h-1.5 w-1.5 rounded-full bg-error" />
            )}
          </button>
        )
      })}
    </div>
  )
}

// Live sub-tabs: All | Restock | Listing Quality
type LiveSubTabsProps = {
  active: 'all' | 'restock' | 'quality'
  restockCount: number
  qualityCount: number
  onChange: (v: 'all' | 'restock' | 'quality') => void
}

export function LiveSubTabs({ active, restockCount, qualityCount, onChange }: LiveSubTabsProps) {
  const { t } = useTranslation()
  const TABS = ['all', 'restock', 'quality'] as const
  const dotOn: ('all' | 'restock' | 'quality')[] = []
  if (restockCount > 0) dotOn.push('restock')
  if (qualityCount > 0) dotOn.push('quality')

  const label = (v: 'all' | 'restock' | 'quality'): string => {
    const base = t(`products.liveSub.${v}`)
    if (v === 'restock' && restockCount > 0) return `${base} (${restockCount})`
    if (v === 'quality' && qualityCount > 0) return `${base} (${qualityCount})`
    return base
  }

  return (
    <SubTabBar
      tabs={TABS}
      active={active}
      labelKey={label}
      dotOn={dotOn}
      onChange={onChange}
    />
  )
}

// Violation sub-tabs: Banned | Deboosted | Platform Deleted
type ViolationSubTabsProps = {
  active: 'banned' | 'deboosted' | 'admin_deleted'
  onChange: (v: 'banned' | 'deboosted' | 'admin_deleted') => void
}

export function ViolationSubTabs({ active, onChange }: ViolationSubTabsProps) {
  const { t } = useTranslation()
  const TABS = ['banned', 'deboosted', 'admin_deleted'] as const
  return (
    <SubTabBar
      tabs={TABS}
      active={active}
      labelKey={(v) => t(`products.violationSub.${v}`)}
      onChange={onChange}
    />
  )
}

// Unpublished sub-tabs: Delisted | Draft
type UnpublishedSubTabsProps = {
  active: 'delisted' | 'draft'
  onChange: (v: 'delisted' | 'draft') => void
}

export function UnpublishedSubTabs({ active, onChange }: UnpublishedSubTabsProps) {
  const { t } = useTranslation()
  const TABS = ['delisted', 'draft'] as const
  return (
    <SubTabBar
      tabs={TABS}
      active={active}
      labelKey={(v) => t(`products.unpublishedSub.${v}`)}
      onChange={onChange}
    />
  )
}
