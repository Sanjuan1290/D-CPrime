import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import type { AuthUser, PaginatedResponse, Role } from '../types'

type QueryParams = Record<string, string | number | boolean | undefined>

function useResourceList<TRecord>(queryKey: unknown[], url: string, params?: QueryParams) {
  return useQuery({
    queryKey,
    queryFn: () => api.get<PaginatedResponse<TRecord>>(url, { params: { limit: 1000, ...params } }),
  })
}

function useCreateResource<TRecord, TPayload>(url: string, invalidateKeys: unknown[][]) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TPayload) => api.post<TRecord>(url, data),
    onSuccess: () => {
      for (const queryKey of invalidateKeys) {
        void queryClient.invalidateQueries({ queryKey })
      }
    },
  })
}

function useUpdateResource<TRecord, TPayload extends { id: number }>(url: string, invalidateKeys: unknown[][]) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: TPayload) => api.patch<TRecord>(`${url}/${id}`, data),
    onSuccess: () => {
      for (const queryKey of invalidateKeys) {
        void queryClient.invalidateQueries({ queryKey })
      }
    },
  })
}

function useDeleteResource(url: string, invalidateKeys: unknown[][]) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`${url}/${id}`),
    onSuccess: () => {
      for (const queryKey of invalidateKeys) {
        void queryClient.invalidateQueries({ queryKey })
      }
    },
  })
}

export type UserRecord = AuthUser & {
  created_at?: string
  updated_at?: string
  accreditation_date?: string | null
  last_login?: string | null
}

export type UserPayload = {
  full_name: string
  email?: string | null
  contact_no?: string | null
  role: Role
  status: 'active' | 'inactive'
  accreditation_date?: string | null
  barcode_value?: string | null
  avatar_url?: string | null
  password?: string
}

export type ClientUnitRecord = {
  id: number
  client_id: number
  listing_id: number
  reservation_id?: number | null
  assigned_agent_id?: number | null
  assigned_manager_id?: number | null
  reservation_date?: string | null
  contract_date?: string | null
  mode_of_payment: 'cash' | 'installment'
  contract_price?: number | null
  legal_misc_fee?: number | null
  total_contract_price?: number | null
  payment_terms_months?: number | null
  monthly_amortization?: number | null
  due_day?: number | null
  document_status: 'complete' | 'incomplete'
  account_status: 'active' | 'cancelled' | 'closed'
  payment_status: 'unpaid' | 'partially_paid' | 'complete_paid'
  sales_status: 'good_sale' | 'bad_sale' | 'cancelled'
  remarks?: string | null
}

export type ClientUnitPayload = Omit<ClientUnitRecord, 'id'>

export type PaymentRecord = {
  id: number
  client_unit_id: number
  payment_date: string
  amount: number
  payment_type: 'reservation' | 'downpayment' | 'monthly' | 'legal_misc' | 'full_payment' | 'other'
  payment_method?: string | null
  bank_name?: string | null
  reference_no?: string | null
  status: 'pending' | 'verified' | 'rejected'
  verified_by?: number | null
  verified_at?: string | null
  remarks?: string | null
  receipt_url?: string | null
  receipt_public_id?: string | null
}

export type PaymentPayload = Omit<PaymentRecord, 'id'>

export type PaymentScheduleRecord = {
  id: number
  client_unit_id: number
  due_date: string
  description?: string | null
  due_amount: number
  penalty?: number | null
  status: 'unpaid' | 'partial' | 'paid' | 'overdue'
}

export type PaymentSchedulePayload = Omit<PaymentScheduleRecord, 'id'>

export type ReservationRecord = {
  id: number
  client_id: number
  listing_id: number
  reserved_by: number
  reservation_fee?: number | null
  reservation_date?: string | null
  expires_at?: string | null
  status: 'pending' | 'confirmed' | 'converted' | 'cancelled' | 'expired'
  remarks?: string | null
}

export type ReservationPayload = Omit<ReservationRecord, 'id'>

export type CommissionRecord = {
  id: number
  client_unit_id: number
  user_id: number
  commission_type: 'agent' | 'manager' | 'broker'
  sale_type: 'direct' | 'distributed'
  rate: number
  gross_commission: number
  status: 'pending' | 'approved' | 'partially_released' | 'released' | 'cancelled'
  approved_by?: number | null
  approved_at?: string | null
}

export type CommissionPayload = Omit<CommissionRecord, 'id'>

