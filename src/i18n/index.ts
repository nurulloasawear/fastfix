import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { uz } from './locales/uz'
import { ru } from './locales/ru'
import { en } from './locales/en'
// Import messages from each featureʻs i18n module directly (NOT the barrel) so the
// eager main chunk stays small — barrels would pull every featureʻs components in.
import { productsMessages } from '@/features/products/i18n'
import { ordersMessages } from '@/features/orders/i18n'
import { financeMessages } from '@/features/finance/i18n'
import { shopMessages } from '@/features/shop/i18n'
import { discountsMessages } from '@/features/discounts/i18n'
import { marketingMessages } from '@/features/marketing/i18n'
import { promotionsMessages } from '@/features/promotions/i18n'
import { shipmentMessages } from '@/features/shipment/i18n'
import { notificationsMessages } from '@/features/notifications/i18n'
import { customerServiceMessages } from '@/features/customer-service/i18n'
import { settingMessages } from '@/features/setting/i18n'
import { insightsMessages } from '@/features/insights/i18n'
import { accountHealthMessages } from '@/features/account-health/i18n'
import { homeMessages } from '@/features/home/i18n'
import { liveMessages } from '@/features/live/i18n'
import { goLiveMessages } from '@/features/golive/i18n'
import { authMessages } from '@/features/auth/i18n'
import { sellerVerificationMessages } from '@/features/seller-verification/i18n'
import { errorsMessages } from './errors'

export const LANGUAGES = ['uz', 'ru', 'en'] as const
export type Language = (typeof LANGUAGES)[number]

const base = { uz, ru, en }

// Each feature owns its strings, pre-wrapped under its namespace ({ orders: {...} } etc.).
// products exposes its keys directly, so itʻs assigned to `products`.
function translationFor(lng: Language) {
  return {
    ...base[lng],
    ...ordersMessages[lng],
    ...financeMessages[lng],
    ...shopMessages[lng],
    ...discountsMessages[lng],
    ...marketingMessages[lng],
    ...promotionsMessages[lng],
    ...shipmentMessages[lng],
    ...notificationsMessages[lng],
    ...customerServiceMessages[lng],
    ...settingMessages[lng],
    ...insightsMessages[lng],
    ...accountHealthMessages[lng],
    ...homeMessages[lng],
    ...liveMessages[lng],
    ...goLiveMessages[lng],
    ...authMessages[lng],
    ...sellerVerificationMessages[lng],
    products: productsMessages[lng],
    errors: errorsMessages[lng],
  }
}

const STORAGE_KEY = 'ozb_seller_lang'

function initialLang(): Language {
  const saved = localStorage.getItem(STORAGE_KEY)
  return (LANGUAGES as readonly string[]).includes(saved ?? '') ? (saved as Language) : 'uz'
}

void i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: translationFor('uz') },
    ru: { translation: translationFor('ru') },
    en: { translation: translationFor('en') },
  },
  lng: initialLang(),
  fallbackLng: ['uz', 'ru', 'en'],
  interpolation: { escapeValue: false },
})

export function setLanguage(lang: Language) {
  localStorage.setItem(STORAGE_KEY, lang)
  void i18n.changeLanguage(lang)
}

// Map a backend stable error code (ApiError.code) to localized text.
export function tError(code: string): string {
  return i18n.t(`errors.${code}`, { defaultValue: i18n.t('errors.internal_error') })
}

export default i18n
