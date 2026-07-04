// Stable, structured query keys — shared by shop.queries.ts and shop.queries.ext.ts.
import type { AppealsQuery } from '../types/shop.types'

export const shopKeys = {
  all: ['shop'] as const,
  profile: () => [...shopKeys.all, 'profile'] as const,
  reviews: () => [...shopKeys.all, 'reviews'] as const,
  decoration: () => [...shopKeys.all, 'decoration'] as const,
  decorationDrafts: (platform: string) => [...shopKeys.all, 'decoration-drafts', platform] as const,
  decorationContent: (id: string) => [...shopKeys.all, 'decoration-content', id] as const,
  categories: () => [...shopKeys.all, 'categories'] as const,
  media: () => [...shopKeys.all, 'media'] as const,
  reports: () => [...shopKeys.all, 'reports'] as const,
  shopInfo: () => [...shopKeys.all, 'shop-info'] as const,
  shopKyc: () => [...shopKeys.all, 'shop-kyc'] as const,
  topPicks: () => [...shopKeys.all, 'top-picks'] as const,
  topPicksDetail: (id: string) => [...shopKeys.all, 'top-picks', id] as const,
  appeals: (q: AppealsQuery) => [...shopKeys.all, 'appeals', q] as const,
  missions: () => [...shopKeys.all, 'missions'] as const,
  rewards: () => [...shopKeys.all, 'rewards'] as const,
}
