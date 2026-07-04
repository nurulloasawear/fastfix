import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getChatAssistant,
  getChatChannels,
  getChatMessages,
  getChatMetrics,
  getFaqAssistant,
  getFaqDashboard,
  getAutoReplies,
  getHelpCenter,
  getReviews,
  getRatingsSummary,
  getShortcutsList,
  getTickets,
  patchAutoReply,
  resolveTicket,
  sendChatMessage,
  submitReviewReply,
} from './customer-service.api'
import type {
  AutoReply,
  ReviewListQuery,
  SendChatMessageInput,
  SubmitReplyInput,
  TicketListQuery,
} from '../types/customer-service.types'

// Stable, structured query keys → cache, dedupe, and invalidation just work.
export const customerServiceKeys = {
  all: ['customer-service'] as const,
  channels: () => [...customerServiceKeys.all, 'channels'] as const,
  messages: (channelId: string) =>
    [...customerServiceKeys.all, 'messages', channelId] as const,
  helpCenter: () => [...customerServiceKeys.all, 'help-center'] as const,
  ticketLists: () => [...customerServiceKeys.all, 'tickets'] as const,
  ticketList: (query: TicketListQuery) =>
    [...customerServiceKeys.ticketLists(), query] as const,
  chatAssistant: () => [...customerServiceKeys.all, 'chat-assistant'] as const,
  faqAssistant: () => [...customerServiceKeys.all, 'faq-assistant'] as const,
  chatMetrics: () => [...customerServiceKeys.all, 'chat-metrics'] as const,
  autoReplies: () => [...customerServiceKeys.all, 'auto-replies'] as const,
  shortcuts: () => [...customerServiceKeys.all, 'shortcuts'] as const,
  faqDashboard: (from?: string, to?: string) =>
    [...customerServiceKeys.all, 'faq-dashboard', from, to] as const,
  reviews: (query: ReviewListQuery) =>
    [...customerServiceKeys.all, 'reviews', query] as const,
  ratingsSummary: () => [...customerServiceKeys.all, 'ratings-summary'] as const,
}

export function useChatChannels() {
  return useQuery({
    queryKey: customerServiceKeys.channels(),
    queryFn: () => getChatChannels(),
  })
}

export function useChatMessages(channelId: string) {
  return useQuery({
    queryKey: customerServiceKeys.messages(channelId),
    queryFn: () => getChatMessages(channelId),
    enabled: Boolean(channelId),
  })
}

export function useSendChatMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SendChatMessageInput) => sendChatMessage(input),
    onSuccess: (_message, input) => {
      void queryClient.invalidateQueries({
        queryKey: customerServiceKeys.messages(input.channelId),
      })
      void queryClient.invalidateQueries({ queryKey: customerServiceKeys.channels() })
    },
  })
}

export function useHelpCenter() {
  return useQuery({
    queryKey: customerServiceKeys.helpCenter(),
    queryFn: () => getHelpCenter(),
  })
}

export function useTickets(query: TicketListQuery) {
  return useQuery({
    queryKey: customerServiceKeys.ticketList(query),
    queryFn: () => getTickets(query),
  })
}

export function useResolveTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => resolveTicket(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerServiceKeys.ticketLists() })
    },
  })
}

export function useChatAssistant() {
  return useQuery({
    queryKey: customerServiceKeys.chatAssistant(),
    queryFn: () => getChatAssistant(),
  })
}

export function useFaqAssistant() {
  return useQuery({
    queryKey: customerServiceKeys.faqAssistant(),
    queryFn: () => getFaqAssistant(),
  })
}

// ── Shopee-spec hooks ─────────────────────────────────────────────────────────

export function useChatMetrics() {
  return useQuery({
    queryKey: customerServiceKeys.chatMetrics(),
    queryFn: () => getChatMetrics(),
  })
}

export function useAutoReplies() {
  return useQuery({
    queryKey: customerServiceKeys.autoReplies(),
    queryFn: () => getAutoReplies(),
  })
}

export function usePatchAutoReply() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      type,
      payload,
    }: {
      type: string
      payload: Partial<Pick<AutoReply, 'enabled' | 'message'>>
    }) => patchAutoReply(type, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerServiceKeys.autoReplies() })
    },
  })
}

export function useShortcuts() {
  return useQuery({
    queryKey: customerServiceKeys.shortcuts(),
    queryFn: () => getShortcutsList(),
  })
}

export function useFaqDashboard(from?: string, to?: string) {
  return useQuery({
    queryKey: customerServiceKeys.faqDashboard(from, to),
    queryFn: () => getFaqDashboard(from, to),
  })
}

export function useReviews(query: ReviewListQuery) {
  return useQuery({
    queryKey: customerServiceKeys.reviews(query),
    queryFn: () => getReviews(query),
  })
}

export function useRatingsSummary() {
  return useQuery({
    queryKey: customerServiceKeys.ratingsSummary(),
    queryFn: () => getRatingsSummary(),
  })
}

export function useSubmitReviewReply() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SubmitReplyInput) => submitReviewReply(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...customerServiceKeys.all, 'reviews'] })
      void queryClient.invalidateQueries({ queryKey: customerServiceKeys.ratingsSummary() })
    },
  })
}
