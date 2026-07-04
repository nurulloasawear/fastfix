import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { tError } from '@/i18n'
import { ApiError } from '@/lib/apiError'
import { useInviteStaff, useRemoveStaff, useStaff } from '../api/setting.queries'

// Shop member management — a shop has many users with access levels (roles).
// Invite by phone (the user must already have an OZB account); assign a role; remove.
// Owner is implicit (sellers.user_id) and not listed as a staff member.
const ROLES = ['manager', 'approver', 'viewer'] as const

function roleTone(role: string): 'brand' | 'info' | 'gray' {
  return role === 'manager' ? 'brand' : role === 'approver' ? 'info' : 'gray'
}

export function MembersManager() {
  const { t } = useTranslation()
  const toast = useToast()
  const { data: members, isLoading } = useStaff()
  const invite = useInviteStaff()
  const remove = useRemoveStaff()
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<string>('manager')

  function onInvite() {
    if (!phone.trim()) return
    invite.mutate({ phone: phone.trim(), role }, {
      onSuccess: () => {
        setPhone('')
        toast.success(t('setting.members.invited', { defaultValue: 'Aʼzo taklif qilindi' }))
      },
      onError: (e) => toast.error(tError(e instanceof ApiError ? e.code : 'internal_error')),
    })
  }

  function onRemove(id: string) {
    if (!window.confirm(t('setting.members.confirmRemove', { defaultValue: 'Aʼzoni olib tashlash?' }))) return
    remove.mutate(id, {
      onSuccess: () => toast.success(t('setting.members.removed', { defaultValue: 'Aʼzo olib tashlandi' })),
      onError: (e) => toast.error(tError(e instanceof ApiError ? e.code : 'internal_error')),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Invite by phone + role */}
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-[180px] flex-1">
          <Input
            label={t('setting.members.phone', { defaultValue: 'Telefon raqami' })}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+998 ..."
          />
        </div>
        <Select
          label={t('setting.members.role', { defaultValue: 'Rol' })}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-36"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>{t(`setting.members.roles.${r}`, { defaultValue: r })}</option>
          ))}
        </Select>
        <Button disabled={invite.isPending || !phone.trim()} onClick={onInvite}>
          {invite.isPending ? t('setting.common.loading') : t('setting.members.invite', { defaultValue: 'Taklif qilish' })}
        </Button>
      </div>

      {/* Members list */}
      {isLoading ? (
        <Spinner />
      ) : (members?.length ?? 0) === 0 ? (
        <p className="text-sm text-muted">{t('setting.accountInfo.subAccountEmpty')}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {members!.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text">{m.name}</span>
                <span className="text-xs text-muted">{m.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={roleTone(m.role)}>{t(`setting.members.roles.${m.role}`, { defaultValue: m.role })}</Badge>
                {m.status !== 'active' && <Badge tone="warning">{m.status}</Badge>}
                <Button variant="ghost" size="sm" className="text-error-text" disabled={remove.isPending} onClick={() => onRemove(m.id)}>
                  {t('setting.common.delete', { defaultValue: 'Oʻchirish' })}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
