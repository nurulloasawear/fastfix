import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pagination } from '@/components/ui/Pagination'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { formatUZS } from '@/utils/money'
import {
  StatementsLatestPanel,
  useFinanceUi,
  useStatementDownload,
  useStatements,
} from '@/features/finance'
import type { IncomeStatement } from '@/features/finance'

function fmtDate(iso: string) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const [y, m, d] = iso.split('-')
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`
}

function fmtStatementLabel(s: IncomeStatement) {
  return `Statement: ${s.periodFrom.replace(/-/g, '/')} – ${s.periodTo.replace(/-/g, '/')}`
}

// Thin page
export function IncomeStatementsPage() {
  const { t } = useTranslation()
  const [page] = useState(1)
  const [panelDismissed, setPanelDismissed] = useState(false)

  const latestPanelDismissed = useFinanceUi((s) => s.latestReportsPanelDismissed)
  const dismissLatestPanel   = useFinanceUi((s) => s.dismissLatestReportsPanel)

  const statementsQ = useStatements({ page, pageSize: 10 })
  const downloadMut = useStatementDownload()

  const statements      = statementsQ.data?.items ?? []
  const totalPages      = Math.max(1, Math.ceil((statementsQ.data?.total ?? 0) / 10))
  const hasUndownloaded = statements.some((s) => s.downloadedAt === null)
  const showLatestPanel = hasUndownloaded && !panelDismissed && !latestPanelDismissed

  function handleDownload(id: string) {
    downloadMut.mutate(id, {
      onSuccess: ({ url }) => {
        window.open(url, '_blank')
        if (statements.filter((s) => s.downloadedAt === null && s.id !== id).length === 0) {
          dismissLatestPanel()
        }
      },
    })
  }

  function handleDownloadAll() {
    statements.forEach((s) => {
      if (!s.downloadedAt) handleDownload(s.id)
    })
  }

  return (
    <Page>
      <PageHeader
        title={t('finance.statements.title')}
        subtitle={t('finance.statements.subtitle')}
        breadcrumb={
          <span>
            <a href="/" className="hover:underline">{t('finance.txDetail.breadcrumbHome')}</a>
            {' › '}
            <a href="/finance/income" className="hover:underline">{t('finance.incomeOverview.title')}</a>
            {' › '}
            {t('finance.statements.title')}
          </span>
        }
      />

      <Card className="relative overflow-visible">
        {/* Filter bar */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted" aria-hidden="true">
              <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M1 6h12M5 1v2M9 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-border-strong bg-surface px-3 py-1.5 text-sm text-text-secondary hover:bg-bg"
            >
              Weekly: 01/06/2026 – 16/06/2026
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadAll}>
              {t('finance.statements.downloadAll')}
            </Button>
            <button type="button" className="rounded-lg border border-border-strong p-2 text-muted hover:bg-bg">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="2" r="1" fill="currentColor" />
                <circle cx="7" cy="7" r="1" fill="currentColor" />
                <circle cx="7" cy="12" r="1" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>

        {/* Table */}
        {statementsQ.isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        ) : statements.length === 0 ? (
          <EmptyState
            title={t('finance.statements.empty')}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
          />
        ) : (
          <Table>
            <thead>
              <Tr>
                <Th>{t('finance.statements.col.statement')}</Th>
                <Th>{t('finance.statements.col.totalPayout')}</Th>
                <Th>
                  <button type="button" className="inline-flex items-center gap-1 hover:text-text">
                    {t('finance.statements.col.date')}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M6 2v8M3 7l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </button>
                </Th>
                <Th>{t('finance.statements.col.action')}</Th>
              </Tr>
            </thead>
            <tbody>
              {statements.map((s) => (
                <Tr key={s.id} className="hover:bg-bg/50">
                  <Td className="font-medium">{fmtStatementLabel(s)}</Td>
                  <Td className="text-text-secondary">{formatUZS(s.totalPayoutUzs)}</Td>
                  <Td className="text-text-secondary">{fmtDate(s.statementDate)}</Td>
                  <Td>
                    <button
                      type="button"
                      onClick={() => handleDownload(s.id)}
                      disabled={downloadMut.isPending}
                      className={`text-sm font-semibold transition-colors disabled:opacity-50 ${
                        s.downloadedAt ? 'text-muted hover:text-text' : 'text-brand hover:text-accent'
                      }`}
                    >
                      {s.downloadedAt
                        ? t('finance.statements.downloaded')
                        : t('finance.statements.download')}
                    </button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={() => {}}
          className="border-t border-border px-5 py-3"
        />

        {/* Latest Reports floating panel */}
        {showLatestPanel && (
          <div className="absolute right-5 top-16 z-20">
            <StatementsLatestPanel
              statements={statements}
              onDownload={handleDownload}
              onDismiss={() => setPanelDismissed(true)}
            />
          </div>
        )}
      </Card>
    </Page>
  )
}
