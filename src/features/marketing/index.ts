// PUBLIC API of the marketing feature. Pages import ONLY from here
// (`@/features/marketing`) — never a deep path. ESLint enforces this.

// ── Queries + mutations ───────────────────────────────────────────────────────
export {
  marketingKeys,
  useMarketingCentre,
  useAds,
  useVouchers,
  useCreateVoucher,
  useDeleteVoucher,
  useMarketingShipping,
  useSaveMarketingShipping,
  useFlashDeals,
  useCreateFlashDeal,
  useCampaigns,
  useCampaignDetail,
  useCreators,
  useActivateCreators,
  useReviewPrizes,
  useEndReviewPrize,
  useDuplicateReviewPrize,
} from './api/marketing.queries'

// ── Stores ────────────────────────────────────────────────────────────────────
export { useMarketingUi } from './stores/marketing.store'

// ── MSW handlers + i18n (must always be exported) ────────────────────────────
export { marketingMessages } from './i18n'
export { marketingHandlers } from './api/marketing.mocks'

// ── Components ────────────────────────────────────────────────────────────────
export { MarketingNav } from './components/MarketingNav'
export { AnnouncementCard } from './components/AnnouncementCard'
export { EventCard } from './components/EventCard'
export { AdsMetricGrid } from './components/AdsMetricGrid'
export type { MetricKey } from './components/AdsMetricGrid'
export { AdsChart } from './components/AdsChart'
export { AdsTable } from './components/AdsTable'
export { VoucherTable } from './components/VoucherTable'
export { CreateVoucherModal } from './components/CreateVoucherModal'
export { ShippingForm } from './components/ShippingForm'
export { PerformancePanel } from './components/PerformancePanel'
export type { KpiItem } from './components/PerformancePanel'

// ── Icons ─────────────────────────────────────────────────────────────────────
export {
  ChevronRight,
  Plus,
  ArrowUpDown,
  X,
  Trash2,
  Megaphone,
  TrendingUp,
  TicketIcon,
  TruckIcon,
  SearchIcon,
  ZapIcon,
  UsersIcon,
  GiftIcon,
  StarIcon,
  AlertIcon,
  DownloadIcon,
  CheckIcon,
  MessageIcon,
  BarChartIcon,
  InfoIcon,
} from './components/icons'

// ── Types ─────────────────────────────────────────────────────────────────────
export type {
  Announcement,
  MarketingEvent,
  MarketingCentreResponse,
  ToolCard,
  CampaignCard,
  MarketingOverviewResponse,
  AdsMetrics,
  AdsTimeseries,
  AdsRecommendation,
  AdMatchType,
  AdCampaign,
  AdsResponse,
  VoucherType,
  VoucherStatus,
  DiscountType,
  Voucher,
  VoucherListResponse,
  VoucherPerformance,
  CreateVoucherInput,
  FlashDealStatus,
  FlashDeal,
  FlashDealPerformance,
  FlashDealsResponse,
  CreateFlashDealInput,
  CampaignSellerStatus,
  CampaignType,
  Campaign,
  CampaignsResponse,
  SessionSellerStatus,
  CampaignSession,
  CampaignDetailResponse,
  Creator,
  CreatorsResponse,
  CreatorActivateInput,
  ReviewPrizeStatus,
  ReviewPrize,
  ReviewPrizeListResponse,
  ReviewPrizeMetrics,
  ShippingRegion,
  MarketingShipping,
} from './types/marketing.types'
