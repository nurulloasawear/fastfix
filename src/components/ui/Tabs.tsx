import type { ReactNode } from 'react'

// Segmented pill tabs (status tabs, sub-nav). active = brand fill; counts optional.
export type TabItem = { key: string; label: ReactNode; count?: number }

type Props = {
  items: TabItem[]
  value: string
  onChange: (key: string) => void
  className?: string
}

export function Tabs({ items, value, onChange, className = '' }: Props) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((it) => {
        const active = it.key === value
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => onChange(it.key)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active
                ? 'bg-brand text-white'
                : 'border border-border-strong bg-surface text-text-secondary hover:bg-bg'
            }`}
          >
            {it.label}
            {it.count != null && (
              <span
                className={`rounded-full px-1.5 text-xs font-medium ${active ? 'bg-white/20 text-white' : 'bg-bg text-muted'}`}
              >
                {it.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
