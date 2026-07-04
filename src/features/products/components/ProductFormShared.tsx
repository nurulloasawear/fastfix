// Shared primitives for ProductForm section components.
import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'

export type LangTab = 'uz' | 'ru' | 'en'

export function SectionBlock({ title, children, locked }: { title: string; children: ReactNode; locked?: boolean }) {
  const { t } = useTranslation()
  return (
    <Card className={`overflow-hidden ${locked ? 'opacity-70' : ''}`}>
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-base font-semibold text-text">{title}</h2>
      </div>
      <div className="p-6">
        {locked ? <p className="text-sm text-muted">{t('products.add_page.lockedHint')}</p> : children}
      </div>
    </Card>
  )
}

export function LangTabs({ active, onChange }: { active: LangTab; onChange: (l: LangTab) => void }) {
  const LANGS: LangTab[] = ['uz', 'ru', 'en']
  return (
    <div className="flex gap-1 border-b border-border">
      {LANGS.map((l) => (
        <button key={l} type="button" onClick={() => onChange(l)}
          className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
            active === l ? 'border-b-2 border-brand text-brand' : 'text-text-secondary hover:text-text'
          }`}>
          {l.toUpperCase()}
          {l === 'uz' && <span className="ml-1 text-error">*</span>}
        </button>
      ))}
    </div>
  )
}
