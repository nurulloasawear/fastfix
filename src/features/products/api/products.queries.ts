import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  appealProduct, boostProduct, bulkAppeal, bulkUpdate, copyProduct,
  createProduct, createSizeChart, deleteProduct, deleteSizeChart, delistProduct, getBrands,
  getSizeChart, getSizeTemplates, setProductSizeChart, unsetProductSizeChart, updateSizeChart,
  getCategoryTree, getListingIssues, getMassUploadJobs, uploadMassFile, uploadAIImport, getProductDetail, getProducts, getReviewProducts,
  getSizeCharts, getUnpublishedProducts, getViolationProducts, patchProductLabels,
  patchProductStatus, publishProduct, quickCreateBrand, registerBrand, saveProductAsDelisted,
  searchBrands, updateProduct, withdrawProductFromReview,
  getAIImportItems, patchAIImportItem, decideAIImportItem, decideAIImportJob,
} from './products.api'
import type { AIItemEdit, ReviewDecision, AIReviewBatch, AIReviewItem } from './products.api'
import type {
  BrandRegistrationInput, BulkUpdateInput, SaveSizeChartInput,
  ProductFormData, ProductListQuery, SizeChartListQuery,
} from '../types/products.types'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (q: ProductListQuery) => [...productKeys.lists(), q] as const,
  issues: () => [...productKeys.all, 'issues'] as const,
  violations: () => [...productKeys.all, 'violations'] as const,
  review: () => [...productKeys.all, 'review'] as const,
  unpublished: (sub?: string) => [...productKeys.all, 'unpublished', sub] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
  categoryTree: () => [...productKeys.all, 'category-tree'] as const,
  brands: () => [...productKeys.all, 'brands'] as const,
  sizeCharts: (q: SizeChartListQuery) => [...productKeys.all, 'size-charts', q] as const,
}

// ── List ──────────────────────────────────────────────────────────────────────
export function useProducts(query: ProductListQuery) {
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => getProducts(query),
  })
}

// Whole taxonomy tree — reference data, rarely changes; cache hard.
export function useCategoryTree() {
  return useQuery({
    queryKey: productKeys.categoryTree(),
    queryFn: getCategoryTree,
    staleTime: 60 * 60 * 1000, // 1h
    gcTime: 2 * 60 * 60 * 1000,
  })
}

export function useListingIssues() {
  return useQuery({
    queryKey: productKeys.issues(),
    queryFn: getListingIssues,
  })
}

export function useViolationProducts() {
  return useQuery({
    queryKey: productKeys.violations(),
    queryFn: getViolationProducts,
  })
}

export function useReviewProducts() {
  return useQuery({
    queryKey: productKeys.review(),
    queryFn: getReviewProducts,
  })
}

export function useUnpublishedProducts(sub?: string, page?: number) {
  return useQuery({
    queryKey: productKeys.unpublished(`${sub ?? 'draft'}:${page ?? 1}`),
    queryFn: () => getUnpublishedProducts(sub, page),
  })
}

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductDetail(id),
    enabled: Boolean(id),
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────
export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, publish }: { data: ProductFormData; publish: boolean }) => createProduct(data, publish),
    onSuccess: () => void qc.invalidateQueries({ queryKey: productKeys.lists() }),
  })
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ProductFormData) => updateProduct(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: productKeys.lists() })
      void qc.invalidateQueries({ queryKey: productKeys.detail(id) })
    },
  })
}

export function usePatchProductStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => patchProductStatus(id, status),
    onSuccess: () => void qc.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: productKeys.lists() }),
  })
}

export function useBulkUpdate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: BulkUpdateInput) => bulkUpdate(input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export function useBulkAppeal() {
  return useMutation({ mutationFn: (ids: string[]) => bulkAppeal(ids) })
}

export function useAppealProduct() {
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => appealProduct(id, reason),
  })
}

// ── Backward-compat (used by existing settings/brand/size-chart pages) ────────
export function useBoostProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => boostProduct(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: productKeys.lists() }),
  })
}

export function useDelistProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => delistProduct(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: productKeys.lists() }),
  })
}

export function useCopyProduct() {
  return useMutation({ mutationFn: (id: string) => copyProduct(id) })
}

export function usePublishProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: unknown) => publishProduct(input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: productKeys.lists() }),
  })
}

export function useSaveProductAsDelisted() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: unknown) => saveProductAsDelisted(input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: productKeys.lists() }),
  })
}

export function useBrands() {
  return useQuery({ queryKey: productKeys.brands(), queryFn: getBrands })
}

// Brand registry search for the in-product picker (debounced q passed by caller).
export function useBrandSearch(q: string, enabled = true) {
  return useQuery({
    queryKey: [...productKeys.brands(), 'search', q] as const,
    queryFn: () => searchBrands(q),
    enabled,
    staleTime: 60 * 1000,
  })
}

export function useQuickCreateBrand() {
  return useMutation({ mutationFn: (name: string) => quickCreateBrand(name) })
}

export function useRegisterBrand() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: BrandRegistrationInput) => registerBrand(input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: productKeys.brands() }),
  })
}

