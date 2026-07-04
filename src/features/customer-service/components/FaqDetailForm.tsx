import type { ComponentType, SVGProps } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { MessageSquareIcon, PlusIcon, ShoppingBagIcon } from './icons'

type IconCmp = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>
type FaqType = 'general' | 'product' | 'order'
type ProductFilter = 'all' | 'related' | 'specific'

const TYPE_CARDS: { value: FaqType; icon: IconCmp }[] = [
  { value: 'general', icon: MessageSquareIcon },
  { value: 'product', icon: ShoppingBagIcon },
  { value: 'order', icon: ShoppingBagIcon },
]

const QUESTION_ROWS = ['1', '2', '3'] as const

// Capped text field with a 0/N counter (mirrors the prototype). Local form state
// only — there's no save endpoint yet ([PENDING BACKEND]).
function CappedInput({ placeholder, max = 14 }: { placeholder: string; max?: number }) {
  const [value, setValue] = useState('')
  return (
    <div className="relative">
      <input
        value={value}
        maxLength={max}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-border-strong bg-surface px-3.5 pr-12 text-sm text-text outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-[#f2f4f7]"
      />
      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-muted">
        {value.length}/{max}
      </span>
    </div>
  )
}

// The whole FAQ-card editor form. Kept in the feature so the page stays thin.
export function FaqDetailForm() {
  const { t } = useTranslation()
  const [type, setType] = useState<FaqType>('general')
  const [productFilter, setProductFilter] = useState<ProductFilter>('all')
  const base = 'customerService.faqAssistant.detail'

  return (
    <Card className="max-w-3xl p-6">
      <h3 className="mb-4 text-sm font-semibold text-text">{t(`${base}.basicSetting`)}</h3>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {TYPE_CARDS.map(({ value, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setType(value)}
            className={`rounded-lg border p-4 text-left transition-colors ${
              type === value
                ? 'border-brand ring-1 ring-brand'
                : 'border-border-strong hover:border-brand'
            }`}
          >
            <Icon size={18} className="mb-2 text-muted" />
            <div className="text-sm font-semibold text-text">{t(`${base}.type.${value}.title`)}</div>
            <div className="mt-1 text-[11px] leading-snug text-muted">
              {t(`${base}.type.${value}.desc`)}
            </div>
          </button>
        ))}
      </div>

      {type !== 'general' && (
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-semibold text-text-secondary">{t(`${base}.cardName`)}</label>
          <CappedInput placeholder={t(`${base}.cardName`)} />
        </div>
      )}

      {type === 'product' && (
        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-text-secondary">{t(`${base}.productType`)}</label>
          <div className="flex flex-wrap gap-4 text-sm text-text">
            {(['all', 'related', 'specific'] as const).map((value) => (
              <label key={value} className="flex cursor-pointer items-center gap-1.5">
                <input
                  type="radio"
                  name="faq-product-filter"
                  checked={productFilter === value}
                  onChange={() => setProductFilter(value)}
                  className="accent-brand"
                />
                {t(`${base}.product${value.charAt(0).toUpperCase() + value.slice(1)}`)}
              </label>
            ))}
          </div>
          {productFilter === 'related' && (
            <Button type="button" size="sm" className="mt-3">
              <PlusIcon size={14} />
              {t(`${base}.addProduct`)}
            </Button>
          )}
        </div>
      )}

      <div className="mb-6">
        <Select label={t(`${base}.greetings`)}>
          <option value="">{t(`${base}.greetingsPlaceholder`)}</option>
        </Select>
      </div>

      <h3 className="mb-4 text-sm font-semibold text-text">{t(`${base}.qaTitle`)}</h3>
      <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">{t(`${base}.categoryName`)}</label>
          <CappedInput placeholder={t(`${base}.categoryName`)} />
        </div>
        {QUESTION_ROWS.map((num) => (
          <div
            key={num}
            className={`flex flex-col gap-2 ${num !== '1' ? 'border-t border-dashed border-border pt-3.5' : ''}`}
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">{t(`${base}.question`, { num })}</label>
              <CappedInput placeholder={t(`${base}.categoryName`)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">{t(`${base}.answer`)}</label>
              <CappedInput placeholder={t(`${base}.answerPlaceholder`)} />
            </div>
          </div>
        ))}
        <button
          type="button"
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong px-3 py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg"
        >
          <PlusIcon size={14} />
          {t(`${base}.addCategory`)}
        </button>
      </div>

      <div className="mt-6 flex justify-end gap-2.5">
        <Link to="/customer-service/faq-assistant">
          <Button variant="outline">{t('customerService.common.cancel')}</Button>
        </Link>
        <Button>{t('customerService.common.save')}</Button>
      </div>
    </Card>
  )
}
