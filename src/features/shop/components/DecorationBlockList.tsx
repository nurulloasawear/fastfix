import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from './icons'
import type { DecorationBlock } from '../types/shop.types'

type Props = {
  blocks: DecorationBlock[]
  onMove: (index: number, dir: -1 | 1) => void
  onRemove: (id: string) => void
}

export function DecorationBlockList({ blocks, onMove, onRemove }: Props) {
  const { t } = useTranslation()
  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-semibold text-text">{t('shop.decoration.hierarchy')}</h3>
      {blocks.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-border bg-bg py-12 text-center text-sm text-muted">
          {t('shop.decoration.empty')}
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              className="flex items-center justify-between rounded-lg border border-border bg-bg p-4"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted">
                  {t('shop.decoration.block')} #{index + 1}
                </span>
                <h4 className="text-sm font-semibold text-text">{block.title}</h4>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onMove(index, -1)}
                  disabled={index === 0}
                  title={t('shop.decoration.moveUp')}
                  className="rounded-lg p-1.5 text-muted transition hover:bg-border disabled:opacity-30"
                >
                  <ArrowUpIcon />
                </button>
                <button
                  type="button"
                  onClick={() => onMove(index, 1)}
                  disabled={index === blocks.length - 1}
                  title={t('shop.decoration.moveDown')}
                  className="rounded-lg p-1.5 text-muted transition hover:bg-border disabled:opacity-30"
                >
                  <ArrowDownIcon />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(block.id)}
                  title={t('shop.decoration.remove')}
                  className="rounded-lg p-1.5 text-error transition hover:bg-error-bg"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
