import { apiClient } from '@/lib/axios'
import type { Language } from '@/i18n'
import { pickLang } from '@/lib/lang'
import type {
  AutoReply,
  ChatAssistantResponse,
  ChatChannelListResponse,
  ChatMessage,
  ChatMessageListResponse,
  FaqAssistantResponse,
  FaqDashboardResponse,
  HelpCenterResponse,
  Review,
  ReviewListQuery,
  ReviewListResponse,
  ReviewSummary,
  SendChatMessageInput,
  ShortcutsListResponse,
  SubmitReplyInput,
  TicketListQuery,
  TicketListResponse,
  ChatMetricsResponse,
} from '../types/customer-service.types'

// PATH annotations:
//   ✅ LIVE   — points at the real backend; MSW bypasses (onUnhandledRequest:'bypass').
//   🔶 MOCK   — no deployed route yet; MSW handler still serves it.
const PATHS = {
  // 🔶 MOCK buyer↔seller chat channels.
  channels: '/seller/customer-service/chat/channels',
  // 🔶 MOCK messages for one chat channel.
  messages: (channelId: string) =>
    `/seller/customer-service/chat/channels/${channelId}/messages`,
  // 🔶 MOCK help center guides + FAQ list.
  helpCenter: '/seller/customer-service/help-center',
  // 🔶 MOCK support ticket history.
  tickets: '/seller/customer-service/tickets',
  // 🔶 MOCK chat assistant settings (legacy compound endpoint).
  chatAssistant: '/seller/customer-service/chat-assistant',
  // 🔶 MOCK FAQ assistant cards (legacy compound endpoint).
  faqAssistant: '/seller/customer-service/faq-assistant',
  // ✅ LIVE GET /sellers/me/chat/metrics
  chatMetrics: '/sellers/me/chat/metrics',
  // ✅ LIVE GET /sellers/me/chat/auto-replies
  autoReplies: '/sellers/me/chat/auto-replies',
  // ✅ LIVE PATCH /sellers/me/chat/auto-replies/:type
  autoReply: (type: string) => `/sellers/me/chat/auto-replies/${type}`,
  // ✅ LIVE PATCH /sellers/me/chat/preferences  (PATCH-only, no GET)
  chatPreferences: '/sellers/me/chat/preferences',
  // ✅ LIVE GET/POST /sellers/me/shortcuts
  shortcuts: '/sellers/me/shortcuts',
  // ✅ LIVE PATCH/DELETE /sellers/me/shortcuts/:id
  shortcut: (id: string) => `/sellers/me/shortcuts/${id}`,
  // ✅ LIVE POST /sellers/me/shortcut-groups
  shortcutGroups: '/sellers/me/shortcut-groups',
  // ✅ LIVE PATCH/DELETE /sellers/me/shortcut-groups/:id
  shortcutGroup: (id: string) => `/sellers/me/shortcut-groups/${id}`,
  // ✅ LIVE GET /sellers/me/faq/metrics
  faqMetrics: '/sellers/me/faq/metrics',
  // ✅ LIVE GET/POST /sellers/me/faq/sections
  faqSections: '/sellers/me/faq/sections',
  // ✅ LIVE POST /sellers/me/faq/sections/:id/questions
  faqSectionQuestions: (sectionId: string) => `/sellers/me/faq/sections/${sectionId}/questions`,
  // ✅ LIVE PATCH/DELETE /sellers/me/faq/questions/:id
  faqQuestion: (id: string) => `/sellers/me/faq/questions/${id}`,
  // ✅ LIVE GET /sellers/me/reviews  (lightweight listing)
  reviews: '/sellers/me/reviews',
  // ✅ LIVE GET /sellers/me/reviews/manage  (rich management listing)
  reviewsManage: '/sellers/me/reviews/manage',
  // ✅ LIVE POST /sellers/me/reviews/:id/reply
  reviewReply: (id: string) => `/sellers/me/reviews/${id}/reply`,
} as const

export async function getChatChannels(): Promise<ChatChannelListResponse> {
  const { data } = await apiClient.get<ChatChannelListResponse>(PATHS.channels)
  return data
}

export async function getChatMessages(channelId: string): Promise<ChatMessageListResponse> {
  const { data } = await apiClient.get<ChatMessageListResponse>(PATHS.messages(channelId))
  return data
}

