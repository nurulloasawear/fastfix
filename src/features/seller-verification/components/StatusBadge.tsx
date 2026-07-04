// StatusBadge.tsx
import * as React from "react"
import { useTranslation } from "react-i18next"
import * as Icons from "lucide-react"
import { VERIFICATION_STATUS_CONFIG } from "../utils/constants"
import type { VerificationStatus } from "../types/enums"

interface StatusBadgeProps {
  status: VerificationStatus
  className?: string
  showIcon?: boolean
  interactive?: boolean
}

export function StatusBadge({
  status,
  className = "",
  showIcon = true,
  interactive = false,
}: StatusBadgeProps): React.JSX.Element {
  const { t } = useTranslation()

  const config = React.useMemo(() => {
    const configMap = VERIFICATION_STATUS_CONFIG as Record<
      string,
      {
        readonly labelKey: string
        readonly tooltipKey: string
        readonly icon: string
        readonly styles: string
      }
    >
    return configMap[status] || configMap.pending
  }, [status])

  const IconComponent = React.useMemo(() => {
    if (!showIcon || !config.icon) return null
    const lucideIconKey = config.icon as keyof typeof Icons
    return (Icons[lucideIconKey] as React.ComponentType<{ className?: string }>) || null
  }, [showIcon, config.icon])

  const badgeElement = (
    <span
      role="status"
      aria-label={t(config.labelKey)}
      tabIndex={interactive ? 0 : undefined}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors duration-200 ${
        config.styles
      } ${interactive ? "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer" : ""} ${className}`}
    >
      {IconComponent && <IconComponent className="h-3.5 w-3.5 flex-shrink-0" />}
      <span>{t(config.labelKey)}</span>
    </span>
  )

  if (interactive && config.tooltipKey) {
    return (
      <div className="relative group inline-block">
        {badgeElement}
        <div 
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block group-focus-within:block bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded shadow-lg whitespace-nowrap z-50 dark:bg-slate-100 dark:text-slate-900"
        >
          {t(config.tooltipKey)}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-100" />
        </div>
      </div>
    )
  }

  return badgeElement
}