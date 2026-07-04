import type { WidgetType } from '../types/shop.types'

// Widget catalogue for the Shop Decoration page-builder.
export type WidgetDef = {
  type: WidgetType
  group: 'visual_text' | 'product_category'
  labelKey: string
  icon: 'image' | 'video' | 'category' | 'text' | 'banner'
}

export const WIDGET_DEFS: WidgetDef[] = [
  { type: 'cover_image', group: 'visual_text', labelKey: 'shop.decoration.wCoverImage', icon: 'image' },
  { type: 'carousel', group: 'visual_text', labelKey: 'shop.decoration.wCarousel', icon: 'image' },
  { type: 'multi_image', group: 'visual_text', labelKey: 'shop.decoration.wMultiImage', icon: 'image' },
  { type: 'single_image', group: 'visual_text', labelKey: 'shop.decoration.wSingleImage', icon: 'image' },
  { type: 'text', group: 'visual_text', labelKey: 'shop.decoration.wText', icon: 'text' },
  { type: 'banner_with_tag', group: 'visual_text', labelKey: 'shop.decoration.wBannerTag', icon: 'banner' },
  { type: 'video', group: 'visual_text', labelKey: 'shop.decoration.wVideo', icon: 'video' },
  { type: 'product_highlights', group: 'product_category', labelKey: 'shop.decoration.wProducts', icon: 'image' },
  { type: 'product_category', group: 'product_category', labelKey: 'shop.decoration.wCategory', icon: 'category' },
]
