import type { SVGProps } from 'react'

// Minimal inline icon set (no icon dependency in this repo). Stroke-based,
// inherits text color via currentColor. Each is ≤1 path-group, 24x24 grid.
type IconProps = SVGProps<SVGSVGElement>

function Svg({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function StarIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <Svg fill={filled ? 'currentColor' : 'none'} {...props}>
      <polygon points="12 2 15 9 22 9.3 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.3 9 9" />
    </Svg>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 6h18M8 6V4h8v2m-9 0v14h10V6" />
    </Svg>
  )
}

export function EyeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  )
}

export function EyeOffIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 5.1A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.1 3.9M6.1 6.1A17 17 0 0 0 2 12s3.5 7 10 7a9.8 9.8 0 0 0 2.1-.2" />
    </Svg>
  )
}

export function UploadIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 16V4m0 0L7 9m5-5 5 5M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
    </Svg>
  )
}

export function DownloadIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4v12m0 0 5-5m-5 5-5-5M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
    </Svg>
  )
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 19V5m0 0-6 6m6-6 6 6" />
    </Svg>
  )
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5v14m0 0 6-6m-6 6-6-6" />
    </Svg>
  )
}

export function ImageIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </Svg>
  )
}

export function VideoIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="m16 10 6-3v10l-6-3" />
    </Svg>
  )
}
