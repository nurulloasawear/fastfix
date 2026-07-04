import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ApiError } from '@/lib/apiError'
import { tError } from '@/i18n'
import {
  usePassportVerification,
  useStartPassportVerification,
} from '../../api/seller-verification.queries'
import { PASSPORT_LENGTH } from '../../lib/constants'
import { validatePassport } from '../../lib/validators'
import { StatusBadge } from '../StatusBadge'

interface PassportFormValues {
  passportNumber: string
}

export function PassportSection() {
  const { t } = useTranslation()
  const { data, isLoading, isError, refetch } = usePassportVerification()
  const start = useStartPassportVerification()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PassportFormValues>()

  if (isLoading) return <CardSkeleton lines={4} />

  if (isError || !data) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-error-text">{t('sellerVerification.loadFailed')}</p>
        <Button variant="outline" size="sm" onClick={() => { void refetch() }}>
          {t('sellerVerification.retry')}
        </Button>
      </div>
    )
  }

  const onSubmit = handleSubmit(({ passportNumber }) => {
    start.mutate(passportNumber.trim().toUpperCase(), {
      onSuccess: (session) => {
        // Real MyID hand-off; the dev mock verifies instantly and returns null.
        if (session.redirectUrl !== null) window.location.assign(session.redirectUrl)
      },
    })
  })

  const numberField = register('passportNumber', {
    validate: (value) => validatePassport(value) ?? true,
  })
  const isReviewing = data.status === 'pending' || data.status === 'processing'
  const showForm = data.status === 'idle' || data.status === 'rejected'
  const noData = t('sellerVerification.common.noData')

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-text">{t('sellerVerification.passport.heading')}</h3>
          <p className="mt-1 text-sm text-text-secondary">
            {t('sellerVerification.passport.description')}
          </p>
        </div>
        <StatusBadge status={data.status} />
      </div>

      {data.status === 'verified' && (
        <div className="rounded-lg bg-success-bg p-4">
          <p className="text-sm font-semibold text-success">
            {t('sellerVerification.passport.verified')}
          </p>
          <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-muted">{t('sellerVerification.passport.fullName')}</dt>
              <dd className="text-sm font-medium text-text">{data.fullName ?? noData}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">{t('sellerVerification.passport.numberLabel')}</dt>
              <dd className="text-sm font-medium text-text">{data.passportNumber ?? noData}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">{t('sellerVerification.passport.verifiedAt')}</dt>
              <dd className="text-sm font-medium text-text">
                {data.verifiedAt ? new Date(data.verifiedAt).toLocaleDateString() : noData}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {isReviewing && (
        <div className="flex items-center gap-3 rounded-lg bg-warning-bg p-4">
          <Spinner />
          <p className="text-sm text-warning">{t('sellerVerification.passport.pendingNotice')}</p>
        </div>
      )}

      {data.status === 'rejected' && (
        <div className="rounded-lg bg-error-bg p-4 text-error-text">
          <p className="text-sm font-semibold">{t('sellerVerification.passport.rejected')}</p>
          {data.rejectReason && (
            <p className="mt-1 text-sm">
              {t('sellerVerification.passport.reason')}: {data.rejectReason}
            </p>
          )}
        </div>
      )}

      {showForm && (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Input
            label={t('sellerVerification.passport.numberLabel')}
            placeholder="AA1234567"
            maxLength={PASSPORT_LENGTH}
            autoComplete="off"
            error={errors.passportNumber?.message ? t(errors.passportNumber.message) : undefined}
            {...numberField}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase()
              void numberField.onChange(e)
            }}
          />
          {start.isError && (
            <p className="text-sm text-error-text">
              {tError(start.error instanceof ApiError ? start.error.code : 'internal_error')}
            </p>
          )}
          <Button type="submit" disabled={start.isPending}>
            {start.isPending
              ? t('sellerVerification.passport.redirecting')
              : t('sellerVerification.passport.verify')}
          </Button>
        </form>
      )}
    </section>
  )
}
