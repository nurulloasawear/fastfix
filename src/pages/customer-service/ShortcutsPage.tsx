import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import {
  ShortcutGroupAccordion,
  ToggleSwitch,
  useShortcuts,
} from '@/features/customer-service'
import { PlusIcon } from '@/features/customer-service'

// Shortcuts page matching Shopee "Chat Management > Shortcut" screenshot.
// Global hints toggle + shortcuts count + grouped accordion list.
export function ShortcutsPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useShortcuts()
  // Server value is the default; a local override takes over once the user toggles
  // (no setState-in-effect — derive instead).
  const [override, setOverride] = useState<boolean | null>(null)
  const showHints = override ?? data?.showHintsAutomatically ?? true

  const groups = data?.groups ?? []
  const totalCount = data?.totalCount ?? 0
  const maxCount = data?.maxCount ?? 25

  return (
    <Page>
      <PageHeader
        title={t('customerService.shortcuts.title')}
        breadcrumb={`${t('customerService.breadcrumbHome')} › ${t('customerService.chatManagement.crumb')} › ${t('customerService.shortcuts.crumb')}`}
      />

      {/* Global toggle */}
      <Card className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-text">{t('customerService.shortcuts.showHints')}</p>
          <p className="text-xs text-muted">{t('customerService.shortcuts.showHintsDesc')}</p>
        </div>
        <ToggleSwitch
          checked={showHints}
          onChange={() => setOverride(!showHints)}
          label={t('customerService.shortcuts.showHints')}
        />
      </Card>

      {/* Section header */}
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-base font-semibold text-text">
          {t('customerService.shortcuts.header')}
          <span className="ml-1 text-sm font-normal text-muted">
            {t('customerService.shortcuts.count', { current: totalCount, max: maxCount })}
          </span>
        </h2>
        <Button size="sm" className="ml-auto">
          <PlusIcon size={14} />
          {t('customerService.shortcuts.createCta')}
        </Button>
      </div>

      {/* Sync info banner */}
      <div className="rounded-lg border border-warning bg-warning-bg px-4 py-2.5 text-sm text-warning">
        {t('customerService.shortcuts.syncBanner')}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      )}

      {!isLoading && groups.length === 0 && (
        <EmptyState title={t('customerService.shortcuts.empty')} />
      )}

      {!isLoading && groups.length > 0 && (
        <div className="flex flex-col gap-3">
          {groups.map((group) => (
            <ShortcutGroupAccordion key={group.id} group={group} />
          ))}
        </div>
      )}
    </Page>
  )
}
