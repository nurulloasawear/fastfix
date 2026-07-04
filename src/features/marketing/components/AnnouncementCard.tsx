import { useTranslation } from 'react-i18next'
import { pickLang } from '@/lib/lang'
import type { Language } from '@/i18n'
import { Badge } from '@/components/ui/Badge'
import type { Announcement } from '../types/marketing.types'
import { Megaphone } from './icons'

type Props = { announcement: Announcement }

export function AnnouncementCard({ announcement }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language

  return (
    <div className="flex gap-4 rounded-lg border border-border bg-bg p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-brand">
        <Megaphone size={18} />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-text">{pickLang(announcement.title, lang)}</h3>
        <p className="mt-1 text-sm text-text-secondary">{pickLang(announcement.body, lang)}</p>
        <span className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          {announcement.isNew && <Badge tone="brand">{t('marketing.centre.new')}</Badge>}
          {announcement.publishedAt}
        </span>
      </div>
    </div>
  )
}
