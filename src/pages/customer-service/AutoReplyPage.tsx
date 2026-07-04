import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import {
  AutoReplySection,
  useAutoReplies,
  usePatchAutoReply,
} from '@/features/customer-service'
import type { AutoReply } from '@/features/customer-service'
import { XIcon } from '@/features/customer-service'

// Agent Greetings (Auto-Reply) settings page.
// Matches Shopee "Chat Management > Agent Greetings" screenshot.
export function AutoReplyPage() {
  const { t } = useTranslation()
  const { data: replies, isLoading } = useAutoReplies()
  const patchMutation = usePatchAutoReply()
  const [bannerDismissed, setBannerDismissed] = useState(false)

  function handleToggle(reply: AutoReply, enabled: boolean) {
    patchMutation.mutate({ type: reply.kind, payload: { enabled } })
  }

  function handleSaveMessage(reply: AutoReply, message: string) {
    patchMutation.mutate({ type: reply.kind, payload: { message } })
  }

  return (
    <Page>
      <PageHeader
        title={t('customerService.autoReply.title')}
        breadcrumb={`${t('customerService.breadcrumbHome')} › ${t('customerService.chatManagement.crumb')} › ${t('customerService.autoReply.crumb')}`}
      />

      {!bannerDismissed && (
        <div className="flex items-start justify-between rounded-lg border border-warning bg-warning-bg px-4 py-3">
          <div className="text-sm text-text">
            <p>{t('customerService.autoReply.bannerLine1')}</p>
            <p>{t('customerService.autoReply.bannerLine2')}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBannerDismissed(true)}
            aria-label={t('customerService.common.dismiss')}
          >
            <XIcon size={16} />
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      )}

      {!isLoading && (replies ?? []).map((reply) => (
        <AutoReplySection
          key={reply.kind}
          reply={reply}
          onToggle={(enabled) => handleToggle(reply, enabled)}
          onSaveMessage={(message) => handleSaveMessage(reply, message)}
        />
      ))}
    </Page>
  )
}
