import type { ComponentType, SVGProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { formatUZS } from '@/utils/money'
import type { TodoItem, TodoKind } from '../types/home.types'
import {
  BanIcon,
  BanknoteIcon,
  CartIcon,
  MegaphoneIcon,
  PackageCheckIcon,
  PackageXIcon,
  RefundIcon,
  TruckIcon,
} from './icons'
import { TrendBadge } from './TrendBadge'

type IconType = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

const TODO_ICONS: Record<TodoKind, IconType> = {
  unpaid: BanknoteIcon,
  to_process: TruckIcon,
  processed: PackageCheckIcon,
  pending_cancellation: CartIcon,
  pending_return: RefundIcon,
  banned: BanIcon,
  sold_out: PackageXIcon,
  campaign: MegaphoneIcon,
}

type Props = { item: TodoItem }

export function TodoCard({ item }: Props) {
  const { t } = useTranslation()
  const Icon = TODO_ICONS[item.kind]
  const value = item.amountUzs != null ? formatUZS(item.amountUzs) : String(item.count)

  return (
    <Card className="flex flex-col gap-3 p-5 transition-colors hover:border-brand">
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-warning-bg text-brand">
          <Icon size={22} />
        </span>
        <TrendBadge pct={item.trendPct} direction={item.trendDirection} />
      </div>

      <strong className="text-2xl font-semibold text-text">{value}</strong>
      <p className="text-sm font-medium text-muted">{t(`home.todo.kind.${item.kind}`)}</p>
    </Card>
  )
}
