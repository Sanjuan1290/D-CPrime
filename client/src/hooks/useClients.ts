import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import type { PaginatedResponse } from '../types'

export type ClientRecord = {
  id: number
  buyer_name: string
  spouse_co_owner_name?: string | null
  aif_administrator_name?: string | null
  email?: string | null
  contact_no?: string | null
  age?: number | null
  address?: string | null
}

export type ClientPayload = Omit<ClientRecord, 'id'>

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get<PaginatedResponse<ClientRecord>>('/clients', { params: { limit: 1000 } }),
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ClientPayload) => api.post<ClientRecord>('/clients', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['clients'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      void queryClient.invalidateQueries({ queryKey: ['balances'] })
    },
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<ClientPayload> & { id: number }) => api.patch<ClientRecord>(`/clients/${id}`, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['clients'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      void queryClient.invalidateQueries({ queryKey: ['balances'] })
    },
  })
}
