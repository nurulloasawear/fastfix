// Inline popup + banner components extracted from MyProductsPage to keep it <=200 lines.
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { X } from '@/features/products'

// ── AI Optimiser popup (one-time, MVP = Coming Soon) ─────────────────────────
export function AiOptimiserPopup({ onDismiss }: { onDismiss: () => void }) {
  const { t } = useTranslation()
  return (
    <Modal
      open
      onClose={onDismiss}
      title={t('products.aiPopup.title')}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onDismiss}>{t('products.aiPopup.skip')}</Button>
          <Link to="/products/ai-optimiser">
            <Button size="sm">{t('products.aiPopup.tryNow')}</Button>
          </Link>
        </>
      }
    >
      <p className="mb-4 text-sm text-muted">{t('products.aiPopup.subtitle')}</p>
      <div className="grid grid-cols-2 gap-3">
        {[t('products.aiPopup.imagePolish'), t('products.aiPopup.descHelper')].map((label) => (
          <div key={label} className="rounded-lg border border-border bg-bg p-3 text-center text-xs font-semibold text-text-secondary">
            {label}
          </div>
        ))}
      </div>
    </Modal>
  )
}

// ── Payment banner ────────────────────────────────────────────────────────────
export function PaymentBanner({ onDismiss }: { onDismiss: () => void }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between rounded-lg bg-warning-bg px-4 py-3 text-sm font-semibold text-warning">
      <span>{t('products.paymentBanner')}</span>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          {t('products.enablePayment')}
        </Button>
        <button type="button" onClick={onDismiss} className="text-warning hover:opacity-70 transition-opacity">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

// ── Under-review info banner ──────────────────────────────────────────────────
export function ReviewBanner({ onDismiss }: { onDismiss: () => void }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-start justify-between rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-secondary">
      <span>{t('products.reviewBanner')}</span>
      <button type="button" onClick={onDismiss} className="ml-3 text-muted hover:text-text transition-colors">
        <X size={16} />
      </button>
    </div>
  )
}
