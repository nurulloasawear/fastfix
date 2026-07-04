// Single source of truth for API paths. Relative to env.apiBaseUrl (set in axios).
export const ENDPOINTS = {
  products: {
    list: '/seller/products',
    detail: (id: string) => `/seller/products/${id}`,
    boost: (id: string) => `/seller/products/${id}/boost`,
  },
} as const
