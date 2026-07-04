import { describe, it, expect } from 'vitest'
import { formatSold } from '@/utils/formatSold'

describe('formatSold', () => {
  it('is empty when nothing sold', () => {
    expect(formatSold(0, 'uz')).toBe('')
    expect(formatSold(null, 'en')).toBe('')
    expect(formatSold(undefined, 'ru')).toBe('')
  })

  it('localizes the word', () => {
    expect(formatSold(294, 'uz')).toBe('294 sotildi')
    expect(formatSold(294, 'ru')).toBe('294 продано')
    expect(formatSold(294, 'en')).toBe('294 sold')
  })

  it('compacts large numbers with floor', () => {
    expect(formatSold(1000, 'en')).toBe('1k sold')
    expect(formatSold(1100, 'en')).toBe('1.1k sold')
    expect(formatSold(1990, 'en')).toBe('1.9k sold')
    expect(formatSold(10000, 'en')).toBe('10k sold')
    expect(formatSold(100000, 'en')).toBe('100k sold')
    expect(formatSold(1_000_000, 'en')).toBe('1m sold')
    expect(formatSold(1_100_000, 'en')).toBe('1.1m sold')
  })
})
