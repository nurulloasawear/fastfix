// Display helper for parcel weight (stored as kilograms). Up to 2 decimals, no
// trailing zeros, with a localized "kg" suffix appended by the caller via i18n if needed.
const nf = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 })

export function formatWeight(kg: number): string {
  return `${nf.format(kg)} kg`
}
