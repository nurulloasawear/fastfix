// Customer-service domain: buyer↔seller chat, help center / FAQ, support tickets,
// and the chat/FAQ assistant settings. All mock-only for now ([PENDING BACKEND]).
// Money is integer UZS end-to-end (formatUZS). IDs are uuid strings.

/* ───────────────────────── Chat ───────────────────────── */

export type ChatFilter = 'all' | 'unread' | 'starred'

export const CHAT_FILTERS: ChatFilter[] = ['all', 'unread', 'starred']

// The buyerʻs last-known order, shown in the chat side panel.
export type ChatOrderStatus = 'pending' | 'shipped' | 'delivered'

export interface ChatChannel {
  id: string
  customerName: string
  lastMessage: string
  // Pre-formatted relative time label (e.g. "14:32", "yesterday"); UI-agnostic.
  time: string
  unreadCount: number
  starred: boolean
  customerSince: string
  orderId: string
  orderStatus: ChatOrderStatus
  orderTotalUzs: number
}

export type ChatSender = 'seller' | 'customer'

export interface ChatMessage {
  id: string
  channelId: string
  sender: ChatSender
  text: string
  time: string
}

export interface ChatChannelListResponse {
  channels: ChatChannel[]
  total: number
}

export interface ChatMessageListResponse {
  messages: ChatMessage[]
}

export interface SendChatMessageInput {
  channelId: string
  text: string
}

/* ───────────────────── Help center / FAQ ───────────────────── */

export type FaqCategory = 'orders' | 'delivery' | 'finance' | 'account'

export type FaqCategoryFilter = 'all' | FaqCategory

export const FAQ_CATEGORY_FILTERS: FaqCategoryFilter[] = [
  'all',
  'orders',
  'delivery',
  'finance',
  'account',
]

export interface FaqItem {
  id: string
  category: FaqCategory
  question: string
  answer: string
}

export interface HelpGuide {
  id: string
  // i18n key suffix → resolves to help.guide.<slug>.title / .desc.
  slug: string
  articleCount: number
}

export interface HelpCenterResponse {
  guides: HelpGuide[]
  faqs: FaqItem[]
}

/* ───────────────────── Support tickets ───────────────────── */

export type TicketStatus = 'open' | 'pending' | 'resolved'

export type TicketStatusFilter = 'all' | TicketStatus

export const TICKET_STATUS_FILTERS: TicketStatusFilter[] = [
  'all',
  'open',
  'pending',
  'resolved',
]

export type TicketPriority = 'high' | 'medium' | 'low'

// Ticket subject area; maps to a localized label via ticket.category.<value>.
export type TicketCategory = 'delivery' | 'finance' | 'promotion' | 'product_info'

export interface Ticket {
  id: string
  ref: string
  customerName: string
  subject: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  date: string
  description: string
}

export interface TicketSummary {
  all: number
  open: number
  pending: number
  resolved: number
}

export interface TicketListResponse {
  tickets: Ticket[]
  total: number
  summary: TicketSummary
}

export interface TicketListQuery {
  status?: TicketStatusFilter
  search?: string
}

/* ───────────────────── Assistant settings ───────────────────── */

// Auto-reply rules shown on the Agent Greetings page.
export type AutoReplyKind = 'default' | 'off_work'

export interface AutoReply {
  kind: AutoReplyKind
  message: string
  enabled: boolean
}

export interface ShortcutGroup {
  id: string
  name: string
  description: string
  enabled: boolean
}

export interface ChatAssistantResponse {
  autoReplies: AutoReply[]
  shortcutGroups: ShortcutGroup[]
}

// FAQ assistant: the single FAQ-card entry shown before opening the detail form.
export interface FaqCard {
  id: string
  enabled: boolean
}

export interface FaqAssistantResponse {
  cards: FaqCard[]
}

/* ───────────── Chat Management (Shopee-spec section) ─────────── */

// Chat performance KPIs
export interface ChatMetrics {
  enquiryCount: number
  responseRate: number | null  // null when no data (shows "-")
  avgResponseTimeSeconds: number
  enquiryDeltaPct: number
  responseDeltaPct: number | null
  responseDeltaSeconds: number
}

export interface ChatMetricsResponse {
  metrics: ChatMetrics
  periodStart: string  // ISO date
  periodEnd: string
}

/* ───────────────── Shortcuts (Shopee-spec section) ─────────────── */

export interface ShortcutEntry {
  id: string
  groupId: string
  keyword: string
  messageText: string
  sortOrder: number
}

export interface ShortcutGroupFull extends ShortcutGroup {
  shortcuts: ShortcutEntry[]
}

export interface ShortcutsListResponse {
  groups: ShortcutGroupFull[]
  totalCount: number
  maxCount: number
  showHintsAutomatically: boolean
}

/* ─────────────────── FAQ Dashboard (Shopee-spec) ──────────────── */

export interface FaqOverviewMetrics {
  faqTriggered: number
  faqClicked: number
  questionResolved: number
  liveAgentTransferred: number
  helpfulClicks: number
  unhelpfulClicks: number
  triggeredDeltaPct: number
  clickedDeltaPct: number
  resolvedDeltaPct: number
  transferredDeltaPct: number
  helpfulDeltaPct: number
  unhelpfulDeltaPct: number
}

export interface FaqQuestionRow {
  id: string
  section: string
  groupName: string
  question: string
  clicked: number
  ctr: number
  resolved: number
}

export interface FaqDashboardResponse {
  overview: FaqOverviewMetrics
  questions: FaqQuestionRow[]
  date: string        // display date e.g. "15-06-2026"
  timezone: string    // "GMT+05"
}

/* ─────────────────────── Reviews (Shopee-spec) ───────────────── */

export type ReviewTab = 'all' | 'to_reply' | 'replied'

export interface ReviewSummary {
  overallRating: number
  ratingsReceived: number
  ratingsReceivedDelta: number
  reviewRateOfOrders: number
  goodRatingRate: number
  goodRatingDelta: number
  unresolvedBadRatings: number
  newRatingsReceived: number
  starCounts: Record<1 | 2 | 3 | 4 | 5, number>
  total: number
  toReply: number
  replied: number
}

export interface ReviewImage {
  url: string
  thumbnail: string
}

export interface Review {
  id: string
  orderId: string
  buyerUsername: string
  buyerAvatar: string
  orderDate: string
  productThumbnail: string
  productTitle: string
  productVariants: string[]
  rating: 1 | 2 | 3 | 4 | 5
  reviewText: string
  images: ReviewImage[]
  hasReply: boolean
  replyText?: string
  createdAt: string
}

export interface ReviewListResponse {
  reviews: Review[]
  total: number
  summary: ReviewSummary
}

export interface ReviewListQuery {
  tab?: ReviewTab
  stars?: number[]
  search?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}

export interface SubmitReplyInput {
  reviewId: string
  replyText: string
}