export async function sendChatMessage(input: SendChatMessageInput): Promise<ChatMessage> {
  const { data } = await apiClient.post<ChatMessage>(PATHS.messages(input.channelId), {
    text: input.text,
  })
  return data
}

export async function getHelpCenter(): Promise<HelpCenterResponse> {
  const { data } = await apiClient.get<HelpCenterResponse>(PATHS.helpCenter)
  return data
}

export async function getTickets(query: TicketListQuery): Promise<TicketListResponse> {
  const { data } = await apiClient.get<TicketListResponse>(PATHS.tickets, { params: query })
  return data
}

export async function resolveTicket(id: string): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>(`${PATHS.tickets}/${id}/resolve`)
  return data
}

export async function getChatAssistant(): Promise<ChatAssistantResponse> {
  const { data } = await apiClient.get<ChatAssistantResponse>(PATHS.chatAssistant)
  return data
}

export async function getFaqAssistant(): Promise<FaqAssistantResponse> {
  const { data } = await apiClient.get<FaqAssistantResponse>(PATHS.faqAssistant)
  return data
}

// ── Shopee-spec endpoints — all LIVE ─────────────────────────────────────────

// Backend: snake_case keys. Map → camelCase FE types.

interface BackendChatMetrics {
  enquiry_count: number
  response_rate: number | null
  avg_response_time_seconds: number
  enquiry_delta_pct: number
  response_delta_pct: number | null
  response_delta_seconds: number
}

interface BackendChatMetricsResponse {
  metrics: BackendChatMetrics
  period_start: string
  period_end: string
  assistant?: {
    agent_greetings_configured: boolean
    shortcut_configured: boolean
    faq_configured: boolean
  }
}

export async function getChatMetrics(): Promise<ChatMetricsResponse> {
  const { data } = await apiClient.get<BackendChatMetricsResponse>(PATHS.chatMetrics)
  return {
    metrics: {
      enquiryCount: data.metrics.enquiry_count ?? 0,
      responseRate: data.metrics.response_rate,
      avgResponseTimeSeconds: data.metrics.avg_response_time_seconds ?? 0,
      enquiryDeltaPct: data.metrics.enquiry_delta_pct ?? 0,
      responseDeltaPct: data.metrics.response_delta_pct,
      responseDeltaSeconds: data.metrics.response_delta_seconds ?? 0,
    },
    periodStart: data.period_start,
    periodEnd: data.period_end,
  }
}

// Backend auto-reply: field `kind` matches FE type directly. Already aligned.
export async function getAutoReplies(): Promise<AutoReply[]> {
  const { data } = await apiClient.get<AutoReply[]>(PATHS.autoReplies)
  // Backend returns [] when none configured — default both kinds.
  if (!Array.isArray(data) || data.length === 0) {
    return [
      { kind: 'default', enabled: false, message: '' },
      { kind: 'off_work', enabled: false, message: '' },
    ]
  }
  return data
}

export async function patchAutoReply(
  type: string,
  payload: Partial<Pick<AutoReply, 'enabled' | 'message'>>,
): Promise<AutoReply> {
  const { data } = await apiClient.patch<AutoReply>(PATHS.autoReply(type), payload)
  return data
}

export async function patchChatPreferences(
  showHintsAutomatically: boolean,
): Promise<{ show_hints_automatically: boolean }> {
  const { data } = await apiClient.patch<{ show_hints_automatically: boolean }>(
    PATHS.chatPreferences,
    { show_hints_automatically: showHintsAutomatically },
  )
  return data
}

// Backend shortcuts: snake_case keys. Map group/shortcut fields → FE camelCase.
interface BackendShortcutEntry {
  id: string
  group_id: string
  keyword: string
  message_text: string
  sort_order: number
}

interface BackendShortcutGroup {
  id: string
  name: string
  description?: string
  enabled: boolean
  sort_order?: number
  shortcuts: BackendShortcutEntry[]
}

interface BackendShortcutsListResponse {
  groups: BackendShortcutGroup[]
  total_count: number
  max_count: number
  show_hints_automatically: boolean
}

function mapShortcutEntry(dto: BackendShortcutEntry) {
  return {
    id: dto.id,
    groupId: dto.group_id ?? '',
    keyword: dto.keyword,
    messageText: dto.message_text,
    sortOrder: dto.sort_order ?? 0,
  }
}

