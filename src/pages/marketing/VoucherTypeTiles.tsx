import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TicketIcon } from '@/features/marketing'
import type { VoucherType } from '@/features/marketing'

const GENERAL_TYPES: VoucherType[] = ['shop', 'product']
const DIST_TYPES: VoucherType[] = ['private', 'live', 'video']
const BUYER_TYPES: VoucherType[] = ['new_buyer', 'repeat_buyer', 'follow_prize']

function TypeGroup({ types, cols }: { types: VoucherType[]; cols: string }) {
  const { t } = useTranslation()
  return (
    <div className={`grid gap-3 ${cols}`}>
      {types.map((type) => (
        <Link
          key={type}
          to={`/marketing/vouchers/new?type=${type}`}
          className="group flex flex-col gap-2 rounded-lg border border-border bg-bg p-4 transition-colors hover:border-brand hover:bg-surface"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-brand">
            <TicketIcon size={17} />
          </div>
          <p className="text-xs font-semibold text-text">{t(`marketing.vouchers.type.${type}`)}</p>
          <p className="text-xs text-muted">{t(`marketing.vouchers.typeDesc.${type}`)}</p>
          <Button size="sm" variant="outline" className="mt-auto w-full" tabIndex={-1}>
            {t('marketing.vouchers.create')}
          </Button>
        </Link>
      ))}
    </div>
  )
}

export function VoucherTypeTiles() {
  const { t } = useTranslation()

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-text">{t('marketing.vouchers.createSection')}</h2>
        <Button variant="ghost" size="sm">{t('marketing.vouchers.learnMore')}</Button>
      </div>

      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
        {t('marketing.vouchers.general')}
      </p>
      <TypeGroup types={GENERAL_TYPES} cols="grid-cols-2 sm:grid-cols-4 mb-6" />

      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
        {t('marketing.vouchers.distribution')}
      </p>
      <TypeGroup types={DIST_TYPES} cols="grid-cols-2 sm:grid-cols-3 mb-6" />

      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
        {t('marketing.vouchers.buyerGroups')}
      </p>
      <TypeGroup types={BUYER_TYPES} cols="grid-cols-2 sm:grid-cols-3 mb-4" />

      <Button variant="ghost" size="sm" className="px-0">
        {t('marketing.vouchers.moreTypes')}
      </Button>
    </Card>
  )
}
