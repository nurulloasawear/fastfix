import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Td, Th, Tr } from '@/components/ui/Table'
import {
  FaqFunnelChart,
  useFaqDashboard,
} from '@/features/customer-service'
import type { FaqOverviewMetrics } from '@/features/customer-service'
import { DownloadIcon, InfoIcon } from '@/features/customer-service'

function MetricTile({ label, value, deltaPct }: { label: string; value: number; deltaPct: number }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 text-xs text-muted">
        {label}
        <InfoIcon size={11} />
      </div>
      <div className="text-xl font-semibold text-text">{value}</div>
      <div className="text-xs text-muted">
        {t('customerService.faqDashboard.vsPrevDay')}{' '}
        <span className={deltaPct >= 0 ? 'text-success' : 'text-error-text'}>
          {deltaPct.toFixed(2)}%
        </span>
      </div>
    </div>
  )
}

// FAQ Dashboard page matching Shopee "FAQ Assistant > FAQ Dashboard" screenshot.
export function FaqDashboardPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useFaqDashboard()
  const ov: FaqOverviewMetrics = data?.overview ?? {
    faqTriggered: 0, faqClicked: 0, questionResolved: 0,
    liveAgentTransferred: 0, helpfulClicks: 0, unhelpfulClicks: 0,
    triggeredDeltaPct: 0, clickedDeltaPct: 0, resolvedDeltaPct: 0,
    transferredDeltaPct: 0, helpfulDeltaPct: 0, unhelpfulDeltaPct: 0,
  }

  const tabs = [
    { label: t('customerService.faqAssistant.tabCard'), to: '/customer-service/faq', active: false },
    { label: t('customerService.faqAssistant.tabDashboard'), to: '/customer-service/faq/dashboard', active: true },
  ]

  const leftMetrics = [
    { label: t('customerService.faqDashboard.faqTriggered'), value: ov.faqTriggered, delta: ov.triggeredDeltaPct },
    { label: t('customerService.faqDashboard.faqClicked'), value: ov.faqClicked, delta: ov.clickedDeltaPct },
    { label: t('customerService.faqDashboard.questionResolved'), value: ov.questionResolved, delta: ov.resolvedDeltaPct },
    { label: t('customerService.faqDashboard.liveAgentTransferred'), value: ov.liveAgentTransferred, delta: ov.transferredDeltaPct },
    { label: t('customerService.faqDashboard.helpfulClicks'), value: ov.helpfulClicks, delta: ov.helpfulDeltaPct },
    { label: t('customerService.faqDashboard.unhelpfulClicks'), value: ov.unhelpfulClicks, delta: ov.unhelpfulDeltaPct },
  ]

  const questions = data?.questions ?? []
  const dateStr = data ? `${t('customerService.faqDashboard.yesterday')} ${data.date} (${data.timezone})` : ''

  return (
    <Page>
      <PageHeader
        title={t('customerService.faqDashboard.title')}
        breadcrumb={`${t('customerService.breadcrumbHome')} › ${t('customerService.chatManagement.crumb')} › ${t('customerService.faqAssistant.crumb')}`}
      />

      {/* Underline tab nav */}
      <div className="flex gap-0 border-b border-border">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            className={`px-5 py-2.5 text-sm font-semibold transition-colors ${
              tab.active ? 'border-b-2 border-brand text-brand' : 'text-text-secondary hover:text-text'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <Card className="p-5">
        {/* Date filter row */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-text">{t('customerService.faqDashboard.dataPeriod')}</span>
            <span className="text-text-secondary">{dateStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="text-sm text-brand hover:underline">
              {t('customerService.faqDashboard.businessInsights')}
            </button>
            <Button variant="outline" size="sm">
              <DownloadIcon size={14} />
              {t('customerService.faqDashboard.exportData')}
            </Button>
          </div>
        </div>

        {/* Overview section */}
        <h3 className="mb-4 font-semibold text-text">{t('customerService.faqDashboard.overview')}</h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Left: 2×3 metrics grid */}
            <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-6">
              {leftMetrics.map((m) => (
                <MetricTile key={m.label} label={m.label} value={m.value} deltaPct={m.delta} />
              ))}
            </div>

            {/* Right: funnel chart */}
            <div className="shrink-0">
              <FaqFunnelChart metrics={ov} />
            </div>
          </div>
        )}
      </Card>

      {/* FAQ Question List */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 font-semibold text-text">
          {t('customerService.faqDashboard.questionList')}
        </div>
        <Table>
          <thead>
            <Tr>
              <Th>{t('customerService.faqDashboard.colSection')}</Th>
              <Th>{t('customerService.faqDashboard.colGroup')}</Th>
              <Th>{t('customerService.faqDashboard.colQuestion')}</Th>
              <Th>{t('customerService.faqDashboard.colClicked')}</Th>
              <Th>{t('customerService.faqDashboard.colCtr')}</Th>
              <Th>{t('customerService.faqDashboard.colResolved')}</Th>
            </Tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    title={t('customerService.faqDashboard.emptyTable')}
                    action={
                      <Link to="/customer-service/faq" className="text-sm text-brand hover:underline">
                        {t('customerService.faqDashboard.emptyTableLink')}
                      </Link>
                    }
                  />
                </td>
              </tr>
            ) : (
              questions.map((q) => (
                <Tr key={q.id}>
                  <Td>{q.section}</Td>
                  <Td>{q.groupName}</Td>
                  <Td>{q.question}</Td>
                  <Td>{q.clicked}</Td>
                  <Td>{q.ctr.toFixed(2)}%</Td>
                  <Td>{q.resolved}</Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </Page>
  )
}
