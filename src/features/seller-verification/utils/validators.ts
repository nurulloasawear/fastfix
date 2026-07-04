/**
 * ============================================================================
 * Seller Verification Validators
 * ============================================================================
 *
 * Ushbu faylda feature bo'yicha barcha validation helperlari saqlanadi.
 *
 * Qoidalar:
 *  - Pure functions
 *  - Side effect yo'q
 *  - Reusable
 *  - Test qilish oson
 *
 * ============================================================================
 */

import {
  CARD_NUMBER_LENGTH,
  COMPANY_NAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  FULL_NAME_MAX_LENGTH,
  INN_LENGTH,
  LEGAL_ADDRESS_MAX_LENGTH,
  MAX_CERTIFICATE_SIZE,
  PASSPORT_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  REGEX,
  ALLOWED_CERTIFICATE_MIME_TYPES,
} from './constants'

/* ============================================================================
 * REQUIRED
 * ============================================================================
 */

export function isRequired(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false
  }

  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  return true
}

/* ============================================================================
 * FULL NAME
 * ============================================================================
 */

export function validateFullName(value: string): boolean {
  return (
    isRequired(value) &&
    value.trim().length <= FULL_NAME_MAX_LENGTH
  )
}

/* ============================================================================
 * PHONE
 * ============================================================================
 */

export function validatePhone(value: string): boolean {
  return (
    isRequired(value) &&
    value.length <= PHONE_MAX_LENGTH &&
    REGEX.PHONE.test(value)
  )
}

/* ============================================================================
 * EMAIL
 * ============================================================================
 */

export function validateEmail(value: string): boolean {
  return (
    isRequired(value) &&
    value.length <= EMAIL_MAX_LENGTH &&
    REGEX.EMAIL.test(value)
  )
}

/* ============================================================================
 * PASSPORT
 * ============================================================================
 */

export function validatePassport(value: string): boolean {
  return (
    isRequired(value) &&
    value.length === PASSPORT_MAX_LENGTH &&
    REGEX.PASSPORT.test(value)
  )
}

/* ============================================================================
 * INN
 * ============================================================================
 */

export function validateInn(value: string): boolean {
  return (
    isRequired(value) &&
    value.length === INN_LENGTH &&
    REGEX.INN.test(value)
  )
}

/* ============================================================================
 * CARD
 * ============================================================================
 */

export function validateCardNumber(value: string): boolean {
  const normalized = value.replace(/\s/g, '')

  return (
    normalized.length === CARD_NUMBER_LENGTH &&
    REGEX.CARD.test(normalized)
  )
}

/* ============================================================================
 * COMPANY NAME
 * ============================================================================
 */

export function validateCompanyName(value: string): boolean {
  return (
    isRequired(value) &&
    value.length <= COMPANY_NAME_MAX_LENGTH
  )
}

/* ============================================================================
 * LEGAL ADDRESS
 * ============================================================================
 */

export function validateLegalAddress(value: string): boolean {
  return (
    isRequired(value) &&
    value.length <= LEGAL_ADDRESS_MAX_LENGTH
  )
}

/* ============================================================================
 * OTP
 * ============================================================================
 */

export function validateOtp(
  code: string,
  length = 6,
): boolean {
  return new RegExp(`^[0-9]{${length}}$`).test(code)
}

/* ============================================================================
 * FILE SIZE
 * ============================================================================
 */

export function validateFileSize(
  file: File,
): boolean {
  return file.size <= MAX_CERTIFICATE_SIZE
}

/* ============================================================================
 * MIME TYPE
 * ============================================================================
 */

export function validateMimeType(
  file: File,
): boolean {
  return ALLOWED_CERTIFICATE_MIME_TYPES.includes(
    file.type as (typeof ALLOWED_CERTIFICATE_MIME_TYPES)[number],
  )
}

/* ============================================================================
 * FILE
 * ============================================================================
 */

export function validateCertificateFile(
  file: File,
): boolean {
  return (
    validateFileSize(file) &&
    validateMimeType(file)
  )
}

/* ============================================================================
 * BANK ACCOUNT
 * ============================================================================
 */

export function validateBankAccount(
  cardNumber: string,
): boolean {
  return validateCardNumber(cardNumber)
}

/* ============================================================================
 * FORM
 * ============================================================================
 */

export function validatePersonalInfo(data: {
  fullName: string
  phone: string
  email: string
}) {
  return {
    fullName: validateFullName(data.fullName),

    phone: validatePhone(data.phone),

    email: validateEmail(data.email),
  }
}