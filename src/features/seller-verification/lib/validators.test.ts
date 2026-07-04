import { describe, it, expect } from 'vitest'
import {
  validateCardNumber,
  validateCertificateFile,
  validateEmail,
  validateFullName,
  validateInn,
  validatePassport,
  validatePhone,
  validateRequired,
} from './validators'

describe('field validators', () => {
  it('requires non-blank values', () => {
    expect(validateRequired('  ')).toBe('sellerVerification.validation.required')
    expect(validateRequired('ok')).toBeNull()
  })

  it('validates full name length', () => {
    expect(validateFullName('John Doe')).toBeNull()
    expect(validateFullName('x'.repeat(151))).toBe('sellerVerification.validation.fullNameTooLong')
  })

  it('validates phone format', () => {
    expect(validatePhone('+998901234567')).toBeNull()
    expect(validatePhone('12')).toBe('sellerVerification.validation.invalidPhone')
  })

  it('validates email format', () => {
    expect(validateEmail('a@b.co')).toBeNull()
    expect(validateEmail('nope')).toBe('sellerVerification.validation.invalidEmail')
  })

  it('validates Uzbek passport format, case-insensitively', () => {
    expect(validatePassport('AA1234567')).toBeNull()
    expect(validatePassport('aa1234567')).toBeNull()
    expect(validatePassport('A1234567')).toBe('sellerVerification.validation.invalidPassport')
  })

  it('validates 9-digit INN', () => {
    expect(validateInn('123456789')).toBeNull()
    expect(validateInn('12345678')).toBe('sellerVerification.validation.invalidInn')
  })

  it('validates 16-digit card numbers ignoring spaces', () => {
    expect(validateCardNumber('8600 1234 5678 9012')).toBeNull()
    expect(validateCardNumber('8600')).toBe('sellerVerification.validation.invalidCardNumber')
  })

  it('validates certificate files by size and mime type', () => {
    const pdf = new File(['x'], 'doc.pdf', { type: 'application/pdf' })
    expect(validateCertificateFile(pdf)).toBeNull()

    const exe = new File(['x'], 'doc.exe', { type: 'application/octet-stream' })
    expect(validateCertificateFile(exe)).toBe('sellerVerification.validation.invalidFileType')

    const empty = new File([], 'empty.pdf', { type: 'application/pdf' })
    expect(validateCertificateFile(empty)).toBe('sellerVerification.validation.emptyFile')
  })
})
