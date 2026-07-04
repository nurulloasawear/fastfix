// BrandPicker — searchable brand registry picker for the product form.
// Shows each brand's eligibility for THIS seller (open / yours / authorized /
// authorization-required / unavailable). Only open|owned|authorized are
// selectable. Lets the seller quick-add a new (open) brand, or jump to the
// formal "Register a brand" form for a verified/protected one.
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useBrandSearch, useQuickCreateBrand } from '../api/products.queries'
import type { BrandSearchResult, BrandUseStatus } from '../types/products.types'

const SELECTABLE: BrandUseStatus[] = ['open', 'owned', 'authorized']
const isSelectable = (s: BrandUseStatus) => SELECTABLE.includes(s)

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (brand: { id: string; name: string } | null) => void
}

function StatusBadge({ status }: { status: BrandUseStatus }) {
  const { t } = useTranslation()
  if (status === 'open') return null
  const tone: Record<string, string> = {
    owned: 'bg-success/15 text-success',
    authorized: 'bg-success/15 text-success',
    auth_pending: 'bg-warning/15 text-warning',
    auth_rejected: 'bg-error/15 text-error',
    needs_authorization: 'bg-warning/15 text-warning',
    owned_by_other: 'bg-muted/15 text-muted',
  }
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${tone[status] ?? 'bg-muted/15 text-muted'}`}>
      {t(`products.brandPicker.status.${status}`)}
    </span>
  )
}

export function BrandPicker({ open, onClose, onSelect }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [raw, setRaw] = useState('')
  const [q, setQ] = useState('')
  const quickCreate = useQuickCreateBrand()
  const [note, setNote] = useState<string | null>(null)

  // Debounce the search input.
  useEffect(() => {
    const id = setTimeout(() => setQ(raw.trim()), 250)
    return () => clearTimeout(id)
  }, [raw])

  useEffect(() => {
    if (open) {
      setRaw('')
      setQ('')
      setNote(null)
    }
  }, [open])

  const { data: results = [], isFetching } = useBrandSearch(q, open)

  // Is the typed name already an exact match? (don't offer "add new" if so)
  const exact = useMemo(
    () => results.some((b) => b.name.toLowerCase() === raw.trim().toLowerCase()),
    [results, raw],
  )

  function choose(b: BrandSearchResult) {
    if (!isSelectable(b.useStatus)) {
      setNote(t(`products.brandPicker.cannot.${b.useStatus}`))
      return
    }
    onSelect({ id: b.id, name: b.name })
    onClose()
  }

  async function addNew() {
    const name = raw.trim()
    if (!name || quickCreate.isPending) return
    const b = await quickCreate.mutateAsync(name)
    if (isSelectable(b.useStatus)) {
      onSelect({ id: b.id, name: b.name })
      onClose()
    } else {
      // Name already exists as a protected/exclusive brand — surface its status.
      setNote(t(`products.brandPicker.cannot.${b.useStatus}`))
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('products.brandPicker.title')}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={() => { onSelect(null); onClose() }}>
            {t('products.brandPicker.noBrand')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => { onClose(); navigate('/products/product-setting/brand-registration') }}
          >
            {t('products.brandPicker.registerVerified')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Input
          type="text"
          autoFocus
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={t('products.brandPicker.searchPlaceholder')}
        />

        <div className="max-h-[360px] overflow-y-auto rounded-lg border border-border">
          {isFetching && results.length === 0 && (
            <p className="py-8 text-center text-sm text-muted">{t('products.brandPicker.searching')}</p>
          )}
          {!isFetching && results.length === 0 && raw.trim() === '' && (
            <p className="py-8 text-center text-sm text-muted">{t('products.brandPicker.typeToSearch')}</p>
          )}
          {results.map((b) => {
            const sel = isSelectable(b.useStatus)
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => choose(b)}
                className={`flex w-full items-center justify-between gap-3 border-b border-border px-4 py-2.5 text-left text-sm last:border-0 ${
                  sel ? 'hover:bg-surface-hover' : 'cursor-not-allowed opacity-70'
                }`}
              >
                <span className="font-medium text-text">{b.name}</span>
                <StatusBadge status={b.useStatus} />
              </button>
            )
          })}

          {/* Quick-add a brand not yet in the registry */}
          {raw.trim() !== '' && !exact && !isFetching && (
            <button
              type="button"
              onClick={addNew}
              disabled={quickCreate.isPending}
              className="flex w-full items-center gap-2 border-t border-border px-4 py-2.5 text-left text-sm text-brand hover:bg-surface-hover disabled:opacity-50"
            >
              <span className="text-base leading-none">+</span>
              {t('products.brandPicker.addNew', { name: raw.trim() })}
            </button>
          )}
        </div>

        {note && <p className="text-sm text-warning">{note}</p>}
      </div>
    </Modal>
  )
}
