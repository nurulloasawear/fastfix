import { useTranslation } from 'react-i18next'
import { formatBytes } from './format'
import { ImageIcon, TrashIcon, VideoIcon } from './icons'
import { useDeleteMedia } from '../api/shop.queries'
import type { MediaFile } from '../types/shop.types'

type Props = { files: MediaFile[]; isLoading: boolean }

function MediaCard({ file }: { file: MediaFile }) {
  const { t } = useTranslation()
  const remove = useDeleteMedia()

  const onDelete = () => {
    if (confirm(t('shop.media.deleteConfirm'))) remove.mutate(file.id)
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-xs transition hover:shadow-md">
      <div className="relative aspect-square w-full overflow-hidden bg-bg">
        <img
          src={file.url}
          alt={file.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 rounded-lg bg-black/50 p-1.5 text-white backdrop-blur-sm">
          {file.type === 'image' ? (
            <ImageIcon className="h-3.5 w-3.5" />
          ) : (
            <VideoIcon className="h-3.5 w-3.5" />
          )}
        </div>
        {file.duration && (
          <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {file.duration}
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={onDelete}
            title={t('shop.media.remove')}
            className="rounded-lg bg-surface p-2 text-error shadow-md transition hover:bg-error-bg"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between space-y-1 p-3">
        <h4 className="truncate text-xs font-medium text-text" title={file.name}>
          {file.name}
        </h4>
        <div className="flex items-center justify-between text-[10px] font-medium text-muted">
          <span>{formatBytes(file.sizeBytes)}</span>
          {file.dimension && <span>{file.dimension}</span>}
        </div>
      </div>
    </div>
  )
}

export function MediaGrid({ files, isLoading }: Props) {
  const { t } = useTranslation()
  if (isLoading) return <div className="p-6 text-sm text-muted">{t('common.loading')}</div>
  if (files.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-surface p-16 text-center text-sm text-muted">
        {t('shop.media.empty')}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {files.map((file) => (
        <MediaCard key={file.id} file={file} />
      ))}
    </div>
  )
}
