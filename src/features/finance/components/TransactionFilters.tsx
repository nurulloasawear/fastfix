import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { MoneyFlow, TransactionType } from '../types/finance.types'

const TX_TYPES: TransactionType[]  = ['order_income', 'adjustment', 'refund', 'withdrawal', 'platform_fee']
const MONEY_FLOWS: MoneyFlow[]     = ['all', 'money_in', 'money_out']

type Props = {
  moneyFlow: MoneyFlow
  txTypes: TransactionType[]
  onMoneyFlowChange: (f: MoneyFlow) => void
  onTxTypesChange: (types: TransactionType[]) => void
  onReset: () => void
  onApply: () => void
}

export function TransactionFilters({ moneyFlow, txTypes, onMoneyFlowChange, onTxTypesChange, onReset, onApply }: Props) {
  const { t } = useTranslation()

  function toggleType(type: TransactionType) {
    if (txTypes.includes(type)) {
      onTxTypesChange(txTypes.filter((x) => x !== type))
    } else {
      onTxTypesChange([...txTypes, type])
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Money Flow */}
        <div className="flex items-center gap-4">
          <span className="w-40 shrink-0 text-sm font-semibold text-text-secondary">
            {t('finance.txFilters.moneyFlow')}
          </span>
          <div className="flex flex-wrap gap-1">
            {MONEY_FLOWS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onMoneyFlowChange(f)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors border ${
                  moneyFlow === f
                    ? 'bg-brand text-white border-brand'
                    : 'border-border-strong bg-surface text-text-secondary hover:bg-bg'
                }`}
              >
                {t(`finance.txFilters.flow.${f}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Shop Type — local only (cross-border hidden MVP) */}
        <div className="flex items-center gap-4">
          <span className="w-40 shrink-0 text-sm font-semibold text-text-secondary">
            {t('finance.txFilters.shopType')}
          </span>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input type="radio" readOnly checked className="accent-brand" />
            <span className="text-sm text-text">{t('finance.txFilters.local')}</span>
          </label>
        </div>

        {/* Transaction Type checkboxes */}
        <div className="flex items-start gap-4">
          <span className="w-40 shrink-0 text-sm font-semibold text-text-secondary">
            {t('finance.txFilters.txType')}
          </span>
          <div className="flex flex-wrap gap-3">
            {TX_TYPES.map((type) => (
              <label key={type} className="flex cursor-pointer items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={txTypes.includes(type)}
                  onChange={() => toggleType(type)}
                  className="accent-brand"
                />
                <span className="text-sm text-text">{t(`finance.txFilters.type.${type}`)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-border pt-3">
          <Button variant="outline" size="sm" onClick={onReset}>{t('finance.txFilters.reset')}</Button>
          <Button size="sm" onClick={onApply}>{t('finance.txFilters.apply')}</Button>
        </div>
      </div>
    </Card>
  )
}
