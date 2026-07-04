export type SellerStatus = 'pending' | 'approved' | 'suspended'

export interface SellerProfile {
  id: string
  shop_name: string
  status: SellerStatus
}

// GET /me (backend shape — snake_case).
export interface Me {
  id: string
  phone: string
  full_name?: string
  username?: string
  avatar_url?: string
  language?: string
  is_admin?: boolean
  modes?: string[]
  seller?: SellerProfile | null
  created_at?: string
}

export interface OtpRequestResponse {
  sent: boolean
  expires_in: number
}

export interface VerifyResponse {
  token: string
  user_id: string
}
