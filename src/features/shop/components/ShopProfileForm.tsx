import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Field, TextAreaField } from './Field'
import { ShopBrandingCard } from './ShopBrandingCard'
import { useUpdateProfile } from '../api/shop.queries'
import type { ShopProfile, ShopProfileUpdate } from '../types/shop.types'

type Props = { profile: ShopProfile }

export function ShopProfileForm({ profile }: Props) {
  const { t } = useTranslation()
  const update = useUpdateProfile()
  const [form, setForm] = useState<ShopProfileUpdate>({
    name: profile.name,
    bio: profile.bio,
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
    telegram: profile.telegram,
  })

  const set = (key: keyof ShopProfileUpdate) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    update.mutate(form)
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <PageHeader
        title={t('shop.info.title')}
        subtitle={t('shop.info.subtitle')}
        actions={
          <Button type="submit" disabled={update.isPending}>
            {update.isPending ? t('shop.info.saving') : t('shop.info.save')}
          </Button>
        }
      />

      {update.isSuccess && (
        <div className="rounded-lg border border-success/30 bg-success-bg px-4 py-2 text-sm font-medium text-success">
          {t('shop.info.saved')}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ShopBrandingCard profile={{ ...profile, name: form.name }} />
        </div>

        <Card className="space-y-5 p-6 lg:col-span-2">
          <h3 className="border-b border-border pb-3 text-sm font-semibold text-text">
            {t('shop.info.details')}
          </h3>
          <Field
            label={t('shop.info.name')}
            value={form.name}
            onChange={set('name')}
            placeholder={t('shop.info.namePlaceholder')}
            required
          />
          <TextAreaField
            label={t('shop.info.bio')}
            value={form.bio}
            onChange={set('bio')}
            placeholder={t('shop.info.bioPlaceholder')}
          />
          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
            <Field label={t('shop.info.phone')} value={form.phone} onChange={set('phone')} />
            <Field
              label={t('shop.info.email')}
              type="email"
              value={form.email}
              onChange={set('email')}
            />
            <Field
              label={t('shop.info.address')}
              value={form.address}
              onChange={set('address')}
              className="md:col-span-2"
            />
            <Field
              label={t('shop.info.telegram')}
              value={form.telegram}
              onChange={set('telegram')}
              className="md:col-span-2"
            />
          </div>
        </Card>
      </div>
    </form>
  )
}
