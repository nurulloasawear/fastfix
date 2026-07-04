import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { tError } from '@/i18n'
import { ApiError } from '@/lib/apiError'
import { useToast } from '@/components/ui/Toast'
import { useCreateAddress, useUpdateAddress } from '../api/setting.queries'
import type { Address, AddressInput } from '../types/setting.types'

const COUNTRIES = ['Uzbekistan', 'Kazakhstan', 'Kyrgyzstan']
const STATES = ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Fargʻona']

const EMPTY: AddressInput = {
  fullName: '',
  phone: '',
  countryRegion: 'Uzbekistan',
  state: '',
  townCity: '',
  pincode: '',
  companyAddress: '',
  isDefault: false,
  isPickup: false,
  isReturn: false,
}

const FLAGS = [
  { key: 'isDefault' as const, label: 'setAsMain' },
  { key: 'isPickup' as const, label: 'setAsPickup' },
  { key: 'isReturn' as const, label: 'setAsReturn' },
]

interface AddressModalProps {
  onClose: () => void
  address?: Address | null
}

function toInput(a: Address): AddressInput {
  return {
    fullName: a.fullName, phone: a.phone, countryRegion: a.countryRegion,
    state: a.state, townCity: a.townCity, pincode: a.pincode,
    companyAddress: a.companyAddress, isDefault: a.isDefault,
    isPickup: a.isPickup, isReturn: a.isReturn,
  }
}

export function AddressModal({ onClose, address }: AddressModalProps) {
  const { t } = useTranslation()
  const toast = useToast()
  const isEdit = Boolean(address)
  const create = useCreateAddress()
  const update = useUpdateAddress(address?.id ?? '')
  const mutation = isEdit ? update : create
  const [form, setForm] = useState<AddressInput>(address ? toInput(address) : EMPTY)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof AddressInput>(key: K, value: AddressInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const onSave = () => {
    setError(null)
    mutation.mutate(form, {
      onSuccess: () => {
        toast.success(t('setting.addresses.saved', { defaultValue: 'Manzil saqlandi' }))
        onClose()
      },
      onError: (err) => setError(tError(err instanceof ApiError ? err.code : 'internal_error')),
    })
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={isEdit ? t('setting.addresses.editTitle', { defaultValue: 'Manzilni tahrirlash' }) : t('setting.addresses.addNew')}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>{t('setting.common.cancel')}</Button>
          <Button disabled={mutation.isPending} onClick={onSave}>
            {mutation.isPending ? t('setting.common.loading') : t('setting.common.save')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label={t('setting.addresses.fullName')}
          value={form.fullName}
          onChange={(e) => set('fullName', e.target.value)}
        />
        <Input
          label={t('setting.addresses.phoneNumber')}
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
          placeholder="+998 ..."
        />

        <Select
          label={t('setting.addresses.countryRegion')}
          value={form.countryRegion}
          onChange={(e) => set('countryRegion', e.target.value)}
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>

        <Select
          label={t('setting.addresses.state')}
          value={form.state}
          onChange={(e) => set('state', e.target.value)}
        >
          <option value="">{t('setting.addresses.stateSelectPlaceholder')}</option>
          {STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t('setting.addresses.townCity')}
            value={form.townCity}
            onChange={(e) => set('townCity', e.target.value)}
          />
          <Input
            label={t('setting.addresses.pincode')}
            value={form.pincode}
            onChange={(e) => set('pincode', e.target.value)}
          />
        </div>

        <Input
          label={t('setting.addresses.companyAddress')}
          value={form.companyAddress}
          onChange={(e) => set('companyAddress', e.target.value)}
          placeholder={t('setting.addresses.enterCompanyAddress')}
        />

        <div className="flex flex-wrap gap-4 pt-1">
          {FLAGS.map((f) => (
            <label key={f.key} className="flex cursor-pointer items-center gap-2 text-xs text-text">
              <input type="checkbox" checked={form[f.key]} onChange={(e) => set(f.key, e.target.checked)} className="h-4 w-4 accent-brand" />
              {t(`setting.addresses.${f.label}`)}
            </label>
          ))}
        </div>

        {error && <p className="text-xs text-error-text">{error}</p>}
      </div>
    </Modal>
  )
}
