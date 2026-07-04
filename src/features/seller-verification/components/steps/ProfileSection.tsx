import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ApiError } from '@/lib/apiError'
import { tError } from '@/i18n'
import { useSellerProfile, useUpdateSellerProfile } from '../../api/seller-verification.queries'
import {
  validateEmail,
  validateFullName,
  validatePhone,
  validateRequired,
} from '../../lib/validators'
import type { SellerProfile, UpdateProfilePayload } from '../../types/seller-verification.types'
import { StatusBadge } from '../StatusBadge'

const FIELDS = [
  { key: 'fullName', type: 'text', validate: validateFullName },
  { key: 'phone', type: 'tel', validate: validatePhone },
  { key: 'email', type: 'email', validate: validateEmail },
  { key: 'address', type: 'text', validate: validateRequired },
] as const

export function ProfileSection() {
  const { t } = useTranslation()
  const { data: profile, isLoading, isError, refetch } = useSellerProfile()
  const [editing, setEditing] = useState(false)
  const saved = Boolean(profile?.fullName)

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-text">{t('sellerVerification.profile.heading')}</h2>
          <p className="mt-1 text-sm text-muted">{t('sellerVerification.profile.description')}</p>
        </div>
        <StatusBadge status={saved ? 'verified' : 'unverified'} />
      </div>

      {isLoading ? (
        <CardSkeleton lines={4} />
      ) : isError || !profile ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-error-text">{t('sellerVerification.loadFailed')}</span>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            {t('sellerVerification.retry')}
          </Button>
        </div>
      ) : saved && !editing ? (
        <ProfileSummary profile={profile} onEdit={() => setEditing(true)} />
      ) : (
        <ProfileForm profile={profile} canCancel={saved} onDone={() => setEditing(false)} />
      )}
    </section>
  )
}

function ProfileSummary({ profile, onEdit }: { profile: SellerProfile; onEdit: () => void }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-5">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map(({ key }) => (
          <div key={key}>
            <dt className="text-xs text-muted">{t(`sellerVerification.profile.${key}`)}</dt>
            <dd className="mt-0.5 text-sm font-medium text-text">
              {profile[key] || t('sellerVerification.common.noData')}
            </dd>
          </div>
        ))}
      </dl>
      <Button variant="outline" size="sm" onClick={onEdit}>
        {t('sellerVerification.common.edit')}
      </Button>
    </div>
  )
}

function ProfileForm({
  profile,
  canCancel,
  onDone,
}: {
  profile: SellerProfile
  canCancel: boolean
  onDone: () => void
}) {
  const { t } = useTranslation()
  const update = useUpdateSellerProfile()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfilePayload>({
    defaultValues: {
      fullName: profile.fullName,
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
    },
  })

  const fieldError = (key: keyof UpdateProfilePayload): string | undefined => {
    const message = errors[key]?.message
    return message ? t(message) : undefined
  }

  return (
    <form
      onSubmit={handleSubmit((values) => update.mutate(values, { onSuccess: onDone }))}
      className="space-y-4"
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map(({ key, type, validate }) => (
          <Input
            key={key}
            label={t(`sellerVerification.profile.${key}`)}
            type={type}
            error={fieldError(key)}
            {...register(key, { validate: (v) => validate(v) ?? true })}
          />
        ))}
      </div>
      {update.error && (
        <p className="text-sm text-error-text">
          {update.error instanceof ApiError
            ? tError(update.error.code)
            : t('sellerVerification.common.error')}
        </p>
      )}
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={update.isPending}>
          {t(update.isPending ? 'sellerVerification.common.saving' : 'sellerVerification.common.save')}
        </Button>
        {canCancel && (
          <Button type="button" variant="ghost" onClick={onDone}>
            {t('sellerVerification.common.cancel')}
          </Button>
        )}
      </div>
    </form>
  )
}
