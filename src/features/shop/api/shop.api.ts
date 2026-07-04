import { apiClient } from '@/lib/axios'
import { ApiError } from '@/lib/apiError'
import type {
  Appeal,
  AppealStatus,
  AppealsListResponse,
  AppealsQuery,
  DecorationBlock,
  DecorationContent,
  DecorationDraft,
  MediaResponse,
  Mission,
  MissionsResponse,
  MultiLang,
  ReportsResponse,
  ReviewReplyPayload,
  RewardsResponse,
  SellerReward,
  ShopCategory,
  ShopInfoProfile,
  ShopInfoUpdate,
  ShopKyc,
  ShopProfile,
  ShopProfileUpdate,
  ShopReport,
  ShopReview,
  ShopReviewsResponse,
  TopPicksCollection,
  TopPicksDetail,
  Widget,
} from '../types/shop.types'

const PATHS = {
  profile: '/seller/shop/profile',
  reviews: '/seller/shop/reviews',
  reviewReply: (id: string) => `/seller/shop/reviews/${id}/reply`,
  decoration: '/seller/shop/decoration',
  // ✅ real: shop categories — GET/POST /sellers/me/shop/categories
  categories: '/sellers/me/shop/categories',
  category: (id: string) => `/sellers/me/shop/categories/${id}`,
  media: '/seller/shop/media',
  mediaFile: (id: string) => `/seller/shop/media/${id}`,
  reports: '/seller/shop/reports',
  // ✅ real: seller profile (read + update) — GET/PUT /sellers/me
  sellersMe: '/sellers/me',
  // ✅ real: media signed upload
  mediaUploadUrl: '/media/upload-url',
  // ✅ real: KYC — GET /sellers/me/kyc
  shopKyc: '/sellers/me/kyc',
  // ✅ real: decoration drafts — GET/POST /sellers/me/shop/decoration
  decorationDrafts: '/sellers/me/shop/decoration',
  decorationById: (id: string) => `/sellers/me/shop/decoration/${id}`,
  decorationDraftSave: (id: string) => `/sellers/me/shop/decoration/${id}/draft`,
  decorationPublish: (id: string) => `/sellers/me/shop/decoration/${id}/publish`,
  // ✅ real: top picks — GET/POST /sellers/me/shop/top-picks
  topPicks: '/sellers/me/shop/top-picks',
  topPicksById: (id: string) => `/sellers/me/shop/top-picks/${id}`,
  // ✅ real: appeals — GET /sellers/me/appeals?category=...
  appeals: '/sellers/me/appeals',
  // ✅ real: missions — GET /sellers/me/missions
  missions: '/sellers/me/missions',
  // ✅ real: missions/intro-seen — POST /sellers/me/missions/intro-seen
  missionsIntroSeen: '/sellers/me/missions/intro-seen',
  // ✅ real: rewards — GET /sellers/me/missions/rewards
  rewards: '/sellers/me/missions/rewards',
} as const

// --- DTO boundary (snake_case backend ↔ camelCase feature) ---

interface BackendLangMap {
  uz?: string
  ru?: string
  en?: string
}

// GET /sellers/me backend response (snake_case). status enum: pending|approved|suspended.
interface SellersMeDto {
  id: string
  shop_name: string | null
  status: string
  description?: BackendLangMap | null
  logo_url?: string | null
  banner_url?: string | null
  vat_percent?: number
  product_count?: number
  registered_at?: string | null
  created_at?: string | null
}

// PUT /sellers/me request body (snake_case). All fields optional.
interface SellersMeUpdateDto {
  shop_name?: string
  description?: MultiLang
  logo_url?: string
  banner_url?: string
}

interface MediaUploadUrlResponse {
  key: string
  upload_url: string
  public_url: string
}

// --- KYC DTO ---
interface ShopKycDto {
  status: string
  submitted_at: string | null
  verification_method: string | null
  seller_type: string | null
  full_name?: string | null
  id_type: string | null
  id_last_four: string | null
  address_masked: string | null
}

// --- Decoration DTOs ---
interface DecorationDraftDto {
  id: string
  name: string
  platform: string
  status: string
  updated_at: string
  published_at: string | null
  thumbnail_url?: string | null
}

