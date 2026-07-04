import type { SVGProps } from 'react'

// Tiny inline icon set (no external dep) for the shipment feature.
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

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
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

export function ReceiptIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M8 7h8M8 11h8M8 15h5" />
    </svg>
  )
}

export function WarehouseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M22 8.4V21H2V8.4a2 2 0 0 1 1.2-1.8l8-3.5a2 2 0 0 1 1.6 0l8 3.5A2 2 0 0 1 22 8.4Z" />
      <path d="M6 21v-7h12v7M6 17h12" />
    </svg>
  )
}
