import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { InfoIcon } from './icons'

type Props = { hasFaq: boolean }

// Three feature tiles in the Chat Assistant card on the Chat Management Overview.
export function ChatAssistantFeaturesCard({ hasFaq }: Props) {
  const { t } = useTranslation()

  const features = [
    {
      key: 'agentGreetings',
      iconBg: 'bg-brand/10',
      iconFg: 'text-brand',
      label: t('customerService.chatManagement.assistant.agentGreetings.label'),
      tooltip: t('customerService.chatManagement.assistant.agentGreetings.tooltip'),
      desc: t('customerService.chatManagement.assistant.agentGreetings.desc'),
      cta: t('customerService.chatManagement.assistant.agentGreetings.cta'),
      to: '/customer-service/chat/auto-reply',
    },
    {
      key: 'shortcut',
      iconBg: 'bg-warning-bg',
      iconFg: 'text-warning',
      label: t('customerService.chatManagement.assistant.shortcut.label'),
      tooltip: t('customerService.chatManagement.assistant.shortcut.tooltip'),
      desc: t('customerService.chatManagement.assistant.shortcut.desc'),
      cta: t('customerService.chatManagement.assistant.shortcut.cta'),
      to: '/customer-service/chat/shortcuts',
    },
    {
      key: 'faq',
      iconBg: 'bg-success-bg',
      iconFg: 'text-success',
      label: t('customerService.chatManagement.assistant.faq.label'),
      tooltip: t('customerService.chatManagement.assistant.faq.tooltip'),
      desc: t('customerService.chatManagement.assistant.faq.desc'),
      cta: hasFaq
        ? t('customerService.chatManagement.assistant.faq.ctaEdit')
        : t('customerService.chatManagement.assistant.faq.ctaStart'),
      to: '/customer-service/faq',
    },
  ] as const

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-semibold text-text">
        {t('customerService.chatManagement.assistant.title')}
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {features.map((f) => (
          <div key={f.key} className="flex flex-col rounded-lg border border-border p-4">
            <div className="flex items-start gap-2">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${f.iconBg} ${f.iconFg} text-lg font-bold`}>
                {f.label.charAt(0)}
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-text">{f.label}</span>
                  <span title={f.tooltip} className="cursor-help text-muted">
                    <InfoIcon size={12} />
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted">{f.desc}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to={f.to}>
                <Button variant="outline" size="sm" className="w-full">
                  {f.cta}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
