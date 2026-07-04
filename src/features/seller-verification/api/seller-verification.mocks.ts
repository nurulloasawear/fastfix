/**
 * ============================================================================
 * Seller Verification MSW Mock Handlers (PERFECT SEQUENTIAL FLOW)
 * ============================================================================
 * Bu fayl frontendning so'rovlariga 100% moslashtirilgan.
 * Inputlar qotib qolmasligi uchun boshlang'ich holatlar 'idle' yoki 'unverified' qilingan.
 */

import { http, HttpResponse } from 'msw'

const API = '*/api/v1'

/* ============================================================================
 * 1. FAKE DATABASE (Boshlang'ich toza holat)
 * ============================================================================
 */

let sellerStatus = {
  completed_steps: 0,
  total_steps: 7,
  progress_percentage: 0,
  current_step: 'personal_info', // Jarayon aynan shu yerdan boshlanadi
  verification_status: 'unverified',
  verified: false,
}

let sellerProfile = {
  id: 'seller-1',
  full_name: '',
  phone: '',
  email: '',
  address: '',
  verification_status: 'unverified',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

let emailStatus = {
  verified: false,
  email: '',
  verified_at: null as string | null,
  status: 'idle', // 'pending' EMAS, input ochiq turishi uchun
}

let passportStatus = {
  verified: false,
  status: 'idle', // 'pending' EMAS, input ochiq turishi uchun
  full_name: null as string | null,
  passport_number: null as string | null,
  verified_at: null as string | null,
  reject_reason: null as string | null,
}

let innStatus = {
  verified: false,
  inn: '',
  company_name: '',
  owner_name: '',
  checked_at: null as string | null,
  status: 'idle', // 'pending' EMAS
}

let bank = {
  id: '',
  card_holder: '',
  card_number: '',
  account_number: '',
  bank_name: '',
  bank_code: '',
  account_type: 'card',
  verified: false,
  is_primary: false,
  created_at: '',
  updated_at: '',
}

let company = {
  id: '',
  company_name: '',
  director_name: '',
  inn: '',
  registration_number: '',
  legal_address: '',
  business_type: 'llc',
  verified: false,
  created_at: '',
  updated_at: '',
}

let certificates: any[] = []

/* ============================================================================
 * 2. HANDLERS (Qadam-baqadam mantiq)
 * ============================================================================
 */

export const sellerVerificationHandlers = [
  
  // ---> GLOBAL STATUS <---
  http.get(`${API}/seller/status`, () => {
    return HttpResponse.json(sellerStatus)
  }),

  /**
   * ==========================================================================
   * STEP 1: PERSONAL INFO
   * ==========================================================================
   */
  http.get(`${API}/seller/profile`, () => {
    return HttpResponse.json(sellerProfile)
  }),

  http.put(`${API}/seller/profile`, async ({ request }) => {
    const body = (await request.json()) as Partial<typeof sellerProfile>
    
    sellerProfile = { ...sellerProfile, ...body, updated_at: new Date().toISOString() }

    // SUCCESS: Move to EMAIL
    sellerStatus.current_step = 'email'
    sellerStatus.completed_steps = Math.max(sellerStatus.completed_steps, 1)
    sellerStatus.progress_percentage = 14

    return HttpResponse.json(sellerProfile)
  }),

  /**
   * ==========================================================================
   * STEP 2: EMAIL
   * ==========================================================================
   */
  http.get(`${API}/seller/email/status`, () => {
    return HttpResponse.json(emailStatus)
  }),

  http.post(`${API}/seller/email/send`, async ({ request }) => {
    const body = (await request.json()) as { email: string }
    emailStatus = { ...emailStatus, email: body.email, status: 'otp_sent' }
    return HttpResponse.json({ success: true, message: 'OTP sent' })
  }),

  http.post(`${API}/seller/email/verify`, async ({ request }) => {
    const body = await request.json() as any;
    
    // Frontend ba'zida 'code', ba'zida 'otp' yuboradi. Ikkalasini ham ushlaymiz.
    const code = body.code || body.otp; 

    if (code !== '123456') {
      return HttpResponse.json({ success: false, message: 'Invalid code' }, { status: 400 })
    }

    emailStatus = { verified: true, email: body.email, verified_at: new Date().toISOString(), status: 'verified' }
    
    // SUCCESS: Move to PASSPORT
    sellerStatus.current_step = 'passport'
    sellerStatus.completed_steps = Math.max(sellerStatus.completed_steps, 2)
    sellerStatus.progress_percentage = 28

    return HttpResponse.json({ success: true, verified: true })
  }),

  /**
   * ==========================================================================
   * STEP 3: PASSPORT
   * ==========================================================================
   */
  http.get(`${API}/seller/passport/status`, () => {
    return HttpResponse.json(passportStatus)
  }),

  http.post(`${API}/seller/passport/start`, async ({ request }) => {
    const body = await request.json() as { passport_number: string }

    // Dastur qotib qolmasligi uchun darhol 'verified' qilamiz
    passportStatus = {
      verified: true,
      status: 'verified', 
      full_name: "John Doe",
      passport_number: body.passport_number,
      verified_at: new Date().toISOString(),
      reject_reason: null,
    }

    // SUCCESS: Move to INN
    sellerStatus.current_step = 'inn'
    sellerStatus.completed_steps = Math.max(sellerStatus.completed_steps, 3)
    sellerStatus.progress_percentage = 42

    return HttpResponse.json({ success: true })
  }),

  /**
   * ==========================================================================
   * STEP 4: INN
   * ==========================================================================
   */
  http.get(`${API}/seller/inn/status`, () => {
    return HttpResponse.json(innStatus)
  }),

  http.post(`${API}/seller/inn/verify`, async ({ request }) => {
    const body = await request.json() as { inn: string }

    // Darhol tasdiqlaymiz
    innStatus = {
      verified: true,
      inn: body.inn,
      company_name: 'Demo Company LLC',
      owner_name: 'John Doe',
      checked_at: new Date().toISOString(),
      status: 'verified',
    }

    // SUCCESS: Move to BANK
    sellerStatus.current_step = 'bank'
    sellerStatus.completed_steps = Math.max(sellerStatus.completed_steps, 4)
    sellerStatus.progress_percentage = 57

    return HttpResponse.json({ verified: true, ...innStatus })
  }),

  /**
   * ==========================================================================
   * STEP 5: BANK ACCOUNT
   * ==========================================================================
   */
  http.get(`${API}/seller/bank`, () => {
    return HttpResponse.json(bank)
  }),

  http.put(`${API}/seller/bank`, async ({ request }) => {
    const body = await request.json() as any

    bank = {
      ...body,
      id: crypto.randomUUID(),
      verified: true,
      is_primary: true,
      updated_at: new Date().toISOString(),
    }

    // SUCCESS: Move to COMPANY
    sellerStatus.current_step = 'company'
    sellerStatus.completed_steps = Math.max(sellerStatus.completed_steps, 5)
    sellerStatus.progress_percentage = 71

    return HttpResponse.json(bank, { status: 201 })
  }),

  /**
   * ==========================================================================
   * STEP 6: COMPANY
   * ==========================================================================
   */
  http.get(`${API}/seller/company`, () => {
    return HttpResponse.json(company)
  }),

  http.put(`${API}/seller/company`, async ({ request }) => {
    const body = await request.json() as any

    company = {
      ...body,
      id: crypto.randomUUID(),
      verified: true,
      updated_at: new Date().toISOString(),
    }

    // SUCCESS: Move to CERTIFICATE
    sellerStatus.current_step = 'certificate'
    sellerStatus.completed_steps = Math.max(sellerStatus.completed_steps, 6)
    sellerStatus.progress_percentage = 85

    return HttpResponse.json(company, { status: 201 })
  }),

  /**
   * ==========================================================================
   * STEP 7: CERTIFICATES (Va yakunlash)
   * ==========================================================================
   */
http.get(`${API}/seller/certificates`, () => {
    return HttpResponse.json(certificates)
  }),

  http.post(`${API}/seller/certificates`, async ({ request }) => {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    // Agar form-datada document_type bo'lsa uni olamiz, yo'qsa 'other' qo'yamiz
    const documentType = (formData.get('document_type') as string) || 'other'

    const certificate = {
      id: crypto.randomUUID(),
      file_name: file?.name || 'document.pdf',
      original_name: file?.name || 'document.pdf',
      mime_type: file?.type || 'application/pdf', // <-- Xatolikni shu qator to'g'irlaydi
      file_size: file?.size || 1024,
      document_type: documentType,                // <-- Yoki shu qator
      verified: true,
      uploaded_at: new Date().toISOString(),
      download_url: `/mock/files/${file?.name || 'document.pdf'}`,
    }

    certificates.unshift(certificate)

    // FINAL SUCCESS: Move to COMPLETED
    sellerStatus.current_step = 'completed'
    sellerStatus.completed_steps = 7
    sellerStatus.progress_percentage = 100
    sellerStatus.verification_status = 'verified'
    sellerStatus.verified = true

    return HttpResponse.json(certificate, { status: 201 })
  }),
  /**
   * ==========================================================================
   * RESET (Dasturni boshidan sinash uchun)
   * ==========================================================================
   */
  http.post(`${API}/seller/mock/reset`, () => {
    sellerStatus = { completed_steps: 0, total_steps: 7, progress_percentage: 0, current_step: 'personal_info', verification_status: 'unverified', verified: false }
    emailStatus = { verified: false, email: '', verified_at: null, status: 'idle' }
    passportStatus = { verified: false, status: 'idle', full_name: null, passport_number: null, verified_at: null, reject_reason: null }
    innStatus = { verified: false, inn: '', company_name: '', owner_name: '', checked_at: null, status: 'idle' }
    certificates = []
    return HttpResponse.json({ success: true })
  }),
]