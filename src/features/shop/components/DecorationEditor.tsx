import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { DecorationLibrary } from './DecorationLibrary'
import { DecorationBlockList } from './DecorationBlockList'
import { DecorationPreview } from './DecorationPreview'
import { useSaveDecoration } from '../api/shop.queries'
import type { BlockType, DecorationBlock } from '../types/shop.types'

export function DecorationEditor({ initial }: { initial: DecorationBlock[] }) {
  const { t } = useTranslation()
  const save = useSaveDecoration()
  const [blocks, setBlocks] = useState<DecorationBlock[]>(initial)

  const addBlock = (type: BlockType) => {
    const block: DecorationBlock = {
      id: crypto.randomUUID(),
      type,
      title: t(`shop.decoration.types.${type}.name`),
      description: t(`shop.decoration.types.${type}.hint`),
    }
    setBlocks((prev) => [...prev, block])
  }

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= blocks.length) return
    setBlocks((prev) => {
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const remove = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('shop.decoration.title')}
        subtitle={t('shop.decoration.subtitle')}
        actions={
          <>
            <Button variant="outline">{t('shop.decoration.preview')}</Button>
            <Button onClick={() => save.mutate(blocks)} disabled={save.isPending}>
              {save.isPending ? t('shop.decoration.saving') : t('shop.decoration.save')}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <DecorationLibrary onAdd={addBlock} />
        <DecorationBlockList blocks={blocks} onMove={move} onRemove={remove} />
        <DecorationPreview blocks={blocks} />
      </div>
    </div>
  )
}
