// PUBLIC API of the discounts feature. Pages import ONLY from here
// (`@/features/discounts`) — never a deep path. ESLint enforces this.
export {
  discountKeys,
  useDiscounts,
  useCreateDiscount,
  useUpdateDiscount,
  useDeleteDiscount,
  useToggleDiscountStatus,
} from './api/discounts.queries'

export { useDiscountsUi } from './stores/discounts.store'

export { DiscountStats } from './components/DiscountStats'
export { DiscountFilters } from './components/DiscountFilters'
export { DiscountTable } from './components/DiscountTable'
export { DiscountMobileList } from './components/DiscountMobileList'
export { DiscountFormModal } from './components/DiscountFormModal'
export { DeleteConfirmModal } from './components/DeleteConfirmModal'
export { DiscountForm } from './components/DiscountForm'
export { TicketIcon, Plus } from './components/icons'

// MSW handlers + i18n (consumed by the orchestrator)
export { discountsHandlers } from './api/discounts.mocks'
export { discountsMessages } from './i18n'

export type {
  Discount,
  DiscountType,
  DiscountStatus,
  TypeFilter,
  StatusFilter,
  DiscountSummary,
  DiscountListQuery,
  DiscountListResponse,
  DiscountInput,
} from './types/discounts.types'
