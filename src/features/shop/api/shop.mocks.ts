import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import type {
  DecorationBlock,
  MediaFile,
  ShopCategory,
  ShopProfile,
  ShopReport,
  ShopReview,
} from '../types/shop.types'
import { shopExtraHandlers } from './shop.mocks.extra'

// In-memory state (summaries derived, never hardcoded).
let profile: ShopProfile = {
  id: '8749201',
  name: 'OZB Official Store',
  bio: 'Sifatli, zamonaviy va hamyonbop mahsulotlar faqat bizning doʻkonda. 24/7 xizmat koʻrsatishdan mamnunmiz!',
  phone: '+998 90 123 45 67',
  email: 'support@ozb-store.uz',
  address: 'Toshkent shahri, Chilonzor tumani, 9-kvartal',
  telegram: '@ozb_store',
  status: 'active',
  registeredAt: '2026-05-12',
  logoUrl: null,
  bannerUrl: null,
}

let reviews: ShopReview[] = [
  { id: '1', userName: 'Anvar Toshpulatov', rating: 5, date: '2026-06-10',
    comment: 'Mahsulot juda sifatli ekan, yetkazib berish ham tezroq keldi.',
    productName: 'Nike Air Max', reply: 'Rahmat! Har doim xizmatingizdamiz.' },
  { id: '2', userName: 'Malika Axmedova', rating: 4, date: '2026-06-08',
    comment: "Kiyim sifati yaxshi, oʻlchami biroz kichikroq keldi.",
    productName: 'Ayollar yozgi koʻylagi', reply: '' },
  { id: '3', userName: 'Jasurbek Olimov', rating: 2, date: '2026-06-05',
    comment: 'Quti biroz ezilgan holatda keldi.',
    productName: 'Smart Soat Series 9', reply: '' },
]

let decoration: DecorationBlock[] = [
  {
    id: '1',
    type: 'carousel',
    title: 'Asosiy Slayder (Karusel)',
    description: '3 ta katta aksiya bannerlari rotatsiyasi',
  },
  {
    id: '2',
    type: 'products_grid',
    title: 'Hafta Trendlari',
    description: "4 ta eng koʻp sotilayotgan mahsulotlar galereyasi",
  },
  {
    id: '3',
    type: 'banner',
    title: 'Mavsumiy Chegirma Banneri',
    description: 'Yozgi kiyimlarga -50% ensiz banner',
  },
]

let categories: ShopCategory[] = [
  { id: '1', name: 'Yozgi kiyimlar', productCount: 45, isActive: true, createdAt: '2026-05-10' },
  { id: '2', name: 'Sport poyabzallari', productCount: 28, isActive: true, createdAt: '2026-05-14' },
  { id: '3', name: 'Aksessuarlar & Gadjetlar', productCount: 12, isActive: false, createdAt: '2026-05-20' },
  { id: '4', name: 'Chegirmadagi mahsulotlar', productCount: 60, isActive: true, createdAt: '2026-06-01' },
]

