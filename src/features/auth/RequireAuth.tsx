import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from './useAuth'

// Gate for the whole app shell: must be logged in AND an approved seller.
export function RequireAuth({ children }: { children: ReactNode }) {
  const { token, isAuthed, loading, seller } = useAuth()

  if (!token) return <Navigate to="/login" replace />
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <Spinner />
      </div>
    )
  }
  if (!isAuthed) return <Navigate to="/login" replace />
  if (!seller || seller.status !== 'approved') return <Navigate to="/onboarding" replace />
  return <>{children}</>
}
