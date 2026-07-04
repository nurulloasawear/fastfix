import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface ProgressTrackStep {
  key: string
  title: string
  description: string
}

interface ProgressTrackProps {
  steps: ProgressTrackStep[]
  /** Step currently shown in the wizard. */
  activeIndex: number
  /** Furthest step unlocked by the backend — everything before it is done. */
  reachedIndex: number
  /** 0–100 fill for the bar (includes sub-progress inside a merged step). */
  fillPercent: number
  onStepSelect: (index: number) => void
}

/**
 * Numeric wizard track: a `0 ──●── N` line with one numbered marker per step.
 * The fill slides on every change; completed markers collapse into checks.
 */
export function ProgressTrack({
  steps,
  activeIndex,
  reachedIndex,
  fillPercent,
  onStepSelect,
}: ProgressTrackProps) {
  const { t } = useTranslation()
  const total = steps.length

  return (
    <div aria-label={t('sellerVerification.progress.ariaLabel')}>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-semibold text-text">
          {t('sellerVerification.progress.stepOf', { current: activeIndex + 1, total })}
        </p>
        <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-brand">
          {Math.round(fillPercent)}%
        </span>
      </div>

      {/* `0 ──①──②──…──Ⓝ` — the leading 0 marks the start; the last marker is the total. */}
      <div className="flex items-center gap-3 pr-4">
        <span className="text-xs font-semibold text-muted" aria-hidden="true">0</span>

        <div className="relative flex-1">
          {/* Track + animated fill */}
          <div
            className="h-1.5 overflow-hidden rounded-full bg-border"
            role="progressbar"
            aria-valuenow={Math.round(fillPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
              style={{ width: `${fillPercent}%` }}
            />
          </div>

          {/* One numbered marker per step, evenly spread along the line */}
          <ol className="absolute inset-x-0 top-1/2 m-0 list-none p-0">
            {steps.map((step, index) => {
              const isDone = index < reachedIndex
              const isActive = index === activeIndex
              const isLocked = index > reachedIndex
              const position = total > 1 ? (index / (total - 1)) * 100 : 0

              let markerClass = 'border-border-strong bg-surface text-muted'
              if (isDone) markerClass = 'border-brand bg-brand text-white'
              else if (isActive) markerClass = 'border-brand bg-accent text-brand ring-4 ring-accent-soft/60'

              return (
                <li
                  key={step.key}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${position}%` }}
                >
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => onStepSelect(index)}
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={step.title}
                    title={`${step.title} — ${step.description}`}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${markerClass} ${
                      isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                    }`}
                  >
                    {isDone ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
                  </button>
                </li>
              )
            })}
          </ol>
        </div>

      </div>

      {/* Active step name under the track (labels above markers get cramped on mobile) */}
      <div className="mt-6 text-center">
        <p className="text-sm font-semibold text-text">{steps[activeIndex]?.title}</p>
        <p className="text-xs text-muted">{steps[activeIndex]?.description}</p>
      </div>
    </div>
  )
}
