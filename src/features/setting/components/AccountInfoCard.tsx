import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { Image } from '@/components/ui/Image'
import { useAccount, useSeller } from '../api/setting.queries'
import { ResetPhoneModal } from './ResetPhoneModal'
import { EmailModal } from './EmailModal'
import { ProfileEditModal } from './ProfileEditModal'
import { ShopProfileModal } from './ShopProfileModal'
import { MembersManager } from './MembersManager'
import { PasswordForm } from './PasswordForm'

// Account Information card — rows for profile, phone, email, password, sub-accounts.
// Right column shows masked values + Edit/Update/Expand actions per row.

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return '*'.repeat(Math.max(0, digits.length - 2)) + digits.slice(-2)
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  return local.slice(0, 2) + '*'.repeat(Math.max(1, local.length - 2)) + '@' + domain
}

interface RowProps {
  label: string
  value: string
  action: string
  onAction: () => void
}

function InfoRow({ label, value, action, onAction }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4 last:border-0">
      <span className="w-44 shrink-0 text-sm font-semibold text-text">{label}</span>
      <span className="flex-1 text-sm text-text-secondary">{value}</span>
      <Button variant="ghost" size="sm" onClick={onAction} className="shrink-0 text-brand hover:text-brand">
        {action}
      </Button>
    </div>
  )
}

export function AccountInfoCard() {
  const { t } = useTranslation()
  const { data: account, isLoading } = useAccount()
  const { data: seller } = useSeller()
  const [phoneModalOpen, setPhoneModalOpen] = useState(false)
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [subAccountsExpanded, setSubAccountsExpanded] = useState(false)

  if (isLoading || !account) {
    return (
      <Card className="flex items-center justify-center p-10">
        <Spinner />
      </Card>
    )
  }

  return (
    <Card className="flex flex-col">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-base font-semibold text-text">{t('setting.accountInfo.title')}</h2>
      </div>

      {/* My Profile — the USER (person), not the shop */}
      <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <span className="w-44 shrink-0 text-sm font-semibold text-text">
          {t('setting.accountInfo.myProfile')}
        </span>
        <div className="flex flex-1 items-center gap-3">
          {account.avatarUrl ? (
            <Image src={account.avatarUrl} className="h-8 w-8 shrink-0 overflow-hidden rounded-full" alt="avatar" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-brand">
              {(account.fullName || account.username || '?')[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          <span className="text-sm text-text-secondary">
            {account.fullName || account.username || account.phone}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setProfileOpen(true)} className="shrink-0 text-brand hover:text-brand">
          {t('setting.common.edit')}
        </Button>
      </div>

      {/* My Shop — the SHOP entity (separate from the user). Edits shop name + logo. */}
      {seller?.registered && (
        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
          <span className="w-44 shrink-0 text-sm font-semibold text-text">
            {t('setting.accountInfo.myShop', { defaultValue: 'Doʻkonim' })}
          </span>
          <div className="flex flex-1 items-center gap-3">
            <Image src={seller.logoUrl ?? undefined} className="h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-border" alt="shop" />
            <span className="text-sm text-text-secondary">{seller.shopName}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShopOpen(true)} className="shrink-0 text-brand hover:text-brand">
            {t('setting.common.edit')}
          </Button>
        </div>
      )}

      {/* Phone */}
      <InfoRow
        label={t('setting.accountInfo.phone')}
        value={maskPhone(account.phone)}
        action={t('setting.common.edit')}
        onAction={() => setPhoneModalOpen(true)}
      />

      {/* Email */}
      <InfoRow
        label={t('setting.accountInfo.email')}
        value={account.email ? maskEmail(account.email) : t('setting.accountInfo.notSet')}
        action={t('setting.common.edit')}
        onAction={() => setEmailModalOpen(true)}
      />

      {/* Login password */}
      <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <span className="w-44 shrink-0 text-sm font-semibold text-text">
          {t('setting.accountInfo.loginPassword')}
        </span>
        <span className="flex-1 text-sm text-muted">{t('setting.accountInfo.passwordHint')}</span>
        <Button variant="ghost" size="sm" onClick={() => setPasswordOpen(true)} className="shrink-0 text-brand hover:text-brand">
          {t('setting.accountInfo.update')}
        </Button>
      </div>

      {/* Sub-account Management */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <span className="w-44 shrink-0 text-sm font-semibold text-text">
            {t('setting.accountInfo.subAccount')}
          </span>
          <span className="flex-1 text-sm text-muted">{t('setting.accountInfo.notSet')}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSubAccountsExpanded((p) => !p)}
            className="shrink-0 gap-1"
          >
            {t('setting.accountInfo.expand')}
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${subAccountsExpanded ? 'rotate-180' : ''}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Button>
        </div>
        {subAccountsExpanded && (
          <div className="border-t border-border bg-bg px-6 py-4">
            <MembersManager />
          </div>
        )}
      </div>

      {phoneModalOpen && (
        <ResetPhoneModal phone={account.phone} onClose={() => setPhoneModalOpen(false)} />
      )}
      {emailModalOpen && (
        <EmailModal currentEmail={account.email ?? ''} onClose={() => setEmailModalOpen(false)} />
      )}
      {profileOpen && <ProfileEditModal onClose={() => setProfileOpen(false)} />}
      {shopOpen && <ShopProfileModal onClose={() => setShopOpen(false)} />}
      {passwordOpen && (
        <Modal open onClose={() => setPasswordOpen(false)} size="md" title={t('setting.accountInfo.loginPassword')}>
          <PasswordForm />
        </Modal>
      )}
    </Card>
  )
}
