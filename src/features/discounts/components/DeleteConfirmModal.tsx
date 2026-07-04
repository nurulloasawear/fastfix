import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { AlertTriangle } from './icons'

type Props = {
  open: boolean
  isPending: boolean
  onCancel: () => void
  onConfirm: () => void
}

// Destructive-confirm dialog for deleting a promo code.
export function DeleteConfirmModal({ open, isPending, onCancel, onConfirm }: Props) {
  const { t } = useTranslation()

  return (
    <Modal
      open={open}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onCancel} className="flex-1">
            {t('discounts.confirm.cancel')}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending} className="flex-1">
            {isPending ? t('discounts.confirm.deleting') : t('discounts.confirm.confirm')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-error-bg text-error-text">
          <AlertTriangle size={20} />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-text">{t('discounts.confirm.title')}</h3>
          <p className="text-sm text-muted">{t('discounts.confirm.desc')}</p>
        </div>
      </div>
    </Modal>
  )
}
