import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { useNotifications, useUpdateNotifications } from '../api/setting.queries'
import { NOTIFICATION_CHANNELS } from '../types/setting.types'
import type { NotificationChannel, NotificationSettings } from '../types/setting.types'
import { Toggle } from './Toggle'

// Email notification preferences (server-backed via mock). When email is off the whole
// list is dimmed + disabled — derived from `emailEnabled`, never hardcoded.
export function NotificationSettingsCard() {
  const { t } = useTranslation()
  const { data, isLoading } = useNotifications()
  const update = useUpdateNotifications()

  if (isLoading || !data) {
    return <Card className="flex items-center justify-center p-10"><Spinner /></Card>
  }

  const patch = (next: Partial<NotificationSettings>) =>
    update.mutate({ ...data, ...next })

  const toggleChannel = (channel: NotificationChannel) => {
    if (!data.emailEnabled) return
    patch({ [channel]: !data[channel] })
  }

  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-text">{t('setting.shop.notificationSettings')}</h2>
          <p className="mt-1 text-sm font-semibold text-text">{t('setting.shop.emailNotifications')}</p>
          <p className="text-sm text-muted">{t('setting.shop.emailNotificationsDesc')}</p>
        </div>
        <Button variant="outline" onClick={() => patch({ emailEnabled: !data.emailEnabled })}>
          {data.emailEnabled ? t('setting.shop.disableEmail') : t('setting.shop.enableEmail')}
        </Button>
      </div>

      <div className={`flex flex-col gap-2.5 transition-opacity ${data.emailEnabled ? '' : 'opacity-50'}`}>
        {NOTIFICATION_CHANNELS.map((channel) => (
          <div
            key={channel}
            className="flex items-center justify-between rounded-lg border border-border bg-bg px-4 py-3"
          >
            <span className="text-sm text-text">{t(`setting.shop.${channel}`)}</span>
            <Toggle
              checked={data[channel] && data.emailEnabled}
              disabled={!data.emailEnabled}
              onChange={() => toggleChannel(channel)}
              label={t(`setting.shop.${channel}`)}
            />
          </div>
        ))}
      </div>
    </Card>
  )
}
