import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Generic stand-in for routes whose feature isn't built yet.
export function PlaceholderPage() {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const name = pathname.replace('/', '') || 'page'

  return (
    <div className="p-10 text-center text-muted">
      <h1 className="mb-2 text-lg font-semibold capitalize text-text">{name}</h1>
      <p className="text-sm">
        {t('common.comingSoon')} — build it as a feature under <code>src/features/{name}/</code>.
      </p>
    </div>
  )
}