interface DecorationContentDto {
  id: string
  name: string
  platform: string
  status: string
  updated_at: string
  published_at: string | null
  widgets: Array<{ id: string; type: string; order: number; config: Record<string, unknown> }>
}

// --- Top Picks DTOs ---
interface TopPicksCollectionDto {
  id: string
  name: string
  is_displayed: boolean
  display_order: number
  product_count: number
}

interface TopPicksListDto {
  collections: TopPicksCollectionDto[]
  total: number
  max: number
}

interface TopPicksProductDto {
  id: string
  name: string
  price_uzs: number
  sales_count: number
  image_url: string | null
  is_abnormal: boolean
}

interface TopPicksDetailDto {
  id: string
  name: string
  is_displayed: boolean
  allow_personalization: boolean
  products: TopPicksProductDto[]
}

// --- Appeals DTOs ---
interface AppealDto {
  id: string
  appeal_type: string
  category: string
  status: string
  admin_note: string | null
  created_at: string
  updated_at: string
}

interface AppealsListDto {
  appeals: AppealDto[]
  total: number
  page: number
  limit: number
}

// --- Missions DTOs ---
interface MissionTaskDto {
  id: string
  description: BackendLangMap | string
  task_key?: string
  is_completed: boolean
}

interface MissionDto {
  id: string
  title: BackendLangMap | string
  description: BackendLangMap | string
  reward_description: BackendLangMap | string
  reward_type: string
  reward_value_uzs: number | null
  reward_metadata: Record<string, unknown> | null
  status: string
  tasks: MissionTaskDto[]
}

interface MissionsResponseDto {
  intro_seen: boolean
  all_completed: boolean
  missions: MissionDto[]
}

// --- Rewards DTOs ---
interface SellerRewardDto {
  id: string
  mission_id: string
  reward_type: string
  value_uzs: number | null
  metadata: Record<string, unknown> | null
  status: string
  expires_at: string
  issued_at: string
  redeemed_at: string | null
}

interface RewardsResponseDto {
  rewards: SellerRewardDto[]
  unclaimed_count: number
}

// --- Profile ---
export async function getProfile(): Promise<ShopProfile> {
  const { data } = await apiClient.get<ShopProfile>(PATHS.profile)
  return data
}

export async function updateProfile(payload: ShopProfileUpdate): Promise<ShopProfile> {
  const { data } = await apiClient.put<ShopProfile>(PATHS.profile, payload)
  return data
}

// --- Reviews ---
export async function getReviews(): Promise<ShopReviewsResponse> {
  const { data } = await apiClient.get<ShopReviewsResponse>(PATHS.reviews)
  return data
}

export async function replyToReview(payload: ReviewReplyPayload): Promise<ShopReview> {
  const { data } = await apiClient.post<ShopReview>(PATHS.reviewReply(payload.id), {
    reply: payload.reply,
  })
  return data
}

// --- Decoration ---
export async function getDecoration() {
  return (await apiClient.get<DecorationBlock[]>(PATHS.decoration)).data
}
export async function saveDecoration(blocks: DecorationBlock[]) {
  return (await apiClient.put<DecorationBlock[]>(PATHS.decoration, { blocks })).data
}

// --- Categories ---
export async function getCategories() {
  return (await apiClient.get<ShopCategory[]>(PATHS.categories)).data
}
export async function createCategory(name: string) {
  return (await apiClient.post<ShopCategory>(PATHS.categories, { name })).data
}
export async function toggleCategory(id: string) {
  return (await apiClient.patch<ShopCategory>(PATHS.category(id), { toggle: true })).data
}
export async function deleteCategory(id: string) {
  await apiClient.delete(PATHS.category(id))
}

// --- Media ---
export async function getMedia() {
  return (await apiClient.get<MediaResponse>(PATHS.media)).data
}
export async function deleteMedia(id: string) {
  await apiClient.delete(PATHS.mediaFile(id))
}

// --- Reports ---
export async function getReports() {
  return (await apiClient.get<ReportsResponse>(PATHS.reports)).data
}
export async function generateReport(type: ShopReport['type']) {
  return (await apiClient.post<ShopReport>(PATHS.reports, { type })).data
}

