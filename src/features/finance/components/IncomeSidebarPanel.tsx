import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { IncomeStatement } from '../types/finance.types'

// Download icon (inline SVG)
function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M9 2v9m0 0-3-3m3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 13v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

type StatementEntryProps = {
  label: string
  onDownload: () => void
}

function StatementEntry({ label, onDownload }: StatementEntryProps) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border py-2 last:border-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <button
        type="button"
        onClick={onDownload}
        className="text-brand transition-colors hover:text-accent"
        aria-label="Download"
      >
        <DownloadIcon />
      </button>
    </div>
  )
}

type Props = {
  statements: IncomeStatement[]
  onDownloadStatement: (id: string) => void
}

export function IncomeSidebarPanel({ statements, onDownloadStatement }: Props) {
  const { t } = useTranslation()

  const recent = statements.slice(0, 3)

  function fmtPeriod(s: IncomeStatement) {
    const from = s.periodFrom.replace(/-/g, '/').slice(2)
    const to   = s.periodTo.replace(/-/g, '/').slice(2)
    return `${from} – ${to} ${s.statementDate.slice(0, 4)}`
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Income Statements panel */}
      <Card className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text">{t('finance.sidebar.statementsTitle')}</h3>
          <Link to="/finance/income/statements" className="text-xs font-semibold text-brand hover:underline">
            {t('finance.sidebar.more')} &rsaquo;
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-xs text-muted">{t('finance.sidebar.noStatements')}</p>
        ) : (
          <div>
            {recent.map((s) => (
              <StatementEntry
                key={s.id}
                label={fmtPeriod(s)}
                onDownload={() => onDownloadStatement(s.id)}
              />
            ))}
          </div>
        )}
      </Card>

      {/* My Tax Invoices panel */}
      <Card className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text">{t('finance.sidebar.taxInvoicesTitle')}</h3>
          <Link to="/finance/income/tax-invoices" className="text-xs font-semibold text-brand hover:underline">
            {t('finance.sidebar.more')} &rsaquo;
          </Link>
        </div>
        <p className="text-xs text-muted">{t('finance.sidebar.noInvoices')}</p>
      </Card>

      {/* Quick link to balance */}
      <Link to="/finance/balance" className="block">
        <Button variant="outline" size="sm" className="w-full">
          {t('finance.sidebar.viewBalance')}
        </Button>
      </Link>
    </div>
  )
}
