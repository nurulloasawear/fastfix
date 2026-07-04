import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { SearchIcon } from './icons'

type Props = {
  orderId: string
  shippingChannel: string
  onOrderIdChange: (value: string) => void
  onShippingChannelChange: (value: string) => void
  onApply: () => void
  onReset: () => void
}

export function OrderFilters({
  orderId, shippingChannel, onOrderIdChange, onShippingChannelChange, onApply, onReset,
}: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-border px-4 py-3">
      <div className="min-w-[200px] flex-1">
        <Input
          value={orderId}
          onChange={(e) => onOrderIdChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onApply() }}
          placeholder={t('orders.orderId')}
          trailing={<SearchIcon size={15} />}
        />
      </div>

      <div className="min-w-[180px]">
        <Select
          value={shippingChannel}
          onChange={(e) => onShippingChannelChange(e.target.value)}
        >
          <option value="">{t('orders.allChannels')}</option>
          <option value="yandex">Yandex Delivery</option>
          <option value="cdek">CDEK</option>
          <option value="self">Self-Delivery</option>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onReset}>{t('orders.reset')}</Button>
        <Button size="sm" onClick={onApply}>{t('orders.apply')}</Button>
      </div>
    </div>
  )
}
