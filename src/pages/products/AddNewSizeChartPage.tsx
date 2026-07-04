import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
import { FormField, TextField, Trash2, categoryName, useCreateSizeChart, useSizeTemplates } from '@/features/products'
import type { SaveSizeChartInput, SizeTemplate } from '@/features/products'

const NAME_MAX = 50
type Cells = Record<string, { min: string; max: string }>
type Row = { id: string; sizeLabel: string; cells: Cells }

let rowSeq = 0
const blankRow = (): Row => ({ id: `r${++rowSeq}`, sizeLabel: '', cells: {} })

export function AddNewSizeChartPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const create = useCreateSizeChart()
  const back = () => navigate('/products/product-setting/size-chart-management')
  const { data: templates = [], isLoading } = useSizeTemplates()

  const [templateId, setTemplateId] = useState('')
  const [name, setName] = useState('')
  const [system, setSystem] = useState('')
  const [unit, setUnit] = useState<'cm' | 'in'>('cm')
  const [measures, setMeasures] = useState<string[]>([]) // selected attribute slugs
  const [rangeCols, setRangeCols] = useState<string[]>([]) // attr slugs shown as min–max
  const [rows, setRows] = useState<Row[]>([blankRow()])
  const [error, setError] = useState<string | null>(null)

  const tpl: SizeTemplate | undefined = useMemo(
    () => templates.find((x) => x.id === templateId),
    [templates, templateId],
  )

  function pickTemplate(id: string) {
    const next = templates.find((x) => x.id === id)
    setTemplateId(id)
    setSystem(next?.defaultSystemCode || next?.sizeSystemCodes[0] || '')
    setMeasures(next?.measurementSlugs ?? [])
    setRangeCols([])
    setRows([blankRow()])
  }

  const toggle = (list: string[], v: string) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v]

  const setCell = (rowId: string, slug: string, k: 'min' | 'max', val: string) =>
    setRows((cur) =>
      cur.map((r) =>
        r.id === rowId ? { ...r, cells: { ...r.cells, [slug]: { ...{ min: '', max: '' }, ...r.cells[slug], [k]: val } } } : r,
      ),
    )

  // measurement columns the seller chose to fill (in template order)
  const cols = useMemo(
    () => (tpl ? tpl.measurements.filter((m) => measures.includes(m.slug)) : []),
    [tpl, measures],
  )

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (!tpl || !name.trim() || !system) {
      setError(t('products.size.valBasics'))
      return
    }
    const payloadRows: SaveSizeChartInput['rows'] = rows
      .filter((r) => r.sizeLabel.trim())
      .map((r) => ({
        sizeLabel: r.sizeLabel.trim(),
        cells: cols
          .filter((c) => r.cells[c.slug]?.min)
          .map((c) => ({
            attributeSlug: c.slug,
            valueMin: Number(r.cells[c.slug].min),
            valueMax: rangeCols.includes(c.slug) && r.cells[c.slug].max ? Number(r.cells[c.slug].max) : null,
          })),
      }))
    if (payloadRows.length === 0) {
      setError(t('products.size.valRows'))
      return
    }
    if (create.isPending) return
    await create.mutateAsync({ templateId, name: name.trim(), sizeSystemCode: system, displayUnit: unit, rows: payloadRows })
    back()
  }

  const chk = 'flex items-center gap-2 text-sm text-text'

  return (
    <Page>
      <PageHeader
        title={t('products.size.newTitle')}
        breadcrumb={`${t('products.home')} › ${t('products.setting.title')} › ${t('products.size.newTitle')}`}
      />
      <Card className="flex flex-col gap-5 p-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField label={`* ${t('products.size.virtualCategory')}`}>
              <Select value={templateId} onChange={(e) => pickTemplate(e.target.value)} disabled={isLoading}>
                <option value="">{t('products.add_page.choose')}</option>
                {templates.map((x) => (
                  <option key={x.id} value={x.id}>{categoryName(x.name)}</option>
                ))}
              </Select>
            </FormField>
            <div>
              <FormField label={`* ${t('products.size.chartName')}`}>
                <TextField value={name} maxLength={NAME_MAX} onChange={(e) => setName(e.target.value)} placeholder={t('products.size.chartName')} />
              </FormField>
              <p className="mt-1 text-right text-xs text-muted">{name.length}/{NAME_MAX}</p>
            </div>
          </div>

          {tpl && (
            <>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-text-secondary">* {t('products.size.markSizes')}</span>
                <div className="flex flex-wrap gap-4">
                  {tpl.sizeSystems.filter((s) => s.isLabelSystem).map((s) => (
                    <label key={s.code} className={chk}>
                      <input type="radio" name="sysmsystem" className="accent-brand" checked={system === s.code} onChange={() => setSystem(s.code)} />
                      {categoryName(s.name)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-text-secondary">{t('products.size.markOthers')}</span>
                <div className="flex flex-wrap gap-4">
                  {tpl.measurements.map((m) => (
                    <label key={m.slug} className={chk} title={categoryName(m.howTo)}>
                      <input type="checkbox" className="accent-brand" checked={measures.includes(m.slug)} onChange={() => setMeasures((c) => toggle(c, m.slug))} />
                      {categoryName(m.name)}
                    </label>
                  ))}
                </div>
              </div>

              <Select label={t('products.size.unit')} className="w-32" value={unit} onChange={(e) => setUnit(e.target.value as 'cm' | 'in')}>
                <option value="cm">CM</option>
                <option value="in">IN</option>
              </Select>

              {/* dynamic table */}
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-bg text-text-secondary">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">{t('products.size.sizeCol')}</th>
                      {cols.map((c) => (
                        <th key={c.slug} className="px-3 py-2 text-left font-semibold">
                          <div className="flex flex-col gap-1">
                            <span>{categoryName(c.name)} ({unit})</span>
                            <button type="button" onClick={() => setRangeCols((cur) => toggle(cur, c.slug))} className="self-start text-xs font-normal text-brand">
                              {rangeCols.includes(c.slug) ? t('products.size.range') : t('products.size.single')}
                            </button>
                          </div>
                        </th>
                      ))}
                      <th className="w-12 px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className="border-t border-border">
                        <td className="px-3 py-2">
                          <TextField value={r.sizeLabel} onChange={(e) => setRows((cur) => cur.map((x) => (x.id === r.id ? { ...x, sizeLabel: e.target.value } : x)))} placeholder={t('products.size.sizeCol')} className="!h-9" />
                        </td>
                        {cols.map((c) => (
                          <td key={c.slug} className="px-3 py-2">
                            <div className="flex items-center gap-1">
                              <TextField type="number" value={r.cells[c.slug]?.min ?? ''} onChange={(e) => setCell(r.id, c.slug, 'min', e.target.value)} placeholder="0" className="!h-9 w-20" />
                              {rangeCols.includes(c.slug) && (
                                <>
                                  <span className="text-muted">–</span>
                                  <TextField type="number" value={r.cells[c.slug]?.max ?? ''} onChange={(e) => setCell(r.id, c.slug, 'max', e.target.value)} placeholder="0" className="!h-9 w-20" />
                                </>
                              )}
                            </div>
                          </td>
                        ))}
                        <td className="px-3 py-2 text-center">
                          <button type="button" onClick={() => setRows((cur) => (cur.length === 1 ? cur : cur.filter((x) => x.id !== r.id)))} className="text-muted hover:text-error">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" onClick={() => setRows((cur) => [...cur, blankRow()])} className="w-full border-t border-border px-3 py-2 text-left text-sm font-medium text-brand hover:bg-surface-hover">
                  + {t('products.size.addRow')}
                </button>
              </div>

              <p className="text-xs text-muted">{t('products.size.linkHint')}</p>
            </>
          )}

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={back}>{t('products.size.cancel')}</Button>
            <Button type="submit" disabled={!tpl || create.isPending}>
              {create.isPending ? t('products.size.saving') : t('products.size.save')}
            </Button>
          </div>
        </form>
      </Card>
    </Page>
  )
}
