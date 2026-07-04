import { Card } from '@/components/ui/Card'

// ── Evidence/reason card (buyer reason or dispute reason) ─────────────────────
// Used in ReturnDetailPage for the red-tinted panels
type Props = {
  title: string
  evidenceUrls: string[]
  reasonCode?: string
  reasonText?: string
  disputeText?: string
  onOpenImage: (url: string) => void
}

export function EvidenceCard({ title, evidenceUrls, reasonCode, reasonText, disputeText, onOpenImage }: Props) {
  return (
    <Card className="border-error-bg bg-error-bg p-4">
      <div className="mb-3 text-sm font-semibold text-text">{title}</div>
      {evidenceUrls.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {evidenceUrls.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onOpenImage(url)}
              className="h-16 w-16 overflow-hidden rounded-lg border border-border bg-bg transition-opacity hover:opacity-80"
            >
              <div className="h-full w-full bg-gradient-to-br from-border to-bg" />
            </button>
          ))}
        </div>
      )}
      {reasonCode && <div className="text-sm font-medium text-text">{reasonCode}</div>}
      {reasonText && <div className="mt-1 text-sm text-text-secondary">{reasonText}</div>}
      {disputeText && <div className="text-sm text-text-secondary">{disputeText}</div>}
    </Card>
  )
}
