// Modals used in the Decoration Editor: hyperlink discovery modal.
// The preview popup is now handled via kit <Modal> directly in DecorationEditorCanvas.
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

// ── Hyperlink discovery modal ─────────────────────────────────────────────────

export function HyperlinkModal({ onDismiss }: { onDismiss: () => void }) {
  const { t } = useTranslation()
  return (
    <Modal
      open
      onClose={onDismiss}
      size="md"
      footer={
        <Button onClick={onDismiss}>{t('shop.decoration.hyperlinkGotIt')}</Button>
      }
    >
      <div className="grid grid-cols-2 gap-6 py-2">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-warning-bg">
            <HyperlinkIllo />
          </div>
          <p className="text-sm font-semibold text-text">{t('shop.decoration.hyperlinkModal')}</p>
          <p className="text-xs text-muted">
            Browse products, categories, pages and more.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success-bg">
            <ComponentIllo />
          </div>
          <p className="text-sm font-semibold text-text">Components more flexible</p>
          <p className="text-xs text-muted">
            Configure components as you see fit, check them out in your editor.
          </p>
        </div>
      </div>
    </Modal>
  )
}

// ── Inline SVG illustrations ───────────────────────────────────────────────────

function HyperlinkIllo() {
  return (
    <svg viewBox="0 0 32 32" className="h-10 w-10" fill="none" aria-hidden="true">
      <rect x="4" y="8" width="24" height="16" rx="3" fill="#ff7043" />
      <path d="M10 16h12M16 10v12" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ComponentIllo() {
  return (
    <svg viewBox="0 0 32 32" className="h-10 w-10" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="10" height="10" rx="2" fill="#42a5f5" />
      <rect x="18" y="4" width="10" height="10" rx="2" fill="#42a5f5" />
      <rect x="4" y="18" width="10" height="10" rx="2" fill="#42a5f5" />
      <rect x="18" y="18" width="10" height="10" rx="2" fill="#42a5f5" />
    </svg>
  )
}
