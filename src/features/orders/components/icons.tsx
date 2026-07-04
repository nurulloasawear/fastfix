import type { SVGProps } from 'react'

// Inline icon set — no external deps. Stroke-based, inherits currentColor.
type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 16, ...props }: IconProps) {
  return {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, ...props,
  }
}

export function CalendarIcon(p: IconProps) {
  return <svg {...base(p)}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
}
export function ChevronDownIcon(p: IconProps) {
  return <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
}
export function ChevronLeftIcon(p: IconProps) {
  return <svg {...base(p)}><path d="m15 18-6-6 6-6" /></svg>
}
export function ChevronRightIcon(p: IconProps) {
  return <svg {...base(p)}><path d="m9 18 6-6-6-6" /></svg>
}
export function SearchIcon(p: IconProps) {
  return <svg {...base(p)}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
}
export function SlidersIcon(p: IconProps) {
  return <svg {...base(p)}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4" /></svg>
}
export function EyeIcon(p: IconProps) {
  return <svg {...base(p)}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
}
export function StoreIcon(p: IconProps) {
  return <svg {...base(p)}><path d="M3 9 4 4h16l1 5M4 9v11h16V9M9 20v-6h6v6" /></svg>
}
export function CheckIcon(p: IconProps) {
  return <svg {...base(p)}><path d="M20 6 9 17l-5-5" /></svg>
}
export function MessageIcon(p: IconProps) {
  return <svg {...base(p)}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
}
export function PackageIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m7.5 4.3 9 5.2M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  )
}
export function MapPinIcon(p: IconProps) {
  return <svg {...base(p)}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
}
export function TruckIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M14 18V6H2v12M14 9h5l3 4v5h-8M7 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM21 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    </svg>
  )
}
export function DollarIcon(p: IconProps) {
  return <svg {...base(p)}><circle cx="12" cy="12" r="10" /><path d="M16 8h-5a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H8M12 6v2M12 16v2" /></svg>
}
export function ClipboardIcon(p: IconProps) {
  return <svg {...base(p)}><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /></svg>
}
export function RotateCcwIcon(p: IconProps) {
  return <svg {...base(p)}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
}
export function FileTextIcon(p: IconProps) {
  return <svg {...base(p)}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
}
export function DownloadIcon(p: IconProps) {
  return <svg {...base(p)}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
}
export function InfoCircleIcon(p: IconProps) {
  return <svg {...base(p)}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
}
export function AlertCircleIcon(p: IconProps) {
  return <svg {...base(p)}><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
}
export function XCircleIcon(p: IconProps) {
  return <svg {...base(p)}><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></svg>
}
export function UserIcon(p: IconProps) {
  return <svg {...base(p)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
export function ListIcon(p: IconProps) {
  return <svg {...base(p)}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
}
