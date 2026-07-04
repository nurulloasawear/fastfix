// Shop Decoration page — Homepage/Category/Custom/Top Picks tabs.
// Thin page: data/logic in @/features/shop. Sub-tab components in ShopDecorationSubTabs.tsx.
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import {
  DecorationDraftList,
  DecorationInfoBanner,
  DecorationMainTabs,
  PlatformToggle,
  UseDecorationToggle,
  useDecorationDrafts,
  usePublishDecoration,
  useSaveDecorationDraft,
  useDecorationContent,
  DecorationEditorCanvas,
  useTopPicks,
} from '@/features/shop'
import type { DecorationPlatform } from '@/features/shop'
import { CategoryPageTab, CustomPageTab, TopPicksTab } from './ShopDecorationSubTabs'

type MainTab = 'homepage' | 'categories' | 'custom' | 'top-picks'

export function ShopDecorationPage() {
  const { t } = useTranslation()
  const [mainTab, setMainTab] = useState<MainTab>('homepage')
  const [platform, setPlatform] = useState<DecorationPlatform>('mobile')
  const [decorationEnabled, setDecorationEnabled] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: drafts = [], isLoading } = useDecorationDrafts(platform)
  const { data: content } = useDecorationContent(editingId ?? '')
  const saveDraft = useSaveDecorationDraft(editingId ?? '')
  const publish = usePublishDecoration(editingId ?? '')
  const { data: topPicks = [] } = useTopPicks()

  if (editingId && content) {
    return (
      <div className="flex h-screen flex-col overflow-hidden">
        <DecorationEditorCanvas
          content={content}
          onSave={(widgets) => saveDraft.mutate(widgets)}
          onPublish={() => publish.mutate()}
          isSaving={saveDraft.isPending}
        />
        <button
          type="button"
          className="fixed left-4 top-4 z-50 flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text shadow-xs hover:bg-bg"
          onClick={() => setEditingId(null)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {t('shop.decoration.editorBack')}
        </button>
      </div>
    )
  }

  return (
    <Page>
      <PageHeader
        title={t('shop.decoration.title')}
        breadcrumb={`${t('shop.appeals.breadcrumbHome')} › ${t('shop.decoration.title')}`}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">{t('shop.decoration.mediaSpace')}</Button>
            <Button variant="ghost" size="sm">{t('shop.decoration.userGuide')}</Button>
          </div>
        }
      />

      <DecorationMainTabs active={mainTab} onChange={(v) => setMainTab(v as MainTab)} />

      <div className="flex flex-col gap-4">
        {mainTab === 'homepage' && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <PlatformToggle active={platform} onChange={setPlatform} />
              <UseDecorationToggle
                enabled={decorationEnabled}
                onChange={setDecorationEnabled}
                label={t('shop.decoration.useDecoration')}
              />
            </div>

            <DecorationInfoBanner text={t('shop.decoration.infoBanner')} />

            <div className="flex gap-4">
              <div className="flex-1">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Spinner />
                  </div>
                ) : (
                  <DecorationDraftList
                    drafts={drafts}
                    platform={platform}
                    onEdit={(id) => setEditingId(id)}
                    onReplaceTemplate={(_id) => undefined}
                  />
                )}
              </div>
              <div className="hidden w-48 shrink-0 lg:block">
                <Card className="overflow-hidden">
                  <div className="bg-table-header px-3 py-2 text-xs font-semibold text-text-secondary">
                    {t('shop.decoration.previewTitle')}
                  </div>
                  <div className="flex h-64 items-center justify-center bg-bg">
                    <span className="text-xs text-muted">{t('shop.decoration.previewHint')}</span>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}

        {mainTab === 'categories' && <CategoryPageTab />}
        {mainTab === 'custom' && <CustomPageTab />}
        {mainTab === 'top-picks' && <TopPicksTab collections={topPicks} />}
      </div>
    </Page>
  )
}
