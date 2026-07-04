import { create } from 'zustand'

// Auth token = cross-cutting infra (read by axios, watched by the auth feature).
// Persisted to localStorage so it survives reloads; the store makes it reactive.
const KEY = 'ozb_seller_token'

interface TokenState {
  token: string | null
  _set: (t: string | null) => void
}

const useStore = create<TokenState>((set) => ({
  token: localStorage.getItem(KEY),
  _set: (t) => set({ token: t }),
}))

/** Reactive hook — re-renders when the token changes. */
export const useAuthToken = () => useStore((s) => s.token)

/** Non-reactive read (for axios request interceptor). */
export function getAuthToken(): string | null {
  return useStore.getState().token
}

export function setAuthToken(token: string): void {
  localStorage.setItem(KEY, token)
  useStore.getState()._set(token)
}

export function clearAuthToken(): void {
  localStorage.removeItem(KEY)
  useStore.getState()._set(null)
}
