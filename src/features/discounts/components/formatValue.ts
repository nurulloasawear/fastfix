import { formatUZS } from '@/utils/money'
import type { Discount } from '../types/discounts.types'

// Display a discountʻs value: percentage → "-20%"; fixed → "-150 000 soʻm".
// Both render as a deduction so the saving reads consistently across the UI.
export function formatDiscountValue(discount: Discount): string {
  if (discount.type === 'percentage') return `-${discount.valuePercent ?? 0}%`
  return `-${formatUZS(discount.valueUzs ?? 0)}`
}
