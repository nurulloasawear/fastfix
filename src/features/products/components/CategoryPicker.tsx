// CategoryPicker — drill-down (multi-column) + search modal for the product
// taxonomy. Sellers must pick a LEAF category (only leaves accept products).
// Data comes from the live GET /catalog/category-tree (≤5 levels, uz/ru/en).
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCategoryTree } from '../api/products.queries'
import { categoryName, type CategoryNode } from '../api/products.api'

const ROOT = '__root__'

type Props = {
  open: boolean
  valueId?: string
  onClose: () => void
  onSelect: (node: CategoryNode, path: CategoryNode[]) => void
}

export function CategoryPicker({ open, valueId, onClose, onSelect }: Props) {
  const { t } = useTranslation()
  const { data: nodes = [], isLoading, isError } = useCategoryTree()

  // Build lookup indices once per dataset: id → node, parent → sorted children,
  // id → ancestor chain (root..self).
  const { byId, childrenOf, roots, pathOf } = useMemo(() => {
    const byId = new Map<string, CategoryNode>()
    for (const n of nodes) byId.set(n.id, n)
    const childrenOf = new Map<string, CategoryNode[]>()
    for (const n of nodes) {
      const key = n.parent_id ?? ROOT
      const arr = childrenOf.get(key)
      if (arr) arr.push(n)
      else childrenOf.set(key, [n])
    }
    for (const arr of childrenOf.values()) arr.sort((a, b) => a.position - b.position)
    const pathOf = new Map<string, CategoryNode[]>()
    for (const n of nodes) {
      const chain: CategoryNode[] = []
      let cur: CategoryNode | undefined = n
      while (cur) {
        chain.unshift(cur)
        cur = cur.parent_id ? byId.get(cur.parent_id) : undefined
      }
      pathOf.set(n.id, chain)
    }
    return { byId, childrenOf, roots: childrenOf.get(ROOT) ?? [], pathOf }
  }, [nodes])

  // trail[i] = id chosen in column i; selected = the chosen leaf (or '').
  const [trail, setTrail] = useState<string[]>([])
  const [selected, setSelected] = useState('')
  const [search, setSearch] = useState('')
  const colsRef = useRef<HTMLDivElement>(null)

  // Seed from the existing value each time the modal opens.
  useEffect(() => {
    if (!open) return
    setSearch('')
    const chain = valueId ? pathOf.get(valueId) : undefined
    if (chain && chain.length) {
      setTrail(chain.map((c) => c.id))
      const leaf = byId.get(valueId!)
      setSelected(leaf?.is_leaf ? valueId! : '')
    } else {
      setTrail([])
      setSelected('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, valueId, nodes.length])

  // Columns rendered: roots, then the children of each trail entry that has any.
  const columns = useMemo(() => {
    const cols: CategoryNode[][] = [roots]
    for (const id of trail) {
      const kids = childrenOf.get(id)
      if (kids && kids.length) cols.push(kids)
      else break
    }
    return cols
  }, [roots, trail, childrenOf])

  // Keep the deepest (rightmost) column in view as the seller drills down.
  useEffect(() => {
    const el = colsRef.current
    if (el) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
  }, [columns.length])

  function pick(colIndex: number, node: CategoryNode) {
    const next = trail.slice(0, colIndex)
    next[colIndex] = node.id
    setTrail(next)
    setSelected(node.is_leaf ? node.id : '')
  }

  // Search: match leaves by name (uz/ru/en) or full breadcrumb. Cap the list.
  const results = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (q.length < 2) return []
    const out: Array<{ node: CategoryNode; path: string }> = []
    for (const n of nodes) {
      if (!n.is_leaf) continue
      const chain = pathOf.get(n.id) ?? [n]
      const path = chain.map((c) => categoryName(c.name)).join(' › ')
      const hay = `${path} ${n.name.en ?? ''} ${n.name.ru ?? ''} ${n.name.uz ?? ''}`.toLowerCase()
      if (hay.includes(q)) {
        out.push({ node: n, path })
        if (out.length >= 60) break
      }
    }
    return out
  }, [search, nodes, pathOf])

  const selectedChain = selected ? pathOf.get(selected) ?? [] : []
  const canConfirm = !!selected && !!byId.get(selected)?.is_leaf

  function confirm() {
    const node = selected ? byId.get(selected) : undefined
    if (!node || !node.is_leaf) return
    onSelect(node, pathOf.get(node.id) ?? [node])
    onClose()
  }

  function chooseResult(node: CategoryNode) {
    onSelect(node, pathOf.get(node.id) ?? [node])
    onClose()
  }

  const searching = search.trim().length >= 2

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('products.add_page.categoryPicker.title')}
      size="2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t('products.add_page.categoryPicker.cancel')}
          </Button>
          <Button onClick={confirm} disabled={!canConfirm}>
            {t('products.add_page.categoryPicker.confirm')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('products.add_page.categoryPicker.searchPlaceholder')}
          trailing={<SearchIcon />}
        />

        {isLoading && <p className="py-10 text-center text-sm text-muted">{t('products.add_page.categoryPicker.loading')}</p>}
        {isError && <p className="py-10 text-center text-sm text-error">{t('products.add_page.categoryPicker.error')}</p>}

        {!isLoading && !isError && searching && (
          <div className="max-h-[360px] overflow-y-auto rounded-lg border border-border">
            {results.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted">{t('products.add_page.categoryPicker.noResults')}</p>
            ) : (
              results.map(({ node, path }) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => chooseResult(node)}
                  className="block w-full border-b border-border px-4 py-2.5 text-left text-sm last:border-0 hover:bg-surface-hover"
                >
                  <span className="font-medium text-text">{categoryName(node.name)}</span>
                  <span className="ml-2 text-xs text-muted">{path}</span>
                </button>
              ))
            )}
          </div>
        )}

        {!isLoading && !isError && !searching && (
          <div
            ref={colsRef}
            className="flex h-[clamp(360px,62vh,560px)] gap-px overflow-x-auto rounded-lg border border-border bg-border"
          >
            {columns.map((col, colIndex) => (
              <div key={colIndex} className="min-w-[240px] flex-1 overflow-y-auto bg-surface">
                {col.map((node) => {
                  const active = trail[colIndex] === node.id
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => pick(colIndex, node)}
                      className={`flex w-full items-start justify-between gap-2 px-3 py-2.5 text-left text-sm leading-snug transition-colors ${
                        active ? 'bg-brand/10 font-semibold text-brand' : 'text-text hover:bg-surface-hover'
                      }`}
                    >
                      <span className="break-words">{categoryName(node.name)}</span>
                      {!node.is_leaf && <ChevronIcon className={`mt-0.5 shrink-0 ${active ? 'text-brand' : 'text-muted'}`} />}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        )}

        <div className="min-h-[20px] text-sm">
          {selectedChain.length > 0 ? (
            <span className="text-text-secondary">
              <span className="text-muted">{t('products.add_page.categoryPicker.selected')}: </span>
              {selectedChain.map((c) => categoryName(c.name)).join(' › ')}
            </span>
          ) : (
            <span className="text-muted">{t('products.add_page.categoryPicker.hint')}</span>
          )}
        </div>
      </div>
    </Modal>
  )
}

function ChevronIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  )
}
