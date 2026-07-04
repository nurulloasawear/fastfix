import { useTranslation } from 'react-i18next'
import { useCustomerServiceUi } from '../stores/customer-service.store'
import { SearchIcon } from './icons'

// Dark hero banner with the big help search box. Search is wired to the help store
// and drives the FAQ accordion filtering below it.
export function HelpHero() {
  const { t } = useTranslation()
  const search = useCustomerServiceUi((s) => s.helpSearch)
  const setSearch = useCustomerServiceUi((s) => s.setHelpSearch)

  return (
    <div className="rounded-lg bg-brand px-6 py-10 text-center text-white shadow-xs">
      <h2 className="text-xl font-semibold">{t('customerService.help.heroTitle')}</h2>
      <p className="mt-2 text-sm text-white/70">{t('customerService.help.heroSubtitle')}</p>

      <div className="mx-auto mt-6 flex h-11 max-w-md items-center gap-2 rounded-lg bg-surface px-3.5">
        <SearchIcon size={16} className="shrink-0 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('customerService.help.heroSearchPlaceholder')}
          className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
        />
      </div>
    </div>
  )
}
