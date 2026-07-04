// Sub-tab components for ShopDecorationPage: Category and Custom tabs.
// TopPicksTab lives in ShopDecorationTopPicksTab.tsx.
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { DecorationInfoBanner } from '@/features/shop'

export { TopPicksTab } from './ShopDecorationTopPicksTab'

// ── Category Page tab ─────────────────────────────────────────────────────────

export function CategoryPageTab() {
  const { t } = useTranslation()
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-text">{t('shop.decoration.categoryPageTab')}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">{t('shop.decoration.categoryAdjustSeq')}</Button>
              <Button size="sm">{t('shop.decoration.categoryAdd')}</Button>
            </div>
          </div>
          <DecorationInfoBanner text="Auto-adopts Standard layout until at least one category is enabled." />
          <div className="mt-6">
            <EmptyState
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6" aria-hidden="true">
                  <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              }
              title={t('shop.decoration.categoryPageEmpty')}
              action={<Button size="sm">{t('shop.decoration.categoryAdd')}</Button>}
            />
          </div>
        </Card>
      </div>
      <div className="hidden w-48 shrink-0 lg:block">
        <Card className="flex h-72 items-center justify-center bg-bg">
          <span className="text-xs text-muted">{t('shop.decoration.previewTitle')}</span>
        </Card>
      </div>
    </div>
  )
}

// ── Custom Page tab ───────────────────────────────────────────────────────────

export function CustomPageTab() {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

  return (
    <Card className="flex flex-col items-center gap-6 py-16">
      <CustomPageIllo />
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-base font-bold text-text">{t('shop.decoration.customPageEmpty')}</p>
        <ul className="max-w-xs list-inside list-disc space-y-1 text-left text-sm text-muted">
          <li>Campaign pages for Navruz, Independence Day</li>
          <li>Brand story pages</li>
          <li>Flash sale landing pages</li>
          <li>Custom promotions</li>
        </ul>
      </div>
      <Button onClick={() => setShowModal(true)}>{t('shop.decoration.customPageCreate')}</Button>
      <CreateCustomPageModal open={showModal} onClose={() => setShowModal(false)} />
    </Card>
  )
}

function CreateCustomPageModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [from, setFrom] = useState<'template' | 'blank'>('blank')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('shop.decoration.customPageModal')}
      size="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('shop.decoration.customPageCancel')}
          </Button>
          <Button size="sm" disabled={!name.trim()}>
            {t('shop.decoration.customPageConfirm')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label={t('shop.decoration.customPageName')}
          maxLength={30}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-text-secondary">
            {t('shop.decoration.customPageFrom')}
          </span>
          {(['template', 'blank'] as const).map((v) => (
            <label key={v} className="flex cursor-pointer items-center gap-2 text-sm text-text">
              <input type="radio" name="from" value={v} checked={from === v}
                onChange={() => setFrom(v)} className="accent-brand" />
              {v === 'template' ? t('shop.decoration.customPageTemplate') : t('shop.decoration.customPageBlank')}
            </label>
          ))}
        </div>
      </div>
    </Modal>
  )
}

// ── Custom page illustration ──────────────────────────────────────────────────

function CustomPageIllo() {
  return (
    <svg viewBox="0 0 160 100" className="h-24 w-40" fill="none" aria-hidden="true">
      <rect x="10" y="10" width="60" height="80" rx="5" fill="#e8d5c4" />
      <rect x="15" y="20" width="50" height="12" rx="2" fill="#c4a882" />
      <rect x="15" y="38" width="50" height="8" rx="2" fill="#d4c0a8" />
      <rect x="15" y="52" width="35" height="8" rx="2" fill="#d4c0a8" />
      <rect x="90" y="10" width="60" height="80" rx="5" fill="#d4e8f5" />
      <rect x="95" y="20" width="50" height="12" rx="2" fill="#82b4c4" />
      <rect x="95" y="38" width="50" height="8" rx="2" fill="#a8d0e0" />
      <rect x="95" y="52" width="35" height="8" rx="2" fill="#a8d0e0" />
      <circle cx="80" cy="50" r="12" fill="#fdd400" />
      <path d="M74 50l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
