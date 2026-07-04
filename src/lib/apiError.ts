// Backend error bodies are { "error": "<stable_code>" } (see docs/error-codes.md in ozb-backend).
// Normalize any failure into an ApiError carrying that stable code + HTTP status, so the UI can
// localize it via tError(code) — mirrors ozb-mobileʻs ApiError contract.
export class ApiError extends Error {
  code: string
  status: number

  constructor(code: string, status: number) {
    super(code)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

export function toApiError(error: unknown): ApiError {
  const e = error as { response?: { status?: number; data?: { error?: string } } }
  const status = e?.response?.status ?? 0
  const code = e?.response?.data?.error ?? (status === 0 ? 'network_error' : 'internal_error')
  return new ApiError(code, status)
}
