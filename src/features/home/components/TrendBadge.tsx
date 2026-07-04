import { Badge } from '@/components/ui/Badge'
import type { TrendDirection } from '../types/home.types'
import { TrendDownIcon, TrendUpIcon } from './icons'

type Props = { pct: number; direction: TrendDirection }

// Up = positive (success green), down = negative (warning amber). The pct is
// formatted with a sign so the badge reads e.g. "+18.67%" / "-4.12%".
export function TrendBadge({ pct, direction }: Props) {
  const isUp = direction === 'up'
  const Icon = isUp ? TrendUpIcon : TrendDownIcon

  return (
    <Badge tone={isUp ? 'success' : 'warning'}>
      <Icon size={12} />
      {isUp ? '+' : '-'}
      {pct.toFixed(2)}%
    </Badge>
  )
}
