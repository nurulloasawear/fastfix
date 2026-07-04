// Shopee-style product image editor: crop (1:1 default / 3:4), zoom, rotate, flip.
import { useState } from 'react'
import Cropper from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

type Area = { x: number; y: number; width: number; height: number }
type Flip = { horizontal: boolean; vertical: boolean }

// ── Canvas export (official react-easy-crop helper, with rotation + flip) ──────
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', reject)
    img.crossOrigin = 'anonymous' // R2 sends Access-Control-Allow-Origin: * so the canvas isn't tainted
    img.src = url
  })
}
const toRad = (deg: number) => (deg * Math.PI) / 180
function rotateSize(w: number, h: number, rotation: number) {
  const r = toRad(rotation)
  return {
    width: Math.abs(Math.cos(r) * w) + Math.abs(Math.sin(r) * h),
    height: Math.abs(Math.sin(r) * w) + Math.abs(Math.cos(r) * h),
  }
}
async function getCroppedBlob(src: string, crop: Area, rotation: number, flip: Flip): Promise<Blob | null> {
  const image = await createImage(src)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const { width: bw, height: bh } = rotateSize(image.width, image.height, rotation)
  canvas.width = bw
  canvas.height = bh
  ctx.translate(bw / 2, bh / 2)
  ctx.rotate(toRad(rotation))
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  ctx.translate(-image.width / 2, -image.height / 2)
  ctx.drawImage(image, 0, 0)

  const out = document.createElement('canvas')
  const octx = out.getContext('2d')
  if (!octx) return null
  out.width = Math.round(crop.width)
  out.height = Math.round(crop.height)
  octx.drawImage(canvas, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
  return new Promise((resolve) => out.toBlob((b) => resolve(b), 'image/jpeg', 0.92))
}

// ── Toolbar bits ───────────────────────────────────────────────────────────────
function ToolBtn({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-md border text-text transition-colors ${active ? 'border-brand bg-brand/10 text-brand' : 'border-border hover:border-brand hover:text-brand'}`}>
      {children}
    </button>
  )
}
const Ico = { className: 'h-4 w-4', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

type Props = {
  open: boolean
  src: string | null
  onClose: () => void
  onSave: (blob: Blob) => Promise<void> | void
  saving?: boolean
}

export function ImageEditorModal({ open, src, onClose, onSave, saving }: Props) {
  const { t } = useTranslation()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [aspect, setAspect] = useState<'3:4' | '1:1'>('1:1')
  const [area, setArea] = useState<Area | null>(null)

  function reset() {
    setCrop({ x: 0, y: 0 }); setZoom(1); setRotation(0); setFlipH(false); setFlipV(false)
  }
  async function save() {
    if (!src || !area) return
    const blob = await getCroppedBlob(src, area, rotation, { horizontal: flipH, vertical: flipV })
    if (blob) await onSave(blob)
  }

  return (
    <Modal open={open} onClose={onClose} title={t('products.add_page.editImages')} size="lg"
      footer={<>
        <Button variant="outline" onClick={onClose} disabled={saving}>{t('products.add_page.cancel')}</Button>
        <Button onClick={() => void save()} disabled={saving || !area}>
          {saving ? t('products.add_page.saving', { defaultValue: 'Saqlanmoqda…' }) : t('products.add_page.save', { defaultValue: 'Save' })}
        </Button>
      </>}>
      {/* aspect toggle */}
      <div className="mb-2 flex items-center gap-2 text-xs">
        <span className="text-text-secondary">{t('products.add_page.cropRatio', { defaultValue: 'Format' })}:</span>
        {(['1:1', '3:4'] as const).map((a) => (
          <button key={a} type="button" onClick={() => setAspect(a)}
            className={`rounded-full px-2.5 py-1 font-semibold border ${aspect === a ? 'border-brand bg-brand/5 text-brand' : 'border-border-strong text-muted'}`}>
            {a}{a === '1:1' ? ' ✓' : ''}
          </button>
        ))}
      </div>
      <div className="relative h-[55vh] w-full overflow-hidden rounded-lg bg-black">
        {src && (
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect === '3:4' ? 3 / 4 : 1}
            objectFit="contain"
            showGrid
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={(_, px) => setArea(px)}
            transform={`translate(${crop.x}px, ${crop.y}px) rotate(${rotation}deg) scale(${zoom}) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`}
          />
        )}
      </div>
      {/* toolbar */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <ToolBtn onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(2)))} title={t('products.add_page.zoomOut', { defaultValue: 'Zoom out' })}>
          <svg {...Ico}><circle cx="11" cy="11" r="7" /><path d="M8 11h6M21 21l-4-4" /></svg>
        </ToolBtn>
        <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="h-1 w-28 accent-brand" />
        <ToolBtn onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))} title={t('products.add_page.zoomIn', { defaultValue: 'Zoom in' })}>
          <svg {...Ico}><circle cx="11" cy="11" r="7" /><path d="M11 8v6M8 11h6M21 21l-4-4" /></svg>
        </ToolBtn>
        <span className="mx-1 h-5 w-px bg-border" />
        <ToolBtn onClick={() => setRotation((r) => (r + 90) % 360)} title={t('products.add_page.rotate', { defaultValue: 'Rotate' })}>
          <svg {...Ico}><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>
        </ToolBtn>
        <ToolBtn onClick={() => setFlipH((f) => !f)} active={flipH} title={t('products.add_page.flipH', { defaultValue: 'Flip horizontal' })}>
          <svg {...Ico}><path d="M12 3v18M7 8l-4 4 4 4M17 8l4 4-4 4" /></svg>
        </ToolBtn>
        <ToolBtn onClick={() => setFlipV((f) => !f)} active={flipV} title={t('products.add_page.flipV', { defaultValue: 'Flip vertical' })}>
          <svg {...Ico}><path d="M3 12h18M8 7l4-4 4 4M8 17l4 4 4-4" /></svg>
        </ToolBtn>
        <span className="mx-1 h-5 w-px bg-border" />
        <button type="button" onClick={reset} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-brand hover:text-brand">
          {t('products.add_page.reset', { defaultValue: 'Reset' })}
        </button>
      </div>
    </Modal>
  )
}
