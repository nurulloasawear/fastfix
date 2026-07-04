import { useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { toast } from '@/components/ui/Toast'
import {
  downloadMassTemplate, useMassUploadJobs, useUploadMassFile,
  useAIImportJobs, useUploadAIImport,
} from '@/features/products'
import { Sparkles, UploadCloud } from '@/features/products/components/icons'
import { addPendingJob, ensureNotifyPermission } from '@/lib/jobNotify'
import { MassJobsTable } from './MassJobsTable'

type Tab = 'download' | 'upload' | 'ai'

// Dropzone — drag-drop OR click anywhere (incl. the button) opens the file picker.
// The <input> is a SIBLING of the clickable div (not a child) so programmatically
// clicking it never bubbles back into the div's onClick (no double/looping dialog).
function Dropzone({ icon, title, hint, busy, busyLabel, selectLabel, onPick }: {
  icon: ReactNode; title: string; hint: string
  busy: boolean; busyLabel: string; selectLabel: string
  onPick: (file?: File | null) => void | Promise<void>
}) {
  const ref = useRef<HTMLInputElement>(null)
  const open = () => ref.current?.click()
  return (
    <>
      <input
        ref={ref} type="file" accept=".xlsx" hidden
        onChange={(e) => { const f = e.target.files?.[0]; if (ref.current) ref.current.value = ''; void onPick(f) }}
      />
      <div
        role="button" tabIndex={0}
        onClick={open}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() } }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); void onPick(e.dataTransfer.files?.[0]) }}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-strong bg-bg py-12 text-center transition-colors hover:border-brand"
      >
        {icon}
        <p className="text-sm text-text">{title}</p>
        <p className="text-xs text-muted">{hint}</p>
        <span className="mt-2">
          <Button type="button" disabled={busy} onClick={(e) => { e.stopPropagation(); open() }}>
            {busy ? busyLabel : selectLabel}
          </Button>
        </span>
      </div>
    </>
  )
}

export function MassUploadPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('download')
  const [busy, setBusy] = useState(false)
  const { data: jobs = [], isLoading } = useMassUploadJobs()
  const { data: aiJobs = [], isLoading: aiLoading } = useAIImportJobs()
  const upload = useUploadMassFile()
  const aiUpload = useUploadAIImport()

  async function onDownload() {
    setBusy(true)
    try {
      const url = await downloadMassTemplate()
      const a = document.createElement('a')
      a.href = url
      a.rel = 'noopener'
      a.click()
    } catch {
      toast.error(t('products.mass.downloadFailed'))
    } finally {
      setBusy(false)
    }
  }

  function validFile(file?: File | null): file is File {
    if (!file) return false
    if (!file.name.toLowerCase().endsWith('.xlsx')) { toast.error(t('products.mass.onlyXlsx')); return false }
    if (file.size > 3 * 1024 * 1024) { toast.error(t('products.mass.tooLarge')); return false }
    return true
  }

  async function onFile(file?: File | null) {
    if (!validFile(file)) return
    try {
      await upload.mutateAsync(file)
      toast.success(t('products.mass.uploaded'))
    } catch {
      toast.error(t('products.mass.uploadFailed'))
    }
  }

  async function onAIFile(file?: File | null) {
    if (!validFile(file)) return
    try {
      const { jobId } = await aiUpload.mutateAsync(file)
      addPendingJob(jobId) // so we notify when this batch is ready (even after leaving)
      ensureNotifyPermission() // user gesture → ask to enable browser notifications
      toast.success(t('products.mass.aiUploaded'))
    } catch {
      toast.error(t('products.mass.uploadFailed'))
    }
  }

  const tabBtn = (id: Tab, label: string, badge?: string) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={`flex items-center gap-1.5 border-b-2 px-1 pb-2 text-sm font-semibold transition-colors ${
        tab === id ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-text'
      }`}
    >
      {label}
      {badge && <Badge tone="info">{badge}</Badge>}
    </button>
  )

  return (
    <Page>
      <PageHeader title={t('products.mass.title')} breadcrumb={`${t('products.home')} › ${t('products.title')} › ${t('products.mass.title')}`} />

      <Card className="p-6">
        <div className="mb-5 flex gap-6 border-b border-border">
          {tabBtn('download', t('products.mass.downloadTab'))}
          {tabBtn('upload', t('products.mass.uploadTab'))}
          {tabBtn('ai', t('products.mass.aiTab'), t('products.mass.aiBeta'))}
        </div>

        {tab === 'download' && (
          <div className="flex max-w-2xl flex-col gap-4">
            <div className="rounded-lg border border-brand bg-brand/5 p-4">
              <p className="text-sm font-semibold text-text">{t('products.mass.basicTemplate')}</p>
              <p className="mt-1 text-sm text-muted">{t('products.mass.basicDesc')}</p>
            </div>
            <ul className="list-disc pl-5 text-sm text-muted">
              <li>{t('products.mass.tipTrilingual')}</li>
              <li>{t('products.mass.tipCategory')}</li>
              <li>{t('products.mass.tipVariants')}</li>
              <li>{t('products.mass.tipSizeChart')}</li>
            </ul>
            <div>
              <Button onClick={onDownload} disabled={busy}>{busy ? t('products.mass.preparing') : t('products.mass.download')}</Button>
            </div>
          </div>
        )}

        {tab === 'upload' && (
          <div className="flex flex-col gap-6">
            <Dropzone
              icon={<UploadCloud size={36} className="text-muted" />}
              title={t('products.mass.dropHere')}
              hint={t('products.mass.maxSize')}
              busy={upload.isPending}
              busyLabel={t('products.mass.uploading')}
              selectLabel={t('products.mass.selectFile')}
              onPick={onFile}
            />
            <div>
              <h3 className="mb-1 text-base font-semibold text-text">{t('products.mass.records')}</h3>
              <p className="mb-3 text-sm text-muted">{t('products.mass.recordsHint')}</p>
              <MassJobsTable jobs={jobs} isLoading={isLoading} />
            </div>
          </div>
        )}

        {tab === 'ai' && (
          <div className="flex flex-col gap-6">
            <div className="rounded-lg border border-brand bg-brand/5 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-text">
                <Sparkles size={16} className="text-brand" />{t('products.mass.aiHeading')}
              </p>
              <p className="mt-1 text-sm text-muted">{t('products.mass.aiDesc')}</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted">
                <li>{t('products.mass.aiNote1')}</li>
                <li>{t('products.mass.aiNote2')}</li>
                <li>{t('products.mass.aiNote3')}</li>
              </ul>
            </div>
            <Dropzone
              icon={<Sparkles size={36} className="text-brand" />}
              title={t('products.mass.aiDrop')}
              hint={t('products.mass.maxSize')}
              busy={aiUpload.isPending}
              busyLabel={t('products.mass.aiGenerating')}
              selectLabel={t('products.mass.selectFile')}
              onPick={onAIFile}
            />
            <div>
              <h3 className="mb-1 text-base font-semibold text-text">{t('products.mass.records')}</h3>
              <p className="mb-3 text-sm text-muted">{t('products.review.recordsHint')}</p>
              <MassJobsTable jobs={aiJobs} isLoading={aiLoading} onRowClick={(id) => navigate(`/products/ai-import/${id}/review`)} />
            </div>
          </div>
        )}
      </Card>
    </Page>
  )
}