export function useSizeCharts(query: SizeChartListQuery = {}) {
  return useQuery({
    queryKey: productKeys.sizeCharts(query),
    queryFn: () => getSizeCharts(query),
  })
}

// Virtual-category templates — reference data, cache hard.
export function useSizeTemplates() {
  return useQuery({
    queryKey: [...productKeys.all, 'size-templates'] as const,
    queryFn: getSizeTemplates,
    staleTime: 60 * 60 * 1000,
  })
}

export function useSizeChart(id: string, enabled = true) {
  return useQuery({
    queryKey: [...productKeys.all, 'size-chart', id] as const,
    queryFn: () => getSizeChart(id),
    enabled: enabled && !!id,
  })
}

export function useCreateSizeChart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: SaveSizeChartInput) => createSizeChart(input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export function useUpdateSizeChart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: SaveSizeChartInput }) => updateSizeChart(id, input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export function useDeleteSizeChart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSizeChart(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: productKeys.all }),
  })
}

// Mass-upload jobs — poll while any job is still pending/processing.
export function useMassUploadJobs() {
  return useQuery({
    queryKey: [...productKeys.all, 'mass-jobs'] as const,
    queryFn: () => getMassUploadJobs(),
    refetchInterval: (q) => {
      const jobs = q.state.data as Awaited<ReturnType<typeof getMassUploadJobs>> | undefined
      return jobs?.some((j) => j.status === 'pending' || j.status === 'processing') ? 2000 : false
    },
  })
}

export function useUploadMassFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadMassFile(file),
    onSuccess: () => void qc.invalidateQueries({ queryKey: [...productKeys.all, 'mass-jobs'] }),
  })
}

// AI Import jobs — separate history (template_type='ai_import'); same poll cadence.
export function useAIImportJobs() {
  return useQuery({
    queryKey: [...productKeys.all, 'ai-jobs'] as const,
    queryFn: () => getMassUploadJobs('ai_import'),
    refetchInterval: (q) => {
      const jobs = q.state.data as Awaited<ReturnType<typeof getMassUploadJobs>> | undefined
      return jobs?.some((j) => j.status === 'pending' || j.status === 'processing') ? 2500 : false
    },
  })
}

export function useUploadAIImport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadAIImport(file),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...productKeys.all, 'ai-jobs'] })
      void qc.invalidateQueries({ queryKey: productKeys.lists() }) // new drafts appear
    },
  })
}

// ── AI Import review / approval ────────────────────────────────────────────────
const aiItemsKey = (jobId: string) => [...productKeys.all, 'ai-items', jobId] as const

export function useAIImportItems(jobId: string) {
  return useQuery({
    queryKey: aiItemsKey(jobId),
    queryFn: () => getAIImportItems(jobId),
    enabled: !!jobId,
  })
}

// Inline edits don't REFETCH (would churn + lose focus) — instead we patch the cached
// batch in place (edited fields + new `missing`) so the header's "Approve all ready (N)"
// updates in real time as the seller fills stock, without re-rendering inputs from server.
export function useEditAIImportItem(jobId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, fields }: { id: string; fields: AIItemEdit }) => patchAIImportItem(id, fields),
    onSuccess: (data, { id, fields }) => {
      qc.setQueryData(aiItemsKey(jobId), (old?: AIReviewBatch) => {
        if (!old) return old
        return { ...old, items: old.items.map((it) => (it.id === id ? applyEdit(it, fields, data.missing) : it)) }
      })
    },
  })
}

function applyEdit(it: AIReviewItem, f: AIItemEdit, missing: string[]): AIReviewItem {
  return {
    ...it,
    title: f.title ?? it.title,
    description: f.description ?? it.description,
    priceUzs: f.price_uzs ?? it.priceUzs,
    stock: f.stock ?? it.stock,
    categoryId: f.category_id ?? it.categoryId,
    brand: f.brand ?? it.brand,
    compareAtUzs: null, // edits clear the imported compare-at (one price)
    missing,
  }
}

export function useDecideAIImportItem(jobId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: ReviewDecision }) => decideAIImportItem(id, decision),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: aiItemsKey(jobId) })
      void qc.invalidateQueries({ queryKey: productKeys.lists() }) // approved/drafted now appear in Products
      void qc.invalidateQueries({ queryKey: [...productKeys.all, 'ai-jobs'] })
    },
  })
}

export function useDecideAIImportJob(jobId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (decision: ReviewDecision) => decideAIImportJob(jobId, decision),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: aiItemsKey(jobId) })
      void qc.invalidateQueries({ queryKey: productKeys.lists() })
      void qc.invalidateQueries({ queryKey: [...productKeys.all, 'ai-jobs'] })
    },
  })
}

export function useSetProductSizeChart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, chartId }: { productId: string; chartId: string }) =>
      chartId ? setProductSizeChart(productId, chartId) : unsetProductSizeChart(productId),
    onSuccess: () => void qc.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export function useWithdrawProductFromReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => withdrawProductFromReview(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export function usePatchProductLabels() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, labels }: { id: string; labels: string[] }) => patchProductLabels(id, labels),
    onSuccess: () => void qc.invalidateQueries({ queryKey: productKeys.lists() }),
  })
}
