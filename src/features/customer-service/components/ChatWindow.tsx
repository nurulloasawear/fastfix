import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { useChatMessages, useSendChatMessage } from '../api/customer-service.queries'
import { useCustomerServiceUi } from '../stores/customer-service.store'
import type { ChatChannel } from '../types/customer-service.types'
import {
  CheckCheckIcon,
  ImageIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  PaperclipIcon,
  SendIcon,
  SmileIcon,
} from './icons'

type Props = { channel: ChatChannel | undefined }

// Centre column: header + message stream + composer. Messages are server data
// (TanStack Query); sending goes through the mutation, which invalidates the cache.
export function ChatWindow({ channel }: Props) {
  const { t } = useTranslation()
  const draft = useCustomerServiceUi((s) => s.chatDraft)
  const setDraft = useCustomerServiceUi((s) => s.setChatDraft)
  const { data, isLoading } = useChatMessages(channel?.id ?? '')
  const sendMessage = useSendChatMessage()

  const messages = data?.messages ?? []

  if (!channel) {
    return (
      <div className="flex flex-1 items-center justify-center bg-bg p-6">
        <EmptyState
          icon={<MessageSquareIcon size={24} />}
          title={t('customerService.chat.noSelection')}
        />
      </div>
    )
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || !channel || sendMessage.isPending) return
    sendMessage.mutate({ channelId: channel.id, text })
    setDraft('')
  }

  return (
    <div className="flex flex-1 flex-col bg-bg">
      <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-brand">
            {channel.customerName.charAt(0).toUpperCase()}
          </span>
          <div>
            <h4 className="text-sm font-semibold text-text">{channel.customerName}</h4>
            <span className="flex items-center gap-1.5 text-xs font-medium text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {t('customerService.chat.online')}
            </span>
          </div>
        </div>
        <button type="button" className="rounded p-1 text-muted hover:bg-bg">
          <MoreVerticalIcon size={16} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto p-5">
        {isLoading ? (
          <div className="m-auto">
            <Spinner />
          </div>
        ) : messages.length === 0 ? (
          <EmptyState
            title={t('customerService.chat.messagesEmpty')}
            className="m-auto py-8"
          />
        ) : (
          messages.map((msg) => {
            const mine = msg.sender === 'seller'
            return (
              <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[70%] flex-col ${mine ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-xl px-3.5 py-2.5 text-sm leading-snug ${
                      mine
                        ? 'rounded-br-sm bg-brand text-white'
                        : 'rounded-bl-sm border border-border bg-surface text-text'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-muted">
                    <span>{msg.time}</span>
                    {mine && <CheckCheckIcon size={11} className="text-success" />}
                  </div>
                </div>
              </div>
            )
          })
        )}
        {/* Newest message anchors to the bottom via column layout + overflow. */}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 border-t border-border bg-surface px-5 py-3"
      >
        <div className="flex gap-1 text-muted">
          <button type="button" className="rounded p-1 hover:bg-bg hover:text-text">
            <ImageIcon size={16} />
          </button>
          <button type="button" className="rounded p-1 hover:bg-bg hover:text-text">
            <PaperclipIcon size={16} />
          </button>
          <button type="button" className="rounded p-1 hover:bg-bg hover:text-text">
            <SmileIcon size={16} />
          </button>
        </div>

        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('customerService.chat.inputPlaceholder')}
          className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-muted"
        />

        <button
          type="submit"
          disabled={!draft.trim() || sendMessage.isPending}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-accent hover:text-brand disabled:bg-border disabled:text-muted"
        >
          {sendMessage.isPending ? <Spinner className="h-4 w-4" /> : <SendIcon size={14} />}
        </button>
      </form>
    </div>
  )
}