function mapShortcutGroup(dto: BackendShortcutGroup) {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? '',
    enabled: dto.enabled ?? true,
    shortcuts: (dto.shortcuts ?? []).map(mapShortcutEntry),
  }
}

export async function getShortcutsList(): Promise<ShortcutsListResponse> {
  const { data } = await apiClient.get<BackendShortcutsListResponse>(PATHS.shortcuts)
  return {
    groups: (data.groups ?? []).map(mapShortcutGroup),
    totalCount: data.total_count ?? 0,
    maxCount: data.max_count ?? 25,
    showHintsAutomatically: data.show_hints_automatically ?? false,
  }
}

export async function createShortcut(payload: {
  group_id?: string
  keyword: string
  message_text: string
}) {
  const { data } = await apiClient.post<BackendShortcutEntry>(PATHS.shortcuts, payload)
  return mapShortcutEntry(data)
}

export async function updateShortcut(
  id: string,
  payload: Partial<{ keyword: string; message_text: string; sort_order: number; group_id: string }>,
) {
  const { data } = await apiClient.patch<BackendShortcutEntry>(PATHS.shortcut(id), payload)
  return mapShortcutEntry(data)
}

export async function deleteShortcut(id: string): Promise<void> {
  await apiClient.delete(PATHS.shortcut(id))
}

export async function createShortcutGroup(name: string) {
  const { data } = await apiClient.post<BackendShortcutGroup>(PATHS.shortcutGroups, { name })
  return mapShortcutGroup(data)
}

export async function updateShortcutGroup(
  id: string,
  payload: Partial<{ name: string; enabled: boolean; sort_order: number }>,
) {
  const { data } = await apiClient.patch<BackendShortcutGroup>(PATHS.shortcutGroup(id), payload)
  return mapShortcutGroup(data)
}

export async function deleteShortcutGroup(id: string): Promise<void> {
  await apiClient.delete(PATHS.shortcutGroup(id))
}

// FAQ — sections and questions
interface BackendFaqQuestion {
  id: string
  question: { uz?: string; ru?: string; en?: string }
  answer: { uz?: string; ru?: string; en?: string }
  enabled: boolean
  sort_order: number
}

interface BackendFaqSection {
  id: string
  title: { uz?: string; ru?: string; en?: string }
  sort_order: number
  questions: BackendFaqQuestion[]
}

interface BackendFaqSectionsResponse {
  sections: BackendFaqSection[]
}

export async function getFaqSections(): Promise<BackendFaqSectionsResponse> {
  const { data } = await apiClient.get<BackendFaqSectionsResponse>(PATHS.faqSections)
  return { sections: data.sections ?? [] }
}

export async function createFaqSection(title: { uz?: string; ru?: string; en?: string }) {
  const { data } = await apiClient.post<BackendFaqSection>(PATHS.faqSections, { title })
  return data
}

export async function createFaqQuestion(
  sectionId: string,
  payload: {
    question: { uz?: string; ru?: string; en?: string }
    answer: { uz?: string; ru?: string; en?: string }
  },
) {
  const { data } = await apiClient.post<BackendFaqQuestion>(
    PATHS.faqSectionQuestions(sectionId),
    payload,
  )
  return data
}

export async function updateFaqQuestion(
  id: string,
  payload: Partial<{
    question: { uz?: string; ru?: string; en?: string }
    answer: { uz?: string; ru?: string; en?: string }
    enabled: boolean
    sort_order: number
  }>,
) {
  const { data } = await apiClient.patch<BackendFaqQuestion>(PATHS.faqQuestion(id), payload)
  return data
}

export async function deleteFaqQuestion(id: string): Promise<void> {
  await apiClient.delete(PATHS.faqQuestion(id))
}

// FAQ Dashboard metrics — backend returns snake_case; map → FE camelCase.
interface BackendFaqOverview {
  faq_triggered: number
  faq_clicked: number
  question_resolved: number
  live_agent_transferred: number
  helpful_clicks: number
  unhelpful_clicks: number
  triggered_delta_pct: number
  clicked_delta_pct: number
  resolved_delta_pct: number
  transferred_delta_pct: number
  helpful_delta_pct: number
  unhelpful_delta_pct: number
  ctr: number
  resolution_rate: number
  helpful_rate: number
}

