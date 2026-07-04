import type { SVGProps } from 'react'

// Tiny inline icon set (no external dep) used across the home feature.
// Stroke-based, inherit currentColor; size via the `size` prop.
type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 16, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...props,
  }
}

export function BanknoteIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  )
}

export function TruckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14 18V6H2v12M14 9h5l3 4v5h-8M7 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM21 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    </svg>
  )
}

export function PackageCheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m16 16 2 2 4-4M21 10V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l2-1.1" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  )
}

export function CartIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.5 3h2l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  )
}

export function RefundIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 7v6h6" />
      <path d="M3.5 13a9 9 0 1 0 .8-4.6" />
      <path d="M12 8v4l2 2" />
    </svg>
  )
}

export function BanIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m5.6 5.6 12.8 12.8" />
    </svg>
  )
}

export function PackageXIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 10V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l2-1.1" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12M17 13l4 4M21 13l-4 4" />
    </svg>
  )
}

export function MegaphoneIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m3 11 15-7v16l-15-7v-2ZM3 11v4a2 2 0 0 0 2 2h2M9 12.5V21" />
    </svg>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  )
}

export function TrendUpIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 17l6-6 4 4 8-8M21 7h-6M21 7v6" />
    </svg>
  )
}

export function TrendDownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 7l6 6 4-4 8 8M21 17h-6M21 17v-6" />
    </svg>
  )
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  )
}
