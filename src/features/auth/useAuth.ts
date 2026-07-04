import { useQueryClient } from '@tanstack/react-query'
import { useAuthToken, clearAuthToken } from '@/lib/authToken'
import { useMe } from './api/auth.queries'

// Single source of truth for "who am I + can I use the portal".
export function useAuth() {
  const token = useAuthToken()
  const qc = useQueryClient()
  const me = useMe(!!token)
  const user = me.data

  function logout() {
    clearAuthToken()
    qc.clear()
  }

  return {
    token,
    user,
    seller: user?.seller ?? null,
    loading: !!token && me.isLoading,
    isAuthed: !!token && !!user,
    isApprovedSeller: user?.seller?.status === 'approved',
    logout,
  }
}
