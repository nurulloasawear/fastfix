import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { CopyIcon } from './icons'

type Props = {
  rtmpUrl: string
  streamKey: string
  copied: 'url' | 'key' | null
  onCopy: (value: string, field: 'url' | 'key') => void
}

export function ObsSetupGuide({ rtmpUrl, streamKey, copied, onCopy }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 py-6">
      <p className="text-center text-sm font-semibold text-white">
        {t('live.preview.setupTitle')}
      </p>

      {/* 5-step guide circles */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex flex-col items-center gap-1.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/80 text-lg font-bold text-white shadow-md">
              {step}
            </div>
            <p className="max-w-[100px] text-center text-[10px] text-white/60">
              {t(`live.preview.step${step}`)}
            </p>
          </div>
        ))}
      </div>

      {/* URL + Key box — dark ingest panel; numeric hex colors intentional (dark canvas) */}
      <div className="w-full max-w-xl rounded-xl border border-white/10 bg-white/5 p-4">
        {/* URL row */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="w-10 shrink-0 text-xs font-semibold text-white/50">
            {t('live.preview.urlLabel')}
          </span>
          <span className="flex-1 truncate text-xs text-white">{rtmpUrl}</span>
          <Button size="sm" onClick={() => onCopy(rtmpUrl, 'url')}>
            <CopyIcon size={12} />
            {copied === 'url' ? '✓' : t('live.preview.copy')}
          </Button>
        </div>
        {/* Key row */}
        <div className="flex items-center gap-2 pt-3">
          <span className="w-10 shrink-0 text-xs font-semibold text-white/50">
            {t('live.preview.keyLabel')}
          </span>
          <span className="flex-1 truncate text-xs text-white">{streamKey}</span>
          <Button size="sm" onClick={() => onCopy(streamKey, 'key')}>
            <CopyIcon size={12} />
            {copied === 'key' ? '✓' : t('live.preview.copy')}
          </Button>
        </div>
      </div>
    </div>
  )
}
