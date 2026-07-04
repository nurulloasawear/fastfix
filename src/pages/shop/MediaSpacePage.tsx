import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import {
  MediaGrid,
  SearchInput,
  StorageBar,
  useMedia,
  useShopUi,
  type MediaFilter,
} from '@/features/shop'

export function MediaSpacePage() {
  const { t } = useTranslation()
  const { data, isLoading } = useMedia()
  const filter = useShopUi((s) => s.mediaFilter)
  const setFilter = useShopUi((s) => s.setMediaFilter)
  const search = useShopUi((s) => s.mediaSearch)
  const setSearch = useShopUi((s) => s.setMediaSearch)

  const all = data?.files ?? []
  const query = search.trim().toLowerCase()
  const files = all.filter((f) => {
    const byType = filter === 'all' ? true : f.type === filter
    const bySearch = !query || f.name.toLowerCase().includes(query)
    return byType && bySearch
  })

  const tabItems: TabItem[] = [
    { key: 'all',   label: t('shop.media.filter.all'),   count: all.length },
    { key: 'image', label: t('shop.media.filter.image'), count: all.filter((f) => f.type === 'image').length },
    { key: 'video', label: t('shop.media.filter.video'), count: all.filter((f) => f.type === 'video').length },
  ]

  return (
    <Page>
      <PageHeader
        title={t('shop.media.title')}
        subtitle={t('shop.media.subtitle')}
        actions={
          <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-brand bg-brand px-5 text-sm font-semibold text-white transition-colors hover:border-accent hover:bg-accent hover:text-brand">
            {t('shop.media.upload')}
            <input type="file" accept="image/*,video/*" className="sr-only" />
          </label>
        }
      />

      {data && <StorageBar storage={data.storage} />}

      <Card className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
        <Tabs
          items={tabItems}
          value={filter}
          onChange={(k) => setFilter(k as MediaFilter)}
        />
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t('shop.media.search')}
          className="w-full sm:w-64"
        />
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <MediaGrid files={files} isLoading={isLoading} />
      )}
    </Page>
  )
}
