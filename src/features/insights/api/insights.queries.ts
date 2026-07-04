import { useQuery } from '@tanstack/react-query'
import {
  getChatOverview,
  getMarketingDiscount,
  getMarketingExternalTraffic,
  getMarketingLivestream,
  getMarketingShippingPromo,
  getMarketingStreamDeal,
  getMarketingVoucher,
  getOverview,
  getProductDiagnosis,
  getProductOverview,
  getProductPerformance,
  getProductTraffic,
  getSalesComposition,
  getSalesOverview,
  getTrafficOverview,
} from './insights.api'

export const insightsKeys = {
  all: ['insights'] as const,
  overview: () => [...insightsKeys.all, 'overview'] as const,
  productOverview: () => [...insightsKeys.all, 'product', 'overview'] as const,
  productTraffic: () => [...insightsKeys.all, 'product', 'traffic'] as const,
  productPerformance: () => [...insightsKeys.all, 'product', 'performance'] as const,
  productDiagnosis: (date: string) => [...insightsKeys.all, 'product', 'diagnosis', date] as const,
  salesOverview: () => [...insightsKeys.all, 'sales', 'overview'] as const,
  salesComposition: () => [...insightsKeys.all, 'sales', 'composition'] as const,
  chat: () => [...insightsKeys.all, 'services', 'chat'] as const,
  traffic: () => [...insightsKeys.all, 'traffic'] as const,
  marketingDiscount: () => [...insightsKeys.all, 'marketing', 'discount'] as const,
  marketingVoucher: () => [...insightsKeys.all, 'marketing', 'voucher'] as const,
  marketingShippingPromo: () => [...insightsKeys.all, 'marketing', 'shipping-promo'] as const,
  marketingLivestream: () => [...insightsKeys.all, 'marketing', 'livestream'] as const,
  marketingStreamDeal: () => [...insightsKeys.all, 'marketing', 'stream-deal'] as const,
  marketingExternalTraffic: () => [...insightsKeys.all, 'marketing', 'external-traffic'] as const,
}

export function useInsightsOverview() {
  return useQuery({ queryKey: insightsKeys.overview(), queryFn: getOverview })
}

export function useProductOverview() {
  return useQuery({ queryKey: insightsKeys.productOverview(), queryFn: getProductOverview })
}

export function useProductTraffic() {
  return useQuery({ queryKey: insightsKeys.productTraffic(), queryFn: getProductTraffic })
}

export function useProductPerformance() {
  return useQuery({ queryKey: insightsKeys.productPerformance(), queryFn: getProductPerformance })
}

export function useProductDiagnosis(date: string) {
  return useQuery({
    queryKey: insightsKeys.productDiagnosis(date),
    queryFn: () => getProductDiagnosis(date),
    enabled: Boolean(date),
  })
}

export function useSalesOverview() {
  return useQuery({ queryKey: insightsKeys.salesOverview(), queryFn: getSalesOverview })
}

export function useSalesComposition() {
  return useQuery({ queryKey: insightsKeys.salesComposition(), queryFn: getSalesComposition })
}

export function useChatOverview() {
  return useQuery({ queryKey: insightsKeys.chat(), queryFn: getChatOverview })
}

export function useTrafficOverview() {
  return useQuery({ queryKey: insightsKeys.traffic(), queryFn: getTrafficOverview })
}

export function useMarketingDiscount() {
  return useQuery({ queryKey: insightsKeys.marketingDiscount(), queryFn: getMarketingDiscount })
}

export function useMarketingVoucher() {
  return useQuery({ queryKey: insightsKeys.marketingVoucher(), queryFn: getMarketingVoucher })
}

export function useMarketingShippingPromo() {
  return useQuery({
    queryKey: insightsKeys.marketingShippingPromo(),
    queryFn: getMarketingShippingPromo,
  })
}

export function useMarketingLivestream() {
  return useQuery({
    queryKey: insightsKeys.marketingLivestream(),
    queryFn: getMarketingLivestream,
  })
}

export function useMarketingStreamDeal() {
  return useQuery({
    queryKey: insightsKeys.marketingStreamDeal(),
    queryFn: getMarketingStreamDeal,
  })
}

export function useMarketingExternalTraffic() {
  return useQuery({
    queryKey: insightsKeys.marketingExternalTraffic(),
    queryFn: getMarketingExternalTraffic,
  })
}
