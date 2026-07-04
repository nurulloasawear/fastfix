import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { EyeIcon, EyeOffIcon, TrashIcon } from './icons'
import { useDeleteCategory, useToggleCategory } from '../api/shop.queries'
import type { ShopCategory } from '../types/shop.types'

type Props = { categories: ShopCategory[]; isLoading: boolean }

export function CategoryTable({ categories, isLoading }: Props) {
  const { t } = useTranslation()
  const toggle = useToggleCategory()
  const remove = useDeleteCategory()

  if (isLoading) return <div className="p-6 text-sm text-muted">{t('common.loading')}</div>
  if (categories.length === 0)
    return <div className="p-8 text-center text-sm text-muted">{t('shop.categories.empty')}</div>

  const onDelete = (id: string) => {
    if (confirm(t('shop.categories.deleteConfirm'))) remove.mutate(id)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-table-header text-xs font-medium text-muted">
            <th className="px-4 py-3">{t('shop.categories.col.name')}</th>
            <th className="px-4 py-3">{t('shop.categories.col.count')}</th>
            <th className="px-4 py-3">{t('shop.categories.col.created')}</th>
            <th className="px-4 py-3">{t('shop.categories.col.status')}</th>
            <th className="px-4 py-3 text-right">{t('shop.categories.col.actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-text">
          {categories.map((cat) => (
            <tr key={cat.id} className="hover:bg-bg">
              <td className="px-4 py-3 font-medium text-text">{cat.name}</td>
              <td className="px-4 py-3 text-muted">
                {cat.productCount} {t('shop.categories.itemsSuffix')}
              </td>
              <td className="px-4 py-3 text-xs text-muted">{cat.createdAt}</td>
              <td className="px-4 py-3">
                <Badge tone={cat.isActive ? 'success' : 'gray'}>
                  {cat.isActive ? t('shop.categories.visible') : t('shop.categories.hidden')}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggle.mutate(cat.id)}
                    title={cat.isActive ? t('shop.categories.hide') : t('shop.categories.show')}
                    className="rounded-lg p-1.5 text-muted transition hover:bg-bg hover:text-text"
                  >
                    {cat.isActive ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(cat.id)}
                    title={t('shop.categories.remove')}
                    className="rounded-lg p-1.5 text-error transition hover:bg-error-bg"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
