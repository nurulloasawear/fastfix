import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { useProductSettings, useUpdateProductSettings } from '../api/setting.queries'
import { Toggle } from './Toggle'

// Product Setting — content reuse consent toggle with OZB Terms of Service link.
// Matches screenshot: 06 Product Setting.png

export function ProductSettingCard() {
  const { t } = useTranslation()
  const { data, isLoading } = useProductSettings()
  const update = useUpdateProductSettings()

  if (isLoading || !data) {
    return <Card className="flex items-center justify-center p-10"><Spinner /></Card>
  }

  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between gap-6 px-6 py-5">
        <div className="flex max-w-2xl flex-col gap-1">
          <span className="text-sm font-semibold text-text">
            {t('setting.productSetting.contentReuseLabel')}
          </span>
          <span className="text-sm text-muted">
            {t('setting.productSetting.contentReuseDesc')}{' '}
            <a href="/legal/seller-terms" className="text-brand hover:underline">
              {t('setting.productSetting.termsLink')}
            </a>
          </span>
        </div>
        <Toggle
          checked={data.allowContentReuse}
          disabled={update.isPending}
          onChange={() => update.mutate({ ...data, allowContentReuse: !data.allowContentReuse })}
          label={t('setting.productSetting.contentReuseLabel')}
        />
      </div>
    </Card>
  )
}
