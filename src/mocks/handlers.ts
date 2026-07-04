// Import handlers from each featureʻs mock module directly (NOT the barrel) so feature
// components donʻt get pulled into this (MSW) chunk. Each feature owns consistent,
// derived mock data — no hardcoded counts.
import { productsHandlers } from '@/features/products/api/products.mocks'
import { ordersHandlers } from '@/features/orders/api/orders.mocks'
import { financeHandlers } from '@/features/finance/api/finance.mocks'
import { shopHandlers } from '@/features/shop/api/shop.mocks'
import { discountsHandlers } from '@/features/discounts/api/discounts.mocks'
import { marketingHandlers } from '@/features/marketing/api/marketing.mocks'
import { shipmentHandlers } from '@/features/shipment/api/shipment.mocks'
import { notificationsHandlers } from '@/features/notifications/api/notifications.mocks'
import { customerServiceHandlers } from '@/features/customer-service/api/customer-service.mocks'
import { settingHandlers } from '@/features/setting/api/setting.mocks'
import { insightsHandlers } from '@/features/insights/api/insights.mocks'
import { accountHealthHandlers } from '@/features/account-health/api/account-health.mocks'
import { homeHandlers } from '@/features/home/api/home.mocks'
import { liveHandlers } from '@/features/live/api/live.mocks'
import { authHandlers } from '@/features/auth/api/auth.mocks'
import { sellerVerificationHandlers } from '@/features/seller-verification/api/seller-verification.mocks'
export const handlers = [
  ...authHandlers,
  ...productsHandlers,
  ...ordersHandlers,
  ...financeHandlers,
  ...shopHandlers,
  ...discountsHandlers,
  ...marketingHandlers,
  ...shipmentHandlers,
  ...notificationsHandlers,
  ...customerServiceHandlers,
  ...settingHandlers,
  ...insightsHandlers,
  ...accountHealthHandlers,
  ...homeHandlers,
  ...liveHandlers,
  ...sellerVerificationHandlers,
]
