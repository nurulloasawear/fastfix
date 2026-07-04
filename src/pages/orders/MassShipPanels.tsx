import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import { DownloadIcon } from '@/features/orders'

// ── Shared filter pill row ────────────────────────────────────────────────────
export function FilterPillRow({
  label, items, active, onChange,
}: {
  label: string
  items: { key: string; label: string }[]
  active: string
  onChange: (key: string) => void
}) {
  const tabItems: TabItem[] = items.map((item) => ({ key: item.key, label: item.label }))
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="min-w-[120px] shrink-0 text-xs font-semibold text-text-secondary">{label}</span>
      <Tabs items={tabItems} value={active} onChange={onChange} />
    </div>
  )
}

// ── Generate Documents tab: extra selects ────────────────────────────────────
export function GenerateDocSelects({ printStatusLabel, parcelsLabel }: {
  printStatusLabel: string
  parcelsLabel: string
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select className="h-9 min-w-[160px] text-xs">
        <option>{printStatusLabel} All</option>
      </Select>
      <Select className="h-9 min-w-[160px] text-xs">
        <option>{parcelsLabel} All</option>
      </Select>
    </div>
  )
}

// ── Arrange Shipment side panel ───────────────────────────────────────────────
export function MassShipPanel({
  selectedCount, arrangeMethod, onSetMethod, onArrange, isPending, t,
}: {
  selectedCount: number
  arrangeMethod: 'dropoff' | 'pickup'
  onSetMethod: (m: 'dropoff' | 'pickup') => void
  onArrange: () => void
  isPending: boolean
  t: (k: string, o?: Record<string, unknown>) => string
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm font-semibold text-text">{t('orders.massShipPage.massPanelTitle')}</div>
      <div className="text-xs text-muted">
        {t('orders.massShipPage.parcelsSelected', { count: selectedCount })}
      </div>
      {(['dropoff', 'pickup'] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onSetMethod(m)}
          className={`rounded-lg border-2 p-3 text-left transition-colors ${
            arrangeMethod === m
              ? 'border-brand bg-success-bg'
              : 'border-border bg-surface hover:bg-bg'
          }`}
        >
          <div className="text-sm font-semibold text-text">
            {m === 'dropoff' ? t('orders.massShipPage.dropOff') : t('orders.massShipPage.pickUp')}
          </div>
          {m === 'dropoff' && (
            <div className="mt-0.5 text-xs text-muted">{t('orders.massShipPage.dropOffDesc')}</div>
          )}
        </button>
      ))}
      <Button disabled={selectedCount === 0 || isPending} onClick={onArrange} className="w-full">
        {isPending && <Spinner className="h-4 w-4" />}
        {arrangeMethod === 'dropoff'
          ? t('orders.massShipPage.massArrangeDropoff')
          : t('orders.massShipPage.massArrangePickup')}
      </Button>
    </div>
  )
}

// ── Generate Documents side panel ─────────────────────────────────────────────
export function GenerateDocsPanel({
  selectedCount, docTypes, onToggleDocType, onGenerate, isPending, t,
}: {
  selectedCount: number
  docTypes: string[]
  onToggleDocType: (type: string) => void
  onGenerate: () => void
  isPending: boolean
  t: (k: string) => string
}) {
  const allDocOptions = [
    { key: 'label', label: t('orders.massShipPage.shippingLabel') },
    { key: 'picklist', label: t('orders.massShipPage.picklist') },
    { key: 'packing_pdf', label: t('orders.massShipPage.packingListPdf') },
    { key: 'packing_excel', label: t('orders.massShipPage.packingListExcel') },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm font-semibold text-text">{t('orders.massShipPage.generateDocsTitle')}</div>
      <div className="text-xs font-semibold text-brand">{t('orders.massShipPage.generateDocsSubtitle')}</div>
      <div className="flex flex-col gap-2">
        {allDocOptions.map((opt) => (
          <label key={opt.key} className="flex cursor-pointer items-center gap-2 text-sm text-text">
            <input
              type="checkbox"
              checked={docTypes.includes(opt.key)}
              onChange={() => onToggleDocType(opt.key)}
              className="h-4 w-4 rounded border-border-strong accent-brand"
            />
            {opt.label}
          </label>
        ))}
      </div>
      <div className="rounded-lg border border-border bg-bg p-3">
        <div className="mb-2 text-xs font-semibold text-muted">{t('orders.massShipPage.outputFileDetails')}</div>
        <div className="flex items-center gap-2">
          <DownloadIcon size={14} className="text-brand" />
          <span className="text-sm text-text">{t('orders.massShipPage.airWaybill')}</span>
        </div>
      </div>
      <Button
        disabled={selectedCount === 0 || docTypes.length === 0 || isPending}
        onClick={onGenerate}
        className="w-full"
      >
        {isPending ? <Spinner className="h-4 w-4" /> : <DownloadIcon size={14} />}
        {t('orders.massShipPage.generateSelected')}
      </Button>
      <p className="text-[10px] text-muted">{t('orders.massShipPage.popupNote')}</p>
    </div>
  )
}
