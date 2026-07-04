import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { FileX2, PlusCircle, Trash2, StatusBadge, categoryName, useDeleteSizeChart, useSizeCharts } from '@/features/products'

export function SizeChartManagementPage() {
  const { t } = useTranslation()
  const [draft, setDraft] = useState('')
  const [applied, setApplied] = useState('')
  const { data, isLoading } = useSizeCharts({ search: applied || undefined })
  const del = useDeleteSizeChart()
  const charts = (data?.sizeCharts ?? []).filter(
    (c) => !applied || c.name.toLowerCase().includes(applied.toLowerCase()),
  )

  return (
    <Page>
      <PageHeader title={t('products.size.title')} breadcrumb={`${t('products.home')} › ${t('products.setting.title')}`} />

      <Card className="flex flex-col gap-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-text">{t('products.size.title')}</h2>
            <p className="text-sm text-muted">{t('products.size.desc')}</p>
          </div>
          <Link to="/products/product-setting/size-chart-management/add-new-size-chart">
            <Button><PlusCircle size={16} /> {t('products.size.add')}</Button>
          </Link>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={t('products.size.searchPh')} className="w-64" />
          <Button onClick={() => setApplied(draft)}>{t('products.search')}</Button>
          <Button variant="outline" onClick={() => { setDraft(''); setApplied('') }}>{t('products.clear')}</Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          {isLoading ? (
            <div className="flex items-center justify-center p-12"><Spinner /></div>
          ) : charts.length === 0 ? (
            <EmptyState icon={<FileX2 size={32} />} title={t('products.size.noData')} />
          ) : (
            <Table>
              <thead>
                <Tr>
                  <Th>{t('products.size.name')}</Th>
                  <Th>{t('products.size.virtualCategory')}</Th>
                  <Th>{t('products.size.system')}</Th>
                  <Th>{t('products.size.rows')}</Th>
                  <Th>{t('products.size.linked')}</Th>
                  <Th>{t('products.col.status')}</Th>
                  <Th></Th>
                </Tr>
              </thead>
              <tbody>
                {charts.map((c) => (
                  <Tr key={c.id}>
                    <Td className="font-medium">{c.name}</Td>
                    <Td className="text-xs text-muted">{categoryName(c.templateName)}</Td>
                    <Td className="text-xs"><Badge tone="info">{c.sizeSystemCode}</Badge></Td>
                    <Td className="text-xs text-muted">{c.rowCount}</Td>
                    <Td className="text-xs text-muted">{c.linkedProducts}</Td>
                    <Td><StatusBadge kind="size" status={c.status} /></Td>
                    <Td>
                      <button
                        type="button"
                        onClick={() => { if (confirm(t('products.size.confirmDelete'))) del.mutate(c.id) }}
                        className="text-muted hover:text-error"
                        aria-label="delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Card>
    </Page>
  )
}
