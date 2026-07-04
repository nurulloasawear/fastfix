import { useTranslation } from 'react-i18next'
import type { OrderTrackingStep } from '../types/orders.types'

type Props = { steps: OrderTrackingStep[] }

export function OrderTimeline({ steps }: Props) {
  const { t } = useTranslation()

  return (
    <ol className="relative ml-2 border-l border-border">
      {steps.map((step) => (
        <li key={step.id} className="mb-5 ml-5 last:mb-0">
          <span
            className={`absolute -left-[7px] mt-1 h-3.5 w-3.5 rounded-full border-2 ${
              step.completed ? 'border-brand bg-brand' : 'border-border bg-surface'
            }`}
          />
          <h4 className={`text-sm font-medium ${step.completed ? 'text-text' : 'text-muted'}`}>
            {t(`orders.step.${step.title}`)}
          </h4>
          <p className="text-xs text-muted">
            {step.date}&nbsp;&nbsp;{step.time}
          </p>
        </li>
      ))}
    </ol>
  )
}
