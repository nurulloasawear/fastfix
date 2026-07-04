import { apiClient } from '@/lib/axios'
import type { Me, OtpRequestResponse, SellerProfile, VerifyResponse } from '../types/auth.types'

// Verified against ozb-backend (architecture/BE/auth-and-subsystems.md).
const PATHS = {
  request: '/auth/request',
  verify: '/auth/verify',
  me: '/me',
  sellerRegister: '/sellers/register',
  sellerMe: '/sellers/me',
} as const

export async function requestOtp(phone: string): Promise<OtpRequestResponse> {
  const { data } = await apiClient.post<OtpRequestResponse>(PATHS.request, { phone })
  return data
}

export async function verifyOtp(phone: string, code: string): Promise<VerifyResponse> {
  const { data } = await apiClient.post<VerifyResponse>(PATHS.verify, { phone, code })
  return data
}

export async function getMe(): Promise<Me> {
  const { data } = await apiClient.get<Me>(PATHS.me)
  return data
}

export async function registerSeller(shopName: string): Promise<SellerProfile> {
  const { data } = await apiClient.post<SellerProfile>(PATHS.sellerRegister, { shop_name: shopName })
  return data
}

export async function getSellerMe(): Promise<SellerProfile> {
  const { data } = await apiClient.get<SellerProfile>(PATHS.sellerMe)
  return data
}
