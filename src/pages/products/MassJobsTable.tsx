import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { FileX2 } from '@/features/products/components/icons'
import type { MassUploadJob } from '@/features/products'

const TONE: Record<MassUploadJob['status'], 'info' | 'warning' | 'success' | 'error'> = {
  pending: 'info', processing: 'warning', done: 'success', failed: 'error',
}

// Shared history table for both Mass Upload and AI Import (same job shape).
// onRowClick (AI Import only) makes a finished row open its review batch.
export function MassJobsTable({ jobs, isLoading, onRowClick }: {
  jobs: MassUploadJob[]
  isLoading: boolean
  onRowClick?: (jobId: string) => void
}) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState<string | null>(null)
  const openable = (j: MassUploadJob) => !!onRowClick && (j.status === 'done' || j.status === 'processing') && j.createdCount > 0

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      {isLoading ? (
        <div className="flex justify-center p-10"><Spinner /></div>
      ) : jobs.length === 0 ? (
        <EmptyState icon={<FileX2 size={32} />} title={t('products.mass.noHistory')} />
      ) : (
        <Table>
          <thead>
            <Tr>
              <Th>{t('products.mass.colDate')}</Th>
              <Th>{t('products.mass.colFile')}</Th>
              <Th>{t('products.mass.colProducts')}</Th>
              <Th>{t('products.col.status')}</Th>
              <Th></Th>
            </Tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <Fragment key={j.id}>
                <Tr
                  className={openable(j) ? 'cursor-pointer hover:bg-surface-hover' : undefined}
                  onClick={openable(j) ? () => onRowClick!(j.id) : undefined}
                >
                  <Td className="text-xs text-muted">{j.createdAt?.slice(0, 19).replace('T', ' ')}</Td>
                  <Td className="text-sm">{j.fileName}</Td>
                  <Td className="text-xs">{j.createdCount}/{j.total}</Td>
                  <Td><Badge tone={TONE[j.status]}>{t(`products.mass.st.${j.status}`)}</Badge></Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      {j.failedCount > 0 && (
                        <button type="button" className="text-xs font-medium text-error" onClick={(e) => { e.stopPropagation(); setExpanded(expanded === j.id ? null : j.id) }}>
                          {t('products.mass.viewErrors', { n: j.failedCount })}
                        </button>
                      )}
                      {openable(j) && (
                        <span className="text-xs font-semibold text-brand">{t('products.review.open')} →</span>
                      )}
                    </div>
                  </Td>
                </Tr>
                {expanded === j.id && j.errors.length > 0 && (
                  <Tr>
                    <Td className="bg-bg text-xs text-muted">{/* spacer */}</Td>
                    <td colSpan={4} className="bg-bg px-3 py-2">
                      <ul className="list-disc pl-5 text-xs text-error">
                        {j.errors.map((e, i) => (
                          <li key={i}>{t('products.mass.rowLabel', { row: e.row })}: {e.message}</li>
                        ))}
                      </ul>
                    </td>
                  </Tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}
