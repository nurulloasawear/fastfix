import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes, HTMLAttributes } from 'react'

// Zenith table primitives: gray header (#f2f4f7), 12px muted header text, row dividers.
export function Table({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full border-collapse text-sm ${className}`}>{children}</table>
    </div>
  )
}

// Header cells are sticky (RT-018, RTS-020) — they stay visible while a scroll
// container scrolls. Harmless when there is no scrolling ancestor.
export function Th({ children, className = '', ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`sticky top-0 z-10 bg-table-header px-4 py-3 text-left text-xs font-medium text-muted ${className}`} {...props}>
      {children}
    </th>
  )
}

export function Tr({ children, className = '', ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`border-b border-border last:border-0 ${className}`} {...props}>
      {children}
    </tr>
  )
}

export function Td({ children, className = '', ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3 align-middle text-text ${className}`} {...props}>
      {children}
    </td>
  )
}
