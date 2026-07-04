import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import type { BrandStatus, ProductStatus, SizeChartStatus } from '../types/products.types'

type Tone = 'gray' | 'brand' | 'success' | 'error' | 'warning' | 'info'

const PRODUCT_TONE: Record<ProductStatus, Tone> = {
  live: 'success',
  under_review: 'warning',
  banned: 'error',
  deboosted: 'warning',
  admin_deleted: 'gray',
  delisted: 'gray',
  draft: 'gray',
}

const BRAND_TONE: Record<BrandStatus, Tone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  blacklisted: 'gray',
}

const SIZE_TONE: Record<SizeChartStatus, Tone> = {
  active: 'success',
  archived: 'gray',
}

type Props =
  | { kind: 'product'; status: ProductStatus }
  | { kind: 'brand'; status: BrandStatus }
  | { kind: 'size'; status: SizeChartStatus }

export function StatusBadge(props: Props) {
  const { t } = useTranslation()
  let tone: Tone
  let label: string

  if (props.kind === 'product') {
    tone = PRODUCT_TONE[props.status]
    // Map new status values to i18n keys
    const keyMap: Record<ProductStatus, string> = {
      live: 'live',
      under_review: 'reviewing',
      banned: 'violation',
      deboosted: 'violation',
      admin_deleted: 'violation',
      delisted: 'delisted',
      draft: 'sold_out',
    }
    label = t(`products.status.${keyMap[props.status]}`)
  } else if (props.kind === 'brand') {
    tone = BRAND_TONE[props.status]
    label = t(`products.brand.st.${props.status}`)
  } else {
    tone = SIZE_TONE[props.status]
    label = t(`products.size.st.${props.status}`)
  }

  return <Badge tone={tone}>{label}</Badge>
}
