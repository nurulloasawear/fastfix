// PUBLIC API of the shipment feature. Pages import ONLY from here
// (`@/features/shipment`) — never a deep path. ESLint enforces this.
export {
  shipmentKeys,
  useShipments,
  useShipOrder,
  useDeliverOrder,
  useMassShipOrders,
  useMassShip,
  useShippingSettings,
  useUpdateShippingSettings,
  // New — wired to live backend
  useShipmentJob,
  useToggleShippingChannel,
  useGenerateDocuments,
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useUpdateAddressSettings,
  useOperatingHours,
  useUpdateOperatingHours,
  useShopSettings,
  useUpdateShopSettings,
  useExportOrders,
  useExportHistory,
  useReturnFeeCoverage,
  useNonFulfilmentRate,
} from './api/shipment.queries'
export { shipmentHandlers } from './api/shipment.mocks'
export { useShipmentUi } from './stores/shipment.store'
export { shipmentMessages } from './i18n'

export { ShipmentStatusTabs } from './components/ShipmentStatusTabs'
export { ShipmentStatusBadge } from './components/ShipmentStatusBadge'
export { ShipmentSearch } from './components/ShipmentSearch'
export { ShipmentTable } from './components/ShipmentTable'
export { MassShipTable } from './components/MassShipTable'
export { MassShipToolbar } from './components/MassShipToolbar'
export { ShippingSettingsForm } from './components/ShippingSettingsForm'

export type {
  Shipment,
  ShipmentStatus,
  ShipmentStatusFilter,
  ShipmentSummary,
  ShipmentListQuery,
  ShipmentListResponse,
  MassShipOrder,
  MassShipAction,
  MassShipRequest,
  MassShipResponse,
  CourierIntegration,
  ShippingSettings,
} from './types/shipment.types'
export type {
  SellerAddress,
  SellerAddressInput,
  SellerAddressesResponse,
  OperatingHourDay,
  OperatingHoursResponse,
  ShopSettings,
  ExportHistoryEntry,
  ExportHistoryResponse,
  ReturnFeeCoverageResponse,
  NonFulfilmentRateResponse,
  ChannelToggleResponse,
} from './api/shipment.api'
