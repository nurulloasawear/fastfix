import type { ButtonHTMLAttributes } from 'react'

// Zenith buttons are full pills. Primary is brand brown; on hover it flips to the
// yellow accent with brown text (per the Figma button matrix).
type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-white border border-brand hover:bg-accent hover:text-brand hover:border-accent',
  secondary: 'bg-accent text-brand border border-accent hover:bg-accent-soft',
  outline: 'bg-surface text-muted border border-border-strong hover:bg-bg',
  ghost: 'bg-transparent text-text-secondary hover:bg-bg',
  destructive: 'bg-error text-white border border-error hover:opacity-90',
}

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-10 px-5 text-sm',
  lg: 'h-11 px-6 text-base',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}
