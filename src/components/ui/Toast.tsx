import { create } from 'zustand'

// Global toast/notification system (UX-009) — success/error feedback on every
// mutation. Usage: const toast = useToast(); toast.success(t('orders.noteSaved')).

type ToastType = 'success' | 'error' | 'info'
interface ToastItem {
  id: number
  type: ToastType
  message: string
}

interface ToastState {
  toasts: ToastItem[]
  push: (type: ToastType, message: string) => void
  dismiss: (id: number) => void
}

let seq = 0

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (type, message) => {
    const id = ++seq
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }))
    window.setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3500)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

/** Imperative toast API for components. */
export function useToast() {
  const push = useToastStore((s) => s.push)
  return {
    success: (message: string) => push('success', message),
    error: (message: string) => push('error', message),
    info: (message: string) => push('info', message),
  }
}

/** Non-hook toast API — usable in query hooks / non-component code. */
export const toast = {
  success: (message: string) => useToastStore.getState().push('success', message),
  error: (message: string) => useToastStore.getState().push('error', message),
  info: (message: string) => useToastStore.getState().push('info', message),
}

const TONE: Record<ToastType, string> = {
  success: 'bg-success text-white',
  error: 'bg-error text-white',
  info: 'bg-text text-white',
}

/** Mounted once near the app root (providers.tsx). */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismiss(t.id)}
          className={`pointer-events-auto min-w-[240px] max-w-sm rounded-lg px-4 py-3 text-left text-sm font-medium shadow-lg ${TONE[t.type]}`}
        >
          {t.message}
        </button>
      ))}
    </div>
  )
}
