import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { pickLang } from '@/lib/lang'
import type { Language } from '@/i18n'
import { Button } from '@/components/ui/Button'
import type { MarketingEvent } from '../types/marketing.types'
import { Megaphone, TicketIcon, TrendingUp, TruckIcon } from './icons'

type Props = { event: MarketingEvent }

const ICON = {
  ads: Megaphone,
  vouchers: TicketIcon,
  shipping: TruckIcon,
} as const

export function EventCard({ event }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language
  const Icon = ICON[event.kind]

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-bg p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-brand">
        <Icon size={20} />
      </div>
      <h3 className="font-semibold text-text">{pickLang(event.title, lang)}</h3>
      <p className="flex items-center gap-1.5 text-sm font-semibold text-success">
        <TrendingUp size={15} />
        {pickLang(event.upliftLabel, lang)}
      </p>
      <Link to={event.to} className="mt-auto">
        <Button className="w-full">{t('marketing.centre.createNow')}</Button>
      </Link>
    </div>
  )
}
