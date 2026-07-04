const nf = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })

// Money is integer UZS end-to-end (backend is source of truth). Clients only format.
export function formatUZS(amount: number): string {
  return `${nf.format(amount)} soʻm`
}
