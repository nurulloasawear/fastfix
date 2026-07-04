import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { useSecurity, useSetTwoFactor } from '../api/setting.queries'
import { ShieldIcon } from './icons'
import { Toggle } from './Toggle'

// 2FA toggle card (server-backed via mock). State comes from the query, never local.
export function TwoFactorCard() {
  const { t } = useTranslation()
  const { data, isLoading } = useSecurity()
  const setTwoFactor = useSetTwoFactor()

  const enabled = data?.twoFactorEnabled ?? false

  return (
    <Card className="flex h-full flex-col justify-between gap-4 p-6">
      <div className="flex flex-col gap-2">
        <ShieldIcon size={26} className="text-brand" />
        <h3 className="text-base font-semibold text-text">{t('setting.security.twoFactorTitle')}</h3>
        <p className="text-sm text-muted">{t('setting.security.twoFactorDesc')}</p>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs font-semibold text-muted">
          {enabled ? t('setting.security.enabled') : t('setting.security.disabled')}
        </span>
        <Toggle
          checked={enabled}
          disabled={isLoading || setTwoFactor.isPending}
          onChange={() => setTwoFactor.mutate(!enabled)}
          label={t('setting.security.twoFactorTitle')}
        />
      </div>
    </Card>
  )
}
