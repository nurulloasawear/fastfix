// BasicSection — product images, name, category, GTIN.
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { uploadProductFile, categoryName, type CategoryNode } from '../api/products.api'
import { ImagePlus, UploadCloud, VideoIcon, X, Trash2 } from './icons'
import { SectionBlock, LangTabs, type LangTab } from './ProductFormShared'
import { ImageEditorModal } from './ProductImageEditor'
import { CategoryPicker } from './CategoryPicker'
import type { ProductFormData } from '../types/products.types'

// Neutral placeholder shown when a stored image URL is dead (e.g. a 404 R2 key).
export const IMG_FALLBACK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='90' height='120'><rect width='90' height='120' fill='%23f1f1f2'/><g fill='none' stroke='%23b8b8c0' stroke-width='3'><rect x='27' y='42' width='36' height='30' rx='3'/><circle cx='37' cy='52' r='3'/><path d='M63 66l-10-10-18 14'/></g></svg>"

export function onImgError(e: { currentTarget: HTMLImageElement }) {
  const el = e.currentTarget
  if (el.src === IMG_FALLBACK) return
  el.onerror = null
  el.src = IMG_FALLBACK
}

function CropIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2v14a2 2 0 0 0 2 2h14" />
      <path d="M18 22V8a2 2 0 0 0-2-2H2" />
    </svg>
  )
}

type Props = {
  form: ProductFormData
  nameLang: LangTab
  onNameLangChange: (l: LangTab) => void
  onUpdate: <K extends keyof ProductFormData>(key: K, val: ProductFormData[K]) => void
}

