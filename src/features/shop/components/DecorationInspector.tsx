// Inspector panel and action buttons for the Decoration Editor right column.
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Textarea } from '@/components/ui/Textarea'
import type { Widget } from '../types/shop.types'
import { ArrowUpIcon, ArrowDownIcon, TrashIcon } from './icons'

export function InspectorPanel({ widget }: { widget: Widget | null }) {
  const { t } = useTranslation()

  if (!widget) {
    return (
      <EmptyState
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6" aria-hidden="true">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2" />
          </svg>
        }
        title={t('shop.decoration.inspectorEmpty')}
        description={t('shop.decoration.inspectorHint')}
        className="py-10"
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg bg-bg px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
          {t('shop.decoration.inspectorType')}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-text">{widget.type.replace(/_/g, ' ')}</p>
      </div>
      <Textarea
        label={t('shop.decoration.inspectorNote')}
        placeholder={t('shop.decoration.inspectorNotePlaceholder')}
        className="min-h-[64px] text-xs"
      />
      <p className="text-[10px] text-muted">{t('shop.decoration.inspectorNoConfig')}</p>
    </div>
  )
}

type InspectorActionsProps = {
  widget: Widget
  isFirst: boolean
  isLast: boolean
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onRemove: (id: string) => void
}

export function InspectorActions({ widget, isFirst, isLast, onMoveUp, onMoveDown, onRemove }: InspectorActionsProps) {
  const { t } = useTranslation()
  return (
    <div className="mt-4 flex flex-col gap-2">
      <Button variant="outline" size="sm" onClick={() => onMoveUp(widget.id)} disabled={isFirst}>
        <ArrowUpIcon className="h-3.5 w-3.5" />
        {t('shop.decoration.moveUp')}
      </Button>
      <Button variant="outline" size="sm" onClick={() => onMoveDown(widget.id)} disabled={isLast}>
        <ArrowDownIcon className="h-3.5 w-3.5" />
        {t('shop.decoration.moveDown')}
      </Button>
      <Button variant="destructive" size="sm" onClick={() => onRemove(widget.id)}>
        <TrashIcon className="h-3.5 w-3.5" />
        {t('shop.decoration.remove')}
      </Button>
    </div>
  )
}