export type CommissionReleaseRecord = {
  id: number
  commission_id: number
  release_stage: 'first_20' | 'second_40' | 'third_60' | 'fourth_75' | 'retention_25' | 'manual'
  release_percentage?: number | null
  gross_release_amount: number
  cash_advance_deduction?: number | null
  net_release_amount: number
  released_by: number
  released_at?: string | null
  remarks?: string | null
}

export type CommissionReleasePayload = Omit<CommissionReleaseRecord, 'id'>

export type ClientDocumentRecord = {
  id: number
  client_unit_id: number
  document_id: number
  file_url?: string | null
  file_public_id?: string | null
  status: 'not_submitted' | 'pending' | 'approved' | 'rejected'
  reviewed_by?: number | null
  reviewed_at?: string | null
}

export type ClientDocumentPayload = Omit<ClientDocumentRecord, 'id'>

export type DocumentRequirementRecord = {
  id: number
  name: string
  description?: string | null
  is_required: boolean | number
  status: 'active' | 'inactive'
}

export type DocumentRequirementPayload = Omit<DocumentRequirementRecord, 'id'>

export type SettingRecord = {
  id: number
  setting_key: string
  setting_value?: string | null
  module_group?: string | null
  updated_by?: number | null
}

export type SettingPayload = Omit<SettingRecord, 'id'>

export type LookupRecord = {
  id: number
  feature_key: string
  module_name: string
  display_name: string
}

export type LookupPayload = Omit<LookupRecord, 'id'>

export type CashAdvanceRecord = {
  id: number
  user_id: number
  client_unit_id?: number | null
  commission_id?: number | null
  amount: number
  reason?: string | null
  status: 'pending' | 'approved' | 'partially_deducted' | 'deducted' | 'disapproved'
  approved_by?: number | null
  approved_at?: string | null
}

export type CashAdvancePayload = Omit<CashAdvanceRecord, 'id'>

export type AuditLogRecord = {
  id: number
  user_id?: number | null
  action: string
  module_name?: string | null
  entity_table?: string | null
  entity_id?: number | null
  ip_address?: string | null
  created_at: string
}

export type SoaResponse = {
  clientUnit: ClientUnitRecord & {
    buyer_name: string
    unit_id: string
    project_name: string
  }
  schedule: PaymentScheduleRecord[]
  payments: PaymentRecord[]
}

const dashboardKeys = [['dashboard'], ['dashboard', 'summary']]

export function useUsers(params?: QueryParams) {
  return useResourceList<UserRecord>(['users', params], '/users', params)
}

export function useCreateUser() {
  return useCreateResource<UserRecord, UserPayload>('/users', [['users'], ['people']])
}

export function useUpdateUser() {
  return useUpdateResource<UserRecord, Partial<UserPayload> & { id: number }>('/users', [['users'], ['people']])
}

export function useDeleteUser() {
  return useDeleteResource('/users', [['users'], ['people']])
}

export function useClientUnits(params?: QueryParams) {
  return useResourceList<ClientUnitRecord>(['client-units', params], '/client-units', params)
}

export function useCreateClientUnit() {
  return useCreateResource<ClientUnitRecord, ClientUnitPayload>('/client-units', [['client-units'], ['balances'], ...dashboardKeys])
}

export function useUpdateClientUnit() {
  return useUpdateResource<ClientUnitRecord, Partial<ClientUnitPayload> & { id: number }>('/client-units', [['client-units'], ['balances'], ...dashboardKeys])
}

export function usePayments(params?: QueryParams) {
  return useResourceList<PaymentRecord>(['payments', params], '/payments', params)
}

export function useCreatePayment() {
  return useCreateResource<PaymentRecord, PaymentPayload>('/payments', [['payments'], ['balances'], ...dashboardKeys])
}

export function useUpdatePayment() {
  return useUpdateResource<PaymentRecord, Partial<PaymentPayload> & { id: number }>('/payments', [['payments'], ['balances'], ...dashboardKeys])
}

export function useReservations(params?: QueryParams) {
  return useResourceList<ReservationRecord>(['reservations', params], '/reservations', params)
}

export function useCreateReservation() {
  return useCreateResource<ReservationRecord, ReservationPayload>('/reservations', [['reservations'], ['listings'], ...dashboardKeys])
}

export function useUpdateReservation() {
  return useUpdateResource<ReservationRecord, Partial<ReservationPayload> & { id: number }>('/reservations', [['reservations'], ['listings'], ...dashboardKeys])
}

export function useCommissions(params?: QueryParams) {
  return useResourceList<CommissionRecord>(['commissions', params], '/commissions', params)
}

