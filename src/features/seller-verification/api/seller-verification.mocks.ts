import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'

// Backend-shaped (snake_case) responses so the api mappers run in dev exactly
// as in prod. Stateful sequential flow: each successful write advances
// current_step, mirroring the real backend's wizard state machine.

const BASE = env.apiBaseUrl

const STEP_FLOW = [
  'personal_info',
  'email',
  'passport',
  'inn',
  'bank',
  'company',
  'certificate',
  'completed',
] as const

const TOTAL_STEPS = STEP_FLOW.length - 1
const MOCK_OTP = '123456'

interface MockCertificate {
  id: string
  file_name: string
  original_name: string
  mime_type: string
  file_size: number
  document_type: string
  verified: boolean
  uploaded_at: string
}

function initialState() {
  return {
    stepIndex: 0,
    profile: {
      id: 'seller-1',
      full_name: '',
      phone: '',
      email: '',
      address: '',
      verification_status: 'unverified',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    email: {
      status: 'idle',
      verified: false,
      email: '',
      verified_at: null as string | null,
    },
    passport: {
      status: 'idle',
      full_name: null as string | null,
      passport_number: null as string | null,
      verified_at: null as string | null,
      reject_reason: null as string | null,
    },
    inn: {
      status: 'idle',
      verified: false,
      inn: '',
      company_name: '',
      owner_name: '',
      checked_at: null as string | null,
    },
    bank: null as Record<string, unknown> | null,
    company: null as Record<string, unknown> | null,
    certificates: [] as MockCertificate[],
  }
}

let db = initialState()

// Status is DERIVED from progress so list and summary can never disagree.
function sellerStatus() {
  const completed = db.stepIndex
  const done = db.stepIndex >= TOTAL_STEPS
  return {
    current_step: STEP_FLOW[db.stepIndex],
    completed_steps: Math.min(completed, TOTAL_STEPS),
    total_steps: TOTAL_STEPS,
    progress_percentage: Math.round((Math.min(completed, TOTAL_STEPS) / TOTAL_STEPS) * 100),
    verification_status: done ? 'verified' : 'unverified',
    verified: done,
  }
}

/** Advance the wizard past `step` if the flow is currently on it. */
function completeStep(step: (typeof STEP_FLOW)[number]) {
  const idx = STEP_FLOW.indexOf(step)
  if (db.stepIndex === idx) db.stepIndex = idx + 1
}

export const sellerVerificationHandlers = [
  http.get(`${BASE}/seller/status`, () => HttpResponse.json(sellerStatus())),

  /* Profile (step 1) */
  http.get(`${BASE}/seller/profile`, () => HttpResponse.json(db.profile)),

  http.put(`${BASE}/seller/profile`, async ({ request }) => {
    const body = (await request.json()) as Partial<typeof db.profile>
    db.profile = { ...db.profile, ...body, updated_at: new Date().toISOString() }
    completeStep('personal_info')
    return HttpResponse.json(db.profile)
  }),

  /* Email confirmation (step 2) */
  http.get(`${BASE}/seller/email/status`, () => HttpResponse.json(db.email)),

  http.post(`${BASE}/seller/email/send`, async ({ request }) => {
    const body = (await request.json()) as { email?: string }
    db.email = { ...db.email, email: body.email ?? '', status: 'otp_sent' }
    return HttpResponse.json({ success: true, message: 'OTP sent' })
  }),

  http.post(`${BASE}/seller/email/verify`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; code?: string }
    if (body.code !== MOCK_OTP) {
      return HttpResponse.json({ error: 'invalid_otp' }, { status: 400 })
    }
    db.email = {
      status: 'verified',
      verified: true,
      email: body.email ?? db.email.email,
      verified_at: new Date().toISOString(),
    }
    completeStep('email')
    return HttpResponse.json({ success: true, verified: true })
  }),

  /* Passport / MyID (step 3) — mock verifies instantly, no redirect leg */
  http.get(`${BASE}/seller/passport/status`, () => HttpResponse.json(db.passport)),

  http.post(`${BASE}/seller/passport/start`, async ({ request }) => {
    const body = (await request.json()) as { passport_number?: string }
    db.passport = {
      status: 'verified',
      full_name: 'John Doe',
      passport_number: body.passport_number ?? null,
      verified_at: new Date().toISOString(),
      reject_reason: null,
    }
    completeStep('passport')
    return HttpResponse.json({ success: true, redirect_url: null })
  }),

  /* INN (step 4) */
  http.get(`${BASE}/seller/inn/status`, () => HttpResponse.json(db.inn)),

  http.post(`${BASE}/seller/inn/verify`, async ({ request }) => {
    const body = (await request.json()) as { inn?: string }
    db.inn = {
      status: 'verified',
      verified: true,
      inn: body.inn ?? '',
      company_name: 'Demo Company LLC',
      owner_name: 'John Doe',
      checked_at: new Date().toISOString(),
    }
    completeStep('inn')
    return HttpResponse.json(db.inn)
  }),

  /* Bank account (step 5) — 404 until saved so the empty state renders */
  http.get(`${BASE}/seller/bank`, () => {
    if (!db.bank) return HttpResponse.json({ error: 'not_found' }, { status: 404 })
    return HttpResponse.json(db.bank)
  }),

  http.put(`${BASE}/seller/bank`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    db.bank = {
      ...body,
      id: db.bank?.id ?? crypto.randomUUID(),
      verified: true,
      is_primary: true,
      updated_at: new Date().toISOString(),
    }
    completeStep('bank')
    return HttpResponse.json(db.bank, { status: 201 })
  }),

  /* Company (step 6) — 404 until saved */
  http.get(`${BASE}/seller/company`, () => {
    if (!db.company) return HttpResponse.json({ error: 'not_found' }, { status: 404 })
    return HttpResponse.json(db.company)
  }),

  http.put(`${BASE}/seller/company`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    db.company = {
      ...body,
      id: db.company?.id ?? crypto.randomUUID(),
      verified: true,
      updated_at: new Date().toISOString(),
    }
    completeStep('company')
    return HttpResponse.json(db.company, { status: 201 })
  }),

  /* Certificates (step 7 → completed) */
  http.get(`${BASE}/seller/certificates`, () => HttpResponse.json(db.certificates)),

  http.post(`${BASE}/seller/certificates`, async ({ request }) => {
    const formData = await request.formData()
    const file = formData.get('file')
    const isFile = file instanceof File
    const certificate: MockCertificate = {
      id: crypto.randomUUID(),
      file_name: isFile ? file.name : 'document.pdf',
      original_name: isFile ? file.name : 'document.pdf',
      mime_type: isFile ? file.type : 'application/pdf',
      file_size: isFile ? file.size : 1024,
      document_type: String(formData.get('document_type') ?? 'other'),
      verified: true,
      uploaded_at: new Date().toISOString(),
    }
    db.certificates.unshift(certificate)
    completeStep('certificate')
    return HttpResponse.json(certificate, { status: 201 })
  }),

  http.delete(`${BASE}/seller/certificates/:id`, ({ params }) => {
    db.certificates = db.certificates.filter((c) => c.id !== params.id)
    return HttpResponse.json({ success: true })
  }),

  /* Dev helper: restart the whole flow */
  http.post(`${BASE}/seller/mock/reset`, () => {
    db = initialState()
    return HttpResponse.json({ success: true })
  }),
]
