import type { ReactNode } from 'react'

// Standard page wrapper: centered max width, consistent padding + vertical rhythm.
// Every route page should wrap its content in <Page>.
export function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-6 md:p-8 ${className}`}>
      {children}
    </div>
  )
}
