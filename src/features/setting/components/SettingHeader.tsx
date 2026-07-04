import { useTranslation } from 'react-i18next'

// Page title + breadcrumb (Home › Settings › <current>) shared by every setting page.
interface SettingHeaderProps {
  title: string
  current: string
}

export function SettingHeader({ title, current }: SettingHeaderProps) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-muted">
        {t('setting.breadcrumbHome')} › {t('setting.breadcrumbSettings')} › {current}
      </div>
      <h1 className="text-2xl font-semibold text-text">{title}</h1>
    </div>
  )
}
