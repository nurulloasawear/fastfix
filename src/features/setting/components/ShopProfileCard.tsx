import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { tError } from '@/i18n'
import { ApiError } from '@/lib/apiError'
import { useRegisterSeller, useSeller } from '../api/setting.queries'
import type { SellerStatus } from '../types/setting.types'

// Status badge tone — approved=brand, pending=warning, suspended=error, none=gray.
const STATUS_TONE: Record<SellerStatus, 'brand' | 'warning' | 'error' | 'gray'> = {
  approved: 'brand',
  pending: 'warning',
  suspended: 'error',
  none: 'gray',
}

// Real GET /sellers/me · POST /sellers/register. Shows the register form when the
// account has no shop yet; otherwise the read-only shop summary.
export function ShopProfileCard() {
  const { t } = useTranslation()
  const { data: seller, isLoading } = useSeller()
  const register = useRegisterSeller()
  const [shopName, setShopName] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (isLoading || !seller) {
    return <Card className="flex items-center justify-center p-10"><Spinner /></Card>
  }

  const onRegister = () => {
    setError(null)
    register.mutate(
      { shopName: shopName.trim() },
      { onError: (err) => setError(tError(err instanceof ApiError ? err.code : 'internal_error')) },
    )
  }

  if (!seller.registered) {
    return (
      <Card className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1 border-b border-border pb-4">
          <h2 className="text-base font-semibold text-text">{t('setting.shop.registerTitle')}</h2>
          <p className="text-sm text-muted">{t('setting.shop.registerDesc')}</p>
        </div>
        <Input
          label={t('setting.shop.shopName')}
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder={t('setting.shop.shopNamePlaceholder')}
        />
        {error && <p className="text-xs text-error-text">{error}</p>}
        <div className="flex justify-end">
          <Button disabled={register.isPending || shopName.trim().length === 0} onClick={onRegister}>
            {register.isPending ? t('setting.common.loading') : t('setting.shop.register')}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex items-start justify-between border-b border-border pb-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-text">{seller.shopName}</h2>
          <p className="text-sm text-muted">{t('setting.shop.statusLabel')}</p>
        </div>
        <Badge tone={STATUS_TONE[seller.status]}>
          {t(`setting.shop.status${seller.status.charAt(0).toUpperCase()}${seller.status.slice(1)}`)}
        </Badge>
      </div>
      {seller.registeredAt && (
        <div className="flex gap-2 text-sm">
          <span className="w-32 shrink-0 text-muted">{t('setting.shop.registeredAt')}</span>
          <span className="text-text">{seller.registeredAt}</span>
        </div>
      )}
    </Card>
  )
}
