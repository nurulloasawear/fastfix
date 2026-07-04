import type { Language } from '@/i18n'

// Backend stores i18n content (product title/description, etc.) as JSON {uz,ru,en}.
// Mirror ozb-mobileʻs pickLang: resolve a display string with uz→ru→en fallback.
// Accepts a plain string too, so itʻs safe during the transition to LangMap fields.
export type LangMap = Partial<Record<Language, string>>

export function pickLang(value: LangMap | string | null | undefined, lang: Language): string {
  if (typeof value === 'string') return value
  if (!value) return ''
  return value[lang] || value.uz || value.ru || value.en || ''
}
