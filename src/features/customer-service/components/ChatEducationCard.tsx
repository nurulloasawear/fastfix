import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'

// Six help articles in a 3×2 grid. Links go to the help centre (external or future route).
export function ChatEducationCard() {
  const { t } = useTranslation()

  const articles = [
    t('customerService.chatManagement.education.articles.sellerChat'),
    t('customerService.chatManagement.education.articles.autoReply'),
    t('customerService.chatManagement.education.articles.improveCrr'),
    t('customerService.chatManagement.education.articles.shortcut'),
    t('customerService.chatManagement.education.articles.faqAssistant'),
    t('customerService.chatManagement.education.articles.violations'),
  ]

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-text">
          {t('customerService.chatManagement.education.title')}
        </h3>
        <button type="button" className="text-xs text-brand hover:underline">
          {t('customerService.chatManagement.education.more')} &rsaquo;
        </button>
      </div>
      <div className="grid grid-cols-3 gap-x-8 gap-y-3">
        {articles.map((article) => (
          <a
            key={article}
            href="#"
            className="text-sm text-text-secondary hover:text-brand hover:underline"
          >
            • {article}
          </a>
        ))}
      </div>
    </Card>
  )
}
