// Draft list table for Shop Decoration page — shows drafts per platform.
// Controls (PlatformToggle, tabs, banner, toggle) are in DecorationControls.tsx.
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import type { DecorationDraft, DecorationPlatform } from '../types/shop.types'

type Props = {
  drafts: DecorationDraft[]
  platform: DecorationPlatform
  onEdit: (id: string) => void
  onReplaceTemplate: (id: string) => void
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function DecorationDraftList({ drafts, onEdit, onReplaceTemplate }: Props) {
  const { t } = useTranslation()

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <span className="text-sm font-semibold text-text">{t('shop.decoration.draftList')}</span>
      </div>

      {drafts.length === 0 ? (
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6" aria-hidden="true">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2" />
            </svg>
          }
          title={t('shop.decoration.empty')}
        />
      ) : (
        <Table>
          <thead>
            <Tr>
              <Th>{t('shop.decoration.draftName')}</Th>
              <Th>{t('shop.decoration.lastUpdate')}</Th>
              <Th>{t('shop.decoration.status')}</Th>
              <Th>{t('shop.decoration.action')}</Th>
            </Tr>
          </thead>
          <tbody>
            {drafts.map((draft) => (
              <Tr key={draft.id} className="hover:bg-bg/50">
                <Td className="font-medium text-text">{draft.name}</Td>
                <Td className="text-muted">{fmtDate(draft.updatedAt)}</Td>
                <Td>
                  <Badge tone={draft.status === 'published' ? 'success' : 'gray'}>
                    {draft.status === 'published'
                      ? t('shop.decoration.statusPublished')
                      : t('shop.decoration.statusDraft')}
                  </Badge>
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(draft.id)}>
                      {t('shop.decoration.editBtn')}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onReplaceTemplate(draft.id)}>
                      {t('shop.decoration.replaceTemplate')}
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  )
}
