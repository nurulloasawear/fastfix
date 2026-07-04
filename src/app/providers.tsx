import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { Toaster } from '@/components/ui/Toast'
import { OfflineBanner } from '@/components/ui/OfflineBanner'
import '@/i18n' // initialise i18next (side effect)

// All app-wide providers in ONE place. Add Auth/Theme here as they land.
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <OfflineBanner />
      {children}
      <Toaster />
    </QueryClientProvider>
  )
}
