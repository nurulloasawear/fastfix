import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ShortcutGroupFull } from '../types/customer-service.types'
import { ChevronDownIcon, ChevronUpIcon, EditIcon, GripVerticalIcon, TrashIcon } from './icons'
import { ToggleSwitch } from './ToggleSwitch'

type Props = { group: ShortcutGroupFull }

// One collapsible shortcut group accordion row matching the Shopee spec screenshot.
export function ShortcutGroupAccordion({ group }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(true)
  const [enabled, setEnabled] = useState(group.enabled)

  return (
    <div className="rounded-lg border border-border bg-surface">
      {/* Group header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-muted hover:text-text"
          aria-label={open ? 'Collapse' : 'Expand'}
        >
          {open ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
        </button>
        <span className="flex-1 text-sm font-semibold text-text">{group.name}</span>
        <ToggleSwitch
          checked={enabled}
          onChange={() => setEnabled((v) => !v)}
          label={group.name}
        />
        <button type="button" className="rounded p-1 text-muted hover:bg-bg hover:text-text" aria-label={t('customerService.common.edit')}>
          <EditIcon size={15} />
        </button>
        <button type="button" className="rounded p-1 text-muted hover:bg-bg hover:text-text" aria-label="Reorder">
          <GripVerticalIcon size={15} />
        </button>
        <button type="button" className="rounded p-1 text-muted hover:bg-bg hover:text-error-text" aria-label="Delete">
          <TrashIcon size={15} />
        </button>
      </div>

      {/* Shortcuts list */}
      {open && (
        <div className="border-t border-border divide-y divide-border">
          {group.shortcuts.map((sc) => (
            <div key={sc.id} className="px-8 py-3">
              <p className="text-sm leading-relaxed text-text-secondary">{sc.messageText}</p>
              <p className="mt-0.5 text-xs font-medium text-brand">{sc.keyword}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
