import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  ChatAssistantFeaturesCard,
  ChatEducationCard,
  ChatPerformanceCard,
  useChatMetrics,
  useFaqAssistant,
} from '@/features/customer-service'

// Chat Management Overview: KPIs + Chat Assistant feature tiles + Education links.
// Matches Shopee Seller Centre "Chat Management" overview screenshot.
export function ChatPage() {
  const { t } = useTranslation()
  const { data: metricsData, isLoading: metricsLoading } = useChatMetrics()
  const { data: faqData } = useFaqAssistant()
  const hasFaq = (faqData?.cards.length ?? 0) > 0

  return (
    <Page>
      <PageHeader
        title={t('customerService.chatManagement.title')}
        breadcrumb={`${t('customerService.breadcrumbHome')} › ${t('customerService.chatManagement.crumb')}`}
      />

      <ChatPerformanceCard data={metricsData} isLoading={metricsLoading} />
      <ChatAssistantFeaturesCard hasFaq={hasFaq} />
      <ChatEducationCard />
    </Page>
  )
}
