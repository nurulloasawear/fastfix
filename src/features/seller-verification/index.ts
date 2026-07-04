// Public API — pages import ONLY from here, never deep paths.
export { VerificationWizard } from './components/VerificationWizard'
export { sellerVerificationMessages } from './i18n'
export { useSellerStatus } from './api/seller-verification.queries'
export type {
  SellerStatus,
  VerificationStatus,
} from './types/seller-verification.types'
