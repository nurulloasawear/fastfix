import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Tabs } from '@/components/ui/Tabs'
import { useCustomerServiceUi } from '../stores/customer-service.store'
import { FAQ_CATEGORY_FILTERS } from '../types/customer-service.types'
import type { FaqItem } from '../types/customer-service.types'
import { ChevronDownIcon, HelpCircleIcon } from './icons'

type Props = { faqs: FaqItem[]; isLoading: boolean }

// FAQ card: category filter row + accordion. Filtering by category + the help
// search box happens here against the fetched list (small, in-memory).
export function FaqAccordion({ faqs, isLoading }: Props) {
  const { t } = useTranslation()
  const category = useCustomerServiceUi((s) => s.faqCategory)
  const search = useCustomerServiceUi((s) => s.helpSearch)
  const openId = useCustomerServiceUi((s) => s.openFaqId)
  const setCategory = useCustomerServiceUi((s) => s.setFaqCategory)
  const toggleFaq = useCustomerServiceUi((s) => s.toggleFaq)

  const tabItems = FAQ_CATEGORY_FILTERS.map((value) => ({
    key: value,
    label: t(`customerService.help.category.${value}`),
  }))

  const term = search.trim().toLowerCase()
  const visible = faqs.filter((faq) => {
    const matchesCategory = category === 'all' || faq.category === category
    const matchesSearch =
      faq.question.toLowerCase().includes(term) || faq.answer.toLowerCase().includes(term)
    return matchesCategory && matchesSearch
  })

  return (
    <div className="rounded-lg border border-border bg-surface shadow-xs p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <HelpCircleIcon size={16} className="text-text" />
          <h3 className="text-sm font-semibold text-text">{t('customerService.help.faqTitle')}</h3>
        </div>

        <Tabs
          items={tabItems}
          value={category}
          onChange={(k) => setCategory(k as typeof category)}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Spinner />
          </div>
        ) : visible.length === 0 ? (
          <EmptyState title={t('customerService.help.faqEmpty')} className="py-8" />
        ) : (
          visible.map((faq) => {
            const open = openId === faq.id
            return (
              <div
                key={faq.id}
                className={`overflow-hidden rounded-lg border border-border ${open ? 'bg-bg' : 'bg-surface'}`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left"
                >
                  <span className="text-sm font-semibold text-text">{faq.question}</span>
                  <ChevronDownIcon
                    size={14}
                    className={`shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>
                {open && (
                  <div className="border-t border-border bg-surface px-5 py-3 text-sm leading-relaxed text-muted">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
