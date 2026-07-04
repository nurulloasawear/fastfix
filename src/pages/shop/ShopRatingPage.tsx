import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import {
  ReviewList,
  ReviewStats,
  SearchInput,
  useShopReviews,
  useShopUi,
  type ReviewFilter,
} from '@/features/shop'

export function ShopRatingPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useShopReviews()
  const filter = useShopUi((s) => s.reviewFilter)
  const setFilter = useShopUi((s) => s.setReviewFilter)
  const search = useShopUi((s) => s.reviewSearch)
  const setSearch = useShopUi((s) => s.setReviewSearch)

  const all = data?.reviews ?? []
  const query = search.trim().toLowerCase()
  const reviews = all.filter((r) => {
    const byTab =
      filter === 'positive' ? r.rating >= 4 : filter === 'negative' ? r.rating <= 3 : true
    const bySearch =
      !query ||
      r.comment.toLowerCase().includes(query) ||
      r.userName.toLowerCase().includes(query) ||
      r.productName.toLowerCase().includes(query)
    return byTab && bySearch
  })

  const tabItems: TabItem[] = [
    { key: 'all',      label: t('shop.rating.filter.all') },
    { key: 'positive', label: t('shop.rating.filter.positive') },
    { key: 'negative', label: t('shop.rating.filter.negative') },
  ]

  return (
    <Page>
      <PageHeader title={t('shop.rating.title')} subtitle={t('shop.rating.subtitle')} />

      {data && <ReviewStats summary={data.summary} />}

      <Card className="overflow-hidden">
        <div className="flex flex-col items-center justify-between gap-4 border-b border-border p-4 sm:flex-row">
          <Tabs
            items={tabItems}
            value={filter}
            onChange={(k) => setFilter(k as ReviewFilter)}
          />
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={t('shop.rating.search')}
            className="w-full sm:w-64"
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <ReviewList reviews={reviews} />
        )}
      </Card>
    </Page>
  )
}
