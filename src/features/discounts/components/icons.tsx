import type { SVGProps } from 'react'

// Lightweight inline icon set (no external icon dependency). Stroke-based,
// 24x24 viewBox, currentColor — sized via the `size` prop.
type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 18, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const TicketIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" />
    <path d="M13 6v2M13 11v2M13 16v2" />
  </Svg>
)
export const Plus = (p: IconProps) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>
export const Search = (p: IconProps) => (
  <Svg {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Svg>
)
export const Calendar = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Svg>
)
export const X = (p: IconProps) => <Svg {...p}><path d="M18 6 6 18M6 6l12 12" /></Svg>
export const Edit3 = (p: IconProps) => (
  <Svg {...p}><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></Svg>
)
export const Trash2 = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6M14 11v6" />
  </Svg>
)
export const Dice = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01" />
  </Svg>
)
export const ClockIcon = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 3" /></Svg>
)
export const UsersIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
)
export const ChartIcon = (p: IconProps) => (
  <Svg {...p}><path d="M3 3v18h18M7 16V9M12 16V5M17 16v-4" /></Svg>
)
export const AlertTriangle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4M12 17h.01" />
  </Svg>
)
