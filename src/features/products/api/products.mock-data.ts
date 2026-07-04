// Static mock datasets for MSW handlers — extracted so products.mocks.ts stays ≤200 lines.
import type {
  Brand, ListingIssue, ReviewProduct,
  SizeChart, UnpublishedProduct, ViolationProduct,
} from '../types/products.types'

const CATEGORY = 'Kiyim-kechak > Erkaklar > Yuqori kiyim'

// ── Backend-shaped (snake_case) mock data for ✅ real routes ─────────────────
// MSW serves these so the same mapSummaryToProduct / mapDetailToFormData
// mapper code runs in dev as in production.

export interface BackendProductStub {
  id: string
  title: { uz: string; ru: string; en: string }
  price_uzs: number
  compare_at_uzs?: number
  stock: number
  status: string
  image_urls: string[]
  category?: string
  brand?: string
}

export const BACKEND_PRODUCTS: BackendProductStub[] = [
  {
    id: 'p1',
    title: { uz: 'Universal Laptop Stand', ru: 'Подставка для ноутбука', en: 'Universal Laptop Stand' },
    price_uzs: 189000, stock: 0, status: 'active', image_urls: [],
    category: CATEGORY,
  },
  {
    id: 'p2',
    title: { uz: 'Simsiz quloqchin Pro', ru: 'Беспроводные наушники Pro', en: 'Wireless Earbuds Pro' },
    price_uzs: 299000, compare_at_uzs: 349000, stock: 124, status: 'active', image_urls: [],
    category: CATEGORY,
  },
  {
    id: 'p3',
    title: { uz: 'Paxta Oversize Futbolka', ru: 'Хлопковая оверсайз футболка', en: 'Cotton Oversize T-Shirt' },
    price_uzs: 99000, compare_at_uzs: 119000, stock: 540, status: 'active', image_urls: [],
    category: CATEGORY,
  },
  {
    id: 'p4',
    title: { uz: 'Aqlli LED lenta 5m', ru: 'Умная LED лента 5м', en: 'Smart LED Strip 5m' },
    price_uzs: 129000, stock: 8, status: 'active', image_urls: [],
    category: CATEGORY,
  },
  {
    id: 'p5',
    title: { uz: 'Soxta brend sumka', ru: 'Поддельная брендовая сумка', en: 'Counterfeit Brand Bag' },
    price_uzs: 259000, stock: 3, status: 'hidden', image_urls: [],
    category: CATEGORY,
  },
  {
    id: 'p6',
    title: { uz: 'Qishki kurtka', ru: 'Зимняя куртка', en: 'Winter Jacket' },
    price_uzs: 459000, compare_at_uzs: 599000, stock: 60, status: 'active', image_urls: [],
    category: CATEGORY,
  },
  {
    id: 'p7',
    title: { uz: 'Klassik charm kamar', ru: 'Классический кожаный ремень', en: 'Classic Leather Belt' },
    price_uzs: 119000, stock: 0, status: 'sold_out', image_urls: [],
    category: CATEGORY,
  },
  {
    id: 'p8',
    title: { uz: 'Yozgi koʻylak', ru: 'Летнее платье', en: 'Summer Dress' },
    price_uzs: 199000, compare_at_uzs: 249000, stock: 0, status: 'hidden', image_urls: [],
    category: CATEGORY,
  },
]

// Full backend-shaped detail stub (for GET /catalog/:id)
export const BACKEND_PRODUCT_DETAIL = {
  id: 'p2',
  title: { uz: 'Simsiz quloqchin Pro', ru: 'Беспроводные наушники Pro', en: 'Wireless Earbuds Pro' },
  description: {
    uz: 'Yuqori sifatli simsiz quloqchin.',
    ru: 'Высококачественные беспроводные наушники.',
    en: 'High quality wireless earbuds.',
  },
  price_uzs: 299000,
  compare_at_uzs: 349000,
  stock: 124,
  status: 'active',
  image_urls: [] as string[],
  category: CATEGORY,
  brand: 'OZB Basics',
  has_variants: false,
  variants: [] as unknown[],
  video_url: '',
}


export const ISSUES: ListingIssue[] = [
  {
    productId: 'p1', productName: 'Universal Laptop Stand', thumbnails: [],
    wrongValueCount: 1, imageIssueCount: 0, missingInfoCount: 0, otherCount: 0,
  },
]

export const VIOLATIONS: ViolationProduct[] = [
  {
    id: 'p5', productName: 'Counterfeit Brand Bag', updatedAt: '2026-06-08',
    violationType: 'banned',
    violationReason: 'Tovar qalbakilashtirilgan brendni oʻz ichiga oladi',
    deadline: '2026-06-22',
    suggestion: 'Mahsulot nomini va rasmlarini oʻzgartiring, keyin shikoyat qiling',
  },
]

export const REVIEW_PRODUCTS: ReviewProduct[] = [
  { id: 'p6', productName: 'Winter Jacket', thumbnails: [], updatedAt: '2026-06-09', priceUzs: 459000, stock: 60 },
]

export const UNPUBLISHED: UnpublishedProduct[] = [
  { id: 'p7', productName: 'Classic Leather Belt', thumbnails: [], salesCount: 530, priceUzs: 119000, stock: 0, status: 'delisted', updatedAt: '2026-05-30' },
  { id: 'p8', productName: 'Summer Dress', thumbnails: [], salesCount: 0, priceUzs: 199000, stock: 0, status: 'draft', updatedAt: '2026-06-14' },
]

export const BRANDS: Brand[] = [
  { id: 'b1', brandName: 'OZB Basics', category: CATEGORY, registrationDate: '2026-05-21', status: 'approved' },
  { id: 'b2', brandName: 'Nomad Tech', category: CATEGORY, registrationDate: '2026-06-03', status: 'pending' },
]

export const SIZE_CHARTS: SizeChart[] = [
  {
    id: 's1', name: 'Men Tops Standard', templateSlug: 'mens_tops', templateName: { en: 'Men Tops' },
    sizeSystemCode: 'INT', displayUnit: 'cm', registrationDate: '2026-05-18', status: 'active',
    rowCount: 5, linkedProducts: 0,
  },
]

