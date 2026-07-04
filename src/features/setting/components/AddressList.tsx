import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { useDeleteAddress } from '../api/setting.queries'
import { tError } from '@/i18n'
import { ApiError } from '@/lib/apiError'
import type { Address } from '../types/setting.types'
import { MapPinIcon } from './icons'

// Badge tone per address kind — main=success(green), pickup=warning(amber), return=info(sky).
const BADGES = [
  { key: 'isDefault' as const, label: 'mainAddress', tone: 'success' as const },
  { key: 'isPickup' as const, label: 'pickupAddress', tone: 'warning' as const },
  { key: 'isReturn' as const, label: 'returnAddress', tone: 'info' as const },
]

interface AddressListProps {
  addresses: Address[]
  isLoading: boolean
  onEdit?: (a: Address) => void
}

export function AddressList({ addresses, isLoading, onEdit }: AddressListProps) {
  const { t } = useTranslation()
  const toast = useToast()
  const del = useDeleteAddress()

  function handleDelete(a: Address) {
    if (!window.confirm(t('setting.addresses.confirmDelete', { defaultValue: 'Bu manzilni oʻchirilsinmi?' }))) return
    del.mutate(a.id, {
      onSuccess: () => toast.success(t('setting.addresses.deleted', { defaultValue: 'Manzil oʻchirildi' })),
      onError: (err) => toast.error(tError(err instanceof ApiError ? err.code : 'internal_error')),
    })
  }

  if (isLoading) {
    return <div className="flex justify-center py-10"><Spinner /></div>
  }
  if (addresses.length === 0) {
    return (
      <EmptyState
        icon={<MapPinIcon size={28} />}
        title={t('setting.addresses.empty')}
      />
    )
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {addresses.map((a) => (
        <div key={a.id} className="flex items-start gap-3 py-5 first:pt-0 last:pb-0">
          <MapPinIcon size={18} className="mt-0.5 shrink-0 text-text" />
          <div className="flex flex-1 flex-col gap-2 text-sm">
            <div className="flex flex-wrap gap-1.5">
              {BADGES.filter((b) => a[b.key]).map((b) => (
                <Badge key={b.key} tone={b.tone}>
                  {t(`setting.addresses.${b.label}`)}
                </Badge>
              ))}
            </div>
            <dl className="flex flex-col gap-1 text-text">
              <Row label={t('setting.addresses.fullName')} value={a.fullName} strong />
              <Row label={t('setting.addresses.phoneNumber')} value={a.phone} strong />
              <Row
                label={t('setting.addresses.address')}
                value={`${a.companyAddress}, ${a.townCity}, ${a.state}, ${a.countryRegion} ${a.pincode}`}
              />
            </dl>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button variant="ghost" className="shrink-0" onClick={() => onEdit?.(a)}>
              {t('setting.common.edit')}
            </Button>
            <Button variant="ghost" className="shrink-0 text-error-text" disabled={del.isPending} onClick={() => handleDelete(a)}>
              {t('setting.common.delete', { defaultValue: 'Oʻchirish' })}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex gap-2">
      <dt className="w-28 shrink-0 text-muted">{label}</dt>
      <dd className={strong ? 'font-semibold text-text' : 'text-text'}>{value}</dd>
    </div>
  )
}
