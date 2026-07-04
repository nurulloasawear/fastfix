// PUBLIC API — pages import ONLY from '@/features/live', never deep paths.
export { liveHandlers } from './api/live.mocks'
export { liveMessages } from './i18n'

// Queries
export {
  liveKeys,
  useLiveAnalytics,
  useStreamingPricePromotions,
  useStream,
  useStreamStats,
  useSellerProducts,
  useCreatePromotion,
  useDeletePromotion,
  useCreateStream,
  useUploadCoverImage,
  useStartStream,
  useEndStream,
  useNotifyFollowers,
  useRegenerateStreamKey,
  usePinStreamProduct,
  useReorderStreamProducts,
  useRemoveStreamProduct,
} from './api/live.queries'

// Types
export {
  STREAM_STATUSES,
  STREAM_TYPES,
  PROMOTION_STATUSES,
  PROMOTION_STATUS_FILTERS,
} from './types/live.types'
export type {
  StreamStatus,
  StreamType,
  PromotionStatus,
  PromotionStatusFilter,
  StreamingPricePromotion,
  PromotionProduct,
  CreatePromotionBody,
  StreamingPriceListQuery,
  StreamSession,
  StreamSessionProduct,
  CreateStreamBody,
  CreateStreamResponse,
  Playback,
  StartStreamResult,
  StreamStats,
  SellerProduct,
  LiveAnalyticsData,
  LiveAnalyticsQuery,
  MetricCard,
  AnalyticsInnerTab,
  TrafficTab,
  ConversionTab,
} from './types/live.types'

// Components
export { LiveSubNav } from './components/LiveSubNav'
export { AnalyticsMetricCard } from './components/AnalyticsMetricCard'
export { AnalyticsSectionCard } from './components/AnalyticsSectionCard'
export { PromotionStatusBadge } from './components/PromotionStatusBadge'
export { ProductPickerModal } from './components/ProductPickerModal'
export { StreamProductPickerModal } from './components/StreamProductPickerModal'
export { ProductsPanelModal } from './components/ProductsPanelModal'
export { ObsSetupGuide } from './components/ObsSetupGuide'
export { StreamProductList } from './components/StreamProductList'
export type { StreamProductRow } from './components/StreamProductList.types'

// Icons
export {
  VideoIcon,
  TrendingUpIcon,
  TagIcon,
  PlayCircleIcon,
  SearchIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  XIcon,
  CopyIcon,
  RefreshIcon,
  ShareIcon,
  BellIcon,
  GripVerticalIcon,
  ArrowUpIcon,
  TrashIcon,
  InfoIcon,
  MegaphoneIcon,
  EyeIcon,
  UploadIcon,
  ExternalLinkIcon,
} from './components/icons'
