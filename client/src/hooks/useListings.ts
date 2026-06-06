import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import type { PaginatedResponse } from '../types'

export type ListingRecord = {
  id: number
  project_id: number
  cadastral_lot_no?: string | null
  administrator_group?: string | null
  unit_id: string
  reloc_unit_id?: string | null
  lot_type?: string | null
  lot_area_sqm?: number | null
  new_area_sqm?: number | null
  price_per_sqm?: number | null
  net_selling_price?: number | null
  legal_misc_rate?: number | null
  legal_misc_fee?: number | null
  total_contract_price?: number | null
  reservation_fee?: number | null
  promo_discount?: number | null
  status: 'available' | 'reserved' | 'hold' | 'sold' | 'inactive'
}

export type ListingPayload = Omit<ListingRecord, 'id'>

export function useListings() {
  return useQuery({
    queryKey: ['listings'],
    queryFn: () => api.get<PaginatedResponse<ListingRecord>>('/listings', { params: { limit: 1000 } }),
  })
}

export function useCreateListing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ListingPayload) => api.post<ListingRecord>('/listings', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['listings'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      void queryClient.invalidateQueries({ queryKey: ['balances'] })
    },
  })
}

export function useUpdateListing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<ListingPayload> & { id: number }) => api.patch<ListingRecord>(`/listings/${id}`, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['listings'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      void queryClient.invalidateQueries({ queryKey: ['balances'] })
    },
  })
}
