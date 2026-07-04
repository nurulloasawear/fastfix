import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { setAuthToken } from '@/lib/authToken'
import { getMe, registerSeller, requestOtp, verifyOtp } from './auth.api'

export const authKeys = { me: ['me'] as const }

export function useMe(enabled: boolean) {
  return useQuery({ queryKey: authKeys.me, queryFn: getMe, enabled, retry: false, staleTime: 60_000 })
}

export function useRequestOtp() {
  return useMutation({ mutationFn: (phone: string) => requestOtp(phone) })
}

export function useVerifyOtp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) => verifyOtp(phone, code),
    onSuccess: (res) => {
      setAuthToken(res.token)
      void qc.invalidateQueries({ queryKey: authKeys.me })
    },
  })
}

export function useRegisterSeller() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (shopName: string) => registerSeller(shopName),
    onSuccess: () => qc.invalidateQueries({ queryKey: authKeys.me }),
  })
}
