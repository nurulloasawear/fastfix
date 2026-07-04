import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Spinner } from '@/components/ui/Spinner'
import { LineChart, useChatDetail, CalendarIcon, InfoIcon } from '@/features/account-health'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function ChatResponseDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [date, setDate] = useState(todayIso)
  const { data, isLoading } = useChatDetail(date)

  const trend = (data?.trend ?? []).map((s) => ({
    label: s.date.slice(5).replace('-', ' '),
    value: s.rate,
  }))

  const breadcrumb = (
    <span className="flex items-center gap-1 text-sm text-muted">
      <button type="button" onClick={() => navigate('/account-health')} className="hover:underline">
        {t('accountHealth.breadcrumbHome')}
      </button>
      {' › '}
      <button type="button" onClick={() => navigate('/account-health')} className="hover:underline">
        {t('accountHealth.title')}
      </button>
      {' › '}
      <span className="text-text">{t('accountHealth.chat.breadcrumb')}</span>
    </span>
  )

  return (
    <Page>
      <PageHeader
        title={t('accountHealth.chat.title')}
        breadcrumb={breadcrumb}
        actions={
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">{t('accountHealth.chat.day')}:</span>
            <label className="flex items-center gap-2 rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-text-secondary cursor-pointer">
              <CalendarIcon size={14} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent outline-none text-sm text-text w-32"
              />
            </label>
          </div>
        }
      />

      {/* Top two KPI stat cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            label={t('accountHealth.chat.myShop')}
            value={data?.chatsResponded ?? 0}
            hint={`${t('accountHealth.chat.previousDay')} ${data?.previousDay?.chatsResponded ?? 0}`}
          />
          <StatCard
            label={t('accountHealth.chat.myShop')}
            value={data?.totalChats ?? 0}
            hint={`${t('accountHealth.chat.previousDay')} ${data?.previousDay?.totalChats ?? 0}`}
          />
        </div>
      )}

      {/* Chat Response Rate card */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-text mb-4">{t('accountHealth.chat.responseRate')}</h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1 mb-2">
              <p className="text-xs font-semibold text-text-secondary">{t('accountHealth.chat.myShop')}</p>
              <InfoIcon size={12} className="text-muted" />
            </div>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-bold text-text">
                {data?.responseRate !== undefined ? `${data.responseRate}` : '0'}
              </span>
              <span className="text-xs text-muted">{t('accountHealth.chat.target')} 0</span>
            </div>
            <p className="text-xs text-muted">
              {t('accountHealth.chat.previousDay')} {data?.previousDay?.responseRate ?? 0}
            </p>
          </>
        )}
      </Card>

      {/* Response Rate Trend chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text">{t('accountHealth.chat.trendTitle')}</h3>
          <div className="flex items-center gap-2 text-xs text-muted">
            <svg width="24" height="8" viewBox="0 0 24 8" aria-hidden="true">
              <line x1="0" y1="4" x2="24" y2="4" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" />
            </svg>
            <span>{t('accountHealth.chat.threshold')}</span>
          </div>
        </div>
        <LineChart
          data={trend}
          maxY={100}
          thresholdY={85}
          yLabels={['100.00%', '80.00%', '60.00%', '40.00%', '20.00%', '0.00%']}
          lineColor="#2d201c"
          dotColor="#2d201c"
          height={220}
        />

        {/* Footer note */}
        <p className="mt-4 text-xs text-muted">
          {t('accountHealth.chat.footerNote')}{' '}
          <Button
            variant="ghost"
            size="sm"
            className="inline p-0 h-auto text-xs font-normal text-brand underline"
            onClick={() => navigate('/analytics/chat')}
          >
            {t('accountHealth.chat.footerLink')}
          </Button>
        </p>
      </Card>
    </Page>
  )
}
