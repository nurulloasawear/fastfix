import type { ComponentType } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { RequireAuth } from '@/features/auth'

// Information architecture = Shopee Seller Centre (10 sections + Home landing).
// See OZB/architecture/FE/seller-portal/index.md. Pages are lazy-loaded (one chunk each);
// gaps in the new IA render <ComingSoon/> until rebuilt per the per-section specs.
type Mod = Record<string, ComponentType>

// After a new deploy the hashed page-chunk filenames change; a browser still holding
// the old index.html 404s on a lazy chunk ("Failed to fetch dynamically imported
// module"). Reload ONCE to pull the fresh index + chunks (time-guard avoids a loop).
function reloadOnceForStaleChunk() {
  const last = Number(sessionStorage.getItem('chunkReloadAt') ?? '0')
  if (Date.now() - last < 10_000) return false
  sessionStorage.setItem('chunkReloadAt', String(Date.now()))
  window.location.reload()
  return true
}

const r = (path: string, load: () => Promise<Mod>, name: string) => ({
  path,
  lazy: async () => {
    try {
      return { Component: (await load())[name] }
    } catch (err) {
      // Recover from a stale-deploy chunk 404 by reloading; rethrow so React Router
      // doesn't render a broken route in the brief moment before the reload.
      reloadOnceForStaleChunk()
      throw err
    }
  },
})

