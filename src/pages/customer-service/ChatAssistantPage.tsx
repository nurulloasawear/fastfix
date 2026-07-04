import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import { AutoReplyCard, ShortcutsPanel, useChatAssistant } from '@/features/customer-service'

type AssistantTab = 'auto-reply' | 'shortcuts'
const TAB_KEY: Record<AssistantTab, string> = { 'auto-reply': 'autoReply', shortcuts: 'shortcuts' }

// THIN page: chat assistant settings with an Auto-Reply / Message Shortcuts switch.
export function ChatAssistantPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<AssistantTab>('auto-reply')
  const { data } = useChatAssistant()
  const autoReplies = data?.autoReplies ?? []
  const shortcutGroups = data?.shortcutGroups ?? []

  const tabItems = (['auto-reply', 'shortcuts'] as AssistantTab[]).map((value) => ({
    key: value,
    label: t(`customerService.chatAssistant.tab.${TAB_KEY[value]}`),
  }))

  return (
    <Page>
      <PageHeader
        title={t('customerService.chatAssistant.title')}
        breadcrumb={`${t('customerService.breadcrumbHome')} › ${t('customerService.chatAssistant.crumb')}`}
      />

      <Tabs items={tabItems} value={tab} onChange={(k) => setTab(k as AssistantTab)} />

      {tab === 'auto-reply' ? (
        <div className="flex max-w-3xl flex-col gap-6">
          {autoReplies.map((reply) => (
            <AutoReplyCard key={reply.kind} reply={reply} />
          ))}
        </div>
      ) : (
        <ShortcutsPanel groups={shortcutGroups} />
      )}
    </Page>
  )
}
