export type Role = 'owner' | 'admin' | 'manager' | 'treasury' | 'broker' | 'agent' | 'client'

export type FeatureKey =
  | 'dashboard'
  | 'projects'
  | 'listings'
  | 'reservations'
  | 'clients_view'
  | 'clients_manage'
  | 'payments_view'
  | 'payments_record'
  | 'payments_verify'
  | 'commissions_view'
  | 'commissions_approve'
  | 'commissions_release'
  | 'cash_advances_view'
  | 'cash_advances_manage'
  | 'documents_view'
  | 'documents_upload'
  | 'documents_approve'
  | 'soa_view'
  | 'balances_view'
  | 'reports_view'
  | 'audit_logs_view'
  | 'user_management'
  | 'settings'
  | 'lookups'
  | 'attendance'

export type AuthUser = {
  id: number
  full_name: string
  fullName?: string
  email: string | null
  contact_no?: string | null
  contactNo?: string | null
  role: Role
  status: 'active' | 'inactive'
  barcode_value?: string | null
  barcodeValue?: string | null
  avatar_url?: string | null
  avatarUrl?: string | null
  permissions?: Partial<Record<FeatureKey, boolean>>
}

export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type AttendanceType = 'time_in' | 'time_out'

export type AttendanceLog = {
  id: number
  user_id: number
  userId?: number
  barcode_value: string
  barcodeValue?: string
  type: AttendanceType
  scanned_at: string
  scannedAt?: string
  edited_by?: number | null
  editedBy?: number | null
  edited_at?: string | null
  editedAt?: string | null
  original_time?: string | null
  originalTime?: string | null
  notes?: string | null
  user?: AuthUser | null
}
