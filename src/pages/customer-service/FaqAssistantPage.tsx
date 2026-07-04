import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { useFaqAssistant } from '@/features/customer-service'

// FAQ Assistant — FAQ Card empty state tab page.
// Tabs: FAQ Card (active) | FAQ Dashboard.
// Empty state when no FAQ cards exist — matches Shopee screenshot.
export function FaqAssistantPage() {
  const { t } = useTranslation()
  const { data } = useFaqAssistant()
  const hasCards = (data?.cards.length ?? 0) > 0

  const tabs = [
    { label: t('customerService.faqAssistant.tabCard'), to: '/customer-service/faq', active: true },
    { label: t('customerService.faqAssistant.tabDashboard'), to: '/customer-service/faq/dashboard', active: false },
  ]

  return (
    <Page>
      <PageHeader
        title={t('customerService.faqAssistant.crumb')}
        breadcrumb={`${t('customerService.breadcrumbHome')} › ${t('customerService.chatManagement.crumb')} › ${t('customerService.faqAssistant.crumb')}`}
      />

      {/* Underline tab nav */}
      <div className="flex gap-0 border-b border-border">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            className={`px-5 py-2.5 text-sm font-semibold transition-colors ${
              tab.active
                ? 'border-b-2 border-brand text-brand'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Card body */}
      <Card className="p-6">
        <h4 className="text-base font-semibold text-text">{t('customerService.faqAssistant.cardTitle')}</h4>
        <p className="mt-1 text-sm text-muted">{t('customerService.faqAssistant.cardSubtitle')}</p>

        {!hasCards ? (
          /* Empty state marketing layout */
          <div className="mt-6 flex flex-col items-center gap-8">
            <div className="flex w-full flex-col items-center gap-8 md:flex-row">
              {/* Phone mockup placeholder */}
              <div className="flex h-64 w-48 shrink-0 items-center justify-center rounded-2xl border-2 border-border bg-bg text-xs text-muted">
                Phone Mockup
              </div>

              {/* Marketing copy */}
              <div className="flex flex-1 flex-col gap-4">
                <h2 className="text-xl font-semibold text-text">
                  {t('customerService.faqAssistant.emptyHeadline')}
                </h2>

                <div className="flex flex-col gap-4">
                  {[
                    {
                      title: t('customerService.faqAssistant.benefit1Title'),
                      desc: t('customerService.faqAssistant.benefit1Desc'),
                    },
                    {
                      title: t('customerService.faqAssistant.benefit2Title'),
                      desc: t('customerService.faqAssistant.benefit2Desc'),
                    },
                    {
                      title: t('customerService.faqAssistant.benefit3Title'),
                      desc: t('customerService.faqAssistant.benefit3Desc'),
                    },
                  ].map((b) => (
                    <div key={b.title} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                        {b.title.charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-text">{b.title}</p>
                        <p className="text-xs leading-relaxed text-muted">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/customer-service/faq/create">
              <Button size="lg" className="px-10">
                {t('customerService.faqAssistant.createCta')}
              </Button>
            </Link>
          </div>
        ) : (
          /* Has cards — future editor view */
          <div className="mt-4 flex justify-end">
            <Link to="/customer-service/faq/create">
              <Button variant="outline">{t('customerService.faqAssistant.createCard')}</Button>
            </Link>
          </div>
        )}
      </Card>
    </Page>
  )
}
