import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import {
  CategoryAddForm,
  CategoryTable,
  SearchInput,
  useCategories,
  useShopUi,
} from '@/features/shop'

export function ShopCategoriesPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useCategories()
  const search = useShopUi((s) => s.categorySearch)
  const setSearch = useShopUi((s) => s.setCategorySearch)
  const showForm = useShopUi((s) => s.showCategoryForm)
  const setShowForm = useShopUi((s) => s.setShowCategoryForm)

  const query = search.trim().toLowerCase()
  const categories = (data ?? []).filter((c) => c.name.toLowerCase().includes(query))

  return (
    <Page>
      <PageHeader
        title={t('shop.categories.title')}
        subtitle={t('shop.categories.subtitle')}
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            {t('shop.categories.add')}
          </Button>
        }
      />

      {showForm && <CategoryAddForm />}

      <Card className="overflow-hidden">
        <div className="border-b border-border p-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={t('shop.categories.search')}
            className="w-full sm:w-72"
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <CategoryTable categories={categories} isLoading={false} />
        )}
      </Card>
    </Page>
  )
}
