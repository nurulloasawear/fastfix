import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Table, Td, Th, Tr } from '@/components/ui/Table'
import type { TabItem } from '@/components/ui/Tabs'
import { Tabs } from '@/components/ui/Tabs'
import {
  usePartners,
  useUnlinkPartner,
  useRemovePartner,
  useRenewPartner,
} from '../api/setting.queries'
import type { PartnerStatus } from '../types/setting.types'

// Partner Management — sub-tabs (Using/Frozen/Expired/Unlink) + table.
// Matches screenshot: 09 Partner Management.png

export function PartnerManagementCard() {
  const { t } = useTranslation()
  const { data, isLoading } = usePartners()
  const unlinkPartner = useUnlinkPartner()
  const removePartner = useRemovePartner()
  const renewPartner = useRenewPartner()
  const [activeTab, setActiveTab] = useState<PartnerStatus>('active')

  if (isLoading || !data) {
    return <Card className="flex items-center justify-center p-10"><Spinner /></Card>
  }

  const counts: Record<PartnerStatus, number> = {
    active: data.counts.active,
    frozen: data.counts.frozen,
    expired: data.counts.expired,
    unlinked: data.counts.unlinked,
  }

  const tabItems: TabItem[] = [
    { key: 'active', label: t('setting.partners.tabUsing'), count: counts.active },
    { key: 'frozen', label: t('setting.partners.tabFrozen'), count: counts.frozen },
    { key: 'expired', label: t('setting.partners.tabExpired'), count: counts.expired },
    { key: 'unlinked', label: t('setting.partners.tabUnlink'), count: counts.unlinked },
  ]

  const filtered = data.integrations.filter((p) => p.status === activeTab)

  return (
    <Card className="flex flex-col gap-0">
      {/* Sub-tab bar */}
      <div className="border-b border-border px-6 py-4">
        <Tabs
          items={tabItems}
          value={activeTab}
          onChange={(key) => setActiveTab(key as PartnerStatus)}
        />
      </div>

      {/* Description */}
      <div className="px-6 py-3 text-sm text-muted">{t('setting.partners.description')}</div>

      {/* Table */}
      <Table>
        <thead>
          <Tr>
            <Th>{t('setting.partners.colApp')}</Th>
            <Th>{t('setting.partners.colDeveloper')}</Th>
            <Th>{t('setting.partners.colExpiry')}</Th>
            <Th>{t('setting.partners.colAction')}</Th>
          </Tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={4}>
                <EmptyState
                  icon={
                    <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  }
                  title={t('setting.partners.noData')}
                />
              </td>
            </tr>
          ) : (
            filtered.map((partner) => (
              <Tr key={partner.id}>
                <Td className="font-semibold">{partner.appName}</Td>
                <Td className="text-text-secondary">{partner.developerName}</Td>
                <Td className="text-text-secondary">{partner.expiresAt}</Td>
                <Td>
                  <div className="flex gap-2">
                    {partner.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={unlinkPartner.isPending}
                        onClick={() => unlinkPartner.mutate(partner.id)}
                      >
                        {t('setting.partners.unlink')}
                      </Button>
                    )}
                    {partner.status === 'expired' && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={renewPartner.isPending}
                        onClick={() => renewPartner.mutate(partner.id)}
                      >
                        {t('setting.partners.renew')}
                      </Button>
                    )}
                    {(partner.status === 'frozen' ||
                      partner.status === 'expired' ||
                      partner.status === 'unlinked') && (
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={removePartner.isPending}
                        onClick={() => removePartner.mutate(partner.id)}
                      >
                        {t('setting.partners.remove')}
                      </Button>
                    )}
                  </div>
                </Td>
              </Tr>
            ))
          )}
        </tbody>
      </Table>
    </Card>
  )
}
