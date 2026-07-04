// [PENDING BACKEND] — MSW handlers. Consistent derived data; never lies.
import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import type {
  AdCampaign,
  AdsRecommendation,
  AdsResponse,
  Announcement,
  Campaign,
  CampaignDetailResponse,
  CampaignSession,
  CreateVoucherInput,
  Creator,
  CreatorActivateInput,
  FlashDeal,
  FlashDealsResponse,
  MarketingCentreResponse,
  MarketingEvent,
  MarketingShipping,
  ReviewPrize,
  ReviewPrizeListResponse,
  Voucher,
  VoucherListResponse,
} from '../types/marketing.types'

const base = `${env.apiBaseUrl}/seller/marketing`

// ── Seed data ─────────────────────────────────────────────────────────────────
const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: { uz: 'OZB Live uchun 30% cashback vaucherlari!', ru: 'Ваучеры 30% кэшбэка для OZB Live!', en: '30% cashback vouchers for OZB Live!' },
    body: { uz: '11.15 kuni kun boʻyi 30% cashback va 80 000 soʻmlik vaucherlarni oʻtkazib yubormang!', ru: 'Не упустите 30% кэшбэк и ваучеры на 80 000 сум 15.11!', en: "Donʻt miss all-day 30% cashback and 80,000 soʻm vouchers on 11.15!" },
    isNew: true,
    publishedAt: '2026-06-15 21:30',
  },
  {
    id: 'a2',
    title: { uz: 'Yangi reklama formati: Discovery Ads', ru: 'Новый формат: Discovery Ads', en: 'New ad format: Discovery Ads' },
    body: { uz: 'Discovery reklamalari mahsulotlaringizni tavsiya lentasida koʻrsatadi.', ru: 'Discovery-реклама показывает ваши товары в ленте рекомендаций.', en: 'Discovery ads surface your products in the recommendation feed.' },
    isNew: false,
    publishedAt: '2026-06-12 10:00',
  },
]

const EVENTS: MarketingEvent[] = [
  { id: 'e1', kind: 'ads', title: { uz: 'Reklama', ru: 'Реклама', en: 'Ads' }, upliftLabel: { uz: 'Trafik +54%', ru: 'Трафик +54%', en: 'Traffic +54%' }, to: '/marketing/ads' },
  { id: 'e2', kind: 'vouchers', title: { uz: 'Vaucherlar', ru: 'Ваучеры', en: 'Vouchers' }, upliftLabel: { uz: 'Konversiya +21%', ru: 'Конверсия +21%', en: 'Conversion +21%' }, to: '/marketing/vouchers' },
  { id: 'e3', kind: 'shipping', title: { uz: 'Bepul yetkazish', ru: 'Бесплатная доставка', en: 'Free Shipping' }, upliftLabel: { uz: 'Buyurtmalar +18%', ru: 'Заказы +18%', en: 'Orders +18%' }, to: '/marketing/shipping' },
]

const AD_CAMPAIGNS: AdCampaign[] = [
  { id: 'c1', productName: 'Universal Laptop Stand', variation: 'Qora', quantity: 1, matchType: 'search', budgetUzs: null, impressions: 18400, clicks: 642, ctr: 3.49, expenseUzs: 412000, gmvUzs: 2980000 },
  { id: 'c2', productName: 'Wireless Earbuds Pro', variation: 'Oq', quantity: 1, matchType: 'discovery', budgetUzs: 500000, impressions: 32100, clicks: 1180, ctr: 3.68, expenseUzs: 760000, gmvUzs: 6420000 },
]

const ADS_RECOMMENDATIONS: AdsRecommendation[] = [
  { id: 'r1', type: 'low_ctr', title: { uz: 'CTR pastroq', ru: 'CTR ниже среднего', en: 'CTR below average' }, body: { uz: 'Mahsulot suratini yaxshilang', ru: 'Улучшите изображение товара', en: 'Improve product image' }, cta: { uz: 'Koʻproq bilish', ru: 'Узнать больше', en: 'Learn More' } },
  { id: 'r2', type: 'join_campaign', title: { uz: 'Kampaniyaga qoʻshiling', ru: 'Присоединитесь к кампании', en: 'Boost Ads Skill' }, body: { uz: 'OZB Ads imkoniyatlarini oʻrganing', ru: 'Изучите возможности OZB Ads', en: 'Learn about OZB Ads features' }, cta: { uz: 'Oʻrganish', ru: 'Узнать', en: 'Learn Now' } },
]

