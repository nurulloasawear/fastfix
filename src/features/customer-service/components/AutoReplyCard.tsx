import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { AutoReply } from '../types/customer-service.types'
import { EditIcon } from './icons'
import { ToggleSwitch } from './ToggleSwitch'

type Props = { reply: AutoReply }

// One auto-reply rule (default or off-work). Title/desc/body resolve from the
// `kind` via i18n. The enable toggle is local UI state seeded from the server value
// (no persistence endpoint yet — [PENDING BACKEND]).
export function AutoReplyCard({ reply }: Props) {
  const { t } = useTranslation()
  const [enabled, setEnabled] = useState(reply.enabled)
  const key = reply.kind === 'default' ? 'default' : 'offWork'

  return (
    <div>
      <h3 className="text-sm font-semibold text-text">
        {t(`customerService.chatAssistant.autoReply.${key}.title`)}
      </h3>
      <p className="mt-1 text-xs text-muted">
        {t(`customerService.chatAssistant.autoReply.${key}.desc`)}
      </p>

      <Card className="mt-4 flex items-start justify-between gap-5 p-4">
        <div className="flex-1">
          <div className="mb-1.5 text-sm font-semibold text-text">
            {t('customerService.chatAssistant.shopSetting')}
          </div>
          <div className="text-sm leading-relaxed text-text-secondary">
            {t(`customerService.chatAssistant.autoReply.${key}Text`)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <EditIcon size={14} />
            {t('customerService.common.edit')}
          </Button>
          <ToggleSwitch
            checked={enabled}
            onChange={() => setEnabled((v) => !v)}
            label={t(`customerService.chatAssistant.autoReply.${key}.title`)}
          />
        </div>
      </Card>
    </div>
  )
}
