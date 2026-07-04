import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Company } from '../../types/seller-verification.types'

export function CompanySummary({ company, onEdit }: { company: Company; onEdit: () => void }) {
  const { t } = useTranslation()

  const rows = [
    { label: t('sellerVerification.company.companyName'), value: company.companyName },
    { label: t('sellerVerification.company.directorName'), value: company.directorName },
    { label: t('sellerVerification.company.inn'), value: company.inn },
    { label: t('sellerVerification.company.registrationNumber'), value: company.registrationNumber },
    { label: t('sellerVerification.company.legalAddress'), value: company.legalAddress },
    {
      label: t('sellerVerification.company.businessType'),
      value: t(`sellerVerification.company.types.${company.businessType}`),
    },
  ]

  return (
    <div className="space-y-5">
      <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {rows.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-xs font-semibold text-muted">{label}</dt>
            <dd className="mt-0.5 text-sm text-text">
              {value || t('sellerVerification.common.noData')}
            </dd>
          </div>
        ))}
      </dl>

      {company.verified && (
        <p className="flex items-center gap-2 rounded-lg bg-success-bg px-3 py-2 text-sm font-medium text-success">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {t('sellerVerification.company.verified')}
        </p>
      )}

      <Button variant="outline" size="sm" onClick={onEdit}>
        {t('sellerVerification.common.edit')}
      </Button>
    </div>
  )
}
