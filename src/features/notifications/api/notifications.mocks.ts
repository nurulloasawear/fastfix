import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import type {
  NotificationItem,
  NotificationListResponse,
  NotificationTab,
  NotificationUnread,
} from '../types/notifications.types'
import { NOTIFICATION_TABS } from '../types/notifications.types'

// One consistent dataset. Unread counts + total are DERIVED from it — never hardcoded.
// Mutating reads flips `read` in-place so the UI reflects mark-read in dev.
const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'ntf-1',
    category: 'order_updates',
    title: {
      uz: 'Yangi buyurtma #BTS22223333',
      ru: 'Новый заказ #BTS22223333',
      en: 'New order #BTS22223333',
    },
    body: {
      uz: '«Simsiz quloqchin Pro» uchun yangi buyurtma keldi. Iltimos, joʻnatishga tayyorlang.',
      ru: 'Поступил новый заказ на «Simsiz quloqchin Pro». Подготовьте к отправке.',
      en: 'A new order for "Simsiz quloqchin Pro" arrived. Please prepare it for shipment.',
    },
    read: false,
    createdAt: '2026-06-15T13:40:00Z',
  },
  {
    id: 'ntf-2',
    category: 'rating',
    title: {
      uz: 'Yangi 5 yulduzli sharh',
      ru: 'Новый отзыв на 5 звёзд',
      en: 'New 5-star review',
    },
    body: {
      uz: 'Xaridor «Noutbuk taglik» mahsulotiga 5 yulduzli baho qoldirdi.',
      ru: 'Покупатель оставил 5 звёзд товару «Noutbuk taglik».',
      en: 'A buyer left a 5-star rating on "Noutbuk taglik".',
    },
    read: false,
    createdAt: '2026-06-15T09:12:00Z',
  },
  {
    id: 'ntf-3',
    category: 'return_refund',
    title: {
      uz: 'Qaytarish soʻrovi',
      ru: 'Запрос на возврат',
      en: 'Return request',
    },
    body: {
      uz: 'Buyurtma #BTS88889999 boʻyicha qaytarish soʻrovi yuborildi. 48 soat ichida javob bering.',
      ru: 'По заказу #BTS88889999 отправлен запрос на возврат. Ответьте в течение 48 часов.',
      en: 'A return was requested for order #BTS88889999. Respond within 48 hours.',
    },
    read: false,
    createdAt: '2026-06-14T17:05:00Z',
  },
  {
    id: 'ntf-4',
    category: 'listing',
    title: {
      uz: 'Mahsulot tekshiruvdan oʻtdi',
      ru: 'Товар прошёл проверку',
      en: 'Product passed review',
    },
    body: {
      uz: '«Smart LED lenta 5m» tekshiruvdan oʻtdi va endi sotuvda faol.',
      ru: '«Smart LED lenta 5m» прошёл проверку и теперь активен в продаже.',
      en: '"Smart LED lenta 5m" passed review and is now live for sale.',
    },
    read: true,
    createdAt: '2026-06-13T11:30:00Z',
  },
  {
    id: 'ntf-5',
    category: 'marketing_centre',
    title: {
      uz: '50% Cashback vaucher!',
      ru: 'Ваучер кешбэк 50%!',
      en: '50% Cashback voucher!',
    },
    body: {
      uz: 'Yangi reklama kampaniyasi ishga tushdi. Mahsulotlaringizni targʻib qiling va koʻproq sotuvga erishing.',
      ru: 'Запущена новая рекламная кампания. Продвигайте товары и увеличивайте продажи.',
      en: 'A new promo campaign is live. Promote your products and drive more sales.',
    },
    read: false,
    createdAt: '2026-06-12T10:00:00Z',
  },
  {
    id: 'ntf-6',
    category: 'seller_balance',
    title: {
      uz: 'Toʻlov hisobingizga oʻtkazildi',
      ru: 'Выплата зачислена на счёт',
      en: 'Payout credited to your account',
    },
    body: {
      uz: '1 250 000 soʻm bank hisobingizga muvaffaqiyatli oʻtkazildi.',
      ru: '1 250 000 сум успешно зачислены на ваш банковский счёт.',
      en: '1,250,000 soʻm was successfully transferred to your bank account.',
    },
    read: true,
    createdAt: '2026-06-11T08:20:00Z',
  },
]

function unreadCounts(items: NotificationItem[]): NotificationUnread {
  const counts = Object.fromEntries(NOTIFICATION_TABS.map((tab) => [tab, 0])) as NotificationUnread
  for (const n of items) {
    if (n.read) continue
    counts.all += 1
    counts[n.category] += 1
  }
  return counts
}

export const notificationsHandlers = [
  http.get(`${env.apiBaseUrl}/seller/notifications`, ({ request }) => {
    const tab = (new URL(request.url).searchParams.get('tab') ?? 'all') as NotificationTab
    const items = tab === 'all' ? NOTIFICATIONS : NOTIFICATIONS.filter((n) => n.category === tab)
    const body: NotificationListResponse = {
      notifications: items,
      total: items.length,
      unread: unreadCounts(NOTIFICATIONS),
    }
    return HttpResponse.json(body)
  }),

  http.post(`${env.apiBaseUrl}/seller/notifications/:id/read`, ({ params }) => {
    const found = NOTIFICATIONS.find((n) => n.id === params.id)
    if (found) found.read = true
    return HttpResponse.json({ id: String(params.id) })
  }),

  http.post(`${env.apiBaseUrl}/seller/notifications/read-all`, () => {
    let read = 0
    for (const n of NOTIFICATIONS) {
      if (!n.read) read += 1
      n.read = true
    }
    return HttpResponse.json({ read })
  }),
]
