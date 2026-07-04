import type { ReactNode } from 'react'

// Zenith page header: 24px Poppins SemiBold title, optional breadcrumb/subtitle,
// right-aligned actions.
type Props = {
  title: string
  subtitle?: string
  breadcrumb?: ReactNode
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, breadcrumb, actions }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {breadcrumb && <div className="text-sm text-muted">{breadcrumb}</div>}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-text">{title}</h1>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
