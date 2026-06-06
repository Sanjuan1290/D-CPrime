export type Role = 'owner' | 'admin' | 'treasury' | 'broker' | 'manager' | 'agent' | 'client'
export type UserStatus = 'Active' | 'Inactive'
export type FeatureKey = keyof typeof featureLabels

export const mockDataVersion = 'compact-relational-v1'

export const mockStorageKeys = {
  clients: 'dcprime_mockdb_clients',
  clientUnits: 'dcprime_mockdb_client_units',
  clientUnitDocuments: 'dcprime_mockdb_client_unit_documents',
  clientUnitSellers: 'dcprime_mockdb_client_unit_sellers',
  listings: 'dcprime_mockdb_listings',
  reservations: 'dcprime_mockdb_reservations',
  auditLogs: 'dcprime_mockdb_audit_logs',
  documentRequirements: 'dcprime_document_requirements',
  clientDocuments: 'dcprime_client_documents',
  lookups: 'dcprime_lookup_tables',
  settings: 'dcprime_mockdb_settings',
  paymentTracker: 'dcprime_payment_tracker',
  commissionTracker: 'dcprime_commission_tracker',
  paymentSchedules: 'dcprime_mockdb_payment_schedules',
} as const

export function readMockStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage === 'undefined') return fallback
    const stored = localStorage.getItem(key)
    if (!stored) return fallback
    return JSON.parse(stored) as T
  } catch {
    return fallback
  }
}

export function writeMockStorage<T>(key: string, value: T) {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return undefined
  }
}

export function ensureMockDataVersion() {
  if (typeof localStorage === 'undefined') return

  const versionKey = 'dcprime_data_version'
  if (localStorage.getItem(versionKey) === mockDataVersion) return

  ;[
    'dcprime_clients',
    'dcprime_listings',
    'dcprime_projects',
    'dcprime_commission_rules',
    'dcprime_users',
    'dcprime_people_agents',
    'dcprime_people_brokers',
    'dcprime_people_employees',
    'dcprime_payment_details_v2',
    'dcprime_cash_advances',
    'dcprime_cash_advance_deductions',
    'dcprime_commission_releases',
    ...Object.values(mockStorageKeys),
  ].forEach((key) => localStorage.removeItem(key))
  localStorage.setItem(versionKey, mockDataVersion)
}

export const company = {
  name: 'D&C Prime Realty',
  address: 'Mataas na Lupa, Indang, Cavite, 4122 Philippines',
  phone: '(046) 866-0616',
  propertyAddress: 'Brgy. Kaytitinga, Alfonso, Cavite',
  preparedBy: 'KIRSTEN JHOYCE A. RIOJA',
  preparedByPosition: 'Administration Head',
}

export const featureLabels = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  listings: 'Listings',
  reservations: 'Reservations',
  clients_view: 'Clients: View',
  clients_manage: 'Clients: Manage',
  payments_view: 'Payments: View',
  payments_record: 'Payments: Record',
  payments_verify: 'Payments: Verify',
  commissions_view: 'Commissions: View',
  commissions_approve: 'Commissions: Approve',
  commissions_release: 'Commissions: Release',
  cash_advances_view: 'Cash Advances: View',
  cash_advances_manage: 'Cash Advances: Manage',
  documents_view: 'Documents: View',
  documents_upload: 'Documents: Upload',
  documents_approve: 'Documents: Approve',
  soa_view: 'SOA: View',
  balances_view: 'Balances',
  reports_view: 'Reports',
  audit_logs_view: 'Audit Logs: View',
  user_management: 'User Management',
  settings: 'Settings',
  lookups: 'Lookup Tables',
}

export const featureKeys = Object.keys(featureLabels) as FeatureKey[]

const allOff = Object.fromEntries(featureKeys.map((key) => [key, false])) as Record<FeatureKey, boolean>
const allOn = Object.fromEntries(featureKeys.map((key) => [key, true])) as Record<FeatureKey, boolean>

export const rolePresets: Record<Exclude<Role, 'owner' | 'admin'>, Record<FeatureKey, boolean>> = {
  treasury: {
    ...allOff,
    dashboard: true,
    clients_view: true,
    payments_view: true,
    payments_record: true,
    payments_verify: true,
    commissions_view: true,
    commissions_approve: true,
    commissions_release: true,
    cash_advances_view: true,
    cash_advances_manage: true,
    documents_view: true,
    documents_approve: true,
    soa_view: true,
    balances_view: true,
    reports_view: true,
  },
  broker: {
    ...allOff,
    dashboard: true,
    listings: true,
    reservations: true,
    clients_view: true,
    payments_view: true,
    commissions_view: true,
    cash_advances_view: true,
    documents_view: true,
    soa_view: true,
    balances_view: true,
  },
  manager: {
    ...allOff,
    dashboard: true,
    projects: true,
    listings: true,
    reservations: true,
    clients_view: true,
    clients_manage: true,
    payments_view: true,
    commissions_view: true,
    commissions_approve: true,
    cash_advances_view: true,
    documents_view: true,
    documents_approve: true,
    soa_view: true,
    balances_view: true,
    reports_view: true,
  },
  agent: {
    ...allOff,
    dashboard: true,
    listings: true,
    reservations: true,
    clients_view: true,
    payments_view: true,
    commissions_view: true,
    cash_advances_view: true,
    documents_view: true,
    documents_upload: true,
    soa_view: true,
    balances_view: true,
  },
  client: {
    ...allOff,
    dashboard: true,
    payments_view: true,
    documents_view: true,
    documents_upload: true,
    soa_view: true,
    balances_view: true,
  },
}

export type AdminUser = {
  id: number
  fullName: string
  email: string
  password: string
  role: Role
  assignedProjects: string[]
  status: UserStatus
  permissions: Record<FeatureKey, boolean>
}

export type Listing = {
  unitId: string
  block: string
  lotType: string
  area: number
  pricePerSqm: number
  netSellingPrice: number
  legalMiscFee: number
  totalContractPrice: number
  status: 'Available' | 'Reserved' | 'Sold' | 'Hold' | 'Unspecified'
}

export type ClientRecord = {
  clientId: string
  buyerId: string
  reservationDate: string
  buyer: string
  spouse?: string
  unitId: string
  relocatedUnit?: string
  agent: string
  manager: string
  area: number
  pricePerSqm: number
  totalContractPrice: number
  paymentMode: 'CASH' | 'INSTALLMENT'
  paymentMade: number
  balance: number
  paymentPercentage: number
  documentStatus: 'COMPLETE' | 'INC'
  contactNo?: string
  email?: string
  address?: string
  accountStatus: 'COMPLETE PAID' | 'PARTIALLY PAID'
  salesStatus: 'GOOD SALE' | 'FOR REVIEW'
}

export type Payment = {
  unitId: string
  buyer: string
  mode: 'CASH' | 'INSTALLMENT'
  dueDay?: string
  paymentMade: number
  totalContractPrice: number
  balance: number
  paymentPercentage: number
  commissionReleasedPercent: number
}

export type SoaLine = {
  dueDate?: string
  description: string
  dueAmount: number
  penalty: number
  datePaid?: string
  amountPaid?: number
  reference?: string
  runningBalance: number
}

export type SoaRecord = {
  buyer: string
  unitNo: string
  area: string
  statementDate: string
  propertyAddress?: string
  totalContractPrice: number
  legalMiscFee: number
  totalAmountPayable: number
  totalToFullyPay: number
  schedule: SoaLine[]
}

export type CommissionRule = {
  id: string
  projectId: string
  name: string
  directAgentRate: number
  distributedAgentRate: number
  managerRate: number
  status: 'Active' | 'Inactive'
}

export type AgentRecord = {
  id: string
  employeeId: string
  fullName: string
  licenseType: 'REB' | 'REA' | 'Accredited Seller' | 'None'
  licenseNumber: string
  prcNumber: string
  contactNumber: string
  email: string
  address: string
  assignedProjects: string[]
  supervisorUserId: number | null
  status: 'Active' | 'Inactive' | 'Suspended'
  accreditationDate: string | null
  commissionRate: number
  linkedUserId: number | null
  notes: string
}

export type BrokerRecord = {
  id: string
  employeeId: string
  fullName: string
  rebNumber: string
  prcNumber: string
  contactNumber: string
  email: string
  address: string
  assignedAgents: string[]
  assignedProjects: string[]
  status: 'Active' | 'Inactive'
  hireDate: string
  commissionRate: number
  linkedUserId: string | null
  notes: string
}

export type EmployeeRecord = {
  id: string
  employeeId: string
  fullName: string
  position: string
  department: 'Administration' | 'Treasury' | 'Sales' | 'Documentation'
  contactNumber: string
  email: string
  address: string
  status: 'Active' | 'Inactive' | 'On Leave'
  hireDate: string
  linkedUserId: string | null
  notes: string
}

