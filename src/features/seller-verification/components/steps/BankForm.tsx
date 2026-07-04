import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ApiError } from '@/lib/apiError'
import { tError } from '@/i18n'
import { useSaveBankAccount } from '../../api/seller-verification.queries'
import { validateCardNumber, validateRequired } from '../../lib/validators'
import type { BankAccount, SaveBankAccountPayload } from '../../types/seller-verification.types'

/** Digits only, max 16, spaced in groups of 4 (e.g. "8600 1234 5678 9012"). */
function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}

interface BankFormProps {
  account: BankAccount | null
  onDone: () => void
}

export function BankForm({ account, onDone }: BankFormProps) {
  const { t } = useTranslation()
  const save = useSaveBankAccount()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SaveBankAccountPayload>({
    defaultValues: {
      cardHolder: account?.cardHolder ?? '',
      cardNumber: account ? formatCardNumber(account.cardNumber) : '',
      accountNumber: account?.accountNumber ?? '',
      bankName: account?.bankName ?? '',
      bankCode: account?.bankCode ?? '',
    },
  })

  const fieldError = (field: keyof SaveBankAccountPayload): string | undefined => {
    const message = errors[field]?.message
    return message ? t(message) : undefined
  }

  const cardNumberField = register('cardNumber', {
    validate: (value) => validateCardNumber(value) ?? true,
  })

  const onSubmit = handleSubmit((values) => {
    save.mutate(
      { ...values, cardNumber: values.cardNumber.replace(/\s/g, '') },
      { onSuccess: onDone },
    )
  })

  return (
    <form
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
      noValidate
      onSubmit={(event) => { void onSubmit(event) }}
    >
      <div className="md:col-span-2">
        <Input
          label={t('sellerVerification.bank.cardHolder')}
          autoComplete="cc-name"
          error={fieldError('cardHolder')}
          {...register('cardHolder', { validate: (value) => validateRequired(value) ?? true })}
        />
      </div>
      <Input
        label={t('sellerVerification.bank.cardNumber')}
        inputMode="numeric"
        autoComplete="cc-number"
        error={fieldError('cardNumber')}
        {...cardNumberField}
        onChange={(event) => {
          event.target.value = formatCardNumber(event.target.value)
          void cardNumberField.onChange(event)
        }}
      />
      <Input
        label={t('sellerVerification.bank.accountNumber')}
        inputMode="numeric"
        error={fieldError('accountNumber')}
        {...register('accountNumber', { validate: (value) => validateRequired(value) ?? true })}
      />
      <Input
        label={t('sellerVerification.bank.bankName')}
        error={fieldError('bankName')}
        {...register('bankName', { validate: (value) => validateRequired(value) ?? true })}
      />
      <Input
        label={t('sellerVerification.bank.bankCode')}
        inputMode="numeric"
        error={fieldError('bankCode')}
        {...register('bankCode', { validate: (value) => validateRequired(value) ?? true })}
      />

      {save.isError && (
        <p className="text-sm text-error-text md:col-span-2" role="alert">
          {tError(save.error instanceof ApiError ? save.error.code : 'internal_error')}
        </p>
      )}

      <div className="flex items-center gap-3 md:col-span-2">
        <Button type="submit" disabled={save.isPending}>
          {t(save.isPending ? 'sellerVerification.common.saving' : 'sellerVerification.common.save')}
        </Button>
        {account && (
          <Button type="button" variant="ghost" onClick={onDone} disabled={save.isPending}>
            {t('sellerVerification.common.cancel')}
          </Button>
        )}
      </div>
    </form>
  )
}
