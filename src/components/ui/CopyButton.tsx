import { useState } from 'react'

// Copy-to-clipboard for long IDs (OD-013, RT-016, RTS-017).
type Props = { value: string; className?: string; title?: string }

export function CopyButton({ value, className = '', title = 'Copy' }: Props) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={copied ? 'Copied' : title}
      aria-label={title}
      className={`inline-flex items-center justify-center text-muted transition-colors hover:text-text ${className}`}
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}
