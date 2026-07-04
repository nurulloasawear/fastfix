import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth, useRegisterSeller } from '@/features/auth'
import { tError } from '@/i18n'
import { ApiError } from '@/lib/apiError'

export function OnboardingPage() {
  const { t } = useTranslation()
  const { token, loading, isAuthed, seller, logout } = useAuth()
  const [shopName, setShopName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const register = useRegisterSeller()

  if (!token) return <Navigate to="/login" replace />
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-bg"><Spinner /></div>
  }
  if (!isAuthed) return <Navigate to="/login" replace />
  if (seller?.status === 'approved') return <Navigate to="/seller/verification" replace />

  const pending = seller?.status === 'pending' || seller?.status === 'suspended'

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    register.mutate(shopName.trim(), {
      onError: (err) => setError(tError(err instanceof ApiError ? err.code : 'internal_error')),
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-7 shadow-sm">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">OZB</span>
          <span className="text-lg font-semibold text-text">{t('auth.brand')}</span>
        </div>

        {pending ? (
          <div className="flex flex-col gap-4 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning-bg text-xl">⏳</span>
            <div>
              <h1 className="text-xl font-semibold text-text">{t('auth.pendingTitle')}</h1>
              <p className="mt-1 text-sm text-muted">{t('auth.pendingSubtitle')}</p>
            </div>
            <Button onClick={() => window.location.reload()}>{t('auth.refresh')}</Button>
            <Button variant="ghost" onClick={logout}>{t('auth.logout')}</Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <h1 className="text-xl font-semibold text-text">{t('auth.onboardingTitle')}</h1>
              <p className="mt-1 text-sm text-muted">{t('auth.onboardingSubtitle')}</p>
            </div>
            <Input
              label={t('auth.shopName')}
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              autoFocus
            />
            {error && <p className="text-xs text-error-text">{error}</p>}
            <Button type="submit" disabled={!shopName.trim() || register.isPending}>
              {register.isPending ? t('auth.registering') : t('auth.register')}
            </Button>
            <Button type="button" variant="ghost" onClick={logout}>{t('auth.logout')}</Button>
          </form>
        )}
      </div>
    </div>
  )
}
