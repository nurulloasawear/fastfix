// Table cell with an embedded CSS progress bar for % columns.
type Props = {
  value: number     // 0-100
  label?: string    // formatted text; defaults to `${value}%`
}

export function InlineBarCell({ value, label }: Props) {
  const pct = Math.min(Math.max(value, 0), 100)
  const display = label ?? `${pct.toFixed(2)}%`

  return (
    <div className="flex min-w-[80px] flex-col gap-0.5">
      <span className="text-xs font-medium text-text">{display}</span>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
        <div
          className="h-full rounded-full bg-[#3b82f6]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
