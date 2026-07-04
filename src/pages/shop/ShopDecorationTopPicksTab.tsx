// Top Picks tab for ShopDecorationPage.
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import type { TopPicksCollection } from '@/features/shop'

export function TopPicksTab({ collections }: { collections: TopPicksCollection[] }) {
  const { t } = useTranslation()
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold text-text">
              {t('shop.decoration.topPicksList')} ({collections.length}/10)
            </span>
            <Button size="sm">{`+ ${t('shop.decoration.topPicksCreate')}`}</Button>
          </div>

          {collections.length === 0 ? (
            <EmptyState
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6" aria-hidden="true">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                </svg>
              }
              title={t('shop.decoration.topPicksList')}
              description={t('shop.decoration.customPageEmpty')}
              action={<Button size="sm">{t('shop.decoration.topPicksCreate')}</Button>}
            />
          ) : (
            <Table>
              <thead>
                <Tr>
                  <Th>{t('shop.decoration.topPicksName')}</Th>
                  <Th>{t('shop.decoration.topPicksProducts')}</Th>
                  <Th>{t('shop.decoration.topPicksDisplay')}</Th>
                  <Th />
                </Tr>
              </thead>
              <tbody>
                {collections.map((c) => (
                  <Tr key={c.id} className="hover:bg-bg/50">
                    <Td className="font-medium text-text">{c.name}</Td>
                    <Td className="text-muted">{c.productCount}</Td>
                    <Td>
                      <div className={`relative h-5 w-9 rounded-full transition-colors ${c.isDisplayed ? 'bg-brand' : 'bg-border-strong'}`}>
                        <span className={`absolute top-0.5 block h-4 w-4 rounded-full bg-white shadow transition-transform ${c.isDisplayed ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </div>
                    </Td>
                    <Td>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">{t('shop.decoration.topPicksEdit')}</Button>
                        <Button variant="destructive" size="sm">{t('shop.decoration.topPicksDelete')}</Button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </div>
      <div className="hidden w-48 shrink-0 lg:block">
        <Card className="flex h-72 items-center justify-center bg-bg">
          <span className="text-xs text-muted">{t('shop.decoration.previewTitle')}</span>
        </Card>
      </div>
    </div>
  )
}
