import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Th, Tr } from '@/components/ui/Table'
import { useChatSettings, useUpdateChatSettings } from '../api/setting.queries'
import { Toggle } from './Toggle'

// Chat Settings — message receiving toggles, sound/push notification toggles, blocked users table.
// Matches screenshot: 02 Chat Settings.png

interface ToggleRowProps {
  label: string
  desc: string
  checked: boolean
  disabled: boolean
  onChange: () => void
  last?: boolean
}

function ToggleRow({ label, desc, checked, disabled, onChange, last = false }: ToggleRowProps) {
  return (
    <div
      className={`flex items-start justify-between gap-6 px-6 py-4 ${last ? '' : 'border-b border-border'}`}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-text">{label}</span>
        <span className="text-xs text-muted">{desc}</span>
      </div>
      <Toggle checked={checked} disabled={disabled} onChange={onChange} label={label} />
    </div>
  )
}

export function ChatSettingsCard() {
  const { t } = useTranslation()
  const { data, isLoading } = useChatSettings()
  const update = useUpdateChatSettings()

  if (isLoading || !data) {
    return <Card className="flex items-center justify-center p-10"><Spinner /></Card>
  }

  const patch = (next: Partial<typeof data>) => update.mutate({ ...data, ...next })

  return (
    <>
      {/* Message Receiving */}
      <Card className="flex flex-col">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-text">{t('setting.chat.messageReceiving')}</h2>
        </div>
        <ToggleRow
          label={t('setting.chat.broadcastLabel')}
          desc={t('setting.chat.broadcastDesc')}
          checked={data.receiveBroadcasts}
          disabled={update.isPending}
          onChange={() => patch({ receiveBroadcasts: !data.receiveBroadcasts })}
        />
        <ToggleRow
          label={t('setting.chat.platformLabel')}
          desc={t('setting.chat.platformDesc')}
          checked={data.receivePlatformMessages}
          disabled={update.isPending}
          onChange={() => patch({ receivePlatformMessages: !data.receivePlatformMessages })}
          last
        />
      </Card>

      {/* Notification */}
      <Card className="flex flex-col">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-text">{t('setting.chat.notification')}</h2>
        </div>
        <ToggleRow
          label={t('setting.chat.soundLabel')}
          desc={t('setting.chat.soundDesc')}
          checked={data.soundAlerts}
          disabled={update.isPending}
          onChange={() => patch({ soundAlerts: !data.soundAlerts })}
        />
        <ToggleRow
          label={t('setting.chat.pushLabel')}
          desc={t('setting.chat.pushDesc')}
          checked={data.pushPopups}
          disabled={update.isPending}
          onChange={() => patch({ pushPopups: !data.pushPopups })}
          last
        />
      </Card>

      {/* Block User */}
      <Card className="flex flex-col">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-text">{t('setting.chat.blockUser')}</h2>
          <p className="mt-1 text-sm text-muted">{t('setting.chat.blockUserDesc')}</p>
        </div>
        <Table>
          <thead>
            <Tr>
              <Th>{t('setting.chat.colUser')}</Th>
              <Th>{t('setting.chat.colBlockTime')}</Th>
              <Th>{t('setting.chat.colAction')}</Th>
            </Tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3}>
                <EmptyState
                  icon={
                    <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  }
                  title={t('setting.chat.noData')}
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </>
  )
}
