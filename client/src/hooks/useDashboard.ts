import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export type DashboardSummary = {
  metrics: {
    clients: number
    listings: number
    availableListings: number
    verifiedCollections: number
    pendingPayments: number
    activeReservations: number
    totalSales: number
    activeSales: number
    totalPaid: number
    totalBalance: number
    totalListedValue: number
    availableValue: number
    soldValue: number
    reservedValue: number
    pendingDocuments: number
    commissionPayable: number
    commissionReleased: number
    commissionRemaining: number
  }
  lotStatusData: Array<{
    name: string
    count: number
    value: number
  }>
  agentPerformance: Array<{
    agent: string
    totalSales: number
    active: number
    cancelled: number
    net: number
  }>
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => api.get<DashboardSummary>('/dashboard/summary'),
  })
}
