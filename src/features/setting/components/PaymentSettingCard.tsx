import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { usePaymentSettings, useUpdatePaymentSettings } from '../api/setting.queries'
import type { WithdrawalFrequency } from '../types/setting.types'
import { Toggle } from './Toggle'

// Payment Setting — auto withdrawal toggle (with frequency picker) + balance PIN row.
// Matches screenshot: 04 Payment Setting.png

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function PaymentSettingCard() {
  const { t } = useTranslation()
  const { data, isLoading } = usePaymentSettings()
  const update = useUpdatePaymentSettings()

  if (isLoading || !data) {
    return <Card className="flex items-center justify-center p-10"><Spinner /></Card>
  }

  const patch = (next: Partial<typeof data>) => update.mutate({ ...data, ...next })

  return (
    <Card className="flex flex-col">
      {/* Auto Withdrawal */}
      <div className="flex flex-col gap-3 border-b border-border px-6 py-5">
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-text">{t('setting.paymentSetting.autoWithdrawal')}</span>
            <span className="text-xs text-muted">{t('setting.paymentSetting.autoWithdrawalDesc')}</span>
          </div>
          <Toggle
            checked={data.autoWithdrawalEnabled}
            disabled={update.isPending}
            onChange={() => patch({ autoWithdrawalEnabled: !data.autoWithdrawalEnabled })}
            label={t('setting.paymentSetting.autoWithdrawal')}
          />
        </div>

        {/* Frequency picker — visible only when toggle ON */}
        {data.autoWithdrawalEnabled && (
          <div className="mt-2 flex flex-col gap-3 rounded-lg border border-border bg-bg p-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-text-secondary w-24">{t('setting.paymentSetting.frequency')}</span>
              <div className="flex gap-2">
                {(['daily', 'weekly', 'monthly'] as WithdrawalFrequency[]).map((f) => (
                  <Button
                    key={f}
                    size="sm"
                    variant={data.autoWithdrawalFrequency === f ? 'primary' : 'outline'}
                    onClick={() => patch({ autoWithdrawalFrequency: f })}
                  >
                    {t(`setting.paymentSetting.${f}`)}
                  </Button>
                ))}
              </div>
            </div>

            {data.autoWithdrawalFrequency === 'weekly' && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-text-secondary w-24">{t('setting.paymentSetting.dayOfWeek')}</span>
                <div className="flex gap-1.5">
                  {DAYS_OF_WEEK.map((d, i) => (
                    <Button
                      key={d}
                      size="sm"
                      variant={data.autoWithdrawalDay === i + 1 ? 'primary' : 'outline'}
                      onClick={() => patch({ autoWithdrawalDay: i + 1 })}
                      className="h-8 w-10 px-0"
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {data.autoWithdrawalFrequency === 'monthly' && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-text-secondary w-24">{t('setting.paymentSetting.dayOfMonth')}</span>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                    <Button
                      key={d}
                      size="sm"
                      variant={data.autoWithdrawalDay === d ? 'primary' : 'outline'}
                      onClick={() => patch({ autoWithdrawalDay: d })}
                      className="h-8 w-9 px-0"
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Seller Balance PIN */}
      <div className="flex items-center justify-between gap-6 px-6 py-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-text">{t('setting.paymentSetting.balancePin')}</span>
          <span className="text-xs text-muted">{t('setting.paymentSetting.balancePinDesc')}</span>
        </div>
        <Button variant="outline" size="sm">
          {t('setting.paymentSetting.update')}
        </Button>
      </div>
    </Card>
  )
}
