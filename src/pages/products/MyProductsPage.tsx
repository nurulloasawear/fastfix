import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Pagination } from '@/components/ui/Pagination'
import {
  ChevronDown, InfoIcon,
  LiveSubTabs, ListingQualityTable, ProductFilters, ProductStatusTabs,
  ProductTable, ReviewTable, UnpublishedSubTabs, UnpublishedTable,
  ViolationSubTabs, ViolationTable,
  useAppealProduct, useBulkUpdate, useDeleteProduct, useListingIssues,
  usePatchProductStatus, useProducts, useProductsUi, usePublishProduct, useReviewProducts,
  useUnpublishedProducts, useViolationProducts,
} from '@/features/products'
import type { IssueType, ProductSummary } from '@/features/products'
import { AiOptimiserPopup, PaymentBanner, ReviewBanner } from './ProductBanners'

const EMPTY_SUMMARY: ProductSummary = { all: 0, live: 0, no_stock: 0, violation: 0, under_review: 0, unpublished: 0 }

export function MyProductsPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  // ── Store selectors ────────────────────────────────────────────────────────
  const statusTab       = useProductsUi((s) => s.statusTab)
  const liveSubTab      = useProductsUi((s) => s.liveSubTab)
  const violationSubTab = useProductsUi((s) => s.violationSubTab)
  const unpublishedSubTab = useProductsUi((s) => s.unpublishedSubTab)
  const draftSearch     = useProductsUi((s) => s.draftSearch)
  const appliedSearch   = useProductsUi((s) => s.appliedSearch)
  const selectedIds     = useProductsUi((s) => s.selectedIds)
  const paymentBannerDismissed = useProductsUi((s) => s.paymentBannerDismissed)
  const aiPopupShown   = useProductsUi((s) => s.aiPopupShown)

  const setStatusTab    = useProductsUi((s) => s.setStatusTab)
  const setLiveSubTab   = useProductsUi((s) => s.setLiveSubTab)
  const setViolationSubTab = useProductsUi((s) => s.setViolationSubTab)
  const setUnpublishedSubTab = useProductsUi((s) => s.setUnpublishedSubTab)
  const setDraftSearch  = useProductsUi((s) => s.setDraftSearch)
  const applySearch     = useProductsUi((s) => s.applySearch)
  const resetSearch     = useProductsUi((s) => s.resetSearch)
  const toggleSelect    = useProductsUi((s) => s.toggleSelect)
  const selectAll       = useProductsUi((s) => s.selectAll)
  const dismissPaymentBanner = useProductsUi((s) => s.dismissPaymentBanner)
  const dismissAiPopup = useProductsUi((s) => s.dismissAiPopup)

  // Sync tab from URL on mount
  const tabFromUrl = searchParams.get('tab') as typeof statusTab | null
  if (tabFromUrl && tabFromUrl !== statusTab) setStatusTab(tabFromUrl)

  const isLive        = statusTab === 'live'
  const isAll         = statusTab === 'all'
  const isNoStock     = statusTab === 'no_stock'
  const isViolation   = statusTab === 'violation'
  const isUnderReview = statusTab === 'under_review'
  const isUnpublished = statusTab === 'unpublished'

  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20
  // Reset to page 1 whenever the view (tab / sub-tab / search) changes.
  useEffect(() => { setPage(1) }, [statusTab, liveSubTab, violationSubTab, unpublishedSubTab, appliedSearch])

  // ── Queries (page applies only to the ACTIVE tab to avoid cross-tab refetch) ──
  const liveQuery   = useProducts({ status: 'live', sub: liveSubTab === 'all' ? undefined : liveSubTab, q: appliedSearch || undefined, page: isLive ? page : 1 })
  const allQuery    = useProducts({ status: 'all', q: appliedSearch || undefined, page: isAll ? page : 1 })
  const noStockQuery = useProducts({ status: 'no_stock', q: appliedSearch || undefined, page: isNoStock ? page : 1 })
  const issuesQuery = useListingIssues()
  const violationQuery  = useViolationProducts()
  const reviewQuery     = useReviewProducts()
  const unpublishedQuery = useUnpublishedProducts(unpublishedSubTab === 'delisted' ? 'delisted' : 'draft', isUnpublished ? page : 1)

  // ── Mutations ──────────────────────────────────────────────────────────────
  const patchStatus   = usePatchProductStatus()
  const deleteProduct = useDeleteProduct()
  const bulkUpdate    = useBulkUpdate()
  const appealProduct = useAppealProduct()
  const publish       = usePublishProduct()

  const summary = allQuery.data?.summary ?? EMPTY_SUMMARY

  // ── Local state ────────────────────────────────────────────────────────────
  const [issueFilter, setIssueFilter] = useState<IssueType | 'all'>('all')
  const [reviewBannerDismissed, setReviewBannerDismissed] = useState(false)

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleDelist    = useCallback((id: string) => { void patchStatus.mutate({ id, status: 'delisted' }) }, [patchStatus])
  const handleDelete    = useCallback((id: string) => { void deleteProduct.mutate(id) }, [deleteProduct])
  const handleDuplicate = useCallback((_id: string) => { /* [PENDING BACKEND] POST /seller/products/:id/copy */ }, [])
  const handleWithdraw  = useCallback((id: string) => { void patchStatus.mutate({ id, status: 'draft' }) }, [patchStatus])
  // Publish a draft → live, via the real publish endpoint (POST …/publish → active).
  // (Was patching status to 'under_review', which the backend rejects.)
  const handlePublish   = useCallback((id: string) => { void publish.mutate(id) }, [publish])
  const handleAppeal    = useCallback((id: string) => { void appealProduct.mutate({ id, reason: 'Requesting appeal' }) }, [appealProduct])
  const handleBulkAction = useCallback((action: 'delist' | 'delete' | 'publish') => {
    if (selectedIds.length === 0) return
    void bulkUpdate.mutate({ productIds: selectedIds, action })
  }, [selectedIds, bulkUpdate])

  // ── Derived ────────────────────────────────────────────────────────────────
  // All/Live/No-Stock render the shared ProductTable from their own query.
  const currentProducts = isAll ? (allQuery.data?.products ?? [])
    : isLive ? (liveQuery.data?.products ?? [])
    : isNoStock ? (noStockQuery.data?.products ?? [])
    : []
  const currentLoading = isAll ? allQuery.isLoading : isLive ? liveQuery.isLoading : isNoStock ? noStockQuery.isLoading : false
  const liveRestockCount = (liveQuery.data?.products ?? []).filter((p) => p.totalStock === 0).length
  const liveQualityCount = (issuesQuery.data?.issues ?? []).length
  // Count + pagination reflect the CURRENT view (was always the All total).
  const viewTotal = isAll ? (allQuery.data?.total ?? 0)
    : isLive ? (liveQuery.data?.total ?? 0)
    : isNoStock ? (noStockQuery.data?.total ?? 0)
    : isUnpublished ? (unpublishedQuery.data?.total ?? 0)
    : isViolation ? (violationQuery.data?.products.length ?? 0)
    : isUnderReview ? (reviewQuery.data?.products.length ?? 0)
    : 0
  const paginated = isAll || isLive || isNoStock || isUnpublished
  const totalPages = Math.max(1, Math.ceil(viewTotal / PAGE_SIZE))

  const changeTab = (tab: typeof statusTab) => {
    setStatusTab(tab)
    const p = new URLSearchParams(searchParams); p.set('tab', tab); p.delete('sub')
    setSearchParams(p, { replace: true })
  }

  const [massOpen, setMassOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <Page>
      <PageHeader
        title={t('products.title')}
        breadcrumb={`${t('products.home')} › ${t('products.title')}`}
        actions={
          <>
            <div className="relative">
              <Button variant="outline" size="sm" onClick={() => setMassOpen((v) => !v)}>
                {t('products.massFunction')} <ChevronDown size={14} />
              </Button>
              {massOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMassOpen(false)} role="presentation" />
                  <div className="absolute right-0 z-20 mt-1 w-56 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg">
                    <Link to="/products/mass-upload" onClick={() => setMassOpen(false)} className="block px-4 py-2.5 text-sm text-text hover:bg-surface-hover">
                      {t('products.mass.title')}
                    </Link>
                    <span className="block px-4 py-2.5 text-sm text-muted opacity-50">{t('products.mass.massUpdateSoon')}</span>
                    <div className="my-1 border-t border-border" />
                    <p className="px-4 pb-1 pt-1 text-xs text-muted">{t('products.mass.bulkHeading', { n: selectedIds.length })}</p>
                    <button type="button" disabled={selectedIds.length === 0} onClick={() => { handleBulkAction('publish'); setMassOpen(false) }} className="block w-full px-4 py-2 text-left text-sm text-text hover:bg-surface-hover disabled:opacity-40">{t('products.mass.bulkPublish')}</button>
                    <button type="button" disabled={selectedIds.length === 0} onClick={() => { handleBulkAction('delist'); setMassOpen(false) }} className="block w-full px-4 py-2 text-left text-sm text-text hover:bg-surface-hover disabled:opacity-40">{t('products.mass.bulkDelist')}</button>
                    <button type="button" disabled={selectedIds.length === 0} onClick={() => { handleBulkAction('delete'); setMassOpen(false) }} className="block w-full px-4 py-2 text-left text-sm text-error hover:bg-surface-hover disabled:opacity-40">{t('products.mass.bulkDelete')}</button>
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <Button variant="outline" size="sm" onClick={() => setSettingsOpen((v) => !v)}>
                {t('products.productSettings')} <ChevronDown size={14} />
              </Button>
              {settingsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSettingsOpen(false)} role="presentation" />
                  <div className="absolute right-0 z-20 mt-1 w-56 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg">
                    <Link to="/products/product-setting/brand-management" onClick={() => setSettingsOpen(false)} className="block px-4 py-2.5 text-sm text-text hover:bg-surface-hover">
                      {t('products.setting.brandTitle')}
                    </Link>
                    <Link to="/products/product-setting/size-chart-management" onClick={() => setSettingsOpen(false)} className="block px-4 py-2.5 text-sm text-text hover:bg-surface-hover">
                      {t('products.size.title')}
                    </Link>
                  </div>
                </>
              )}
            </div>
            <Link to="/products/new"><Button>{t('products.add')}</Button></Link>
          </>
        }
      />

      <Card className="overflow-hidden">
        <ProductStatusTabs active={statusTab} summary={summary} onChange={changeTab} />

        {isLive && !paymentBannerDismissed && <div className="px-4 pt-3"><PaymentBanner onDismiss={dismissPaymentBanner} /></div>}
        {isUnderReview && !reviewBannerDismissed && <div className="px-4 pt-3"><ReviewBanner onDismiss={() => setReviewBannerDismissed(true)} /></div>}

        {isLive && <LiveSubTabs active={liveSubTab} restockCount={liveRestockCount} qualityCount={liveQualityCount} onChange={setLiveSubTab} />}
        {isViolation && (
          <div className="flex items-center justify-between px-4 pt-2">
            <ViolationSubTabs active={violationSubTab} onChange={setViolationSubTab} />
            <Button variant="ghost" size="sm" onClick={() => void 0}>{t('products.violationHistory')}</Button>
          </div>
        )}
        {isUnpublished && <UnpublishedSubTabs active={unpublishedSubTab} onChange={setUnpublishedSubTab} />}

        {/* Search toolbar */}
        <div className="px-4 py-3">
          <ProductFilters searchValue={draftSearch} onSearchChange={setDraftSearch}
            onApply={applySearch} onReset={resetSearch}
            showLabelFilter={isLive || isUnpublished} />
        </div>

        {/* Products count + sort */}
        {!isViolation && (
          <div className="flex items-center justify-between px-4 pb-2">
            <span className="text-sm font-semibold text-text">{t('products.productsCount', { count: viewTotal })}</span>
            <Button variant="outline" size="sm">
              {t('products.sortBy')}: {t('products.sort.recommended')} <ChevronDown size={12} />
            </Button>
          </div>
        )}

        {/* Tables */}
        {(isLive || isAll || isNoStock) && liveSubTab !== 'quality' && (
          <ProductTable products={currentProducts} isLoading={currentLoading}
            showDiagnosis={isLive && liveSubTab === 'all'} selectedIds={selectedIds}
            onToggleSelect={toggleSelect} onSelectAll={selectAll}
            onDelist={handleDelist} onDelete={handleDelete} onDuplicate={handleDuplicate} />
        )}
        {isLive && liveSubTab === 'quality' && (
          <ListingQualityTable issues={issuesQuery.data?.issues ?? []} isLoading={issuesQuery.isLoading}
            activeFilter={issueFilter} onFilterChange={setIssueFilter} />
        )}
        {isViolation && (
          <>
            <ViolationTable products={violationQuery.data?.products ?? []} isLoading={violationQuery.isLoading}
              selectedIds={selectedIds} onToggleSelect={toggleSelect} onSelectAll={selectAll} onAppeal={handleAppeal} />
            <div className="flex justify-end px-4 py-3 border-t border-border">
              <Button size="sm" variant="outline" onClick={() => void 0}>
                <InfoIcon size={14} /> {t('products.action.massAppeal')}
              </Button>
            </div>
          </>
        )}
        {isUnderReview && (
          <ReviewTable products={reviewQuery.data?.products ?? []} isLoading={reviewQuery.isLoading}
            selectedIds={selectedIds} onToggleSelect={toggleSelect} onSelectAll={selectAll} onWithdraw={handleWithdraw} />
        )}
        {isUnpublished && (
          <UnpublishedTable products={unpublishedQuery.data?.products ?? []} isLoading={unpublishedQuery.isLoading}
            selectedIds={selectedIds} onToggleSelect={toggleSelect} onSelectAll={selectAll}
            onPublish={handlePublish} onDelete={handleDelete} />
        )}

        {/* Pagination — only the server-paginated views */}
        {paginated && totalPages > 1 && (
          <div className="border-t border-border p-3">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </Card>

      {isLive && !aiPopupShown && <AiOptimiserPopup onDismiss={dismissAiPopup} />}
    </Page>
  )
}
