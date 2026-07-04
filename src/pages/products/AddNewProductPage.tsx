import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { toast } from '@/components/ui/Toast'
import { ProductForm, useCreateProduct } from '@/features/products'
import type { ProductFormData } from '@/features/products'

// THIN page: composes ProductForm. All logic in @/features/products.
export function AddNewProductPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const create = useCreateProduct()

  // Throw on failure so ProductForm surfaces the exact backend error.
  // (size chart is linked atomically by the create payload's size_chart_id)
  async function handlePublish(data: ProductFormData) {
    await create.mutateAsync({ data, publish: true })   // → live
    toast.success(t('products.add_page.successCreate'))
    void navigate('/products')
  }

  async function handleSaveDelist(data: ProductFormData) {
    await create.mutateAsync({ data, publish: false })  // → draft (unpublished)
    toast.success(t('products.add_page.successCreate'))
    void navigate('/products?tab=unpublished')
  }

  return (
    <Page>
      <PageHeader
        title={t('products.add_page.title')}
        breadcrumb={`${t('products.home')} › ${t('products.title')} › ${t('products.add_page.title')}`}
      />

      <ProductForm
        isEdit={false}
        isSaving={create.isPending}
        onPublish={handlePublish}
        onSaveDelist={handleSaveDelist}
        onCancel={() => void navigate('/products')}
      />
    </Page>
  )
}
