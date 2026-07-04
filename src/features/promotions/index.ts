// PUBLIC API of the promotions feature (product price promotions:
// discount / bundle / add-on). Pages import ONLY from here.
export {
  usePromotions, usePromotion, useSaveDiscountPromotion, useDeletePromotion, useDuplicatePromotion,
} from './api/promotions.queries'
export { DiscountProductEditor } from './components/DiscountProductEditor'
export { PromotionProductPicker } from './components/PromotionProductPicker'
export type {
  PromotionListItem, PromotionDetail, PromotionProductRow, PromotionStatus, PromotionType, DiscountKind, DiscountLine,
} from './types/promotions.types'
