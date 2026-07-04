import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { DiscountForm, useCreateDiscount } from '@/features/discounts'
import type { DiscountInput } from '@/features/discounts'

// THIN standalone create page (route /discounts/create). The list page also
// offers an inline modal; this is the full-page entry point. All logic is in
// the feature — the page just wires the mutation + a success banner.
export function CreateDiscountPage() {
  const { t } = useTranslation()
  const create = useCreateDiscount()
  // `formKey` only remounts the form to clear it after a successful create.
  const [formKey, setFormKey] = useState(0)

  function submit(input: DiscountInput) {
    create.mutate(input, { onSuccess: () => setFormKey((k) => k + 1) })
  }

  return (
    <Page>
      <PageHeader
        title={t('discounts.form.createTitle')}
        breadcrumb={`${t('discounts.home')} › ${t('discounts.title')} › ${t('discounts.form.createTitle')}`}
      />

      <Card className="flex max-w-lg flex-col gap-4 p-6">
        <div>
          <h2 className="text-base font-semibold text-text">{t('discounts.form.createTitle')}</h2>
          <p className="text-sm text-muted">{t('discounts.form.createSubtitle')}</p>
        </div>

        {create.isSuccess && (
          <div className="rounded-md bg-success-bg px-4 py-3 text-sm font-medium text-success">
            {t('discounts.form.successCreate')}
          </div>
        )}

        <DiscountForm
          key={formKey}
          todayStr={today()}
          isPending={create.isPending}
          submitLabel={t('discounts.form.submitCreate')}
          onSubmit={submit}
        />
      </Card>
    </Page>
  )
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}