interface BackendFaqQuestionRow {
  id: string
  section: string
  group_name: string
  question: string
  clicked: number
  ctr: number
  resolved: number
}

interface BackendFaqDashboardResponse {
  date: string
  timezone: string
  overview: BackendFaqOverview
  questions: BackendFaqQuestionRow[]
}

// from = selected date (YYYY-MM-DD); to is unused by the backend (single-day endpoint)
export async function getFaqDashboard(from?: string, _to?: string): Promise<FaqDashboardResponse> {
  const { data } = await apiClient.get<BackendFaqDashboardResponse>(PATHS.faqMetrics, {
    params: from ? { date: from } : undefined,
  })
  return {
    date: data.date,
    timezone: data.timezone,
    overview: {
      faqTriggered: data.overview.faq_triggered ?? 0,
      faqClicked: data.overview.faq_clicked ?? 0,
      questionResolved: data.overview.question_resolved ?? 0,
      liveAgentTransferred: data.overview.live_agent_transferred ?? 0,
      helpfulClicks: data.overview.helpful_clicks ?? 0,
      unhelpfulClicks: data.overview.unhelpful_clicks ?? 0,
      triggeredDeltaPct: data.overview.triggered_delta_pct ?? 0,
      clickedDeltaPct: data.overview.clicked_delta_pct ?? 0,
      resolvedDeltaPct: data.overview.resolved_delta_pct ?? 0,
      transferredDeltaPct: data.overview.transferred_delta_pct ?? 0,
      helpfulDeltaPct: data.overview.helpful_delta_pct ?? 0,
      unhelpfulDeltaPct: data.overview.unhelpful_delta_pct ?? 0,
    },
    questions: (data.questions ?? []).map((q) => ({
      id: q.id,
      section: q.section,
      groupName: q.group_name,
      question: q.question,
      clicked: q.clicked ?? 0,
      ctr: q.ctr ?? 0,
      resolved: q.resolved ?? 0,
    })),
  }
}

// ── Reviews ───────────────────────────────────────────────────────────────────
// Primary management page uses /sellers/me/reviews/manage (rich DTO, ✅ LIVE).
// The lightweight /sellers/me/reviews (✅ LIVE) is kept for getRatingsSummary.

interface BackendLangMap {
  uz?: string
  ru?: string
  en?: string
}

// /sellers/me/reviews/manage response shape (verified against live backend)
interface BackendManageReview {
  id: string
  order_id: string | null
  product_id: string
  product_title: BackendLangMap | string
  product_thumbnail: string | null
  product_variants: string[] | null
  buyer_id: string | null
  buyer_username: string | null
  buyer_avatar: string | null
  rating: number
  review_text: string | null
  images: string[] | null
  has_reply: boolean
  reply_text: string | null
  created_at: string
}

interface BackendManageSummary {
  overall_rating: number
  ratings_received: number
  ratings_received_delta_pct: number
  review_rate_of_orders: number
  good_rating_rate: number
  good_rating_delta_pct: number
  unresolved_bad_ratings: number
  new_ratings_received: number
  by_star: Record<'1' | '2' | '3' | '4' | '5', number>
  total: number
  to_reply: number
  replied: number
}

interface BackendManageResponse {
  reviews: BackendManageReview[]
  total: number
  summary: BackendManageSummary
}

// Fallback lightweight DTO (GET /sellers/me/reviews)
interface BackendLightReview {
  product_id: string
  product_title: BackendLangMap
  author_name: string
  rating: number
  comment: string
  created_at: string
}

interface BackendLightSummary {
  count: number
  avg_rating: number
  by_star: Record<'1' | '2' | '3' | '4' | '5', number>
}

interface BackendLightReviewsResponse {
  reviews: BackendLightReview[]
  summary: BackendLightSummary
}

function currentLang(): Language {
  return (localStorage.getItem('ozb_seller_lang') as Language | null) ?? 'uz'
}

function clampStar(n: number): 1 | 2 | 3 | 4 | 5 {
  return Math.max(1, Math.min(5, Math.round(n))) as 1 | 2 | 3 | 4 | 5
}

