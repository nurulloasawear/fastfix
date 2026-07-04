import type { ReactNode } from 'react'

// Centered modal with overlay. Click outside or ✕ closes.
type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
const SIZES: Record<Size, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-5xl',
  '2xl': 'max-w-6xl',
}

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  size?: Size
}

export function Modal({ open, onClose, title, children, footer, size = 'md' }: Props) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`w-full ${SIZES[size]} overflow-hidden rounded-xl bg-surface shadow-lg`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-text">{title}</h2>
            <button type="button" onClick={onClose} className="text-muted transition-colors hover:text-text" aria-label="Close">
              ✕
            </button>
          </div>
        )}
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-border px-5 py-4">{footer}</div>}
      </div>
    </div>
  )
}