function series(seed: number, amp: number, baseVal: number): number[] {
  return Array.from({ length: 8 }, (_, i) =>
    Math.round(baseVal + amp * Math.sin((i + seed) / 2) + amp * 0.3 * Math.cos((i + seed) / 5)),
  )
}

function buildAds(): AdsResponse {
  const impressions = AD_CAMPAIGNS.reduce((s, c) => s + c.impressions, 0)
  const clicks = AD_CAMPAIGNS.reduce((s, c) => s + c.clicks, 0)
  const gmvUzs = AD_CAMPAIGNS.reduce((s, c) => s + c.gmvUzs, 0)
  const expenseUzs = AD_CAMPAIGNS.reduce((s, c) => s + c.expenseUzs, 0)
  const ctr = impressions ? Number(((clicks / impressions) * 100).toFixed(2)) : 0
  const roas = expenseUzs ? Number((gmvUzs / expenseUzs).toFixed(2)) : 0
  return {
    metrics: { impressions, clicks, ctr, orders: 41, conversions: 38, itemsSold: 52, gmvUzs, expenseUzs, roas, adsCreditUzs: 0, adsDepositUzs: 150000 },
    series: { labels: ['Jun 9', 'Jun 10', 'Jun 11', 'Jun 12', 'Jun 13', 'Jun 14', 'Jun 15', 'Jun 16'], impressions: series(0, 1500, 6000), roas: series(3, 2, 12) },
    campaigns: AD_CAMPAIGNS,
    recommendations: ADS_RECOMMENDATIONS,
  }
}

let VOUCHERS: Voucher[] = [
  { id: 'v1', name: 'Yangi yil sovgʻa vaucheri', code: 'NEWYEAR26', type: 'shop', discountType: 'fixed', discountValue: 250000, minBasketUzs: 1000000, usageQtyTotal: 100, usagePerBuyer: 1, claimStart: '2026-01-01 00:00', claimEnd: '2026-01-31 23:59', targetBuyer: 'All Buyers', productScope: 'all', status: 'expired' },
  { id: 'v2', name: 'Doimiy xaridorlar bonusi', code: 'LOYAL50', type: 'repeat_buyer', discountType: 'percent', discountValue: 10, minBasketUzs: 2500000, usageQtyTotal: 50, usagePerBuyer: 1, claimStart: '2026-06-01 00:00', claimEnd: '2026-07-31 23:59', targetBuyer: 'Repeat Buyers', productScope: 'all', status: 'ongoing' },
  { id: 'v3', name: 'Maxsus chegirma', code: 'PRIV20', type: 'private', discountType: 'fixed', discountValue: 100000, minBasketUzs: 500000, usageQtyTotal: 24, usagePerBuyer: 1, claimStart: '2026-06-15 00:00', claimEnd: '2026-09-30 23:59', targetBuyer: 'All Buyers', productScope: 'all', status: 'ongoing' },
]

const FLASH_DEALS: FlashDeal[] = [
  { id: 'fd1', timeSlot: '2026-07-01 10:00', flashPriceUzs: 89000, promoStock: 50, status: 'upcoming', productName: 'Smart LED lenta 5m' },
]

