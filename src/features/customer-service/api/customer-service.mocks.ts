// [PENDING BACKEND] — MSW handlers. Consistent derived data; never lies.
import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import type {
  AutoReply,
  ChatMessage,
  FaqDashboardResponse,
  Ticket,
  TicketStatus,
  TicketStatusFilter,
  TicketSummary,
  ChatMetricsResponse,
} from '../types/customer-service.types'
import {
  CHANNELS,
  CHAT_ASSISTANT,
  FAQ_ASSISTANT,
  FAQS,
  HELP_GUIDES,
  MESSAGES,
  TICKETS,
  AUTO_REPLIES,
  SHORTCUTS_DATA,
  BACKEND_REVIEWS,
} from './customer-service.fixtures'

const BASE = `${env.apiBaseUrl}/seller/customer-service`
const BASE_API = env.apiBaseUrl

function ticketSummary(items: Ticket[]): TicketSummary {
  const count = (s: TicketStatus) => items.filter((t) => t.status === s).length
  return {
    all: items.length,
    open: count('open'),
    pending: count('pending'),
    resolved: count('resolved'),
  }
}

export const customerServiceHandlers = [
  // ── Existing chat channels ────────────────────────────────────────────────
  http.get(`${BASE}/chat/channels`, () =>
    HttpResponse.json({ channels: CHANNELS, total: CHANNELS.length }),
  ),

  http.get(`${BASE}/chat/channels/:channelId/messages`, ({ params }) => {
    const channelId = String(params.channelId)
    return HttpResponse.json({ messages: MESSAGES[channelId] ?? [] })
  }),

  http.post(`${BASE}/chat/channels/:channelId/messages`, async ({ params, request }) => {
    const channelId = String(params.channelId)
    const body = (await request.json()) as { text?: string }
    const message: ChatMessage = {
      id: `m-${Date.now()}`,
      channelId,
      sender: 'seller',
      text: (body.text ?? '').trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    return HttpResponse.json(message, { status: 201 })
  }),

  http.get(`${BASE}/help-center`, () =>
    HttpResponse.json({ guides: HELP_GUIDES, faqs: FAQS }),
  ),

  http.get(`${BASE}/tickets`, ({ request }) => {
    const url = new URL(request.url)
    const status = (url.searchParams.get('status') ?? 'all') as TicketStatusFilter
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase()

    let items = TICKETS
    if (status !== 'all') items = items.filter((tkt) => tkt.status === status)
    if (search) {
      items = items.filter(
        (tkt) =>
          tkt.ref.toLowerCase().includes(search) ||
          tkt.customerName.toLowerCase().includes(search) ||
          tkt.subject.toLowerCase().includes(search),
      )
    }

    return HttpResponse.json({
      tickets: items,
      total: items.length,
      summary: ticketSummary(TICKETS),
    })
  }),

  http.post(`${BASE}/tickets/:id/resolve`, ({ params }) =>
    HttpResponse.json({ id: String(params.id) }),
  ),

  http.get(`${BASE}/chat-assistant`, () => HttpResponse.json(CHAT_ASSISTANT)),
  http.get(`${BASE}/faq-assistant`, () => HttpResponse.json(FAQ_ASSISTANT)),

  // ── Shopee-spec: Chat Management KPIs ────────────────────────────────────
  http.get(`${BASE_API}/seller/chat/metrics`, () => {
    const body: ChatMetricsResponse = {
      metrics: {
        enquiryCount: 0,
        responseRate: null,
        avgResponseTimeSeconds: 0,
        enquiryDeltaPct: 0,
        responseDeltaPct: null,
        responseDeltaSeconds: 0,
      },
      periodStart: '17/05/2026',
      periodEnd: '16/06/2026',
    }
    return HttpResponse.json(body)
  }),

  // ── Shopee-spec: Auto-replies ─────────────────────────────────────────────
  http.get(`${BASE_API}/seller/chat/auto-replies`, () =>
    HttpResponse.json(AUTO_REPLIES),
  ),

  http.patch(`${BASE_API}/seller/chat/auto-replies/:type`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<AutoReply>
    const existing = AUTO_REPLIES.find((r) => r.kind === params.type) ?? AUTO_REPLIES[0]
    return HttpResponse.json({ ...existing, ...body })
  }),

  // ── Shopee-spec: Shortcuts ────────────────────────────────────────────────
  http.get(`${BASE_API}/seller/shortcuts`, () =>
    HttpResponse.json(SHORTCUTS_DATA),
  ),

  http.post(`${BASE_API}/seller/shortcuts`, async ({ request }) => {
    const body = (await request.json()) as { keyword: string; messageText: string; groupId: string }
    return HttpResponse.json(
      { id: `sc-${Date.now()}`, sortOrder: 99, ...body },
      { status: 201 },
    )
  }),

  // ── Shopee-spec: FAQ dashboard ────────────────────────────────────────────
  http.get(`${BASE_API}/seller/faq/metrics`, () => {
    const body: FaqDashboardResponse = {
      date: '15-06-2026',
      timezone: 'GMT+05',
      overview: {
        faqTriggered: 0,
        faqClicked: 0,
        questionResolved: 0,
        liveAgentTransferred: 0,
        helpfulClicks: 0,
        unhelpfulClicks: 0,
        triggeredDeltaPct: 0,
        clickedDeltaPct: 0,
        resolvedDeltaPct: 0,
        transferredDeltaPct: 0,
        helpfulDeltaPct: 0,
        unhelpfulDeltaPct: 0,
      },
      questions: [],
    }
    return HttpResponse.json(body)
  }),

  // ── ✅ Reviews: real route GET /sellers/me/reviews ────────────────────────
  // Backend-shaped response (snake_case, {uz,ru,en} title, integer rating,
  // summary{count, avg_rating, by_star}) so MSW mirrors prod exactly. Honours
  // limit/offset; the client applies tab/stars/search filters after fetch.
  http.get(`${BASE_API}/sellers/me/reviews`, ({ request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get('limit')) || BACKEND_REVIEWS.length
    const offset = Number(url.searchParams.get('offset')) || 0

    const page = BACKEND_REVIEWS.slice(offset, offset + limit)

    // Summary is DERIVED from the FULL set (counts never lie), not the page.
    const byStar = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 } as Record<
      '1' | '2' | '3' | '4' | '5',
      number
    >
    let ratingSum = 0
    for (const r of BACKEND_REVIEWS) {
      const star = Math.max(1, Math.min(5, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5
      byStar[String(star) as '1' | '2' | '3' | '4' | '5'] += 1
      ratingSum += star
    }
    const count = BACKEND_REVIEWS.length
    const avgRating = count > 0 ? Math.round((ratingSum / count) * 10) / 10 : 0

    return HttpResponse.json({
      reviews: page,
      summary: { count, avg_rating: avgRating, by_star: byStar },
    })
  }),

  // ── [PENDING BACKEND]: seller reply to a review — no backend route yet. ───
  http.post(`${BASE_API}/seller/reviews/:id/reply`, async ({ params, request }) => {
    const body = (await request.json()) as { reply_text: string }
    if (!body.reply_text) {
      return HttpResponse.json({ error: 'reply_text required' }, { status: 422 })
    }
    return HttpResponse.json({ ok: true, reviewId: params.id }, { status: 201 })
  }),
]