// --- Shop Info (real GET/PUT /sellers/me) ---
// seller status (pending|approved|suspended) → shop ShopStatus (active|paused|suspended)
function mapSellerStatus(raw: string): ShopInfoProfile['status'] {
  if (raw === 'suspended') return 'suspended'
  if (raw === 'approved') return 'active'
  return 'paused' // pending (or unknown) → paused
}

// Normalize backend {uz?,ru?,en?} (may be {} or null) → full MultiLang client shape.
function toMultiLang(map: BackendLangMap | null | undefined): MultiLang {
  return { uz: map?.uz ?? '', ru: map?.ru ?? '', en: map?.en ?? '' }
}

// Maps the real GET /sellers/me rich DTO into the ShopInfoProfile client model.
// description/logo_url/banner_url are now real fields — no longer defaulted-empty.
function mapSellersMeToShopInfo(dto: SellersMeDto): ShopInfoProfile {
  return {
    id: dto.id,
    name: dto.shop_name ?? '',
    logoUrl: dto.logo_url ?? null,
    bannerUrl: dto.banner_url ?? null,
    description: toMultiLang(dto.description),
    status: mapSellerStatus(dto.status),
    vatPercent: dto.vat_percent ?? 0,
    productCount: dto.product_count ?? 0,
    registeredAt: dto.registered_at ?? dto.created_at ?? '',
  }
}

const EMPTY_SHOP_INFO: ShopInfoProfile = {
  id: '',
  name: '',
  logoUrl: null,
  bannerUrl: null,
  description: { uz: '', ru: '', en: '' },
  status: 'active',
  vatPercent: 0,
  productCount: 0,
  registeredAt: '',
}

export async function getShopInfo(): Promise<ShopInfoProfile> {
  try {
    const { data } = await apiClient.get<SellersMeDto>(PATHS.sellersMe)
    return mapSellersMeToShopInfo(data)
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.code === 'not_a_seller')) {
      // Account has no seller row yet — return an empty profile rather than throwing.
      return { ...EMPTY_SHOP_INFO }
    }
    throw err
  }
}

// ✅ Real route: PUT /sellers/me  body {shop_name?, description?, logo_url?, banner_url?} → {updated:true}.
// A logo/banner URL not under the R2 base → 400 {error:"invalid_media_url"}; the axios interceptor
// turns that into an ApiError(code='invalid_media_url'), which the UI surfaces via tError(code).
// PUT returns only {updated:true}, so we re-read GET /sellers/me to return the fresh profile.
export async function patchShopInfo(payload: ShopInfoUpdate): Promise<ShopInfoProfile> {
  const body: SellersMeUpdateDto = {}
  if (payload.name !== undefined) body.shop_name = payload.name
  if (payload.description !== undefined) body.description = payload.description
  if (payload.logoUrl !== undefined && payload.logoUrl !== null) body.logo_url = payload.logoUrl
  if (payload.bannerUrl !== undefined && payload.bannerUrl !== null) body.banner_url = payload.bannerUrl
  await apiClient.put<{ updated: boolean }>(PATHS.sellersMe, body)
  return getShopInfo()
}

// Maps GET /sellers/me/kyc snake_case DTO → ShopKyc camelCase client model.
function mapKycDto(dto: ShopKycDto): ShopKyc {
  return {
    status: (dto.status as ShopKyc['status']) ?? 'pending',
    submittedAt: dto.submitted_at ?? '',
    verificationMethod: dto.verification_method ?? '',
    sellerType: (dto.seller_type as ShopKyc['sellerType']) ?? 'individual',
    fullName: dto.full_name ?? '',
    idType: (dto.id_type as ShopKyc['idType']) ?? 'passport',
    idLastFour: dto.id_last_four ?? '',
    addressMasked: dto.address_masked ?? '',
  }
}

export async function getShopKyc(): Promise<ShopKyc> {
  const { data } = await apiClient.get<ShopKycDto>(PATHS.shopKyc)
  return mapKycDto(data)
}

