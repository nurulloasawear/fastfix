import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Td, Th, Tr } from '@/components/ui/Table'
import { useAccountProtection, useUpdateAccountProtection } from '../api/setting.queries'
import { Toggle } from './Toggle'

// Account Protection card — SMS 2FA toggle + High-risk action table + ticket log.
// Matches Account & Security screenshot section 2.

export function AccountProtectionCard() {
  const { t } = useTranslation()
  const { data, isLoading } = useAccountProtection()
  const update = useUpdateAccountProtection()

  if (isLoading || !data) {
    return (
      <Card className="flex items-center justify-center p-10">
        <Spinner />
      </Card>
    )
  }

  const patch = (next: {
    smsVerificationEnabled?: boolean
    highRiskApprovalEnabled?: boolean
    noticeAllCheckers?: boolean
  }) =>
    update.mutate({
      smsVerificationEnabled: next.smsVerificationEnabled ?? data.smsVerificationEnabled,
      highRiskApprovalEnabled: next.highRiskApprovalEnabled ?? data.highRiskApprovalEnabled,
      noticeAllCheckers: next.noticeAllCheckers ?? data.noticeAllCheckers,
    })

  return (
    <Card className="flex flex-col">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-base font-semibold text-text">{t('setting.protection.title')}</h2>
      </div>

      {/* Account Verification sub-section */}
      <div className="border-b border-border px-6 py-5">
        <h3 className="mb-3 text-sm font-semibold text-text">
          {t('setting.protection.accountVerification')}
        </h3>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-text">
              {t('setting.protection.smsToggleLabel')}
            </span>
            <span className="text-xs text-muted">{t('setting.protection.smsToggleDesc')}</span>
          </div>
          <Toggle
            checked={data.smsVerificationEnabled}
            disabled={update.isPending}
            onChange={() =>
              patch({ smsVerificationEnabled: !data.smsVerificationEnabled })
            }
            label={t('setting.protection.smsToggleLabel')}
          />
        </div>
      </div>

      {/* High-risk Action Protection sub-section */}
      <div className="px-6 py-5">
        <h3 className="mb-2 text-sm font-semibold text-text">
          {t('setting.protection.highRisk')}
        </h3>

        {/* Warning banner: no main account linked */}
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-warning bg-warning-bg px-4 py-3 text-sm text-text">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-warning">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <span>
            {t('setting.protection.noMainAccountWarning')}{' '}
            <Button variant="ghost" size="sm" className="inline px-0 text-brand hover:text-brand">
              {t('setting.protection.bindMainAccount')}
            </Button>{' '}
            {t('setting.protection.noMainAccountWarningEnd')}
          </span>
        </div>

        <p className="mb-1 text-sm font-semibold text-text">{t('setting.protection.protectFromHighRisk')}</p>
        <p className="mb-4 text-xs text-muted">{t('setting.protection.protectSubtitle')}</p>

        {/* High-risk table */}
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <thead>
              <Tr>
                <Th>{t('setting.protection.colRiskType')}</Th>
                <Th className="text-center">{t('setting.protection.colNeedApproval')}</Th>
                <Th className="text-center">{t('setting.protection.colNoticeCheckers')}</Th>
              </Tr>
            </thead>
            <tbody>
              <Tr>
                <Td>{t('setting.protection.riskAddBank')}</Td>
                <Td className="text-center">
                  <Toggle
                    checked={data.highRiskApprovalEnabled}
                    disabled={update.isPending}
                    onChange={() =>
                      patch({ highRiskApprovalEnabled: !data.highRiskApprovalEnabled })
                    }
                    label={t('setting.protection.colNeedApproval')}
                  />
                </Td>
                <Td className="text-center">
                  <Toggle
                    checked={data.noticeAllCheckers}
                    disabled={update.isPending}
                    onChange={() => patch({ noticeAllCheckers: !data.noticeAllCheckers })}
                    label={t('setting.protection.colNoticeCheckers')}
                  />
                </Td>
              </Tr>
            </tbody>
          </Table>
        </div>

        {/* Approval ticket log */}
        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          <Table>
            <thead>
              <Tr>
                <Th>{t('setting.protection.ticketId')}</Th>
                <Th>{t('setting.protection.colRiskType')}</Th>
                <Th>{t('setting.protection.requestTime')}</Th>
                <Th>{t('setting.protection.operator')}</Th>
                <Th>{t('setting.protection.status')}</Th>
                <Th>{t('setting.protection.action')}</Th>
              </Tr>
            </thead>
            <tbody>
              {data.approvalTickets.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={
                        <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      }
                      title={t('setting.protection.noTickets')}
                    />
                  </td>
                </tr>
              ) : (
                data.approvalTickets.map((ticket) => (
                  <Tr key={ticket.id}>
                    <Td className="font-mono text-xs text-text-secondary">{ticket.id.slice(0, 8)}</Td>
                    <Td>{ticket.riskType}</Td>
                    <Td className="text-text-secondary">{ticket.requestedAt}</Td>
                    <Td className="text-text-secondary">{ticket.operator}</Td>
                    <Td className="text-text-secondary">{ticket.status}</Td>
                    <Td />
                  </Tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </Card>
  )
}
