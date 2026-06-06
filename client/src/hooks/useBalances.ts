import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import type { PaginatedResponse } from '../types'

export type BalanceRecord = {
  client_unit_id: number
  buyer_name: string
  unit_id: string
  project_name: string
  total_contract_price: number
  total_paid: number
  balance: number
  mode_of_payment: string
  payment_status: string
  account_status: string
}

export function useBalances() {
  return useQuery({
    queryKey: ['balances'],
    queryFn: () => api.get<PaginatedResponse<BalanceRecord>>('/balances', { params: { limit: 1000 } }),
  })
}
