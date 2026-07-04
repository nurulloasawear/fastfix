import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Table, Th, Tr, Td } from '@/components/ui/Table'
import type { NfrAffectedOrder } from '../types/account-health.types'

type Props = { orders: NfrAffectedOrder[] }

export function NfrAffectedOrdersTable({ orders }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Card className="overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-bg">
        <h3 className="text-sm font-semibold text-text">
          {t('accountHealth.nfr.affectedOrders')} ({orders.length})
        </h3>
      </div>

      {orders.length === 0 ? (
        <EmptyState title={t('accountHealth.nfr.emptyOrders')} />
      ) : (
        <Table>
          <thead>
            <Tr>
              <Th>{t('accountHealth.nfr.colOrderId')}</Th>
              <Th>{t('accountHealth.nfr.colNfrType')}</Th>
              <Th>{t('accountHealth.nfr.colReason')}</Th>
              <Th>{t('accountHealth.nfr.colShippingChannel')}</Th>
              <Th>{t('accountHealth.nfr.colAction')}</Th>
            </Tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <Tr key={order.orderId} className="hover:bg-bg/50 transition-colors">
                <Td className="font-mono text-xs text-text">{order.orderId}</Td>
                <Td className="text-text-secondary">{order.type}</Td>
                <Td className="text-text-secondary">{order.reason}</Td>
                <Td className="text-text-secondary">{order.shippingChannel}</Td>
                <Td>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-brand hover:underline px-0 h-auto"
                    onClick={() => navigate(`/orders/${order.orderId}`)}
                  >
                    {t('accountHealth.nfr.view')}
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  )
}
