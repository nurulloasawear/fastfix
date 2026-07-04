import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { SettingsTabBar } from '@/features/setting'
import { usePaymentAccounts } from '@/features/finance'

// Payment Setting → the seller's withdrawal/bank accounts. These are the live
// payment-accounts managed by the Finance module; full add/OTP/default/remove lives
// at /finance/bank-accounts. This tab surfaces them + a Manage link.
export function PaymentSettingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: accounts, isLoading } = usePaymentAccounts()

  return (
    <Page>
      <PageHeader
        title={t('setting.paymentSetting.title')}
        breadcrumb={`${t('setting.breadcrumbHome')} › ${t('setting.breadcrumbSettings')} › ${t('setting.paymentSetting.title')}`}
      />
      <SettingsTabBar />

      <Card className="flex flex-col gap-5 p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-text">
              {t('setting.paymentSetting.accountsTitle', { defaultValue: 'Toʻlov hisoblari' })}
            </h2>
            <p className="text-sm text-muted">
              {t('setting.paymentSetting.accountsSubtitle', { defaultValue: 'Yechib olish uchun bank kartalaringiz.' })}
            </p>
          </div>
          <Button onClick={() => navigate('/finance/bank-accounts')}>
            {t('setting.paymentSetting.manage', { defaultValue: 'Hisoblarni boshqarish' })}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : (accounts?.length ?? 0) === 0 ? (
          <EmptyState
            title={t('setting.paymentSetting.empty', { defaultValue: 'Toʻlov hisobi qoʻshilmagan' })}
            description={t('setting.paymentSetting.emptyHint', { defaultValue: 'Pulni yechib olish uchun bank kartasi qoʻshing.' })}
            action={
              <Button variant="outline" size="sm" onClick={() => navigate('/finance/bank-accounts')}>
                {t('setting.paymentSetting.addAccount', { defaultValue: 'Hisob qoʻshish' })}
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {accounts!.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-text">{a.bankName || a.holderName}</span>
                  <span className="font-mono text-sm text-muted">{a.maskedNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  {a.isDefault && <Badge tone="success">{t('setting.paymentSetting.default', { defaultValue: 'Asosiy' })}</Badge>}
                  {a.status !== 'verified' && <Badge tone="warning">{a.status}</Badge>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Page>
  )
}
