import axios from 'axios'
import { env } from '@/config/env'
import { toApiError } from './apiError'
import { getAuthToken, clearAuthToken } from './authToken'

// One axios instance for the whole app. Auth, language, and 401 handled here.
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  // Backend localizes SMS/content via Accept-Language (uz default / ru / en).
  config.headers['Accept-Language'] = localStorage.getItem('ozb_seller_lang') ?? 'uz'
  // File uploads: drop the instance-default application/json so the browser sets
  // multipart/form-data WITH the boundary (else the server can't parse the form →
  // 400 invalid_upload). Affects mass-upload + AI-import xlsx posts.
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    config.headers.delete('Content-Type')
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error)
    // Expired/invalid JWT → drop the token; the auth guard then routes to /login.
    if (apiError.status === 401) clearAuthToken()
    // Always reject with a typed ApiError carrying the backendʻs stable code.
    return Promise.reject(apiError)
  },
)
