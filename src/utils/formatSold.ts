import type { Language } from '@/i18n'

// "294 sotildi" / "294 продано" / "294 sold". Empty when nothing sold.
// >= 1000 compacts with FLOOR (1990 → 1.9k, never 2k) so sales are never overstated.

const SOLD_WORD: Record<Language, string> = {
  uz: 'sotildi',
  ru: 'продано',
  en: 'sold',
}

const UNITS = [
  { v: 1_000_000_000, s: 'b' },
  { v: 1_000_000, s: 'm' },
  { v: 1_000, s: 'k' },
] as const

function compact(n: number): string {
  for (const { v, s } of UNITS) {
    if (n >= v) {
      const scaled = Math.floor((n / v) * 10) / 10 // floor to 1 decimal
      const text = scaled % 1 === 0 ? String(scaled) : scaled.toFixed(1)
      return `${text}${s}`
    }
  }
  return String(n)
}

export function formatSold(count: number | null | undefined, lang: Language): string {
  if (!count || count <= 0) return ''
  return `${compact(count)} ${SOLD_WORD[lang]}`
}
