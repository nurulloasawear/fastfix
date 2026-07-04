import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@/components/ui/Spinner'
import { toast } from '@/components/ui/Toast'
import { X } from '@/features/products/components/icons'
import {
  ProductForm, useProductDetail, useUpdateProduct, useDecideAIImportItem,
  type ProductFormData,
} from '@/features/products'

// Full product editor in a modal, opened from a review row. Loads the product, renders
// the same ProductForm used by the edit page (images, video, names, category, description,
// GTIN, specs, sales info, shipping…). Its two actions map to the review decisions:
//   Publish     → save edits + approve (publish live)
//   Save (draft)→ save edits + move to Drafts
// updateProduct sends no `publish`, so saving keeps the item in review until decided.
export function FullEditorModal({ id, jobId, onClose }: { id: string; jobId: string; onClose: () => void }) {
  const { t } = useTranslation()
  const { data, isLoading } = useProductDetail(id)
  const update = useUpdateProduct(id)
  const decide = useDecideAIImportItem(jobId)

  async function onPublish(form: ProductFormData) {
    await update.mutateAsync(form)
    await decide.mutateAsync({ id, decision: 'approve' })
    toast.success(t('products.review.toast.approve'))
    onClose()
  }
  async function onSaveDelist(form: ProductFormData) {
    await update.mutateAsync(form)
    await decide.mutateAsync({ id, decision: 'draft' })
    toast.success(t('products.review.toast.draft'))
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4" role="dialog" aria-modal="true">
      {/* flex column: fixed header, internal-scroll body (so the form's sticky nav/footer
          stay put and opaque), fixed by the panel's own bounds. */}
      <div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-bg shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-base font-semibold text-text">{t('products.review.editTitle')}</h2>
          <button type="button" onClick={onClose} className="text-muted hover:text-text" aria-label="Close"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {isLoading || !data ? (
            <div className="flex justify-center p-12"><Spinner /></div>
          ) : (
            <ProductForm
              initial={data}
              isEdit
              isSaving={update.isPending || decide.isPending}
              onPublish={onPublish}
              onSaveDelist={onSaveDelist}
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
