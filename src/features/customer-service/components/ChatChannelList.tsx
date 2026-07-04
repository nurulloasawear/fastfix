import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { Tabs } from '@/components/ui/Tabs'
import { useCustomerServiceUi } from '../stores/customer-service.store'
import { CHAT_FILTERS } from '../types/customer-service.types'
import type { ChatChannel } from '../types/customer-service.types'
import { SearchIcon, StarIcon } from './icons'

function initial(name: string): string {
  return name.charAt(0).toUpperCase()
}

type Props = { channels: ChatChannel[]; isLoading: boolean }

// Left column: search + all/unread/starred filter + scrollable channel list.
// Filtering happens here against the already-fetched channels (small dataset).
export function ChatChannelList({ channels, isLoading }: Props) {
  const { t } = useTranslation()
  const activeId = useCustomerServiceUi((s) => s.activeChannelId)
  const filter = useCustomerServiceUi((s) => s.chatFilter)
  const search = useCustomerServiceUi((s) => s.chatSearch)
  const setActive = useCustomerServiceUi((s) => s.setActiveChannel)
  const setFilter = useCustomerServiceUi((s) => s.setChatFilter)
  const setSearch = useCustomerServiceUi((s) => s.setChatSearch)

  const tabItems = CHAT_FILTERS.map((value) => ({
    key: value,
    label: t(`customerService.chat.filter.${value}`),
  }))

  const term = search.trim().toLowerCase()
  const visible = channels.filter((c) => {
    const matches =
      c.customerName.toLowerCase().includes(term) || c.lastMessage.toLowerCase().includes(term)
    if (!matches) return false
    if (filter === 'unread') return c.unreadCount > 0
    if (filter === 'starred') return c.starred
    return true
  })

  return (
    <div className="flex w-full flex-col border-r border-border md:w-80">
      <div className="border-b border-border p-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('customerService.chat.searchPlaceholder')}
          trailing={<SearchIcon size={14} />}
        />

        <div className="mt-3">
          <Tabs
            items={tabItems}
            value={filter}
            onChange={(k) => setFilter(k as typeof filter)}
            className="gap-1.5"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {isLoading ? (
          <div className="flex items-center justify-center p-6">
            <Spinner />
          </div>
        ) : visible.length === 0 ? (
          <EmptyState title={t('customerService.chat.empty')} className="py-10" />
        ) : (
          visible.map((c) => {
            const selected = c.id === activeId
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActive(c.id)}
                className={`flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition-colors ${
                  selected ? 'border-brand bg-bg' : 'border-transparent hover:bg-bg'
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-brand">
                  {initial(c.customerName)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-text">{c.customerName}</span>
                    <span className="shrink-0 text-xs text-muted">{c.time}</span>
                  </span>
                  <span
                    className={`mt-0.5 block truncate text-xs ${
                      c.unreadCount > 0 ? 'font-medium text-text' : 'text-muted'
                    }`}
                  >
                    {c.lastMessage}
                  </span>
                </span>
                <span className="flex w-5 shrink-0 flex-col items-end gap-2">
                  <StarIcon
                    size={12}
                    className={c.starred ? 'fill-accent text-accent' : 'text-border-strong'}
                  />
                  {c.unreadCount > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-semibold text-white">
                      {c.unreadCount}
                    </span>
                  )}
                </span>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
