import { QueryClient } from '@tanstack/react-query'

// Server state lives in TanStack Query — never in Zustand or hand-rolled useEffect.
// Tuned for the orders/returns lists (ORD-008): 60s stale keeps tab-switches and
// back-navigation instant; 5min gc retains data across short detours. Mutations
// invalidate explicitly, so a longer stale window is safe.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 300_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
