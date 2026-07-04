import type { ComponentType, SVGProps } from 'react'
import { useTranslation } from 'react-i18next'
import type { HelpGuide } from '../types/customer-service.types'
import { BookOpenIcon, ShieldIcon, StarIcon } from './icons'

type IconCmp = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

// Each guide slug maps to a fixed icon (data carries only the slug + count).
const GUIDE_ICON: Record<string, IconCmp> = {
  start: BookOpenIcon,
  finance: StarIcon,
  safety: ShieldIcon,
}

type Props = { guide: HelpGuide }

export function HelpGuideCard({ guide }: Props) {
  const { t } = useTranslation()
  const Icon = GUIDE_ICON[guide.slug] ?? BookOpenIcon

  return (
    <button
      type="button"
      className="flex items-start gap-4 rounded-lg border border-border bg-surface shadow-xs p-5 text-left transition-shadow hover:shadow-sm"
    >
      <span className="rounded-lg bg-accent p-2.5 text-brand">
        <Icon size={18} />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-text">
          {t(`customerService.help.guide.${guide.slug}.title`)}
        </span>
        <span className="text-xs leading-relaxed text-muted">
          {t(`customerService.help.guide.${guide.slug}.desc`)}
        </span>
        <span className="mt-1 text-[11px] font-medium text-muted">
          {t('customerService.help.articleCount', { count: guide.articleCount })}
        </span>
      </span>
    </button>
  )
}