let media: MediaFile[] = [
  { id: '1', name: 'nike_air_max_front.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=60', sizeBytes: 250880, dimension: '1080x1080', duration: null, createdAt: '2026-06-01' },
  { id: '2', name: 'summer_collection_banner.png', type: 'image', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop&q=60', sizeBytes: 1258291, dimension: '1920x450', duration: null, createdAt: '2026-06-03' },
  { id: '3', name: 'smartwatch_unboxing_review.mp4', type: 'video', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=60', sizeBytes: 15518924, dimension: null, duration: '0:45', createdAt: '2026-06-05' },
  { id: '4', name: 'womens_dress_red.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=60', sizeBytes: 327680, dimension: '1000x1500', duration: null, createdAt: '2026-06-10' },
]
const STORAGE_TOTAL_BYTES = 1024 * 1024 * 1024 // 1 GB

let reports: ShopReport[] = [
  { id: '1', title: '2026-Yil May oyi yakuniy Savdo Hisoboti', type: 'sales', dateRange: '01.05.2026 - 31.05.2026', fileSizeBytes: 2516582, format: 'excel', status: 'ready' },
  { id: '2', title: 'Moliya va Sof Foyda Tahlili (Choraklik)', type: 'finance', dateRange: '01.01.2026 - 31.03.2026', fileSizeBytes: 4299161, format: 'pdf', status: 'ready' },
  { id: '3', title: "Omborda qolgan tovarlar qoldigʻi auditi", type: 'inventory', dateRange: 'Bugungi holatga koʻra', fileSizeBytes: 870400, format: 'excel', status: 'ready' },
  { id: '4', title: 'Iyun oyi haftalik marketing va reklama tahlili', type: 'sales', dateRange: '01.06.2026 - 07.06.2026', fileSizeBytes: null, format: 'excel', status: 'generating' },
]

function ratingSummary() {
  const total = reviews.length
  const average = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0
  const positive = reviews.filter((r) => r.rating >= 4).length
  return {
    average: Math.round(average * 10) / 10,
    positiveRate: total ? Math.round((positive / total) * 100) : 0,
    total,
    unanswered: reviews.filter((r) => !r.reply).length,
  }
}

const base = env.apiBaseUrl

export const shopHandlers = [
  // --- Profile ---
  http.get(`${base}/seller/shop/profile`, () => HttpResponse.json(profile)),
  http.put(`${base}/seller/shop/profile`, async ({ request }) => {
    const patch = (await request.json()) as Partial<ShopProfile>
    profile = { ...profile, ...patch }
    return HttpResponse.json(profile)
  }),

  // --- Reviews ---
  http.get(`${base}/seller/shop/reviews`, () =>
    HttpResponse.json({ reviews, summary: ratingSummary() }),
  ),
  http.post(`${base}/seller/shop/reviews/:id/reply`, async ({ params, request }) => {
    const { reply } = (await request.json()) as { reply: string }
    const found = reviews.find((r) => r.id === params.id)
    if (!found) return new HttpResponse(null, { status: 404 })
    found.reply = reply
    reviews = [...reviews]
    return HttpResponse.json(found)
  }),

  // --- Decoration ---
  http.get(`${base}/seller/shop/decoration`, () => HttpResponse.json(decoration)),
  http.put(`${base}/seller/shop/decoration`, async ({ request }) => {
    const { blocks } = (await request.json()) as { blocks: DecorationBlock[] }
    decoration = blocks
    return HttpResponse.json(decoration)
  }),

  // --- Categories ---
  http.get(`${base}/seller/shop/categories`, () => HttpResponse.json(categories)),
  http.post(`${base}/seller/shop/categories`, async ({ request }) => {
    const { name } = (await request.json()) as { name: string }
    const created: ShopCategory = {
      id: crypto.randomUUID(),
      name,
      productCount: 0,
      isActive: true,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    categories = [created, ...categories]
    return HttpResponse.json(created, { status: 201 })
  }),
  http.patch(`${base}/seller/shop/categories/:id`, ({ params }) => {
    const found = categories.find((c) => c.id === params.id)
    if (!found) return new HttpResponse(null, { status: 404 })
    found.isActive = !found.isActive
    categories = [...categories]
    return HttpResponse.json(found)
  }),
  http.delete(`${base}/seller/shop/categories/:id`, ({ params }) => {
    categories = categories.filter((c) => c.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),

  // --- Media ---
  http.get(`${base}/seller/shop/media`, () =>
    HttpResponse.json({
      files: media,
      storage: {
        usedBytes: media.reduce((s, m) => s + m.sizeBytes, 0),
        totalBytes: STORAGE_TOTAL_BYTES,
      },
    }),
  ),
  http.delete(`${base}/seller/shop/media/:id`, ({ params }) => {
    media = media.filter((m) => m.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),

  // --- Reports ---
  http.get(`${base}/seller/shop/reports`, () =>
    HttpResponse.json({
      reports,
      summary: { monthSalesUzs: 45_200_000, monthSalesChange: 12.4, itemsSold: 1240 },
    }),
  ),
  http.post(`${base}/seller/shop/reports`, async ({ request }) => {
    const { type } = (await request.json()) as { type: ShopReport['type'] }
    const created: ShopReport = {
      id: crypto.randomUUID(),
      title: `Yangi soʻralgan tizim hisoboti (${new Date().toISOString().slice(0, 10)})`,
      type,
      dateRange: "Soʻnggi 30 kun",
      fileSizeBytes: 1258291,
      format: 'excel',
      status: 'ready',
    }
    reports = [created, ...reports]
    return HttpResponse.json(created, { status: 201 })
  }),

  // New shop info/KYC/decoration/top-picks/appeals/missions handlers
  ...shopExtraHandlers,
]
