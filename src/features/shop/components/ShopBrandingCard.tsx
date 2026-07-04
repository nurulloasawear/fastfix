import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { ShopProfile } from '../types/shop.types'

const STATUS_TONE: Record<ShopProfile['status'], 'success' | 'warning' | 'error'> = {
  active: 'success',
  paused: 'warning',
  suspended: 'error',
}

export function ShopBrandingCard({ profile }: { profile: ShopProfile }) {
  const { t } = useTranslation()
  const initial = (profile.name || 'O').charAt(0).toUpperCase()

  return (
    <Card className="p-6 text-center">
      <h3 className="mb-4 text-left text-sm font-semibold text-text">{t('shop.info.branding')}</h3>

      <div className="group relative mb-12 flex h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-brand to-brand-dark">
        <span className="rounded-full bg-black/30 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
          {t('shop.info.changeBanner')}
        </span>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-surface bg-bg text-2xl font-bold text-muted shadow-md">
            {initial}
          </div>
        </div>
      </div>

      <div className="mt-2">
        <h4 className="font-semibold text-text">{profile.name || t('shop.info.defaultName')}</h4>
        <p className="mt-0.5 text-xs text-muted">
          {t('shop.info.idLabel')}: {profile.id}
        </p>
      </div>

      <hr className="my-4 border-border" />

      <div className="space-y-2.5 text-left text-xs text-muted">
        <div className="flex items-center justify-between">
          <span>{t('shop.info.statusLabel')}:</span>
          <Badge tone={STATUS_TONE[profile.status]}>{t(`shop.info.status.${profile.status}`)}</Badge>
        </div>
        <div className="flex justify-between">
          <span>{t('shop.info.registered')}:</span>
          <span className="font-medium text-text">{profile.registeredAt}</span>
        </div>
      </div>
    </Card>
  )
}