const CAMPAIGNS: Campaign[] = [
  { id: 'cp1', bannerUrl: '', name: { uz: '[2026] Iyun Kampaniyasi', ru: '[2026] Июнь Кампания', en: '[2026] June Campaign Pacing' }, type: 'product', startAt: '2026-06-21 21:00', endAt: '2026-06-21 20:58', nominationDeadline: '2026-06-18 20:58', sessionCount: 1, pendingCount: 2, nominatedCount: 0, sellerStatus: 'available' },
  { id: 'cp2', bannerUrl: '', name: { uz: '20-21 Iyun BTO Uyni Sotiш', ru: '20-21 июн Продажа дома BTO', en: '20-21 Jun BTO Home Sale' }, type: 'product', startAt: '2026-06-20 21:00', endAt: '2026-06-21 20:58', nominationDeadline: '2026-06-18 20:58', sessionCount: 2, pendingCount: 3, nominatedCount: 0, sellerStatus: 'available' },
  { id: 'cp3', bannerUrl: '', name: { uz: 'Promo Xtra Dasturi', ru: 'Программа Promo Xtra', en: 'PromoXtra Program' }, type: 'voucher', startAt: '2026-09-13 12:46', endAt: '2026-09-13 12:46', nominationDeadline: '2026-09-13 12:46', sessionCount: 0, pendingCount: 0, nominatedCount: 0, sellerStatus: 'available' },
  { id: 'cp4', bannerUrl: '', name: { uz: '[2026] Iyul Kampaniyasi', ru: '[2026] Июль Кампания', en: '[2026] July Campaign Pacing' }, type: 'product', startAt: '2026-07-25 21:00', endAt: '2026-07-28 20:58', nominationDeadline: '2026-07-23 20:58', sessionCount: 4, pendingCount: 0, nominatedCount: 0, sellerStatus: 'available' },
]

const CAMPAIGN_SESSIONS: CampaignSession[] = [
  { id: 's1', date: '25 May 2026 09:00', subEventName: { uz: 'Super Goʻzal Sotiш 24-26 May', ru: 'Супер Красота 24-26 Мая', en: 'Super Sale 24-26 May' }, isLocal: true, nominatedCount: 2, nominationStart: '2026-05-20', nominationEnd: '2026-05-23', mechanic: 'Product Nomination', sellerStatus: 'closed' },
  { id: 's2', date: '28 May 2026 09:00', subEventName: { uz: 'Goʻzal va Sogʻliq Sotiши', ru: 'Красота и Здоровье', en: 'Beauty and Health Sale' }, isLocal: true, nominatedCount: 1, nominationStart: '2026-05-23', nominationEnd: '2026-05-26', mechanic: 'Product Nomination', sellerStatus: 'nominated' },
  { id: 's3', date: '01 Jun 2026 09:00', subEventName: { uz: 'Iyun Bosh Sotishi', ru: 'Главная Распродажа Июня', en: 'June Main Sale' }, isLocal: false, nominatedCount: 0, nominationStart: '2026-05-27', nominationEnd: '2026-05-30', mechanic: 'Product Nomination', sellerStatus: 'available' },
]

const CREATORS: Creator[] = [
  { id: 'cr1', handle: 'digi.gadgets', categories: ['Computers & Accessories'], followers: 32300, totalOrders: '10-50', totalClicks: '<1k' },
  { id: 'cr2', handle: 'shrug_home', categories: ['Computers & Accessories'], followers: 15, totalOrders: '100-200', totalClicks: '3k' },
  { id: 'cr3', handle: 'je9', categories: ['Computers & Accessories'], followers: 6200, totalOrders: '<10', totalClicks: '<1k' },
  { id: 'cr4', handle: 'Marsiat Jahan', categories: ['Computers & Accessories'], followers: 548, totalOrders: '<10', totalClicks: '<1k' },
  { id: 'cr5', handle: 'Philip', categories: ['Computers & Accessories'], followers: 4000, totalOrders: '<10', totalClicks: '<1k' },
  { id: 'cr6', handle: 'Muhammad Amir Mansor', categories: ['Computers & Accessories'], followers: 3200, totalOrders: '<10', totalClicks: '<1k' },
]

let creatorsActivated = false

const REVIEW_PRIZES: ReviewPrize[] = [
  { id: 'rp1', name: '15 Points Reward', productThumbs: [], unusedBudget: 1395, reviewsGained: 67, orders: 0, status: 'active' },
  { id: 'rp2', name: '5 Points Reward', productThumbs: [], unusedBudget: 900, reviewsGained: 0, orders: 0, status: 'inactive' },
]

let shipping: MarketingShipping = { freeShippingActive: true, minOrderUzs: 1500000, region: 'nationwide' }

