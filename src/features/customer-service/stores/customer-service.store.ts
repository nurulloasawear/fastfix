import { create } from 'zustand'
import type {
  ChatFilter,
  FaqCategoryFilter,
  ReviewTab,
  TicketStatusFilter,
} from '../types/customer-service.types'

// CLIENT/UI state ONLY across the customer-service pages. Server data (channels,
// messages, tickets, …) lives in TanStack Query. Each page reads the slice it needs.
interface CustomerServiceUiState {
  // Chat
  activeChannelId: string
  chatFilter: ChatFilter
  chatSearch: string
  chatDraft: string
  setActiveChannel: (id: string) => void
  setChatFilter: (filter: ChatFilter) => void
  setChatSearch: (search: string) => void
  setChatDraft: (draft: string) => void

  // Help center
  faqCategory: FaqCategoryFilter
  helpSearch: string
  openFaqId: string | null
  setFaqCategory: (category: FaqCategoryFilter) => void
  setHelpSearch: (search: string) => void
  toggleFaq: (id: string) => void

  // Tickets
  ticketStatus: TicketStatusFilter
  ticketSearch: string
  selectedTicketId: string | null
  setTicketStatus: (status: TicketStatusFilter) => void
  setTicketSearch: (search: string) => void
  selectTicket: (id: string | null) => void

  // Reviews (Shopee spec)
  reviewTab: ReviewTab
  reviewStars: number[]
  reviewSearch: string
  reviewFrom: string
  reviewTo: string
  replyModalReviewId: string | null
  setReviewTab: (tab: ReviewTab) => void
  setReviewStars: (stars: number[]) => void
  setReviewSearch: (search: string) => void
  setReviewFrom: (from: string) => void
  setReviewTo: (to: string) => void
  openReplyModal: (reviewId: string) => void
  closeReplyModal: () => void
}

export const useCustomerServiceUi = create<CustomerServiceUiState>((set) => ({
  activeChannelId: '',
  chatFilter: 'all',
  chatSearch: '',
  chatDraft: '',
  setActiveChannel: (activeChannelId) => set({ activeChannelId }),
  setChatFilter: (chatFilter) => set({ chatFilter }),
  setChatSearch: (chatSearch) => set({ chatSearch }),
  setChatDraft: (chatDraft) => set({ chatDraft }),

  faqCategory: 'all',
  helpSearch: '',
  openFaqId: null,
  setFaqCategory: (faqCategory) => set({ faqCategory }),
  setHelpSearch: (helpSearch) => set({ helpSearch }),
  toggleFaq: (id) => set((s) => ({ openFaqId: s.openFaqId === id ? null : id })),

  ticketStatus: 'all',
  ticketSearch: '',
  selectedTicketId: null,
  setTicketStatus: (ticketStatus) => set({ ticketStatus }),
  setTicketSearch: (ticketSearch) => set({ ticketSearch }),
  selectTicket: (selectedTicketId) => set({ selectedTicketId }),

  // Reviews
  reviewTab: 'all',
  reviewStars: [],
  reviewSearch: '',
  reviewFrom: '',
  reviewTo: '',
  replyModalReviewId: null,
  setReviewTab: (reviewTab) => set({ reviewTab }),
  setReviewStars: (reviewStars) => set({ reviewStars }),
  setReviewSearch: (reviewSearch) => set({ reviewSearch }),
  setReviewFrom: (reviewFrom) => set({ reviewFrom }),
  setReviewTo: (reviewTo) => set({ reviewTo }),
  openReplyModal: (replyModalReviewId) => set({ replyModalReviewId }),
  closeReplyModal: () => set({ replyModalReviewId: null }),
}))