export type MockDbTimestamp = string
export type MockDbActiveStatus = 'active' | 'inactive'
export type MockDbProjectStatus = MockDbActiveStatus
export type MockDbListingStatusName = 'available' | 'reserved' | 'hold' | 'sold' | 'inactive'
export type MockDbClientLifecycleStatus = 'lead' | 'reserved' | 'active' | 'completed' | 'cancelled'
export type MockDbClientUnitPaymentMode = 'cash' | 'installment'
export type MockDbClientUnitDocumentState = 'complete' | 'incomplete'
export type MockDbClientUnitAccountStatus = 'active' | 'cancelled' | 'closed'
export type MockDbClientUnitPaymentStatus = 'unpaid' | 'partially_paid' | 'complete_paid'
export type MockDbClientUnitSalesStatus = 'good_sale' | 'bad_sale' | 'cancelled'
export type MockDbReservationStatus = 'pending' | 'confirmed' | 'converted' | 'expired' | 'cancelled'
export type MockDbClientUnitDocumentStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected'
export type MockDbPaymentStatus = 'pending' | 'verified' | 'rejected'
export type MockDbPaymentScheduleStatus = 'unpaid' | 'partial' | 'paid' | 'overdue'
export type MockDbPaymentTypeName = 'reservation' | 'downpayment' | 'monthly' | 'legal_misc' | 'full_payment' | 'other'
export type MockDbCommissionStatus = 'pending' | 'approved' | 'partially_released' | 'released' | 'cancelled'
export type MockDbCommissionSaleType = 'direct' | 'distributed'
export type MockDbCommissionReleaseStage = 'first_20' | 'second_40' | 'third_60' | 'fourth_75' | 'retention_25' | 'manual'
export type MockDbCashAdvanceStatus = 'pending' | 'approved' | 'partially_deducted' | 'deducted' | 'disapproved'
export type MockDbSellerRole = 'agent' | 'broker' | 'manager'
export type MockDbSettingInputType = 'text' | 'number' | 'boolean' | 'select'

export type MockDbUser = {
  id: number
  full_name: string
  email: string | null
  contact_no: string | null
  password_hash: string | null
  role: Role
  status: MockDbActiveStatus
  accreditation_date: string | null
  last_login: MockDbTimestamp | null
  created_at: MockDbTimestamp
  updated_at: MockDbTimestamp
}

export type MockDbUserSupervisor = {
  id: number
  user_id: number
  supervisor_id: number
  status: MockDbActiveStatus
  created_at: MockDbTimestamp
  updated_at: MockDbTimestamp
}

export type MockDbProject = {
  id: number
  name: string
  location: string | null
  administrator: string | null
  tax_declaration_no: string | null
  pin: string | null
  status: MockDbProjectStatus
  created_at: MockDbTimestamp
  updated_at: MockDbTimestamp
}

export type MockDbListing = {
  id: number
  project_id: number
  cadastral_lot_no: string | null
  administrator_group: string | null
  unit_id: string
  reloc_unit_id: string | null
  lot_type: string | null
  lot_area_sqm: number | null
  new_area_sqm: number | null
  price_per_sqm: number | null
  net_selling_price: number | null
  legal_misc_rate: number
  legal_misc_fee: number | null
  total_contract_price: number | null
  reservation_fee: number
  promo_discount: number
  status: MockDbListingStatusName
  created_at: MockDbTimestamp
  updated_at: MockDbTimestamp
}

export type MockDbClient = {
  id: number
  buyer_name: string
  spouse_co_owner_name: string | null
  aif_administrator_name: string | null
  email: string | null
  contact_no: string | null
  age: number | null
  address: string | null
  created_at: MockDbTimestamp
  updated_at: MockDbTimestamp
}

export type MockDbClientUnit = {
  id: number
  client_id: number
  listing_id: number
  reservation_id: number | null
  assigned_agent_id: number | null
  assigned_manager_id: number | null
  reservation_date: string | null
  contract_date: string | null
  mode_of_payment: MockDbClientUnitPaymentMode
  contract_price: number | null
  legal_misc_fee: number | null
  total_contract_price: number | null
  payment_terms_months: number | null
  monthly_amortization: number | null
  due_day: number | null
  document_status: MockDbClientUnitDocumentState
  account_status: MockDbClientUnitAccountStatus
  payment_status: MockDbClientUnitPaymentStatus
  sales_status: MockDbClientUnitSalesStatus
  remarks: string | null
  created_at: MockDbTimestamp
  updated_at: MockDbTimestamp
}

export type MockDbReservation = {
  id: number
  listing_id: number
  client_id: number
  reserved_by: number
  reservation_date: string
  expires_at: string | null
  reservation_fee: number
  status: MockDbReservationStatus
  converted_to_client_unit_id: number | null
  remarks: string | null
  created_at: MockDbTimestamp
  updated_at: MockDbTimestamp
}

export type MockDbClientUnitSeller = {
  id: number
  client_unit_id: number
  user_id: number
  role: MockDbSellerRole
  assigned_at: MockDbTimestamp
}

export type MockDbProjectDocument = {
  id: number
  project_id: number
  document_id: number
  is_required: boolean
  created_at: MockDbTimestamp
}

export type MockDbDocument = {
  id: number
  name: string
  description: string | null
  is_required: boolean
  status: MockDbActiveStatus
  created_at: MockDbTimestamp
  updated_at: MockDbTimestamp
}

export type MockDbClientUnitDocument = {
  id: number
  client_unit_id: number
  document_id: number
  file_url: string | null
  status: MockDbClientUnitDocumentStatus
  reviewed_by: number | null
  reviewed_at: MockDbTimestamp | null
  created_at: MockDbTimestamp
  updated_at: MockDbTimestamp
}

export type MockDbPayment = {
  id: number
  client_unit_id: number
  payment_date: string
  amount: number
  payment_type: MockDbPaymentTypeName
  payment_method: string | null
  bank_name: string | null
  reference_no: string | null
  status: MockDbPaymentStatus
  verified_by: number | null
  verified_at: MockDbTimestamp | null
  remarks: string | null
  created_at: MockDbTimestamp
  updated_at: MockDbTimestamp
}

export type MockDbPaymentSchedule = {
  id: number
  client_unit_id: number
  due_date: string
  description: string | null
  due_amount: number
  penalty: number
  status: MockDbPaymentScheduleStatus
  created_at: MockDbTimestamp
  updated_at: MockDbTimestamp
}

export type MockDbCommissionPlan = {
  id: number
  project_id: number
  name: string
  direct_agent_rate: number
  distributed_agent_rate: number
  manager_rate: number
  status: MockDbActiveStatus
  created_at: MockDbTimestamp
  updated_at: MockDbTimestamp
}

export type MockDbCommission = {
  id: number
  client_unit_id: number
  user_id: number
  commission_type: MockDbSellerRole
  sale_type: MockDbCommissionSaleType
  rate: number
  gross_commission: number
  status: MockDbCommissionStatus
  approved_by: number | null
  approved_at: MockDbTimestamp | null
  created_at: MockDbTimestamp
  updated_at: MockDbTimestamp
}

export type MockDbCashAdvance = {
  id: number
  user_id: number
  client_unit_id: number | null
  commission_id: number | null
  amount: number
  reason: string | null
  status: MockDbCashAdvanceStatus
  approved_by: number | null
  approved_at: MockDbTimestamp | null
  created_at: MockDbTimestamp
  updated_at: MockDbTimestamp
}

export type MockDbCommissionRelease = {
  id: number
  commission_id: number
  release_stage: MockDbCommissionReleaseStage
  release_percentage: number | null
  gross_release_amount: number
  cash_advance_deduction: number
  net_release_amount: number
  released_by: number
  released_at: MockDbTimestamp
  remarks: string | null
}

export type MockDbCashAdvanceDeduction = {
  id: number
  cash_advance_id: number
  commission_release_id: number
  deducted_amount: number
  created_at: MockDbTimestamp
}

export type MockDbAppFeature = {
  id: number
  feature_key: string
  module_name: string
  display_name: string
  created_at: MockDbTimestamp
}

export type MockDbRoleFeaturePermission = {
  id: number
  role: Role
  feature_id: number
  can_access: boolean
  created_at: MockDbTimestamp
}

export type MockDbUserFeaturePermission = {
  id: number
  user_id: number
  feature_id: number
  can_access: boolean
  granted_by: number | null
  created_at: MockDbTimestamp
}

export type MockDbSetting = {
  id: number
  setting_key: string
  setting_value: string
  display_label: string
  input_type: MockDbSettingInputType
  module_group: string
  updated_by: number | null
  updated_at: MockDbTimestamp
}

export type MockDbLotType = {
  id: number
  name: string
  display_name: string
  status: MockDbActiveStatus
  sort_order: number
}

export type MockDbPaymentMethod = {
  id: number
  name: string
  display_name: string
  status: MockDbActiveStatus
  sort_order: number
}

export type MockDbPaymentType = {
  id: number
  name: string
  display_name: string
  status: MockDbActiveStatus
  sort_order: number
}

export type MockDbPaymentMode = {
  id: number
  name: string
  display_name: string
  status: MockDbActiveStatus
  sort_order: number
}

export type MockDbCommissionType = {
  id: number
  name: string
  display_name: string
  status: MockDbActiveStatus
  sort_order: number
}

