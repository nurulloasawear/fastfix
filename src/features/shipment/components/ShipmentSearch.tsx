import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { SearchIcon } from './icons'

type Props = {
  search: string
  onSearchChange: (value: string) => void
  onSearch: () => void
  onClear: () => void
}

export function ShipmentSearch({ search, onSearchChange, onSearch, onClear }: Props) {
  const { t } = useTranslation()

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            placeholder={t('shipment.searchPlaceholder')}
            trailing={<SearchIcon size={16} />}
          />
        </div>
        <Button onClick={onSearch}>{t('shipment.search')}</Button>
        <Button variant="outline" onClick={onClear}>
          {t('shipment.clear')}
        </Button>
      </div>
    </Card>
  )
}
