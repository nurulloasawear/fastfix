import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAddress,
  deleteAddress,
  deliverOrder,
  exportOrders,
  generateDocuments,
  getAddresses,
  getExportHistory,
  getMassShipOrders,
  getNonFulfilmentRate,
  getOperatingHours,
  getReturnFeeCoverage,
  getShipmentJob,
  getShipments,
  getShippingSettings,
  getShopSettings,
  massShip,
  shipOrder,
  toggleShippingChannel,
  updateAddress,
  updateAddressSettings,
  updateOperatingHours,
  updateShippingSettings,
  updateShopSettings,
} from './shipment.api'
import type {
  MassShipRequest,
  ShipmentListQuery,
  ShippingSettings,
} from '../types/shipment.types'
import type {
  OperatingHourDay,
  SellerAddressInput,
  ShopSettings,
} from './shipment.api'

// ---------------------------------------------------------------------------
// Query keys — structured for cache, dedupe, and targeted invalidation
// ---------------------------------------------------------------------------
export const shipmentKeys = {
  all: ['shipment'] as const,
  lists: () => [...shipmentKeys.all, 'list'] as const,
  list: (query: ShipmentListQuery) => [...shipmentKeys.lists(), query] as const,
  massShip: () => [...shipmentKeys.all, 'mass-ship'] as const,
  settings: () => [...shipmentKeys.all, 'settings'] as const,
  // New keys
  job: (jobId: string) => [...shipmentKeys.all, 'job', jobId] as const,
  channels: () => [...shipmentKeys.all, 'channels'] as const,
  addresses: () => [...shipmentKeys.all, 'addresses'] as const,
  operatingHours: () => [...shipmentKeys.all, 'operating-hours'] as const,
  shopSettings: () => [...shipmentKeys.all, 'shop-settings'] as const,
  exportHistory: () => [...shipmentKeys.all, 'export-history'] as const,
  returnFeeCoverage: () => [...shipmentKeys.all, 'return-fee-coverage'] as const,
  nonFulfilmentRate: () => [...shipmentKeys.all, 'non-fulfilment-rate'] as const,
}

// ---------------------------------------------------------------------------
// Existing hooks (kept for backward compat — no interface change)
// ---------------------------------------------------------------------------

export function useShipments(query: ShipmentListQuery) {
  return useQuery({
    queryKey: shipmentKeys.list(query),
    queryFn: () => getShipments(query),
  })
}

export function useShipOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (orderId: string) => shipOrder(orderId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: shipmentKeys.lists() })
    },
  })
}

export function useDeliverOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (orderId: string) => deliverOrder(orderId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: shipmentKeys.lists() })
    },
  })
}

export function useMassShipOrders() {
  return useQuery({
    queryKey: shipmentKeys.massShip(),
    queryFn: getMassShipOrders,
  })
}

export function useMassShip() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: MassShipRequest) => massShip(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: shipmentKeys.massShip() })
    },
  })
}

/**
 * Fetches shipping channels (live) + first pickup address to populate
 * the legacy ShippingSettings shape the ShippingSettingsForm expects.
 */
export function useShippingSettings() {
  return useQuery({
    queryKey: shipmentKeys.settings(),
    queryFn: getShippingSettings,
  })
}

export function useUpdateShippingSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: ShippingSettings) => updateShippingSettings(input),
    onSuccess: (settings) => {
      qc.setQueryData(shipmentKeys.settings(), settings)
    },
  })
}

// ---------------------------------------------------------------------------
// New hooks — wired to live endpoints
// ---------------------------------------------------------------------------

/** Poll a bulk mass-ship job by job_id. */
export function useShipmentJob(jobId: string | null) {
  return useQuery({
    queryKey: shipmentKeys.job(jobId ?? ''),
    queryFn: () => getShipmentJob(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = (query.state.data as { status?: string } | undefined)?.status
      return status === 'processing' ? 2000 : false
    },
  })
}

/** Toggle a shipping channel on/off. Invalidates settings cache. */
export function useToggleShippingChannel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ channelId, enabled }: { channelId: string; enabled: boolean }) =>
      toggleShippingChannel(channelId, enabled),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: shipmentKeys.settings() })
    },
  })
}

/** Generate shipping documents for a set of orders. */
export function useGenerateDocuments() {
  return useMutation({
    mutationFn: generateDocuments,
  })
}

/** List seller pickup / return addresses. */
export function useAddresses() {
  return useQuery({
    queryKey: shipmentKeys.addresses(),
    queryFn: getAddresses,
  })
}

/** Add a new seller address. */
export function useCreateAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: SellerAddressInput) => createAddress(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: shipmentKeys.addresses() })
    },
  })
}

/** Update an existing seller address. */
export function useUpdateAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: SellerAddressInput }) =>
      updateAddress(id, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: shipmentKeys.addresses() })
    },
  })
}

/** Delete a seller address. */
export function useDeleteAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: shipmentKeys.addresses() })
    },
  })
}

/** Toggle show_full_pickup_address. */
export function useUpdateAddressSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (showFullPickupAddress: boolean) => updateAddressSettings(showFullPickupAddress),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: shipmentKeys.addresses() })
      void qc.invalidateQueries({ queryKey: shipmentKeys.shopSettings() })
    },
  })
}

/** Read operating hours schedule. */
export function useOperatingHours() {
  return useQuery({
    queryKey: shipmentKeys.operatingHours(),
    queryFn: getOperatingHours,
  })
}

/** Update operating hours schedule. */
export function useUpdateOperatingHours() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (schedule: OperatingHourDay[]) => updateOperatingHours(schedule),
    onSuccess: (data) => {
      qc.setQueryData(shipmentKeys.operatingHours(), data)
    },
  })
}

/** Read shop settings (thermal printing, pickup visibility, auto-confirm days). */
export function useShopSettings() {
  return useQuery({
    queryKey: shipmentKeys.shopSettings(),
    queryFn: getShopSettings,
  })
}

/** Partially update shop settings. */
export function useUpdateShopSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (patch: Partial<ShopSettings>) => updateShopSettings(patch),
    onSuccess: (settings) => {
      qc.setQueryData(shipmentKeys.shopSettings(), settings)
    },
  })
}

/** Download orders as CSV Blob. */
export function useExportOrders() {
  return useMutation({
    mutationFn: (params?: Parameters<typeof exportOrders>[0]) => exportOrders(params),
  })
}

/** List previous order export jobs. */
export function useExportHistory() {
  return useQuery({
    queryKey: shipmentKeys.exportHistory(),
    queryFn: getExportHistory,
  })
}

/** Return-fee coverage summary. */
export function useReturnFeeCoverage() {
  return useQuery({
    queryKey: shipmentKeys.returnFeeCoverage(),
    queryFn: getReturnFeeCoverage,
  })
}

/** Seller non-fulfilment rate KPI. */
export function useNonFulfilmentRate() {
  return useQuery({
    queryKey: shipmentKeys.nonFulfilmentRate(),
    queryFn: getNonFulfilmentRate,
  })
}
