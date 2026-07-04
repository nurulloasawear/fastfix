import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { AccountStatus, PaymentAccount } from '../types/finance.types'

// Brand colors per service — kept as numeric constants (design spec, not Zenith tokens)
const HEADER_COLORS: Record<string, string> = {
  KAPITALBANK: '#2c3e7a',
  ATMOS: '#e05f2c',
  PAYME: '#00aeef',
  HUMO: '#8b1e3f',
  UZCARD: '#1a6b35',
}

function headerColor(bankName: string) {
  return HEADER_COLORS[bankName.toUpperCase()] ?? '#2d201c'
}

function statusTone(s: AccountStatus): 'success' | 'warning' | 'error' {
  if (s === 'verified' || s === 'checked') return 'success'
  if (s === 'pending') return 'warning'
  return 'error'
}

type Props = {
  account: PaymentAccount
  onSetDefault: (id: string) => void
  onRemove: (id: string) => void
  busy: boolean
}

export function PaymentAccountCard({ account, onSetDefault, onRemove, busy }: Props) {
  const { t } = useTranslation()
  const bg = headerColor(account.bankName)

  return (
    <div className="w-56 overflow-hidden rounded-lg border border-border shadow-xs">
      {/* Colored header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: bg }}>
        <span className="truncate text-sm font-semibold text-white">{account.bankName}</span>
        {account.status === 'error' && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-error">✕</span>
        )}
      </div>

      {/* Body */}
      <div className="bg-surface px-4 py-3">
        <Badge tone={statusTone(account.status)} className="mb-2">
          {t(`finance.payAccount.status.${account.status}`)}
        </Badge>
        <p className="my-2 text-xl font-bold tracking-widest text-text">{account.maskedNumber}</p>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{account.holderName}</p>
          {account.isDefault && (
            <Badge tone="info" className="text-[10px]">{t('finance.payAccount.default')}</Badge>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex gap-1 border-t border-border bg-surface px-3 py-2">
        {!account.isDefault && (
          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => onSetDefault(account.id)}
            className="flex-1"
          >
            {t('finance.payAccount.setDefault')}
          </Button>
        )}
        <Button
          variant="destructive"
          size="sm"
          disabled={busy}
          onClick={() => onRemove(account.id)}
          className="flex-1"
        >
          {t('finance.payAccount.remove')}
        </Button>
      </div>
    </div>
  )
}
