import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Language } from '@/i18n'
import { pickLang } from '@/lib/lang'
import type { LangMap } from '@/lib/lang'
import { Badge } from '@/components/ui/Badge'
import { Tr, Td } from '@/components/ui/Table'
import { toast } from '@/components/ui/Toast'
import {
  CategoryPicker, useEditAIImportItem, useDecideAIImportItem,
  type AIReviewItem, type ReviewDecision,
} from '@/features/products'
import { FullEditorModal } from './FullEditorModal'

const inp = 'w-full rounded-md border border-border bg-bg px-2 py-1 text-sm text-text focus:border-brand focus:outline-none'
const ta = `${inp} resize-y`
const toInt = (s: string) => { const n = parseInt(s.replace(/[^\d]/g, ''), 10); return Number.isFinite(n) ? n : 0 }
const catLabel = (path: Array<{ name: LangMap }>, lang: Language) =>
  path.map((c) => pickLang(c.name, lang)).filter(Boolean).join(' › ')

const STATUS_TONE: Record<AIReviewItem['status'], 'info' | 'success' | 'warning' | 'error'> = {
  ai_review: 'info', active: 'success', draft: 'warning', hidden: 'error',
}

// One review row, shown in the CURRENT app language (UZ/RU/EN switcher drives `lang`):
// the name & description fields edit that language; switching language re-shows all 20 in it.
export function AIImportReviewRow({ item, jobId, lang }: { item: AIReviewItem; jobId: string; lang: Language }) {
  const { t } = useTranslation()
  const edit = useEditAIImportItem(jobId)
  const decide = useDecideAIImportItem(jobId)
  const editable = item.status === 'ai_review'

  const [title, setTitle] = useState<Record<string, string>>({ uz: item.title.uz ?? '', ru: item.title.ru ?? '', en: item.title.en ?? '' })
  const [desc, setDesc] = useState<Record<string, string>>({ uz: item.description.uz ?? '', ru: item.description.ru ?? '', en: item.description.en ?? '' })
  const [brand, setBrand] = useState(item.brand)
  const [price, setPrice] = useState(item.priceUzs ? String(item.priceUzs) : '')
  const [stock, setStock] = useState(item.stock ? String(item.stock) : '')
  const [catId, setCatId] = useState<string | null>(item.categoryId)
  const [catPath, setCatPath] = useState<Array<{ name: LangMap }>>(item.categoryPath)
  const [missing, setMissing] = useState<string[]>(item.missing)
  const [picker, setPicker] = useState(false)
  const [editor, setEditor] = useState(false)
  const busy = edit.isPending || decide.isPending

  async function commit(fields: Record<string, unknown>) {
    try {
      const res = await edit.mutateAsync({ id: item.id, fields })
      setMissing(res.missing)
    } catch {
      toast.error(t('products.review.saveFailed'))
    }
  }
  async function act(decision: ReviewDecision) {
    try {
      await decide.mutateAsync({ id: item.id, decision })
      toast.success(t(`products.review.toast.${decision}`))
    } catch {
      toast.error(t('products.review.actionFailed'))
    }
  }

  const thumb = item.imageUrls[0]
  const cat = catLabel(catPath, lang)

  if (!editable) {
    return (
      <Tr className="opacity-80">
        <Td>{thumb ? <img src={thumb} alt="" className="h-12 w-12 rounded object-cover" /> : <div className="h-12 w-12 rounded bg-bg" />}</Td>
        <Td className="text-sm text-text">{pickLang(item.title, lang)}</Td>
        <Td colSpan={4} className="text-xs text-muted">{cat}</Td>
        <Td><Badge tone={STATUS_TONE[item.status]}>{t(`products.review.status.${item.status}`)}</Badge></Td>
        <Td><button type="button" onClick={() => setEditor(true)} className="text-xs font-semibold text-brand">{t('products.review.openEditor')}</button></Td>
        {editor && <FullEditorModal id={item.id} jobId={jobId} onClose={() => setEditor(false)} />}
      </Tr>
    )
  }

  return (
    <Tr className="align-top">
      <Td>
        <button type="button" onClick={() => setEditor(true)} title={t('products.review.openEditor')}>
          {thumb ? <img src={thumb} alt="" className="h-14 w-14 rounded object-cover ring-1 ring-border" /> : <div className="grid h-14 w-14 place-items-center rounded bg-bg text-[10px] text-muted">{item.imageUrls.length}</div>}
        </button>
        {item.imageUrls.length > 1 && <p className="mt-1 text-center text-[10px] text-muted">{item.imageUrls.length} 🖼</p>}
      </Td>
      <Td className="min-w-[300px]">
        <textarea className={ta} rows={2} value={title[lang] ?? ''} placeholder={t('products.review.namePh')}
          onChange={(e) => setTitle({ ...title, [lang]: e.target.value })} onBlur={() => void commit({ title })} />
        <textarea className={`${ta} mt-1`} rows={3} value={desc[lang] ?? ''} placeholder={t('products.review.descPh')}
          onChange={(e) => setDesc({ ...desc, [lang]: e.target.value })} onBlur={() => void commit({ description: desc })} />
        {item.attributes.length > 0 && <p className="mt-1 text-[11px] text-muted">{t('products.review.attrs', { n: item.attributes.length })}</p>}
      </Td>
      <Td className="min-w-[160px]">
        <button type="button" onClick={() => setPicker(true)} className={`${inp} text-left ${catId ? '' : 'text-error'}`}>
          {cat || t('products.review.pickCategory')}
        </button>
        {picker && (
          <CategoryPicker open valueId={catId ?? undefined} onClose={() => setPicker(false)}
            onSelect={(node, path) => { setCatId(node.id); setCatPath(path); setPicker(false); void commit({ category_id: node.id }) }} />
        )}
      </Td>
      <Td className="min-w-[110px]">
        <input className={inp} value={brand} placeholder={t('products.review.brand')} onChange={(e) => setBrand(e.target.value)} onBlur={() => brand !== item.brand && void commit({ brand })} />
      </Td>
      <Td className="min-w-[110px]">
        <input className={inp} value={price} inputMode="numeric" onChange={(e) => setPrice(e.target.value)} onBlur={() => void commit({ price_uzs: toInt(price) })} />
        <p className="mt-0.5 text-[10px] text-muted">{t('products.review.priceHint')}</p>
      </Td>
      <Td className="min-w-[80px]">
        <input className={inp} value={stock} inputMode="numeric" onChange={(e) => setStock(e.target.value)} onBlur={() => void commit({ stock: toInt(stock) })} />
      </Td>
      <Td className="min-w-[110px]">
        {missing.length === 0 ? (
          <Badge tone="success">{t('products.review.ready')}</Badge>
        ) : (
          <div className="flex flex-wrap gap-1">{missing.map((m) => <Badge key={m} tone="warning">{t(`products.review.missing.${m}`)}</Badge>)}</div>
        )}
      </Td>
      <Td className="min-w-[150px]">
        <div className="flex flex-col gap-1.5">
          <button type="button" disabled={busy || missing.length > 0} title={missing.length ? t('products.review.fixFirst') : ''}
            onClick={() => act('approve')}
            className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white hover:bg-accent hover:text-brand disabled:cursor-not-allowed disabled:opacity-40">
            {t('products.review.approve')}
          </button>
          <div className="flex gap-1.5">
            <button type="button" disabled={busy} onClick={() => act('draft')} className="flex-1 rounded-full border border-border-strong px-2 py-1 text-xs text-text hover:bg-bg disabled:opacity-40">{t('products.review.draft')}</button>
            <button type="button" disabled={busy} onClick={() => act('reject')} className="flex-1 rounded-full border border-border-strong px-2 py-1 text-xs text-error hover:bg-bg disabled:opacity-40">{t('products.review.reject')}</button>
          </div>
          <button type="button" onClick={() => setEditor(true)} className="text-center text-[11px] font-medium text-brand">{t('products.review.openEditor')}</button>
        </div>
      </Td>
      {editor && <FullEditorModal id={item.id} jobId={jobId} onClose={() => setEditor(false)} />}
    </Tr>
  )
}
