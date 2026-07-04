type Tab<T extends string> = { value: T; label: string; count?: number }

type Props<T extends string> = {
  tabs: Tab<T>[]
  active: T
  onChange: (value: T) => void
}

// Zenith pill-row segmented control used by the reviews and media views.
export function SegmentedTabs<T extends string>({ tabs, active, onChange }: Props<T>) {
  return (
    <div className="flex w-full flex-wrap gap-2 sm:w-auto">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            active === tab.value
              ? 'bg-brand text-white'
              : 'border border-border-strong bg-surface text-text-secondary hover:bg-bg'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && ` (${tab.count})`}
        </button>
      ))}
    </div>
  )
}
