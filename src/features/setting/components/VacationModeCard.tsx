import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { Textarea } from '@/components/ui/Textarea'
import { useVacationSettings, useUpdateVacationSettings } from '../api/setting.queries'
import { Toggle } from './Toggle'

// Vacation Mode card with toggle + auto-reply preview + confirmation modal.
// Matches screenshots: 07 Vacation Mode.png, 08 Vacation Mode - Toggle Confirmation Popup.png

export function VacationModeCard() {
  const { t } = useTranslation()
  const { data, isLoading } = useVacationSettings()
  const update = useUpdateVacationSettings()
  const [pendingToggle, setPendingToggle] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyDraft, setReplyDraft] = useState('')

  if (isLoading || !data) {
    return <Card className="flex items-center justify-center p-10"><Spinner /></Card>
  }

  const openReply = () => { setReplyDraft(data.vacationAutoReplyText); setReplyOpen(true) }
  const saveReply = () => {
    update.mutate({ ...data, vacationAutoReplyText: replyDraft }, { onSuccess: () => setReplyOpen(false) })
  }

  const handleToggleIntent = () => {
    // Always show confirmation before toggling (both ON→OFF and OFF→ON)
    setPendingToggle(true)
  }

  const handleConfirm = () => {
    update.mutate({
      ...data,
      vacationModeEnabled: !data.vacationModeEnabled,
      vacationEnabledAt: !data.vacationModeEnabled ? new Date().toISOString() : data.vacationEnabledAt,
      vacationDisabledAt: data.vacationModeEnabled ? new Date().toISOString() : null,
    })
    setPendingToggle(false)
  }

  const truncatedAutoReply =
    data.vacationAutoReplyText.length > 60
      ? data.vacationAutoReplyText.slice(0, 60) + '...'
      : data.vacationAutoReplyText

  return (
    <>
      <Card className="flex flex-col">
        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-text">
                {t('setting.vacationMode.toggleLabel')}
              </span>
              <span className="text-xs text-muted">{t('setting.vacationMode.toggleDesc')}</span>
            </div>
            <Toggle
              checked={data.vacationModeEnabled}
              disabled={update.isPending}
              onChange={handleToggleIntent}
              label={t('setting.vacationMode.toggleLabel')}
            />
          </div>

          {/* Auto-reply row — shown whenever vacation mode is ON (set or edit the text) */}
          {data.vacationModeEnabled && (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-4 py-2 text-sm">
              <span className="text-text-secondary">
                {t('setting.vacationMode.autoReplyPreview')}
              </span>
              <span className="flex-1 truncate text-text">
                {data.vacationAutoReplyText ? `‘${truncatedAutoReply}’` : t('setting.vacationMode.noAutoReply', { defaultValue: 'belgilanmagan' })}
              </span>
              <Button variant="ghost" size="sm" onClick={openReply} className="shrink-0 text-brand hover:text-brand">
                {t('setting.vacationMode.setNow')}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Auto-reply editor */}
      <Modal open={replyOpen} onClose={() => setReplyOpen(false)} title={t('setting.vacationMode.setNow')} size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setReplyOpen(false)}>{t('setting.common.cancel')}</Button>
            <Button size="sm" disabled={update.isPending} onClick={saveReply}>{t('setting.common.save')}</Button>
          </>
        }
      >
        <Textarea value={replyDraft} onChange={(e) => setReplyDraft(e.target.value)} rows={4}
          placeholder={t('setting.vacationMode.autoReplyPlaceholder', { defaultValue: 'Avto-javob matni...' })} />
      </Modal>

      {/* Confirmation modal */}
      <Modal
        open={pendingToggle}
        onClose={() => setPendingToggle(false)}
        title={t('setting.vacationMode.confirmTitle')}
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setPendingToggle(false)} className="mr-auto text-brand hover:text-brand">
              {t('setting.vacationMode.learnMore')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPendingToggle(false)}>
              {t('setting.common.cancel')}
            </Button>
            <Button size="sm" disabled={update.isPending} onClick={handleConfirm}>
              {t('setting.vacationMode.proceed')}
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">{t('setting.vacationMode.confirmOffBody')}</p>
      </Modal>
    </>
  )
}
