import { PassportSection } from './PassportSection'
import { InnSection } from './InnSection'

/** "Identity & Tax" — merges the passport (MyID) and INN checks into one
 *  screen: both are "enter a number, verify it" flows. Renders inside the
 *  wizard Card, so no extra Card wrapper here. */
export function IdentityStep() {
  return (
    <div className="space-y-8">
      <PassportSection />
      <div className="border-t border-border" aria-hidden="true" />
      <InnSection />
    </div>
  )
}
