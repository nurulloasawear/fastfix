// PUBLIC API of the products feature. Pages import ONLY from here
// (`@/features/products`) — never a deep path.
export {
  productKeys,
  useProducts,
  useListingIssues,
  useViolationProducts,
  useReviewProducts,
  useUnpublishedProducts,
  useProductDetail,
  useCreateProduct,
  useUpdateProduct,
  usePatchProductStatus,
  useDeleteProduct,
  useBulkUpdate,
  useBulkAppeal,
  useAppealProduct,
  useBoostProduct,
  useCopyProduct,
  useDelistProduct,
  usePublishProduct,
  useSaveProductAsDelisted,
  useBrands,
  useRegisterBrand,
  useSizeCharts,
  useSizeTemplates,
  useSizeChart,
  useCreateSizeChart,
  useUpdateSizeChart,
  useDeleteSizeChart,
  useSetProductSizeChart,
  useMassUploadJobs,
  useUploadMassFile,
  useAIImportJobs,
  useUploadAIImport,
  useAIImportItems,
  useEditAIImportItem,
  useDecideAIImportItem,
  useDecideAIImportJob,
} from './api/products.queries'

export { useProductsUi } from './stores/products.store'

export { ProductFilters } from './components/ProductFilters'
export {
  ProductStatusTabs,
  LiveSubTabs,
  ViolationSubTabs,
  UnpublishedSubTabs,
} from './components/ProductStatusTabs'
export { ProductTable } from './components/ProductTable'
export { ViolationTable } from './components/ViolationTable'
export { ReviewTable } from './components/ReviewTable'
export { UnpublishedTable } from './components/UnpublishedTable'
export { ListingQualityTable } from './components/ListingQualityTable'
export { ProductForm } from './components/ProductForm'
export { StatusBadge } from './components/StatusBadge'
export { FormField, TextField, TextArea, SelectField } from './components/FormField'
export { RecordsTable } from './components/RecordsTable'
export { CategoryPicker } from './components/CategoryPicker'
export { categoryName, uploadProductFile, downloadMassTemplate } from './api/products.api'
export type { MassUploadJob, AIReviewItem, AIReviewBatch, AIReviewStatus, ReviewDecision } from './api/products.api'

export { productsHandlers } from './api/products.mocks'
export { productsMessages } from './i18n'

export {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  PlusCircle,
  Edit3,
  Grid3X3,
  List,
  ImagePlus,
  Trash2,
  FileX2,
  Search,
  Zap,
  InfoIcon,
  MoreHoriz,
} from './components/icons'

export type {
  Product,
  ProductStatus,
  StatusFilter,
  ProductStatusTab,
  LiveSubTab,
  ViolationSubTab,
  UnpublishedSubTab,
  SortOption,
  ProductSummary,
  ProductListQuery,
  ProductListResponse,
  ListingIssue,
  ListingIssuesResponse,
  IssueType,
  ViolationProduct,
  ViolationListResponse,
  ReviewProduct,
  ReviewListResponse,
  UnpublishedProduct,
  UnpublishedListResponse,
  ProductFormData,
  VariationGroup,
  SkuRow,
  WholesaleTier,
  BulkUpdateInput,
  BulkAction,
  Brand,
  BrandStatus,
  BrandListResponse,
  BrandRegistrationInput,
  SizeChart,
  SizeChartStatus,
  SizeChartListQuery,
  SizeChartListResponse,
  SizeChartDetail,
  SizeTemplate,
  SizeMeasurementAttr,
  SizeSystemDef,
  SaveSizeChartInput,
  LangMap,
} from './types/products.types'
