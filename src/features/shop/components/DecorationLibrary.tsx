import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { ImageIcon, PlusIcon, VideoIcon } from './icons'
import type { BlockType } from '../types/shop.types'

const LIBRARY: { type: BlockType; iconClass: string; icon: 'image' | 'video' }[] = [
  { type: 'carousel',      iconClass: 'bg-warning-bg text-warning',     icon: 'image' },
  { type: 'banner',        iconClass: 'bg-bg text-text-secondary',       icon: 'image' },
  { type: 'products_grid', iconClass: 'bg-success-bg text-success',      icon: 'image' },
  { type: 'video',         iconClass: 'bg-bg text-brand',                icon: 'video' },
]

export function DecorationLibrary({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const { t } = useTranslation()
  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-semibold text-text">{t('shop.decoration.library')}</h3>
      <div className="grid grid-cols-1 gap-3">
        {LIBRARY.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => onAdd(item.type)}
            className="group flex items-center justify-between rounded-lg border border-border p-3 text-left transition hover:border-brand hover:bg-bg"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.iconClass}`}>
                {item.icon === 'image' ? (
                  <ImageIcon className="h-5 w-5" />
                ) : (
                  <VideoIcon className="h-5 w-5" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text">
                  {t(`shop.decoration.types.${item.type}.name`)}
                </h4>
                <p className="text-xs text-muted">{t(`shop.decoration.types.${item.type}.hint`)}</p>
              </div>
            </div>
            <PlusIcon className="h-4 w-4 text-muted transition group-hover:text-brand" />
          </button>
        ))}
      </div>
    </Card>
  )
}
