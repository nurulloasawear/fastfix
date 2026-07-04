// PUBLIC API of the shop feature. Pages import ONLY from here (`@/features/shop`)
// — never a deep path. ESLint enforces this.

// ── Queries / mutations ────────────────────────────────────────────────────────
export {
  shopKeys,
  useShopProfile,
  useUpdateProfile,
  useShopReviews,
  useReplyToReview,
  useDecoration,
  useSaveDecoration,
  useCategories,
  useCreateCategory,
  useToggleCategory,
  useDeleteCategory,
  useMedia,
  useDeleteMedia,
  useReports,
  useGenerateReport,
  // New
  useShopInfo,
  usePatchShopInfo,
  useShopKyc,
  useDecorationDrafts,
  useDecorationContent,
  useSaveDecorationDraft,
  usePublishDecoration,
  useTopPicks,
  useTopPicksDetail,
  usePatchTopPicks,
  useAppeals,
  useMissions,
  useMarkIntroSeen,
  useRewardsList,
} from './api/shop.queries'

// ── UI store ───────────────────────────────────────────────────────────────────
export { useShopUi } from './stores/shop.store'
export type { ReviewFilter, MediaFilter, ReportFilter } from './stores/shop.store'

// ── MSW handlers + i18n (consumed by the orchestrator) ────────────────────────
export { shopHandlers } from './api/shop.mocks'
export { shopMessages } from './i18n'

// ── Components ────────────────────────────────────────────────────────────────
export { ShopProfileForm } from './components/ShopProfileForm'
export { ReviewStats } from './components/ReviewStats'
export { ReviewList } from './components/ReviewList'
export { DecorationEditor } from './components/DecorationEditor'
export { CategoryAddForm } from './components/CategoryAddForm'
export { CategoryTable } from './components/CategoryTable'
export { StorageBar } from './components/StorageBar'
export { MediaGrid } from './components/MediaGrid'
export { ReportStats } from './components/ReportStats'
export { ReportFilters } from './components/ReportFilters'
export { ReportList } from './components/ReportList'
export { SegmentedTabs } from './components/SegmentedTabs'
export { SearchInput } from './components/SearchInput'
// New components
export { ShopInfoBasicPanel } from './components/ShopInfoBasicPanel'
export { ShopInfoKycPanel } from './components/ShopInfoKycPanel'
export { DecorationDraftList } from './components/DecorationDraftList'
export {
  PlatformToggle,
  DecorationMainTabs,
  DecorationInfoBanner,
  UseDecorationToggle,
} from './components/DecorationControls'
export { DecorationEditorCanvas } from './components/DecorationEditorCanvas'
export { AppealsTable } from './components/AppealsTable'
export { MissionsPanel } from './components/MissionsPanel'
export { RewardsPanel } from './components/RewardsPanel'
export { MissionsIntroModal } from './components/MissionsIntroModal'

// ── Types ─────────────────────────────────────────────────────────────────────
export type {
  ShopProfile,
  ShopReview,
  ShopRatingSummary,
  DecorationBlock,
  ShopCategory,
  MediaFile,
  ShopReport,
  ReportsSummary,
  // New
  ShopInfoProfile,
  ShopInfoUpdate,
  ShopKyc,
  KycStatus,
  SellerType,
  IdType,
  MultiLang,
  DecorationPlatform,
  DecorationStatus,
  DecorationDraft,
  DecorationContent,
  Widget,
  WidgetType,
  TopPicksCollection,
  TopPicksDetail,
  TopPicksProduct,
  AppealType,
  AppealStatus,
  Appeal,
  AppealsQuery,
  Mission,
  MissionTask,
  MissionStatus,
  SellerReward,
  RewardType,
  RewardStatus,
} from './types/shop.types'
