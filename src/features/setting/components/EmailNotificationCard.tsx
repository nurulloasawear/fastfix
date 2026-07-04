import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { useEmailNotifications, useUpdateEmailNotifications } from '../api/setting.queries'
import type { EmailNotificationPrefs } from '../types/setting.types'
import { Toggle } from './Toggle'

// Email Notifications card — Updates + Promotions sections, Disable Email button.
// Matches screenshot: 03 Notification Settings.png

interface NotifRowProps {
  label: string
  desc: string
  checked: boolean
  disabled: boolean
  onChange: () => void
}

function NotifRow({ label, desc, checked, disabled, onChange }: NotifRowProps) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-text">{label}</span>
        <span className="text-xs text-muted">{desc}</span>
      </div>
      <Toggle checked={checked} disabled={disabled} onChange={onChange} label={label} />
    </div>
  )
}

export function EmailNotificationCard() {
  const { t } = useTranslation()
  const { data, isLoading } = useEmailNotifications()
  const update = useUpdateEmailNotifications()

  if (isLoading || !data) {
    return <Card className="flex items-center justify-center p-10"><Spinner /></Card>
  }

  const patch = (next: Partial<EmailNotificationPrefs>) =>
    update.mutate({ ...data, ...next })

  const disabled = data.emailAllDisabled

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <h2 className="text-base font-semibold text-text">{t('setting.emailNotif.title')}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => patch({ emailAllDisabled: !disabled })}
          disabled={update.isPending}
        >
          {disabled ? t('setting.emailNotif.enableEmail') : t('setting.emailNotif.disableEmail')}
        </Button>
      </div>

      <div className={`flex flex-col px-6 py-4 transition-opacity ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Updates sub-section */}
        <h3 className="mb-1 text-sm font-semibold text-text">{t('setting.emailNotif.updates')}</h3>
        <div className="flex flex-col divide-y divide-border">
          <NotifRow
            label={t('setting.emailNotif.orderLabel')}
            desc={t('setting.emailNotif.orderDesc')}
            checked={data.notifOrderEmail && !disabled}
            disabled={disabled || update.isPending}
            onChange={() => patch({ notifOrderEmail: !data.notifOrderEmail })}
          />
          <NotifRow
            label={t('setting.emailNotif.listingLabel')}
            desc={t('setting.emailNotif.listingDesc')}
            checked={data.notifListingEmail && !disabled}
            disabled={disabled || update.isPending}
            onChange={() => patch({ notifListingEmail: !data.notifListingEmail })}
          />
          <NotifRow
            label={t('setting.emailNotif.policyLabel')}
            desc={t('setting.emailNotif.policyDesc')}
            checked={data.notifPolicyEmail && !disabled}
            disabled={disabled || update.isPending}
            onChange={() => patch({ notifPolicyEmail: !data.notifPolicyEmail })}
          />
        </div>

        {/* Promotions sub-section */}
        <h3 className="mb-1 mt-5 text-sm font-semibold text-text">{t('setting.emailNotif.promotions')}</h3>
        <div className="flex flex-col divide-y divide-border">
          <NotifRow
            label={t('setting.emailNotif.promoLabel')}
            desc={t('setting.emailNotif.promoDesc')}
            checked={data.notifPromotionsEmail && !disabled}
            disabled={disabled || update.isPending}
            onChange={() => patch({ notifPromotionsEmail: !data.notifPromotionsEmail })}
          />
          <NotifRow
            label={t('setting.emailNotif.surveyLabel')}
            desc={t('setting.emailNotif.surveyDesc')}
            checked={data.notifSurveysEmail && !disabled}
            disabled={disabled || update.isPending}
            onChange={() => patch({ notifSurveysEmail: !data.notifSurveysEmail })}
          />
        </div>
      </div>
    </Card>
  )
}