export function useCreateCommission() {
  return useCreateResource<CommissionRecord, CommissionPayload>('/commissions', [['commissions'], ...dashboardKeys])
}

export function useUpdateCommission() {
  return useUpdateResource<CommissionRecord, Partial<CommissionPayload> & { id: number }>('/commissions', [['commissions'], ...dashboardKeys])
}

export function useCommissionReleases(params?: QueryParams) {
  return useResourceList<CommissionReleaseRecord>(['commission-releases', params], '/commission-releases', params)
}

export function useCreateCommissionRelease() {
  return useCreateResource<CommissionReleaseRecord, CommissionReleasePayload>('/commission-releases', [['commission-releases'], ['commissions'], ...dashboardKeys])
}

export function useUpdateCommissionRelease() {
  return useUpdateResource<CommissionReleaseRecord, Partial<CommissionReleasePayload> & { id: number }>('/commission-releases', [['commission-releases'], ['commissions'], ...dashboardKeys])
}

export function useClientDocuments(params?: QueryParams) {
  return useResourceList<ClientDocumentRecord>(['client-documents', params], '/documents', params)
}

export function useCreateClientDocument() {
  return useCreateResource<ClientDocumentRecord, ClientDocumentPayload>('/documents', [['client-documents'], ...dashboardKeys])
}

export function useUpdateClientDocument() {
  return useUpdateResource<ClientDocumentRecord, Partial<ClientDocumentPayload> & { id: number }>('/documents', [['client-documents'], ...dashboardKeys])
}

export function useDocumentRequirements(params?: QueryParams) {
  return useResourceList<DocumentRequirementRecord>(['document-requirements', params], '/document-requirements', params)
}

export function useCreateDocumentRequirement() {
  return useCreateResource<DocumentRequirementRecord, DocumentRequirementPayload>('/document-requirements', [['document-requirements'], ['client-documents']])
}

export function useUpdateDocumentRequirement() {
  return useUpdateResource<DocumentRequirementRecord, Partial<DocumentRequirementPayload> & { id: number }>('/document-requirements', [['document-requirements'], ['client-documents']])
}

export function useSettings(params?: QueryParams) {
  return useResourceList<SettingRecord>(['settings', params], '/settings', params)
}

export function useCreateSetting() {
  return useCreateResource<SettingRecord, SettingPayload>('/settings', [['settings']])
}

export function useUpdateSetting() {
  return useUpdateResource<SettingRecord, Partial<SettingPayload> & { id: number }>('/settings', [['settings']])
}

export function useLookups(params?: QueryParams) {
  return useResourceList<LookupRecord>(['lookups', params], '/lookups', params)
}

export function useCreateLookup() {
  return useCreateResource<LookupRecord, LookupPayload>('/lookups', [['lookups']])
}

export function useUpdateLookup() {
  return useUpdateResource<LookupRecord, Partial<LookupPayload> & { id: number }>('/lookups', [['lookups']])
}

export function usePaymentSchedules(params?: QueryParams) {
  return useResourceList<PaymentScheduleRecord>(['payment-schedules', params], '/payment-schedules', params)
}

export function useCreatePaymentSchedule() {
  return useCreateResource<PaymentScheduleRecord, PaymentSchedulePayload>('/payment-schedules', [['payment-schedules'], ['soa'], ['balances'], ...dashboardKeys])
}

export function useUpdatePaymentSchedule() {
  return useUpdateResource<PaymentScheduleRecord, Partial<PaymentSchedulePayload> & { id: number }>('/payment-schedules', [['payment-schedules'], ['soa'], ['balances'], ...dashboardKeys])
}

export function useCashAdvances(params?: QueryParams) {
  return useResourceList<CashAdvanceRecord>(['cash-advances', params], '/cash-advances', params)
}

export function useCreateCashAdvance() {
  return useCreateResource<CashAdvanceRecord, CashAdvancePayload>('/cash-advances', [['cash-advances'], ...dashboardKeys])
}

export function useUpdateCashAdvance() {
  return useUpdateResource<CashAdvanceRecord, Partial<CashAdvancePayload> & { id: number }>('/cash-advances', [['cash-advances'], ...dashboardKeys])
}

export function useAuditLogs(params?: QueryParams) {
  return useResourceList<AuditLogRecord>(['audit-logs', params], '/audit-logs', params)
}

export function useSoa(clientUnitId?: string | number) {
  return useQuery({
    queryKey: ['soa', clientUnitId],
    queryFn: () => api.get<SoaResponse>(`/soa/${clientUnitId}`),
    enabled: Boolean(clientUnitId),
  })
}
