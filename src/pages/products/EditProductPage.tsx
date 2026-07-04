import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { toast } from '@/components/ui/Toast'
import { ProductForm, useProductDetail, usePatchProductStatus, usePublishProduct, useUpdateProduct } from '@/features/products'
import type { ProductFormData } from '@/features/products'

// THIN page: loads product data, composes ProductForm in edit mode.
export function EditProductPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id = '' } = useParams<{ id: string }>()

  const { data, isLoading } = useProductDetail(id)
  const update = useUpdateProduct(id)
  const publish = usePublishProduct()
  const patchStatus = usePatchProductStatus()

  // Save the edits (size_chart_id is linked atomically by the update payload),
  // THEN apply the chosen status. These throw so ProductForm surfaces the error
  // (e.g. size_chart_required when publishing fashion without a chart).
  async function handlePublish(formData: ProductFormData) {
    await update.mutateAsync(formData)
    await publish.mutateAsync(id)
    toast.success(t('products.add_page.successUpdate'))
    void navigate('/products')
  }

  async function handleSaveDelist(formData: ProductFormData) {
    await update.mutateAsync(formData)
    await patchStatus.mutateAsync({ id, status: 'delisted' })
    toast.success(t('products.add_page.successUpdate'))
    void navigate('/products?tab=unpublished')
  }

  if (isLoading) {
    return (
      <Page>
        <div className="flex items-center justify-center p-16">
          <Spinner />
        </div>
      </Page>
    )
  }

  return (
    <Page>
      <PageHeader
        title={t('products.add_page.editTitle')}
        breadcrumb={`${t('products.home')} › ${t('products.title')} › ${t('products.add_page.breadcrumbDetail')}`}
      />

      <ProductForm
        initial={data ?? {}}
        isEdit={true}
        isSaving={update.isPending}
        onPublish={handlePublish}
        onSaveDelist={handleSaveDelist}
        onCancel={() => void navigate('/products')}
      />
    </Page>
  )
}
