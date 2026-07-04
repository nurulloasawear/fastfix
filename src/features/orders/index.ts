// PUBLIC API of the orders feature. Pages import ONLY from here
// (`@/features/orders`) — never a deep path.

// ── Queries + mutations ───────────────────────────────────────────────────────
export {
  orderKeys,
  useOrders,
  useOrderDetails,
  useOrderTimeline,
  useMassShipOrders,
  useReturnRequests,
  useReturnDetail,
  useAddOrderNote,
  useBulkArrange,
  useBulkShip,
  useBulkArrangeOrders,
  useGenerateDocuments,
  useExportOrders,
  useSubmitReturnDispute,
  useApproveReturn,
  useRejectReturn,
  useReplyToReturn,
  useSubmitReturnEvidence,
  useRetrieveReturnParcel,
  useInspectReturnProduct,
  useExportReturns,
  useMassShip,
} from './api/orders.queries'

// ── Stores ────────────────────────────────────────────────────────────────────
export { useOrdersUi, useMassShipUi, useReturnsUi } from './stores/orders.store'

// ── MSW handlers + i18n (must always be exported) ────────────────────────────
export { ordersHandlers } from './api/orders.mocks'
export { ordersMessages } from './i18n'

// ── Components ────────────────────────────────────────────────────────────────
export { OrderStatusTabs } from './components/OrderStatusTabs'
export { OrderSubTabs } from './components/OrderSubTabs'
export { OrderFilters } from './components/OrderFilters'
export { OrderTable } from './components/OrderTable'
export { OrderTimeline } from './components/OrderTimeline'
export { OrderEventTimeline } from './components/OrderEventTimeline'
export { OrderPaymentSummary } from './components/OrderPaymentSummary'
export { ReturnStatusTabs } from './components/ReturnStatusTabs'
export { ReturnEventTimeline } from './components/ReturnEventTimeline'

// ── Icons ─────────────────────────────────────────────────────────────────────
export {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  SlidersIcon,
  EyeIcon,
  StoreIcon,
  CheckIcon,
  MessageIcon,
  PackageIcon,
  MapPinIcon,
  TruckIcon,
  DollarIcon,
  ClipboardIcon,
  RotateCcwIcon,
  FileTextIcon,
  DownloadIcon,
  InfoCircleIcon,
  AlertCircleIcon,
  XCircleIcon,
  UserIcon,
  ListIcon,
} from './components/icons'

// ── Types ─────────────────────────────────────────────────────────────────────
export {
  ORDER_STATUSES,
  TO_SHIP_SUB_STATUSES,
  CANCELLATION_SUB_STATUSES,
  RETURN_STATUSES,
} from './types/orders.types'

export type {
  OrderStatus,
  OrderSubStatus,
  OrderItem,
  OrderListQuery,
  OrderListResponse,
  OrderSummary,
  OrderDetailsResponse,
  OrderDetailItem,
  OrderEvent,
  OrderEventType,
  OrderAdjustment,
  MassShipItem,
  MassShipQuery,
  MassShipResponse,
  DeadlineBucket,
  ReturnRequest,
  ReturnListQuery,
  ReturnListResponse,
  ReturnSummary,
  ReturnSort,
  ReturnStatus,
  ReturnType,
  ReturnPrimaryTab,
  ReturnPriority,
  ReturnDetailResponse,
  ReturnEvent,
  ReturnEventType,
  // backward compat
  OrderTrackingStep,
  OrderDetailProduct,
  OrderPaymentSummary as OrderPaymentSummaryData,
  OrderDetailsResponse_Legacy,
} from './types/orders.types'
