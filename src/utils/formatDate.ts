// Human-readable date/time formatting.
// QA (OD-014, RT/RTS dates) wants "18.06.2026 11:15" instead of raw ISO strings.

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

/** "DD.MM.YYYY HH:MM" — e.g. 18.06.2026 11:15. Empty string for missing/invalid input. */
export function formatDateTime(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** "DD.MM.YYYY" — date only. */
export function formatDate(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
}
