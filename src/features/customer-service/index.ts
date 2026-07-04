// PUBLIC API of the customer-service feature. Pages import ONLY from here
// (`@/features/customer-service`) — never a deep path. ESLint enforces this.
export {
  customerServiceKeys,
  useChatChannels,
  useChatMessages,
  useSendChatMessage,
  useHelpCenter,
  useTickets,
  useResolveTicket,
  useChatAssistant,
  useFaqAssistant,
  // Shopee-spec hooks
  useChatMetrics,
  useAutoReplies,
  usePatchAutoReply,
  useShortcuts,
  useFaqDashboard,
  useReviews,
  useRatingsSummary,
  useSubmitReviewReply,
} from './api/customer-service.queries'

export { useCustomerServiceUi } from './stores/customer-service.store'
export { customerServiceHandlers } from './api/customer-service.mocks'
export { customerServiceMessages } from './i18n'

// ── Existing components ───────────────────────────────────────────────────────
export { ChatChannelList } from './components/ChatChannelList'
export { ChatWindow } from './components/ChatWindow'
export { ChatOrderPanel } from './components/ChatOrderPanel'
export { HelpHero } from './components/HelpHero'
export { HelpGuideCard } from './components/HelpGuideCard'
export { FaqAccordion } from './components/FaqAccordion'
export { TicketStatusTabs } from './components/TicketStatusTabs'
export { TicketTable } from './components/TicketTable'
export { TicketDetailModal } from './components/TicketDetailModal'
export { AutoReplyCard } from './components/AutoReplyCard'
export { ToggleSwitch } from './components/ToggleSwitch'
export { FaqDetailForm } from './components/FaqDetailForm'
export { ShortcutsPanel } from './components/ShortcutsPanel'

// ── Shopee-spec components ─────────────────────────────────────────────────────
export { ChatPerformanceCard } from './components/ChatPerformanceCard'
export { ChatAssistantFeaturesCard } from './components/ChatAssistantFeaturesCard'
export { ChatEducationCard } from './components/ChatEducationCard'
export { AutoReplySection } from './components/AutoReplySection'
export { ShortcutGroupAccordion } from './components/ShortcutGroupAccordion'
export { FaqFunnelChart } from './components/FaqFunnelChart'
export { ReviewTable } from './components/ReviewTable'
export { ReviewReplyModal } from './components/ReviewReplyModal'

// ── Icons ─────────────────────────────────────────────────────────────────────
export {
  MessageSquareIcon,
  SearchIcon,
  EditIcon,
  PlusIcon,
  XIcon,
  InfoIcon,
  DownloadIcon,
  TrashIcon,
  GripVerticalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrendUpIcon,
  TrendDownIcon,
  FlagIcon,
} from './components/icons'

// ── Types ─────────────────────────────────────────────────────────────────────
export {
  CHAT_FILTERS,
  FAQ_CATEGORY_FILTERS,
  TICKET_STATUS_FILTERS,
} from './types/customer-service.types'
export type {
  ChatChannel,
  ChatMessage,
  ChatFilter,
  ChatOrderStatus,
  ChatSender,
  SendChatMessageInput,
  ChatChannelListResponse,
  ChatMessageListResponse,
  FaqItem,
  FaqCategory,
  FaqCategoryFilter,
  HelpGuide,
  HelpCenterResponse,
  Ticket,
  TicketStatus,
  TicketStatusFilter,
  TicketPriority,
  TicketCategory,
  TicketSummary,
  TicketListQuery,
  TicketListResponse,
  AutoReply,
  AutoReplyKind,
  ShortcutGroup,
  ChatAssistantResponse,
  FaqCard,
  FaqAssistantResponse,
  // Shopee-spec types
  ChatMetrics,
  ChatMetricsResponse,
  ShortcutEntry,
  ShortcutGroupFull,
  ShortcutsListResponse,
  FaqOverviewMetrics,
  FaqQuestionRow,
  FaqDashboardResponse,
  ReviewTab,
  ReviewSummary,
  ReviewImage,
  Review,
  ReviewListResponse,
  ReviewListQuery,
  SubmitReplyInput,
} from './types/customer-service.types'
