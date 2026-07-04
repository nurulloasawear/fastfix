import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { toast } from '@/components/ui/Toast'
import { tError } from '@/i18n'
import { ApiError } from '@/lib/apiError'
import { DiscountProductEditor, usePromotion, useSaveDiscountPromotion, type DiscountLine } from '@/features/promotions'

// ISO <-> <input type=datetime-local> ("YYYY-MM-DDTHH:mm" in local time)
const toLocalInput = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  const off = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - off).toISOString().slice(0, 16)
}
const toISO = (local: string) => (local ? new Date(local).toISOString() : '')

export function CreateDiscountPromotionPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id = '' } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const { data: detail, isLoading } = usePromotion(id)
  const save = useSaveDiscountPromotion()

  const [name, setName] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [lines, setLines] = useState<DiscountLine[]>([])
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (!detail) return
    setName(detail.name)
    setStartsAt(toLocalInput(detail.startsAt))
    setEndsAt(toLocalInput(detail.endsAt))
    setLines(detail.products.map((p) => ({
      key: p.variantId ? `${p.productId}:${p.variantId}` : p.productId,
      productId: p.productId, variantId: p.variantId, title: p.title, image: p.image,
      originalPriceUzs: p.variantPriceUzs ?? p.originalPriceUzs, variantLabel: p.variantLabel ?? undefined,
      discountType: p.discountType ?? 'percent',
      value: String(p.discountType === 'fixed' ? (p.discountPriceUzs ?? '') : (p.discountPercent ?? '')),
      promoStock: p.promoStock != null ? String(p.promoStock) : '',
      perOrderLimit: p.perOrderLimit != null ? String(p.perOrderLimit) : '',
    })))
  }, [detail])

  function validate(publish: boolean): string[] {
    const e: string[] = []
    if (!name.trim()) e.push(t('promotions.valName'))
    if (!startsAt || !endsAt || new Date(endsAt) <= new Date(startsAt)) e.push(t('promotions.valWindow'))
    if (lines.length === 0) e.push(t('promotions.valProducts'))
    if (publish && lines.some((l) => !(Number(l.value) > 0))) e.push(t('promotions.valValue'))
    return e
  }

  async function submit(publish: boolean) {
    const e = validate(publish)
    if (e.length) { setErrors(e); toast.error(e[0]); return }
    setErrors([])
    try {
      await save.mutateAsync({ id: isEdit ? id : undefined, name, startsAt: toISO(startsAt), endsAt: toISO(endsAt), lines, publish })
      toast.success(publish ? t('promotions.savedLive') : t('promotions.savedDraft'))
      void navigate('/marketing/promotions')
    } catch (err) {
      const code = err instanceof ApiError ? err.code : 'internal_error'
      toast.error(tError(code))
    }
  }

  if (isEdit && isLoading) {
    return <Page><div className="flex justify-center p-16"><Spinner /></div></Page>
  }

  return (
    <Page>
      <PageHeader
        title={isEdit ? t('promotions.editTitle') : t('promotions.newTitle')}
        breadcrumb={`${t('promotions.home')} › ${t('promotions.title')} › ${isEdit ? t('promotions.editTitle') : t('promotions.newTitle')}`}
      />
      <div className="mx-auto flex max-w-5xl flex-col gap-5 pb-24">
        {/* Basic */}
        <section className="rounded-lg border border-border bg-surface p-5">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold text-text-secondary">{t('promotions.nameLabel')}</label>
            <Input type="text" maxLength={60} value={name} placeholder={t('promotions.namePh')} onChange={(e) => setName(e.target.value)} />
            <p className="mt-1 text-xs text-muted">{t('promotions.nameHint')}</p>
          </div>
          <label className="mb-1 block text-sm font-semibold text-text-secondary">{t('promotions.periodLabel')}</label>
          <div className="flex flex-wrap items-center gap-3">
            <div><span className="mb-1 block text-xs text-muted">{t('promotions.from')}</span>
              <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} /></div>
            <span className="mt-5 text-muted">—</span>
            <div><span className="mb-1 block text-xs text-muted">{t('promotions.to')}</span>
              <Input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} /></div>
          </div>
        </section>

        {/* Products */}
        <section className="rounded-lg border border-border bg-surface p-5">
          <h3 className="mb-3 text-base font-semibold text-text">{t('promotions.productsLabel')}</h3>
          <DiscountProductEditor lines={lines} onChange={setLines} />
        </section>

        {errors.length > 0 && (
          <div className="rounded-lg border border-error-text bg-error-bg p-3 text-sm text-error-text">
            <ul className="list-disc space-y-0.5 pl-5">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
          </div>
        )}
      </div>

      {/* sticky footer */}
      <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border bg-surface px-6 py-4">
        <Button variant="outline" onClick={() => void navigate('/marketing/promotions')}>{t('promotions.cancel')}</Button>
        <Button variant="outline" disabled={save.isPending} onClick={() => void submit(false)}>{t('promotions.saveDraft')}</Button>
        <Button disabled={save.isPending} onClick={() => void submit(true)}>{save.isPending ? t('promotions.saving') : t('promotions.savePublish')}</Button>
      </div>
    </Page>
  )
}

export default CreateDiscountPromotionPage