// --- Media upload (real POST /media/upload-url) ---
// kind: 'avatar' | 'product' | 'video'
// Returns {key, upload_url, public_url}.  Caller must then PUT binary to upload_url.
export async function requestMediaUploadUrl(
  contentType: string,
  kind: 'avatar' | 'product' | 'video' | 'logo' | 'banner',
): Promise<MediaUploadUrlResponse> {
  const { data } = await apiClient.post<MediaUploadUrlResponse>(PATHS.mediaUploadUrl, {
    content_type: contentType,
    kind,
  })
  return data
}

// Upload a file binary directly to the R2/S3 pre-signed URL (no auth header — direct PUT).
export async function uploadFileToPut(uploadUrl: string, file: File): Promise<void> {
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
}

// Convenience: full logo/banner upload flow.
// 1) POST /media/upload-url (kind 'avatar' for logo, 'product' for banner)
// 2) PUT the binary to the signed URL
// 3) return public_url to store via patchShopInfo({ logoUrl | bannerUrl }).
export async function uploadShopImage(
  file: File,
  kind: 'avatar' | 'product' | 'logo' | 'banner',
): Promise<string> {
  const { upload_url, public_url } = await requestMediaUploadUrl(file.type, kind)
  await uploadFileToPut(upload_url, file)
  return public_url
}

// --- Decoration adapters ---
function mapDecorationDraftDto(dto: DecorationDraftDto): DecorationDraft {
  return {
    id: dto.id,
    name: dto.name,
    platform: dto.platform as DecorationDraft['platform'],
    status: dto.status as DecorationDraft['status'],
    updatedAt: dto.updated_at,
  }
}

function mapDecorationContentDto(dto: DecorationContentDto): DecorationContent {
  return {
    id: dto.id,
    name: dto.name,
    platform: dto.platform as DecorationContent['platform'],
    status: dto.status as DecorationContent['status'],
    updatedAt: dto.updated_at,
    publishedAt: dto.published_at ?? null,
    widgets: (dto.widgets ?? []).map((w) => ({
      id: w.id,
      type: w.type as Widget['type'],
      order: w.order,
      config: w.config,
    })),
  }
}

// --- Decoration drafts ---
export async function getDecorationDrafts(platform: string): Promise<DecorationDraft[]> {
  const { data } = await apiClient.get<DecorationDraftDto[]>(PATHS.decorationDrafts, {
    params: { platform },
  })
  return (data ?? []).map(mapDecorationDraftDto)
}

export async function getDecorationById(id: string): Promise<DecorationContent> {
  const { data } = await apiClient.get<DecorationContentDto>(PATHS.decorationById(id))
  return mapDecorationContentDto(data)
}

export async function saveDecorationDraft(
  id: string,
  widgets: DecorationContent['widgets'],
): Promise<DecorationContent> {
  const { data } = await apiClient.put<DecorationContentDto>(PATHS.decorationDraftSave(id), {
    widgets,
  })
  return mapDecorationContentDto(data)
}

export async function publishDecoration(id: string): Promise<DecorationContent> {
  const { data } = await apiClient.post<DecorationContentDto>(PATHS.decorationPublish(id))
  return mapDecorationContentDto(data)
}

// --- Top Picks adapters ---
function mapTopPicksCollectionDto(dto: TopPicksCollectionDto): TopPicksCollection {
  return {
    id: dto.id,
    name: dto.name,
    isDisplayed: dto.is_displayed ?? false,
    displayOrder: dto.display_order ?? 0,
    productCount: dto.product_count ?? 0,
  }
}

function mapTopPicksDetailDto(dto: TopPicksDetailDto): TopPicksDetail {
  return {
    id: dto.id,
    name: dto.name,
    isDisplayed: dto.is_displayed ?? false,
    allowPersonalization: dto.allow_personalization ?? false,
    products: (dto.products ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      priceUzs: p.price_uzs ?? 0,
      salesCount: p.sales_count ?? 0,
      imageUrl: p.image_url ?? null,
      isAbnormal: p.is_abnormal ?? false,
    })),
  }
}

// --- Top Picks ---
// Backend returns {collections, total, max} — unwrap to array.
export async function getTopPicks(): Promise<TopPicksCollection[]> {
  const { data } = await apiClient.get<TopPicksListDto>(PATHS.topPicks)
  return (data?.collections ?? []).map(mapTopPicksCollectionDto)
}

