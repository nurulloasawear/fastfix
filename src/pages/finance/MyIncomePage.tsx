import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Input } from '@/components/ui/Input'
import {
  IncomeDetailsTable, IncomeOverviewCard, IncomeSidebarPanel,
  useFinanceUi, useIncomeDetails, useIncomeOverview,
  useStatementDownload, useStatements,
} from '@/features/finance'
import type { IncomeTab } from '@/features/finance'

// Thin page — all data/logic in @/features/finance
export function MyIncomePage() {
  const { t } = useTranslation()
  const incomeTab          = useFinanceUi((s) => s.incomeTab)
  const setIncomeTab       = useFinanceUi((s) => s.setIncomeTab)
  const incomeDatePreset   = useFinanceUi((s) => s.incomeDatePreset)
  const setIncomeDatePreset = useFinanceUi((s) => s.setIncomeDatePreset)
  const incomeFrom         = useFinanceUi((s) => s.incomeFrom)
  const incomeTo           = useFinanceUi((s) => s.incomeTo)
  const incomeOrderSearch  = useFinanceUi((s) => s.incomeOrderSearch)
  const setIncomeOrderSearch = useFinanceUi((s) => s.setIncomeOrderSearch)
  const bannerDismissed    = useFinanceUi((s) => s.incomeBannerDismissed)
  const dismissBanner      = useFinanceUi((s) => s.dismissIncomeBanner)

  const [orderDraft, setOrderDraft] = useState(incomeOrderSearch)

  const overviewQ   = useIncomeOverview()
  const detailsQ    = useIncomeDetails({ tab: incomeTab, from: incomeFrom, to: incomeTo, orderId: incomeOrderSearch || undefined })
  const statementsQ = useStatements({ pageSize: 3 })
  const downloadMut = useStatementDownload()

  function handleDownloadStatement(id: string) {
    downloadMut.mutate(id, { onSuccess: ({ url }) => { window.open(url, '_blank') } })
  }

  const dateLabel = `${incomeDatePreset === 'this_week' ? t('finance.incomeDetails.thisWeek') : t('finance.incomeDetails.thisMonth')}: ${incomeFrom} – ${incomeTo}`

  const incomeTabs: { key: IncomeTab; label: string }[] = [
    { key: 'pending',  label: t('finance.incomeDetails.tabPending') },
    { key: 'released', label: t('finance.incomeDetails.tabReleased') },
  ]

  return (
    <Page>
      <PageHeader
        title={t('finance.incomeOverview.title')}
        breadcrumb={
          <span>
            <a href="/" className="hover:underline">{t('finance.txDetail.breadcrumbHome')}</a>
            {' › '}
            {t('finance.incomeOverview.title')}
          </span>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_256px]">
        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-4">
          <IncomeOverviewCard overview={overviewQ.data} isLoading={overviewQ.isLoading} />

          {!bannerDismissed && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-warning-bg px-4 py-3">
              <p className="text-sm text-warning">{t('finance.incomeOverview.banner')}</p>
              <button
                type="button"
                onClick={dismissBanner}
                className="ml-4 text-muted hover:text-text"
                aria-label="Dismiss"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M12 4 4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}

          <Card className="overflow-hidden">
            <div className="px-5 pt-4">
              <h2 className="text-base font-semibold text-text">{t('finance.incomeDetails.title')}</h2>
            </div>

            {/* Tabs */}
            <div className="border-b border-border px-5 pt-3">
              <Tabs
                items={incomeTabs}
                value={incomeTab}
                onChange={(k) => setIncomeTab(k as IncomeTab)}
              />
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-border-strong bg-surface px-3 py-1.5 text-sm text-text-secondary hover:bg-bg"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M1 6h12M5 1v2M9 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  {dateLabel}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </button>
                {(['this_week', 'this_month'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setIncomeDatePreset(p)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      incomeDatePreset === p
                        ? 'bg-brand text-white'
                        : 'border border-border-strong bg-surface text-text-secondary hover:bg-bg'
                    }`}
                  >
                    {t(p === 'this_week' ? 'finance.incomeDetails.thisWeek' : 'finance.incomeDetails.thisMonth')}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={orderDraft}
                  onChange={(e) => setOrderDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setIncomeOrderSearch(orderDraft) }}
                  placeholder={t('finance.incomeDetails.searchOrder')}
                  trailing={
                    <button type="button" onClick={() => setIncomeOrderSearch(orderDraft)}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  }
                  className="h-9 rounded-full"
                />
                <Button variant="outline" size="sm">{t('finance.incomeDetails.export')}</Button>
              </div>
            </div>

            <IncomeDetailsTable items={detailsQ.data?.items ?? []} isLoading={detailsQ.isLoading} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="shrink-0">
          <IncomeSidebarPanel
            statements={statementsQ.data?.items ?? []}
            onDownloadStatement={handleDownloadStatement}
          />
        </div>
      </div>
    </Page>
  )
}
