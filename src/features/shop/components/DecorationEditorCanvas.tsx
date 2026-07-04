// Mobile Homepage Editor — 3-panel layout: widget palette | phone canvas | property inspector.
// Sub-components (PhoneCanvas, InspectorPanel, PaletteItem, etc.) are in DecorationEditorParts.tsx.
// Preview modal is inline (kit <Modal>). Hyperlink intro modal lives in DecorationEditorModals.tsx.
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import type { DecorationContent, Widget, WidgetType } from '../types/shop.types'
import { WIDGET_DEFS } from './widgetDefs'
import {
  PaletteItem,
  PhoneCanvas,
  PreviewPhoneBezel,
} from './DecorationEditorParts'
import { InspectorPanel, InspectorActions } from './DecorationInspector'

type Props = {
  content: DecorationContent
  onSave: (widgets: Widget[]) => void
  onPublish: () => void
  isSaving: boolean
}

export function DecorationEditorCanvas({ content, onSave, onPublish, isSaving }: Props) {
  const { t } = useTranslation()
  const [widgets, setWidgets] = useState<Widget[]>(content.widgets)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [paletteTab, setPaletteTab] = useState<'regular' | 'template'>('regular')

  const selectedWidget = widgets.find((w) => w.id === selectedId) ?? null
  const selectedIdx = selectedId ? widgets.findIndex((w) => w.id === selectedId) : -1

  function addWidget(type: WidgetType) {
    const w: Widget = { id: crypto.randomUUID(), type, order: widgets.length + 1, config: {} }
    setWidgets((prev) => [...prev, w])
    setSelectedId(w.id)
  }

  function removeWidget(id: string) {
    setWidgets((prev) => prev.filter((w) => w.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  function moveUp(id: string) {
    setWidgets((prev) => {
      const idx = prev.findIndex((w) => w.id === id)
      if (idx <= 0) return prev
      const next = [...prev]
      ;[next[idx - 1], next[idx]] = [next[idx]!, next[idx - 1]!]
      return next
    })
  }

  function moveDown(id: string) {
    setWidgets((prev) => {
      const idx = prev.findIndex((w) => w.id === id)
      if (idx < 0 || idx >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1]!, next[idx]!]
      return next
    })
  }

  const visualWidgets = WIDGET_DEFS.filter((d) => d.group === 'visual_text')
  const productWidgets = WIDGET_DEFS.filter((d) => d.group === 'product_category')

  return (
    <div className="flex h-full flex-col">
      {/* ── Top action bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-text">{content.name}</span>
          {content.publishedAt && (
            <span className="text-xs text-muted">
              {new Date(content.publishedAt).toLocaleDateString('ru-RU')}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
            {t('shop.decoration.editorPreview')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onSave(widgets)} disabled={isSaving}>
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                {t('shop.decoration.saving')}
              </span>
            ) : (
              t('shop.decoration.editorSave')
            )}
          </Button>
          <Button size="sm" onClick={onPublish}>{t('shop.decoration.editorPublish')}</Button>
        </div>
      </div>

      {/* ── 3-panel body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: widget palette */}
        <aside className="w-52 shrink-0 overflow-y-auto border-r border-border bg-bg p-3">
          <div className="mb-3 flex gap-1">
            <button
              type="button"
              onClick={() => setPaletteTab('regular')}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                paletteTab === 'regular' ? 'bg-brand text-white' : 'text-text-secondary hover:bg-border'
              }`}
            >
              {t('shop.decoration.widgetRegular')}
            </button>
            <button
              type="button"
              onClick={() => setPaletteTab('template')}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                paletteTab === 'template' ? 'bg-brand text-white' : 'text-text-secondary hover:bg-border'
              }`}
            >
              {t('shop.decoration.widgetTemplate')}
            </button>
          </div>
          {paletteTab === 'template' ? (
            <p className="py-8 text-center text-xs text-muted">{t('shop.decoration.templatesComingSoon')}</p>
          ) : (
            <>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                {t('shop.decoration.widgetVisualText')}
              </p>
              <div className="mb-3 grid grid-cols-2 gap-1.5">
                {visualWidgets.map((w) => (
                  <PaletteItem key={w.type} def={w} onAdd={addWidget} />
                ))}
              </div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                {t('shop.decoration.widgetProductCategory')}
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {productWidgets.map((w) => (
                  <PaletteItem key={w.type} def={w} onAdd={addWidget} />
                ))}
              </div>
            </>
          )}
        </aside>

        {/* CENTRE: phone canvas */}
        <main className="flex flex-1 flex-col items-center overflow-y-auto bg-bg py-6 px-4">
          <PhoneCanvas
            widgets={widgets}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onRemove={removeWidget}
            onMoveUp={moveUp}
            onMoveDown={moveDown}
          />
        </main>

        {/* RIGHT: inspector */}
        <aside className="w-64 shrink-0 overflow-y-auto border-l border-border bg-surface p-4">
          <p className="mb-3 text-sm font-semibold text-text">
            {t('shop.decoration.widgetPalette')}
          </p>
          <InspectorPanel widget={selectedWidget} />
          {selectedWidget && (
            <InspectorActions
              widget={selectedWidget}
              isFirst={selectedIdx === 0}
              isLast={selectedIdx === widgets.length - 1}
              onMoveUp={moveUp}
              onMoveDown={moveDown}
              onRemove={removeWidget}
            />
          )}
        </aside>
      </div>

      {/* Preview modal */}
      <Modal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        title={t('shop.decoration.previewTitle')}
        size="sm"
        footer={
          <Button variant="outline" onClick={() => setShowPreview(false)}>
            {t('shop.decoration.previewClose')}
          </Button>
        }
      >
        <div className="flex justify-center py-2">
          <PreviewPhoneBezel widgets={widgets} />
        </div>
      </Modal>
    </div>
  )
}
