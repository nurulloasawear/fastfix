import type { ServerStep, UiStepKey } from '../types/seller-verification.types'

/** Backend step order — the server advances current_step through this list. */
export const SERVER_STEP_ORDER: readonly ServerStep[] = [
  'personal_info',
  'email',
  'passport',
  'inn',
  'bank',
  'company',
  'certificate',
  'completed',
] as const

/**
 * UI wizard steps. Logically-similar server steps are merged into one screen
 * (profile + its email confirmation; passport + INN — both "enter a number,
 * verify it" identity checks). Groups are contiguous in SERVER_STEP_ORDER so
 * the backend's sequential flow maps cleanly onto the wizard.
 */
export const UI_STEPS: readonly { key: UiStepKey; serverSteps: readonly ServerStep[] }[] = [
  { key: 'profile', serverSteps: ['personal_info', 'email'] },
  { key: 'identity', serverSteps: ['passport', 'inn'] },
  { key: 'bank', serverSteps: ['bank'] },
  { key: 'company', serverSteps: ['company'] },
  { key: 'documents', serverSteps: ['certificate'] },
] as const

/** Index of the UI step that contains the given server step (last step if completed). */
export function uiStepIndexFor(serverStep: ServerStep): number {
  if (serverStep === 'completed') return UI_STEPS.length - 1
  const idx = UI_STEPS.findIndex((s) => s.serverSteps.includes(serverStep))
  return idx === -1 ? 0 : idx
}

/* OTP */
export const OTP_LENGTH = 6
export const OTP_RESEND_SECONDS = 60

/* Field limits */
export const FULL_NAME_MAX_LENGTH = 150
export const PHONE_MAX_LENGTH = 20
export const EMAIL_MAX_LENGTH = 255
export const COMPANY_NAME_MAX_LENGTH = 255
export const LEGAL_ADDRESS_MAX_LENGTH = 500
export const PASSPORT_LENGTH = 9
export const INN_LENGTH = 9
export const CARD_NUMBER_LENGTH = 16

/* Certificate upload */
export const MAX_CERTIFICATE_SIZE = 10 * 1024 * 1024 // 10 MB
export const ALLOWED_CERTIFICATE_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const

/* Polling — MyID review happens out-of-band, so the passport status is polled
   while it is pending/processing. */
export const PASSPORT_STATUS_POLL_INTERVAL = 5_000

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[0-9]{9,15}$/,
  PASSPORT: /^[A-Z]{2}[0-9]{7}$/,
  INN: /^[0-9]{9}$/,
  CARD: /^[0-9]{16}$/,
} as const
