// Loading skeletons (OD-007, RTS-011, ORD-008) — replace bare spinners with
// layout-shaped shimmer so the page doesn't jump when data arrives.

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-[#eaecf0] ${className}`} />
}

/** N shimmer table rows that match a column count. Render inside <tbody>. */
export function TableRowSkeleton({ cols, rows = 6 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-border last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-4 py-3.5">
              <Skeleton className="h-4 w-full max-w-[160px]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

/** Stacked text-line shimmer for cards / detail panels. */
export function CardSkeleton({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === 0 ? 'w-1/3' : 'w-full'}`} />
      ))}
    </div>
  )
}
