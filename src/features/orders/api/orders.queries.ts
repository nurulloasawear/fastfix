import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addOrderNote, approveReturn, bulkArrangeOrders, bulkArrangeShipment,
  bulkShipOrders, exportOrders, exportReturns, generateDocuments,
  getMassShipOrders, getOrderDetails, getOrders, getOrderTimeline,
  getReturnDetail, getReturnRequests, inspectReturnProduct, massShipOrders,
  rejectReturn, replyToReturn, retrieveReturnParcel, submitReturnDispute,
  submitReturnEvidence,
} from './orders.api'
import type {
  MassShipQuery, OrderListQuery, ReturnListQuery,
} from '../types/orders.types'

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (q: OrderListQuery) => [...orderKeys.lists(), q] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  timeline: (id: string) => [...orderKeys.all, 'timeline', id] as const,
  massShip: (q: MassShipQuery) => [...orderKeys.all, 'mass-ship', q] as const,
  returns: (q: ReturnListQuery) => [...orderKeys.all, 'returns', q] as const,
  returnDetail: (id: string) => [...orderKeys.all, 'return-detail', id] as const,
}

export function useOrders(query: OrderListQuery) {
  return useQuery({ queryKey: orderKeys.list(query), queryFn: () => getOrders(query) })
}

export function useOrderDetails(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrderDetails(id),
    enabled: Boolean(id),
  })
}

export function useOrderTimeline(id: string) {
  return useQuery({
    queryKey: orderKeys.timeline(id),
    queryFn: () => getOrderTimeline(id),
    enabled: Boolean(id),
  })
}

export function useMassShipOrders(query: MassShipQuery) {
  return useQuery({ queryKey: orderKeys.massShip(query), queryFn: () => getMassShipOrders(query) })
}

export function useReturnRequests(query: ReturnListQuery) {
  return useQuery({ queryKey: orderKeys.returns(query), queryFn: () => getReturnRequests(query) })
}

export function useReturnDetail(id: string) {
  return useQuery({
    queryKey: orderKeys.returnDetail(id),
    queryFn: () => getReturnDetail(id),
    enabled: Boolean(id),
  })
}

export function useAddOrderNote(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (text: string) => addOrderNote(id, text),
    onSuccess: () => void qc.invalidateQueries({ queryKey: orderKeys.detail(id) }),
  })
}

export function useBulkArrange() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ orderIds, method }: { orderIds: string[]; method: 'dropoff' | 'pickup' }) =>
      bulkArrangeShipment(orderIds, method),
    onSuccess: () => void qc.invalidateQueries({ queryKey: orderKeys.all }),
  })
}

// Inline bulk actions on the My Orders list (ORD-006).
export function useBulkShip() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (orderIds: string[]) => bulkShipOrders(orderIds),
    onSuccess: () => void qc.invalidateQueries({ queryKey: orderKeys.all }),
  })
}

export function useBulkArrangeOrders() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ orderIds, courier }: { orderIds: string[]; courier?: string }) =>
      bulkArrangeOrders(orderIds, courier),
    onSuccess: () => void qc.invalidateQueries({ queryKey: orderKeys.all }),
  })
}

export function useGenerateDocuments() {
  return useMutation({
    mutationFn: ({ orderIds, types }: { orderIds: string[]; types: string[] }) =>
      generateDocuments(orderIds, types),
  })
}

export function useExportOrders() {
  return useMutation({ mutationFn: (status?: string) => exportOrders(status) })
}

export function useSubmitReturnDispute(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ disputeText, evidenceUrls }: { disputeText: string; evidenceUrls: string[] }) =>
      submitReturnDispute(id, disputeText, evidenceUrls),
    onSuccess: () => void qc.invalidateQueries({ queryKey: orderKeys.returnDetail(id) }),
  })
}

export function useApproveReturn(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => approveReturn(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: orderKeys.all }),
  })
}

export function useRejectReturn(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (note: string) => rejectReturn(id, note),
    onSuccess: () => void qc.invalidateQueries({ queryKey: orderKeys.all }),
  })
}

// Return key-actions (Wave 6) — reply / evidence / retrieve parcel / inspect.
function useReturnAction<V>(id: string, fn: (v: V) => Promise<void>) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => void qc.invalidateQueries({ queryKey: orderKeys.returnDetail(id) }),
  })
}

export function useReplyToReturn(id: string) {
  return useReturnAction<string>(id, (message) => replyToReturn(id, message))
}
export function useSubmitReturnEvidence(id: string) {
  return useReturnAction<string[]>(id, (urls) => submitReturnEvidence(id, urls))
}
export function useRetrieveReturnParcel(id: string) {
  return useReturnAction<void>(id, () => retrieveReturnParcel(id))
}
export function useInspectReturnProduct(id: string) {
  return useReturnAction<{ result: string; note?: string }>(id, ({ result, note }) => inspectReturnProduct(id, result, note))
}

export function useExportReturns() {
  return useMutation({ mutationFn: (status?: string) => exportReturns(status) })
}

// Backward-compat — used by existing pages
export function useMassShip() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (orderIds: string[]) => massShipOrders(orderIds),
    onSuccess: () => void qc.invalidateQueries({ queryKey: orderKeys.lists() }),
  })
}
