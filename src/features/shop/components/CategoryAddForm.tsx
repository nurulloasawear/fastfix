import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCreateCategory } from '../api/shop.queries'
import { useShopUi } from '../stores/shop.store'

export function CategoryAddForm() {
  const { t } = useTranslation()
  const create = useCreateCategory()
  const close = useShopUi((s) => s.setShowCategoryForm)
  const [name, setName] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    create.mutate(trimmed, {
      onSuccess: () => {
        setName('')
        close(false)
      },
    })
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-end gap-4 rounded-lg border border-border bg-surface p-4 shadow-xs sm:flex-row"
    >
      <div className="flex-1">
        <Input
          label={t('shop.categories.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('shop.categories.namePlaceholder')}
          autoFocus
        />
      </div>
      <div className="flex w-full gap-2 sm:w-auto">
        <Button type="button" variant="outline" onClick={() => close(false)} className="flex-1 sm:flex-none">
          {t('shop.categories.cancel')}
        </Button>
        <Button type="submit" disabled={create.isPending} className="flex-1 sm:flex-none">
          {t('shop.categories.create')}
        </Button>
      </div>
    </form>
  )
}
