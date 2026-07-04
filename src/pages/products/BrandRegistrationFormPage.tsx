import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  CategoryPicker, FormField, ImagePlus, TextArea, TextField,
  categoryName, uploadProductFile, useRegisterBrand,
} from '@/features/products'

const NAME_MAX = 63
const TEXT_MAX = 254

// Non-label field wrapper (FormField wraps in <label>, which can't contain the
// image uploader's own <label>). Use for category + image fields.
function Block({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-text-secondary">{label}</span>
      {hint && <span className="text-xs text-muted">{hint}</span>}
      {children}
    </div>
  )
}

// Inline image uploader (R2 via presigned PUT). Thumbnails + add tile + remove.
function ImageGrid({ urls, max, onChange, hint }: {
  urls: string[]; max: number; onChange: (next: string[]) => void; hint: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  async function add(files: FileList | null) {
    if (!files || busy) return
    setBusy(true)
    try {
      const room = max - urls.length
      const picked = Array.from(files).slice(0, room)
      const uploaded: string[] = []
      for (const f of picked) uploaded.push(await uploadProductFile(f))
      onChange([...urls, ...uploaded])
    } finally {
      setBusy(false)
      if (ref.current) ref.current.value = ''
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {urls.map((u, i) => (
        <div key={u + i} className="relative h-24 w-24 overflow-hidden rounded-lg border border-border">
          <img src={u} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(urls.filter((_, j) => j !== i))}
            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white"
            aria-label="remove"
          >
            ✕
          </button>
        </div>
      ))}
      {urls.length < max && (
        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-strong bg-bg text-center text-xs text-muted transition-colors hover:border-brand hover:bg-surface">
          <ImagePlus size={20} />
          <span>{busy ? '…' : hint}</span>
          <input ref={ref} type="file" accept="image/*" multiple={max > 1} hidden onChange={(e) => add(e.target.files)} />
        </label>
      )}
    </div>
  )
}

export function BrandRegistrationFormPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const register = useRegisterBrand()

  const [brandName, setBrandName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categoryLabel, setCategoryLabel] = useState('')
  const [sampleImages, setSampleImages] = useState<string[]>([])
  const [logo, setLogo] = useState<string[]>([])
  const [website, setWebsite] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const [showCategory, setShowCategory] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const valid = brandName.trim() !== '' && categoryId !== '' && sampleImages.length > 0 && acknowledged

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (!valid) {
      setError(t('products.brand.valMissing'))
      return
    }
    if (register.isPending) return
    await register.mutateAsync({
      brandName: brandName.trim(),
      categoryId,
      sampleImageUrls: sampleImages,
      logoUrl: logo[0] ?? '',
      website,
      additionalInfo,
      acknowledged,
    })
    navigate('/products/product-setting/brand-management')
  }

  return (
    <Page>
      <PageHeader
        title={t('products.brand.formTitle')}
        breadcrumb={`${t('products.home')} › ${t('products.setting.title')} › ${t('products.brand.formTitle')}`}
      />

      <Card className="max-w-3xl p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-text">{t('products.brand.formTitle')}</h2>
          <p className="text-sm text-muted">{t('products.brand.formDesc')}</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <FormField label={`* ${t('products.brand.name')}`}>
            <TextField
              value={brandName}
              maxLength={NAME_MAX}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder={t('products.brand.namePh')}
            />
            <p className="mt-1 text-right text-xs text-muted">{brandName.length}/{NAME_MAX}</p>
          </FormField>

          <Block label={`* ${t('products.category')}`}>
            <button
              type="button"
              onClick={() => setShowCategory(true)}
              className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border-strong bg-surface px-3.5 text-left text-sm transition hover:border-brand"
            >
              <span className={categoryLabel ? 'text-text' : 'text-muted'}>
                {categoryLabel || t('products.brand.categoryPh')}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          </Block>

          <Block label={`* ${t('products.brand.sample')}`} hint={t('products.brand.sampleHint')}>
            <ImageGrid urls={sampleImages} max={10} onChange={setSampleImages} hint={t('products.brand.upload')} />
          </Block>

          <Block label={t('products.brand.logo')}>
            <ImageGrid urls={logo} max={1} onChange={setLogo} hint={t('products.brand.upload')} />
          </Block>

          <FormField label={t('products.brand.website')}>
            <TextField value={website} maxLength={TEXT_MAX} onChange={(e) => setWebsite(e.target.value)} placeholder={t('products.brand.websitePh')} />
          </FormField>

          <FormField label={t('products.brand.extra')}>
            <TextArea value={additionalInfo} maxLength={TEXT_MAX} onChange={(e) => setAdditionalInfo(e.target.value)} placeholder={t('products.brand.extraPh')} />
            <p className="mt-1 text-right text-xs text-muted">{additionalInfo.length}/{TEXT_MAX}</p>
          </FormField>

          <label className="flex items-start gap-2 text-sm text-text-secondary">
            <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} className="mt-0.5 rounded" />
            <span>{t('products.brand.acknowledge')}</span>
          </label>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex justify-end pt-1">
            <Button type="submit" disabled={!valid || register.isPending}>
              {register.isPending ? t('products.brand.submitting') : t('products.brand.submit')}
            </Button>
          </div>
        </form>
      </Card>

      <CategoryPicker
        open={showCategory}
        valueId={categoryId}
        onClose={() => setShowCategory(false)}
        onSelect={(node, path) => {
          setCategoryId(node.id)
          setCategoryLabel(path.map((p) => categoryName(p.name)).join(' > '))
        }}
      />
    </Page>
  )
}
