// File-size formatting for the media/reports views (sizes are integer bytes).
const KB = 1024
const MB = KB * 1024
const GB = MB * 1024

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null) return '—'
  if (bytes >= GB) return `${(bytes / GB).toFixed(1)} GB`
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`
  if (bytes >= KB) return `${Math.round(bytes / KB)} KB`
  return `${bytes} B`
}
