import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ApiError } from '@/lib/apiError'
import { tError } from '@/i18n'
import { useSaveCompany } from '../../api/seller-verification.queries'
import { validateInn, validateRequired } from '../../lib/validators'
import type { BusinessType, SaveCompanyPayload } from '../../types/seller-verification.types'

const BUSINESS_TYPES: readonly BusinessType[] = ['llc', 'ie', 'jsc', 'other']

type Props = {
  defaultValues: SaveCompanyPayload
  onSaved: () => void
  onCancel?: () => void
}

export function CompanyForm({ defaultValues, onSaved, onCancel }: Props) {
  const { t } = useTranslation()
  const saveCompany = useSaveCompany()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SaveCompanyPayload>({ defaultValues })

  // Validators return i18n keys; resolve them at render time.
  const message = (key: string | undefined) => (key ? t(key) : undefined)

  const submit = handleSubmit((values) => {
    saveCompany.mutate(values, { onSuccess: onSaved })
  })

  return (
    <form onSubmit={(e) => { void submit(e) }} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t('sellerVerification.company.companyName')}
          error={message(errors.companyName?.message)}
          {...register('companyName', { validate: (v) => validateRequired(v) ?? true })}
        />
        <Input
          label={t('sellerVerification.company.directorName')}
          error={message(errors.directorName?.message)}
          {...register('directorName', { validate: (v) => validateRequired(v) ?? true })}
        />
        <Input
          label={t('sellerVerification.company.inn')}
          inputMode="numeric"
          error={message(errors.inn?.message)}
          {...register('inn', { validate: (v) => validateInn(v) ?? true })}
        />
        <Input
          label={t('sellerVerification.company.registrationNumber')}
          error={message(errors.registrationNumber?.message)}
          {...register('registrationNumber', { validate: (v) => validateRequired(v) ?? true })}
        />
      </div>
      <Input
        label={t('sellerVerification.company.legalAddress')}
        error={message(errors.legalAddress?.message)}
        {...register('legalAddress', { validate: (v) => validateRequired(v) ?? true })}
      />
      <Select label={t('sellerVerification.company.businessType')} {...register('businessType')}>
        {BUSINESS_TYPES.map((type) => (
          <option key={type} value={type}>
            {t(`sellerVerification.company.types.${type}`)}
          </option>
        ))}
      </Select>

      {saveCompany.error instanceof ApiError && (
        <p role="alert" className="text-sm text-error-text">
          {tError(saveCompany.error.code)}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={saveCompany.isPending}>
          {t(
            saveCompany.isPending
              ? 'sellerVerification.common.saving'
              : 'sellerVerification.common.save',
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={saveCompany.isPending}>
            {t('sellerVerification.common.cancel')}
          </Button>
        )}
      </div>
    </form>
  )
}
