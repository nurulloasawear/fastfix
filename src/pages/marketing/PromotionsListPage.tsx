import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { toast } from '@/components/ui/Toast'
import {
  usePromotions, useDeletePromotion, useDuplicatePromotion, type PromotionStatus,
} from '@/features/promotions'

const STATUS_COLORS: Record<PromotionStatus, string> = {
  draft: 'bg-bg text-muted',
  upcoming: 'bg-warning-bg text-brand',
  active: 'bg-success/15 text-success',
  expired: 'bg-bg text-muted',
  cancelled: 'bg-error-bg text-error-text',
}
const fmt = (iso: string) => (iso ? new Date(iso).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' }) : '—')

export function PromotionsListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [status, setStatus] = useState<PromotionStatus | 'all'>('all')
  const [q, setQ] = useState('')
  const { data, isLoading } = usePromotions('discount', status, q, 1)
  const del = useDeletePromotion()
  const dup = useDuplicatePromotion()

  const tabs: (PromotionStatus | 'all')[] = ['all', 'active', 'upcoming', 'expired', 'draft']
  const promos = data?.promotions ?? []

  const tiles = [
    { key: 'discount', title: t('promotions.createDiscount'), desc: t('promotions.createDiscountDesc'), active: true, go: () => navigate('/marketing/promotions/discount/new') },
    { key: 'bundle', title: t('promotions.createBundle'), desc: t('promotions.createBundleDesc'), active: false, go: () => toast.info('Coming soon') },
    { key: 'addon', title: t('promotions.createAddon'), desc: t('promotions.createAddonDesc'), active: false, go: () => toast.info('Coming soon') },
  ]

  return (
    <Page>
      <PageHeader title={t('promotions.title')} breadcrumb={`${t('promotions.home')} › ${t('promotions.title')}`} />
      <p className="mb-4 text-sm text-muted">{t('promotions.subtitle')}</p>

      {/* create tiles */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {tiles.map((tile) => (
          <div key={tile.key} className={`flex flex-col rounded-lg border border-border bg-surface p-4 ${tile.active ? '' : 'opacity-60'}`}>
            <p className="text-sm font-semibold text-text">{tile.title}</p>
            <p className="mt-1 mb-3 flex-1 text-xs text-muted">{tile.desc}</p>
            <Button onClick={tile.go} disabled={!tile.active} className="self-start">{tile.active ? t('promotions.createDiscount') : 'Soon'}</Button>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {tabs.map((s) => (
            <button key={s} type="button" onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status === s ? 'bg-brand text-white' : 'border border-border text-muted hover:text-text'}`}>
              {s === 'all' ? t('promotions.tabAll') : t(`promotions.st${s.charAt(0).toUpperCase()}${s.slice(1)}`)}
            </button>
          ))}
        </div>
        <Input type="search" value={q} placeholder={t('promotions.pickSearch')} onChange={(e) => setQ(e.target.value)} className="ml-auto w-64" />
      </div>

      {/* list */}
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-bg text-left text-xs text-text-secondary">
            <tr>
              <th className="px-4 py-3">{t('promotions.colName')}</th>
              <th className="px-4 py-3">{t('promotions.colStatus')}</th>
              <th className="px-4 py-3">{t('promotions.colPeriod')}</th>
              <th className="px-4 py-3">{t('promotions.colProducts')}</th>
              <th className="px-4 py-3 text-right">{t('promotions.colActions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={5} className="py-12 text-center"><Spinner /></td></tr>
            ) : promos.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-sm text-muted">{t('promotions.empty')}<br /><span className="text-xs">{t('promotions.emptyHint')}</span></td></tr>
            ) : promos.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-text">{p.name}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[p.status]}`}>{t(`promotions.st${p.status.charAt(0).toUpperCase()}${p.status.slice(1)}`)}</span></td>
                <td className="px-4 py-3 text-xs text-muted">{fmt(p.startsAt)} — {fmt(p.endsAt)}</td>
                <td className="px-4 py-3 text-muted">{p.productCount}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3 text-xs">
                    <button type="button" onClick={() => navigate(`/marketing/promotions/${p.id}/edit`)} className="text-brand hover:underline">{t('promotions.edit')}</button>
                    <button type="button" onClick={() => dup.mutate(p.id, { onSuccess: () => toast.success('OK') })} className="text-brand hover:underline">{t('promotions.duplicate')}</button>
                    {p.status === 'active' ? (
                      <button type="button" onClick={() => { if (confirm(t('promotions.endConfirm'))) del.mutate(p.id, { onSuccess: () => toast.success(t('promotions.ended')) }) }} className="text-error hover:underline">{t('promotions.endEarly')}</button>
                    ) : (
                      <button type="button" onClick={() => del.mutate(p.id, { onSuccess: () => toast.success(t('promotions.deleted')) })} className="text-error hover:underline">{t('promotions.delete')}</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  )
}

export default PromotionsListPage
