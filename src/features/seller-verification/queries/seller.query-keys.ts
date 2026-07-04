/**
 * ============================================================================
 * Seller Verification Query Keys
 * ============================================================================
 *
 * React Query cache keys.
 *
 * Ushbu faylning vazifasi:
 *
 *  - Query keylarni bitta joyda saqlash
 *  - Cache collision oldini olish
 *  - invalidateQueries() ni oson qilish
 *  - setQueryData() uchun yagona source bo'lish
 *
 * Misol:
 *
 * useQuery({   
 *    queryKey: sellerKeys.profile(),
 *    queryFn: getSellerProfile,
 * })
 *
 * useMutation({
 *    ...
 *    onSuccess: () => {
 *        qc.invalidateQueries({
 *            queryKey: sellerKeys.profile(),
 *        })
 *    }
 * })
 *
 * Muhim:
 * Query Key hech qachon qo'lda yozilmaydi.
 *
 * ❌ ['seller', 'profile']
 *
 * ✔ sellerKeys.profile()
 *
 * React Query Best Practice.
 * ============================================================================
 */

export const sellerKeys = {
  /**
   * Root key
   *
   * Barcha seller verification cache lar
   * shu key ostida joylashadi.
   */
  all: ['seller-verification'] as const,

  /**
   * Seller Profile
   *
   * GET /seller/profile
   */
  profile: () => [...sellerKeys.all, 'profile'] as const,

  /**
   * Seller Verification Status
   *
   * GET /seller/status
   */
  status: () => [...sellerKeys.all, 'status'] as const,

  /**
   * Email Verification
   *
   * GET /seller/email/status
   */
  email: () => [...sellerKeys.all, 'email'] as const,

  /**
   * Passport (MyID)
   *
   * GET /seller/passport/status
   */
  passport: () => [...sellerKeys.all, 'passport'] as const,

  /**
   * INN Verification
   *
   * GET /seller/inn/status
   */
  inn: () => [...sellerKeys.all, 'inn'] as const,

  /**
   * Bank Information
   *
   * GET /seller/bank
   */
  bank: () => [...sellerKeys.all, 'bank'] as const,

  /**
   * Company Information
   *
   * GET /seller/company
   */
  company: () => [...sellerKeys.all, 'company'] as const,

  /**
   * Uploaded Certificates
   *
   * GET /seller/certificates
   */
  certificates: () => [...sellerKeys.all, 'certificates'] as const,

  /**
   * Single Certificate
   *
   * Kerak bo'lsa detail page uchun.
   */
  certificate: (id: string) =>
    [...sellerKeys.all, 'certificate', id] as const,
}

/**
 * Re-export
 *
 * import { sellerKeys } from './seller.query-keys'
 */
export { sellerKeys as default }