export const router = createBrowserRouter([
  // Public auth routes (full-screen, outside the app shell)
  r('login', () => import('@/pages/auth/LoginPage'), 'LoginPage'),
  r('onboarding', () => import('@/pages/auth/OnboardingPage'), 'OnboardingPage'),
  r('seller/verification',() =>import('@/pages/auth/SellerVerificationPage'),'SellerVerificationPage',
),
  // Live-stream WATCH (viewer) — PUBLIC, full-screen, OUTSIDE both the app shell AND
  // any auth/seller guard. A shared /live/watch/{id} link must open for an anonymous,
  // logged-out, non-seller buyer (no login, no password gate, no seller onboarding).
  // The viewer token comes from the public POST /streams/{id}/watch endpoint.
  r('live/watch/:id', () => import('@/pages/live/WatchPage'), 'WatchPage'),

  {
    path: '/',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/home" replace /> },

      // Home (dashboard landing)
      r('home', () => import('@/pages/home/HomeTodoListPage'), 'HomeTodoListPage'),

      // 01 Order Management
      r('orders', () => import('@/pages/orders/MyOrdersPage'), 'MyOrdersPage'),
      r('orders/mass-ship', () => import('@/pages/orders/MassShipPage'), 'MassShipPage'),
      r('orders/returns', () => import('@/pages/orders/ReturnsPage'), 'ReturnsPage'),
      r('orders/returns/:id', () => import('@/pages/orders/ReturnDetailPage'), 'ReturnDetailPage'),
      r('orders/:id', () => import('@/pages/orders/OrderDetailsPage'), 'OrderDetailsPage'),

      // 02 Products
      r('products', () => import('@/pages/products/MyProductsPage'), 'MyProductsPage'),
      r('products/new', () => import('@/pages/products/AddNewProductPage'), 'AddNewProductPage'),
      r('products/ai-optimiser', () => import('@/pages/products/AiOptimiserPage'), 'AiOptimiserPage'),
      r('products/:id/edit', () => import('@/pages/products/EditProductPage'), 'EditProductPage'),
      r('products/mass-upload', () => import('@/pages/products/MassUploadPage'), 'MassUploadPage'),
      r('products/ai-import/:jobId/review', () => import('@/pages/products/AIImportReviewPage'), 'AIImportReviewPage'),
      // Product Settings hub + sub-pages (Brand Management, Size Chart Management)
      r('products/product-setting', () => import('@/pages/products/ProductSettingPage'), 'ProductSettingPage'),
      r('products/product-setting/brand-management', () => import('@/pages/products/BrandManagementPage'), 'BrandManagementPage'),
      r('products/product-setting/brand-registration', () => import('@/pages/products/BrandRegistrationFormPage'), 'BrandRegistrationFormPage'),
      r('products/product-setting/size-chart-management', () => import('@/pages/products/SizeChartManagementPage'), 'SizeChartManagementPage'),
      r('products/product-setting/size-chart-management/add-new-size-chart', () => import('@/pages/products/AddNewSizeChartPage'), 'AddNewSizeChartPage'),

      // 03 Marketing Centre
      r('marketing', () => import('@/pages/marketing/MarketingCentrePage'), 'MarketingCentrePage'),
      r('marketing/ads', () => import('@/pages/marketing/AdsPage'), 'AdsPage'),
      r('marketing/creators', () => import('@/pages/marketing/CreatorsPage'), 'CreatorsPage'),
      r('marketing/discount', () => import('@/pages/discounts/DiscountListPage'), 'DiscountListPage'),
      r('marketing/discount/new', () => import('@/pages/discounts/CreateDiscountPage'), 'CreateDiscountPage'),
      // Product price promotions (discount / bundle / add-on) — Shopee-parity
      r('marketing/promotions', () => import('@/pages/marketing/PromotionsListPage'), 'PromotionsListPage'),
      r('marketing/promotions/discount/new', () => import('@/pages/marketing/CreateDiscountPromotionPage'), 'CreateDiscountPromotionPage'),
      r('marketing/promotions/:id/edit', () => import('@/pages/marketing/CreateDiscountPromotionPage'), 'CreateDiscountPromotionPage'),
      r('marketing/flash-deals', () => import('@/pages/marketing/FlashDealsPage'), 'FlashDealsPage'),
      r('marketing/flash-deals/new', () => import('@/pages/marketing/CreateFlashDealPage'), 'CreateFlashDealPage'),
      r('marketing/vouchers', () => import('@/pages/marketing/VouchersPage'), 'VouchersPage'),
      r('marketing/vouchers/new', () => import('@/pages/marketing/CreateVoucherPage'), 'CreateVoucherPage'),
      r('marketing/campaigns', () => import('@/pages/marketing/CampaignsPage'), 'CampaignsPage'),
      r('marketing/campaigns/:id', () => import('@/pages/marketing/CampaignDetailPage'), 'CampaignDetailPage'),
      r('marketing/review-prize', () => import('@/pages/marketing/ReviewPrizePage'), 'ReviewPrizePage'),

      // 04 Customer Service
      r('customer-service', () => import('@/pages/customer-service/ChatPage'), 'ChatPage'),
      r('customer-service/chat', () => import('@/pages/customer-service/ChatPage'), 'ChatPage'),
      r('customer-service/chat/auto-reply', () => import('@/pages/customer-service/AutoReplyPage'), 'AutoReplyPage'),
      r('customer-service/chat/shortcuts', () => import('@/pages/customer-service/ShortcutsPage'), 'ShortcutsPage'),
      r('customer-service/faq', () => import('@/pages/customer-service/FaqAssistantPage'), 'FaqAssistantPage'),
      r('customer-service/faq/dashboard', () => import('@/pages/customer-service/FaqDashboardPage'), 'FaqDashboardPage'),
      r('customer-service/reviews', () => import('@/pages/customer-service/ReviewsPage'), 'ReviewsPage'),

      // 05 Finance
      { path: 'finance', element: <Navigate to="/finance/income" replace /> },
      r('finance/income', () => import('@/pages/finance/MyIncomePage'), 'MyIncomePage'),
      r('finance/income/statements', () => import('@/pages/finance/IncomeStatementsPage'), 'IncomeStatementsPage'),
      r('finance/balance', () => import('@/pages/finance/MyBalancePage'), 'MyBalancePage'),
      r('finance/balance/transaction/:id', () => import('@/pages/finance/TransactionDetailPage'), 'TransactionDetailPage'),
      r('finance/bank-accounts', () => import('@/pages/finance/BankAccountsPage'), 'BankAccountsPage'),

      // 06 Business Insights
      { path: 'insights', element: <Navigate to="/insights/overview" replace /> },
      r('insights/overview', () => import('@/pages/insights/InsightsOverviewPage'), 'InsightsOverviewPage'),
      r('insights/product', () => import('@/pages/insights/ProductInsightsPage'), 'ProductInsightsPage'),
      r('insights/sales', () => import('@/pages/insights/SalesInsightsPage'), 'SalesInsightsPage'),
      r('insights/traffic', () => import('@/pages/insights/TrafficInsightsPage'), 'TrafficInsightsPage'),
      r('insights/services', () => import('@/pages/insights/ServicesInsightsPage'), 'ServicesInsightsPage'),
      r('insights/marketing', () => import('@/pages/insights/MarketingInsightsPage'), 'MarketingInsightsPage'),

      // 07 Shop
      { path: 'shop', element: <Navigate to="/shop/info" replace /> },
      r('shop/info', () => import('@/pages/shop/ShopInformationPage'), 'ShopInformationPage'),
      r('shop/decoration', () => import('@/pages/shop/ShopDecorationPage'), 'ShopDecorationPage'),
      r('shop/appeals', () => import('@/pages/shop/AppealsPage'), 'AppealsPage'),
      r('shop/missions', () => import('@/pages/shop/MissionsPage'), 'MissionsPage'),

      // 08 Live & Video
      { path: 'live', element: <Navigate to="/live/analytics" replace /> },
      r('live/analytics', () => import('@/pages/live/LiveAnalyticsPage'), 'LiveAnalyticsPage'),
      r('live/streaming-price', () => import('@/pages/live/StreamingPricePage'), 'StreamingPricePage'),
      r('live/streaming-price/create', () => import('@/pages/live/CreateStreamingPricePage'), 'CreateStreamingPricePage'),
      r('live/create', () => import('@/pages/live/CreateStreamPage'), 'CreateStreamPage'),
      r('live/preview/:id', () => import('@/pages/live/GoLivePreviewPage'), 'GoLivePreviewPage'),
      r('live/go-live', () => import('@/pages/live/GoLivePage'), 'GoLivePage'),

      // 09 Account Health
      r('account-health', () => import('@/pages/account-health/AccountHealthPage'), 'AccountHealthPage'),
      r('account-health/metric/nfr', () => import('@/pages/account-health/NfrDetailPage'), 'NfrDetailPage'),
      r('account-health/metric/chat-response', () => import('@/pages/account-health/ChatResponseDetailPage'), 'ChatResponseDetailPage'),

      // 10 Shop Settings
      { path: 'settings', element: <Navigate to="/settings/account" replace /> },
      r('settings/account', () => import('@/pages/setting/AccountSettingPage'), 'AccountSettingPage'),
      r('settings/chat', () => import('@/pages/setting/ChatSettingsPage'), 'ChatSettingsPage'),
      r('settings/notifications', () => import('@/pages/setting/NotificationSettingsPage'), 'NotificationSettingsPage'),
      r('settings/payment', () => import('@/pages/setting/PaymentSettingPage'), 'PaymentSettingPage'),
      r('settings/product', () => import('@/pages/setting/ProductSettingPage'), 'ProductSettingPage'),
      r('settings/vacation', () => import('@/pages/setting/VacationModePage'), 'VacationModePage'),
      r('settings/partners', () => import('@/pages/setting/PartnerManagementPage'), 'PartnerManagementPage'),
      r('settings/addresses', () => import('@/pages/setting/MyAddressesPage'), 'MyAddressesPage'),
      { path: 'settings/shipping', element: <Navigate to="/settings/shipping/channels" replace /> },
      r('settings/shipping/channels', () => import('@/pages/shipment/ShippingSettingPage'), 'ShippingSettingPage'),

      { path: '*', element: <Navigate to="/home" replace /> },
    ],
  },
])
