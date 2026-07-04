import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from '@/components/ui/Toast'
import { getPendingJobs, removePendingJob, showJobNotification } from '@/lib/jobNotify'
import { useAIImportJobs } from '../api/products.queries'

// Global watcher (mount once in the app shell): when an AI-import job the seller
// started finishes, fire a toast + browser notification linking to its review page.
// useAIImportJobs already polls while any job is pending/processing.
export function useJobNotifier() {
  const { t } = useTranslation()
  const { data: jobs = [] } = useAIImportJobs()
  const notified = useRef<Set<string>>(new Set())

  useEffect(() => {
    const pending = new Set(getPendingJobs())
    if (pending.size === 0) return
    for (const j of jobs) {
      if (!pending.has(j.id) || notified.current.has(j.id)) continue
      if (j.status !== 'done' && j.status !== 'failed') continue
      notified.current.add(j.id)
      removePendingJob(j.id)
      if (j.status === 'failed') {
        toast.error(t('products.review.notifyFailed'))
        continue
      }
      const url = `/products/ai-import/${j.id}/review`
      toast.success(t('products.review.notifyReady', { n: j.createdCount }))
      showJobNotification(
        t('products.review.notifyTitle'),
        t('products.review.notifyBody', { n: j.createdCount }),
        window.location.origin + url,
      )
    }
  }, [jobs, t])
}
