import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { useCreateDiscount, useUpdateDiscount } from '../api/discounts.queries'
import type { Discount, DiscountInput } from '../types/discounts.types'
import { DiscountForm } from './DiscountForm'

type Props = {
  open: boolean
  editing: Discount | null
  todayStr: string
  onClose: () => void
}

// Create/edit modal. Owns its own mutations; closes on success. The page only
// flips `open`/`editing` in the UI store.
export function DiscountFormModal({ open, editing, todayStr, onClose }: Props) {
  const { t } = useTranslation()
  const create = useCreateDiscount()
  const update = useUpdateDiscount()

  const isPending = create.isPending || update.isPending

  async function submit(input: DiscountInput) {
    if (editing) await update.mutateAsync({ id: editing.id, input })
    else await create.mutateAsync(input)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title={editing ? t('discounts.form.editTitle') : t('discounts.form.createTitle')}
    >
      <DiscountForm
        key={editing?.id ?? 'create'}
        initial={editing}
        todayStr={todayStr}
        isPending={isPending}
        submitLabel={editing ? t('discounts.form.submitEdit') : t('discounts.form.submitCreate')}
        onSubmit={submit}
        onCancel={onClose}
      />
    </Modal>
  )
}
