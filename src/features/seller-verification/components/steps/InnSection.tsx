import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ApiError } from '@/lib/apiError'
import { tError } from '@/i18n'
import { useInnVerification, useVerifyInn } from '../../api/seller-verification.queries'
import { INN_LENGTH } from '../../lib/constants'
import { validateInn } from '../../lib/validators'
import { StatusBadge } from '../StatusBadge'

interface InnFormValues {
  inn: string
}

export function InnSection() {
  const { t } = useTranslation()
  const { data, isLoading, isError, refetch } = useInnVerification()
  const verify = useVerifyInn()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InnFormValues>()

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

  const onSubmit = handleSubmit(({ inn }) => {
    verify.mutate(inn.trim())
  })

  const noData = t('sellerVerification.common.noData')

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-text">{t('sellerVerification.inn.heading')}</h3>
          <p className="mt-1 text-sm text-text-secondary">
            {t('sellerVerification.inn.description')}
          </p>
        </div>
        <StatusBadge status={data.status} />
      </div>

      {data.status === 'verified' ? (
        <div className="rounded-lg bg-success-bg p-4">
          <p className="text-sm font-semibold text-success">{t('sellerVerification.inn.verified')}</p>
          <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted">{t('sellerVerification.inn.innLabel')}</dt>
              <dd className="text-sm font-medium text-text">{data.inn}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">{t('sellerVerification.inn.companyName')}</dt>
              <dd className="text-sm font-medium text-text">{data.companyName}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">{t('sellerVerification.inn.ownerName')}</dt>
              <dd className="text-sm font-medium text-text">{data.ownerName}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">{t('sellerVerification.inn.checkedAt')}</dt>
              <dd className="text-sm font-medium text-text">
                {data.checkedAt ? new Date(data.checkedAt).toLocaleDateString() : noData}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {data.status === 'rejected' && (
            <p className="text-sm text-error-text">{t('sellerVerification.status.rejected')}</p>
          )}
          <Input
            label={t('sellerVerification.inn.innLabel')}
            inputMode="numeric"
            maxLength={INN_LENGTH}
            autoComplete="off"
            error={errors.inn?.message ? t(errors.inn.message) : undefined}
            {...register('inn', { validate: (value) => validateInn(value) ?? true })}
          />
          {verify.isError && (
            <p className="text-sm text-error-text">
              {tError(verify.error instanceof ApiError ? verify.error.code : 'internal_error')}
            </p>
          )}
          <Button type="submit" disabled={verify.isPending}>
            {verify.isPending
              ? t('sellerVerification.inn.verifying')
              : t('sellerVerification.inn.verify')}
          </Button>
        </form>
      )}
    </section>
  )
}
