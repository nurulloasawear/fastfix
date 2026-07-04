// jobNotify — track AI-import jobs the seller started so we can notify them when the
// batch is ready (even after navigating away), via the browser Notification API + a
// toast. Pending ids persist in localStorage so a reload/return still gets notified.
// Foreground/background-tab only (no service worker / push when the site is closed).

const KEY = 'ozb_pending_ai_jobs'

export function getPendingJobs(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

function save(ids: string[]) {
  try { localStorage.setItem(KEY, JSON.stringify(ids)) } catch { /* quota/private mode */ }
}

export function addPendingJob(id: string) {
  const s = new Set(getPendingJobs())
  s.add(id)
  save([...s])
}

export function removePendingJob(id: string) {
  save(getPendingJobs().filter((x) => x !== id))
}

// Ask once (must be called from a user gesture, e.g. the upload click).
export function ensureNotifyPermission() {
  if (typeof Notification === 'undefined') return
  if (Notification.permission === 'default') void Notification.requestPermission()
}

// Show an OS notification that deep-links to the review page; no-op if not granted.
export function showJobNotification(title: string, body: string, url: string) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
  try {
    const n = new Notification(title, { body, tag: 'ozb-ai-import' })
    n.onclick = () => { window.focus(); window.location.href = url }
  } catch {
    // Some mobile browsers require ServiceWorkerRegistration.showNotification; ignore.
  }
}
