import { useTranslation } from 'react-i18next'
import { ImageIcon } from './icons'
import type { DecorationBlock } from '../types/shop.types'

function BlockPreview({ block }: { block: DecorationBlock }) {
  const { t } = useTranslation()
  const label = t(`shop.decoration.types.${block.type}.preview`)

  if (block.type === 'carousel') {
    return (
      <div className="flex h-24 w-full flex-col items-center justify-center rounded-lg border border-warning bg-warning-bg p-2 text-center text-warning">
        <ImageIcon className="mb-1 h-5 w-5" />
        <span className="text-[11px] font-semibold">{label}</span>
      </div>
    )
  }
  if (block.type === 'banner') {
    return (
      <div className="flex h-16 w-full items-center justify-center rounded-lg bg-brand p-2 text-[11px] font-semibold text-white">
        {label}
      </div>
    )
  }
  if (block.type === 'video') {
    return (
      <div className="flex h-24 w-full items-center justify-center rounded-lg border border-border-strong bg-bg p-2 text-[11px] font-semibold text-brand">
        {label}
      </div>
    )
  }
  return (
    <div className="space-y-1.5">
      <span className="block text-[11px] font-semibold text-text">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-20 rounded-lg border border-border bg-bg" />
        <div className="h-20 rounded-lg border border-border bg-bg" />
      </div>
    </div>
  )
}

export function DecorationPreview({ blocks }: { blocks: DecorationBlock[] }) {
  const { t } = useTranslation()
  return (
    <div className="flex justify-center">
      <div className="relative flex h-[640px] w-[320px] flex-col overflow-hidden rounded-[40px] border-4 border-brand bg-brand p-3.5 shadow-2xl">
        <div className="absolute left-1/2 top-5 z-30 h-4 w-24 -translate-x-1/2 rounded-full bg-brand" />
        <div className="flex-1 space-y-4 overflow-y-auto rounded-[28px] bg-surface p-3 pt-6">
          <div className="flex items-center gap-3 rounded-xl bg-brand p-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
              O
            </div>
            <div>
              <h5 className="text-xs font-bold">OZB Official</h5>
              <span className="text-[10px] text-white/60">★ 4.8 | 12K {t('shop.decoration.subscribers')}</span>
            </div>
          </div>
          {blocks.map((block) => (
            <BlockPreview key={block.id} block={block} />
          ))}
        </div>
      </div>
    </div>
  )
}
