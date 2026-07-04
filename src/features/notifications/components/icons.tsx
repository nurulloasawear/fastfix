import type { SVGProps } from 'react'

// Tiny inline icon set (no external dep) used across the notifications feature.
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

export function BellIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

export function PackageIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m7.5 4.3 9 5.2M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  )
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 2 15.1 8.3 22 9.3l-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1z" />
    </svg>
  )
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />
    </svg>
  )
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12.6 2.6a2 2 0 0 0-1.4-.6H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.6 8.6a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8z" />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function MegaphoneIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m3 11 15-6v14L3 13zM3 11v2a2 2 0 0 0 2 2h2M7 15v4a1 1 0 0 0 1 1h2" />
    </svg>
  )
}

export function WalletIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
      <path d="M21 9H17a2 2 0 0 0 0 6h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1Z" />
    </svg>
  )
}

export function MailOpenIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8.5a2 2 0 0 1 .9-1.7l7-4.6a2 2 0 0 1 2.2 0l7 4.6a2 2 0 0 1 .9 1.7Z" />
      <path d="m3 11 9 6 9-6" />
    </svg>
  )
}
