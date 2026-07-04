// Field validators return an i18n key (under sellerVerification.*) or null.
// Components resolve the key with t() so messages localize for free.

import {
  ALLOWED_CERTIFICATE_MIME_TYPES,
  EMAIL_MAX_LENGTH,
  FULL_NAME_MAX_LENGTH,
  MAX_CERTIFICATE_SIZE,
  PHONE_MAX_LENGTH,
  REGEX,
} from './constants'

export type ValidationError = string | null

export function validateRequired(value: string): ValidationError {
  return value.trim() ? null : 'sellerVerification.validation.required'
}

export function validateFullName(value: string): ValidationError {
  const required = validateRequired(value)
  if (required) return required
  return value.trim().length <= FULL_NAME_MAX_LENGTH
    ? null
    : 'sellerVerification.validation.fullNameTooLong'
}

export function validatePhone(value: string): ValidationError {
  const required = validateRequired(value)
  if (required) return required
  return REGEX.PHONE.test(value.trim()) && value.length <= PHONE_MAX_LENGTH
    ? null
    : 'sellerVerification.validation.invalidPhone'
}

export function validateEmail(value: string): ValidationError {
  const required = validateRequired(value)
  if (required) return required
  return REGEX.EMAIL.test(value.trim()) && value.length <= EMAIL_MAX_LENGTH
    ? null
    : 'sellerVerification.validation.invalidEmail'
}

export function validatePassport(value: string): ValidationError {
  const required = validateRequired(value)
  if (required) return required
  return REGEX.PASSPORT.test(value.trim().toUpperCase())
    ? null
    : 'sellerVerification.validation.invalidPassport'
}

export function validateInn(value: string): ValidationError {
  const required = validateRequired(value)
  if (required) return required
  return REGEX.INN.test(value.trim()) ? null : 'sellerVerification.validation.invalidInn'
}

export function validateCardNumber(value: string): ValidationError {
  const required = validateRequired(value)
  if (required) return required
  return REGEX.CARD.test(value.replace(/\s/g, ''))
    ? null
    : 'sellerVerification.validation.invalidCardNumber'
}

export function validateCertificateFile(file: File): ValidationError {
  if (file.size === 0) return 'sellerVerification.validation.emptyFile'
  if (file.size > MAX_CERTIFICATE_SIZE) return 'sellerVerification.validation.fileTooLarge'
  return (ALLOWED_CERTIFICATE_MIME_TYPES as readonly string[]).includes(file.type)
    ? null
    : 'sellerVerification.validation.invalidFileType'
}
