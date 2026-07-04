import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { pickLang } from '@/lib/lang'
import type { Language } from '@/i18n'
import type { NotificationCategory, NotificationItem } from '../types/notifications.types'
import { MailOpenIcon, MegaphoneIcon, PackageIcon, RefreshIcon, StarIcon, TagIcon, WalletIcon } from './icons'

// Each category gets its own icon + accent tone so rows are scannable at a glance.
const CATEGORY_ICON: Record<NotificationCategory, ReactNode> = {
  order_updates: <PackageIcon size={22} />,
  rating: <StarIcon size={22} />,
  return_refund: <RefreshIcon size={22} />,
  listing: <TagIcon size={22} />,
  marketing_centre: <MegaphoneIcon size={22} />,
  seller_balance: <WalletIcon size={22} />,
}

const CATEGORY_TONE: Record<NotificationCategory, string> = {
  order_updates: 'bg-[#eff8ff] text-[#175cd3]',
  rating: 'bg-warning-bg text-warning',
  return_refund: 'bg-error-bg text-error-text',
  listing: 'bg-success-bg text-success',
  marketing_centre: 'bg-[#f5efea] text-brand',
  seller_balance: 'bg-[#f4f3ff] text-[#6938ef]',
}

function formatDateTime(iso: string, locale: Language): string {
  const map: Record<Language, string> = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-US' }
  return new Date(iso).toLocaleString(map[locale], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type Props = { notification: NotificationItem; onMarkRead: (id: string) => void; isMarking: boolean }

export function NotificationRow({ notification, onMarkRead, isMarking }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language

  return (
    <article
      className={`flex gap-4 border-b border-border p-4 last:border-0 ${
        notification.read ? 'bg-surface' : 'bg-bg'
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${CATEGORY_TONE[notification.category]}`}
      >
        {CATEGORY_ICON[notification.category]}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <h3 className="flex-1 font-medium text-text">{pickLang(notification.title, lang)}</h3>
          {!notification.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />}
        </div>
        <p className="mt-1 text-sm text-muted">{pickLang(notification.body, lang)}</p>
        <div className="mt-2 flex items-center gap-3">
          <time className="text-xs text-muted">{formatDateTime(notification.createdAt, lang)}</time>
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              disabled={isMarking}
              onClick={() => onMarkRead(notification.id)}
              className="h-auto gap-1 px-0 text-xs text-brand hover:bg-transparent hover:text-accent"
            >
              <MailOpenIcon size={14} />
              {t('notifications.markRead')}
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