export async function getTopPicksDetail(id: string): Promise<TopPicksDetail> {
  const { data } = await apiClient.get<TopPicksDetailDto>(PATHS.topPicksById(id))
  return mapTopPicksDetailDto(data)
}

// PATCH /sellers/me/shop/top-picks/{id}: send snake_case body derived from payload.
export async function patchTopPicksDetail(
  id: string,
  payload: Partial<TopPicksDetail>,
): Promise<TopPicksDetail> {
  const body: Partial<{
    name: string
    is_displayed: boolean
    allow_personalization: boolean
  }> = {}
  if (payload.name !== undefined) body.name = payload.name
  if (payload.isDisplayed !== undefined) body.is_displayed = payload.isDisplayed
  if (payload.allowPersonalization !== undefined) body.allow_personalization = payload.allowPersonalization
  const { data } = await apiClient.patch<TopPicksDetailDto>(PATHS.topPicksById(id), body)
  return mapTopPicksDetailDto(data)
}

// --- Appeals adapter ---
// Backend returns snake_case; FE Appeal type uses camelCase (appealType, updatedAt).
// Backend query param is 'category', FE AppealsQuery uses 'type'.
function mapAppealDto(dto: AppealDto): Appeal {
  return {
    id: dto.id,
    appealType: dto.appeal_type as Appeal['appealType'],
    status: dto.status as Appeal['status'],
    updatedAt: dto.updated_at,
  }
}

// --- Appeals ---
export async function getAppeals(query: AppealsQuery): Promise<AppealsListResponse> {
  // FE AppealsQuery.type maps to backend query param 'category'.
  const params: Record<string, string> = { category: query.type }
  if (query.status && query.status !== 'all') params.status = query.status as AppealStatus
  if (query.appealId) params.appeal_id = query.appealId
  if (query.appealTypeFilter) params.appeal_type = query.appealTypeFilter
  if (query.page) params.page = String(query.page)
  const { data } = await apiClient.get<AppealsListDto>(PATHS.appeals, { params })
  return {
    appeals: (data?.appeals ?? []).map(mapAppealDto),
    total: data?.total ?? 0,
  }
}

// --- Missions adapters ---
// title/description/reward_description may be {uz,ru,en} objects — pick 'en' with 'uz' fallback.
function pickLang(val: BackendLangMap | string | undefined | null): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  return val.en ?? val.uz ?? val.ru ?? ''
}

function mapMissionDto(dto: MissionDto): Mission {
  return {
    id: dto.id,
    title: pickLang(dto.title),
    description: pickLang(dto.description),
    rewardDescription: pickLang(dto.reward_description),
    status: (dto.status as Mission['status']) ?? 'not_started',
    tasks: (dto.tasks ?? []).map((t) => ({
      id: t.id,
      description: pickLang(t.description),
      isCompleted: t.is_completed ?? false,
    })),
  }
}

// --- Missions ---
export async function getMissions(): Promise<MissionsResponse> {
  const { data } = await apiClient.get<MissionsResponseDto>(PATHS.missions)
  return {
    missions: (data?.missions ?? []).map(mapMissionDto),
    introSeen: data?.intro_seen ?? false,
  }
}

// ✅ real: POST /sellers/me/missions/intro-seen → 204 No Content.
export async function markIntroSeen(): Promise<void> {
  await apiClient.post(PATHS.missionsIntroSeen)
}

// --- Rewards adapter ---
export async function getRewards(): Promise<RewardsResponse> {
  const { data } = await apiClient.get<RewardsResponseDto>(PATHS.rewards)
  return {
    rewards: (data?.rewards ?? []).map((r) => ({
      id: r.id,
      rewardType: r.reward_type as SellerReward['rewardType'],
      valueUzs: r.value_uzs ?? 0,
      expiresAt: r.expires_at ?? '',
      redeemedAt: r.redeemed_at ?? null,
      status: r.status as SellerReward['status'],
      // missionTitle not returned by backend — default to ''.
      missionTitle: '',
    })),
  }
}