export function BasicSection({ form, nameLang, onNameLangChange, onUpdate }: Props) {
  const { t } = useTranslation()
  const imgRef = useRef<HTMLInputElement>(null)
  const promoRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState<'' | 'images' | 'promo' | 'video'>('')
  const [error, setError] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState(false)
  const [playVideo, setPlayVideo] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [showCategory, setShowCategory] = useState(false)

  // Reorder images by drag-and-drop; index 0 is the cover/main image.
  function moveImage(from: number, to: number) {
    if (from === to || from < 0 || to < 0) return
    const arr = [...form.images]
    const [m] = arr.splice(from, 1)
    arr.splice(to, 0, m)
    onUpdate('images', arr)
  }

  async function onEditorSave(blob: Blob) {
    if (editIndex === null) return
    setSavingEdit(true)
    try {
      const file = new File([blob], 'edited.jpg', { type: 'image/jpeg' })
      const url = await uploadProductFile(file, 'product')
      onUpdate('images', form.images.map((u, j) => (j === editIndex ? url : u)))
      setEditIndex(null)
    } catch {
      setError(t('products.add_page.uploadFailed', { defaultValue: 'Yuklab boʻlmadi' }))
    } finally {
      setSavingEdit(false)
    }
  }

  async function onPickImages(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null); setBusy('images')
    try {
      const room = Math.max(0, 9 - form.images.length)
      const chosen = Array.from(files).slice(0, room)
      const urls = await Promise.all(chosen.map((f) => uploadProductFile(f, 'product')))
      onUpdate('images', [...form.images, ...urls])
    } catch {
      setError(t('products.add_page.uploadFailed', { defaultValue: 'Yuklab boʻlmadi' }))
    } finally {
      setBusy(''); if (imgRef.current) imgRef.current.value = ''
    }
  }
  async function onPickPromo(files: FileList | null) {
    const file = files?.[0]; if (!file) return
    setError(null); setBusy('promo')
    try { onUpdate('promotionImage', await uploadProductFile(file, 'product')) }
    catch { setError(t('products.add_page.uploadFailed', { defaultValue: 'Yuklab boʻlmadi' })) }
    finally { setBusy(''); if (promoRef.current) promoRef.current.value = '' }
  }
  async function onPickVideo(files: FileList | null) {
    const file = files?.[0]; if (!file) return
    setError(null); setBusy('video')
    try { onUpdate('videoUrl', await uploadProductFile(file, 'video')) }
    catch { setError(t('products.add_page.uploadFailed', { defaultValue: 'Yuklab boʻlmadi' })) }
    finally { setBusy(''); if (videoRef.current) videoRef.current.value = '' }
  }

  const nameValue = nameLang === 'uz' ? form.nameUz : nameLang === 'ru' ? form.nameRu : form.nameEn
  const setName = (v: string) => {
    if (nameLang === 'uz') onUpdate('nameUz', v)
    else if (nameLang === 'ru') onUpdate('nameRu', v)
    else onUpdate('nameEn', v)
  }

  return (
    <SectionBlock title={t('products.add_page.basic')}>
      {/* Images */}
      <div className="mb-5">
        <label className="mb-1 block text-sm font-semibold text-text-secondary">
          <span className="text-error">*</span> {t('products.add_page.images')}
        </label>
        <p className="mb-2 text-xs text-muted">{t('products.add_page.mobilePortraitHint')}</p>
        <div className="mb-2 flex items-center gap-2">
          {/* Product images look best as 1:1 (square) in the app — that's the recommended format. */}
          <span className="flex items-center gap-1 rounded-full border border-brand bg-brand/5 px-3 py-1.5 text-xs font-semibold text-brand">
            {t('products.add_page.ratio11')}
            <span className="rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">{t('products.add_page.recommended')}</span>
          </span>
          <button type="button" onClick={() => setShowGuide(true)} className="ml-1 text-xs font-medium text-brand hover:underline">
            {t('products.add_page.viewExample')}
          </button>
        </div>
        <ImageExampleModal open={showGuide} onClose={() => setShowGuide(false)} sampleImg={form.images[0]} />
        <ImageEditorModal
          open={editIndex !== null}
          src={editIndex !== null ? (form.images[editIndex] ?? null) : null}
          onClose={() => setEditIndex(null)}
          onSave={onEditorSave}
          saving={savingEdit}
        />
        {form.images.length > 1 && <p className="mb-1.5 text-xs text-muted">{t('products.add_page.reorderHint', { defaultValue: 'Tartibni oʻzgartirish uchun torting. Birinchi rasm — asosiy.' })}</p>}
        <div className="flex flex-wrap gap-2">
          {form.images.map((img, i) => (
            <div key={i}
              draggable
              onDragStart={() => setDragIdx(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragIdx !== null) moveImage(dragIdx, i); setDragIdx(null) }}
              onDragEnd={() => setDragIdx(null)}
              className={`group relative h-24 w-[72px] cursor-move overflow-hidden rounded-md border ${dragIdx === i ? 'border-brand opacity-50' : 'border-border'}`}>
              <img src={img} alt="" draggable={false} className="h-full w-full object-cover" onError={onImgError} />
              {i === 0 && (
                <span className="absolute left-0 top-0 rounded-br bg-brand px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">{t('products.add_page.mainImage', { defaultValue: 'Asosiy' })}</span>
              )}
              {/* hover actions: crop (edit) + delete */}
              <div className="absolute inset-x-0 bottom-0 hidden items-center justify-center gap-3 bg-black/55 py-1 group-hover:flex">
                <button type="button" onClick={() => setEditIndex(i)} title={t('products.add_page.editImage', { defaultValue: 'Tahrirlash' })} className="text-white hover:text-brand">
                  <CropIcon />
                </button>
                <span className="h-3.5 w-px bg-white/40" />
                <button type="button" onClick={() => onUpdate('images', form.images.filter((_, j) => j !== i))} title={t('products.add_page.deleteImage', { defaultValue: 'Oʻchirish' })} className="text-white hover:text-error">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {form.images.length < 9 && (
            <button type="button" onClick={() => imgRef.current?.click()} disabled={busy === 'images'}
              className="flex h-24 w-[72px] flex-col items-center justify-center rounded-md border-2 border-dashed border-border text-muted hover:border-brand hover:text-brand disabled:opacity-50">
              <ImagePlus size={20} />
              <span className="mt-1 text-xs">{busy === 'images' ? t('products.add_page.uploading', { defaultValue: 'Yuklanmoqda…' }) : t('products.add_page.addImage')}</span>
              <span className="text-xs">({form.images.length}/9)</span>
            </button>
          )}
          <input ref={imgRef} type="file" accept="image/*" multiple hidden onChange={(e) => void onPickImages(e.target.files)} />
        </div>
        {error && <p className="mt-1 text-xs text-error-text">{error}</p>}
      </div>

      {/* Promotion image */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-text-secondary">{t('products.add_page.promotionImage')}</label>
        <p className="mb-2 text-xs text-muted">{t('products.add_page.promotionHint')}</p>
        <div className="flex items-start gap-2">
          {form.promotionImage && (
            <div className="relative h-24 w-[72px] overflow-hidden rounded-md border border-border">
              <img src={form.promotionImage} alt="" className="h-full w-full object-cover" onError={onImgError} />
              <button type="button" onClick={() => onUpdate('promotionImage', '')} className="absolute right-0.5 top-0.5 rounded-full bg-white/80 p-0.5 text-error"><X size={10} /></button>
            </div>
          )}
          {!form.promotionImage && (
            <button type="button" onClick={() => promoRef.current?.click()} disabled={busy === 'promo'}
              className="flex h-24 w-[72px] flex-col items-center justify-center rounded-md border-2 border-dashed border-border text-muted hover:border-brand disabled:opacity-50">
              <UploadCloud size={20} /><span className="mt-1 text-xs">{busy === 'promo' ? '…' : '0/1'}</span>
              <span className="text-[10px]">1:1</span>
            </button>
          )}
          <input ref={promoRef} type="file" accept="image/*" hidden onChange={(e) => void onPickPromo(e.target.files)} />
        </div>
      </div>

      {/* Video */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-text-secondary">{t('products.add_page.video')}</label>
        <p className="mb-2 text-xs text-muted">{t('products.add_page.videoHint')}</p>
        {/* Video looks best as 3:4 (vertical) in the app — that's the recommended format. */}
        <span className="mb-2 inline-flex items-center gap-1 rounded-full border border-brand bg-brand/5 px-3 py-1 text-xs font-semibold text-brand">
          {t('products.add_page.ratio34')}
          <span className="rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">{t('products.add_page.recommended')}</span>
        </span>
        <div className="flex items-start gap-2">
          {form.videoUrl && (
            <div className="relative h-24 w-[72px] overflow-hidden rounded-md border border-border bg-black">
              {/* tap to play in a modal */}
              <button type="button" onClick={() => setPlayVideo(true)} className="group h-full w-full">
                <video src={`${form.videoUrl}#t=0.1`} preload="metadata" muted className="h-full w-full object-cover" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white transition group-hover:bg-black/75">▶</span>
                </span>
              </button>
              <button type="button" onClick={() => onUpdate('videoUrl', '')} className="absolute right-0.5 top-0.5 rounded-full bg-white/80 p-0.5 text-error"><X size={10} /></button>
            </div>
          )}
          {!form.videoUrl && (
            <button type="button" onClick={() => videoRef.current?.click()} disabled={busy === 'video'}
              className="flex h-24 w-[72px] flex-col items-center justify-center rounded-md border-2 border-dashed border-border text-muted hover:border-brand disabled:opacity-50">
              <VideoIcon size={20} /><span className="mt-1 text-xs">{busy === 'video' ? t('products.add_page.uploading', { defaultValue: 'Yuklanmoqda…' }) : t('products.add_page.addVideo')}</span>
            </button>
          )}
          <input ref={videoRef} type="file" accept="video/mp4,video/*" hidden onChange={(e) => void onPickVideo(e.target.files)} />
        </div>
        {form.videoUrl && (
          <Modal open={playVideo} onClose={() => setPlayVideo(false)} title={t('products.add_page.video')} size="sm">
            <video src={form.videoUrl} controls autoPlay playsInline className="max-h-[60vh] w-full rounded-md bg-black" />
          </Modal>
        )}
      </div>

      {/* Product name */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-text-secondary">
          <span className="text-error">*</span> {t('products.add_page.name')}
        </label>
        <LangTabs active={nameLang} onChange={onNameLangChange} />
        <div className="relative mt-2">
          <Input type="text" maxLength={120} placeholder={t('products.add_page.namePlaceholder')}
            value={nameValue} onChange={(e) => setName(e.target.value)}
            trailing={<span className="text-xs">{nameValue.length}/120</span>}
          />
        </div>
      </div>

      {/* Category */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-text-secondary">
          <span className="text-error">*</span> {t('products.add_page.category')}
        </label>
        <button
          type="button"
          onClick={() => setShowCategory(true)}
          className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-left text-sm transition-colors hover:border-brand"
        >
          <span className={form.category ? 'text-text' : 'text-muted'}>
            {form.category || t('products.add_page.categoryPlaceholder')}
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
      <CategoryPicker
        open={showCategory}
        valueId={form.categoryId}
        onClose={() => setShowCategory(false)}
        onSelect={(node: CategoryNode, path: CategoryNode[]) => {
          onUpdate('categoryId', node.id)
          onUpdate('category', path.map((p) => categoryName(p.name)).join(' > '))
        }}
      />

      {/* GTIN */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-text-secondary">{t('products.add_page.gtin')}</label>
        <div className="flex items-center gap-3">
          <Input type="text" placeholder={t('products.add_page.gtinPlaceholder')} value={form.gtin}
            disabled={form.gtinExempt} onChange={(e) => onUpdate('gtin', e.target.value)}
            className="flex-1" />
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input type="checkbox" checked={form.gtinExempt} onChange={(e) => onUpdate('gtinExempt', e.target.checked)} className="rounded" />
            {t('products.add_page.gtinExempt')}
          </label>
        </div>
      </div>
    </SectionBlock>
  )
}

// A phone-shaped mock comparing how a product image fills the buyer screen.
function PhoneMock({ ratio, label, recommended, img }: { ratio: '1:1' | '3:4'; label: string; recommended?: boolean; img?: string }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <div className={`w-full max-w-[150px] overflow-hidden rounded-2xl border-2 ${recommended ? 'border-brand shadow-md' : 'border-border'} bg-white`}>
        <div className="flex h-4 items-center justify-end gap-1 bg-bg px-2 text-[7px] font-medium text-muted">12:30 ▾ ▮</div>
        <div className={`relative w-full ${ratio === '3:4' ? 'aspect-[3/4]' : 'aspect-square'} bg-gradient-to-b from-slate-100 to-slate-200`}>
          {img ? (
            <img src={img} alt="" className="h-full w-full object-cover" onError={onImgError} />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 3 5 5 3 8l2.5 1.8L6 8v12h12V8l.5 1.8L21 8l-2-3-3-2c0 1.4-1.8 2.5-4 2.5S8 4.4 8 3Z" />
              </svg>
            </div>
          )}
          <span className="absolute left-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white/70 text-[9px] text-slate-600">‹</span>
        </div>
        <div className="p-2">
          <p className="truncate text-[8px] font-medium text-text">{t('products.add_page.exampleSampleName', { defaultValue: 'Stylish product name' })}</p>
          <p className="text-[10px] font-bold text-error">89 000 {t('products.add_page.currencySom', { defaultValue: 'soʻm' })}</p>
          <div className="mt-1 flex gap-1">
            <span className="flex-1 rounded bg-success/80 py-0.5 text-center text-[6px] text-white">Chat</span>
            <span className="flex-1 rounded bg-amber-500 py-0.5 text-center text-[6px] text-white">Cart</span>
            <span className="flex-1 rounded bg-error py-0.5 text-center text-[6px] text-white">Buy</span>
          </div>
        </div>
      </div>
      <span className={`text-xs font-semibold ${recommended ? 'text-brand' : 'text-muted'}`}>{label}{recommended ? ' ✓' : ''}</span>
    </div>
  )
}

// "View Example" — Shopee-style modal that promotes the 1:1 square format for images.
function ImageExampleModal({ open, onClose, sampleImg }: { open: boolean; onClose: () => void; sampleImg?: string }) {
  const { t } = useTranslation()
  const dos = ['gPortrait', 'gBright', 'gClean', 'gFill', 'gFocus', 'gAngles'].map((k) => t(`products.add_page.${k}`))
  const donts = ['bDark', 'bClutter', 'bText', 'bScreens'].map((k) => t(`products.add_page.${k}`))
  return (
    <Modal open={open} onClose={onClose} title={t('products.add_page.exampleTitle')} size="lg"
      footer={<>
        <span className="mr-auto self-center text-xs text-text-secondary">{t('products.add_page.exampleConfirm')}</span>
        <Button onClick={onClose}>{t('products.add_page.exampleOk', { defaultValue: 'OK' })}</Button>
      </>}>
      <p className="mb-4 text-sm text-text-secondary">{t('products.add_page.exampleIntro')}</p>
      <div className="mb-4 flex items-start justify-center gap-4 rounded-lg bg-bg p-4">
        <PhoneMock ratio="1:1" label={t('products.add_page.ratio11')} recommended img={sampleImg} />
        <PhoneMock ratio="3:4" label={t('products.add_page.ratio34')} img={sampleImg} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {dos.map((d, i) => (
          <p key={`d${i}`} className="flex gap-1.5 text-xs text-text-secondary"><span className="text-success">✓</span>{d}</p>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border pt-3">
        {donts.map((d, i) => (
          <p key={`b${i}`} className="flex gap-1.5 text-xs text-muted"><span className="text-error">✕</span>{d}</p>
        ))}
      </div>
    </Modal>
  )
}
