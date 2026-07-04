import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  AddressList,
  AddressModal,
  PlusIcon,
  SettingsTabBar,
  useAddresses,
  useSettingUi,
} from '@/features/setting'
import type { Address } from '@/features/setting'

// THIN page: composes the feature. All data/logic lives in @/features/setting.
export function MyAddressesPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useAddresses()
  const open = useSettingUi((s) => s.addressModalOpen)
  const openModal = useSettingUi((s) => s.openAddressModal)
  const closeModal = useSettingUi((s) => s.closeAddressModal)
  const [editing, setEditing] = useState<Address | null>(null)

  function openEdit(a: Address) {
    setEditing(a)
    openModal()
  }
  function close() {
    setEditing(null)
    closeModal()
  }

  return (
    <Page>
      <PageHeader
        title={t('setting.addresses.title')}
        breadcrumb={`${t('setting.breadcrumbHome')} › ${t('setting.breadcrumbSettings')} › ${t('setting.nav.addresses')}`}
      />
      <SettingsTabBar />

      <Card className="flex flex-col gap-5 p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-text">{t('setting.addresses.cardTitle')}</h2>
            <p className="text-sm text-muted">{t('setting.addresses.cardSubtitle')}</p>
          </div>
          <Button onClick={() => { setEditing(null); openModal() }}>
            <PlusIcon size={15} />
            {t('setting.addresses.addNew')}
          </Button>
        </div>

        <AddressList addresses={data?.addresses ?? []} isLoading={isLoading} onEdit={openEdit} />
      </Card>

      {open && <AddressModal onClose={close} address={editing} />}
    </Page>
  )
}
