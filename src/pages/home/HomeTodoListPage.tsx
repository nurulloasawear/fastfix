import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/ui/EmptyState'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { CheckCircleIcon, TodoCard, useTodoList } from '@/features/home'

// THIN page: it composes the feature. All data/logic lives in @/features/home.
export function HomeTodoListPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useTodoList()
  const items = data?.items ?? []

  return (
    <Page>
      <PageHeader
        title={t('home.todo.title')}
        subtitle={t('home.todo.subtitle')}
        breadcrumb={
          <span>
            {t('home.todo.breadcrumbHome')} › {t('home.todo.title')}
          </span>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<CheckCircleIcon size={24} />}
          title={t('home.todo.emptyTitle')}
          description={t('home.todo.emptyDesc')}
        />
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <TodoCard key={item.id} item={item} />
          ))}
        </section>
      )}
    </Page>
  )
}
