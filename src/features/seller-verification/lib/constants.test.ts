import { describe, it, expect } from 'vitest'
import { SERVER_STEP_ORDER, UI_STEPS, uiStepIndexFor } from './constants'

describe('uiStepIndexFor', () => {
  it('maps every server step into a UI group', () => {
    expect(uiStepIndexFor('personal_info')).toBe(0)
    expect(uiStepIndexFor('email')).toBe(0)
    expect(uiStepIndexFor('passport')).toBe(1)
    expect(uiStepIndexFor('inn')).toBe(1)
    expect(uiStepIndexFor('bank')).toBe(2)
    expect(uiStepIndexFor('company')).toBe(3)
    expect(uiStepIndexFor('certificate')).toBe(4)
  })

  it('treats completed as the last UI step', () => {
    expect(uiStepIndexFor('completed')).toBe(UI_STEPS.length - 1)
  })

  it('covers the full server flow with contiguous, ordered groups', () => {
    const flattened = UI_STEPS.flatMap((s) => s.serverSteps)
    expect(flattened).toEqual(SERVER_STEP_ORDER.filter((s) => s !== 'completed'))
  })
})