function mapManageReview(dto: BackendManageReview, lang: Language): Review {
  const title =
    typeof dto.product_title === 'string'
      ? dto.product_title
      : pickLang(dto.product_title as BackendLangMap, lang)
  return {
    id: dto.id,
    orderId: dto.order_id ?? dto.product_id,
    buyerUsername: dto.buyer_username ?? '',
    buyerAvatar: dto.buyer_avatar ?? '',
    orderDate: dto.created_at,
    productThumbnail: dto.product_thumbnail ?? '',
    productTitle: title,
    productVariants: dto.product_variants ?? [],
    rating: clampStar(dto.rating),
    reviewText: dto.review_text ?? '',
    images: (dto.images ?? []).map((url) => ({ url, thumbnail: url })),
    hasReply: dto.has_reply ?? false,
    replyText: dto.reply_text ?? undefined,
    createdAt: dto.created_at,
  }
}

function mapManageSummary(dto: BackendManageSummary): ReviewSummary {
  return {
    overallRating: dto.overall_rating ?? 0,
    ratingsReceived: dto.ratings_received ?? 0,
    ratingsReceivedDelta: dto.ratings_received_delta_pct ?? 0,
    reviewRateOfOrders: dto.review_rate_of_orders ?? 0,
    goodRatingRate: dto.good_rating_rate ?? 0,
    goodRatingDelta: dto.good_rating_delta_pct ?? 0,
    unresolvedBadRatings: dto.unresolved_bad_ratings ?? 0,
    newRatingsReceived: dto.new_ratings_received ?? 0,
    starCounts: {
      1: dto.by_star?.['1'] ?? 0,
      2: dto.by_star?.['2'] ?? 0,
      3: dto.by_star?.['3'] ?? 0,
      4: dto.by_star?.['4'] ?? 0,
      5: dto.by_star?.['5'] ?? 0,
    },
    total: dto.total ?? 0,
    toReply: dto.to_reply ?? 0,
    replied: dto.replied ?? 0,
  }
}

// ✅ LIVE — uses /sellers/me/reviews/manage (rich endpoint). Server-side
// tab/stars/search/date filtering via query params. Client-side fallback for
// any params the backend ignores.
export async function getReviews(query: ReviewListQuery): Promise<ReviewListResponse> {
  const lang = currentLang()
  const { data } = await apiClient.get<BackendManageResponse>(PATHS.reviewsManage, {
    params: {
      tab: query.tab,
      stars: query.stars?.join(','),
      search: query.search,
      from: query.from,
      to: query.to,
      limit: query.limit,
      offset: query.page,
    },
  })
  const reviews = (data.reviews ?? []).map((dto) => mapManageReview(dto, lang))
  const summary = mapManageSummary(data.summary)
  return { reviews, total: data.total ?? reviews.length, summary }
}

// ✅ LIVE — lightweight /sellers/me/reviews for summary-only reads.
function mapLightSummary(dto: BackendLightSummary): ReviewSummary {
  const starCounts = {
    1: dto.by_star?.['1'] ?? 0,
    2: dto.by_star?.['2'] ?? 0,
    3: dto.by_star?.['3'] ?? 0,
    4: dto.by_star?.['4'] ?? 0,
    5: dto.by_star?.['5'] ?? 0,
  }
  const good = starCounts[4] + starCounts[5]
  const bad = starCounts[1] + starCounts[2]
  const goodRatingRate = dto.count > 0 ? Math.round((good / dto.count) * 100) : 0
  return {
    overallRating: dto.avg_rating ?? 0,
    ratingsReceived: dto.count ?? 0,
    ratingsReceivedDelta: 0,
    reviewRateOfOrders: 0,
    goodRatingRate,
    goodRatingDelta: 0,
    unresolvedBadRatings: bad,
    newRatingsReceived: dto.count ?? 0,
    starCounts,
    total: dto.count ?? 0,
    toReply: dto.count ?? 0,
    replied: 0,
  }
}

export async function getRatingsSummary(): Promise<ReviewSummary> {
  const { data } = await apiClient.get<BackendLightReviewsResponse>(PATHS.reviews)
  return mapLightSummary(data.summary)
}

// ✅ LIVE — POST /sellers/me/reviews/:id/reply
export async function submitReviewReply(input: SubmitReplyInput): Promise<{ ok: boolean }> {
  await apiClient.post(PATHS.reviewReply(input.reviewId), {
    reply_text: input.replyText,
  })
  return { ok: true }
}
