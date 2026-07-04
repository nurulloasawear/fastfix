import type { ReactNode, SVGProps } from 'react'

// Inline SVG icon set — no external dependency. Stroke-based, 24x24 viewBox.
type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 18, children, ...rest }: IconProps & { children: ReactNode }) {
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

export const ChevronDown = (p: IconProps) => <Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>
export const ChevronLeft = (p: IconProps) => <Svg {...p}><path d="m15 18-6-6 6-6" /></Svg>
export const ChevronRight = (p: IconProps) => <Svg {...p}><path d="m9 18 6-6-6-6" /></Svg>
export const X = (p: IconProps) => <Svg {...p}><path d="M18 6 6 18M6 6l12 12" /></Svg>
export const Plus = (p: IconProps) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>
export const PlusCircle = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></Svg>
)
export const Edit3 = (p: IconProps) => (
  <Svg {...p}><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></Svg>
)
export const Grid3X3 = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
  </Svg>
)
export const List = (p: IconProps) => (
  <Svg {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></Svg>
)
export const ImagePlus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
    <path d="M16 5h6M19 2v6M21 15l-5-5L5 21" />
  </Svg>
)
export const Trash2 = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6M14 11v6" />
  </Svg>
)
export const Search = (p: IconProps) => (
  <Svg {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Svg>
)
export const FileX2 = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4M3 12.5l5 5M8 12.5l-5 5" />
  </Svg>
)
export const Rocket = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
  </Svg>
)
export const ArrowUpDown = (p: IconProps) => (
  <Svg {...p}><path d="m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16" /></Svg>
)
export const Zap = (p: IconProps) => (
  <Svg {...p}><path d="M13 2 3 14h9l-1 8 10-12h-9z" /></Svg>
)
export const InfoIcon = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></Svg>
)
export const MoreHoriz = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
  </Svg>
)
export const CheckCircle = (p: IconProps) => (
  <Svg {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></Svg>
)
export const AlertCircle = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></Svg>
)
export const PackageIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
  </Svg>
)
export const UploadCloud = (p: IconProps) => (
  <Svg {...p}>
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </Svg>
)
export const VideoIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5" />
  </Svg>
)
export const Sparkles = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5 10.1 7.6 12 3z" />
    <path d="M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" />
  </Svg>
)
