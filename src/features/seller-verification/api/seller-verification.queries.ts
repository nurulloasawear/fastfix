import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  SaveBankAccountPayload,
  SaveCompanyPayload,
  UpdateProfilePayload,
  UploadCertificatePayload,
} from '../types/seller-verification.types'
import { PASSPORT_STATUS_POLL_INTERVAL } from '../lib/constants'
import {
  deleteCertificate,
  getBankAccount,
  getCertificates,
  getCompany,
  getEmailVerification,
  getInnVerification,
  getPassportVerification,
  getSellerProfile,
  getSellerStatus,
  saveBankAccount,
  saveCompany,
  sendEmailOtp,
  startPassportVerification,
  updateSellerProfile,
  uploadCertificate,
  verifyEmailOtp,
  verifyInn,
} from './seller-verification.api'

export const sellerVerificationKeys = {
  all: ['seller-verification'] as const,
  status: () => [...sellerVerificationKeys.all, 'status'] as const,
  profile: () => [...sellerVerificationKeys.all, 'profile'] as const,
  email: () => [...sellerVerificationKeys.all, 'email'] as const,
  passport: () => [...sellerVerificationKeys.all, 'passport'] as const,
  inn: () => [...sellerVerificationKeys.all, 'inn'] as const,
  bank: () => [...sellerVerificationKeys.all, 'bank'] as const,
  company: () => [...sellerVerificationKeys.all, 'company'] as const,
  certificates: () => [...sellerVerificationKeys.all, 'certificates'] as const,
}

/** Invalidate the wizard status after any successful step mutation — the
 *  backend advances current_step server-side. */
function useInvalidateStatus() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: sellerVerificationKeys.status() })
}

export function useSellerStatus() {
  return useQuery({ queryKey: sellerVerificationKeys.status(), queryFn: getSellerStatus })
}

export function useSellerProfile() {
  return useQuery({ queryKey: sellerVerificationKeys.profile(), queryFn: getSellerProfile })
}

export function useUpdateSellerProfile() {
  const queryClient = useQueryClient()
  const invalidateStatus = useInvalidateStatus()
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateSellerProfile(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(sellerVerificationKeys.profile(), profile)
      invalidateStatus()
    },
  })
}

export function useEmailVerification() {
  return useQuery({ queryKey: sellerVerificationKeys.email(), queryFn: getEmailVerification })
}

export function useSendEmailOtp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (email: string) => sendEmailOtp(email),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: sellerVerificationKeys.email() }),
  })
}

export function useVerifyEmailOtp() {
  const queryClient = useQueryClient()
  const invalidateStatus = useInvalidateStatus()
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => verifyEmailOtp(email, code),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sellerVerificationKeys.email() })
      invalidateStatus()
    },
  })
}

export function usePassportVerification() {
  return useQuery({
    queryKey: sellerVerificationKeys.passport(),
    queryFn: getPassportVerification,
    // MyID reviews out-of-band; poll only while a review is actually running.
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'pending' || status === 'processing'
        ? PASSPORT_STATUS_POLL_INTERVAL
        : false
    },
  })
}

export function useStartPassportVerification() {
  const queryClient = useQueryClient()
  const invalidateStatus = useInvalidateStatus()
  return useMutation({
    mutationFn: (passportNumber: string) => startPassportVerification(passportNumber),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sellerVerificationKeys.passport() })
      invalidateStatus()
    },
  })
}

export function useInnVerification() {
  return useQuery({ queryKey: sellerVerificationKeys.inn(), queryFn: getInnVerification })
}

export function useVerifyInn() {
  const queryClient = useQueryClient()
  const invalidateStatus = useInvalidateStatus()
  return useMutation({
    mutationFn: (inn: string) => verifyInn(inn),
    onSuccess: (result) => {
      queryClient.setQueryData(sellerVerificationKeys.inn(), result)
      invalidateStatus()
    },
  })
}

export function useBankAccount() {
  return useQuery({ queryKey: sellerVerificationKeys.bank(), queryFn: getBankAccount })
}

export function useSaveBankAccount() {
  const queryClient = useQueryClient()
  const invalidateStatus = useInvalidateStatus()
  return useMutation({
    mutationFn: (payload: SaveBankAccountPayload) => saveBankAccount(payload),
    onSuccess: (account) => {
      queryClient.setQueryData(sellerVerificationKeys.bank(), account)
      invalidateStatus()
    },
  })
}

export function useCompany() {
  return useQuery({ queryKey: sellerVerificationKeys.company(), queryFn: getCompany })
}

export function useSaveCompany() {
  const queryClient = useQueryClient()
  const invalidateStatus = useInvalidateStatus()
  return useMutation({
    mutationFn: (payload: SaveCompanyPayload) => saveCompany(payload),
    onSuccess: (company) => {
      queryClient.setQueryData(sellerVerificationKeys.company(), company)
      invalidateStatus()
    },
  })
}

export function useCertificates() {
  return useQuery({ queryKey: sellerVerificationKeys.certificates(), queryFn: getCertificates })
}

export function useUploadCertificate() {
  const queryClient = useQueryClient()
  const invalidateStatus = useInvalidateStatus()
  return useMutation({
    mutationFn: (payload: UploadCertificatePayload) => uploadCertificate(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sellerVerificationKeys.certificates() })
      invalidateStatus()
    },
  })
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCertificate(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: sellerVerificationKeys.certificates() }),
  })
}
