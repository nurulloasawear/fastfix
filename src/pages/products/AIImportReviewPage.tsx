import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Language } from '@/i18n'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Th, Tr } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { toast } from '@/components/ui/Toast'
import { useAIImportItems, useDecideAIImportJob } from '@/features/products'
import { FileX2 } from '@/features/products/components/icons'
import { AIImportReviewRow } from './AIImportReviewRow'

export function AIImportReviewPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language
  const { jobId = '' } = useParams()
  const { data, isLoading } = useAIImportItems(jobId)
  const bulk = useDecideAIImportJob(jobId)

  const counts = data?.job.counts
  const pending = data?.items.filter((i) => i.status === 'ai_review') ?? []
  const readyCount = pending.filter((i) => i.missing.length === 0).length

  async function bulkDo(decision: 'approve' | 'draft' | 'reject') {
    try {
      const res = await bulk.mutateAsync(decision)
      if (decision === 'approve') {
        toast.success(t('products.review.bulkApproved', { n: res.decided, skipped: res.skipped }))
      } else {
        toast.success(t('products.review.bulkDone', { n: res.decided }))
      }
    } catch {
      toast.error(t('products.review.actionFailed'))
    }
  }

  return (
    <Page>
      <PageHeader
        title={t('products.review.title')}
        breadcrumb={`${t('products.home')} › ${t('products.title')} › ${t('products.mass.title')} › ${t('products.review.title')}`}
      />

      <Card className="p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-text">{data?.job.fileName}</p>
            {counts && (
              <p className="mt-0.5 text-xs text-muted">
                {t('products.review.summary', {
                  pending: counts.pending, published: counts.published, draft: counts.draft, rejected: counts.rejected,
                })}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/products/mass-upload"><Button variant="outline" size="sm">{t('products.review.back')}</Button></Link>
            <Button size="sm" disabled={bulk.isPending || readyCount === 0} onClick={() => bulkDo('approve')}>
              {t('products.review.approveAll', { n: readyCount })}
            </Button>
            <Button variant="outline" size="sm" disabled={bulk.isPending || pending.length === 0} onClick={() => bulkDo('draft')}>
              {t('products.review.draftAll')}
            </Button>
            <Button variant="outline" size="sm" disabled={bulk.isPending || pending.length === 0} onClick={() => bulkDo('reject')}>
              {t('products.review.rejectAll')}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12"><Spinner /></div>
        ) : !data || data.items.length === 0 ? (
          <EmptyState icon={<FileX2 size={32} />} title={t('products.review.empty')} />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <thead>
                <Tr>
                  <Th>{t('products.review.col.image')}</Th>
                  <Th>{t('products.review.col.name')}</Th>
                  <Th>{t('products.review.col.category')}</Th>
                  <Th>{t('products.review.col.brand')}</Th>
                  <Th>{t('products.review.col.priceOne')}</Th>
                  <Th>{t('products.review.col.stock')}</Th>
                  <Th>{t('products.review.col.state')}</Th>
                  <Th>{t('products.review.col.actions')}</Th>
                </Tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <AIImportReviewRow key={item.id} item={item} jobId={jobId} lang={lang} />
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>
    </Page>
  )
}
