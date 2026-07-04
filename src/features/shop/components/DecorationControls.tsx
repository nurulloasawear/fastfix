// Shared controls for the Shop Decoration page:
// PlatformToggle, DecorationMainTabs, DecorationInfoBanner, UseDecorationToggle, WidgetPaletteItem.
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import type { DecorationPlatform } from '../types/shop.types'

// Reusable platform toggle (Mobile | PC)
export function PlatformToggle({
  active,
  onChange,
}: {
  active: DecorationPlatform
  onChange: (p: DecorationPlatform) => void
}) {
  const { t } = useTranslation()
  return (
    <div className="flex gap-1 rounded-lg border border-border-strong bg-bg p-1 text-sm">
      {(['mobile', 'pc'] as DecorationPlatform[]).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`rounded-md px-4 py-1.5 font-semibold transition-colors ${
            active === p
              ? 'bg-surface text-text shadow-xs'
              : 'text-text-secondary hover:text-text'
          }`}
        >
          {p === 'mobile' ? t('shop.decoration.mobileTab') : t('shop.decoration.pcTab')}
        </button>
      ))}
    </div>
  )
}

// Decoration main tabs (Homepage | Category Page | Custom Page | Top Picks)
export function DecorationMainTabs({
  active,
  onChange,
}: {
  active: string
  onChange: (tab: string) => void
}) {
  const { t } = useTranslation()
  const tabs = [
    { key: 'homepage', label: t('shop.decoration.homepageTab') },
    { key: 'categories', label: t('shop.decoration.categoryPageTab') },
    { key: 'custom', label: t('shop.decoration.customPageTab') },
    { key: 'top-picks', label: `${t('shop.decoration.topPicksTab')} ⓘ` },
  ]

  return (
    <div className="flex gap-0 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`px-4 py-3 text-sm font-semibold transition-colors ${
            active === tab.key
              ? 'border-b-2 border-brand text-brand'
              : 'text-text-secondary hover:text-text'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// Info banner (yellow/amber tip)
export function DecorationInfoBanner({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-warning bg-warning-bg px-4 py-3 text-sm text-warning">
      <InfoIcon />
      <span>{text}</span>
    </div>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

// Use-decoration toggle row
export function UseDecorationToggle({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <div
        onClick={() => onChange(!enabled)}
        className={`relative h-5 w-9 rounded-full transition-colors ${enabled ? 'bg-brand' : 'bg-border-strong'}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            enabled ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </div>
      <span className="text-text-secondary">{label}</span>
    </label>
  )
}

// Widget type block in editor palette
export type WidgetPaletteItemProps = {
  icon: ReactNode
  name: string
  onAdd: () => void
}

export function WidgetPaletteItem({ icon, name, onAdd }: WidgetPaletteItemProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="flex w-full flex-col items-center gap-1 rounded-lg border border-border bg-surface p-2 text-center hover:bg-bg"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-bg text-muted">
        {icon}
      </div>
      <span className="text-[10px] leading-tight text-text-secondary">{name}</span>
      <Button variant="primary" size="sm" className="h-6 px-2 text-[10px]">+</Button>
    </button>
  )
}