export type MockDbUserRole = {
  id: number
  name: Role
  display_name: string
  description: string | null
  status: MockDbActiveStatus
  sort_order: number
}

export type MockDbClientStatus = {
  id: number
  name: MockDbClientLifecycleStatus
  display_name: string
  color_hex: string
  status: MockDbActiveStatus
  sort_order: number
}

export type MockDbListingStatus = {
  id: number
  name: MockDbListingStatusName
  display_name: string
  color_hex: string
  status: MockDbActiveStatus
  sort_order: number
}

export type MockDbAuditLog = {
  id: number
  user_id: number | null
  action: string
  module_name: string | null
  entity_table: string | null
  entity_id: number | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  ip_address: string | null
  created_at: MockDbTimestamp
}

const mockDbCreatedAt = '2026-01-08 08:00:00'
const mockDbUpdatedAt = '2026-06-05 09:00:00'
const defaultReservationFee = 10000

function roundMockCurrency(value: number) {
  return Math.round(value * 100) / 100
}

function addMonths(date: string, months: number) {
  const [year, month, day] = date.split('-').map(Number)
  const next = new Date(year, month - 1 + months, day)
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`
}

function timestamp(date: string): MockDbTimestamp {
  return `${date} 09:00:00`
}

export const users: AdminUser[] = [
  {
    id: 1,
    fullName: 'Admin User',
    email: 'admin@dcprime.test',
    password: 'Admin123!',
    role: 'admin',
    assignedProjects: ['Luntiang Alfonso'],
    status: 'Active',
    permissions: allOn,
  },
  {
    id: 2,
    fullName: 'Kirsten Rioja',
    email: 'treasury@dcprime.test',
    password: 'Treasury123!',
    role: 'treasury',
    assignedProjects: ['Luntiang Alfonso'],
    status: 'Active',
    permissions: rolePresets.treasury,
  },
  {
    id: 5,
    fullName: 'Mara Santos',
    email: 'mara.santos@dcprime.test',
    password: 'Agent123!',
    role: 'agent',
    assignedProjects: ['Luntiang Alfonso'],
    status: 'Active',
    permissions: rolePresets.agent,
  },
]

export const projects = [
  {
    id: 'project-1',
    code: 'LA',
    name: 'Luntiang Alfonso',
    location: 'Alfonso, Cavite',
    status: 'Active',
    description: 'Compact residential subdivision mock project for CRUD testing.',
    coverImage: '',
    accentColor: '#1A1A2E',
    totalLots: 5,
    createdAt: '2026-01-08T08:00:00.000Z',
  },
]

export const listings: Listing[] = [
  { unitId: 'LA-0101', block: '1', lotType: 'Inner Lot', area: 180, pricePerSqm: 4500, netSellingPrice: 810000, legalMiscFee: 81000, totalContractPrice: 891000, status: 'Sold' },
  { unitId: 'LA-0102', block: '1', lotType: 'Corner Lot', area: 220, pricePerSqm: 4800, netSellingPrice: 1056000, legalMiscFee: 105600, totalContractPrice: 1161600, status: 'Sold' },
  { unitId: 'LA-0103', block: '1', lotType: 'End Lot', area: 200, pricePerSqm: 4650, netSellingPrice: 930000, legalMiscFee: 93000, totalContractPrice: 1023000, status: 'Reserved' },
  { unitId: 'LA-0104', block: '1', lotType: 'Inner Lot', area: 175, pricePerSqm: 4400, netSellingPrice: 770000, legalMiscFee: 77000, totalContractPrice: 847000, status: 'Reserved' },
  { unitId: 'LA-0105', block: '1', lotType: 'Commercial', area: 260, pricePerSqm: 5200, netSellingPrice: 1352000, legalMiscFee: 135200, totalContractPrice: 1487200, status: 'Available' },
]

export const clients: ClientRecord[] = [
  {
    clientId: 'client-1',
    buyerId: 'buyer-1',
    reservationDate: '2026-01-15',
    buyer: 'Reyes, Angela Mae',
    spouse: 'Reyes, Daniel',
    unitId: 'LA-0101',
    agent: 'Mara Santos',
    manager: 'Carlo Mercado',
    area: 180,
    pricePerSqm: 4500,
    totalContractPrice: 891000,
    paymentMode: 'INSTALLMENT',
    paymentMade: 280000,
    balance: 611000,
    paymentPercentage: 280000 / 891000,
    documentStatus: 'COMPLETE',
    contactNo: '0917-410-1188',
    email: 'angela.reyes@example.com',
    address: 'Tagaytay City, Cavite',
    accountStatus: 'PARTIALLY PAID',
    salesStatus: 'GOOD SALE',
  },
  {
    clientId: 'client-2',
    buyerId: 'buyer-2',
    reservationDate: '2026-02-10',
    buyer: 'Dela Cruz, Paolo',
    spouse: 'Dela Cruz, Mika',
    unitId: 'LA-0102',
    agent: 'Nico Ramos',
    manager: 'Carlo Mercado',
    area: 220,
    pricePerSqm: 4800,
    totalContractPrice: 1161600,
    paymentMode: 'CASH',
    paymentMade: 1161600,
    balance: 0,
    paymentPercentage: 1,
    documentStatus: 'COMPLETE',
    contactNo: '0917-520-2244',
    email: 'paolo.delacruz@example.com',
    address: 'Dasmarinas, Cavite',
    accountStatus: 'COMPLETE PAID',
    salesStatus: 'GOOD SALE',
  },
  {
    clientId: 'client-3',
    buyerId: 'buyer-3',
    reservationDate: '2026-03-05',
    buyer: 'Villanueva, Sofia',
    spouse: 'Villanueva, Luis',
    unitId: 'LA-0103',
    agent: 'Mara Santos',
    manager: 'Carlo Mercado',
    area: 200,
    pricePerSqm: 4650,
    totalContractPrice: 1023000,
    paymentMode: 'INSTALLMENT',
    paymentMade: 10000,
    balance: 1013000,
    paymentPercentage: 10000 / 1023000,
    documentStatus: 'INC',
    contactNo: '0917-630-3355',
    email: 'sofia.villanueva@example.com',
    address: 'Silang, Cavite',
    accountStatus: 'PARTIALLY PAID',
    salesStatus: 'FOR REVIEW',
  },
  {
    clientId: 'client-4',
    buyerId: 'buyer-4',
    reservationDate: '2026-04-12',
    buyer: 'Garcia, Leo',
    spouse: 'Garcia, Nina',
    unitId: 'LA-0104',
    agent: 'Nico Ramos',
    manager: 'Carlo Mercado',
    area: 175,
    pricePerSqm: 4400,
    totalContractPrice: 847000,
    paymentMode: 'INSTALLMENT',
    paymentMade: 0,
    balance: 847000,
    paymentPercentage: 0,
    documentStatus: 'INC',
    contactNo: '0917-740-4488',
    email: 'leo.garcia@example.com',
    address: 'Mendez, Cavite',
    accountStatus: 'PARTIALLY PAID',
    salesStatus: 'GOOD SALE',
  },
]

export const clientsV2 = clients

export const paymentTracker: Payment[] = clients.map((client) => ({
  unitId: client.unitId,
  buyer: client.buyer,
  mode: client.paymentMode,
  dueDay: client.paymentMode === 'INSTALLMENT' ? '15th' : 'On demand',
  paymentMade: client.paymentMade,
  totalContractPrice: client.totalContractPrice,
  balance: client.balance,
  paymentPercentage: client.paymentPercentage,
  commissionReleasedPercent: client.paymentPercentage >= 1 ? 1 : client.paymentPercentage >= 0.25 ? 0.4 : 0,
}))

export const commissions = clients.slice(0, 3).map((client) => ({
  unitId: client.unitId,
  buyer: client.buyer,
  agent: client.agent,
  manager: client.manager,
  netSellingPrice: listings.find((listing) => listing.unitId === client.unitId)?.netSellingPrice ?? client.totalContractPrice,
  agentCommission: roundMockCurrency((listings.find((listing) => listing.unitId === client.unitId)?.netSellingPrice ?? client.totalContractPrice) * 0.07),
  managerCommission: roundMockCurrency((listings.find((listing) => listing.unitId === client.unitId)?.netSellingPrice ?? client.totalContractPrice) * 0.05),
  releasedPercent: client.paymentPercentage >= 1 ? 1 : client.paymentPercentage >= 0.25 ? 0.4 : 0,
}))

export const computations = [
  { label: 'Total Contract Price', value: clients.reduce((total, client) => total + client.totalContractPrice, 0) },
  { label: 'Total Paid', value: clients.reduce((total, client) => total + client.paymentMade, 0) },
  { label: 'Open Balance', value: clients.reduce((total, client) => total + client.balance, 0) },
]

export const agentPerformance = [
  { agent: 'Mara Santos', totalSales: 891000 + 1023000, active: 2, cancelled: 0, net: 1891000 },
  { agent: 'Nico Ramos', totalSales: 1161600 + 847000, active: 2, cancelled: 0, net: 2008600 },
]

export const accreditedSellers = [
  { name: 'Mara Santos', role: 'Agent', contact: '0917-111-5101', status: 'Active' },
  { name: 'Nico Ramos', role: 'Agent', contact: '0917-111-5102', status: 'Active' },
  { name: 'Carlo Mercado', role: 'Manager', contact: '0917-111-5103', status: 'Active' },
]

export const documents = clients.map((client) => ({
  clientId: client.clientId,
  clientName: client.buyer,
  unitId: client.unitId,
  documentStatus: client.documentStatus,
  submitted: client.documentStatus === 'COMPLETE' ? 5 : 3,
  required: 5,
}))

export const auditLogs = [
  ['2026-06-05 09:00:00', 'Admin User', 'Updated compact mock data seed', 'System'],
  ['2026-06-05 09:15:00', 'Kirsten Rioja', 'Verified payment for LA-0102', 'Payments'],
  ['2026-06-05 09:30:00', 'Carlo Mercado', 'Approved commission release', 'Commissions'],
]

export const soaRecords: SoaRecord[] = clients.slice(0, 3).map((client) => {
  const unit = listings.find((listing) => listing.unitId === client.unitId) ?? listings[0]
  const paid = client.paymentMade
  const firstDue = client.paymentMode === 'CASH' ? client.totalContractPrice : Math.max(client.totalContractPrice * 0.2, 10000)
  const secondDue = client.paymentMode === 'CASH' ? 0 : Math.max(client.totalContractPrice * 0.1, 10000)
  const firstStatusPaid = paid >= firstDue
  const secondStatusPaid = paid >= firstDue + secondDue

  return {
    buyer: client.buyer,
    unitNo: client.unitId,
    area: `${client.area} sqm`,
    statementDate: '2026-06-05',
    propertyAddress: company.propertyAddress,
    totalContractPrice: client.totalContractPrice,
    legalMiscFee: unit.legalMiscFee,
    totalAmountPayable: client.totalContractPrice,
    totalToFullyPay: client.balance,
    schedule: [
      {
        dueDate: addMonths(client.reservationDate, 0),
        description: 'Reservation Fee',
        dueAmount: defaultReservationFee,
        penalty: 0,
        datePaid: client.paymentMade > 0 ? client.reservationDate : undefined,
        amountPaid: client.paymentMade > 0 ? defaultReservationFee : undefined,
        reference: client.paymentMade > 0 ? `OR-${client.clientId}-001` : undefined,
        runningBalance: client.totalContractPrice - Math.min(defaultReservationFee, client.paymentMade),
      },
      {
        dueDate: addMonths(client.reservationDate, 1),
        description: client.paymentMode === 'CASH' ? 'Full Payment' : 'Downpayment',
        dueAmount: firstDue,
        penalty: firstStatusPaid ? 0 : 1500,
        datePaid: firstStatusPaid ? addMonths(client.reservationDate, 1) : undefined,
        amountPaid: firstStatusPaid ? firstDue : undefined,
        reference: firstStatusPaid ? `OR-${client.clientId}-002` : undefined,
        runningBalance: Math.max(client.totalContractPrice - Math.min(paid, firstDue + defaultReservationFee), 0),
      },
      {
        dueDate: addMonths(client.reservationDate, 2),
        description: 'Monthly Amortization',
        dueAmount: secondDue,
        penalty: secondStatusPaid || client.paymentMode === 'CASH' ? 0 : 1200,
        datePaid: secondStatusPaid ? addMonths(client.reservationDate, 2) : undefined,
        amountPaid: secondStatusPaid ? secondDue : undefined,
        reference: secondStatusPaid ? `OR-${client.clientId}-003` : undefined,
        runningBalance: client.balance,
      },
    ].filter((line) => line.dueAmount > 0),
  }
})

export const agentRecords: AgentRecord[] = [
  {
    id: 'agent-001',
    employeeId: 'AGT-001',
    fullName: 'Mara Santos',
    licenseType: 'Accredited Seller',
    licenseNumber: 'AS-2026-001',
    prcNumber: 'PRC-601122',
    contactNumber: '0917-111-5101',
    email: 'mara.santos@dcprime.test',
    address: 'Tagaytay City, Cavite',
    assignedProjects: ['project-1'],
    supervisorUserId: 3,
    status: 'Active',
    accreditationDate: '2026-01-10',
    commissionRate: 0.07,
    linkedUserId: 5,
    notes: 'Primary seller for Luntiang Alfonso.',
  },
  {
    id: 'agent-002',
    employeeId: 'AGT-002',
    fullName: 'Nico Ramos',
    licenseType: 'Accredited Seller',
    licenseNumber: 'AS-2026-002',
    prcNumber: 'PRC-601123',
    contactNumber: '0917-111-5102',
    email: 'nico.ramos@dcprime.test',
    address: 'Silang, Cavite',
    assignedProjects: ['project-1'],
    supervisorUserId: 3,
    status: 'Active',
    accreditationDate: '2026-01-12',
    commissionRate: 0.07,
    linkedUserId: 6,
    notes: 'Handles cash buyers and document follow-ups.',
  },
]

export const brokerRecords: BrokerRecord[] = [
  {
    id: 'broker-001',
    employeeId: 'BRK-001',
    fullName: 'Bianca Cruz',
    rebNumber: 'REB-2026-010',
    prcNumber: 'PRC-500210',
    contactNumber: '0917-111-5104',
    email: 'bianca.cruz@dcprime.test',
    address: 'Alfonso, Cavite',
    assignedAgents: ['agent-001', 'agent-002'],
    assignedProjects: ['project-1'],
    status: 'Active',
    hireDate: '2026-01-08',
    commissionRate: 0.02,
    linkedUserId: 'user-7',
    notes: 'Broker of record for sample transactions.',
  },
]

export const employeeRecords: EmployeeRecord[] = [
  {
    id: 'employee-001',
    employeeId: 'EMP-001',
    fullName: 'Kirsten Rioja',
    position: 'Administration Head',
    department: 'Administration',
    contactNumber: '0917-111-5105',
    email: 'treasury@dcprime.test',
    address: 'Indang, Cavite',
    status: 'Active',
    hireDate: '2026-01-05',
    linkedUserId: 'user-2',
    notes: 'Handles SOA preparation and payment verification.',
  },
]

export const listingsV2 = listings.map((listing) => ({
  projectId: 'project-1',
  unitId: listing.unitId,
  block: listing.block,
  lotType: listing.lotType,
  area: listing.area,
  areaSqm: listing.area,
  pricePerSqm: listing.pricePerSqm,
  sellingPrice: listing.netSellingPrice,
  legalMiscFee: listing.legalMiscFee,
  totalContractPrice: listing.totalContractPrice,
  status: listing.status,
}))

export const payments = paymentTracker.map((payment, index) => ({
  id: `payment-${index + 1}`,
  unitId: payment.unitId,
  buyer: payment.buyer,
  amount: payment.paymentMade,
  paymentDate: clients[index]?.reservationDate ?? '2026-01-15',
  status: payment.paymentMade > 0 ? 'Verified' : 'Pending',
}))

export const commissionRules: CommissionRule[] = [
  {
    id: 'rule-1',
    projectId: 'project-1',
    name: 'Standard Residential Plan',
    directAgentRate: 0.07,
    distributedAgentRate: 0.02,
    managerRate: 0.05,
    status: 'Active',
  },
]

export type DocumentStatus = 'Not Submitted' | 'Submitted' | 'Approved' | 'Rejected'

export const documentRequirements = [
  { id: 'buyers-information-form', category: 'Required for Submission', documentType: "Buyer's Information Form", sortOrder: 1 },
  { id: 'valid-government-id', category: 'Required for Submission', documentType: 'Valid Government ID', sortOrder: 2 },
  { id: 'reservation-agreement', category: 'Contract Documents', documentType: 'Reservation Agreement', sortOrder: 3 },
  { id: 'proof-of-payment', category: 'Payment Documents', documentType: 'Proof of Payment', sortOrder: 4 },
  { id: 'contract-to-sell', category: 'Contract Documents', documentType: 'Contract to Sell', sortOrder: 5 },
]

export const clientDocuments = clients.flatMap((client, clientIndex) =>
  documentRequirements.map((requirement, requirementIndex) => {
    const isComplete = client.documentStatus === 'COMPLETE'
    const status: DocumentStatus =
      clientIndex === 2 && requirementIndex === 4
        ? 'Rejected'
        : isComplete
          ? 'Approved'
          : requirementIndex < 3
            ? 'Submitted'
            : 'Not Submitted'
    return {
      id: `${client.clientId}-${requirement.id}`,
      clientId: client.clientId,
      clientName: client.buyer,
      unitId: client.unitId,
      requirementId: requirement.id,
      category: requirement.category,
      documentType: requirement.documentType,
      status,
      submittedDate: status === 'Not Submitted' ? '' : addMonths(client.reservationDate, requirementIndex),
      rejectionRemark: clientIndex === 2 && requirementIndex === 4 ? 'Waiting for signed CTS copy.' : '',
    }
  }),
)

export const usersV2 = [
  { id: 'user-1', fullName: 'Admin User', email: 'admin@dcprime.test', role: 'admin', status: 'Active', dateCreated: '2026-01-08', lastLogin: '2026-06-05', permissions: allOn },
  { id: 'user-2', fullName: 'Kirsten Rioja', email: 'treasury@dcprime.test', role: 'treasury', status: 'Active', dateCreated: '2026-01-08', lastLogin: '2026-06-05', permissions: rolePresets.treasury },
  { id: 'user-5', fullName: 'Mara Santos', email: 'mara.santos@dcprime.test', role: 'agent', status: 'Active', dateCreated: '2026-01-10', lastLogin: '2026-06-04', permissions: rolePresets.agent },
]

export const auditLogsV2 = [
  { id: 'audit-1', timestamp: '2026-06-05 09:00:00', userName: 'Admin User', action: 'Seed reset', module: 'System', details: 'Compact relational mock seed loaded.', ipAddress: '127.0.0.1' },
  { id: 'audit-2', timestamp: '2026-06-05 09:15:00', userName: 'Mara Santos', action: 'Reservation created', module: 'Reservations', details: 'Reserved LA-0103 for Sofia Villanueva.', ipAddress: '127.0.0.1' },
  { id: 'audit-3', timestamp: '2026-06-05 09:30:00', userName: 'Kirsten Rioja', action: 'Payment verified', module: 'Payments', details: 'Verified full payment for LA-0102.', ipAddress: '127.0.0.1' },
]

export const mockDbUserRoles: MockDbUserRole[] = [
  { id: 1, name: 'owner', display_name: 'Owner', description: 'Business owner with full access.', status: 'active', sort_order: 1 },
  { id: 2, name: 'admin', display_name: 'Administrator', description: 'Full system administration.', status: 'active', sort_order: 2 },
  { id: 3, name: 'treasury', display_name: 'Treasury', description: 'Payment and finance operations.', status: 'active', sort_order: 3 },
  { id: 4, name: 'manager', display_name: 'Sales Manager', description: 'Sales team oversight.', status: 'active', sort_order: 4 },
  { id: 5, name: 'broker', display_name: 'Broker', description: 'Broker participation in sales.', status: 'active', sort_order: 5 },
  { id: 6, name: 'agent', display_name: 'Agent', description: 'Sales agent access.', status: 'active', sort_order: 6 },
  { id: 7, name: 'client', display_name: 'Client', description: 'Client self-service access.', status: 'active', sort_order: 7 },
]

export const mockDbClientStatuses: MockDbClientStatus[] = [
  { id: 1, name: 'lead', display_name: 'Lead', color_hex: '#2563EB', status: 'active', sort_order: 1 },
  { id: 2, name: 'reserved', display_name: 'Reserved', color_hex: '#D97706', status: 'active', sort_order: 2 },
  { id: 3, name: 'active', display_name: 'Active', color_hex: '#059669', status: 'active', sort_order: 3 },
  { id: 4, name: 'completed', display_name: 'Completed', color_hex: '#4F46E5', status: 'active', sort_order: 4 },
  { id: 5, name: 'cancelled', display_name: 'Cancelled', color_hex: '#DC2626', status: 'active', sort_order: 5 },
]

export const mockDbListingStatuses: MockDbListingStatus[] = [
  { id: 1, name: 'available', display_name: 'Available', color_hex: '#059669', status: 'active', sort_order: 1 },
  { id: 2, name: 'reserved', display_name: 'Reserved', color_hex: '#D97706', status: 'active', sort_order: 2 },
  { id: 3, name: 'hold', display_name: 'Hold', color_hex: '#7C3AED', status: 'active', sort_order: 3 },
  { id: 4, name: 'sold', display_name: 'Sold', color_hex: '#4F46E5', status: 'active', sort_order: 4 },
  { id: 5, name: 'inactive', display_name: 'Inactive', color_hex: '#6B7280', status: 'active', sort_order: 5 },
]

export const mockDbLotTypes: MockDbLotType[] = [
  { id: 1, name: 'inner_lot', display_name: 'Inner Lot', status: 'active', sort_order: 1 },
  { id: 2, name: 'corner_lot', display_name: 'Corner Lot', status: 'active', sort_order: 2 },
  { id: 3, name: 'end_lot', display_name: 'End Lot', status: 'active', sort_order: 3 },
  { id: 4, name: 'commercial', display_name: 'Commercial', status: 'active', sort_order: 4 },
]

export const mockDbPaymentMethods: MockDbPaymentMethod[] = [
  { id: 1, name: 'cash', display_name: 'Cash', status: 'active', sort_order: 1 },
  { id: 2, name: 'bank_deposit', display_name: 'Bank Deposit', status: 'active', sort_order: 2 },
  { id: 3, name: 'check', display_name: 'Check', status: 'active', sort_order: 3 },
]

export const mockDbPaymentTypes: MockDbPaymentType[] = [
  { id: 1, name: 'reservation', display_name: 'Reservation', status: 'active', sort_order: 1 },
  { id: 2, name: 'downpayment', display_name: 'Downpayment', status: 'active', sort_order: 2 },
  { id: 3, name: 'monthly', display_name: 'Monthly', status: 'active', sort_order: 3 },
  { id: 4, name: 'legal_misc', display_name: 'Legal / Misc', status: 'active', sort_order: 4 },
  { id: 5, name: 'full_payment', display_name: 'Full Payment', status: 'active', sort_order: 5 },
]

export const mockDbPaymentModes: MockDbPaymentMode[] = [
  { id: 1, name: 'cash', display_name: 'Cash', status: 'active', sort_order: 1 },
  { id: 2, name: 'installment', display_name: 'Installment', status: 'active', sort_order: 2 },
]

export const mockDbCommissionTypes: MockDbCommissionType[] = [
  { id: 1, name: 'agent', display_name: 'Agent', status: 'active', sort_order: 1 },
  { id: 2, name: 'broker', display_name: 'Broker', status: 'active', sort_order: 2 },
  { id: 3, name: 'manager', display_name: 'Manager', status: 'active', sort_order: 3 },
]

export const mockDbSettings: MockDbSetting[] = [
  { id: 1, setting_key: 'company_name', setting_value: company.name, display_label: 'Company Name', input_type: 'text', module_group: 'Company', updated_by: 1, updated_at: mockDbUpdatedAt },
  { id: 2, setting_key: 'default_reservation_fee', setting_value: String(defaultReservationFee), display_label: 'Default Reservation Fee', input_type: 'number', module_group: 'Reservations', updated_by: 1, updated_at: mockDbUpdatedAt },
  { id: 3, setting_key: 'max_reservation_expiry_days', setting_value: '30', display_label: 'Reservation Expiry Days', input_type: 'number', module_group: 'Reservations', updated_by: 1, updated_at: mockDbUpdatedAt },
  { id: 4, setting_key: 'installment_terms_months', setting_value: '60', display_label: 'Default Installment Terms', input_type: 'number', module_group: 'Finance', updated_by: 1, updated_at: mockDbUpdatedAt },
  { id: 5, setting_key: 'system_email', setting_value: 'admin@dcprime.test', display_label: 'System Email', input_type: 'text', module_group: 'Notifications', updated_by: 1, updated_at: mockDbUpdatedAt },
]

export const mockDbUsers: MockDbUser[] = [
  { id: 1, full_name: 'Admin User', email: 'admin@dcprime.test', contact_no: '0917-111-5100', password_hash: 'mock_hash_admin', role: 'admin', status: 'active', accreditation_date: '2026-01-08', last_login: mockDbUpdatedAt, created_at: mockDbCreatedAt, updated_at: mockDbUpdatedAt },
  { id: 2, full_name: 'Kirsten Rioja', email: 'treasury@dcprime.test', contact_no: '0917-111-5105', password_hash: 'mock_hash_treasury', role: 'treasury', status: 'active', accreditation_date: '2026-01-08', last_login: mockDbUpdatedAt, created_at: mockDbCreatedAt, updated_at: mockDbUpdatedAt },
  { id: 3, full_name: 'Carlo Mercado', email: 'carlo.mercado@dcprime.test', contact_no: '0917-111-5103', password_hash: 'mock_hash_manager', role: 'manager', status: 'active', accreditation_date: '2026-01-08', last_login: mockDbUpdatedAt, created_at: mockDbCreatedAt, updated_at: mockDbUpdatedAt },
  { id: 4, full_name: 'Bianca Cruz', email: 'bianca.cruz@dcprime.test', contact_no: '0917-111-5104', password_hash: 'mock_hash_broker', role: 'broker', status: 'active', accreditation_date: '2026-01-08', last_login: mockDbUpdatedAt, created_at: mockDbCreatedAt, updated_at: mockDbUpdatedAt },
  { id: 5, full_name: 'Mara Santos', email: 'mara.santos@dcprime.test', contact_no: '0917-111-5101', password_hash: 'mock_hash_agent_1', role: 'agent', status: 'active', accreditation_date: '2026-01-10', last_login: mockDbUpdatedAt, created_at: mockDbCreatedAt, updated_at: mockDbUpdatedAt },
  { id: 6, full_name: 'Nico Ramos', email: 'nico.ramos@dcprime.test', contact_no: '0917-111-5102', password_hash: 'mock_hash_agent_2', role: 'agent', status: 'active', accreditation_date: '2026-01-12', last_login: mockDbUpdatedAt, created_at: mockDbCreatedAt, updated_at: mockDbUpdatedAt },
  { id: 7, full_name: 'Angela Mae Reyes', email: 'angela.reyes@example.com', contact_no: '0917-410-1188', password_hash: 'mock_hash_client_1', role: 'client', status: 'active', accreditation_date: '2026-01-15', last_login: mockDbUpdatedAt, created_at: timestamp('2026-01-15'), updated_at: mockDbUpdatedAt },
  { id: 8, full_name: 'Paolo Dela Cruz', email: 'paolo.delacruz@example.com', contact_no: '0917-520-2244', password_hash: 'mock_hash_client_2', role: 'client', status: 'active', accreditation_date: '2026-02-10', last_login: mockDbUpdatedAt, created_at: timestamp('2026-02-10'), updated_at: mockDbUpdatedAt },
  { id: 9, full_name: 'Sofia Villanueva', email: 'sofia.villanueva@example.com', contact_no: '0917-630-3355', password_hash: 'mock_hash_client_3', role: 'client', status: 'active', accreditation_date: '2026-03-05', last_login: mockDbUpdatedAt, created_at: timestamp('2026-03-05'), updated_at: mockDbUpdatedAt },
  { id: 10, full_name: 'Leo Garcia', email: 'leo.garcia@example.com', contact_no: '0917-740-4488', password_hash: 'mock_hash_client_4', role: 'client', status: 'active', accreditation_date: '2026-04-12', last_login: mockDbUpdatedAt, created_at: timestamp('2026-04-12'), updated_at: mockDbUpdatedAt },
]

export const mockDbUserSupervisors: MockDbUserSupervisor[] = [
  { id: 1, user_id: 5, supervisor_id: 3, status: 'active', created_at: mockDbCreatedAt, updated_at: mockDbUpdatedAt },
  { id: 2, user_id: 6, supervisor_id: 3, status: 'active', created_at: mockDbCreatedAt, updated_at: mockDbUpdatedAt },
]

export const mockDbProjects: MockDbProject[] = [
  { id: 1, name: 'Luntiang Alfonso', location: 'Alfonso, Cavite', administrator: company.preparedBy, tax_declaration_no: 'TD-2026-001', pin: 'PIN-2026-001', status: 'active', created_at: mockDbCreatedAt, updated_at: mockDbUpdatedAt },
]

const lotTypeByLabel: Record<string, string> = {
  'Inner Lot': 'inner_lot',
  'Corner Lot': 'corner_lot',
  'End Lot': 'end_lot',
  Commercial: 'commercial',
}

export const mockDbListings: MockDbListing[] = listings.map((listing, index) => ({
  id: index + 1,
  project_id: 1,
  cadastral_lot_no: `CAD-LA-${String(index + 1).padStart(3, '0')}`,
  administrator_group: 'DC Prime Admin',
  unit_id: listing.unitId,
  reloc_unit_id: '',
  lot_type: lotTypeByLabel[listing.lotType] ?? 'inner_lot',
  lot_area_sqm: listing.area,
  new_area_sqm: listing.area,
  price_per_sqm: listing.pricePerSqm,
  net_selling_price: listing.netSellingPrice,
  legal_misc_rate: 10,
  legal_misc_fee: listing.legalMiscFee,
  total_contract_price: listing.totalContractPrice,
  reservation_fee: defaultReservationFee,
  promo_discount: index === 1 ? 25000 : 0,
  status: listing.status === 'Available' ? 'available' : listing.status === 'Reserved' ? 'reserved' : listing.status === 'Sold' ? 'sold' : listing.status === 'Hold' ? 'hold' : 'inactive',
  created_at: mockDbCreatedAt,
  updated_at: mockDbUpdatedAt,
}))

export const mockDbClients: MockDbClient[] = clients.map((client, index) => ({
  id: index + 1,
  buyer_name: client.buyer,
  spouse_co_owner_name: client.spouse ?? '',
  aif_administrator_name: 'N/A',
  email: client.email ?? `client${index + 1}@example.com`,
  contact_no: client.contactNo ?? '0917-000-0000',
  age: [34, 42, 29, 37][index],
  address: client.address ?? 'Cavite',
  created_at: timestamp(client.reservationDate),
  updated_at: mockDbUpdatedAt,
}))

export const mockDbReservations: MockDbReservation[] = [
  { id: 1, listing_id: 1, client_id: 1, reserved_by: 5, reservation_date: '2026-01-15', expires_at: '2026-02-14', reservation_fee: defaultReservationFee, status: 'converted', converted_to_client_unit_id: 1, remarks: 'Converted to active installment contract.', created_at: timestamp('2026-01-15'), updated_at: mockDbUpdatedAt },
  { id: 2, listing_id: 2, client_id: 2, reserved_by: 6, reservation_date: '2026-02-10', expires_at: '2026-03-12', reservation_fee: defaultReservationFee, status: 'converted', converted_to_client_unit_id: 2, remarks: 'Converted to cash sale.', created_at: timestamp('2026-02-10'), updated_at: mockDbUpdatedAt },
  { id: 3, listing_id: 3, client_id: 3, reserved_by: 5, reservation_date: '2026-03-05', expires_at: '2026-04-04', reservation_fee: defaultReservationFee, status: 'converted', converted_to_client_unit_id: 3, remarks: 'Converted with document follow-up.', created_at: timestamp('2026-03-05'), updated_at: mockDbUpdatedAt },
  { id: 4, listing_id: 4, client_id: 4, reserved_by: 6, reservation_date: '2026-04-12', expires_at: '2026-05-12', reservation_fee: defaultReservationFee, status: 'confirmed', converted_to_client_unit_id: null, remarks: 'Ready for conversion test.', created_at: timestamp('2026-04-12'), updated_at: mockDbUpdatedAt },
]

export const mockDbClientUnits: MockDbClientUnit[] = clients.slice(0, 3).map((client, index) => {
  const listing = listings.find((item) => item.unitId === client.unitId) ?? listings[index]
  const terms = client.paymentMode === 'INSTALLMENT' ? 60 : 1
  return {
    id: index + 1,
    client_id: index + 1,
    listing_id: index + 1,
    reservation_id: index + 1,
    assigned_agent_id: client.agent === 'Mara Santos' ? 5 : 6,
    assigned_manager_id: 3,
    reservation_date: client.reservationDate,
    contract_date: addMonths(client.reservationDate, 1),
    mode_of_payment: client.paymentMode.toLowerCase() as MockDbClientUnitPaymentMode,
    contract_price: listing.netSellingPrice,
    legal_misc_fee: listing.legalMiscFee,
    total_contract_price: client.totalContractPrice,
    payment_terms_months: terms,
    monthly_amortization: client.paymentMode === 'INSTALLMENT' ? roundMockCurrency(Math.max(client.balance, 0) / terms) : client.totalContractPrice,
    due_day: 15,
    document_status: client.documentStatus === 'COMPLETE' ? 'complete' : 'incomplete',
    account_status: client.balance <= 0 ? 'closed' : 'active',
    payment_status: client.balance <= 0 ? 'complete_paid' : client.paymentMade > 0 ? 'partially_paid' : 'unpaid',
    sales_status: client.salesStatus === 'GOOD SALE' ? 'good_sale' : 'bad_sale',
    remarks: `${client.paymentMode} account seeded for CRUD testing.`,
    created_at: timestamp(client.reservationDate),
    updated_at: mockDbUpdatedAt,
  }
})

export const mockDbClientUnitSellers: MockDbClientUnitSeller[] = mockDbClientUnits.flatMap((clientUnit, index) => [
  { id: index * 3 + 1, client_unit_id: clientUnit.id, user_id: clientUnit.assigned_agent_id ?? 5, role: 'agent' as const, assigned_at: clientUnit.created_at },
  { id: index * 3 + 2, client_unit_id: clientUnit.id, user_id: 4, role: 'broker' as const, assigned_at: clientUnit.created_at },
  { id: index * 3 + 3, client_unit_id: clientUnit.id, user_id: 3, role: 'manager' as const, assigned_at: clientUnit.created_at },
])

export const mockDbDocuments: MockDbDocument[] = documentRequirements.map((requirement, index) => ({
  id: index + 1,
  name: requirement.documentType,
  description: `${requirement.category} requirement.`,
  is_required: true,
  status: 'active',
  created_at: mockDbCreatedAt,
  updated_at: mockDbUpdatedAt,
}))

export const mockDbProjectDocuments: MockDbProjectDocument[] = mockDbDocuments.map((document, index) => ({
  id: index + 1,
  project_id: 1,
  document_id: document.id,
  is_required: document.is_required,
  created_at: mockDbCreatedAt,
}))

export const mockDbClientUnitDocuments: MockDbClientUnitDocument[] = mockDbClientUnits.flatMap((clientUnit, unitIndex) =>
  mockDbDocuments.map((document, documentIndex) => {
    const isApproved = clientUnit.document_status === 'complete' || documentIndex < 3
    return {
      id: unitIndex * mockDbDocuments.length + document.id,
      client_unit_id: clientUnit.id,
      document_id: document.id,
      file_url: `/mock-documents/client-unit-${clientUnit.id}/document-${document.id}.pdf`,
      status: isApproved ? 'approved' : 'pending',
      reviewed_by: 2,
      reviewed_at: mockDbUpdatedAt,
      created_at: clientUnit.created_at,
      updated_at: mockDbUpdatedAt,
    }
  }),
)

export const mockDbPayments: MockDbPayment[] = [
  { id: 1, client_unit_id: 1, payment_date: '2026-01-15', amount: 10000, payment_type: 'reservation', payment_method: 'bank_deposit', bank_name: 'BDO', reference_no: 'BDO-00101', status: 'verified', verified_by: 2, verified_at: timestamp('2026-01-15'), remarks: 'Reservation fee.', created_at: timestamp('2026-01-15'), updated_at: mockDbUpdatedAt },
  { id: 2, client_unit_id: 1, payment_date: '2026-02-15', amount: 170000, payment_type: 'downpayment', payment_method: 'bank_deposit', bank_name: 'BPI', reference_no: 'BPI-00102', status: 'verified', verified_by: 2, verified_at: timestamp('2026-02-15'), remarks: 'Initial downpayment.', created_at: timestamp('2026-02-15'), updated_at: mockDbUpdatedAt },
  { id: 3, client_unit_id: 1, payment_date: '2026-03-15', amount: 100000, payment_type: 'monthly', payment_method: 'cash', bank_name: 'Cash Office', reference_no: 'OR-00103', status: 'verified', verified_by: 2, verified_at: timestamp('2026-03-15'), remarks: 'Monthly amortization.', created_at: timestamp('2026-03-15'), updated_at: mockDbUpdatedAt },
  { id: 4, client_unit_id: 2, payment_date: '2026-02-10', amount: 1161600, payment_type: 'full_payment', payment_method: 'check', bank_name: 'Metrobank', reference_no: 'MBTC-00201', status: 'verified', verified_by: 2, verified_at: timestamp('2026-02-10'), remarks: 'Full cash payment.', created_at: timestamp('2026-02-10'), updated_at: mockDbUpdatedAt },
  { id: 5, client_unit_id: 3, payment_date: '2026-03-05', amount: 10000, payment_type: 'reservation', payment_method: 'bank_deposit', bank_name: 'UnionBank', reference_no: 'UB-00301', status: 'verified', verified_by: 2, verified_at: timestamp('2026-03-05'), remarks: 'Reservation fee.', created_at: timestamp('2026-03-05'), updated_at: mockDbUpdatedAt },
]

export const mockDbPaymentSchedules: MockDbPaymentSchedule[] = [
  { id: 1, client_unit_id: 1, due_date: '2026-01-15', description: 'Reservation Fee', due_amount: 10000, penalty: 0, status: 'paid', created_at: timestamp('2026-01-15'), updated_at: mockDbUpdatedAt },
  { id: 2, client_unit_id: 1, due_date: '2026-02-15', description: 'Downpayment', due_amount: 170000, penalty: 0, status: 'paid', created_at: timestamp('2026-02-15'), updated_at: mockDbUpdatedAt },
  { id: 3, client_unit_id: 1, due_date: '2026-03-15', description: 'Monthly Amortization', due_amount: 100000, penalty: 0, status: 'paid', created_at: timestamp('2026-03-15'), updated_at: mockDbUpdatedAt },
  { id: 4, client_unit_id: 1, due_date: '2026-04-15', description: 'Monthly Amortization', due_amount: 11000, penalty: 750, status: 'overdue', created_at: timestamp('2026-04-15'), updated_at: mockDbUpdatedAt },
  { id: 5, client_unit_id: 2, due_date: '2026-02-10', description: 'Full Payment', due_amount: 1161600, penalty: 0, status: 'paid', created_at: timestamp('2026-02-10'), updated_at: mockDbUpdatedAt },
  { id: 6, client_unit_id: 3, due_date: '2026-03-05', description: 'Reservation Fee', due_amount: 10000, penalty: 0, status: 'paid', created_at: timestamp('2026-03-05'), updated_at: mockDbUpdatedAt },
  { id: 7, client_unit_id: 3, due_date: '2026-04-05', description: 'Downpayment', due_amount: 194600, penalty: 1500, status: 'overdue', created_at: timestamp('2026-04-05'), updated_at: mockDbUpdatedAt },
]

export const mockDbCommissionPlans: MockDbCommissionPlan[] = [
  { id: 1, project_id: 1, name: 'Standard Residential Plan', direct_agent_rate: 7, distributed_agent_rate: 2, manager_rate: 5, status: 'active', created_at: mockDbCreatedAt, updated_at: mockDbUpdatedAt },
]

export const mockDbCommissions: MockDbCommission[] = mockDbClientUnitSellers.map((seller, index) => {
  const clientUnit = mockDbClientUnits.find((unit) => unit.id === seller.client_unit_id) ?? mockDbClientUnits[0]
  const plan = mockDbCommissionPlans[0]
  const rate = seller.role === 'agent' ? plan.direct_agent_rate : seller.role === 'broker' ? plan.distributed_agent_rate : plan.manager_rate
  const status: MockDbCommissionStatus = clientUnit.payment_status === 'complete_paid' ? 'released' : clientUnit.payment_status === 'partially_paid' ? 'approved' : 'pending'
  return {
    id: index + 1,
    client_unit_id: seller.client_unit_id,
    user_id: seller.user_id,
    commission_type: seller.role,
    sale_type: seller.role === 'agent' ? 'direct' : 'distributed',
    rate,
    gross_commission: roundMockCurrency(((clientUnit.contract_price ?? 0) * rate) / 100),
    status,
    approved_by: 1,
    approved_at: mockDbUpdatedAt,
    created_at: clientUnit.created_at,
    updated_at: mockDbUpdatedAt,
  }
})

export const mockDbCashAdvances: MockDbCashAdvance[] = [
  { id: 1, user_id: 5, client_unit_id: 1, commission_id: 1, amount: 15000, reason: 'Transportation and document follow-up allowance.', status: 'partially_deducted', approved_by: 1, approved_at: timestamp('2026-03-10'), created_at: timestamp('2026-03-08'), updated_at: mockDbUpdatedAt },
  { id: 2, user_id: 6, client_unit_id: 2, commission_id: 4, amount: 10000, reason: 'Closing allowance for cash buyer.', status: 'approved', approved_by: 1, approved_at: timestamp('2026-02-12'), created_at: timestamp('2026-02-11'), updated_at: mockDbUpdatedAt },
]

export const mockDbCommissionReleases: MockDbCommissionRelease[] = [
  { id: 1, commission_id: 1, release_stage: 'first_20', release_percentage: 20, gross_release_amount: 11340, cash_advance_deduction: 5000, net_release_amount: 6340, released_by: 2, released_at: timestamp('2026-03-20'), remarks: 'First release after payment threshold.' },
  { id: 2, commission_id: 2, release_stage: 'first_20', release_percentage: 20, gross_release_amount: 3240, cash_advance_deduction: 0, net_release_amount: 3240, released_by: 2, released_at: timestamp('2026-03-20'), remarks: 'Broker first release.' },
  { id: 3, commission_id: 4, release_stage: 'first_20', release_percentage: 20, gross_release_amount: 14784, cash_advance_deduction: 0, net_release_amount: 14784, released_by: 2, released_at: timestamp('2026-02-20'), remarks: 'Cash sale release.' },
]

export const mockDbCashAdvanceDeductions: MockDbCashAdvanceDeduction[] = [
  { id: 1, cash_advance_id: 1, commission_release_id: 1, deducted_amount: 5000, created_at: timestamp('2026-03-20') },
]

export const mockDbAppFeatures: MockDbAppFeature[] = Object.entries(featureLabels).map(([featureKey, label], index) => ({
  id: index + 1,
  feature_key: featureKey,
  module_name: label.split(':')[0],
  display_name: label,
  created_at: mockDbCreatedAt,
}))

export const mockDbRoleFeaturePermissions: MockDbRoleFeaturePermission[] = mockDbUserRoles.flatMap((role) =>
  mockDbAppFeatures.map((feature, index) => ({
    id: (role.id - 1) * mockDbAppFeatures.length + index + 1,
    role: role.name,
    feature_id: feature.id,
    can_access: role.name === 'admin' || role.name === 'owner' || Boolean(rolePresets[role.name as Exclude<Role, 'owner' | 'admin'>]?.[feature.feature_key as FeatureKey]),
    created_at: mockDbCreatedAt,
  })),
)

export const mockDbUserFeaturePermissions: MockDbUserFeaturePermission[] = users.map((user, index) => ({
  id: index + 1,
  user_id: user.id,
  feature_id: 1,
  can_access: true,
  granted_by: 1,
  created_at: mockDbCreatedAt,
}))

export const mockDbAuditLogs: MockDbAuditLog[] = auditLogsV2.map((log, index) => ({
  id: index + 1,
  user_id: index === 1 ? 5 : 1,
  action: log.action,
  module_name: log.module,
  entity_table: log.module.toLowerCase(),
  entity_id: index + 1,
  old_values: {},
  new_values: { details: log.details },
  ip_address: log.ipAddress,
  created_at: log.timestamp,
}))

export const dcPrimeMockDb = {
  users: mockDbUsers,
  user_supervisors: mockDbUserSupervisors,
  projects: mockDbProjects,
  listings: mockDbListings,
  clients: mockDbClients,
  client_units: mockDbClientUnits,
  documents: mockDbDocuments,
  client_unit_documents: mockDbClientUnitDocuments,
  payments: mockDbPayments,
  payment_schedules: mockDbPaymentSchedules,
  commission_plans: mockDbCommissionPlans,
  commissions: mockDbCommissions,
  cash_advances: mockDbCashAdvances,
  commission_releases: mockDbCommissionReleases,
  cash_advance_deductions: mockDbCashAdvanceDeductions,
  reservations: mockDbReservations,
  client_unit_sellers: mockDbClientUnitSellers,
  project_documents: mockDbProjectDocuments,
  app_features: mockDbAppFeatures,
  role_feature_permissions: mockDbRoleFeaturePermissions,
  user_feature_permissions: mockDbUserFeaturePermissions,
  system_settings: mockDbSettings,
  lot_types: mockDbLotTypes,
  payment_methods: mockDbPaymentMethods,
  payment_types: mockDbPaymentTypes,
  payment_modes: mockDbPaymentModes,
  commission_types: mockDbCommissionTypes,
  user_roles: mockDbUserRoles,
  client_statuses: mockDbClientStatuses,
  listing_statuses: mockDbListingStatuses,
  audit_logs: mockDbAuditLogs,
}

function lookupId<T extends { id: number; name: string }>(rows: T[], name: string, fallbackId = 1) {
  return rows.find((row) => row.name === name)?.id ?? fallbackId
}

export function getListingStatus(statusNameOrId: MockDbListingStatusName | number): MockDbListingStatus {
  return typeof statusNameOrId === 'number'
    ? mockDbListingStatuses.find((status) => status.id === statusNameOrId) ?? mockDbListingStatuses[0]
    : mockDbListingStatuses.find((status) => status.name === statusNameOrId) ?? mockDbListingStatuses[0]
}

export function getClientStatus(statusNameOrId: MockDbClientLifecycleStatus | number): MockDbClientStatus {
  return typeof statusNameOrId === 'number'
    ? mockDbClientStatuses.find((status) => status.id === statusNameOrId) ?? mockDbClientStatuses[0]
    : mockDbClientStatuses.find((status) => status.name === statusNameOrId) ?? mockDbClientStatuses[0]
}

export function getLotType(nameOrId: string | number | null | undefined): MockDbLotType {
  if (typeof nameOrId === 'number') return mockDbLotTypes.find((lotType) => lotType.id === nameOrId) ?? mockDbLotTypes[0]
  return mockDbLotTypes.find((lotType) => lotType.name === nameOrId) ?? mockDbLotTypes[0]
}

export function getUserRole(nameOrId: Role | number): MockDbUserRole {
  return typeof nameOrId === 'number'
    ? mockDbUserRoles.find((role) => role.id === nameOrId) ?? mockDbUserRoles[0]
    : mockDbUserRoles.find((role) => role.name === nameOrId) ?? mockDbUserRoles[0]
}

export function getUserRoleId(name: string): number {
  return lookupId(mockDbUserRoles, name)
}

export function getListingStatusId(name: string): MockDbListingStatusName {
  return (mockDbListingStatuses.find((status) => status.name === name)?.name ?? 'available') as MockDbListingStatusName
}

export function getClientStatusId(name: string): MockDbClientLifecycleStatus {
  return (mockDbClientStatuses.find((status) => status.name === name)?.name ?? 'lead') as MockDbClientLifecycleStatus
}

export function getPaymentTypeId(name: string): number {
  return lookupId(mockDbPaymentTypes, name)
}

export function getPaymentMethodId(name: string): number {
  return lookupId(mockDbPaymentMethods, name)
}

export function getPaymentModeId(name: string): number {
  return lookupId(mockDbPaymentModes, name)
}

export function getCommissionTypeId(name: MockDbSellerRole): number {
  return lookupId(mockDbCommissionTypes, name)
}

export function getSellersForClientUnit(clientUnitId: number): {
  agent: MockDbUser | null
  broker: MockDbUser | null
  manager: MockDbUser | null
} {
  const sellers = mockDbClientUnitSellers.filter((seller) => seller.client_unit_id === clientUnitId)
  const userByRole = (role: MockDbSellerRole) => {
    const seller = sellers.find((item) => item.role === role)
    return mockDbUsers.find((user) => user.id === seller?.user_id) ?? null
  }

  return {
    agent: userByRole('agent'),
    broker: userByRole('broker'),
    manager: userByRole('manager'),
  }
}

export function getActiveReservation(listingId: number): MockDbReservation | null {
  return mockDbReservations.find((reservation) =>
    reservation.listing_id === listingId && (reservation.status === 'pending' || reservation.status === 'confirmed'),
  ) ?? null
}

export function getClientUnitsForClient(clientId: number): MockDbClientUnit[] {
  return mockDbClientUnits.filter((clientUnit) => clientUnit.client_id === clientId)
}

export function getClientLifecycleStatus(
  clientId: number,
  clientUnits: MockDbClientUnit[] = mockDbClientUnits,
): MockDbClientStatus {
  const units = clientUnits.filter((clientUnit) => clientUnit.client_id === clientId)
  if (units.length === 0) {
    const hasReservation = mockDbReservations.some((reservation) => reservation.client_id === clientId && reservation.status !== 'cancelled')
    return getClientStatus(hasReservation ? 'reserved' : 'lead')
  }
  if (units.some((clientUnit) => clientUnit.account_status === 'cancelled' || clientUnit.sales_status === 'cancelled')) return getClientStatus('cancelled')
  if (units.every((clientUnit) => clientUnit.payment_status === 'complete_paid' || clientUnit.account_status === 'closed')) return getClientStatus('completed')
  if (units.some((clientUnit) => clientUnit.payment_status === 'partially_paid' || clientUnit.account_status === 'active')) return getClientStatus('active')
  return getClientStatus('reserved')
}

export function computeCommissions(clientUnitId: number): Array<{
  user_id: number
  commission_type: MockDbSellerRole
  sale_type: MockDbCommissionSaleType
  rate: number
  gross_commission: number
}> {
  const clientUnit = mockDbClientUnits.find((item) => item.id === clientUnitId)
  const listing = mockDbListings.find((item) => item.id === clientUnit?.listing_id)
  const plan = mockDbCommissionPlans.find((item) => item.project_id === listing?.project_id)
  if (!clientUnit || !listing || !plan) return []

  const sellingPrice = clientUnit.contract_price ?? clientUnit.total_contract_price ?? 0
  const rateByRole: Record<MockDbSellerRole, number> = {
    agent: plan.direct_agent_rate,
    broker: plan.distributed_agent_rate,
    manager: plan.manager_rate,
  }

  return mockDbClientUnitSellers
    .filter((seller) => seller.client_unit_id === clientUnitId)
    .map((seller) => ({
      user_id: seller.user_id,
      commission_type: seller.role,
      sale_type: seller.role === 'agent' ? 'direct' : 'distributed',
      rate: rateByRole[seller.role],
      gross_commission: roundMockCurrency((sellingPrice * rateByRole[seller.role]) / 100),
    }))
}

export function getScheduleSummary(clientUnitId: number): {
  total: number
  paid: number
  overdue: number
  remaining: number
} {
  const schedules = readMockStorage(mockStorageKeys.paymentSchedules, mockDbPaymentSchedules)
    .filter((schedule) => schedule.client_unit_id === clientUnitId)
  return schedules.reduce(
    (summary, schedule) => {
      const scheduledAmount = roundMockCurrency(schedule.due_amount + schedule.penalty)
      const paidAmount = schedule.status === 'paid' ? scheduledAmount : schedule.status === 'partial' ? roundMockCurrency(scheduledAmount / 2) : 0
      const balance = roundMockCurrency(Math.max(scheduledAmount - paidAmount, 0))

      return {
        total: roundMockCurrency(summary.total + scheduledAmount),
        paid: roundMockCurrency(summary.paid + paidAmount),
        overdue: roundMockCurrency(summary.overdue + (schedule.status === 'overdue' ? balance : 0)),
        remaining: roundMockCurrency(summary.remaining + balance),
      }
    },
    { total: 0, paid: 0, overdue: 0, remaining: 0 },
  )
}

export function getNextMockId(rows: Array<{ id: number }>) {
  return Math.max(0, ...rows.map((row) => row.id)) + 1
}

export function createMockDbAuditLog(action: string, moduleName: string, description: string, id = Date.now()): MockDbAuditLog {
  return {
    id,
    user_id: 1,
    action,
    module_name: moduleName,
    entity_table: moduleName.toLowerCase(),
    entity_id: id,
    old_values: {},
    new_values: { description },
    ip_address: '127.0.0.1',
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
  }
}
