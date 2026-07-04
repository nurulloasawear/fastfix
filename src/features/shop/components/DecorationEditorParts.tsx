// Sub-components for DecorationEditorCanvas:
// WidgetDef constants, PaletteIcon, PaletteItem, PhoneCanvas, PreviewPhoneBezel.
// Inspector lives in DecorationInspector.tsx.
import { useTranslation } from 'react-i18next'
import type { Widget, WidgetType } from '../types/shop.types'
import type { WidgetDef } from './widgetDefs'
import { ImageIcon, VideoIcon, ArrowUpIcon, ArrowDownIcon, TrashIcon } from './icons'

// Tailwind bg classes for phone canvas blocks (gradients are illustration-level, exempt)
const BLOCK_BG: Partial<Record<WidgetType, string>> = {
  cover_image:        'h-20 bg-gradient-to-r from-[#e8d5c4] to-[#c4a882]',
  carousel:           'h-20 bg-gradient-to-r from-[#d4e8f5] to-[#82b4c4]',
  product_highlights: 'h-[70px] bg-surface border-b border-border/20',
  text:               'h-10 bg-surface flex items-center px-2',
  video:              'h-20 bg-brand',
  banner_with_tag:    'h-14 bg-brand',
  multi_image:        'h-16 bg-bg',
  single_image:       'h-16 bg-bg',
  product_category:   'h-14 bg-bg',
}

// ── Palette icon ──────────────────────────────────────────────────────────────

export function PaletteIcon({ icon }: { icon: WidgetDef['icon'] }) {
  if (icon === 'video') return <VideoIcon className="h-4 w-4" />
  if (icon === 'text') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
        <path d="M4 7V4h16v3M9 20h6M12 4v16" />
      </svg>
    )
  }
  if (icon === 'banner') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 9h18" />
      </svg>
    )
  }
  if (icon === 'category') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </svg>
    )
  }
  return <ImageIcon className="h-4 w-4" />
}

// ── Palette item tile ─────────────────────────────────────────────────────────

export function PaletteItem({ def, onAdd }: { def: WidgetDef; onAdd: (t: WidgetType) => void }) {
  const { t } = useTranslation()
  return (
    <button
      type="button"
      onClick={() => onAdd(def.type)}
      className="group flex flex-col items-center gap-1 rounded-lg border border-border bg-surface px-1.5 py-2 text-center transition hover:border-brand hover:bg-bg"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-bg text-muted group-hover:text-brand">
        <PaletteIcon icon={def.icon} />
      </div>
      <span className="line-clamp-2 text-[9px] leading-tight text-text-secondary">
        {t(def.labelKey)}
      </span>
    </button>
  )
}

// ── Phone canvas ──────────────────────────────────────────────────────────────

export type PhoneProps = {
  widgets: Widget[]
  selectedId: string | null
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
}

export function PhoneCanvas({ widgets, selectedId, onSelect, onRemove, onMoveUp, onMoveDown }: PhoneProps) {
  const { t } = useTranslation()
  return (
    <div className="mx-auto w-[240px]">
      <div className="overflow-hidden rounded-[24px] border-[6px] border-brand bg-white shadow-xl">
        <div className="flex h-6 items-center justify-between bg-brand px-3">
          <span className="text-[9px] text-white/60">OZB</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => <div key={i} className="h-1.5 w-1.5 rounded-full bg-white/40" />)}
          </div>
        </div>
        <div className="flex h-[420px] flex-col overflow-y-auto">
          {widgets.length === 0 ? (
            <div className="flex flex-1 items-center justify-center p-4 text-center text-[10px] text-muted">
              {t('shop.decoration.empty')}
            </div>
          ) : (
            widgets.map((w, idx) => {
              const isSelected = w.id === selectedId
              return (
                <div
                  key={w.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(w.id)}
                  onKeyDown={(e) => e.key === 'Enter' && onSelect(w.id)}
                  className={`group relative border-b transition ${isSelected ? 'border-brand ring-2 ring-inset ring-brand/30' : 'border-border/30 hover:bg-bg/40'}`}
                >
                  <div className={`w-full flex items-center justify-center ${BLOCK_BG[w.type] ?? 'h-[60px] bg-bg'}`}>
                    <span className="select-none text-[8px] font-semibold uppercase tracking-wider text-muted/70 mix-blend-overlay">
                      {w.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="absolute right-1 top-1 hidden flex-col gap-0.5 group-hover:flex">
                    <button type="button" disabled={idx === 0}
                      onClick={(e) => { e.stopPropagation(); onMoveUp(w.id) }}
                      className="rounded bg-surface/90 px-1 py-0.5 text-[9px] shadow disabled:opacity-30 hover:bg-brand hover:text-white">
                      <ArrowUpIcon className="h-3 w-3" />
                    </button>
                    <button type="button" disabled={idx === widgets.length - 1}
                      onClick={(e) => { e.stopPropagation(); onMoveDown(w.id) }}
                      className="rounded bg-surface/90 px-1 py-0.5 text-[9px] shadow disabled:opacity-30 hover:bg-brand hover:text-white">
                      <ArrowDownIcon className="h-3 w-3" />
                    </button>
                    <button type="button"
                      onClick={(e) => { e.stopPropagation(); onRemove(w.id) }}
                      className="rounded bg-surface/90 px-1 py-0.5 text-[9px] text-error-text shadow hover:bg-error-bg">
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] text-muted">
        {widgets.length} {widgets.length === 1 ? 'widget' : 'widgets'}
      </p>
    </div>
  )
}

// ── Preview phone bezel ───────────────────────────────────────────────────────

export function PreviewPhoneBezel({ widgets }: { widgets: Widget[] }) {
  const { t } = useTranslation()
  return (
    <div className="mx-auto w-[240px]">
      <div className="overflow-hidden rounded-[24px] border-[6px] border-brand bg-white shadow-xl">
        <div className="flex h-6 items-center justify-between bg-brand px-3">
          <span className="text-[9px] text-white/60">OZB</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => <div key={i} className="h-1.5 w-1.5 rounded-full bg-white/40" />)}
          </div>
        </div>
        <div className="flex h-[400px] flex-col overflow-y-auto">
          {widgets.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-[10px] text-muted">
              {t('shop.decoration.empty')}
            </div>
          ) : (
            widgets.map((w) => (
              <div key={w.id} className={`w-full border-b border-border/20 ${BLOCK_BG[w.type] ?? 'h-[60px] bg-bg'}`} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