// ── Handlers ──────────────────────────────────────────────────────────────────
export const marketingHandlers = [
  http.get(`${base}/centre`, () => {
    const body: MarketingCentreResponse = { announcements: ANNOUNCEMENTS, events: EVENTS }
    return HttpResponse.json(body)
  }),

  http.get(`${base}/ads`, () => HttpResponse.json(buildAds())),

  http.get(`${base}/vouchers`, () => {
    const body: VoucherListResponse = {
      vouchers: VOUCHERS,
      total: VOUCHERS.length,
      performance: { salesUzs: 1000000, orders: 12, usageRate: 0.0, buyers: 8 },
    }
    return HttpResponse.json(body)
  }),

  http.post(`${base}/vouchers`, async ({ request }) => {
    const input = (await request.json()) as CreateVoucherInput
    const created: Voucher = {
      id: Date.now().toString(),
      name: input.name,
      code: input.code.toUpperCase().trim(),
      type: input.type,
      discountType: input.discountType,
      discountValue: input.discountValue,
      minBasketUzs: input.minBasketUzs,
      usageQtyTotal: input.usageQtyTotal,
      usagePerBuyer: input.usagePerBuyer,
      claimStart: input.claimStart,
      claimEnd: input.claimEnd,
      targetBuyer: 'All Buyers',
      productScope: input.applicableProducts,
      status: 'upcoming',
    }
    VOUCHERS = [created, ...VOUCHERS]
    return HttpResponse.json(created, { status: 201 })
  }),

  http.delete(`${base}/vouchers/:id`, ({ params }) => {
    VOUCHERS = VOUCHERS.filter((v) => v.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get(`${base}/shipping`, () => HttpResponse.json(shipping)),

  http.put(`${base}/shipping`, async ({ request }) => {
    shipping = (await request.json()) as MarketingShipping
    return HttpResponse.json(shipping)
  }),

  http.get(`${base}/flash-deals`, () => {
    const body: FlashDealsResponse = {
      deals: FLASH_DEALS,
      total: FLASH_DEALS.length,
      performance: { salesUzs: 0, orders: 0, buyers: 0, ctr: 0 },
    }
    return HttpResponse.json(body)
  }),

  http.post(`${base}/flash-deals`, () => new HttpResponse(null, { status: 201 })),

  http.get(`${base}/campaigns`, () => {
    return HttpResponse.json({
      campaigns: CAMPAIGNS,
      total: CAMPAIGNS.length,
      available: CAMPAIGNS.filter((c) => c.sellerStatus === 'available').length,
      invited: 0,
      pending: 0,
      nominated: 0,
    })
  }),

  http.get(`${base}/campaigns/:id`, ({ params }) => {
    const campaign = CAMPAIGNS.find((c) => c.id === params.id) ?? CAMPAIGNS[0]
    const body: CampaignDetailResponse = {
      id: campaign.id,
      bannerUrl: campaign.bannerUrl,
      name: campaign.name,
      startAt: campaign.startAt,
      endAt: campaign.endAt,
      description: { uz: 'Kampaniya tafsilotlari', ru: 'Детали кампании', en: 'Campaign details' },
      sessions: CAMPAIGN_SESSIONS,
    }
    return HttpResponse.json(body)
  }),

  http.get(`${base}/creators`, () => {
    return HttpResponse.json({ creators: CREATORS, activated: creatorsActivated })
  }),

  http.post(`${base}/creators/activate`, async ({ request }) => {
    const input = (await request.json()) as CreatorActivateInput
    if (input.tosAccepted) creatorsActivated = true
    return HttpResponse.json({ activated: creatorsActivated })
  }),

  http.get(`${base}/review-prizes`, () => {
    const body: ReviewPrizeListResponse = {
      prizes: REVIEW_PRIZES,
      total: REVIEW_PRIZES.length,
      active: REVIEW_PRIZES.filter((p) => p.status === 'active').length,
      inactive: REVIEW_PRIZES.filter((p) => p.status !== 'active').length,
      metrics: { reviewsGained: 0, views: 0, orders: 0 },
    }
    return HttpResponse.json(body)
  }),

  http.post(`${base}/review-prizes/:id/end`, ({ params }) => {
    const prize = REVIEW_PRIZES.find((p) => p.id === params.id)
    if (prize) prize.status = 'ended'
    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${base}/review-prizes/:id/duplicate`, () => new HttpResponse(null, { status: 201 })),
]
