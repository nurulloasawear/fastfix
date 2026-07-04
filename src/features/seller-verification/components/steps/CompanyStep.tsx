import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { useCompany, useInnVerification } from '../../api/seller-verification.queries'
import type {
  Company,
  InnVerification,
  SaveCompanyPayload,
} from '../../types/seller-verification.types'
import { StatusBadge } from '../StatusBadge'
import { CompanyForm } from './CompanyForm'
import { CompanySummary } from './CompanySummary'

/** Editing → the saved company; first fill → merge in the verified INN lookup
 *  from the identity step so the user does not retype known values. */
function buildDefaults(
  company: Company | null,
  inn: InnVerification | undefined,
): SaveCompanyPayload {
  if (company) {
    return {
      companyName: company.companyName,
      directorName: company.directorName,
      inn: company.inn,
      registrationNumber: company.registrationNumber,
      legalAddress: company.legalAddress,
      businessType: company.businessType,
    }
  }
  const verifiedInn = inn?.status === 'verified' ? inn : null
  return {
    companyName: verifiedInn?.companyName ?? '',
    directorName: verifiedInn?.ownerName ?? '',
    inn: verifiedInn?.inn ?? '',
    registrationNumber: '',
    legalAddress: '',
    businessType: 'llc',
  }
}

export function CompanyStep() {
  const { t } = useTranslation()
  const companyQuery = useCompany()
  const innQuery = useInnVerification()
  const [editing, setEditing] = useState(false)

  if (companyQuery.isLoading || innQuery.isLoading) {
    return <CardSkeleton lines={6} />
  }

  if (companyQuery.isError) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-error-text">{t('sellerVerification.loadFailed')}</p>
        <Button variant="outline" size="sm" onClick={() => { void companyQuery.refetch() }}>
          {t('sellerVerification.retry')}
        </Button>
      </div>
    )
  }

  const company = companyQuery.data ?? null
  const showForm = company === null || editing

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-text">
            {t('sellerVerification.company.heading')}
          </h2>
          {showForm && (
            <p className="mt-1 text-sm text-muted">
              {t('sellerVerification.company.description')}
            </p>
          )}
        </div>
        {company && !editing && (
          <StatusBadge status={company.verified ? 'verified' : 'pending'} />
        )}
      </div>

      {company && !editing ? (
        <CompanySummary company={company} onEdit={() => setEditing(true)} />
      ) : (
        <CompanyForm
          defaultValues={buildDefaults(company, innQuery.data)}
          onSaved={() => setEditing(false)}
          onCancel={company ? () => setEditing(false) : undefined}
        />
      )}
    </div>
  )
}
