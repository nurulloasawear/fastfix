import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/Textarea'
import type { AutoReply } from '../types/customer-service.types'
import { EditIcon, XIcon } from './icons'
import { ToggleSwitch } from './ToggleSwitch'

type Props = {
  reply: AutoReply
  onToggle: (enabled: boolean) => void
  onSaveMessage: (message: string) => void
}

// One auto-reply section card (Default or Off-Work) matching the Shopee spec layout:
// card title + sub-desc → inner card: "Shop Setting" label + toggle + edit pencil + message preview.
export function AutoReplySection({ reply, onToggle, onSaveMessage }: Props) {
  const { t } = useTranslation()
  const [enabled, setEnabled] = useState(reply.enabled)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(reply.message)

  const key = reply.kind === 'default' ? 'default' : 'offWork'
  const MAX = 500

  function handleToggle() {
    const next = !enabled
    setEnabled(next)
    onToggle(next)
  }

  function handleSave() {
    onSaveMessage(draft)
    setEditing(false)
  }

  function handleCancel() {
    setDraft(reply.message)
    setEditing(false)
  }

  return (
    <Card className="p-6">
      <h3 className="text-base font-semibold text-text">
        {t(`customerService.autoReply.${key}.title`)}
      </h3>
      <p className="mt-1 text-sm text-muted">
        {t(`customerService.autoReply.${key}.desc`)}
      </p>

      <div className="mt-4 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text">
            {t('customerService.autoReply.shopSetting')}
          </span>
          <div className="flex items-center gap-3">
            <ToggleSwitch
              checked={enabled}
              onChange={handleToggle}
              label={t(`customerService.autoReply.${key}.title`)}
            />
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="rounded p-1 text-muted hover:bg-bg hover:text-text"
              aria-label={t('customerService.autoReply.editMessage')}
            >
              <EditIcon size={16} />
            </button>
          </div>
        </div>

        <div className="mt-3 rounded-md bg-bg p-3 text-sm leading-relaxed text-text-secondary">
          {reply.message}
        </div>
      </div>

      {editing && (
        <div className="mt-4">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, MAX))}
            rows={4}
            hint={t('customerService.autoReply.charLimit', { count: draft.length })}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <XIcon size={14} />
              {t('customerService.autoReply.cancelEdit')}
            </Button>
            <Button size="sm" onClick={handleSave}>
              {t('customerService.autoReply.saveMessage')}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
