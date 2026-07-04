import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { ShortcutGroup } from '../types/customer-service.types'
import { EditIcon, PlusIcon } from './icons'
import { ToggleSwitch } from './ToggleSwitch'

// One shortcut group row. Toggle is local UI state seeded from the server value
// (no persistence endpoint yet — [PENDING BACKEND]).
function ShortcutRow({ group }: { group: ShortcutGroup }) {
  const { t } = useTranslation()
  const [enabled, setEnabled] = useState(group.enabled)

  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <div>
        <div className="text-sm font-semibold text-text">
          {t(`customerService.chatAssistant.shortcuts.${group.name}Group`)}
        </div>
        <div className="text-xs text-muted">
          {t(`customerService.chatAssistant.shortcuts.${group.description}`)}
        </div>
      </div>
      <div className="flex items-center gap-4 text-muted">
        <button type="button" className="rounded p-1 hover:bg-bg hover:text-text">
          <EditIcon size={16} />
        </button>
        <ToggleSwitch checked={enabled} onChange={() => setEnabled((v) => !v)} />
      </div>
    </div>
  )
}

type Props = { groups: ShortcutGroup[] }

// Message-shortcuts tab body: header + each shortcut group row. Group name/desc
// resolve from the data's keys via i18n. Toggle is presentational ([PENDING BACKEND]).
export function ShortcutsPanel({ groups }: Props) {
  const { t } = useTranslation()

  return (
    <Card className="max-w-4xl p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-text">
            {t('customerService.chatAssistant.shortcuts.title')}
          </h3>
          <p className="mt-1 text-xs text-muted">
            {t('customerService.chatAssistant.shortcuts.desc')}
          </p>
        </div>
        <Button variant="outline">
          <PlusIcon size={16} />
          {t('customerService.chatAssistant.shortcuts.add')}
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {groups.map((group) => (
          <ShortcutRow key={group.id} group={group} />
        ))}
      </div>
    </Card>
  )
}
