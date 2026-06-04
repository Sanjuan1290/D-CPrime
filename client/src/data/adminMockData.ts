export type Role = 'admin' | 'agent' | 'treasury' | 'client'
export type UserStatus = 'Active' | 'Inactive'
export type FeatureKey = keyof typeof featureLabels

export const mockDataVersion = 'source-workbook-v4'

export function ensureMockDataVersion() {
  if (typeof localStorage === 'undefined') return

  const versionKey = 'dcprime_data_version'
  if (localStorage.getItem(versionKey) === mockDataVersion) return

  ;['dcprime_clients', 'dcprime_listings', 'dcprime_projects', 'dcprime_commission_rules', 'dcprime_users'].forEach((key) =>
    localStorage.removeItem(key),
  )
  localStorage.setItem(versionKey, mockDataVersion)
}

export const company = {
  name: 'D&C Prime Realty',
  address: 'Mataas na Lupa, Indang, Cavite, 4122 Philippines',
  phone: '(046) 866-0616',
  propertyAddress: 'Gen. Emilio Aguinaldo, Cavite',
  preparedBy: 'KIRSTEN JHOYCE A. RIOJA',
  preparedByPosition: 'Administration Head',
}

export const featureLabels = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  listings: 'Listings',
  clients_view: 'Clients: View',
  clients_manage: 'Clients: Manage',
  payments_view: 'Payments: View',
  payments_record: 'Payments: Record',
  payments_verify: 'Payments: Verify',
  commissions_view: 'Commissions: View',
  commissions_approve: 'Commissions: Approve',
  commissions_release: 'Commissions: Release',
  documents_view: 'Documents: View',
  documents_upload: 'Documents: Upload',
  documents_approve: 'Documents: Approve',
  soa_view: 'SOA: View',
  reports_view: 'Reports',
  audit_logs: 'Audit Logs',
  user_management: 'User Management',
  settings: 'Settings',
}

export const featureKeys = Object.keys(featureLabels) as FeatureKey[]

const allOff = Object.fromEntries(featureKeys.map((key) => [key, false])) as Record<FeatureKey, boolean>
const allOn = Object.fromEntries(featureKeys.map((key) => [key, true])) as Record<FeatureKey, boolean>

export const rolePresets: Record<Exclude<Role, 'admin'>, Record<FeatureKey, boolean>> = {
  agent: {
    ...allOff,
    dashboard: true,
    listings: true,
    clients_view: true,
    payments_view: true,
    commissions_view: true,
    documents_view: true,
    documents_upload: true,
    soa_view: true,
  },
  treasury: {
    ...allOff,
    dashboard: true,
    clients_view: true,
    payments_view: true,
    payments_record: true,
    payments_verify: true,
    documents_view: true,
    soa_view: true,
    reports_view: true,
  },
  client: {
    ...allOff,
    dashboard: true,
    payments_view: true,
    documents_view: true,
    documents_upload: true,
    soa_view: true,
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

export const users: AdminUser[] = [
  {
    id: 1,
    fullName: 'Admin User',
    email: 'admin@dcprime.test',
    password: 'Admin123!',
    role: 'admin',
    assignedProjects: ['Gen. Emilio Aguinaldo, Cavite'],
    status: 'Active',
    permissions: allOn,
  },
  {
    id: 2,
    fullName: 'SARTE, JOHN CHRISTOPHER',
    email: 'sarte.john@dcprime.test',
    password: 'Agent123!',
    role: 'agent',
    assignedProjects: ['Gen. Emilio Aguinaldo, Cavite'],
    status: 'Active',
    permissions: rolePresets.agent,
  },
  {
    id: 3,
    fullName: 'KIRSTEN JHOYCE A. RIOJA',
    email: 'treasury@dcprime.test',
    password: 'Treasury123!',
    role: 'treasury',
    assignedProjects: ['Gen. Emilio Aguinaldo, Cavite'],
    status: 'Active',
    permissions: rolePresets.treasury,
  },
]

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
  agentId: string
  agentRate: number
  managerRate: number
  releaseThreshold: number
  retentionRate: number
  status: 'Active' | 'Paused'
}

const canonicalListings: Listing[] = [
  {
    "unitId": "LA-0101",
    "block": "1",
    "lotType": "END",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0102",
    "block": "1",
    "lotType": "INNER",
    "area": 1200.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 1440000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 1584000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0103",
    "block": "1",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0104",
    "block": "1",
    "lotType": "CORNER",
    "area": 529.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 529000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 581900.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0201",
    "block": "2",
    "lotType": "END",
    "area": 400.0,
    "pricePerSqm": 2300.0,
    "netSellingPrice": 920000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 1012000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0202",
    "block": "2",
    "lotType": "INNER",
    "area": 400.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 400000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 440000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0203",
    "block": "2",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 450000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 495000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0204",
    "block": "2",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0205",
    "block": "2",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 396000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0206",
    "block": "2",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 396000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0207",
    "block": "2",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 396000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0208",
    "block": "2",
    "lotType": "END",
    "area": 300.0,
    "pricePerSqm": 2300.0,
    "netSellingPrice": 690000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 759000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0208",
    "block": "",
    "lotType": "END",
    "area": 300.0,
    "pricePerSqm": 2600.0,
    "netSellingPrice": 780000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 858000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0301",
    "block": "3",
    "lotType": "CORNER",
    "area": 546.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 655200.0,
    "legalMiscFee": 0,
    "totalContractPrice": 655200.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0302",
    "block": "3",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0303",
    "block": "3",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0304",
    "block": "3",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0305",
    "block": "3",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0306",
    "block": "3",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 396000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0307",
    "block": "3",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0308",
    "block": "3",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 396000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0309",
    "block": "3",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0310",
    "block": "3",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0311",
    "block": "3",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 396000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0312",
    "block": "3",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0313",
    "block": "3",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 396000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0314",
    "block": "3",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0315",
    "block": "3",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 396000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0401",
    "block": "4",
    "lotType": "END",
    "area": 300.0,
    "pricePerSqm": 2300.0,
    "netSellingPrice": 690000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 759000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0401",
    "block": "",
    "lotType": "Installment",
    "area": 0,
    "pricePerSqm": 0,
    "netSellingPrice": 0,
    "legalMiscFee": 0,
    "totalContractPrice": 0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0401",
    "block": "",
    "lotType": "END",
    "area": 300.0,
    "pricePerSqm": 2600.0,
    "netSellingPrice": 780000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 858000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0402",
    "block": "4",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0403",
    "block": "4",
    "lotType": "INNER",
    "area": 1200.0,
    "pricePerSqm": 1900.0,
    "netSellingPrice": 2280000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 2508000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0404",
    "block": "4",
    "lotType": "INNER",
    "area": 1200.0,
    "pricePerSqm": 1700.0,
    "netSellingPrice": 2040000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 2244000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0405",
    "block": "4",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1600.0,
    "netSellingPrice": 480000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 528000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0406",
    "block": "4",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1600.0,
    "netSellingPrice": 480000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 528000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0407",
    "block": "4",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1800.0,
    "netSellingPrice": 540000.0,
    "legalMiscFee": 0,
    "totalContractPrice": 540000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0408",
    "block": "4",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1400.0,
    "netSellingPrice": 420000.0,
    "legalMiscFee": 0,
    "totalContractPrice": 420000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0409",
    "block": "4",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1400.0,
    "netSellingPrice": 420000.0,
    "legalMiscFee": 0,
    "totalContractPrice": 420000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0410",
    "block": "4",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1800.0,
    "netSellingPrice": 540000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 594000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0411",
    "block": "4",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1600.0,
    "netSellingPrice": 480000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 528000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0412",
    "block": "4",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1600.0,
    "netSellingPrice": 480000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 528000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0413",
    "block": "4",
    "lotType": "END",
    "area": 374.0,
    "pricePerSqm": 1600.0,
    "netSellingPrice": 598400.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 658240.0,
    "status": "Hold"
  },
  {
    "unitId": "LA-0414",
    "block": "4",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1600.0,
    "netSellingPrice": 480000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 528000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0415",
    "block": "4",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1600.0,
    "netSellingPrice": 480000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 528000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0501",
    "block": "5",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 450000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 495000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0502",
    "block": "5",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1900.0,
    "netSellingPrice": 570000.0,
    "legalMiscFee": 0,
    "totalContractPrice": 570000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0503",
    "block": "5",
    "lotType": "INNER",
    "area": 600.0,
    "pricePerSqm": 1900.0,
    "netSellingPrice": 1140000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 1254000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0503",
    "block": "",
    "lotType": "Installment",
    "area": 0,
    "pricePerSqm": 0,
    "netSellingPrice": 0,
    "legalMiscFee": 0,
    "totalContractPrice": 0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0503",
    "block": "",
    "lotType": "INNER",
    "area": 600.0,
    "pricePerSqm": 2200.0,
    "netSellingPrice": 1320000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 1452000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0504",
    "block": "5",
    "lotType": "CORNER",
    "area": 1200.0,
    "pricePerSqm": 2400.0,
    "netSellingPrice": 2880000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 3168000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0504",
    "block": "",
    "lotType": "CORNER",
    "area": 1200.0,
    "pricePerSqm": 2700.0,
    "netSellingPrice": 3240000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 3564000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0601",
    "block": "6",
    "lotType": "CORNER",
    "area": 405.0,
    "pricePerSqm": 2400.0,
    "netSellingPrice": 972000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 1069200.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0601",
    "block": "",
    "lotType": "CORNER",
    "area": 405.0,
    "pricePerSqm": 2700.0,
    "netSellingPrice": 1093500.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 1202850.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0602",
    "block": "6",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 450000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 495000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0603",
    "block": "6",
    "lotType": "INNER",
    "area": 495.0,
    "pricePerSqm": 1900.0,
    "netSellingPrice": 940500.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 1034550.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0603",
    "block": "",
    "lotType": "INNER",
    "area": 495.0,
    "pricePerSqm": 2200.0,
    "netSellingPrice": 1089000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 1197900.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0604",
    "block": "6",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1900.0,
    "netSellingPrice": 570000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 627000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0604",
    "block": "",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 2200.0,
    "netSellingPrice": 660000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 726000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0605",
    "block": "6",
    "lotType": "END",
    "area": 366.0,
    "pricePerSqm": 2300.0,
    "netSellingPrice": 841800.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 925980.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0605",
    "block": "",
    "lotType": "END",
    "area": 366.0,
    "pricePerSqm": 2600.0,
    "netSellingPrice": 951600.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 1046760.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0606",
    "block": "",
    "lotType": "END",
    "area": 300.0,
    "pricePerSqm": 2300.0,
    "netSellingPrice": 690000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 759000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0606",
    "block": "",
    "lotType": "END",
    "area": 300.0,
    "pricePerSqm": 2600.0,
    "netSellingPrice": 780000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 858000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0701",
    "block": "7",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 2400.0,
    "netSellingPrice": 720000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 792000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0701",
    "block": "",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 2700.0,
    "netSellingPrice": 810000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 891000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0702",
    "block": "7",
    "lotType": "END",
    "area": 300.0,
    "pricePerSqm": 2300.0,
    "netSellingPrice": 690000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 759000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0702",
    "block": "",
    "lotType": "END",
    "area": 300.0,
    "pricePerSqm": 2600.0,
    "netSellingPrice": 780000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 858000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0703",
    "block": "7",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1900.0,
    "netSellingPrice": 570000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 627000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0703",
    "block": "",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 2200.0,
    "netSellingPrice": 660000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 726000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0704",
    "block": "7",
    "lotType": "END",
    "area": 311.0,
    "pricePerSqm": 1700.0,
    "netSellingPrice": 528700.0,
    "legalMiscFee": 0,
    "totalContractPrice": 528700.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0801",
    "block": "8",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1299.0,
    "netSellingPrice": 389700.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 428670.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0802",
    "block": "8",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 2200.0,
    "netSellingPrice": 660000.0,
    "legalMiscFee": 0,
    "totalContractPrice": 660000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0803",
    "block": "8",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 450000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 495000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0804",
    "block": "8",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1400.0,
    "netSellingPrice": 420000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 462000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0805",
    "block": "8",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 450000.0,
    "legalMiscFee": 0,
    "totalContractPrice": 450000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0806",
    "block": "8",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 2200.0,
    "netSellingPrice": 660000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 726000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0807",
    "block": "8",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 2000.0,
    "netSellingPrice": 600000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 660000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0808",
    "block": "8",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 2000.0,
    "netSellingPrice": 600000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 660000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0809",
    "block": "8",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 2000.0,
    "netSellingPrice": 600000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 660000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0810",
    "block": "8",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 2000.0,
    "netSellingPrice": 600000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 660000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0811",
    "block": "8",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 450000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 495000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0812",
    "block": "8",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 396000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0813",
    "block": "8",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 450000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 495000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0814",
    "block": "8",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 396000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0815",
    "block": "8",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1900.0,
    "netSellingPrice": 570000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 627000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0815",
    "block": "",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 2200.0,
    "netSellingPrice": 660000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 726000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0816",
    "block": "8",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 396000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0817",
    "block": "8",
    "lotType": "INNER",
    "area": 394.0,
    "pricePerSqm": 1900.0,
    "netSellingPrice": 748600.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 823460.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0817",
    "block": "",
    "lotType": "INNER",
    "area": 394.0,
    "pricePerSqm": 2200.0,
    "netSellingPrice": 866800.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 953480.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0818",
    "block": "8",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0819",
    "block": "8",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0901",
    "block": "9",
    "lotType": "CORNER",
    "area": 320.0,
    "pricePerSqm": 2400.0,
    "netSellingPrice": 768000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 844800.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0901",
    "block": "",
    "lotType": "CORNER",
    "area": 320.0,
    "pricePerSqm": 2700.0,
    "netSellingPrice": 864000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 950400.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0902",
    "block": "9",
    "lotType": "CORNER",
    "area": 334.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 334000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 367400.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0903",
    "block": "9",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1400.0,
    "netSellingPrice": 420000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 462000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0903",
    "block": "",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 2200.0,
    "netSellingPrice": 660000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 726000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0904",
    "block": "9",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1400.0,
    "netSellingPrice": 420000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 462000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0904",
    "block": "",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 2200.0,
    "netSellingPrice": 660000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 726000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0905",
    "block": "9",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1400.0,
    "netSellingPrice": 420000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 462000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-0905",
    "block": "",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 2200.0,
    "netSellingPrice": 660000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 726000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-0906",
    "block": "9",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1400.0,
    "netSellingPrice": 420000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 462000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0907",
    "block": "9",
    "lotType": "END",
    "area": 327.0,
    "pricePerSqm": 1400.0,
    "netSellingPrice": 457800.0,
    "legalMiscFee": 0,
    "totalContractPrice": 457800.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-0908",
    "block": "9",
    "lotType": "END",
    "area": 327.0,
    "pricePerSqm": 1400.0,
    "netSellingPrice": 457800.0,
    "legalMiscFee": 0,
    "totalContractPrice": 457800.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1001",
    "block": "10",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1002",
    "block": "10",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1003",
    "block": "10",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1004",
    "block": "10",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1005",
    "block": "10",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1006",
    "block": "10",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-1007",
    "block": "10",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-1008",
    "block": "10",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-1009",
    "block": "10",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-1010",
    "block": "10",
    "lotType": "END",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-1101",
    "block": "11",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0,
    "totalContractPrice": 300000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1102",
    "block": "11",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0,
    "totalContractPrice": 300000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1103",
    "block": "11",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0,
    "totalContractPrice": 300000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1104",
    "block": "11",
    "lotType": "END",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0,
    "totalContractPrice": 300000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1105",
    "block": "11",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0,
    "totalContractPrice": 300000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1106",
    "block": "11",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0,
    "totalContractPrice": 300000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1107",
    "block": "11",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1108",
    "block": "11",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1109",
    "block": "11",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-1110",
    "block": "11",
    "lotType": "END",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-1201",
    "block": "12",
    "lotType": "CORNER",
    "area": 450.0,
    "pricePerSqm": 1600.0,
    "netSellingPrice": 720000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 792000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1202",
    "block": "12",
    "lotType": "END",
    "area": 430.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 430000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 473000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1203",
    "block": "12",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1600.0,
    "netSellingPrice": 480000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 528000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1204",
    "block": "12",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1600.0,
    "netSellingPrice": 480000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 528000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1205",
    "block": "12",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1206",
    "block": "12",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1900.0,
    "netSellingPrice": 570000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 627000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1207",
    "block": "12",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1600.0,
    "netSellingPrice": 480000.0,
    "legalMiscFee": 0,
    "totalContractPrice": 480000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1208",
    "block": "12",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1900.0,
    "netSellingPrice": 570000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 627000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-1208",
    "block": "",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 2200.0,
    "netSellingPrice": 660000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 726000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-1209",
    "block": "12",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1800.0,
    "netSellingPrice": 540000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 594000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1210",
    "block": "12",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 396000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1211",
    "block": "12",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1212",
    "block": "12",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1501",
    "block": "15",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1502",
    "block": "15",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1503",
    "block": "15",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1504",
    "block": "15",
    "lotType": "END",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 396000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1505",
    "block": "15",
    "lotType": "INNER",
    "area": 1000.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 1000000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 1100000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1506",
    "block": "15",
    "lotType": "CORNER",
    "area": 2400.0,
    "pricePerSqm": 0,
    "netSellingPrice": 0.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 0.0,
    "status": "Hold"
  },
  {
    "unitId": "LA-1601",
    "block": "16",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1602",
    "block": "16",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1603",
    "block": "16",
    "lotType": "INNER",
    "area": 1200.0,
    "pricePerSqm": 1100.0,
    "netSellingPrice": 1320000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 1452000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1604",
    "block": "16",
    "lotType": "CORNER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 330000.0,
    "status": "Sold"
  },
  {
    "unitId": "LA-1605",
    "block": "16",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1900.0,
    "netSellingPrice": 570000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 627000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-1605",
    "block": "",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 2200.0,
    "netSellingPrice": 660000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 726000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-1606",
    "block": "16",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 1900.0,
    "netSellingPrice": 570000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 627000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-1606",
    "block": "",
    "lotType": "INNER",
    "area": 300.0,
    "pricePerSqm": 2200.0,
    "netSellingPrice": 660000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 726000.0,
    "status": "Unspecified"
  },
  {
    "unitId": "LA-1607",
    "block": "16",
    "lotType": "END",
    "area": 300.0,
    "pricePerSqm": 2300.0,
    "netSellingPrice": 690000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 759000.0,
    "status": "Available"
  },
  {
    "unitId": "LA-1607",
    "block": "",
    "lotType": "END",
    "area": 300.0,
    "pricePerSqm": 2600.0,
    "netSellingPrice": 780000.0,
    "legalMiscFee": 0.1,
    "totalContractPrice": 858000.0,
    "status": "Unspecified"
  }
]
const canonicalClients: ClientRecord[] = [
  {
    "reservationDate": "01/21/2025",
    "buyer": "SILVA, ISABEL LAYUG L.",
    "spouse": "SILVA, EDWARD JAMES M.",
    "unitId": "LA-0204",
    "relocatedUnit": "LA-0104 (CORNER)",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 446.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 490600.0,
    "paymentMode": "CASH",
    "paymentMade": 490600.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0939-938-0205",
    "email": "johnmateosilva@gmail.com",
    "address": "GEN. TRI CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "01/25/2025",
    "buyer": "RABAGO, ELIZABETH L.",
    "spouse": "RABAGO, DOMINADOR S.",
    "unitId": "LA-0401",
    "relocatedUnit": "LA-0302 COMB, COR.",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 546.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 655200.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 655200.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "documentStatus": "INC",
    "contactNo": "0917-324-5227",
    "email": "dannybeth21@yahoo.com",
    "address": "TAGUIG CITY",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "01/25/2025",
    "buyer": "CABISON, AVA MAXINE E.",
    "spouse": "CABISON, MICHAEL",
    "unitId": "LA-0403",
    "relocatedUnit": "LA-0301 (CORNER)",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 330000.0,
    "paymentMode": "CASH",
    "paymentMade": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0919-098-5314",
    "email": "cherrymaecabison228@yahoo.com",
    "address": "GEN. TRI CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "01/25/2025",
    "buyer": "CABISON, SOPHIA CLAIRE E.",
    "spouse": "CABISON, CHERRY MAE E.",
    "unitId": "LA-0404",
    "relocatedUnit": "LA-0303",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 330000.0,
    "paymentMode": "CASH",
    "paymentMade": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0919-098-5314",
    "email": "cherrymaecabison228@yahoo.com",
    "address": "GEN. TRI CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "01/26/2025",
    "buyer": "AQUINO, JAYMILYN BERNARDO",
    "unitId": "LA-0103",
    "relocatedUnit": "LA-1602 (INNER)",
    "agent": "GERO, STANLEY",
    "manager": "GERO, STANLEY",
    "area": 466.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 512600.0,
    "paymentMode": "CASH",
    "paymentMade": 512600.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0997-419-7271",
    "email": "jaymilynaquino011788@gmail.com",
    "address": "BACOOR, CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "01/29/2025",
    "buyer": "DIZON, ELORA ANDREI",
    "spouse": "DIZON, ROBIEMERZ",
    "unitId": "LA-0416",
    "relocatedUnit": "LA-0315",
    "agent": "MOJICA, JONATHAN",
    "manager": "HERNANDEZ, JULIE ANN",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 396000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 341640.0,
    "balance": 54360.0,
    "paymentPercentage": 0.949,
    "documentStatus": "INC",
    "contactNo": "0917-113-9345",
    "email": "robiemerz@gmail.com",
    "address": "ROSARIO CAVITE",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "01/31/2025",
    "buyer": "DACAYO, JENNIFER MOROJO",
    "spouse": "DACAYO, LARRY SIEGFRIED A.",
    "unitId": "LA-0101",
    "relocatedUnit": "LA-1601 ( CORNER)",
    "agent": "HERNANDEZ, JULIE ANN",
    "manager": "HERNANDEZ, JULIE ANN",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 330000.0,
    "paymentMode": "CASH",
    "paymentMade": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0991-956-7302",
    "email": "jhemorojo@gmail.com",
    "address": "IMUS, CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "01/31/2025",
    "buyer": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "relocatedUnit": "LA-0101 (END)",
    "agent": "RONIO, ALVIN",
    "manager": "HERNANDEZ, JULIE ANN",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 396000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 241998.0,
    "balance": 154002.0,
    "paymentPercentage": 0.672216666666667,
    "documentStatus": "INC",
    "contactNo": "0997-118-0563",
    "email": "evcamantigue87@gmail.com",
    "address": "KAWIT CAVITE",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/07/2025",
    "buyer": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "relocatedUnit": "LA-0102 (INNER)",
    "agent": "RUSIT, ERIC",
    "manager": "GERO, STANLEY",
    "area": 1200.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 1584000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 818532.0,
    "balance": 765468.0,
    "paymentPercentage": 0.568425,
    "documentStatus": "INC",
    "contactNo": "0967-315-3279",
    "email": "princerupert_ramirez@yahoo.com",
    "address": "DASMA CAVITE",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/07/2025",
    "buyer": "RUSIT, ERIC C.",
    "unitId": "LA-0305 LA0306 & LA-0307 COMBINED",
    "relocatedUnit": "LA-0205, 0206, 0207",
    "agent": "GERO, STANLEY",
    "manager": "GERO, STANLEY",
    "area": 900.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 1188000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 726066.0,
    "balance": 461934.0,
    "paymentPercentage": 0.672283333333333,
    "documentStatus": "COMPLETE",
    "contactNo": "0926-061-3218",
    "email": "ericrusit09@gmail.com",
    "address": "TAGAYTAY CITY",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/08/2025",
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "spouse": "PRADEZ, MARTIN ROUEL P.",
    "unitId": "LA-0408",
    "relocatedUnit": "LA-0307",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 330000.0,
    "paymentMode": "CASH",
    "paymentMade": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0917-590-3452",
    "email": "pradezjg@bsp.gov.ph",
    "address": "GEN. TRI CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/08/2025",
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "spouse": "PRADEZ, MARTIN ROUEL P.",
    "unitId": "LA-0410",
    "relocatedUnit": "LA-0309",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 330000.0,
    "paymentMode": "CASH",
    "paymentMade": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0917-590-3452",
    "email": "pradezjg@bsp.gov.ph",
    "address": "GEN. TRI CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/09/2025",
    "buyer": "BORAC, LARRY S.",
    "spouse": "BORAC, ANGELICA MA.",
    "unitId": "LA-0405",
    "relocatedUnit": "LA-0304",
    "agent": "TESORO, FRITZGERARD",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 330000.0,
    "paymentMode": "CASH",
    "paymentMade": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0991-616-1030",
    "email": "-",
    "address": "NAIC CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/09/2025",
    "buyer": "OCAMPO, RACQUEL",
    "spouse": "BULA, ROSS",
    "unitId": "LA-0412 & LA-0414 COMBINED",
    "relocatedUnit": "LA-0311 & LA-0313",
    "agent": "DAGALE, ROY",
    "manager": "DAGALE, ROY",
    "area": 600.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 792000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 446598.0,
    "balance": 345402.0,
    "paymentPercentage": 0.620275,
    "documentStatus": "INC",
    "contactNo": "0939-934-3253",
    "email": "ocampo.racquel@gmail.com",
    "address": "IMUS, CAVITE",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/10/2025",
    "buyer": "CABISON, CHERRY MAE E.",
    "spouse": "CABISON, MICHAEL",
    "unitId": "LA-0406",
    "relocatedUnit": "LA-0305",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 330000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 60000.0,
    "balance": 270000.0,
    "paymentPercentage": 0.2,
    "documentStatus": "INC",
    "contactNo": "0919-098-5314",
    "email": "cherrymaecabison228@yahoo.com",
    "address": "GEN. TRI CAVITE",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/11/2025",
    "buyer": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "relocatedUnit": "LA-0306",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 396000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 288198.0,
    "balance": 107802.0,
    "paymentPercentage": 0.80055,
    "documentStatus": "INC",
    "contactNo": "???",
    "email": "carminavictoriatdeleon@gmail.com",
    "address": "QUEZON CITY",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/11/2025",
    "buyer": "TUBORO, MARILOU GRIMALDO",
    "unitId": "LA-0411",
    "relocatedUnit": "LA-0310",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 330000.0,
    "paymentMode": "CASH",
    "paymentMade": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0908-874-1609",
    "email": "malou.taburo@yahoo.com",
    "address": "QUEZON CITY",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/12/2025",
    "buyer": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "relocatedUnit": "LA-0308",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 396000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 288198.0,
    "balance": 107802.0,
    "paymentPercentage": 0.80055,
    "documentStatus": "INC",
    "contactNo": "???",
    "email": "charlenemaedeleon1026@yahoo.com",
    "address": "QUEZON CITY",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/13/2025",
    "buyer": "SIAZON, JEFFERSON C.",
    "spouse": "SIAZON, RODALYN B.",
    "unitId": "LA-0108 (CORNER) A",
    "relocatedUnit": "LA-1603 ( INNER)",
    "agent": "MOJICA, JONATHAN",
    "manager": "HERNANDEZ, JULIE ANN",
    "area": 600.0,
    "pricePerSqm": 1100.0,
    "totalContractPrice": 726000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 726000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0905-625-4086",
    "email": "siazonjefferson0531@gmail.com",
    "address": "IMUS CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/17/2025",
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "spouse": "PRADEZ, MARTIN ROUEL P.",
    "unitId": "LA-0304",
    "relocatedUnit": "LA-0204",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 330000.0,
    "paymentMode": "CASH",
    "paymentMade": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0917-590-3452",
    "email": "pradezjg@gmail.com",
    "address": "GEN. TRI CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/24/2025",
    "buyer": "SALAMAT, ANTONIO, MIGUEL",
    "unitId": "LA-0413",
    "relocatedUnit": "LA-0312",
    "agent": "DAGALE, ROY",
    "manager": "DAGALE, ROY",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 330000.0,
    "paymentMode": "CASH",
    "paymentMade": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0906-502-9453",
    "address": "MARAGONDON CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/24/2025",
    "buyer": "COMIA, GRAZELYN M.",
    "unitId": "LA-0415",
    "relocatedUnit": "LA-0314 (CORNER)",
    "agent": "DAGALE, ROY",
    "manager": "DAGALE, ROY",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 330000.0,
    "paymentMode": "CASH",
    "paymentMade": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0945-839-8367",
    "email": "gracezelyn.comia@gmail.com",
    "address": "KAWIT CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/01/2025",
    "buyer": "GULLA, SHERYL",
    "spouse": "GULLA, ALVIN S.",
    "unitId": "LA-0718",
    "relocatedUnit": "LA-0818",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 330000.0,
    "paymentMode": "CASH",
    "paymentMade": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0977-215-3500",
    "email": "ortiz.sherylm@gmailcom",
    "address": "TAGUIG CITY",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/01/2025",
    "buyer": "DE SAN PERDRO, JOHN MHELCON",
    "unitId": "COMBINED: LA-0501 & LA-0502",
    "relocatedUnit": "LA-1501 & LA-1502",
    "agent": "DAGALE, WINDRA",
    "manager": "DAGALE, ROY",
    "area": 600.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 660000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 660000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0912-540-1162",
    "email": "jmdesanpedro08@gmail.com",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/02/2025",
    "buyer": "GARCIA, JANICE M.",
    "spouse": "GARCIA, TERRENCE BON KIEL C.",
    "unitId": "LA-0302",
    "relocatedUnit": "LA-0202",
    "agent": "HERNANDEZ, JULIE ANN",
    "manager": "HERNANDEZ, JULIE ANN",
    "area": 400.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 440000.0,
    "paymentMode": "CASH",
    "paymentMade": 440000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0977-751-3137",
    "email": "masasangarcia@gmail.com",
    "address": "GEN. TRI CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/04/2025",
    "buyer": "CHANG, IMELDA A.",
    "spouse": "CHANG, HONG",
    "unitId": "LA-0417 (CORNER)",
    "relocatedUnit": "LA-0401 (CORNER)",
    "agent": "TESORO, FRITZGERARD",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 330000.0,
    "paymentMode": "CASH",
    "paymentMade": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "???",
    "email": "andalroni0210@gmail.com",
    "address": "DASMA CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/12/2025",
    "buyer": "BAGAOISAN, LILIA A.",
    "unitId": "LA-0108 (INNER) B",
    "relocatedUnit": "LA-1603 ( INNER)",
    "agent": "MOJICA, JONATHAN",
    "manager": "HERNANDEZ, JULIE ANN",
    "area": 300.0,
    "pricePerSqm": 1100.0,
    "totalContractPrice": 363000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 363000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0919-629-4475",
    "email": "siazon97@gmail.com",
    "address": "DASMA CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/12/2025",
    "buyer": "TAYLOR, WENDY B.",
    "unitId": "LA-0108 (END) C",
    "relocatedUnit": "LA-1603 ( INNER)",
    "agent": "MOJICA, JONATHAN",
    "manager": "HERNANDEZ, JULIE ANN",
    "area": 300.0,
    "pricePerSqm": 1100.0,
    "totalContractPrice": 363000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 363000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0919-629-4475",
    "email": "siazon97@gmail.com",
    "address": "DASMA CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/22/2025",
    "buyer": "JOHNSON, CHERRY F.",
    "unitId": "LA-1201 (CORNER)",
    "agent": "DAGALE, ROY",
    "manager": "DAGALE, ROY",
    "area": 535.0,
    "pricePerSqm": 1500.0,
    "totalContractPrice": 882750.0,
    "paymentMode": "CASH",
    "paymentMade": 53000.0,
    "balance": 829750.0,
    "paymentPercentage": 0.0660436137071651,
    "documentStatus": "INC",
    "contactNo": "???",
    "email": "???",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/23/2025",
    "buyer": "RICO, MAY LYN B.",
    "spouse": "RICO, JUAN JR M.",
    "unitId": "LA-1205",
    "agent": "TESORO, FRITZGERARD",
    "manager": "TESORO, FRITZGERARD",
    "area": 2400.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 946000.0,
    "paymentMode": "CASH",
    "paymentMade": 946000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0916-294-4108",
    "email": "ricomaylynn@gmail.com",
    "address": "NAIC CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "04/26/2025",
    "buyer": "RICO, MAY LYN B.",
    "spouse": "RICO, JUAN JR M.",
    "unitId": "LA-1205",
    "agent": "TESORO, FRITZGERARD",
    "manager": "TESORO, FRITZGERARD",
    "area": 860.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 946000.0,
    "paymentMode": "CASH",
    "paymentMade": 946000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0916-294-4108",
    "email": "ricomaylynn@gmail.com",
    "address": "NAIC CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/23/2025",
    "buyer": "PERALTA, GERRY Q.",
    "unitId": "LA-1105",
    "relocatedUnit": "LA-0902",
    "agent": "DINGLASAN, JERICKO",
    "manager": "DINGLASAN, JERICKO",
    "area": 334.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 367400.0,
    "paymentMode": "CASH",
    "paymentMade": 367400.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0992-988-0073",
    "email": "gerryperalta@gmail.com",
    "address": "GEN. TRI CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/24/2025",
    "buyer": "LAYUG, EDWARD JO S.",
    "unitId": "LA-0205",
    "relocatedUnit": "LA-0203 (INNER)",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 396000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 10000.0,
    "balance": 386000.0,
    "paymentPercentage": 0.0277777777777778,
    "documentStatus": "INC",
    "contactNo": "0917-140-2676",
    "email": "eduardthomas@gmail.com",
    "address": "GEN. TRI CAVITE",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/27/2025",
    "buyer": "HATEM, HANNOUSH MARC ANDREEI B.",
    "spouse": "BELIGON, CHERRY",
    "unitId": "LA-1201 (INNER)",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "area": 530.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 583000.0,
    "paymentMode": "CASH",
    "paymentMade": 583000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0926-393-8208",
    "email": "mariacherry.hannoush@gmail.com",
    "address": "TRECE CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/29/2025",
    "buyer": "MIRADOR, LEO M.",
    "spouse": "MIRADOR, KRISTINE G.",
    "unitId": "LA-1202 (CORNER)",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "area": 535.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 588500.0,
    "paymentMode": "CASH",
    "paymentMade": 588500.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0963-579-5375",
    "email": "lemirdz04@gmail.com",
    "address": "TAGUIG CITY",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/29/2025",
    "buyer": "MIRADOR, LEO M.",
    "spouse": "MIRADOR, KRISTINE G.",
    "unitId": "LA-1202 (END)",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "area": 530.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 583000.0,
    "paymentMode": "CASH",
    "paymentMade": 583000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0963-579-5375",
    "email": "lemirdz04@gmail.com",
    "address": "TAGUIG CITY",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/31/2025",
    "buyer": "BELIGON, ERDELYN F.",
    "unitId": "LA-1103",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 330000.0,
    "paymentMode": "CASH",
    "paymentMade": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "???",
    "email": "edenbeligon@yahoo.com",
    "address": "TRECE CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "04/05/2025",
    "buyer": "MORIONES, CHERRY",
    "spouse": "MORIONES, MICHAEL",
    "unitId": "LA-0719",
    "relocatedUnit": "LA-0818",
    "agent": "TENORIO, MARK",
    "manager": "HERNANDEZ, JULIE ANN",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 330000.0,
    "paymentMode": "CASH",
    "paymentMade": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0919-571-0356",
    "email": "cherrymoriones@gmail.com",
    "address": "RIZAL",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "04/05/2025",
    "buyer": "MAGORA, JOANNA MARIE",
    "unitId": "LA-0602",
    "relocatedUnit": "LA-1202 (END)",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "area": 430.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 473000.0,
    "paymentMode": "CASH",
    "paymentMade": 473000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0960-322-9618",
    "email": "joannamariemagora@yahoo.com",
    "address": "TRECE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "04/06/2025",
    "buyer": "ALCASABAS, ROMEO ESO",
    "spouse": "ALCASABAS, JOCELYN E.",
    "unitId": "LA-0603",
    "relocatedUnit": "LA-1203,04",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "area": 600.0,
    "pricePerSqm": 1500.0,
    "totalContractPrice": 990000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 398334.0,
    "balance": 591666.0,
    "paymentPercentage": 0.442593333333333,
    "documentStatus": "COMPLETE",
    "contactNo": "0929-194-5779",
    "email": "chefjoy2009@gmail.com",
    "address": "QUEZON CITY",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "04/09/2025",
    "buyer": "ARGETE, RICHELL",
    "unitId": "LA-0604",
    "relocatedUnit": "LA-1205",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 330000.0,
    "paymentMode": "CASH",
    "paymentMade": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0926-659-0623",
    "email": "richellargete@yahoo.com",
    "address": "PASIG CITY",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "04/10/2025",
    "buyer": "ALITAGTAG, RIZZ ANN",
    "spouse": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0504",
    "relocatedUnit": "LA-1504",
    "agent": "TESORO, FRITZGERARD",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 396000.0,
    "paymentMode": "CASH",
    "paymentMade": 396000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0921-924-3046",
    "email": "jovanalitagtag@gmail.com",
    "address": "TRECE CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "04/10/2025",
    "buyer": "ALITAGTAG, RIZZ ANN",
    "spouse": "ALITAGTAG, JOVAN B.",
    "unitId": "LA-0503",
    "relocatedUnit": "LA-1503",
    "agent": "TESORO, FRITZGERARD",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "totalContractPrice": 495000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0921-924-3046",
    "email": "jovanalitagtag@gmail.com",
    "address": "TRECE CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "04/13/2025",
    "buyer": "DERILO, GENEVIEVE O.",
    "spouse": "DERILO, FELICIANO P.",
    "unitId": "LA-0612",
    "relocatedUnit": "LA-1211",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "area": 350.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 385000.0,
    "paymentMode": "CASH",
    "paymentMade": 385000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0919-923-9539",
    "email": "olanonevie@gmail.com",
    "address": "PASIG CITY",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "04/13/2025",
    "buyer": "OLANO, ALLAN RAYMUND P.",
    "spouse": "OLANO, TEJEMOVA M.",
    "unitId": "LA-0613",
    "relocatedUnit": "LA-1212",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "area": 442.0,
    "pricePerSqm": 1000.0,
    "totalContractPrice": 486200.0,
    "paymentMode": "CASH",
    "paymentMade": 486200.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0917-713-4537",
    "email": "allanolano@yahoo.com",
    "address": "GEN. TRI CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "04/19/2025",
    "buyer": "RIL, AUNDRIA ANTONIO",
    "spouse": "RIL, JAY MARK D.",
    "unitId": "LA-0704",
    "relocatedUnit": "LA-0803",
    "agent": "ROXAS, SALIDONIA",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "totalContractPrice": 495000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 397362.5,
    "balance": 97637.5,
    "paymentPercentage": 0.883027777777778,
    "documentStatus": "INC",
    "contactNo": "0975-3209635",
    "email": "Rhidzeiyril@gmail.com",
    "address": "ROSARIO CAVITE",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "04/26/2025",
    "buyer": "PANGHULAN, RUTH Q.",
    "spouse": "PANGHULAN, ARTURO D.",
    "unitId": "LA-0610",
    "relocatedUnit": "LA-1210",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "area": 350.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 462000.0,
    "paymentMode": "CASH",
    "paymentMade": 462000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0929-204-0816",
    "email": "ruthqpanghulan@yahoo.com",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "04/28/2025",
    "buyer": "ARAYATA, RICHELLE C.",
    "spouse": "ARAYATA, ARMANDO JR, P.",
    "unitId": "LA-0703 & LA-0705 COMBINED",
    "agent": "DAGALE, ROY",
    "manager": "DAGALE, ROY",
    "area": 600.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 792000.0,
    "paymentMode": "CASH",
    "paymentMade": 50000.0,
    "balance": 742000.0,
    "paymentPercentage": 0.0694444444444444,
    "documentStatus": "INC",
    "contactNo": "???",
    "email": "rich_arayata@yahoo.com",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "04/28/2025",
    "buyer": "ALAMER, JAZZIE",
    "spouse": "RODRIGUEZ, MARK CHRISTOPHER",
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "relocatedUnit": "LA-0811 & LA-0813 (COMBINED)",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "area": 600.0,
    "pricePerSqm": 1500.0,
    "totalContractPrice": 990000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 775500.0,
    "balance": 214500.0,
    "paymentPercentage": 0.861666666666667,
    "documentStatus": "COMPLETE",
    "contactNo": "0927-437-5425",
    "email": "alamermarkchristopher21@gmail.com",
    "address": "GEN. TRI CAVITE",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "05/03/2025",
    "buyer": "ORAPA, LOUEL M.",
    "unitId": "LA-0707 (INNER)",
    "relocatedUnit": "LA-0806",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 396000.0,
    "paymentMode": "CASH",
    "paymentMade": 396000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0961-297-1222",
    "email": "louel.orapa@gmail.com",
    "address": "BACOOR CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "05/03/2025",
    "buyer": "ORAPA, MARILOU",
    "spouse": "ORAPA, EMMANUEL A.",
    "unitId": "LA-0709 & LA-0711 COMBINED",
    "relocatedUnit": "LA-0809 & LA-0811 COMBINED",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "area": 600.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 792000.0,
    "paymentMode": "CASH",
    "paymentMade": 792000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0998-840-0557",
    "email": "malou_orapa@yahoo.com",
    "address": "BACOOR CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "05/10/2025",
    "buyer": "MIRASOL, ROSARIO L.",
    "unitId": "LA-0713",
    "relocatedUnit": "LA-0812",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 396000.0,
    "paymentMode": "CASH",
    "paymentMade": 396000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0917-406-1299",
    "email": "ice.rosario.10.1@gmail.com",
    "address": "BACOOR CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "05/10/2025",
    "buyer": "FABABIER, ANNABELLE B.",
    "unitId": "LA-0715",
    "relocatedUnit": "LA-0814",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 396000.0,
    "paymentMode": "CASH",
    "paymentMade": 396000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "0917-572-5336",
    "email": "fababierannie@gmail.com",
    "address": "BACOOR CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "05/19/2025",
    "buyer": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "relocatedUnit": "LA-0203",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "totalContractPrice": 484875.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 484875.0,
    "balance": 0.0,
    "paymentPercentage": 1.0775,
    "documentStatus": "INC",
    "contactNo": "0950-600-1101",
    "email": "viencantor99@gmail.com",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "05/25/2025",
    "buyer": "GALENG, ANGELITA",
    "unitId": "LA-0809",
    "relocatedUnit": "LA-0602",
    "agent": "ORAPA,  MARILOU",
    "manager": "PARROCHO, JOSEPH",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "totalContractPrice": 495000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 379350.01,
    "balance": 115649.99,
    "paymentPercentage": 0.843000022222222,
    "documentStatus": "COMPLETE",
    "contactNo": "0998-840-0557",
    "email": "Galeng.angie@yahoo.com",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "05/30/2025",
    "buyer": "RIL, MARVIN",
    "spouse": "RIL, KATRINA D.",
    "unitId": "LA-0706",
    "relocatedUnit": "LA-0805",
    "agent": "RIL, AUNDRIA ATONIO",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "totalContractPrice": 495000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0929-142-9580",
    "email": "rilmarvin@gmail.com",
    "address": "ROSARIO CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "06/02/2025",
    "buyer": "OROPESA, ROGELIO",
    "unitId": "LA-0702",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "totalContractPrice": 396000.0,
    "paymentMode": "CASH",
    "paymentMade": 396000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0918-739-5605",
    "email": "buboy.oropesa68@gmail.com",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "07/05/2025",
    "buyer": "PAYOFELIN, LIZALE ANNE G.",
    "spouse": "PAYOFELIN, MICHELE ANNE G.",
    "unitId": "LA-0605",
    "relocatedUnit": "LA-1206",
    "agent": "PARROCHO, JOSEPH",
    "manager": "PARROCHO, JOSEPH",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "totalContractPrice": 495000.0,
    "paymentMode": "CASH",
    "paymentMade": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0917-856-2040",
    "email": "Lgpayofelin@gmail.com",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "07/06/2025",
    "buyer": "NEPOMUCENO, ERWIN",
    "unitId": "LA-0901",
    "relocatedUnit": "LA-0501",
    "agent": "NEPOMUCENO, ERWIN",
    "manager": "PARROCHO, JOSEPH",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "totalContractPrice": 495000.0,
    "paymentMode": "CASH",
    "paymentMade": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0991-995-8155",
    "email": "phproperty13@gmail.com",
    "address": "IMUS CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "08/05/2025",
    "buyer": "AURE, ALICIA ALEGRE",
    "unitId": "LA-0708 & LA-0710 (COMBINED)",
    "relocatedUnit": "LA-0807 & LA-0809 (COMBINED)",
    "agent": "GARCIA, JHOYCE",
    "manager": "HERNANDEZ, JULIE ANN",
    "area": 600.0,
    "pricePerSqm": 2000.0,
    "totalContractPrice": 1320000.0,
    "paymentMode": "CASH",
    "paymentMade": 1320000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "email": "aliciaaure0910@gmail.com",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "08/27/2025",
    "buyer": "ORDO\u00d1EZ, LEONISA G.",
    "spouse": "ORDO\u00d1EZ , EDUARDO A.",
    "unitId": "LA-0417 (END) *A",
    "relocatedUnit": "LA-0411",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "totalContractPrice": 495000.0,
    "paymentMode": "CASH",
    "paymentMade": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0910-840-4712",
    "email": "leonisaordonez77@gmail.com",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "08/27/2025",
    "buyer": "MANGLALLAN, JEMMABEL G.",
    "spouse": "MANGLALLAN,MAYNARD ANTONIO",
    "unitId": "LA-0417 (END) *B",
    "relocatedUnit": "LA-0412",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "totalContractPrice": 495000.0,
    "paymentMode": "CASH",
    "paymentMade": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0939-261-4654",
    "email": "liledishan01@gmail.com",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "11/02/2025",
    "buyer": "VILLEGAS, STEVE RANDY N.",
    "unitId": "LA-0705",
    "relocatedUnit": "LA-0806 (INNER)",
    "agent": "SUMASTRE, GEMALENE",
    "manager": "PARROCHO, JOSEPH",
    "area": 300.0,
    "pricePerSqm": 2200.0,
    "totalContractPrice": 660000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 300669.0,
    "balance": 359331.0,
    "paymentPercentage": 0.455559090909091,
    "documentStatus": "COMPLETE",
    "contactNo": "0977-401-5743",
    "email": "villegas_steverandy@yahoo.com",
    "address": "BACOOR CAVITE",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "11/04/2025",
    "buyer": "GOMEZ, BRYAN ANTAZO",
    "unitId": "LA-0604",
    "relocatedUnit": "LA-0404 (INNER)",
    "agent": "PARROCHO, JOSEPH",
    "manager": "PARROCHO, JOSEPH",
    "area": 1200.0,
    "pricePerSqm": 1700.0,
    "totalContractPrice": 2244000.0,
    "paymentMode": "CASH",
    "paymentMade": 2244000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0966-997-2159",
    "email": "Bryangomez@yahoo.com",
    "address": "MAGALLANES CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "12/03/2025",
    "buyer": "RIL, AUNDRIA ANTONIO",
    "spouse": "RIL, JAY MARK D.",
    "unitId": "LA-0703",
    "relocatedUnit": "LA-0804 (INNER)",
    "agent": "RIL, AUNDRIA ATONIO",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 300.0,
    "pricePerSqm": 1400.0,
    "totalContractPrice": 462000.0,
    "paymentMode": "CASH",
    "paymentMade": 462000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "COMPLETE",
    "contactNo": "0975-3209635",
    "email": "Rhidzeiyril@gmail.com",
    "address": "ROSARIO CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "12/07/2025",
    "buyer": "DELA CRUZ, JENNY ANN G.",
    "spouse": "DELA CRUZ, RAPHY F.",
    "unitId": "LA-1208 (NEW)",
    "relocatedUnit": "LA-1208 (NEW)",
    "agent": "GELUZ, JEFFERSON A.",
    "manager": "HERNANDEZ, JULIE ANN",
    "area": 327.0,
    "pricePerSqm": 1400.0,
    "totalContractPrice": 457800.0,
    "paymentMode": "CASH",
    "paymentMade": 457800.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "documentStatus": "INC",
    "contactNo": "0995-499-3299",
    "email": "papaya111117@gmail.com",
    "address": "DASMA, CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "12/07/2025",
    "buyer": "DELA CRUZ, JENNY ANN G.",
    "spouse": "DELA CRUZ, RAPHY F.",
    "unitId": "LA-1207 (NEW)",
    "relocatedUnit": "LA-1207 (NEW)",
    "agent": "GELUZ, JEFFERSON A.",
    "manager": "HERNANDEZ, JULIE ANN",
    "area": 327.0,
    "pricePerSqm": 1400.0,
    "totalContractPrice": 457800.0,
    "paymentMode": "CASH",
    "paymentMade": 10000.0,
    "balance": 447800.0,
    "paymentPercentage": 0.0218435998252512,
    "documentStatus": "INC",
    "contactNo": "0906-568-1062",
    "email": "jadc080609@gmail.com",
    "address": "DASMA, CAVITE",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "12/08/2025",
    "buyer": "GELUZ, CONRADO JR, A.",
    "unitId": "LA-1205 (NEW)",
    "relocatedUnit": "LA-1205 (NEW)",
    "agent": "GELUZ, JEFFERSON A.",
    "manager": "HERNANDEZ, JULIE ANN",
    "area": 300.0,
    "pricePerSqm": 1400.0,
    "totalContractPrice": 420000.0,
    "paymentMode": "CASH",
    "paymentMade": 420000.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "documentStatus": "INC",
    "contactNo": "0915-880-3031",
    "email": "myrabolivar28@gmail.com",
    "address": "KAWIT, CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "12/17/2025",
    "buyer": "JANDUSAY, JOHN WENDELL F.",
    "unitId": "LA-0801 (NEW)",
    "relocatedUnit": "LA-0802 (NEW)",
    "agent": "DETRUZ, FLORIAN A.",
    "manager": "HERNANDEZ, JULIE ANN",
    "area": 300.0,
    "pricePerSqm": 2200.0,
    "totalContractPrice": 660000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 0.0,
    "balance": 660000.0,
    "paymentPercentage": 0.0,
    "documentStatus": "INC",
    "contactNo": "0926-753-6964",
    "email": "lhordel521@gmail.com",
    "address": "DASMA, CAVITE",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "01/28/2026",
    "buyer": "AHMED, SARAH NACINO",
    "unitId": "LA-0414 & LA-0415",
    "agent": "BRIONES, CONIE A.",
    "manager": "HERNANDEZ, JULIE ANN",
    "area": 600.0,
    "pricePerSqm": 1800.0,
    "totalContractPrice": 1188000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 256000.0,
    "balance": 932000.0,
    "paymentPercentage": 0.237037037037037,
    "documentStatus": "INC",
    "contactNo": "0969-129-1596",
    "email": "msx.sarah0929@gmail.com",
    "address": "BI\u00d1AN LAGUNA",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/17/2026",
    "buyer": "ISO, DENMARK S.",
    "unitId": "LA-0408 & LA 0409",
    "relocatedUnit": "LA-0903 & LA 0904",
    "agent": "VINLUAN, MA. ANGELICA L.",
    "manager": "HERNANDEZ, JULIE ANN",
    "area": 600.0,
    "pricePerSqm": 1400.0,
    "totalContractPrice": 840000.0,
    "paymentMode": "CASH",
    "paymentMade": 840000.0,
    "balance": 0,
    "paymentPercentage": 1.0,
    "documentStatus": "INC",
    "contactNo": "0918-929-9692",
    "email": "denmarkiso1221@gmail.com",
    "address": "GENTRI CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/20/2026",
    "buyer": "DE CHAVEZ, MARIA ANGELICA G.",
    "spouse": "DE CHAVEZ, ALJON G.",
    "unitId": "LA-1207 (NEW)",
    "relocatedUnit": "LA-1207 (NEW)",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1600.0,
    "totalContractPrice": 480000.0,
    "paymentMode": "CASH",
    "paymentMade": 480000.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "documentStatus": "INC",
    "contactNo": "0977-737-8970",
    "email": "aljon_dc93@yahoo.com",
    "address": "MUNTINLUPA CITY",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/24/2026",
    "buyer": "CHRISTINE B. BOLISAY",
    "unitId": "LA-0411 & LA-0412 (NEW)",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "area": 600.0,
    "pricePerSqm": 1600.0,
    "totalContractPrice": 960000.0,
    "paymentMode": "CASH",
    "paymentMade": 960000.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "documentStatus": "INC",
    "contactNo": "0905-431-8654",
    "email": "tiffanychelsea0612@gmail.com",
    "address": "BACOOR CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "02/24/2026",
    "buyer": "BACUS, ERLOVE",
    "unitId": "LA-1209 (NEW)",
    "agent": "QUINTO, GRACE T.",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1800.0,
    "totalContractPrice": 594000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 110000.0,
    "balance": 484000.0,
    "paymentPercentage": 0.203703703703704,
    "documentStatus": "INC",
    "contactNo": "0967-931-6507",
    "email": "Erlovebacuss@gmail.com",
    "address": "DASMA, CAVITE",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/10/2026",
    "buyer": "REGIS, GERALDINE O.",
    "unitId": "LA-0410 (NEW)",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1800.0,
    "totalContractPrice": 594000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 50000.0,
    "balance": 544000.0,
    "paymentPercentage": 0.0925925925925926,
    "documentStatus": "INC",
    "contactNo": "0992-724-2594",
    "email": "sherylvictoriano09@gmail.com",
    "address": "NOVELETA CAVITE",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/11/2026",
    "buyer": "CODON, MA. CZARINA A.",
    "unitId": "LA-0407 (NEW)",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1800.0,
    "totalContractPrice": 540000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 99000.0,
    "balance": 441000.0,
    "paymentPercentage": 0.183333333333333,
    "documentStatus": "INC",
    "contactNo": "0931-070-5772",
    "email": "maczarinacodon09@gmail.com",
    "address": "NOVELETA CAVITE",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/21/2026",
    "buyer": "SALONGA, EDWIN L.",
    "unitId": "LA-1203 & LA-1204 (NEW)",
    "agent": "AVILA, KRISHTINA A.",
    "manager": "CORTEZ, ROWENA",
    "area": 600.0,
    "pricePerSqm": 1600.0,
    "totalContractPrice": 1056000.0,
    "paymentMode": "CASH",
    "paymentMade": 1056000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "contactNo": "09776393464",
    "address": "GENTRI CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/29/2026",
    "buyer": "GERMANO, ERICO C. JR",
    "spouse": "GERMANO, MARVIC",
    "unitId": "LA-0704 (NEW)",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "area": 311.0,
    "pricePerSqm": 1700.0,
    "totalContractPrice": 528700.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 97870.0,
    "balance": 430830.0,
    "paymentPercentage": 0.18511443162474,
    "documentStatus": "INC",
    "address": "GENTRI CAVITE",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "03/30/2026",
    "buyer": "CABALIDA, MADELYN G.",
    "unitId": "LA-0201",
    "agent": "PARROCHO, JOSEPH",
    "manager": "PARROCHO, JOSEPH",
    "area": 400.0,
    "pricePerSqm": 1600.0,
    "totalContractPrice": 704000.0,
    "paymentMode": "CASH",
    "paymentMade": 704000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "documentStatus": "INC",
    "address": "HUGO PEREZ",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "04/08/2026",
    "buyer": "LOMAN, KURT ERNEST M.",
    "spouse": "LOMAN, KATRINA",
    "unitId": "LA-0405 & LA-0406",
    "agent": "RUSIT, ERIC",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "area": 600.0,
    "pricePerSqm": 1800.0,
    "totalContractPrice": 1188000.0,
    "paymentMode": "INSTALLMENT",
    "paymentMade": 106900.0,
    "balance": 1081100.0,
    "paymentPercentage": 0.0989814814814815,
    "documentStatus": "INC",
    "contactNo": "1867-777-1003",
    "email": "katrina.loman@yahoo.com",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "04/11/2026",
    "buyer": "MEDILO, LARRY D.",
    "unitId": "LA-0502",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "area": 300.0,
    "pricePerSqm": 1900.0,
    "totalContractPrice": 570000.0,
    "paymentMode": "CASH",
    "paymentMade": 570000.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "documentStatus": "INC",
    "address": "NAIC CAVITE",
    "accountStatus": "COMPLETE PAID",
    "salesStatus": "GOOD SALE"
  },
  {
    "reservationDate": "05/10/2026",
    "buyer": "MICHELLE C. SAQUILAYAN",
    "unitId": "LA-1208 (NEW)",
    "agent": "PARROCHO, JOSEPH",
    "manager": "PARROCHO, JOSEPH",
    "area": 300.0,
    "pricePerSqm": 1900.0,
    "totalContractPrice": 627000.0,
    "paymentMode": "CASH",
    "paymentMade": 50000.0,
    "balance": 577000.0,
    "paymentPercentage": 0.087719298245614,
    "documentStatus": "INC",
    "contactNo": "0919-531-3360",
    "email": "michellesaquilayan2180@gmail.com",
    "address": "IMUS CAVITE",
    "accountStatus": "PARTIALLY PAID",
    "salesStatus": "GOOD SALE"
  }
]
const canonicalPaymentTracker: Payment[] = [
  {
    "unitId": "LA-0204",
    "buyer": "SILVA, ISABEL LAYUG L.",
    "mode": "CASH",
    "paymentMade": 490600.0,
    "totalContractPrice": 490600.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 1.0
  },
  {
    "unitId": "LA-0401",
    "buyer": "RABAGO, ELIZABETH L.",
    "mode": "INSTALLMENT",
    "paymentMade": 655200.0,
    "totalContractPrice": 655200.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0403",
    "buyer": "CABISON, AVA MAXINE E.",
    "mode": "CASH",
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0404",
    "buyer": "CABISON, SOPHIA CLAIRE E.",
    "mode": "CASH",
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0103",
    "buyer": "AQUINO, JAYMILYN BERNARDO",
    "mode": "CASH",
    "paymentMade": 512600.0,
    "totalContractPrice": 512600.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 1.0
  },
  {
    "unitId": "LA-0416",
    "buyer": "DIZON, ELORA ANDREI",
    "mode": "INSTALLMENT",
    "dueDay": "28th",
    "paymentMade": 341640.0,
    "totalContractPrice": 396000.0,
    "balance": 54360.0,
    "paymentPercentage": 0.949,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0101",
    "buyer": "DACAYO, JENNIFER MOROJO",
    "mode": "CASH",
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0201 (1.1)",
    "buyer": "CAMANTIGUE, ESTELISA V.",
    "mode": "INSTALLMENT",
    "dueDay": "10th",
    "paymentMade": 241998.0,
    "totalContractPrice": 396000.0,
    "balance": 154002.0,
    "paymentPercentage": 0.672216666666667,
    "commissionReleasedPercent": 0.6
  },
  {
    "unitId": "LA-0203",
    "buyer": "RAMIREZ, PRINCE RUPERT",
    "mode": "INSTALLMENT",
    "dueDay": "15th",
    "paymentMade": 818532.0,
    "totalContractPrice": 1584000.0,
    "balance": 765468.0,
    "paymentPercentage": 0.568425,
    "commissionReleasedPercent": 0.285714285714286
  },
  {
    "unitId": "LA-0305 LA0306 & LA-0307 COMBINED",
    "buyer": "RUSIT, ERIC C.",
    "mode": "INSTALLMENT",
    "dueDay": "20th",
    "paymentMade": 726066.0,
    "totalContractPrice": 1188000.0,
    "balance": 461934.0,
    "paymentPercentage": 0.672283333333333,
    "commissionReleasedPercent": 0.6
  },
  {
    "unitId": "LA-0408",
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "mode": "CASH",
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0410",
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "mode": "CASH",
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0405",
    "buyer": "BORAC, LARRY S.",
    "mode": "CASH",
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0412 & LA-0414 COMBINED",
    "buyer": "OCAMPO, RACQUEL",
    "mode": "INSTALLMENT",
    "dueDay": "10th",
    "paymentMade": 446598.0,
    "totalContractPrice": 792000.0,
    "balance": 345402.0,
    "paymentPercentage": 0.620275,
    "commissionReleasedPercent": 0.0
  },
  {
    "unitId": "LA-0406",
    "buyer": "CABISON, CHERRY MAE E.",
    "mode": "INSTALLMENT",
    "dueDay": "19th",
    "paymentMade": 60000.0,
    "totalContractPrice": 330000.0,
    "balance": 270000.0,
    "paymentPercentage": 0.2,
    "commissionReleasedPercent": 0.0
  },
  {
    "unitId": "LA-0407",
    "buyer": "DE LEON, CARMINA VICTORIA",
    "mode": "INSTALLMENT",
    "paymentMade": 288198.0,
    "totalContractPrice": 396000.0,
    "balance": 107802.0,
    "paymentPercentage": 0.80055,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0411",
    "buyer": "TUBORO, MARILOU GRIMALDO",
    "mode": "CASH",
    "dueDay": "28th",
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0409",
    "buyer": "DE LEON, CHARLENE MAE T.",
    "mode": "INSTALLMENT",
    "dueDay": "28th",
    "paymentMade": 288198.0,
    "totalContractPrice": 396000.0,
    "balance": 107802.0,
    "paymentPercentage": 0.80055,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0108 (CORNER) A",
    "buyer": "SIAZON, JEFFERSON C.",
    "mode": "INSTALLMENT",
    "dueDay": "15th",
    "paymentMade": 726000.0,
    "totalContractPrice": 726000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0304",
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "mode": "CASH",
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0413",
    "buyer": "SALAMAT, ANTONIO, MIGUEL",
    "mode": "CASH",
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 1.0
  },
  {
    "unitId": "LA-0415",
    "buyer": "COMIA, GRAZELYN M.",
    "mode": "CASH",
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 1.0
  },
  {
    "unitId": "LA-0718",
    "buyer": "GULLA, SHERYL",
    "mode": "CASH",
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "COMBINED: LA-0501 & LA-0502",
    "buyer": "DE SAN PERDRO, JOHN MHELCON",
    "mode": "INSTALLMENT",
    "paymentMade": 660000.0,
    "totalContractPrice": 660000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.285714285714286
  },
  {
    "unitId": "LA-0302",
    "buyer": "GARCIA, JANICE M.",
    "mode": "CASH",
    "paymentMade": 440000.0,
    "totalContractPrice": 440000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0417 (CORNER)",
    "buyer": "CHANG, IMELDA A.",
    "mode": "CASH",
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0108 (INNER) B",
    "buyer": "BAGAOISAN, LILIA A.",
    "mode": "INSTALLMENT",
    "dueDay": "28th",
    "paymentMade": 363000.0,
    "totalContractPrice": 363000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0108 (END) C",
    "buyer": "TAYLOR, WENDY B.",
    "mode": "INSTALLMENT",
    "dueDay": "15th",
    "paymentMade": 363000.0,
    "totalContractPrice": 363000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-1201 (CORNER)",
    "buyer": "JOHNSON, CHERRY F.",
    "mode": "CASH",
    "dueDay": "17th",
    "paymentMade": 53000.0,
    "totalContractPrice": 882750.0,
    "balance": 829750.0,
    "paymentPercentage": 0.0660436137071651,
    "commissionReleasedPercent": 0.0
  },
  {
    "unitId": "LA-1205",
    "buyer": "RICO, MAY LYN B.",
    "mode": "CASH",
    "paymentMade": 2520000.0,
    "totalContractPrice": 2520000.0,
    "balance": 0.0,
    "paymentPercentage": 1.05,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-1205",
    "buyer": "RICO, MAY LYN B.",
    "mode": "CASH",
    "paymentMade": 946000.0,
    "totalContractPrice": 946000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-1105",
    "buyer": "PERALTA, GERRY Q.",
    "mode": "CASH",
    "paymentMade": 367400.0,
    "totalContractPrice": 367400.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0205",
    "buyer": "LAYUG, EDWARD JO S.",
    "mode": "INSTALLMENT",
    "paymentMade": 10000.0,
    "totalContractPrice": 396000.0,
    "balance": 386000.0,
    "paymentPercentage": 0.0277777777777778,
    "commissionReleasedPercent": 0.0
  },
  {
    "unitId": "LA-1201 (INNER)",
    "buyer": "HATEM, HANNOUSH MARC ANDREEI B.",
    "mode": "CASH",
    "paymentMade": 583000.0,
    "totalContractPrice": 583000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-1202 (CORNER)",
    "buyer": "MIRADOR, LEO M.",
    "mode": "CASH",
    "paymentMade": 588500.0,
    "totalContractPrice": 588500.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-1202 (END)",
    "buyer": "MIRADOR, LEO M.",
    "mode": "CASH",
    "paymentMade": 583000.0,
    "totalContractPrice": 583000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-1103",
    "buyer": "BELIGON, ERDELYN F.",
    "mode": "CASH",
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0719",
    "buyer": "MORIONES, CHERRY",
    "mode": "CASH",
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0602",
    "buyer": "MAGORA, JOANNA MARIE",
    "mode": "CASH",
    "paymentMade": 473000.0,
    "totalContractPrice": 473000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0603",
    "buyer": "ALCASABAS, ROMEO ESO",
    "mode": "INSTALLMENT",
    "dueDay": "30th",
    "paymentMade": 398334.0,
    "totalContractPrice": 990000.0,
    "balance": 591666.0,
    "paymentPercentage": 0.442593333333333,
    "commissionReleasedPercent": 0.4
  },
  {
    "unitId": "LA-0604",
    "buyer": "ARGETE, RICHELL",
    "mode": "CASH",
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0504",
    "buyer": "ALITAGTAG, RIZZ ANN",
    "mode": "CASH",
    "paymentMade": 396000.0,
    "totalContractPrice": 396000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0503",
    "buyer": "ALITAGTAG, RIZZ ANN",
    "mode": "INSTALLMENT",
    "dueDay": "16th",
    "paymentMade": 495000.0,
    "totalContractPrice": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0612",
    "buyer": "DERILO, GENEVIEVE O.",
    "mode": "CASH",
    "paymentMade": 385000.0,
    "totalContractPrice": 385000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0613",
    "buyer": "OLANO, ALLAN RAYMUND P.",
    "mode": "CASH",
    "paymentMade": 486200.0,
    "totalContractPrice": 486200.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0704",
    "buyer": "RIL, AUNDRIA ANTONIO",
    "mode": "INSTALLMENT",
    "dueDay": "19th",
    "paymentMade": 397362.5,
    "totalContractPrice": 495000.0,
    "balance": 97637.5,
    "paymentPercentage": 0.883027777777778,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0610",
    "buyer": "PANGHULAN, RUTH Q.",
    "mode": "CASH",
    "paymentMade": 462000.0,
    "totalContractPrice": 462000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0703 & LA-0705 COMBINED",
    "buyer": "ARAYATA, RICHELLE C.",
    "mode": "CASH",
    "dueDay": "26th",
    "paymentMade": 50000.0,
    "totalContractPrice": 792000.0,
    "balance": 742000.0,
    "paymentPercentage": 0.0694444444444444,
    "commissionReleasedPercent": 0.0
  },
  {
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "buyer": "ALAMER, JAZZIE",
    "mode": "INSTALLMENT",
    "paymentMade": 775500.0,
    "totalContractPrice": 990000.0,
    "balance": 214500.0,
    "paymentPercentage": 0.861666666666667,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0707 (INNER)",
    "buyer": "ORAPA, LOUEL M.",
    "mode": "CASH",
    "paymentMade": 396000.0,
    "totalContractPrice": 396000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0709 & LA-0711 COMBINED",
    "buyer": "ORAPA, MARILOU",
    "mode": "CASH",
    "paymentMade": 792000.0,
    "totalContractPrice": 792000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0713",
    "buyer": "MIRASOL, ROSARIO L.",
    "mode": "CASH",
    "paymentMade": 396000.0,
    "totalContractPrice": 396000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0715",
    "buyer": "FABABIER, ANNABELLE B.",
    "mode": "CASH",
    "paymentMade": 396000.0,
    "totalContractPrice": 396000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0303",
    "buyer": "CANTOR, VIEN QUINA",
    "mode": "INSTALLMENT",
    "dueDay": "1st",
    "paymentMade": 484875.0,
    "totalContractPrice": 484875.0,
    "balance": 0.0,
    "paymentPercentage": 1.0775,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0809",
    "buyer": "GALENG, ANGELITA",
    "mode": "INSTALLMENT",
    "dueDay": "5th",
    "paymentMade": 379350.01,
    "totalContractPrice": 495000.0,
    "balance": 115649.99,
    "paymentPercentage": 0.843000022222222,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0706",
    "buyer": "RIL, MARVIN",
    "mode": "INSTALLMENT",
    "dueDay": "5th",
    "paymentMade": 495000.0,
    "totalContractPrice": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0702",
    "buyer": "OROPESA, ROGELIO",
    "mode": "CASH",
    "paymentMade": 396000.0,
    "totalContractPrice": 396000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0605",
    "buyer": "PAYOFELIN, LIZALE ANNE G.",
    "mode": "CASH",
    "paymentMade": 495000.0,
    "totalContractPrice": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0901",
    "buyer": "NEPOMUCENO, ERWIN",
    "mode": "CASH",
    "paymentMade": 495000.0,
    "totalContractPrice": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.928571428571428
  },
  {
    "unitId": "LA-0708 & LA-0710 (COMBINED)",
    "buyer": "AURE, ALICIA ALEGRE",
    "mode": "CASH",
    "paymentMade": 1320000.0,
    "totalContractPrice": 1320000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.928571428571428
  },
  {
    "unitId": "LA-0417 (END) *A",
    "buyer": "ORDO\u00d1EZ, LEONISA G.",
    "mode": "CASH",
    "paymentMade": 495000.0,
    "totalContractPrice": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.0
  },
  {
    "unitId": "LA-0417 (END) *B",
    "buyer": "MANGLALLAN, JEMMABEL G.",
    "mode": "CASH",
    "paymentMade": 495000.0,
    "totalContractPrice": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.0
  },
  {
    "unitId": "LA-0705",
    "buyer": "VILLEGAS, STEVE RANDY N.",
    "mode": "INSTALLMENT",
    "dueDay": "2nd",
    "paymentMade": 300669.0,
    "totalContractPrice": 660000.0,
    "balance": 359331.0,
    "paymentPercentage": 0.455559090909091,
    "commissionReleasedPercent": 0.4
  },
  {
    "unitId": "LA-0604",
    "buyer": "GOMEZ, BRYAN ANTAZO",
    "mode": "CASH",
    "paymentMade": 2244000.0,
    "totalContractPrice": 2244000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.813235294117647
  },
  {
    "unitId": "LA-0703",
    "buyer": "RIL, AUNDRIA ANTONIO",
    "mode": "CASH",
    "paymentMade": 462000.0,
    "totalContractPrice": 462000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-1208 (NEW)",
    "buyer": "DELA CRUZ, JENNY ANN G.",
    "mode": "CASH",
    "paymentMade": 457800.0,
    "totalContractPrice": 457800.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-1207 (NEW)",
    "buyer": "DELA CRUZ, JENNY ANN G.",
    "mode": "CASH",
    "paymentMade": 10000.0,
    "totalContractPrice": 457800.0,
    "balance": 447800.0,
    "paymentPercentage": 0.0218435998252512,
    "commissionReleasedPercent": 0.0
  },
  {
    "unitId": "LA-1205 (NEW)",
    "buyer": "GELUZ, CONRADO JR, A.",
    "mode": "CASH",
    "paymentMade": 420000.0,
    "totalContractPrice": 420000.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0414 & LA-0415",
    "buyer": "AHMED, SARAH NACINO",
    "mode": "INSTALLMENT",
    "dueDay": "27th",
    "paymentMade": 256000.0,
    "totalContractPrice": 1188000.0,
    "balance": 932000.0,
    "paymentPercentage": 0.237037037037037,
    "commissionReleasedPercent": 0.142857142857143
  },
  {
    "unitId": "LA-1207 (NEW)",
    "buyer": "DE CHAVEZ, MARIA ANGELICA G.",
    "mode": "CASH",
    "paymentMade": 480000.0,
    "totalContractPrice": 480000.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0411 & LA-0412 (NEW)",
    "buyer": "CHRISTINE B. BOLISAY",
    "mode": "CASH",
    "paymentMade": 960000.0,
    "totalContractPrice": 960000.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-1209 (NEW)",
    "buyer": "BACUS, ERLOVE",
    "mode": "INSTALLMENT",
    "dueDay": "30th",
    "paymentMade": 110000.0,
    "totalContractPrice": 594000.0,
    "balance": 484000.0,
    "paymentPercentage": 0.203703703703704,
    "commissionReleasedPercent": 0.0
  },
  {
    "unitId": "LA-0410 (NEW)",
    "buyer": "REGIS, GERALDINE O.",
    "mode": "INSTALLMENT",
    "dueDay": "22th",
    "paymentMade": 50000.0,
    "totalContractPrice": 594000.0,
    "balance": 544000.0,
    "paymentPercentage": 0.0925925925925926,
    "commissionReleasedPercent": 0.0
  },
  {
    "unitId": "LA-0407 (NEW)",
    "buyer": "CODON, MA. CZARINA A.",
    "mode": "INSTALLMENT",
    "dueDay": "25th",
    "paymentMade": 99000.0,
    "totalContractPrice": 540000.0,
    "balance": 441000.0,
    "paymentPercentage": 0.183333333333333,
    "commissionReleasedPercent": 0.0
  },
  {
    "unitId": "LA-1203 & LA-1204 (NEW)",
    "buyer": "SALONGA, EDWIN L.",
    "mode": "CASH",
    "paymentMade": 1056000.0,
    "totalContractPrice": 1056000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.857142857142857
  },
  {
    "unitId": "LA-0704 (NEW)",
    "buyer": "GERMANO, ERICO C. JR",
    "mode": "INSTALLMENT",
    "dueDay": "29TH",
    "paymentMade": 97870.0,
    "totalContractPrice": 528700.0,
    "balance": 430830.0,
    "paymentPercentage": 0.18511443162474,
    "commissionReleasedPercent": 0.0
  },
  {
    "unitId": "LA-0201",
    "buyer": "CABALIDA, MADELYN G.",
    "mode": "CASH",
    "paymentMade": 704000.0,
    "totalContractPrice": 704000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75
  },
  {
    "unitId": "LA-0405 & LA-0406",
    "buyer": "LOMAN, KURT ERNEST M.",
    "mode": "INSTALLMENT",
    "dueDay": "25TH",
    "paymentMade": 106900.0,
    "totalContractPrice": 1188000.0,
    "balance": 1081100.0,
    "paymentPercentage": 0.0989814814814815,
    "commissionReleasedPercent": 0.0
  },
  {
    "unitId": "LA-0502",
    "buyer": "MEDILO, LARRY D.",
    "mode": "CASH",
    "paymentMade": 570000.0,
    "totalContractPrice": 570000.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "commissionReleasedPercent": 0.75
  }
]
const canonicalCommissions = [
  {
    "buyer": "SILVA, ISABEL LAYUG L.",
    "unitId": "LA-0204",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 446000.0,
    "managerCommission": 8920.0,
    "agentCommission": 22300.0,
    "releasedPercent": 1.0
  },
  {
    "buyer": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0401",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 655200.0,
    "managerCommission": 13104.0,
    "agentCommission": 32760.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "CABISON, AVA MAXINE E.",
    "unitId": "LA-0403",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 300000.0,
    "managerCommission": 6000.0,
    "agentCommission": 15000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "CABISON, SOPHIA CLAIRE E.",
    "unitId": "LA-0404",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 300000.0,
    "managerCommission": 6000.0,
    "agentCommission": 15000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "AQUINO, JAYMILYN BERNARDO",
    "unitId": "LA-0103",
    "agent": "GERO, STANLEY",
    "manager": "GERO, STANLEY",
    "netSellingPrice": 466000.0,
    "managerCommission": 9320.0,
    "agentCommission": 23300.0,
    "releasedPercent": 1.0
  },
  {
    "buyer": "DIZON, ELORA ANDREI",
    "unitId": "LA-0416",
    "agent": "MOJICA, JONATHAN",
    "manager": "HERNANDEZ, JULIE ANN",
    "netSellingPrice": 360000.0,
    "managerCommission": 7200.0,
    "agentCommission": 18000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "DACAYO, JENNIFER MOROJO",
    "unitId": "LA-0101",
    "agent": "HERNANDEZ, JULIE ANN",
    "manager": "HERNANDEZ, JULIE ANN",
    "netSellingPrice": 300000.0,
    "managerCommission": 6000.0,
    "agentCommission": 15000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "agent": "RONIO, ALVIN",
    "manager": "HERNANDEZ, JULIE ANN",
    "netSellingPrice": 360000.0,
    "managerCommission": 7200.0,
    "agentCommission": 18000.0,
    "releasedPercent": 0.6
  },
  {
    "buyer": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "agent": "RUSIT, ERIC",
    "manager": "GERO, STANLEY",
    "netSellingPrice": 1440000.0,
    "managerCommission": 28800.0,
    "agentCommission": 72000.0,
    "releasedPercent": 0.4
  },
  {
    "buyer": "RUSIT, ERIC C.",
    "unitId": "LA-0305 LA0306 & LA-0307 COMBINED",
    "agent": "GERO, STANLEY",
    "manager": "GERO, STANLEY",
    "netSellingPrice": 1080000.0,
    "managerCommission": 21600.0,
    "agentCommission": 54000.0,
    "releasedPercent": 0.6
  },
  {
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0408",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 300000.0,
    "managerCommission": 6000.0,
    "agentCommission": 15000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0410",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 300000.0,
    "managerCommission": 6000.0,
    "agentCommission": 15000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "BORAC, LARRY S.",
    "unitId": "LA-0405",
    "agent": "TESORO, FRITZGERARD",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 300000.0,
    "managerCommission": 6000.0,
    "agentCommission": 15000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "OCAMPO, RACQUEL",
    "unitId": "LA-0412 & LA-0414 COMBINED",
    "agent": "DAGALE, ROY",
    "manager": "DAGALE, ROY",
    "netSellingPrice": 720000.0,
    "managerCommission": 14400.0,
    "agentCommission": 36000.0,
    "releasedPercent": 0.0
  },
  {
    "buyer": "CABISON, CHERRY MAE E.",
    "unitId": "LA-0406",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 300000.0,
    "managerCommission": 6000.0,
    "agentCommission": 15000.0,
    "releasedPercent": 0.0
  },
  {
    "buyer": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 360000.0,
    "managerCommission": 7200.0,
    "agentCommission": 18000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "TUBORO, MARILOU GRIMALDO",
    "unitId": "LA-0411",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 300000.0,
    "managerCommission": 6000.0,
    "agentCommission": 15000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 360000.0,
    "managerCommission": 7200.0,
    "agentCommission": 18000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "SIAZON, JEFFERSON C.",
    "unitId": "LA-0108 (CORNER) A",
    "agent": "MOJICA, JONATHAN",
    "manager": "HERNANDEZ, JULIE ANN",
    "netSellingPrice": 660000.0,
    "managerCommission": 13200.0,
    "agentCommission": 33000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0304",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 300000.0,
    "managerCommission": 6000.0,
    "agentCommission": 15000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "SALAMAT, ANTONIO, MIGUEL",
    "unitId": "LA-0413",
    "agent": "DAGALE, ROY",
    "manager": "DAGALE, ROY",
    "netSellingPrice": 300000.0,
    "managerCommission": 6000.0,
    "agentCommission": 15000.0,
    "releasedPercent": 1.0
  },
  {
    "buyer": "COMIA, GRAZELYN M.",
    "unitId": "LA-0415",
    "agent": "DAGALE, ROY",
    "manager": "DAGALE, ROY",
    "netSellingPrice": 300000.0,
    "managerCommission": 6000.0,
    "agentCommission": 15000.0,
    "releasedPercent": 1.0
  },
  {
    "buyer": "GULLA, SHERYL",
    "unitId": "LA-0718",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 300000.0,
    "managerCommission": 6000.0,
    "agentCommission": 15000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "DE SAN PERDRO, JOHN MHELCON",
    "unitId": "COMBINED: LA-0501 & LA-0502",
    "agent": "DAGALE, WINDRA",
    "manager": "DAGALE, ROY",
    "netSellingPrice": 600000.0,
    "managerCommission": 12000.0,
    "agentCommission": 30000.0,
    "releasedPercent": 0.5
  },
  {
    "buyer": "GARCIA, JANICE M.",
    "unitId": "LA-0302",
    "agent": "HERNANDEZ, JULIE ANN",
    "manager": "HERNANDEZ, JULIE ANN",
    "netSellingPrice": 400000.0,
    "managerCommission": 8000.0,
    "agentCommission": 20000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "CHANG, IMELDA A.",
    "unitId": "LA-0417 (CORNER)",
    "agent": "TESORO, FRITZGERARD",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 300000.0,
    "managerCommission": 6000.0,
    "agentCommission": 15000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "BAGAOISAN, LILIA A.",
    "unitId": "LA-0108 (INNER) B",
    "agent": "MOJICA, JONATHAN",
    "manager": "HERNANDEZ, JULIE ANN",
    "netSellingPrice": 330000.0,
    "managerCommission": 6600.0,
    "agentCommission": 16500.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "TAYLOR, WENDY B.",
    "unitId": "LA-0108 (END) C",
    "agent": "MOJICA, JONATHAN",
    "manager": "HERNANDEZ, JULIE ANN",
    "netSellingPrice": 330000.0,
    "managerCommission": 6600.0,
    "agentCommission": 16500.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "JOHNSON, CHERRY F.",
    "unitId": "LA-1201 (CORNER)",
    "agent": "DAGALE, ROY",
    "manager": "DAGALE, ROY",
    "netSellingPrice": 802500.0,
    "managerCommission": 16050.0,
    "agentCommission": 40125.0,
    "releasedPercent": 0.0
  },
  {
    "buyer": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "agent": "TESORO, FRITZGERARD",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 2400000.0,
    "managerCommission": 48000.0,
    "agentCommission": 120000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "agent": "TESORO, FRITZGERARD",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 860000.0,
    "managerCommission": 17200.0,
    "agentCommission": 43000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "PERALTA, GERRY Q.",
    "unitId": "LA-1105",
    "agent": "DINGLASAN, JERICKO",
    "manager": "DINGLASAN, JERICKO",
    "netSellingPrice": 334000.0,
    "managerCommission": 6680.0,
    "agentCommission": 16700.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "LAYUG, EDWARD JO S.",
    "unitId": "LA-0205",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 360000.0,
    "managerCommission": 7200.0,
    "agentCommission": 18000.0,
    "releasedPercent": 0.0
  },
  {
    "buyer": "HATEM, HANNOUSH MARC ANDREEI B.",
    "unitId": "LA-1201 (INNER)",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 530000.0,
    "managerCommission": 10600.0,
    "agentCommission": 26500.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (CORNER)",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 535000.0,
    "managerCommission": 10700.0,
    "agentCommission": 26750.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (END)",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 530000.0,
    "managerCommission": 10600.0,
    "agentCommission": 26500.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "BELIGON, ERDELYN F.",
    "unitId": "LA-1103",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 300000.0,
    "managerCommission": 6000.0,
    "agentCommission": 15000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "MORIONES, CHERRY",
    "unitId": "LA-0719",
    "agent": "TENORIO, MARK",
    "manager": "HERNANDEZ, JULIE ANN",
    "netSellingPrice": 300000.0,
    "managerCommission": 6000.0,
    "agentCommission": 15000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "MAGORA, JOANNA MARIE",
    "unitId": "LA-0602",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 430000.0,
    "managerCommission": 8600.0,
    "agentCommission": 21500.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 900000.0,
    "managerCommission": 18000.0,
    "agentCommission": 45000.0,
    "releasedPercent": 0.4
  },
  {
    "buyer": "ARGETE, RICHELL",
    "unitId": "LA-0604",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 300000.0,
    "managerCommission": 6000.0,
    "agentCommission": 15000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0504",
    "agent": "TESORO, FRITZGERARD",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 360000.0,
    "managerCommission": 7200.0,
    "agentCommission": 18000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "agent": "TESORO, FRITZGERARD",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 450000.0,
    "managerCommission": 9000.0,
    "agentCommission": 22500.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "DERILO, GENEVIEVE O.",
    "unitId": "LA-0612",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 350000.0,
    "managerCommission": 7000.0,
    "agentCommission": 17500.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "OLANO, ALLAN RAYMUND P.",
    "unitId": "LA-0613",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 442000.0,
    "managerCommission": 8840.0,
    "agentCommission": 22100.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "agent": "ROXAS, SALIDONIA",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 450000.0,
    "managerCommission": 9000.0,
    "agentCommission": 22500.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "PANGHULAN, RUTH Q.",
    "unitId": "LA-0610",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 420000.0,
    "managerCommission": 8400.0,
    "agentCommission": 21000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "ARAYATA, RICHELLE C.",
    "unitId": "LA-0703 & LA-0705 COMBINED",
    "agent": "DAGALE, ROY",
    "manager": "DAGALE, ROY",
    "netSellingPrice": 720000.0,
    "managerCommission": 0.0,
    "agentCommission": 0,
    "releasedPercent": 0
  },
  {
    "buyer": "ALAMER, JAZZIE",
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 900000.0,
    "managerCommission": 18000.0,
    "agentCommission": 45000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "ORAPA, LOUEL M.",
    "unitId": "LA-0707 (INNER)",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 360000.0,
    "managerCommission": 7200.0,
    "agentCommission": 18000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "ORAPA, MARILOU",
    "unitId": "LA-0709 & LA-0711 COMBINED",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 720000.0,
    "managerCommission": 14400.0,
    "agentCommission": 36000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "MIRASOL, ROSARIO L.",
    "unitId": "LA-0713",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 360000.0,
    "managerCommission": 7200.0,
    "agentCommission": 18000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "FABABIER, ANNABELLE B.",
    "unitId": "LA-0715",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 360000.0,
    "managerCommission": 7200.0,
    "agentCommission": 18000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 450000.0,
    "managerCommission": 9000.0,
    "agentCommission": 22500.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "GALENG, ANGELITA",
    "unitId": "LA-0809",
    "agent": "ORAPA,  MARILOU",
    "manager": "PARROCHO, JOSEPH",
    "netSellingPrice": 450000.0,
    "managerCommission": 9000.0,
    "agentCommission": 22500.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "RIL, MARVIN",
    "unitId": "LA-0706",
    "agent": "RIL, AUNDRIA ATONIO",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 450000.0,
    "managerCommission": 9000.0,
    "agentCommission": 22500.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "OROPESA, ROGELIO",
    "unitId": "LA-0702",
    "agent": "PARROCHO, JOSEPH",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 360000.0,
    "managerCommission": 7200.0,
    "agentCommission": 18000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "PAYOFELIN, LIZALE ANNE G.",
    "unitId": "LA-0605",
    "agent": "PARROCHO, JOSEPH",
    "manager": "PARROCHO, JOSEPH",
    "netSellingPrice": 450000.0,
    "managerCommission": 9000.0,
    "agentCommission": 22500.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "NEPOMUCENO, ERWIN",
    "unitId": "LA-0901",
    "agent": "NEPOMUCENO, ERWIN",
    "manager": "PARROCHO, JOSEPH",
    "netSellingPrice": 450000.0,
    "managerCommission": 9000.0,
    "agentCommission": 22500.0,
    "releasedPercent": 1.0
  },
  {
    "buyer": "AURE, ALICIA ALEGRE",
    "unitId": "LA-0708 & LA-0710 (COMBINED)",
    "agent": "GARCIA, JHOYCE",
    "manager": "HERNANDEZ, JULIE ANN",
    "netSellingPrice": 1200000.0,
    "managerCommission": 24000.0,
    "agentCommission": 60000.0,
    "releasedPercent": 1.0
  },
  {
    "buyer": "ORDO\u00d1EZ, LEONISA G.",
    "unitId": "LA-0417 (END) *A",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 450000.0,
    "managerCommission": 9000.0,
    "agentCommission": 22500.0,
    "releasedPercent": 0.0
  },
  {
    "buyer": "MANGLALLAN, JEMMABEL G.",
    "unitId": "LA-0417 (END) *B",
    "agent": "SARTE, JOHN CHRISTOPHER",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 450000.0,
    "managerCommission": 9000.0,
    "agentCommission": 22500.0,
    "releasedPercent": 0.0
  },
  {
    "buyer": "VILLEGAS, STEVE RANDY N.",
    "unitId": "LA-0705",
    "agent": "SUMASTRE, GEMALENE",
    "manager": "PARROCHO, JOSEPH",
    "netSellingPrice": 660000.0,
    "managerCommission": 13200.0,
    "agentCommission": 33000.0,
    "releasedPercent": 0.4
  },
  {
    "buyer": "GOMEZ, BRYAN ANTAZO",
    "unitId": "LA-0604",
    "agent": "PARROCHO, JOSEPH",
    "manager": "PARROCHO, JOSEPH",
    "netSellingPrice": 2040000.0,
    "managerCommission": 40800.0,
    "agentCommission": 102000.0,
    "releasedPercent": 0.838529411764706
  },
  {
    "buyer": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0703",
    "agent": "RIL, AUNDRIA ATONIO",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 420000.0,
    "managerCommission": 8400.0,
    "agentCommission": 21000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1208 (NEW)",
    "agent": "GELUZ, JEFFERSON A.",
    "manager": "HERNANDEZ, JULIE ANN",
    "netSellingPrice": 457800.0,
    "managerCommission": 9156.0,
    "agentCommission": 22890.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1207 (NEW)",
    "agent": "GELUZ, JEFFERSON A.",
    "manager": "HERNANDEZ, JULIE ANN",
    "netSellingPrice": 457800.0,
    "managerCommission": 9156.0,
    "agentCommission": 22890.0,
    "releasedPercent": 0.0
  },
  {
    "buyer": "GELUZ, CONRADO JR, A.",
    "unitId": "LA-1205 (NEW)",
    "agent": "GELUZ, JEFFERSON A.",
    "manager": "HERNANDEZ, JULIE ANN",
    "netSellingPrice": 420000.0,
    "managerCommission": 8400.0,
    "agentCommission": 21000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "JANDUSAY, JOHN WENDELL F.",
    "unitId": "LA-0801 (NEW)",
    "agent": "DETRUZ, FLORIAN A.",
    "manager": "HERNANDEZ, JULIE ANN",
    "netSellingPrice": 660000.0,
    "managerCommission": 13200.0,
    "agentCommission": 33000.0,
    "releasedPercent": 0.0
  },
  {
    "buyer": "AHMED, SARAH NACINO",
    "unitId": "LA-0414 & LA-0415",
    "agent": "BRIONES, CONIE A.",
    "manager": "HERNANDEZ, JULIE ANN",
    "netSellingPrice": 1080000.0,
    "managerCommission": 21600.0,
    "agentCommission": 54000.0,
    "releasedPercent": 0.2
  },
  {
    "buyer": "ISO, DENMARK S.",
    "unitId": "LA-0408 & LA 0409",
    "agent": "VINLUAN, MA. ANGELICA L.",
    "manager": "HERNANDEZ, JULIE ANN",
    "netSellingPrice": 840000.0,
    "managerCommission": 16800.0,
    "agentCommission": 42000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "DE CHAVEZ, MARIA ANGELICA G.",
    "unitId": "LA-1207 (NEW)",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 480000.0,
    "managerCommission": 9600.0,
    "agentCommission": 24000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "CHRISTINE B. BOLISAY",
    "unitId": "LA-0411 & LA-0412 (NEW)",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 960000.0,
    "managerCommission": 19200.0,
    "agentCommission": 48000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "BACUS, ERLOVE",
    "unitId": "LA-1209 (NEW)",
    "agent": "QUINTO, GRACE T.",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 540000.0,
    "managerCommission": 10800.0,
    "agentCommission": 27000.0,
    "releasedPercent": 0.0
  },
  {
    "buyer": "REGIS, GERALDINE O.",
    "unitId": "LA-0410 (NEW)",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 540000.0,
    "managerCommission": 10800.0,
    "agentCommission": 27000.0,
    "releasedPercent": 0.0
  },
  {
    "buyer": "CODON, MA. CZARINA A.",
    "unitId": "LA-0407 (NEW)",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 540000.0,
    "managerCommission": 10800.0,
    "agentCommission": 27000.0,
    "releasedPercent": 0.0
  },
  {
    "buyer": "SALONGA, EDWIN L.",
    "unitId": "LA-1203 & LA-1204 (NEW)",
    "agent": "AVILA, KRISHTINA A.",
    "manager": "CORTEZ, ROWENA",
    "netSellingPrice": 960000.0,
    "managerCommission": 28800.0,
    "agentCommission": 48000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "GERMANO, ERICO C. JR",
    "unitId": "LA-0704 (NEW)",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 528700.0,
    "managerCommission": 10574.0,
    "agentCommission": 26435.0,
    "releasedPercent": 0.0
  },
  {
    "buyer": "CABALIDA, MADELYN G.",
    "unitId": "LA-0201",
    "agent": "PARROCHO, JOSEPH",
    "manager": "PARROCHO, JOSEPH",
    "netSellingPrice": 640000.0,
    "managerCommission": 12800.0,
    "agentCommission": 32000.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "LOMAN, KURT ERNEST M.",
    "unitId": "LA-0405 & LA-0406",
    "agent": "RUSIT, ERIC",
    "manager": "SARTE, JOHN CHRISTOPHER",
    "netSellingPrice": 1080000.0,
    "managerCommission": 21600.0,
    "agentCommission": 54000.0,
    "releasedPercent": 0.0
  },
  {
    "buyer": "MEDILO, LARRY D.",
    "unitId": "LA-0502",
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "manager": "TESORO, FRITZGERARD",
    "netSellingPrice": 570000.0,
    "managerCommission": 11400.0,
    "agentCommission": 28500.0,
    "releasedPercent": 0.75
  },
  {
    "buyer": "MICHELLE C. SAQUILAYAN",
    "unitId": "LA-1208 (NEW)",
    "agent": "PARROCHO, JOSEPH",
    "manager": "PARROCHO, JOSEPH",
    "netSellingPrice": 570000.0,
    "managerCommission": 11400.0,
    "agentCommission": 28500.0,
    "releasedPercent": 0.0
  }
]

export const listings = canonicalListings
export const clients = canonicalClients
export const clientsV2 = clients
export const paymentTracker = canonicalPaymentTracker
export const commissions = canonicalCommissions

export const soaRecords: SoaRecord[] = [
  {
    "buyer": "ELORA ANDREI A. DIZON",
    "unitNo": "LA-0416",
    "area": "300 sqm",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 360000.0,
    "legalMiscFee": 36000.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 4217557352.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "Area: 300 sqm",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Total Amount Payable",
        "runningBalance": 396000.0
      },
      {
        "description": "45686",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45686.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45686",
        "dueAmount": 0,
        "penalty": 8100.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45716",
        "dueAmount": 0,
        "penalty": 100640.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45716.0,
        "reference": "100640",
        "runningBalance": 0
      },
      {
        "description": "45744",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45742.0,
        "reference": "15400",
        "runningBalance": 3469673863.0
      },
      {
        "description": "45775",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45772.0,
        "reference": "15400",
        "runningBalance": 3090583624.0
      },
      {
        "description": "45805",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45809.0,
        "reference": "15400",
        "runningBalance": 2622983914.0
      },
      {
        "description": "45836",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45833.0,
        "reference": "15400",
        "runningBalance": 7291740249.0
      },
      {
        "description": "45866",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45864.0,
        "reference": "15400",
        "runningBalance": 7745663283.0
      },
      {
        "description": "45897",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45895.0,
        "reference": "15400",
        "runningBalance": 3016708285.0
      },
      {
        "description": "45928",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45926.0,
        "reference": "15400",
        "runningBalance": 3632185643.0
      },
      {
        "description": "45958",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45958.0,
        "reference": "15400",
        "runningBalance": 4971862886.0
      },
      {
        "description": "45989",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45989.0,
        "reference": "15400",
        "runningBalance": 1614850347.0
      },
      {
        "description": "46019",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46019.0,
        "reference": "15400",
        "runningBalance": 6563425818.0
      },
      {
        "description": "46050",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46050.0,
        "reference": "15400",
        "runningBalance": 4217557352.0
      },
      {
        "description": "46081",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46109",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46140",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46170",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46201",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46231",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46262",
        "dueAmount": 0,
        "penalty": 15460.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "Date:",
        "dueAmount": 46054.0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Date:",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "GERALDINE O. REGIS",
    "unitNo": "LA-0410 (NEW)",
    "area": "300 sqm",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 54000.0,
    "legalMiscFee": 0.0,
    "totalAmountPayable": 54000.0,
    "totalToFullyPay": 54000.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "Area: 300 sqm",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Total Amount Payable",
        "runningBalance": 54000.0
      },
      {
        "description": "46110",
        "dueAmount": 0,
        "penalty": 50000.0,
        "amountPaid": 46091.0,
        "reference": "50000",
        "runningBalance": 0
      },
      {
        "description": "46141",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46171",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46202",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46232",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46263",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46294",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46324",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46355",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46385",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46416",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46446",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46475",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46506",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46536",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46567",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46597",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46628",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46659",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46689",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46720",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "Date:",
        "dueAmount": 46091.0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Date:",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "KURT ERNEST M. LOMAN",
    "unitNo": "LA-0410 (NEW)",
    "area": "600 sqm",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 1080000.0,
    "legalMiscFee": 0.0,
    "totalAmountPayable": 1080000.0,
    "totalToFullyPay": 2039564182329.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "Area: 600 sqm",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Total Amount Payable",
        "runningBalance": 1080000.0
      },
      {
        "description": "46120",
        "dueAmount": 0,
        "penalty": 50000.0,
        "amountPaid": 46120.0,
        "reference": "50000",
        "runningBalance": 2039564182329.0
      },
      {
        "description": "46162",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "reference": "51500",
        "runningBalance": 0
      },
      {
        "description": "46193",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46223",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46254",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46285",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46315",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46346",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46376",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46407",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46438",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46466",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46497",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46527",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46558",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46588",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46619",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46650",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46680",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46711",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46741",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "Date:",
        "dueAmount": 46139.0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Date:",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "ERICO C. GERMANO JR",
    "unitNo": "LA-0704 (NEW)",
    "area": "311 sqm",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 528700.0,
    "legalMiscFee": 0.0,
    "totalAmountPayable": 528700.0,
    "totalToFullyPay": 528700.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "Area: 311 sqm",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Total Amount Payable",
        "runningBalance": 528700.0
      },
      {
        "description": "46110",
        "dueAmount": 0,
        "penalty": 50000.0,
        "amountPaid": 46110.0,
        "reference": "50000",
        "runningBalance": 0
      },
      {
        "description": "46141",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46138.0,
        "reference": "23935",
        "runningBalance": 0
      },
      {
        "description": "46171",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46202",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46232",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46263",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46294",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46324",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46355",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46385",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46416",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46446",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46475",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46506",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46536",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46567",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46597",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46628",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46659",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46689",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46720",
        "dueAmount": 0,
        "penalty": 23935.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "Date:",
        "dueAmount": 46110.0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Date:",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "MA. CZARINA A. CODON",
    "unitNo": "LA-0407 (NEW)",
    "area": "300 sqm",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 540000.0,
    "legalMiscFee": 0.0,
    "totalAmountPayable": 540000.0,
    "totalToFullyPay": 540000.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "Area: 300 sqm",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Total Amount Payable",
        "runningBalance": 540000.0
      },
      {
        "description": "46092",
        "dueAmount": 0,
        "penalty": 50000.0,
        "amountPaid": 46092.0,
        "reference": "50000",
        "runningBalance": 0
      },
      {
        "description": "46137",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46135.0,
        "reference": "24500",
        "runningBalance": 0
      },
      {
        "description": "46167",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46198",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46228",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46259",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46290",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46320",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46351",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46381",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46412",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46443",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46471",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46502",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46532",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46563",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46593",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46624",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46655",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46685",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46716",
        "dueAmount": 0,
        "penalty": 24500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "AHMED, SARAH NACINO",
    "unitNo": "LA-0414 & LA-0415",
    "area": "300 sqm",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 1080000.0,
    "legalMiscFee": 0.0,
    "totalAmountPayable": 1080000.0,
    "totalToFullyPay": 1080000.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "Area: 300 sqm",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Total Amount Payable",
        "runningBalance": 1080000.0
      },
      {
        "description": "46080",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "reference": "51500",
        "runningBalance": 0
      },
      {
        "description": "46108",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "reference": "51500",
        "runningBalance": 0
      },
      {
        "description": "46139",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "reference": "51500",
        "runningBalance": 0
      },
      {
        "description": "46169",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46200",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46230",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46261",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46292",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46322",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46353",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46383",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46414",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "2/27/27",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46473",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46504",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46534",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46565",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46595",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46626",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46657",
        "dueAmount": 0,
        "penalty": 51500.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "Date:",
        "dueAmount": 46073.0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Date:",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "ERLOVE, BACUS",
    "unitNo": "LA-1209 (NEW)",
    "area": "300 sqm",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 540000.0,
    "legalMiscFee": 54000.0,
    "totalAmountPayable": 594000.0,
    "totalToFullyPay": 594000.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "Area: 300 sqm",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Total Amount Payable",
        "runningBalance": 594000.0
      },
      {
        "description": "46076",
        "dueAmount": 0,
        "penalty": 50000.0,
        "amountPaid": 46076.0,
        "reference": "50000",
        "runningBalance": 0
      },
      {
        "description": "46111",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "reference": "20000",
        "runningBalance": 0
      },
      {
        "description": "46142",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "reference": "20000",
        "runningBalance": 0
      },
      {
        "description": "46172",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46203",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46233",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46264",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46295",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46325",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46356",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46386",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46417",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46446",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46476",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46507",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46537",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46568",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46598",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46629",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46660",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46690",
        "dueAmount": 0,
        "penalty": 27200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "Date:",
        "dueAmount": 46077.0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Date:",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "CHRISTINE B. BOLISAY",
    "unitNo": "LA-0411& LA-0412(NEW)",
    "area": "300 sqm",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 960000.0,
    "legalMiscFee": 0.0,
    "totalAmountPayable": 960000.0,
    "totalToFullyPay": 960000.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "Area: 300 sqm",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Total Amount Payable",
        "runningBalance": 960000.0
      },
      {
        "description": "46076",
        "dueAmount": 0,
        "penalty": 50000.0,
        "amountPaid": 46076.0,
        "reference": "50000",
        "runningBalance": 0
      },
      {
        "description": "46083",
        "dueAmount": 0,
        "penalty": 430000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46084.0,
        "reference": "430000",
        "runningBalance": 0
      },
      {
        "description": "Date:",
        "dueAmount": 46077.0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Date:",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "ELORA ANDREI A. DIZON",
    "unitNo": "LA-0416",
    "area": "300 sqm",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 360000.0,
    "legalMiscFee": 36000.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 4217557352.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "Area: 300 sqm",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Total Amount Payable",
        "runningBalance": 396000.0
      },
      {
        "description": "45686",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45686.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45686",
        "dueAmount": 0,
        "penalty": 8100.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45716",
        "dueAmount": 0,
        "penalty": 100640.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45716.0,
        "reference": "100640",
        "runningBalance": 0
      },
      {
        "description": "45744",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45742.0,
        "reference": "15400",
        "runningBalance": 3469673863.0
      },
      {
        "description": "45775",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45772.0,
        "reference": "15400",
        "runningBalance": 3090583624.0
      },
      {
        "description": "45805",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45809.0,
        "reference": "15400",
        "runningBalance": 2622983914.0
      },
      {
        "description": "45836",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45833.0,
        "reference": "15400",
        "runningBalance": 7291740249.0
      },
      {
        "description": "45866",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45864.0,
        "reference": "15400",
        "runningBalance": 7745663283.0
      },
      {
        "description": "45897",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45895.0,
        "reference": "15400",
        "runningBalance": 3016708285.0
      },
      {
        "description": "45928",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45926.0,
        "reference": "15400",
        "runningBalance": 3632185643.0
      },
      {
        "description": "45958",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45958.0,
        "reference": "15400",
        "runningBalance": 4971862886.0
      },
      {
        "description": "45989",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45989.0,
        "reference": "15400",
        "runningBalance": 1614850347.0
      },
      {
        "description": "46019",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46019.0,
        "reference": "15400",
        "runningBalance": 6563425818.0
      },
      {
        "description": "46050",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46050.0,
        "reference": "15400",
        "runningBalance": 4217557352.0
      },
      {
        "description": "46081",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46109",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46140",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46170",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46201",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46231",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46262",
        "dueAmount": 0,
        "penalty": 15460.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "Date:",
        "dueAmount": 46054.0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Date:",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "JANDUSAY, JOHN WENDELL F.",
    "unitNo": "LA-0801 (NEW)",
    "area": "300 SQM",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 660000.0,
    "legalMiscFee": 0,
    "totalAmountPayable": 660000.0,
    "totalToFullyPay": 660000.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "INSTALLMENT: 2,200 PER SQM",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Total Amount Payable",
        "runningBalance": 660000.0
      },
      {
        "description": "46008",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 46008.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "46038",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46069",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46097",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46128",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46158",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46189",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46219",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46250",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46281",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46311",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46342",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46372",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46403",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46434",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46462",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46493",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46523",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46554",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46584",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46615",
        "dueAmount": 0,
        "penalty": 32500.0,
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "DE SAN PEDRO, JOHN MHELCON",
    "unitNo": "LA-0501 & LA-0502",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 660000.0,
    "legalMiscFee": 60000.0,
    "totalAmountPayable": 660000.0,
    "totalToFullyPay": 826250815000302.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45717",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45717.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45745",
        "dueAmount": 0,
        "penalty": 200000.0,
        "amountPaid": 45745.0,
        "reference": "200000",
        "runningBalance": 0
      },
      {
        "description": "45756",
        "dueAmount": 0,
        "penalty": 100000.0,
        "amountPaid": 45756.0,
        "reference": "100000",
        "runningBalance": 331250815000163.0
      },
      {
        "description": "45758",
        "dueAmount": 0,
        "penalty": 40000.0,
        "amountPaid": 45758.0,
        "reference": "40000",
        "runningBalance": 411250815000091.0
      },
      {
        "description": "45793",
        "dueAmount": 0,
        "penalty": 60000.0,
        "amountPaid": 45793.0,
        "reference": "60000",
        "runningBalance": 516250815000047.0
      },
      {
        "description": "45829",
        "dueAmount": 0,
        "penalty": 140000.0,
        "amountPaid": 45829.0,
        "reference": "50000",
        "runningBalance": 0
      },
      {
        "description": "45873",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 45873.0,
        "reference": "60000",
        "runningBalance": 8042508150000248.0
      },
      {
        "description": "45893",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 45893.0,
        "reference": "140000",
        "runningBalance": 826250815000302.0
      }
    ]
  },
  {
    "buyer": "DE SAN PEDRO, JOHN MHELCON",
    "unitNo": "LA-0501 & LA-0502",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 660000.0,
    "legalMiscFee": 60000.0,
    "totalAmountPayable": 660000.0,
    "totalToFullyPay": 826250815000302.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45717",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45717.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45745",
        "dueAmount": 0,
        "penalty": 200000.0,
        "amountPaid": 45745.0,
        "reference": "200000",
        "runningBalance": 0
      },
      {
        "description": "45756",
        "dueAmount": 0,
        "penalty": 100000.0,
        "amountPaid": 45756.0,
        "reference": "100000",
        "runningBalance": 331250815000163.0
      },
      {
        "description": "45758",
        "dueAmount": 0,
        "penalty": 40000.0,
        "amountPaid": 45758.0,
        "reference": "40000",
        "runningBalance": 411250815000091.0
      },
      {
        "description": "45793",
        "dueAmount": 0,
        "penalty": 60000.0,
        "amountPaid": 45793.0,
        "reference": "60000",
        "runningBalance": 516250815000047.0
      },
      {
        "description": "45829",
        "dueAmount": 0,
        "penalty": 140000.0,
        "amountPaid": 45829.0,
        "reference": "50000",
        "runningBalance": 0
      },
      {
        "description": "45873",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 45873.0,
        "reference": "60000",
        "runningBalance": 8042508150000248.0
      },
      {
        "description": "45893",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 45893.0,
        "reference": "140000",
        "runningBalance": 826250815000302.0
      }
    ]
  },
  {
    "buyer": "JOCELYN P. QUIACUSAN",
    "unitNo": "LA-0801",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 1247400.0,
    "legalMiscFee": 113400.0,
    "totalAmountPayable": 1247400.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      }
    ]
  },
  {
    "buyer": "ELORA ANDREI A. DIZON",
    "unitNo": "LA-0416",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 360000.0,
    "legalMiscFee": 36000.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 3016708285.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45686",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45686.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45686",
        "dueAmount": 0,
        "penalty": 8100.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45716",
        "dueAmount": 0,
        "penalty": 100640.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45716.0,
        "reference": "100640",
        "runningBalance": 0
      },
      {
        "description": "45744",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45742.0,
        "reference": "15400",
        "runningBalance": 3469673863.0
      },
      {
        "description": "45775",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45772.0,
        "reference": "15400",
        "runningBalance": 3090583624.0
      },
      {
        "description": "45805",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45809.0,
        "reference": "15400",
        "runningBalance": 2622983914.0
      },
      {
        "description": "45836",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45833.0,
        "reference": "15400",
        "runningBalance": 7291740249.0
      },
      {
        "description": "45866",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45864.0,
        "reference": "15400",
        "runningBalance": 7745663283.0
      },
      {
        "description": "45897",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45895.0,
        "reference": "15400",
        "runningBalance": 3016708285.0
      },
      {
        "description": "45928",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45958",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45989",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46019",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46050",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46081",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46109",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46140",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46170",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46201",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46231",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46262",
        "dueAmount": 0,
        "penalty": 15460.0,
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "RABAGO, ELIZABETH L.",
    "unitNo": "LA-0401",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 396000.0,
    "legalMiscFee": 39600.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45682",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45682.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45735",
        "dueAmount": 0,
        "penalty": 18133.0,
        "amountPaid": 45735.0,
        "reference": "18133",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "VILLEGAS, STEVE RANDY N.",
    "unitNo": "LA-0705",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 660000.0,
    "legalMiscFee": 0,
    "totalAmountPayable": 660000.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45963",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45963.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45993",
        "dueAmount": 0,
        "penalty": 62667.0,
        "amountPaid": 45992.0,
        "reference": "62667",
        "runningBalance": 0
      },
      {
        "description": "46024",
        "dueAmount": 0,
        "penalty": 62667.0,
        "amountPaid": 46023.0,
        "reference": "62667",
        "runningBalance": 0
      },
      {
        "description": "46055",
        "dueAmount": 0,
        "penalty": 62667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46083",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46114",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46144",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46175",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46205",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46236",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46267",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46297",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46328",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46358",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46389",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46420",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46448",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46479",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46509",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46540",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46570",
        "dueAmount": 0,
        "penalty": 25667.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46601",
        "dueAmount": 0,
        "penalty": 25660.0,
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "RABAGO, ELIZABETH L.",
    "unitNo": "LA-0401",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 396000.0,
    "legalMiscFee": 39600.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45682",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45682.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45735",
        "dueAmount": 0,
        "penalty": 18133.0,
        "amountPaid": 45735.0,
        "reference": "18133",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "RABAGO, ELIZABETH L.",
    "unitNo": "LA-0402",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 396000.0,
    "legalMiscFee": 39600.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45688",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45688.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45735",
        "dueAmount": 0,
        "penalty": 18133.0,
        "amountPaid": 45735.0,
        "reference": "18133",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "RABAGO, ELIZABETH L.",
    "unitNo": "LA-0402",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 396000.0,
    "legalMiscFee": 39600.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45688",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45688.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45735",
        "dueAmount": 0,
        "penalty": 18133.0,
        "amountPaid": 45735.0,
        "reference": "18133",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "CAMANTIGUE, ESTELISA V.",
    "unitNo": "LA-0201 (1.1)",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 396000.0,
    "legalMiscFee": 36000.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 1643398537.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45688",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45688.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45726",
        "dueAmount": 0,
        "penalty": 18133.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45726.0,
        "reference": "18133",
        "runningBalance": 4733943493.0
      },
      {
        "description": "45757",
        "dueAmount": 0,
        "penalty": 18133.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45757.0,
        "reference": "18133",
        "runningBalance": 0
      },
      {
        "description": "45787",
        "dueAmount": 0,
        "penalty": 18133.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45790.0,
        "reference": "18133",
        "runningBalance": 40532271496196.0
      },
      {
        "description": "45818",
        "dueAmount": 0,
        "penalty": 18133.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45822.0,
        "reference": "18133",
        "runningBalance": 8467498859.0
      },
      {
        "description": "45848",
        "dueAmount": 0,
        "penalty": 18133.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45850.0,
        "reference": "18133",
        "runningBalance": 3741964993.0
      },
      {
        "description": "45879",
        "dueAmount": 0,
        "penalty": 18133.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45887.0,
        "reference": "18133",
        "runningBalance": 5122146218.0
      },
      {
        "description": "45910",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45910.0,
        "reference": "15400",
        "runningBalance": 7481246346.0
      },
      {
        "description": "45940",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45944.0,
        "reference": "15400",
        "runningBalance": 949955293.0
      },
      {
        "description": "45971",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45974.0,
        "reference": "15400",
        "runningBalance": 702047751.0
      },
      {
        "description": "46001",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46002.0,
        "reference": "15400",
        "runningBalance": 8845328654.0
      },
      {
        "description": "46032",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46039.0,
        "reference": "15400",
        "runningBalance": 7470351817.0
      },
      {
        "description": "46063",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46064.0,
        "reference": "15400",
        "runningBalance": 5145578567.0
      },
      {
        "description": "46091",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46107.0,
        "reference": "15400",
        "runningBalance": 1643398537.0
      },
      {
        "description": "46122",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46152",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46183",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46213",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46244",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46275",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46305",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46336",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46366",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46397",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46428",
        "dueAmount": 0,
        "penalty": 15402.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "Date:",
        "dueAmount": 46067.0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Date:",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "CAMANTIGUE, ESTELISA V.",
    "unitNo": "LA-0201 (1.1)",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 396000.0,
    "legalMiscFee": 36000.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 7481246346.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45688",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45688.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45726",
        "dueAmount": 0,
        "penalty": 18133.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45726.0,
        "reference": "18133",
        "runningBalance": 4733943493.0
      },
      {
        "description": "45757",
        "dueAmount": 0,
        "penalty": 18133.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45757.0,
        "reference": "18133",
        "runningBalance": 0
      },
      {
        "description": "45787",
        "dueAmount": 0,
        "penalty": 18133.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45790.0,
        "reference": "18133",
        "runningBalance": 40532271496196.0
      },
      {
        "description": "45818",
        "dueAmount": 0,
        "penalty": 18133.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45822.0,
        "reference": "18133",
        "runningBalance": 8467498859.0
      },
      {
        "description": "45848",
        "dueAmount": 0,
        "penalty": 18133.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45850.0,
        "reference": "18133",
        "runningBalance": 3741964993.0
      },
      {
        "description": "45879",
        "dueAmount": 0,
        "penalty": 18133.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45887.0,
        "reference": "18133",
        "runningBalance": 5122146218.0
      },
      {
        "description": "45910",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45910.0,
        "reference": "15400",
        "runningBalance": 7481246346.0
      },
      {
        "description": "45940",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45971",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46001",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46032",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46063",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46091",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46122",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46152",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46183",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46213",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46244",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46275",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46305",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46336",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46366",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46397",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46428",
        "dueAmount": 0,
        "penalty": 15402.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "RUSIT, ERIC C.",
    "unitNo": "COMBINED: LA-0305, LA0306 & LA-0307",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 1188000.0,
    "legalMiscFee": 118800.0,
    "totalAmountPayable": 1188000.0,
    "totalToFullyPay": 28867.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45695",
        "dueAmount": 0,
        "penalty": 30000.0,
        "amountPaid": 45695.0,
        "reference": "30000",
        "runningBalance": 0
      },
      {
        "description": "45731",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45734.0,
        "reference": "54400",
        "runningBalance": 28868.0
      },
      {
        "description": "45762",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45768.0,
        "reference": "54400",
        "runningBalance": 28852.0
      },
      {
        "description": "45792",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45860.0,
        "reference": "54400",
        "runningBalance": 28853.0
      },
      {
        "description": "45823",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45860.0,
        "reference": "54400",
        "runningBalance": 28854.0
      },
      {
        "description": "45853",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45860.0,
        "reference": "54400",
        "runningBalance": 28855.0
      },
      {
        "description": "45884",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45888.0,
        "reference": "54400",
        "runningBalance": 28867.0
      },
      {
        "description": "45915",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45945",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45976",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46006",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46037",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46068",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46096",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46127",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46157",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46188",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46218",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46249",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46280",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46310",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46341",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46371",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46402",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46433",
        "dueAmount": 0,
        "penalty": 46200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "RAMIREZ, PRINCE RUPERT",
    "unitNo": "LA-0203",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 1584000.0,
    "legalMiscFee": 144000.0,
    "totalAmountPayable": 1584000.0,
    "totalToFullyPay": 121260810000065.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45695",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45695.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45736",
        "dueAmount": 0,
        "penalty": 77533.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45736.0,
        "reference": "77533",
        "runningBalance": 1742480212211.0
      },
      {
        "description": "45767",
        "dueAmount": 0,
        "penalty": 77533.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45769.0,
        "reference": "77533",
        "runningBalance": 422250816000178.0
      },
      {
        "description": "45797",
        "dueAmount": 0,
        "penalty": 77533.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45860.0,
        "reference": "77533",
        "runningBalance": 6000021652.0
      },
      {
        "description": "45828",
        "dueAmount": 0,
        "penalty": 77533.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45860.0,
        "reference": "77533",
        "runningBalance": 6000021653.0
      },
      {
        "description": "45858",
        "dueAmount": 0,
        "penalty": 77533.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45860.0,
        "reference": "77533",
        "runningBalance": 6000021654.0
      },
      {
        "description": "45889",
        "dueAmount": 0,
        "penalty": 77533.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45897.0,
        "reference": "77533",
        "runningBalance": 6000021655.0
      },
      {
        "description": "45920",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45925.0,
        "reference": "61600",
        "runningBalance": 925250810000050.0
      },
      {
        "description": "45950",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45966.0,
        "reference": "61600",
        "runningBalance": 1104250810000121.0
      },
      {
        "description": "45981",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45981.0,
        "reference": "61600",
        "runningBalance": 1120250810000081.0
      },
      {
        "description": "46011",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46030.0,
        "reference": "61600",
        "runningBalance": 108260816000164.0
      },
      {
        "description": "46042",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46043.0,
        "reference": "61600",
        "runningBalance": 121260810000065.0
      },
      {
        "description": "46073",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46101",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46132",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46162",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46193",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46223",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46254",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46285",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46315",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46346",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46376",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46407",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46438",
        "dueAmount": 0,
        "penalty": 61602.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "RAMIREZ, PRINCE RUPERT",
    "unitNo": "LA-0203",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 1584000.0,
    "legalMiscFee": 144000.0,
    "totalAmountPayable": 1584000.0,
    "totalToFullyPay": 6000021655.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45695",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45695.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45736",
        "dueAmount": 0,
        "penalty": 77533.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45736.0,
        "reference": "77533",
        "runningBalance": 1742480212211.0
      },
      {
        "description": "45767",
        "dueAmount": 0,
        "penalty": 77533.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45769.0,
        "reference": "77533",
        "runningBalance": 422250816000178.0
      },
      {
        "description": "45797",
        "dueAmount": 0,
        "penalty": 77533.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45860.0,
        "reference": "77533",
        "runningBalance": 6000021652.0
      },
      {
        "description": "45828",
        "dueAmount": 0,
        "penalty": 77533.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45860.0,
        "reference": "77533",
        "runningBalance": 6000021653.0
      },
      {
        "description": "45858",
        "dueAmount": 0,
        "penalty": 77533.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45860.0,
        "reference": "77533",
        "runningBalance": 6000021654.0
      },
      {
        "description": "45889",
        "dueAmount": 0,
        "penalty": 77533.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45897.0,
        "reference": "77533",
        "runningBalance": 6000021655.0
      },
      {
        "description": "45920",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45950",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45981",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46011",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46042",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46073",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46101",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46132",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46162",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46193",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46223",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46254",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46285",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46315",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46346",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46376",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46407",
        "dueAmount": 0,
        "penalty": 61600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46438",
        "dueAmount": 0,
        "penalty": 61602.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "OCAMPO, RACQUEL",
    "unitNo": "COMBINED: LA-0412 & LA-0414",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 792000.0,
    "legalMiscFee": 79200.0,
    "totalAmountPayable": 792000.0,
    "totalToFullyPay": 906969935.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45697",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45697.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45726",
        "dueAmount": 0,
        "penalty": 37933.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45728.0,
        "reference": "37933",
        "runningBalance": 48939366.0
      },
      {
        "description": "45757",
        "dueAmount": 0,
        "penalty": 37933.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45758.0,
        "reference": "37933",
        "runningBalance": 59284370.0
      },
      {
        "description": "45787",
        "dueAmount": 0,
        "penalty": 37933.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45790.0,
        "reference": "37933",
        "runningBalance": 74830152.0
      },
      {
        "description": "45818",
        "dueAmount": 0,
        "penalty": 37933.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45859.0,
        "reference": "37933",
        "runningBalance": 110056528.0
      },
      {
        "description": "45848",
        "dueAmount": 0,
        "penalty": 37933.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45869.0,
        "reference": "37933",
        "runningBalance": 11466504.0
      },
      {
        "description": "45879",
        "dueAmount": 0,
        "penalty": 37933.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45891.0,
        "reference": "37933",
        "runningBalance": 0
      },
      {
        "description": "45910",
        "dueAmount": 0,
        "penalty": 29000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45937.0,
        "reference": "29000",
        "runningBalance": 150974210.0
      },
      {
        "description": "45940",
        "dueAmount": 0,
        "penalty": 29000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45966.0,
        "reference": "29000",
        "runningBalance": 168107133.0
      },
      {
        "description": "45971",
        "dueAmount": 0,
        "penalty": 29000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46042.0,
        "reference": "30000",
        "runningBalance": 891629439.0
      },
      {
        "description": "46001",
        "dueAmount": 0,
        "penalty": 29000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46043.0,
        "reference": "30000",
        "runningBalance": 893937087.0
      },
      {
        "description": "46032",
        "dueAmount": 0,
        "penalty": 29000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46048.0,
        "reference": "30000",
        "runningBalance": 906969935.0
      },
      {
        "description": "46063",
        "dueAmount": 0,
        "penalty": 29000.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46091",
        "dueAmount": 0,
        "penalty": 29000.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46122",
        "dueAmount": 0,
        "penalty": 29000.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46152",
        "dueAmount": 0,
        "penalty": 29000.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46183",
        "dueAmount": 0,
        "penalty": 29000.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46213",
        "dueAmount": 0,
        "penalty": 29000.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46244",
        "dueAmount": 0,
        "penalty": 29000.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46275",
        "dueAmount": 0,
        "penalty": 29000.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46305",
        "dueAmount": 0,
        "penalty": 29000.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46336",
        "dueAmount": 0,
        "penalty": 29000.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46366",
        "dueAmount": 0,
        "penalty": 29000.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46397",
        "dueAmount": 0,
        "penalty": 29000.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46428",
        "dueAmount": 0,
        "penalty": 29000.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "Date:",
        "dueAmount": 46054.0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Date:",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "OCAMPO, RACQUEL",
    "unitNo": "COMBINED: LA-0412 & LA-0414",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 792000.0,
    "legalMiscFee": 79200.0,
    "totalAmountPayable": 792000.0,
    "totalToFullyPay": 11466504.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45697",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45697.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45726",
        "dueAmount": 0,
        "penalty": 37933.0,
        "amountPaid": 45728.0,
        "reference": "37933",
        "runningBalance": 48939366.0
      },
      {
        "description": "45757",
        "dueAmount": 0,
        "penalty": 37933.0,
        "amountPaid": 45758.0,
        "reference": "37933",
        "runningBalance": 59284370.0
      },
      {
        "description": "45787",
        "dueAmount": 0,
        "penalty": 37933.0,
        "amountPaid": 45790.0,
        "reference": "37933",
        "runningBalance": 74830152.0
      },
      {
        "description": "45818",
        "dueAmount": 0,
        "penalty": 37933.0,
        "amountPaid": 45859.0,
        "reference": "37933",
        "runningBalance": 110056528.0
      },
      {
        "description": "45848",
        "dueAmount": 0,
        "penalty": 37933.0,
        "amountPaid": 45869.0,
        "reference": "37933",
        "runningBalance": 11466504.0
      },
      {
        "description": "45879",
        "dueAmount": 0,
        "penalty": 37933.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45910",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45940",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45971",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46001",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46032",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46063",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46091",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46122",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46152",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46183",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46213",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46244",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46275",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46305",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46336",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46366",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46397",
        "dueAmount": 0,
        "penalty": 30800.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46428",
        "dueAmount": 0,
        "penalty": 30802.0,
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "CABISON, CHERRY MAE E.",
    "unitNo": "LA-0406",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 330000.0,
    "legalMiscFee": 30000.0,
    "totalAmountPayable": 330000.0,
    "totalToFullyPay": 7025595421573.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45698",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45698.0,
        "reference": "10000",
        "runningBalance": 7025595421573.0
      },
      {
        "description": "45735",
        "dueAmount": 0,
        "penalty": 50000.0,
        "amountPaid": 45735.0,
        "reference": "50000",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "CABISON, CHERRY MAE E.",
    "unitNo": "LA-0406",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 330000.0,
    "legalMiscFee": 30000.0,
    "totalAmountPayable": 330000.0,
    "totalToFullyPay": 7025595421573.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45698",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45698.0,
        "reference": "10000",
        "runningBalance": 7025595421573.0
      },
      {
        "description": "45735",
        "dueAmount": 0,
        "penalty": 50000.0,
        "amountPaid": 45735.0,
        "reference": "50000",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "DE LEON, CARMINA VICTORIA",
    "unitNo": "LA-0407",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 396000.0,
    "legalMiscFee": 39600.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 731646315.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45700",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45699.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45744",
        "dueAmount": 0,
        "penalty": 36266.0,
        "amountPaid": 45744.0,
        "reference": "36266",
        "runningBalance": 85930402.0
      },
      {
        "description": "45775",
        "dueAmount": 0,
        "penalty": 36266.0,
        "amountPaid": 45775.0,
        "reference": "36266",
        "runningBalance": 160288831.0
      },
      {
        "description": "45805",
        "dueAmount": 0,
        "penalty": 36266.0,
        "amountPaid": 45804.0,
        "reference": "36266",
        "runningBalance": 233055610.0
      },
      {
        "description": "45836",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 45838.0,
        "reference": "15400",
        "runningBalance": 25180688107.0
      },
      {
        "description": "45866",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 45870.0,
        "reference": "15400",
        "runningBalance": 403720243.0
      },
      {
        "description": "45897",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 45899.0,
        "reference": "15400",
        "runningBalance": 0
      },
      {
        "description": "45928",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 45930.0,
        "reference": "15400",
        "runningBalance": 0
      },
      {
        "description": "45958",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 45990.0,
        "reference": "15400",
        "runningBalance": 731646315.0
      },
      {
        "description": "45989",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46019",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46050",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46081",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46109",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46140",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "05/28/26",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46201",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46231",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46262",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46293",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46323",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46354",
        "dueAmount": 0,
        "penalty": 15402.0,
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "DE LEON, CARMINA VICTORIA",
    "unitNo": "LA-0407",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 396000.0,
    "legalMiscFee": 39600.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 497581396.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45700",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45699.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45744",
        "dueAmount": 0,
        "penalty": 36200.0,
        "amountPaid": 45744.0,
        "reference": "36200",
        "runningBalance": 85930402.0
      },
      {
        "description": "45775",
        "dueAmount": 0,
        "penalty": 36200.0,
        "amountPaid": 45775.0,
        "reference": "36200",
        "runningBalance": 160288831.0
      },
      {
        "description": "45805",
        "dueAmount": 0,
        "penalty": 36200.0,
        "amountPaid": 45804.0,
        "reference": "36200",
        "runningBalance": 233055610.0
      },
      {
        "description": "45836",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 45870.0,
        "reference": "15400",
        "runningBalance": 403720243.0
      },
      {
        "description": "45866",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 45899.0,
        "reference": "15400",
        "runningBalance": 483221435.0
      },
      {
        "description": "45897",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 45905.0,
        "reference": "15400",
        "runningBalance": 497581396.0
      },
      {
        "description": "45928",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45958",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45989",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46019",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46050",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46081",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46109",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46140",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "05/28/26",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46201",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46231",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46262",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46293",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46323",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46354",
        "dueAmount": 0,
        "penalty": 15600.0,
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "DE LEON, CHARLENE MAE T.",
    "unitNo": "LA-0409",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 396000.0,
    "legalMiscFee": 36000.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 1569028813.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45700",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45700.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45744",
        "dueAmount": 0,
        "penalty": 36266.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45747.0,
        "reference": "36266",
        "runningBalance": 213995.0
      },
      {
        "description": "45775",
        "dueAmount": 0,
        "penalty": 36266.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45777.0,
        "reference": "36266",
        "runningBalance": 20003000018447.0
      },
      {
        "description": "45805",
        "dueAmount": 0,
        "penalty": 36266.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45808.0,
        "reference": "36266",
        "runningBalance": 3000252234.0
      },
      {
        "description": "45836",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45837.0,
        "reference": "15400",
        "runningBalance": 0
      },
      {
        "description": "45866",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45868.0,
        "reference": "15400",
        "runningBalance": 3000010887.0
      },
      {
        "description": "45897",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45905.0,
        "reference": "15400",
        "runningBalance": 0
      },
      {
        "description": "45928",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45932.0,
        "reference": "15400",
        "runningBalance": 0
      },
      {
        "description": "45958",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45964.0,
        "reference": "15400",
        "runningBalance": 1569028813.0
      },
      {
        "description": "45989",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46019",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46050",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46081",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46109",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46140",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "05/28/26",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46201",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46231",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46262",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46293",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46323",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46354",
        "dueAmount": 0,
        "penalty": 15402.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "Date:",
        "dueAmount": 45981.0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Date:",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "DE LEON, CHARLENE MAE T.",
    "unitNo": "LA-0409",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 396000.0,
    "legalMiscFee": 36000.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 3000010887.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45700",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45700.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45744",
        "dueAmount": 0,
        "penalty": 36200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45747.0,
        "reference": "36200",
        "runningBalance": 213995.0
      },
      {
        "description": "45775",
        "dueAmount": 0,
        "penalty": 36200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45777.0,
        "reference": "36200",
        "runningBalance": 20003000018447.0
      },
      {
        "description": "45805",
        "dueAmount": 0,
        "penalty": 36200.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45808.0,
        "reference": "36200",
        "runningBalance": 3000252234.0
      },
      {
        "description": "45836",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45868.0,
        "reference": "15400",
        "runningBalance": 3000010887.0
      },
      {
        "description": "45866",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45897",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45928",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45958",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45989",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46019",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46050",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46081",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46109",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46140",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "05/28/26",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46201",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46231",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46262",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46293",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46323",
        "dueAmount": 0,
        "penalty": 15400.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46354",
        "dueAmount": 0,
        "penalty": 15600.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "NEWTON, CURLIE",
    "unitNo": "LA-0422",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 396000.0,
    "legalMiscFee": 39600.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 2408333.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45715",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45715.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45728",
        "dueAmount": 0,
        "penalty": 8160.0,
        "amountPaid": 45728.0,
        "reference": "8160",
        "runningBalance": 0
      },
      {
        "description": "45728",
        "dueAmount": 0,
        "penalty": 100640.0,
        "amountPaid": 45728.0,
        "reference": "100640",
        "runningBalance": 0
      },
      {
        "description": "45765",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 45768.0,
        "reference": "15400",
        "runningBalance": 142437596.0
      },
      {
        "description": "45795",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 45796.0,
        "reference": "15400",
        "runningBalance": 4687103.0
      },
      {
        "description": "45826",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 45828.0,
        "reference": "15400",
        "runningBalance": 294099989.0
      },
      {
        "description": "45856",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 45888.0,
        "reference": "30400",
        "runningBalance": 2408333.0
      },
      {
        "description": "45887",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45918",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45948",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45979",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46009",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46040",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46071",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46099",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46130",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46160",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46191",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46221",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46252",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46283",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "NEWTON, CURLIE",
    "unitNo": "LA-0422",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 396000.0,
    "legalMiscFee": 39600.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 2408333.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45715",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45715.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45728",
        "dueAmount": 0,
        "penalty": 8160.0,
        "amountPaid": 45728.0,
        "reference": "8160",
        "runningBalance": 0
      },
      {
        "description": "45728",
        "dueAmount": 0,
        "penalty": 100640.0,
        "amountPaid": 45728.0,
        "reference": "100640",
        "runningBalance": 0
      },
      {
        "description": "45765",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 45768.0,
        "reference": "15400",
        "runningBalance": 142437596.0
      },
      {
        "description": "45795",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 45796.0,
        "reference": "15400",
        "runningBalance": 4687103.0
      },
      {
        "description": "45826",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 45828.0,
        "reference": "15400",
        "runningBalance": 294099989.0
      },
      {
        "description": "45856",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 45888.0,
        "reference": "30400",
        "runningBalance": 2408333.0
      },
      {
        "description": "45887",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45918",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45948",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45979",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46009",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46040",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46071",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46099",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46130",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46160",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46191",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46221",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46252",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46283",
        "dueAmount": 0,
        "penalty": 15400.0,
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "DIMAISIP, BRYAN TAN",
    "unitNo": "LA-1101",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 396000.0,
    "legalMiscFee": 39600.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 273580714.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45726",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45726.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45744",
        "dueAmount": 0,
        "penalty": 16084.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45726.0,
        "reference": "16084",
        "runningBalance": 44996775.0
      },
      {
        "description": "45775",
        "dueAmount": 0,
        "penalty": 16084.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45768.0,
        "reference": "16084",
        "runningBalance": 142648353.0
      },
      {
        "description": "45805",
        "dueAmount": 0,
        "penalty": 16084.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45796.0,
        "reference": "16084",
        "runningBalance": 212826957.0
      },
      {
        "description": "45836",
        "dueAmount": 0,
        "penalty": 16084.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45820.0,
        "reference": "16084",
        "runningBalance": 273580714.0
      }
    ]
  },
  {
    "buyer": "CALIBOSO, MARY JANE",
    "unitNo": "LA-0701",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 330000.0,
    "legalMiscFee": 33000.0,
    "totalAmountPayable": 330000.0,
    "totalToFullyPay": 1022838.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45726",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45748.0,
        "reference": "10000",
        "runningBalance": 9027339963817.0
      },
      {
        "description": "45744",
        "dueAmount": 0,
        "penalty": 46166.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45782.0,
        "reference": "46166",
        "runningBalance": 1022838.0
      }
    ]
  },
  {
    "buyer": "JOHNSON, CHERRY F.",
    "unitNo": "LA-1201 (CORNER)",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 882750.0,
    "legalMiscFee": 88275.0,
    "totalAmountPayable": 882750.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45738",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45738.0,
        "reference": "10000",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "JOHNSON, CHERRY F.",
    "unitNo": "LA-1201 (CORNER)",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 882750.0,
    "legalMiscFee": 88275.0,
    "totalAmountPayable": 882750.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45738",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45738.0,
        "reference": "10000",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "JOHNSON, CHERRY F.",
    "unitNo": "LA-1201 (CORNER)",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 882750.0,
    "legalMiscFee": 88275.0,
    "totalAmountPayable": 882750.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45738",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45738.0,
        "reference": "10000",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "JOHNSON, CHERRY F.",
    "unitNo": "LA-1201 (CORNER)",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 882750.0,
    "legalMiscFee": 88275.0,
    "totalAmountPayable": 882750.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45738",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45738.0,
        "reference": "10000",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "LAYUG, EDWARD JO S.",
    "unitNo": "LA-0205",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 396000.0,
    "legalMiscFee": 39600.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45740",
        "dueAmount": 0,
        "penalty": 108800.0,
        "amountPaid": 45740.0,
        "reference": "108800",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "LAYUG, EDWARD JO S.",
    "unitNo": "LA-0205",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 396000.0,
    "legalMiscFee": 39600.0,
    "totalAmountPayable": 396000.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45740",
        "dueAmount": 0,
        "penalty": 108800.0,
        "amountPaid": 45740.0,
        "reference": "108800",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "MAGORA, JOANNA MARIE",
    "unitNo": "LA-0601",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 643500.0,
    "legalMiscFee": 64350.0,
    "totalAmountPayable": 643500.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45688",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "MAGORA, JOANNA MARIE",
    "unitNo": "LA-0601",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 643500.0,
    "legalMiscFee": 64350.0,
    "totalAmountPayable": 643500.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45688",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "ALCASABAS, ROMEO ESO",
    "unitNo": "LA-0603",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 990000.0,
    "legalMiscFee": 99000.0,
    "totalAmountPayable": 990000.0,
    "totalToFullyPay": 730250212000204.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "Payment due every 30th of the month",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Legal Miscellaneous Fee",
        "runningBalance": 99000.0
      },
      {
        "description": "45739",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45739.0,
        "reference": "10000",
        "runningBalance": 0
      },
      {
        "description": "45785",
        "dueAmount": 0,
        "penalty": 90000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45785.0,
        "reference": "90000",
        "runningBalance": 508250214000169.0
      },
      {
        "description": "45825",
        "dueAmount": 0,
        "penalty": 90000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45825.0,
        "reference": "90000",
        "runningBalance": 617250214000119.0
      },
      {
        "description": "45868",
        "dueAmount": 0,
        "penalty": 90000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45868.0,
        "reference": "90000",
        "runningBalance": 730250212000204.0
      },
      {
        "description": "45899",
        "dueAmount": 0,
        "penalty": 59167.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45879.0,
        "reference": "59167",
        "runningBalance": 0
      },
      {
        "description": "45930",
        "dueAmount": 0,
        "penalty": 59167.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45879.0,
        "reference": "59167",
        "runningBalance": 0
      },
      {
        "description": "45960",
        "dueAmount": 0,
        "penalty": 59167.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45991",
        "dueAmount": 0,
        "penalty": 59167.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46021",
        "dueAmount": 0,
        "penalty": 59167.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46052",
        "dueAmount": 0,
        "penalty": 59167.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46081",
        "dueAmount": 0,
        "penalty": 59167.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46111",
        "dueAmount": 0,
        "penalty": 59167.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46142",
        "dueAmount": 0,
        "penalty": 59167.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46172",
        "dueAmount": 0,
        "penalty": 59167.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46203",
        "dueAmount": 0,
        "penalty": 59167.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46233",
        "dueAmount": 0,
        "penalty": 59163.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "ALCASABAS, ROMEO ESO",
    "unitNo": "LA-0603",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 990000.0,
    "legalMiscFee": 99000.0,
    "totalAmountPayable": 990000.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45739",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45739.0,
        "reference": "10000",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "ALITAGTAG, RIZZ ANN",
    "unitNo": "LA-0503",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 495000.0,
    "legalMiscFee": 49500.0,
    "totalAmountPayable": 495000.0,
    "totalToFullyPay": 2340741748.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45757",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45757.0,
        "reference": "10000",
        "runningBalance": 68208991.0
      },
      {
        "description": "45793",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45790.0,
        "reference": "40417",
        "runningBalance": 116959.0
      },
      {
        "description": "45824",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45818.0,
        "reference": "40417",
        "runningBalance": 640985.0
      },
      {
        "description": "45854",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45848.0,
        "reference": "40417",
        "runningBalance": 0
      },
      {
        "description": "45885",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45879.0,
        "reference": "40417",
        "runningBalance": 923052.0
      },
      {
        "description": "45916",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45911.0,
        "reference": "40417",
        "runningBalance": 2340741748.0
      },
      {
        "description": "45946",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46342",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46007",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46038",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46069",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46097",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46128",
        "dueAmount": 0,
        "penalty": 40413.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "ALITAGTAG, RIZZ ANN",
    "unitNo": "LA-0503",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 495000.0,
    "legalMiscFee": 49500.0,
    "totalAmountPayable": 495000.0,
    "totalToFullyPay": 2340741748.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45757",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45757.0,
        "reference": "10000",
        "runningBalance": 68208991.0
      },
      {
        "description": "45793",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45790.0,
        "reference": "40417",
        "runningBalance": 116959.0
      },
      {
        "description": "45824",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45818.0,
        "reference": "40417",
        "runningBalance": 640985.0
      },
      {
        "description": "45854",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45848.0,
        "reference": "40417",
        "runningBalance": 0
      },
      {
        "description": "45885",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45879.0,
        "reference": "40417",
        "runningBalance": 923052.0
      },
      {
        "description": "45916",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45911.0,
        "reference": "40417",
        "runningBalance": 2340741748.0
      },
      {
        "description": "45946",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46342",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46007",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46038",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46069",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46097",
        "dueAmount": 0,
        "penalty": 40417.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46128",
        "dueAmount": 0,
        "penalty": 40413.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "RIL, AUNDRIA ANTONIO",
    "unitNo": "LA-0704",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 495000.0,
    "legalMiscFee": 49500.0,
    "totalAmountPayable": 495000.0,
    "totalToFullyPay": 421581631.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45766",
        "dueAmount": 0,
        "penalty": 50000.0,
        "amountPaid": 45766.0,
        "reference": "50000",
        "runningBalance": 213167793.0
      },
      {
        "description": "45766",
        "dueAmount": 0,
        "penalty": 87362.5,
        "amountPaid": 45766.0,
        "reference": "87362.5",
        "runningBalance": 0
      },
      {
        "description": "45827",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45825.0,
        "reference": "20000",
        "runningBalance": 287574820.0
      },
      {
        "description": "45857",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45856.0,
        "reference": "20000",
        "runningBalance": 368353781.0
      },
      {
        "description": "45888",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45876.0,
        "reference": "20000",
        "runningBalance": 421581631.0
      },
      {
        "description": "45919",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45916.0,
        "reference": "20000",
        "runningBalance": 0
      },
      {
        "description": "45949",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45940.0,
        "reference": "20000",
        "runningBalance": 0
      },
      {
        "description": "45980",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45961.0,
        "reference": "20000",
        "runningBalance": 0
      },
      {
        "description": "46010",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45263.0,
        "reference": "20000",
        "runningBalance": 0
      },
      {
        "description": "45676",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46058.0,
        "reference": "20000",
        "runningBalance": 0
      },
      {
        "description": "45707",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46058.0,
        "reference": "20000",
        "runningBalance": 0
      },
      {
        "description": "45735",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46083.0,
        "reference": "20000",
        "runningBalance": 0
      },
      {
        "description": "45766",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46112.0,
        "reference": "20000",
        "runningBalance": 0
      },
      {
        "description": "45796",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46143.0,
        "reference": "20000",
        "runningBalance": 0
      },
      {
        "description": "45827",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46169.0,
        "reference": "20000",
        "runningBalance": 0
      },
      {
        "description": "45857",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45888",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45919",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45949",
        "dueAmount": 0,
        "penalty": 20000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45980",
        "dueAmount": 0,
        "penalty": 17637.5,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "RIL, AUNDRIA ANTONIO",
    "unitNo": "LA-0704",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 495000.0,
    "legalMiscFee": 49500.0,
    "totalAmountPayable": 495000.0,
    "totalToFullyPay": 421581631.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45766",
        "dueAmount": 0,
        "penalty": 50000.0,
        "amountPaid": 45766.0,
        "reference": "50000",
        "runningBalance": 213167793.0
      },
      {
        "description": "45766",
        "dueAmount": 0,
        "penalty": 87362.5,
        "amountPaid": 45766.0,
        "reference": "87362.5",
        "runningBalance": 0
      },
      {
        "description": "45827",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45825.0,
        "reference": "20000",
        "runningBalance": 287574820.0
      },
      {
        "description": "45857",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45856.0,
        "reference": "20000",
        "runningBalance": 368353781.0
      },
      {
        "description": "45888",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45876.0,
        "reference": "20000",
        "runningBalance": 421581631.0
      },
      {
        "description": "45919",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "reference": "20000",
        "runningBalance": 0
      },
      {
        "description": "45949",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45980",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46010",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45676",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45707",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45735",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45766",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45796",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45827",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45857",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45888",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45919",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45949",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45980",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "CANTOR, VIEN QUINA",
    "unitNo": "LA-0303",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 495000.0,
    "legalMiscFee": 49500.0,
    "totalAmountPayable": 495000.0,
    "totalToFullyPay": 3000061486.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45795",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45795.0,
        "reference": "10000",
        "runningBalance": 3000188716.0
      },
      {
        "description": "45797",
        "dueAmount": 0,
        "penalty": 10125.0,
        "amountPaid": 45797.0,
        "reference": "10125",
        "runningBalance": 0
      },
      {
        "description": "45797",
        "dueAmount": 0,
        "penalty": 128375.0,
        "amountPaid": 45797.0,
        "reference": "128375",
        "runningBalance": 0
      },
      {
        "description": "45870",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 45797.0,
        "reference": "28875",
        "runningBalance": 0
      },
      {
        "description": "45901",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 45797.0,
        "reference": "28875",
        "runningBalance": 0
      },
      {
        "description": "45931",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 45917.0,
        "reference": "28875",
        "runningBalance": 3000061486.0
      },
      {
        "description": "45962",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 45945.0,
        "reference": "28875",
        "runningBalance": 0
      },
      {
        "description": "45992",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 45946.0,
        "reference": "28875",
        "runningBalance": 0
      },
      {
        "description": "46023",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 45959.0,
        "reference": "28875",
        "runningBalance": 0
      },
      {
        "description": "46054",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46082",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46113",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46143",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46174",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46204",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "CANTOR, VIEN QUINA",
    "unitNo": "LA-0303",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 495000.0,
    "legalMiscFee": 49500.0,
    "totalAmountPayable": 495000.0,
    "totalToFullyPay": 3000188716.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45795",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45795.0,
        "reference": "10000",
        "runningBalance": 3000188716.0
      },
      {
        "description": "45797",
        "dueAmount": 0,
        "penalty": 10125.0,
        "amountPaid": 45797.0,
        "reference": "10125",
        "runningBalance": 0
      },
      {
        "description": "45797",
        "dueAmount": 0,
        "penalty": 128375.0,
        "amountPaid": 45797.0,
        "reference": "128375",
        "runningBalance": 0
      },
      {
        "description": "45870",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 45797.0,
        "reference": "28875",
        "runningBalance": 0
      },
      {
        "description": "45901",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 45797.0,
        "reference": "28875",
        "runningBalance": 0
      },
      {
        "description": "45931",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 0,
        "reference": "28875",
        "runningBalance": 0
      },
      {
        "description": "45962",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45992",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46023",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46054",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46082",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46113",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46143",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46174",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46204",
        "dueAmount": 0,
        "penalty": 28875.0,
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "RIL, MARVIN",
    "unitNo": "LA-0706",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 495000.0,
    "legalMiscFee": 49500.0,
    "totalAmountPayable": 495000.0,
    "totalToFullyPay": 408004359.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45807",
        "dueAmount": 0,
        "penalty": 10000.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45807.0,
        "reference": "10000",
        "runningBalance": 530250813000268.0
      },
      {
        "description": "45807",
        "dueAmount": 0,
        "penalty": 128375.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45807.0,
        "reference": "128375",
        "runningBalance": 0
      },
      {
        "description": "45807",
        "dueAmount": 0,
        "penalty": 8987.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45807.0,
        "reference": "8987",
        "runningBalance": 0
      },
      {
        "description": "45843",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45840.0,
        "reference": "19250",
        "runningBalance": 327295895.0
      },
      {
        "description": "45874",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45871.0,
        "reference": "19250",
        "runningBalance": 408004359.0
      },
      {
        "description": "45905",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45904.0,
        "reference": "19250",
        "runningBalance": 0
      },
      {
        "description": "45935",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45935.0,
        "reference": "19250",
        "runningBalance": 0
      },
      {
        "description": "45966",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45961.0,
        "reference": "19250",
        "runningBalance": 0
      },
      {
        "description": "45996",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45994.0,
        "reference": "19250",
        "runningBalance": 0
      },
      {
        "description": "46027",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46024.0,
        "reference": "19250",
        "runningBalance": 0
      },
      {
        "description": "46058",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46058.0,
        "reference": "19250",
        "runningBalance": 0
      },
      {
        "description": "46086",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46083.0,
        "reference": "19250",
        "runningBalance": 0
      },
      {
        "description": "46117",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46112.0,
        "reference": "19250",
        "runningBalance": 0
      },
      {
        "description": "46147",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 46143.0,
        "reference": "19250",
        "runningBalance": 0
      },
      {
        "description": "46178",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46208",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46239",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46270",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46300",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46331",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46361",
        "dueAmount": 0,
        "penalty": 20388.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "RIL, MARVIN",
    "unitNo": "LA-0706",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 495000.0,
    "legalMiscFee": 49500.0,
    "totalAmountPayable": 495000.0,
    "totalToFullyPay": 408004359.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45807",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45807.0,
        "reference": "10000",
        "runningBalance": 530250813000268.0
      },
      {
        "description": "45807",
        "dueAmount": 0,
        "penalty": 137362.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45735.0,
        "reference": "128375",
        "runningBalance": 0
      },
      {
        "description": "45843",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45840.0,
        "reference": "19250",
        "runningBalance": 327295895.0
      },
      {
        "description": "45874",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45871.0,
        "reference": "19250",
        "runningBalance": 408004359.0
      },
      {
        "description": "45905",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 45904.0,
        "reference": "19250",
        "runningBalance": 0
      },
      {
        "description": "45935",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45966",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "45996",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46027",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46058",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46086",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46117",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46147",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46178",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46208",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46239",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46270",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46300",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46331",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      },
      {
        "description": "46361",
        "dueAmount": 0,
        "penalty": 19250.0,
        "datePaid": "12/30/1899",
        "amountPaid": 0,
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "ALAMER, JAZZIE",
    "unitNo": "COMBINED: LA-0803 & LA-0805",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 990000.0,
    "legalMiscFee": 99000.0,
    "totalAmountPayable": 990000.0,
    "totalToFullyPay": 218378.0,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "11441",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 11441.0,
        "reference": "10000",
        "runningBalance": 297986.0
      },
      {
        "description": "11441",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 11441.0,
        "reference": "10000",
        "runningBalance": 218378.0
      }
    ]
  },
  {
    "buyer": "ALAMER, JAZZIE",
    "unitNo": "COMBINED: LA-0803 & LA-0805",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 990000.0,
    "legalMiscFee": 99000.0,
    "totalAmountPayable": 990000.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45688",
        "dueAmount": 0,
        "penalty": 20000.0,
        "amountPaid": 45688.0,
        "reference": "20000",
        "runningBalance": 0
      },
      {
        "description": "45793",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 45735.0,
        "reference": "255000",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "GALENG, ANGELITA",
    "unitNo": "LA-0809",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 495000.0,
    "legalMiscFee": 49500.0,
    "totalAmountPayable": 495000.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45802",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45802.0,
        "reference": "10000",
        "runningBalance": 0
      }
    ]
  },
  {
    "buyer": "GALENG, ANGELITA",
    "unitNo": "LA-0809",
    "area": "-",
    "statementDate": "06/03/2026",
    "propertyAddress": "Gen. Emilio Aguinaldo, Cavite",
    "totalContractPrice": 495000.0,
    "legalMiscFee": 49500.0,
    "totalAmountPayable": 495000.0,
    "totalToFullyPay": 46176.455616782405,
    "schedule": [
      {
        "description": "Mataas na Lupa, Indang, Cavite.",
        "dueAmount": 0,
        "penalty": 0,
        "amountPaid": 0,
        "reference": "Statement Date",
        "runningBalance": 46176.455616782405
      },
      {
        "description": "45802",
        "dueAmount": 0,
        "penalty": 10000.0,
        "amountPaid": 45802.0,
        "reference": "10000",
        "runningBalance": 0
      }
    ]
  }
]
export const computations = [
  {
    "name": "6-Month DP Scheme",
    "project": "PANTIHAN 4, MARAGONDON, CAVITE",
    "promo": 16555,
    "sellingPrice": 1638945,
    "downpaymentPercent": 0.15,
    "totalDownpayment": 245841.75,
    "reservationFee": 50000,
    "dpMonths": 6,
    "monthlyDownpayment": 32640.29,
    "balance": 1393103.25,
    "estimated3Years": 45938.98,
    "estimated5Years": 30637.97
  },
  {
    "name": "Full DP Scheme - 3 Years",
    "project": "PANTIHAN 4, MARAGONDON, CAVITE",
    "promo": 74497.5,
    "totalContractPrice": 1581002.5,
    "downpaymentPercent": 0.3,
    "netDownpayment": 413827.4,
    "reservationFee": 50000,
    "netDpPayable": 363827.4,
    "balance": 1106701.75,
    "estimated3Years": 34779.84
  },
  {
    "name": "Full DP Scheme - 5 Years",
    "project": "PANTIHAN 4, MARAGONDON, CAVITE",
    "promo": 41387.5,
    "totalContractPrice": 1614112.5,
    "downpaymentPercent": 0.3,
    "netDownpayment": 435810.38,
    "reservationFee": 50000,
    "netDpPayable": 385810.38,
    "balance": 1129878.75,
    "estimated5Years": 23356.38
  }
]
export const agentPerformance = [
  {
    "agent": "SARTE, JOHN CHRISTOPHER",
    "totalSales": 2006000.0,
    "active": 4,
    "cancelled": 0,
    "net": 2006000.0
  },
  {
    "agent": "SILVA, EDWARD JAMES",
    "totalSales": 3835200.0,
    "active": 11,
    "cancelled": 0,
    "net": 3835200.0
  },
  {
    "agent": "MOJICA, JONATHAN",
    "totalSales": 1680000.0,
    "active": 4,
    "cancelled": 0,
    "net": 1680000.0
  },
  {
    "agent": "HERNANDEZ, JULIE ANN",
    "totalSales": 700000.0,
    "active": 2,
    "cancelled": 0,
    "net": 700000.0
  },
  {
    "agent": "RONIO, ALVIN",
    "totalSales": 660000.0,
    "active": 1,
    "cancelled": 0,
    "net": 660000.0
  },
  {
    "agent": "RUSIT, ERIC",
    "totalSales": 1440000.0,
    "active": 1,
    "cancelled": 0,
    "net": 1440000.0
  },
  {
    "agent": "TESORO, FRITZGERARD",
    "totalSales": 300000.0,
    "active": 6,
    "cancelled": 0,
    "net": 300000.0
  },
  {
    "agent": "RIOJA, KIRSTEN JHOYCE A.",
    "totalSales": 300000.0,
    "active": 3,
    "cancelled": 0,
    "net": 300000.0
  },
  {
    "agent": "PARROCHO, JOSEPH",
    "totalSales": 300000.0,
    "active": 19,
    "cancelled": 0,
    "net": 300000.0
  },
  {
    "agent": "TENORIO, MARK",
    "totalSales": 720000.0,
    "active": 1,
    "cancelled": 0,
    "net": 720000.0
  },
  {
    "agent": "ROXAS, SALIDONIA",
    "totalSales": 300000.0,
    "active": 1,
    "cancelled": 0,
    "net": 300000.0
  },
  {
    "agent": "RIL, AUNDRIA",
    "totalSales": 780000.0,
    "active": 3,
    "cancelled": 0,
    "net": 780000.0
  },
  {
    "agent": "ORAPA,  MARILOU",
    "totalSales": 300000.0,
    "active": 1,
    "cancelled": 0,
    "net": 300000.0
  },
  {
    "agent": "NEPOMUCENO, ERWIN",
    "totalSales": 360000.0,
    "active": 1,
    "cancelled": 0,
    "net": 360000.0
  },
  {
    "agent": "SUMASTRE, GEMALENE",
    "totalSales": 660000.0,
    "active": 1,
    "cancelled": 0,
    "net": 660000.0
  }
]
export const accreditedSellers = [
  {
    "status": "INACTIVE",
    "name": "ORAPA, MARILOU",
    "manager": "PARROCHO, JOSEPH E.",
    "contact": "-",
    "email": "-"
  },
  {
    "status": "ACTIVE",
    "name": "NEPOMUCENO, ERWIN",
    "manager": "PARROCHO, JOSEPH E.",
    "contact": "0991-995-8155",
    "email": "phproperty13@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "DE CASTRO, ROSE MARIE D.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09237301104",
    "email": "rosemariedecastro06@yahoo.com"
  },
  {
    "status": "ACTIVE",
    "name": "BRIONES, CONIE, A.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09948685799",
    "email": "-"
  },
  {
    "status": "INACTIVE",
    "name": "TOLIDO, NICKIE ROSE E.",
    "manager": "RIOJA, KIRSTEN JHOYCE A.",
    "contact": "09941603497",
    "email": "nickierosetolido@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "BONDOC, MARICEL L.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09287639925",
    "email": "letlet_23@yahoo.com"
  },
  {
    "status": "INACTIVE",
    "name": "ACLAN, AGNES P.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09071518754",
    "email": "agnesaclan1969@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "LAMBAN, FELIX, GARCIA",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09663816102",
    "email": "lhikz01@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "AMBAT, MARISSA D.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09560253890",
    "email": "udayJmsydHN@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "MENDOZA, RHENA MAE",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09553481740",
    "email": "rhenamaemendoza@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "VINLAN, MA.ANGELICA L.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09944481911",
    "email": "angelicachua103@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "ACULLO, NOEL A.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09395182953",
    "email": "narcullo@yahoo.com"
  },
  {
    "status": "INACTIVE",
    "name": "ARMERO, JENNIFER P.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09067564429",
    "email": "jenniferarmero78@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "FLORES, MYCA B.",
    "manager": "ROJALES, DANIEL Q.",
    "contact": "09920377879",
    "email": "mycsflores11@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "CORTEZ, ROWENA",
    "manager": "SARTE, JOHN CHRISTPOHER",
    "contact": "09330264680",
    "email": "rowenamcortez16@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "GARCIA, MARY JOYCE D.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09165694269",
    "email": "maryjoyceg30@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "TENORIO, MARK FRANZY N.",
    "manager": "MALAYAO, CLARITA B.",
    "contact": "09107201516",
    "email": "markfranzyteronio@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "CASTRO, MARIA CARLOTA C.",
    "manager": "MALAYAO, CLARITA B.",
    "contact": "09157401191",
    "email": "taz14328@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "POLE, KIMBERLY ANN O.",
    "manager": "MALAYAO, CLARITA B.",
    "contact": "09106422991",
    "email": "kimberly.pole12@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "RAMIREZ, REBECCA, E.",
    "manager": "MALAYAO, CLARITA B.",
    "contact": "09065628264",
    "email": "rebecca49@yahoo.com"
  },
  {
    "status": "INACTIVE",
    "name": "RAMIREZ, ELMER M.",
    "manager": "MALAYAO, CLARITA B.",
    "contact": "09065628833",
    "email": "elmermramirez412@yahoo.com"
  },
  {
    "status": "INACTIVE",
    "name": "DAJAY, GLORIA E.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09553159006",
    "email": "moringablessings@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "PE\u00d1A, MA. LOURDES P.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09162596589",
    "email": "-"
  },
  {
    "status": "INACTIVE",
    "name": "ELCANO, MIRASOL G.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09948834413",
    "email": "cely7557@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "BONZON, JOSEFINA, P.",
    "manager": "MALAYAO, CLARITA B.",
    "contact": "09156709860",
    "email": "josefinabonzon@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "SEVILLA, LORELIE E.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09507311873",
    "email": "esca\u00f1olai@yahoo.com"
  },
  {
    "status": "INACTIVE",
    "name": "VIADO,KACY LYN C.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09060562056",
    "email": "kccuales@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "DETRUZ, FLORIAN A.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09937728711",
    "email": "flory.detruz1@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "AUSTRAL, ALLAN L.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09972531176",
    "email": "australa 991@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "VIADO, NEGIE S.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09060562056",
    "email": "-"
  },
  {
    "status": "INACTIVE",
    "name": "GARCIA, MIKHAELA G.",
    "manager": "ROJALES, DANIEL Q.",
    "contact": "09270665684",
    "email": "mikgarcia0969@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "RENTORIA, JOSEFINA O.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09151038794",
    "email": "rentoriafina@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "BACAMANTE, RYAN B.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09560780166",
    "email": "ryanbacamante@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "ADICER, JOCYLIN V.",
    "manager": "MALAYAO, CLARITA B.",
    "contact": "09171489068",
    "email": "jocylinadicer25@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "SIERVO, GERALDINE C.",
    "manager": "MALAYAO, CLARITA B.",
    "contact": "09930968039",
    "email": "geraldinecarlos246@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "VICTORIANO, HELEN M.",
    "manager": "MALAYAO, CLARITA B.",
    "contact": "09381479753",
    "email": "helenvictoriano17@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "CABABAT, MARICRIS DIVINE V.",
    "manager": "PARROCHO, JOSEPH E.",
    "contact": "09262352625",
    "email": "cababatmaricrisdivine@gmail.com"
  },
  {
    "status": "INACTIVE",
    "name": "GELUZ, JEFFERSON A.",
    "manager": "HERNANDEZ, JULIE ANN D.",
    "contact": "09912698393",
    "email": "-"
  },
  {
    "status": "ACTIVE",
    "name": "GONZALEZ, DHARLINE MAE T.",
    "manager": "RIOJA, KIRSTEN JHOYCE A.",
    "contact": "09954167077",
    "email": "dharlinemaegonzalez@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "PANGILINAN, JAN CYRILLE",
    "manager": "PARROCHO, JOSEPH E.",
    "contact": "09920421198",
    "email": "pangilinanjc15@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "BARCENAS, PAUL EMMANUEL B.",
    "manager": "PARROCHO, JOSEPH E.",
    "contact": "09457097130",
    "email": "-"
  },
  {
    "status": "ACTIVE",
    "name": "LU, DANDREB D.",
    "manager": "PARROCHO, JOSEPH E.",
    "contact": "09369744313",
    "email": "dandrebpelljera01@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "SANTOS, GIONNA COLLYNE G.",
    "manager": "PARROCHO, JOSEPH E.",
    "contact": "09943361195",
    "email": "gionnacollyne@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "AMPARADO, ANTHONY C.",
    "manager": "FLORES, JEFFERSON",
    "contact": "09518493567",
    "email": "-"
  },
  {
    "status": "ACTIVE",
    "name": "GALPO, JORLIE, N.",
    "manager": "RIOJA, KIRSTEN JHOYCE A.",
    "contact": "0927-047-0469",
    "email": "jorliegalpo@13gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "CANTIGA, ROLINDA, C.",
    "manager": "PARROCHO, JOSEPH E.",
    "contact": "0915-745-5725",
    "email": "lynncantiga@yahoo.com"
  },
  {
    "status": "ACTIVE",
    "name": "QUINTO, GRACE, T.",
    "manager": "RIOJA, KIRSTEN JHOYCE A.",
    "contact": "09054318654",
    "email": "gracequinto2617@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "VILLANUEVA, DALMACIO, M",
    "manager": "PARROCHO, JOSEPH E.",
    "contact": "09214300043",
    "email": "dabovillanueva@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "DONADILLO, JEREMIAH N.",
    "manager": "FLORES, JEFFERSON",
    "contact": "09514672767",
    "email": "jeremiahdonadillo77@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "DIMAYA, ANNA LESLIE V.",
    "manager": "SARTE, JOHN CHRISTPOHER",
    "contact": "09568861594",
    "email": "dimaya1974@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "LOBRIO, NEIL, KRISTIAN J.",
    "manager": "PARROCHO, JOSEPH E.",
    "contact": "09926482411",
    "email": "bohrkristian@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "ROXAS, SALIDONIA",
    "manager": "SARTE, JOHN CHRISTPOHER",
    "contact": "-",
    "email": "-"
  },
  {
    "status": "ACTIVE",
    "name": "SAPIDA, MARIA DEL PILAR M.",
    "manager": "SARTE, JOHN CHRISTPOHER",
    "contact": "09067152287",
    "email": "Maria.pilarsapida@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "PADERNAL, FE V.",
    "manager": "SARTE, JOHN CHRISTPOHER",
    "contact": "09935961642",
    "email": "MSDpadernal@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "DE GUINTO, RODANTE B.",
    "manager": "ROWENA CORTEZ",
    "contact": "09979157933",
    "email": "ohdiedeguinto08@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "A\u00d1O, BOOTS N.",
    "manager": "ROWENA CORTEZ",
    "contact": "09354919557",
    "email": "bootsa\u00f1o@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "OLOGUIN, EDELIZA, G",
    "manager": "ROWENA CORTEZ",
    "contact": "09156040930",
    "email": "edelizaologuine@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "MUKKARAM, ANGELINA G.",
    "manager": "ROWENA CORTEZ",
    "contact": "09947470347",
    "email": "mukkaramangelina@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "DILLAGUE, JESSICA C.",
    "manager": "ROWENA CORTEZ",
    "contact": "09531964673",
    "email": "jessicadillague0410@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "RANA, GARARDO T.",
    "manager": "ROWENA CORTEZ",
    "contact": "09215466497",
    "email": "corazonmrana@yahoo.com"
  },
  {
    "status": "ACTIVE",
    "name": "DILLAGUE, JEFFREY D.",
    "manager": "ROWENA CORTEZ",
    "contact": "09531964673",
    "email": "jeffreydillague@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "PE\u00d1ALBA, TEEZON M.",
    "manager": "ROJALES, DANIEL Q.",
    "contact": "09216722565",
    "email": "teezonpenalba@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "CRIZALDO, VIKTHOR NATHANIEL M.",
    "manager": "TESORO, FRITZGERARD",
    "contact": "09763433799",
    "email": "Vikzaldo@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "TAYOTO, PAULEENE L.",
    "manager": "ROJALES, DANIEL Q.",
    "contact": "09978451521",
    "email": "tayoto.pauleene@ncst.edu.ph"
  },
  {
    "status": "ACTIVE",
    "name": "MOJICA, WILFRED P.",
    "manager": "PARROCHO, JOSEPH E.",
    "contact": "09929926110",
    "email": "bellsyan69@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "DE SAN PEDRO, JOHN MHELCON Y.",
    "manager": "FLORES, JEFFERSON",
    "contact": "09472916650",
    "email": "jmdesanpedro@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "BONI, JENNY B.",
    "manager": "ROWENA CORTEZ",
    "contact": "091075546773",
    "email": "bonijennyb@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "CARDENAS, IRENE V.",
    "manager": "ROWENA CORTEZ",
    "contact": "09455677244",
    "email": "irenecardenas.8831@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "PEROLINA, MARY JOY L.",
    "manager": "ROWENA CORTEZ",
    "contact": "09958958208",
    "email": "perolina.mary.joy4@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "VARGAS, MA. MAGDALENA",
    "manager": "ROWENA CORTEZ",
    "contact": "09772650178",
    "email": "maggyv985@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "CARDENAS, IRENE V.",
    "manager": "ROWENA CORTEZ",
    "contact": "09455677244",
    "email": "irenecardenas.8831@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "BI\u00d1AS, JENNY S.",
    "manager": "ROWENA CORTEZ",
    "contact": "09060260348",
    "email": "jennbinas3y@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "DEPITA, FERLYN A.",
    "manager": "ROWENA CORTEZ",
    "contact": "09936700737",
    "email": "felyndepita27@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "PONCE, MARY DAISY J.",
    "manager": "ROWENA CORTEZ",
    "contact": "09978324398",
    "email": "marydaisyponce@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "REBOLLEDO, NAOMI RICCI V.",
    "manager": "ROWENA CORTEZ",
    "contact": "09108646206",
    "email": "D.namicode@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "ARRIOLA, IRIS P.",
    "manager": "ROWENA CORTEZ",
    "contact": "09163363971",
    "email": "irisarriola22@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "CUNANAN, MARIA MILAGROSA L.",
    "manager": "ROWENA CORTEZ",
    "contact": "09685296175",
    "email": "mariamilagrosacunanan@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "CIEGO, ROSEMARIE S.",
    "manager": "ROWENA CORTEZ",
    "contact": "09302485033",
    "email": "mciego22@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "GUWITA, MARICEL R.",
    "manager": "ROWENA CORTEZ",
    "contact": "09703426213",
    "email": "Maricelguwita@1991.com"
  },
  {
    "status": "ACTIVE",
    "name": "SERAPION, JESSELIN C.",
    "manager": "SARTE, JOHN CHRISTPOHER",
    "contact": "09661668811",
    "email": "jessecervantescaylar@gmail.com"
  },
  {
    "status": "ACTIVE",
    "name": "LACAP, JOHN MENARD M.",
    "manager": "SARTE, JOHN CHRISTPOHER",
    "contact": "09162819362",
    "email": "menardlacap27@gmail.com"
  }
]
export const documents = [
  {
    "buyer": "SILVA, ISABEL LAYUG L.",
    "unitId": "LA-0204",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0401",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "CABISON, AVA MAXINE E.",
    "unitId": "LA-0403",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "CABISON, SOPHIA CLAIRE E.",
    "unitId": "LA-0404",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "AQUINO, JAYMILYN BERNARDO",
    "unitId": "LA-0103",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "DIZON, ELORA ANDREI",
    "unitId": "LA-0416",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "DACAYO, JENNIFER MOROJO",
    "unitId": "LA-0101",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "RUSIT, ERIC C.",
    "unitId": "LA-0305 LA0306 & LA-0307 COMBINED",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0408",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0410",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "BORAC, LARRY S.",
    "unitId": "LA-0405",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "OCAMPO, RACQUEL",
    "unitId": "LA-0412 & LA-0414 COMBINED",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "CABISON, CHERRY MAE E.",
    "unitId": "LA-0406",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "TUBORO, MARILOU GRIMALDO",
    "unitId": "LA-0411",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "SIAZON, JEFFERSON C.",
    "unitId": "LA-0108 (CORNER) A",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0304",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "SALAMAT, ANTONIO, MIGUEL",
    "unitId": "LA-0413",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "COMIA, GRAZELYN M.",
    "unitId": "LA-0415",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "GULLA, SHERYL",
    "unitId": "LA-0718",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "DE SAN PERDRO, JOHN MHELCON",
    "unitId": "COMBINED: LA-0501 & LA-0502",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "GARCIA, JANICE M.",
    "unitId": "LA-0302",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "CHANG, IMELDA A.",
    "unitId": "LA-0417 (CORNER)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "BAGAOISAN, LILIA A.",
    "unitId": "LA-0108 (INNER) B",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "TAYLOR, WENDY B.",
    "unitId": "LA-0108 (END) C",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "JOHNSON, CHERRY F.",
    "unitId": "LA-1201 (CORNER)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "PERALTA, GERRY Q.",
    "unitId": "LA-1105",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "LAYUG, EDWARD JO S.",
    "unitId": "LA-0205",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "HATEM, HANNOUSH MARC ANDREEI B.",
    "unitId": "LA-1201 (INNER)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (CORNER)",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (END)",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "BELIGON, ERDELYN F.",
    "unitId": "LA-1103",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "MORIONES, CHERRY",
    "unitId": "LA-0719",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "MAGORA, JOANNA MARIE",
    "unitId": "LA-0602",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "ARGETE, RICHELL",
    "unitId": "LA-0604",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0504",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "DERILO, GENEVIEVE O.",
    "unitId": "LA-0612",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "OLANO, ALLAN RAYMUND P.",
    "unitId": "LA-0613",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "PANGHULAN, RUTH Q.",
    "unitId": "LA-0610",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "ARAYATA, RICHELLE C.",
    "unitId": "LA-0703 & LA-0705 COMBINED",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "ALAMER, JAZZIE",
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "ORAPA, LOUEL M.",
    "unitId": "LA-0707 (INNER)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "ORAPA, MARILOU",
    "unitId": "LA-0709 & LA-0711 COMBINED",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "MIRASOL, ROSARIO L.",
    "unitId": "LA-0713",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "FABABIER, ANNABELLE B.",
    "unitId": "LA-0715",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "GALENG, ANGELITA",
    "unitId": "LA-0809",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "RIL, MARVIN",
    "unitId": "LA-0706",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "OROPESA, ROGELIO",
    "unitId": "LA-0702",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "PAYOFELIN, LIZALE ANNE G.",
    "unitId": "LA-0605",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "NEPOMUCENO, ERWIN",
    "unitId": "LA-0901",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "AURE, ALICIA ALEGRE",
    "unitId": "LA-0708 & LA-0710 (COMBINED)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "ORDO\u00d1EZ, LEONISA G.",
    "unitId": "LA-0417 (END) *A",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "MANGLALLAN, JEMMABEL G.",
    "unitId": "LA-0417 (END) *B",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "VILLEGAS, STEVE RANDY N.",
    "unitId": "LA-0705",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "GOMEZ, BRYAN ANTAZO",
    "unitId": "LA-0604",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0703",
    "documentStatus": "COMPLETE",
    "remarks": "Master List document status: COMPLETE"
  },
  {
    "buyer": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1208 (NEW)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1207 (NEW)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "GELUZ, CONRADO JR, A.",
    "unitId": "LA-1205 (NEW)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "JANDUSAY, JOHN WENDELL F.",
    "unitId": "LA-0801 (NEW)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "AHMED, SARAH NACINO",
    "unitId": "LA-0414 & LA-0415",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "ISO, DENMARK S.",
    "unitId": "LA-0408 & LA 0409",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "DE CHAVEZ, MARIA ANGELICA G.",
    "unitId": "LA-1207 (NEW)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "CHRISTINE B. BOLISAY",
    "unitId": "LA-0411 & LA-0412 (NEW)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "BACUS, ERLOVE",
    "unitId": "LA-1209 (NEW)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "REGIS, GERALDINE O.",
    "unitId": "LA-0410 (NEW)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "CODON, MA. CZARINA A.",
    "unitId": "LA-0407 (NEW)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "SALONGA, EDWIN L.",
    "unitId": "LA-1203 & LA-1204 (NEW)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "GERMANO, ERICO C. JR",
    "unitId": "LA-0704 (NEW)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "CABALIDA, MADELYN G.",
    "unitId": "LA-0201",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "LOMAN, KURT ERNEST M.",
    "unitId": "LA-0405 & LA-0406",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "MEDILO, LARRY D.",
    "unitId": "LA-0502",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  },
  {
    "buyer": "MICHELLE C. SAQUILAYAN",
    "unitId": "LA-1208 (NEW)",
    "documentStatus": "INC",
    "remarks": "Master List document status: INC"
  }
]
export const auditLogs = [
  [
    "06/03/2026 09:45 PM",
    "Admin User",
    "Loaded SOA INSTALLMENT.xlsx source data",
    "Data Import"
  ],
  [
    "06/03/2026 09:46 PM",
    "Admin User",
    "Loaded CLIENT MASTERLIST workbook source data",
    "Data Import"
  ],
  [
    "06/03/2026 09:47 PM",
    "Admin User",
    "Reviewed Pantihan 4 computation images",
    "Computation"
  ]
]
export const projects = [
  {
    "id": "project-1",
    "name": "Luntiang Aguinaldo",
    "location": "Gen. Emilio Aguinaldo, Cavite",
    "status": "Active",
    "description": "Inventory and client records from CLIENT MASTERLIST_ SAMPLE.",
    "coverImage": "",
    "totalLots": 152
  },
  {
    "id": "project-2",
    "name": "Pantihan 4",
    "location": "Maragondon, Cavite",
    "status": "Active",
    "description": "Sample computations from the provided Pantihan 4 images.",
    "coverImage": "",
    "totalLots": 0
  }
]
export const agents = [
  {
    "id": "agent-1",
    "fullName": "SARTE, JOHN CHRISTOPHER",
    "email": "agent1@dcprime.test",
    "phone": "-",
    "assignedProjects": [
      "project-1"
    ],
    "status": "Active"
  },
  {
    "id": "agent-2",
    "fullName": "SILVA, EDWARD JAMES",
    "email": "agent2@dcprime.test",
    "phone": "-",
    "assignedProjects": [
      "project-1"
    ],
    "status": "Active"
  },
  {
    "id": "agent-3",
    "fullName": "MOJICA, JONATHAN",
    "email": "agent3@dcprime.test",
    "phone": "-",
    "assignedProjects": [
      "project-1"
    ],
    "status": "Active"
  },
  {
    "id": "agent-4",
    "fullName": "HERNANDEZ, JULIE ANN",
    "email": "agent4@dcprime.test",
    "phone": "-",
    "assignedProjects": [
      "project-1"
    ],
    "status": "Active"
  },
  {
    "id": "agent-5",
    "fullName": "RONIO, ALVIN",
    "email": "agent5@dcprime.test",
    "phone": "-",
    "assignedProjects": [
      "project-1"
    ],
    "status": "Active"
  },
  {
    "id": "agent-6",
    "fullName": "RUSIT, ERIC",
    "email": "agent6@dcprime.test",
    "phone": "-",
    "assignedProjects": [
      "project-1"
    ],
    "status": "Active"
  },
  {
    "id": "agent-7",
    "fullName": "TESORO, FRITZGERARD",
    "email": "agent7@dcprime.test",
    "phone": "-",
    "assignedProjects": [
      "project-1"
    ],
    "status": "Active"
  },
  {
    "id": "agent-8",
    "fullName": "RIOJA, KIRSTEN JHOYCE A.",
    "email": "agent8@dcprime.test",
    "phone": "-",
    "assignedProjects": [
      "project-1"
    ],
    "status": "Active"
  },
  {
    "id": "agent-9",
    "fullName": "PARROCHO, JOSEPH",
    "email": "agent9@dcprime.test",
    "phone": "-",
    "assignedProjects": [
      "project-1"
    ],
    "status": "Active"
  },
  {
    "id": "agent-10",
    "fullName": "TENORIO, MARK",
    "email": "agent10@dcprime.test",
    "phone": "-",
    "assignedProjects": [
      "project-1"
    ],
    "status": "Active"
  },
  {
    "id": "agent-11",
    "fullName": "ROXAS, SALIDONIA",
    "email": "agent11@dcprime.test",
    "phone": "-",
    "assignedProjects": [
      "project-1"
    ],
    "status": "Active"
  },
  {
    "id": "agent-12",
    "fullName": "RIL, AUNDRIA",
    "email": "agent12@dcprime.test",
    "phone": "-",
    "assignedProjects": [
      "project-1"
    ],
    "status": "Active"
  },
  {
    "id": "agent-13",
    "fullName": "ORAPA,  MARILOU",
    "email": "agent13@dcprime.test",
    "phone": "-",
    "assignedProjects": [
      "project-1"
    ],
    "status": "Active"
  },
  {
    "id": "agent-14",
    "fullName": "NEPOMUCENO, ERWIN",
    "email": "phproperty13@gmail.com",
    "phone": "0991-995-8155",
    "assignedProjects": [
      "project-1"
    ],
    "status": "Active"
  },
  {
    "id": "agent-15",
    "fullName": "SUMASTRE, GEMALENE",
    "email": "agent15@dcprime.test",
    "phone": "-",
    "assignedProjects": [
      "project-1"
    ],
    "status": "Active"
  }
]

export const listingsV2 = listings.map((listing, index) => ({
  id: `listing-${index + 1}`,
  unitId: listing.unitId,
  projectId: 'project-1',
  areaSqm: listing.area,
  sellingPrice: listing.totalContractPrice,
  status: listing.status,
  assignedClientId: listing.status === 'Available' ? null : `client-${(index % Math.max(1, clients.length)) + 1}`,
  images: [],
}))

export const payments = [
  {
    "id": "payment-1",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45686",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45686.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-2",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45716",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "100640",
    "amount": 45716.0,
    "penalty": 100640.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-3",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45744",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45742.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 3469673863.0
  },
  {
    "id": "payment-4",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45775",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45772.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 3090583624.0
  },
  {
    "id": "payment-5",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45805",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45809.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 2622983914.0
  },
  {
    "id": "payment-6",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45836",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45833.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 7291740249.0
  },
  {
    "id": "payment-7",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45866",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45864.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 7745663283.0
  },
  {
    "id": "payment-8",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45897",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45895.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 3016708285.0
  },
  {
    "id": "payment-9",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45928",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45926.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 3632185643.0
  },
  {
    "id": "payment-10",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45958",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45958.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 4971862886.0
  },
  {
    "id": "payment-11",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45989",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45989.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 1614850347.0
  },
  {
    "id": "payment-12",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "46019",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 46019.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 6563425818.0
  },
  {
    "id": "payment-13",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "46050",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 46050.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 4217557352.0
  },
  {
    "id": "payment-14",
    "clientId": "client-75",
    "clientName": "GERALDINE O. REGIS",
    "unitId": "LA-0410 (NEW)",
    "projectId": "project-1",
    "description": "46110",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "50000",
    "amount": 46091.0,
    "penalty": 50000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-15",
    "clientId": "client-75",
    "clientName": "KURT ERNEST M. LOMAN",
    "unitId": "LA-0410 (NEW)",
    "projectId": "project-1",
    "description": "46120",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "50000",
    "amount": 46120.0,
    "penalty": 50000.0,
    "status": "Verified",
    "runningBalance": 2039564182329.0
  },
  {
    "id": "payment-16",
    "clientId": "client-30",
    "clientName": "ERICO C. GERMANO JR",
    "unitId": "LA-0704 (NEW)",
    "projectId": "project-1",
    "description": "46110",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "50000",
    "amount": 46110.0,
    "penalty": 50000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-17",
    "clientId": "client-30",
    "clientName": "ERICO C. GERMANO JR",
    "unitId": "LA-0704 (NEW)",
    "projectId": "project-1",
    "description": "46141",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "23935",
    "amount": 46138.0,
    "penalty": 23935.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-18",
    "clientId": "client-76",
    "clientName": "MA. CZARINA A. CODON",
    "unitId": "LA-0407 (NEW)",
    "projectId": "project-1",
    "description": "46092",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "50000",
    "amount": 46092.0,
    "penalty": 50000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-19",
    "clientId": "client-76",
    "clientName": "MA. CZARINA A. CODON",
    "unitId": "LA-0407 (NEW)",
    "projectId": "project-1",
    "description": "46137",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "24500",
    "amount": 46135.0,
    "penalty": 24500.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-20",
    "clientId": "client-74",
    "clientName": "ERLOVE, BACUS",
    "unitId": "LA-1209 (NEW)",
    "projectId": "project-1",
    "description": "46076",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "50000",
    "amount": 46076.0,
    "penalty": 50000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-21",
    "clientId": "client-73",
    "clientName": "CHRISTINE B. BOLISAY",
    "unitId": "LA-0411& LA-0412(NEW)",
    "projectId": "project-1",
    "description": "46076",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "50000",
    "amount": 46076.0,
    "penalty": 50000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-22",
    "clientId": "client-73",
    "clientName": "CHRISTINE B. BOLISAY",
    "unitId": "LA-0411& LA-0412(NEW)",
    "projectId": "project-1",
    "description": "46083",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "430000",
    "amount": 46084.0,
    "penalty": 430000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-23",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45686",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45686.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-24",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45716",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "100640",
    "amount": 45716.0,
    "penalty": 100640.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-25",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45744",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45742.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 3469673863.0
  },
  {
    "id": "payment-26",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45775",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45772.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 3090583624.0
  },
  {
    "id": "payment-27",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45805",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45809.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 2622983914.0
  },
  {
    "id": "payment-28",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45836",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45833.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 7291740249.0
  },
  {
    "id": "payment-29",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45866",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45864.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 7745663283.0
  },
  {
    "id": "payment-30",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45897",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45895.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 3016708285.0
  },
  {
    "id": "payment-31",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45928",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45926.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 3632185643.0
  },
  {
    "id": "payment-32",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45958",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45958.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 4971862886.0
  },
  {
    "id": "payment-33",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45989",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45989.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 1614850347.0
  },
  {
    "id": "payment-34",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "46019",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 46019.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 6563425818.0
  },
  {
    "id": "payment-35",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "46050",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 46050.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 4217557352.0
  },
  {
    "id": "payment-36",
    "clientId": "client-69",
    "clientName": "JANDUSAY, JOHN WENDELL F.",
    "unitId": "LA-0801 (NEW)",
    "projectId": "project-1",
    "description": "46008",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 46008.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-37",
    "clientId": "client-11",
    "clientName": "DE SAN PEDRO, JOHN MHELCON",
    "unitId": "LA-0501 & LA-0502",
    "projectId": "project-1",
    "description": "45717",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45717.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-38",
    "clientId": "client-11",
    "clientName": "DE SAN PEDRO, JOHN MHELCON",
    "unitId": "LA-0501 & LA-0502",
    "projectId": "project-1",
    "description": "45745",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "200000",
    "amount": 45745.0,
    "penalty": 200000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-39",
    "clientId": "client-11",
    "clientName": "DE SAN PEDRO, JOHN MHELCON",
    "unitId": "LA-0501 & LA-0502",
    "projectId": "project-1",
    "description": "45756",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "100000",
    "amount": 45756.0,
    "penalty": 100000.0,
    "status": "Verified",
    "runningBalance": 331250815000163.0
  },
  {
    "id": "payment-40",
    "clientId": "client-11",
    "clientName": "DE SAN PEDRO, JOHN MHELCON",
    "unitId": "LA-0501 & LA-0502",
    "projectId": "project-1",
    "description": "45758",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "40000",
    "amount": 45758.0,
    "penalty": 40000.0,
    "status": "Verified",
    "runningBalance": 411250815000091.0
  },
  {
    "id": "payment-41",
    "clientId": "client-11",
    "clientName": "DE SAN PEDRO, JOHN MHELCON",
    "unitId": "LA-0501 & LA-0502",
    "projectId": "project-1",
    "description": "45793",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "60000",
    "amount": 45793.0,
    "penalty": 60000.0,
    "status": "Verified",
    "runningBalance": 516250815000047.0
  },
  {
    "id": "payment-42",
    "clientId": "client-11",
    "clientName": "DE SAN PEDRO, JOHN MHELCON",
    "unitId": "LA-0501 & LA-0502",
    "projectId": "project-1",
    "description": "45829",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "50000",
    "amount": 45829.0,
    "penalty": 140000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-43",
    "clientId": "client-11",
    "clientName": "DE SAN PEDRO, JOHN MHELCON",
    "unitId": "LA-0501 & LA-0502",
    "projectId": "project-1",
    "description": "45873",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "60000",
    "amount": 45873.0,
    "penalty": 25667.0,
    "status": "Verified",
    "runningBalance": 8042508150000248.0
  },
  {
    "id": "payment-44",
    "clientId": "client-11",
    "clientName": "DE SAN PEDRO, JOHN MHELCON",
    "unitId": "LA-0501 & LA-0502",
    "projectId": "project-1",
    "description": "45893",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "140000",
    "amount": 45893.0,
    "penalty": 25667.0,
    "status": "Verified",
    "runningBalance": 826250815000302.0
  },
  {
    "id": "payment-45",
    "clientId": "client-12",
    "clientName": "DE SAN PEDRO, JOHN MHELCON",
    "unitId": "LA-0501 & LA-0502",
    "projectId": "project-1",
    "description": "45717",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45717.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-46",
    "clientId": "client-12",
    "clientName": "DE SAN PEDRO, JOHN MHELCON",
    "unitId": "LA-0501 & LA-0502",
    "projectId": "project-1",
    "description": "45745",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "200000",
    "amount": 45745.0,
    "penalty": 200000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-47",
    "clientId": "client-12",
    "clientName": "DE SAN PEDRO, JOHN MHELCON",
    "unitId": "LA-0501 & LA-0502",
    "projectId": "project-1",
    "description": "45756",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "100000",
    "amount": 45756.0,
    "penalty": 100000.0,
    "status": "Verified",
    "runningBalance": 331250815000163.0
  },
  {
    "id": "payment-48",
    "clientId": "client-12",
    "clientName": "DE SAN PEDRO, JOHN MHELCON",
    "unitId": "LA-0501 & LA-0502",
    "projectId": "project-1",
    "description": "45758",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "40000",
    "amount": 45758.0,
    "penalty": 40000.0,
    "status": "Verified",
    "runningBalance": 411250815000091.0
  },
  {
    "id": "payment-49",
    "clientId": "client-12",
    "clientName": "DE SAN PEDRO, JOHN MHELCON",
    "unitId": "LA-0501 & LA-0502",
    "projectId": "project-1",
    "description": "45793",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "60000",
    "amount": 45793.0,
    "penalty": 60000.0,
    "status": "Verified",
    "runningBalance": 516250815000047.0
  },
  {
    "id": "payment-50",
    "clientId": "client-12",
    "clientName": "DE SAN PEDRO, JOHN MHELCON",
    "unitId": "LA-0501 & LA-0502",
    "projectId": "project-1",
    "description": "45829",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "50000",
    "amount": 45829.0,
    "penalty": 140000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-51",
    "clientId": "client-12",
    "clientName": "DE SAN PEDRO, JOHN MHELCON",
    "unitId": "LA-0501 & LA-0502",
    "projectId": "project-1",
    "description": "45873",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "60000",
    "amount": 45873.0,
    "penalty": 25667.0,
    "status": "Verified",
    "runningBalance": 8042508150000248.0
  },
  {
    "id": "payment-52",
    "clientId": "client-12",
    "clientName": "DE SAN PEDRO, JOHN MHELCON",
    "unitId": "LA-0501 & LA-0502",
    "projectId": "project-1",
    "description": "45893",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "140000",
    "amount": 45893.0,
    "penalty": 25667.0,
    "status": "Verified",
    "runningBalance": 826250815000302.0
  },
  {
    "id": "payment-53",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45686",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45686.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-54",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45716",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "100640",
    "amount": 45716.0,
    "penalty": 100640.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-55",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45744",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45742.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 3469673863.0
  },
  {
    "id": "payment-56",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45775",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45772.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 3090583624.0
  },
  {
    "id": "payment-57",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45805",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45809.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 2622983914.0
  },
  {
    "id": "payment-58",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45836",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45833.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 7291740249.0
  },
  {
    "id": "payment-59",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45866",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45864.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 7745663283.0
  },
  {
    "id": "payment-60",
    "clientId": "client-6",
    "clientName": "ELORA ANDREI A. DIZON",
    "unitId": "LA-0416",
    "projectId": "project-1",
    "description": "45897",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45895.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 3016708285.0
  },
  {
    "id": "payment-61",
    "clientId": "client-2",
    "clientName": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0401",
    "projectId": "project-1",
    "description": "45682",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45682.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-62",
    "clientId": "client-2",
    "clientName": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0401",
    "projectId": "project-1",
    "description": "45735",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "18133",
    "amount": 45735.0,
    "penalty": 18133.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-63",
    "clientId": "client-63",
    "clientName": "VILLEGAS, STEVE RANDY N.",
    "unitId": "LA-0705",
    "projectId": "project-1",
    "description": "45963",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45963.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-64",
    "clientId": "client-63",
    "clientName": "VILLEGAS, STEVE RANDY N.",
    "unitId": "LA-0705",
    "projectId": "project-1",
    "description": "45993",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "62667",
    "amount": 45992.0,
    "penalty": 62667.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-65",
    "clientId": "client-63",
    "clientName": "VILLEGAS, STEVE RANDY N.",
    "unitId": "LA-0705",
    "projectId": "project-1",
    "description": "46024",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "62667",
    "amount": 46023.0,
    "penalty": 62667.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-66",
    "clientId": "client-2",
    "clientName": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0401",
    "projectId": "project-1",
    "description": "45682",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45682.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-67",
    "clientId": "client-2",
    "clientName": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0401",
    "projectId": "project-1",
    "description": "45735",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "18133",
    "amount": 45735.0,
    "penalty": 18133.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-68",
    "clientId": "client-2",
    "clientName": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0402",
    "projectId": "project-1",
    "description": "45688",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45688.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-69",
    "clientId": "client-2",
    "clientName": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0402",
    "projectId": "project-1",
    "description": "45735",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "18133",
    "amount": 45735.0,
    "penalty": 18133.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-70",
    "clientId": "client-2",
    "clientName": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0402",
    "projectId": "project-1",
    "description": "45688",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45688.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-71",
    "clientId": "client-2",
    "clientName": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0402",
    "projectId": "project-1",
    "description": "45735",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "18133",
    "amount": 45735.0,
    "penalty": 18133.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-72",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45688",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45688.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-73",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45726",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "18133",
    "amount": 45726.0,
    "penalty": 18133.0,
    "status": "Verified",
    "runningBalance": 4733943493.0
  },
  {
    "id": "payment-74",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45757",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "18133",
    "amount": 45757.0,
    "penalty": 18133.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-75",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45787",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "18133",
    "amount": 45790.0,
    "penalty": 18133.0,
    "status": "Verified",
    "runningBalance": 40532271496196.0
  },
  {
    "id": "payment-76",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45818",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "18133",
    "amount": 45822.0,
    "penalty": 18133.0,
    "status": "Verified",
    "runningBalance": 8467498859.0
  },
  {
    "id": "payment-77",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45848",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "18133",
    "amount": 45850.0,
    "penalty": 18133.0,
    "status": "Verified",
    "runningBalance": 3741964993.0
  },
  {
    "id": "payment-78",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45879",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "18133",
    "amount": 45887.0,
    "penalty": 18133.0,
    "status": "Verified",
    "runningBalance": 5122146218.0
  },
  {
    "id": "payment-79",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45910",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45910.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 7481246346.0
  },
  {
    "id": "payment-80",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45940",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45944.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 949955293.0
  },
  {
    "id": "payment-81",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45971",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45974.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 702047751.0
  },
  {
    "id": "payment-82",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "46001",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 46002.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 8845328654.0
  },
  {
    "id": "payment-83",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "46032",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 46039.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 7470351817.0
  },
  {
    "id": "payment-84",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "46063",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 46064.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 5145578567.0
  },
  {
    "id": "payment-85",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "46091",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 46107.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 1643398537.0
  },
  {
    "id": "payment-86",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45688",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45688.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-87",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45726",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "18133",
    "amount": 45726.0,
    "penalty": 18133.0,
    "status": "Verified",
    "runningBalance": 4733943493.0
  },
  {
    "id": "payment-88",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45757",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "18133",
    "amount": 45757.0,
    "penalty": 18133.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-89",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45787",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "18133",
    "amount": 45790.0,
    "penalty": 18133.0,
    "status": "Verified",
    "runningBalance": 40532271496196.0
  },
  {
    "id": "payment-90",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45818",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "18133",
    "amount": 45822.0,
    "penalty": 18133.0,
    "status": "Verified",
    "runningBalance": 8467498859.0
  },
  {
    "id": "payment-91",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45848",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "18133",
    "amount": 45850.0,
    "penalty": 18133.0,
    "status": "Verified",
    "runningBalance": 3741964993.0
  },
  {
    "id": "payment-92",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45879",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "18133",
    "amount": 45887.0,
    "penalty": 18133.0,
    "status": "Verified",
    "runningBalance": 5122146218.0
  },
  {
    "id": "payment-93",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "projectId": "project-1",
    "description": "45910",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45910.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 7481246346.0
  },
  {
    "id": "payment-94",
    "clientId": "client-10",
    "clientName": "RUSIT, ERIC C.",
    "unitId": "COMBINED: LA-0305, LA0306 & LA-0307",
    "projectId": "project-1",
    "description": "45695",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "30000",
    "amount": 45695.0,
    "penalty": 30000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-95",
    "clientId": "client-10",
    "clientName": "RUSIT, ERIC C.",
    "unitId": "COMBINED: LA-0305, LA0306 & LA-0307",
    "projectId": "project-1",
    "description": "45731",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "54400",
    "amount": 45734.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 28868.0
  },
  {
    "id": "payment-96",
    "clientId": "client-10",
    "clientName": "RUSIT, ERIC C.",
    "unitId": "COMBINED: LA-0305, LA0306 & LA-0307",
    "projectId": "project-1",
    "description": "45762",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "54400",
    "amount": 45768.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 28852.0
  },
  {
    "id": "payment-97",
    "clientId": "client-10",
    "clientName": "RUSIT, ERIC C.",
    "unitId": "COMBINED: LA-0305, LA0306 & LA-0307",
    "projectId": "project-1",
    "description": "45792",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "54400",
    "amount": 45860.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 28853.0
  },
  {
    "id": "payment-98",
    "clientId": "client-10",
    "clientName": "RUSIT, ERIC C.",
    "unitId": "COMBINED: LA-0305, LA0306 & LA-0307",
    "projectId": "project-1",
    "description": "45823",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "54400",
    "amount": 45860.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 28854.0
  },
  {
    "id": "payment-99",
    "clientId": "client-10",
    "clientName": "RUSIT, ERIC C.",
    "unitId": "COMBINED: LA-0305, LA0306 & LA-0307",
    "projectId": "project-1",
    "description": "45853",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "54400",
    "amount": 45860.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 28855.0
  },
  {
    "id": "payment-100",
    "clientId": "client-10",
    "clientName": "RUSIT, ERIC C.",
    "unitId": "COMBINED: LA-0305, LA0306 & LA-0307",
    "projectId": "project-1",
    "description": "45884",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "54400",
    "amount": 45888.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 28867.0
  },
  {
    "id": "payment-101",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45695",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45695.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-102",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45736",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "77533",
    "amount": 45736.0,
    "penalty": 77533.0,
    "status": "Verified",
    "runningBalance": 1742480212211.0
  },
  {
    "id": "payment-103",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45767",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "77533",
    "amount": 45769.0,
    "penalty": 77533.0,
    "status": "Verified",
    "runningBalance": 422250816000178.0
  },
  {
    "id": "payment-104",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45797",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "77533",
    "amount": 45860.0,
    "penalty": 77533.0,
    "status": "Verified",
    "runningBalance": 6000021652.0
  },
  {
    "id": "payment-105",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45828",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "77533",
    "amount": 45860.0,
    "penalty": 77533.0,
    "status": "Verified",
    "runningBalance": 6000021653.0
  },
  {
    "id": "payment-106",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45858",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "77533",
    "amount": 45860.0,
    "penalty": 77533.0,
    "status": "Verified",
    "runningBalance": 6000021654.0
  },
  {
    "id": "payment-107",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45889",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "77533",
    "amount": 45897.0,
    "penalty": 77533.0,
    "status": "Verified",
    "runningBalance": 6000021655.0
  },
  {
    "id": "payment-108",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45920",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "61600",
    "amount": 45925.0,
    "penalty": 61600.0,
    "status": "Verified",
    "runningBalance": 925250810000050.0
  },
  {
    "id": "payment-109",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45950",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "61600",
    "amount": 45966.0,
    "penalty": 61600.0,
    "status": "Verified",
    "runningBalance": 1104250810000121.0
  },
  {
    "id": "payment-110",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45981",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "61600",
    "amount": 45981.0,
    "penalty": 61600.0,
    "status": "Verified",
    "runningBalance": 1120250810000081.0
  },
  {
    "id": "payment-111",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "46011",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "61600",
    "amount": 46030.0,
    "penalty": 61600.0,
    "status": "Verified",
    "runningBalance": 108260816000164.0
  },
  {
    "id": "payment-112",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "46042",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "61600",
    "amount": 46043.0,
    "penalty": 61600.0,
    "status": "Verified",
    "runningBalance": 121260810000065.0
  },
  {
    "id": "payment-113",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45695",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45695.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-114",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45736",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "77533",
    "amount": 45736.0,
    "penalty": 77533.0,
    "status": "Verified",
    "runningBalance": 1742480212211.0
  },
  {
    "id": "payment-115",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45767",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "77533",
    "amount": 45769.0,
    "penalty": 77533.0,
    "status": "Verified",
    "runningBalance": 422250816000178.0
  },
  {
    "id": "payment-116",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45797",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "77533",
    "amount": 45860.0,
    "penalty": 77533.0,
    "status": "Verified",
    "runningBalance": 6000021652.0
  },
  {
    "id": "payment-117",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45828",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "77533",
    "amount": 45860.0,
    "penalty": 77533.0,
    "status": "Verified",
    "runningBalance": 6000021653.0
  },
  {
    "id": "payment-118",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45858",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "77533",
    "amount": 45860.0,
    "penalty": 77533.0,
    "status": "Verified",
    "runningBalance": 6000021654.0
  },
  {
    "id": "payment-119",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "projectId": "project-1",
    "description": "45889",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "77533",
    "amount": 45897.0,
    "penalty": 77533.0,
    "status": "Verified",
    "runningBalance": 6000021655.0
  },
  {
    "id": "payment-120",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "45697",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45697.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-121",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "45726",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "37933",
    "amount": 45728.0,
    "penalty": 37933.0,
    "status": "Verified",
    "runningBalance": 48939366.0
  },
  {
    "id": "payment-122",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "45757",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "37933",
    "amount": 45758.0,
    "penalty": 37933.0,
    "status": "Verified",
    "runningBalance": 59284370.0
  },
  {
    "id": "payment-123",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "45787",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "37933",
    "amount": 45790.0,
    "penalty": 37933.0,
    "status": "Verified",
    "runningBalance": 74830152.0
  },
  {
    "id": "payment-124",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "45818",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "37933",
    "amount": 45859.0,
    "penalty": 37933.0,
    "status": "Verified",
    "runningBalance": 110056528.0
  },
  {
    "id": "payment-125",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "45848",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "37933",
    "amount": 45869.0,
    "penalty": 37933.0,
    "status": "Verified",
    "runningBalance": 11466504.0
  },
  {
    "id": "payment-126",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "45879",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "37933",
    "amount": 45891.0,
    "penalty": 37933.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-127",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "45910",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "29000",
    "amount": 45937.0,
    "penalty": 29000.0,
    "status": "Verified",
    "runningBalance": 150974210.0
  },
  {
    "id": "payment-128",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "45940",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "29000",
    "amount": 45966.0,
    "penalty": 29000.0,
    "status": "Verified",
    "runningBalance": 168107133.0
  },
  {
    "id": "payment-129",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "45971",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "30000",
    "amount": 46042.0,
    "penalty": 29000.0,
    "status": "Verified",
    "runningBalance": 891629439.0
  },
  {
    "id": "payment-130",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "46001",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "30000",
    "amount": 46043.0,
    "penalty": 29000.0,
    "status": "Verified",
    "runningBalance": 893937087.0
  },
  {
    "id": "payment-131",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "46032",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "30000",
    "amount": 46048.0,
    "penalty": 29000.0,
    "status": "Verified",
    "runningBalance": 906969935.0
  },
  {
    "id": "payment-132",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "45697",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45697.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-133",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "45726",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "37933",
    "amount": 45728.0,
    "penalty": 37933.0,
    "status": "Verified",
    "runningBalance": 48939366.0
  },
  {
    "id": "payment-134",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "45757",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "37933",
    "amount": 45758.0,
    "penalty": 37933.0,
    "status": "Verified",
    "runningBalance": 59284370.0
  },
  {
    "id": "payment-135",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "45787",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "37933",
    "amount": 45790.0,
    "penalty": 37933.0,
    "status": "Verified",
    "runningBalance": 74830152.0
  },
  {
    "id": "payment-136",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "45818",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "37933",
    "amount": 45859.0,
    "penalty": 37933.0,
    "status": "Verified",
    "runningBalance": 110056528.0
  },
  {
    "id": "payment-137",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "COMBINED: LA-0412 & LA-0414",
    "projectId": "project-1",
    "description": "45848",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "37933",
    "amount": 45869.0,
    "penalty": 37933.0,
    "status": "Verified",
    "runningBalance": 11466504.0
  },
  {
    "id": "payment-138",
    "clientId": "client-3",
    "clientName": "CABISON, CHERRY MAE E.",
    "unitId": "LA-0406",
    "projectId": "project-1",
    "description": "45698",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45698.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 7025595421573.0
  },
  {
    "id": "payment-139",
    "clientId": "client-3",
    "clientName": "CABISON, CHERRY MAE E.",
    "unitId": "LA-0406",
    "projectId": "project-1",
    "description": "45735",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "50000",
    "amount": 45735.0,
    "penalty": 50000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-140",
    "clientId": "client-3",
    "clientName": "CABISON, CHERRY MAE E.",
    "unitId": "LA-0406",
    "projectId": "project-1",
    "description": "45698",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45698.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 7025595421573.0
  },
  {
    "id": "payment-141",
    "clientId": "client-3",
    "clientName": "CABISON, CHERRY MAE E.",
    "unitId": "LA-0406",
    "projectId": "project-1",
    "description": "45735",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "50000",
    "amount": 45735.0,
    "penalty": 50000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-142",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "projectId": "project-1",
    "description": "45700",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45699.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-143",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "projectId": "project-1",
    "description": "45744",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "36266",
    "amount": 45744.0,
    "penalty": 36266.0,
    "status": "Verified",
    "runningBalance": 85930402.0
  },
  {
    "id": "payment-144",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "projectId": "project-1",
    "description": "45775",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "36266",
    "amount": 45775.0,
    "penalty": 36266.0,
    "status": "Verified",
    "runningBalance": 160288831.0
  },
  {
    "id": "payment-145",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "projectId": "project-1",
    "description": "45805",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "36266",
    "amount": 45804.0,
    "penalty": 36266.0,
    "status": "Verified",
    "runningBalance": 233055610.0
  },
  {
    "id": "payment-146",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "projectId": "project-1",
    "description": "45836",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "15400",
    "amount": 45838.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 25180688107.0
  },
  {
    "id": "payment-147",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "projectId": "project-1",
    "description": "45866",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "15400",
    "amount": 45870.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 403720243.0
  },
  {
    "id": "payment-148",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "projectId": "project-1",
    "description": "45897",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "15400",
    "amount": 45899.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-149",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "projectId": "project-1",
    "description": "45928",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "15400",
    "amount": 45930.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-150",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "projectId": "project-1",
    "description": "45958",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "15400",
    "amount": 45990.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 731646315.0
  },
  {
    "id": "payment-151",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "projectId": "project-1",
    "description": "45700",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45699.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-152",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "projectId": "project-1",
    "description": "45744",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "36200",
    "amount": 45744.0,
    "penalty": 36200.0,
    "status": "Verified",
    "runningBalance": 85930402.0
  },
  {
    "id": "payment-153",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "projectId": "project-1",
    "description": "45775",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "36200",
    "amount": 45775.0,
    "penalty": 36200.0,
    "status": "Verified",
    "runningBalance": 160288831.0
  },
  {
    "id": "payment-154",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "projectId": "project-1",
    "description": "45805",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "36200",
    "amount": 45804.0,
    "penalty": 36200.0,
    "status": "Verified",
    "runningBalance": 233055610.0
  },
  {
    "id": "payment-155",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "projectId": "project-1",
    "description": "45836",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "15400",
    "amount": 45870.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 403720243.0
  },
  {
    "id": "payment-156",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "projectId": "project-1",
    "description": "45866",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "15400",
    "amount": 45899.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 483221435.0
  },
  {
    "id": "payment-157",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "projectId": "project-1",
    "description": "45897",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "15400",
    "amount": 45905.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 497581396.0
  },
  {
    "id": "payment-158",
    "clientId": "client-16",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "projectId": "project-1",
    "description": "45700",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45700.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-159",
    "clientId": "client-16",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "projectId": "project-1",
    "description": "45744",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "36266",
    "amount": 45747.0,
    "penalty": 36266.0,
    "status": "Verified",
    "runningBalance": 213995.0
  },
  {
    "id": "payment-160",
    "clientId": "client-16",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "projectId": "project-1",
    "description": "45775",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "36266",
    "amount": 45777.0,
    "penalty": 36266.0,
    "status": "Verified",
    "runningBalance": 20003000018447.0
  },
  {
    "id": "payment-161",
    "clientId": "client-16",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "projectId": "project-1",
    "description": "45805",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "36266",
    "amount": 45808.0,
    "penalty": 36266.0,
    "status": "Verified",
    "runningBalance": 3000252234.0
  },
  {
    "id": "payment-162",
    "clientId": "client-16",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "projectId": "project-1",
    "description": "45836",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45837.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-163",
    "clientId": "client-16",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "projectId": "project-1",
    "description": "45866",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45868.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 3000010887.0
  },
  {
    "id": "payment-164",
    "clientId": "client-16",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "projectId": "project-1",
    "description": "45897",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45905.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-165",
    "clientId": "client-16",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "projectId": "project-1",
    "description": "45928",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45932.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-166",
    "clientId": "client-16",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "projectId": "project-1",
    "description": "45958",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45964.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 1569028813.0
  },
  {
    "id": "payment-167",
    "clientId": "client-16",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "projectId": "project-1",
    "description": "45700",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45700.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-168",
    "clientId": "client-16",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "projectId": "project-1",
    "description": "45744",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "36200",
    "amount": 45747.0,
    "penalty": 36200.0,
    "status": "Verified",
    "runningBalance": 213995.0
  },
  {
    "id": "payment-169",
    "clientId": "client-16",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "projectId": "project-1",
    "description": "45775",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "36200",
    "amount": 45777.0,
    "penalty": 36200.0,
    "status": "Verified",
    "runningBalance": 20003000018447.0
  },
  {
    "id": "payment-170",
    "clientId": "client-16",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "projectId": "project-1",
    "description": "45805",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "36200",
    "amount": 45808.0,
    "penalty": 36200.0,
    "status": "Verified",
    "runningBalance": 3000252234.0
  },
  {
    "id": "payment-171",
    "clientId": "client-16",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "projectId": "project-1",
    "description": "45836",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "15400",
    "amount": 45868.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 3000010887.0
  },
  {
    "id": "payment-172",
    "clientId": "client-33",
    "clientName": "NEWTON, CURLIE",
    "unitId": "LA-0422",
    "projectId": "project-1",
    "description": "45715",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45715.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-173",
    "clientId": "client-33",
    "clientName": "NEWTON, CURLIE",
    "unitId": "LA-0422",
    "projectId": "project-1",
    "description": "45728",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "8160",
    "amount": 45728.0,
    "penalty": 8160.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-174",
    "clientId": "client-33",
    "clientName": "NEWTON, CURLIE",
    "unitId": "LA-0422",
    "projectId": "project-1",
    "description": "45728",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "100640",
    "amount": 45728.0,
    "penalty": 100640.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-175",
    "clientId": "client-33",
    "clientName": "NEWTON, CURLIE",
    "unitId": "LA-0422",
    "projectId": "project-1",
    "description": "45765",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "15400",
    "amount": 45768.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 142437596.0
  },
  {
    "id": "payment-176",
    "clientId": "client-33",
    "clientName": "NEWTON, CURLIE",
    "unitId": "LA-0422",
    "projectId": "project-1",
    "description": "45795",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "15400",
    "amount": 45796.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 4687103.0
  },
  {
    "id": "payment-177",
    "clientId": "client-33",
    "clientName": "NEWTON, CURLIE",
    "unitId": "LA-0422",
    "projectId": "project-1",
    "description": "45826",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "15400",
    "amount": 45828.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 294099989.0
  },
  {
    "id": "payment-178",
    "clientId": "client-33",
    "clientName": "NEWTON, CURLIE",
    "unitId": "LA-0422",
    "projectId": "project-1",
    "description": "45856",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "30400",
    "amount": 45888.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 2408333.0
  },
  {
    "id": "payment-179",
    "clientId": "client-34",
    "clientName": "NEWTON, CURLIE",
    "unitId": "LA-0422",
    "projectId": "project-1",
    "description": "45715",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45715.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-180",
    "clientId": "client-34",
    "clientName": "NEWTON, CURLIE",
    "unitId": "LA-0422",
    "projectId": "project-1",
    "description": "45728",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "8160",
    "amount": 45728.0,
    "penalty": 8160.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-181",
    "clientId": "client-34",
    "clientName": "NEWTON, CURLIE",
    "unitId": "LA-0422",
    "projectId": "project-1",
    "description": "45728",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "100640",
    "amount": 45728.0,
    "penalty": 100640.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-182",
    "clientId": "client-34",
    "clientName": "NEWTON, CURLIE",
    "unitId": "LA-0422",
    "projectId": "project-1",
    "description": "45765",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "15400",
    "amount": 45768.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 142437596.0
  },
  {
    "id": "payment-183",
    "clientId": "client-34",
    "clientName": "NEWTON, CURLIE",
    "unitId": "LA-0422",
    "projectId": "project-1",
    "description": "45795",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "15400",
    "amount": 45796.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 4687103.0
  },
  {
    "id": "payment-184",
    "clientId": "client-34",
    "clientName": "NEWTON, CURLIE",
    "unitId": "LA-0422",
    "projectId": "project-1",
    "description": "45826",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "15400",
    "amount": 45828.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 294099989.0
  },
  {
    "id": "payment-185",
    "clientId": "client-34",
    "clientName": "NEWTON, CURLIE",
    "unitId": "LA-0422",
    "projectId": "project-1",
    "description": "45856",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "30400",
    "amount": 45888.0,
    "penalty": 15400.0,
    "status": "Verified",
    "runningBalance": 2408333.0
  },
  {
    "id": "payment-186",
    "clientId": "client-35",
    "clientName": "DIMAISIP, BRYAN TAN",
    "unitId": "LA-1101",
    "projectId": "project-1",
    "description": "45726",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45726.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-187",
    "clientId": "client-35",
    "clientName": "DIMAISIP, BRYAN TAN",
    "unitId": "LA-1101",
    "projectId": "project-1",
    "description": "45744",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "16084",
    "amount": 45726.0,
    "penalty": 16084.0,
    "status": "Verified",
    "runningBalance": 44996775.0
  },
  {
    "id": "payment-188",
    "clientId": "client-35",
    "clientName": "DIMAISIP, BRYAN TAN",
    "unitId": "LA-1101",
    "projectId": "project-1",
    "description": "45775",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "16084",
    "amount": 45768.0,
    "penalty": 16084.0,
    "status": "Verified",
    "runningBalance": 142648353.0
  },
  {
    "id": "payment-189",
    "clientId": "client-35",
    "clientName": "DIMAISIP, BRYAN TAN",
    "unitId": "LA-1101",
    "projectId": "project-1",
    "description": "45805",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "16084",
    "amount": 45796.0,
    "penalty": 16084.0,
    "status": "Verified",
    "runningBalance": 212826957.0
  },
  {
    "id": "payment-190",
    "clientId": "client-35",
    "clientName": "DIMAISIP, BRYAN TAN",
    "unitId": "LA-1101",
    "projectId": "project-1",
    "description": "45836",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "16084",
    "amount": 45820.0,
    "penalty": 16084.0,
    "status": "Verified",
    "runningBalance": 273580714.0
  },
  {
    "id": "payment-191",
    "clientId": "client-36",
    "clientName": "CALIBOSO, MARY JANE",
    "unitId": "LA-0701",
    "projectId": "project-1",
    "description": "45726",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45748.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 9027339963817.0
  },
  {
    "id": "payment-192",
    "clientId": "client-36",
    "clientName": "CALIBOSO, MARY JANE",
    "unitId": "LA-0701",
    "projectId": "project-1",
    "description": "45744",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "46166",
    "amount": 45782.0,
    "penalty": 46166.0,
    "status": "Verified",
    "runningBalance": 1022838.0
  },
  {
    "id": "payment-193",
    "clientId": "client-29",
    "clientName": "JOHNSON, CHERRY F.",
    "unitId": "LA-1201 (CORNER)",
    "projectId": "project-1",
    "description": "45738",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45738.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-194",
    "clientId": "client-29",
    "clientName": "JOHNSON, CHERRY F.",
    "unitId": "LA-1201 (CORNER)",
    "projectId": "project-1",
    "description": "45738",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45738.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-195",
    "clientId": "client-29",
    "clientName": "JOHNSON, CHERRY F.",
    "unitId": "LA-1201 (CORNER)",
    "projectId": "project-1",
    "description": "45738",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45738.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-196",
    "clientId": "client-29",
    "clientName": "JOHNSON, CHERRY F.",
    "unitId": "LA-1201 (CORNER)",
    "projectId": "project-1",
    "description": "45738",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45738.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-197",
    "clientId": "client-33",
    "clientName": "LAYUG, EDWARD JO S.",
    "unitId": "LA-0205",
    "projectId": "project-1",
    "description": "45740",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "108800",
    "amount": 45740.0,
    "penalty": 108800.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-198",
    "clientId": "client-33",
    "clientName": "LAYUG, EDWARD JO S.",
    "unitId": "LA-0205",
    "projectId": "project-1",
    "description": "45740",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "108800",
    "amount": 45740.0,
    "penalty": 108800.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-199",
    "clientId": "client-40",
    "clientName": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "projectId": "project-1",
    "description": "45739",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45739.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-200",
    "clientId": "client-40",
    "clientName": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "projectId": "project-1",
    "description": "45785",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "90000",
    "amount": 45785.0,
    "penalty": 90000.0,
    "status": "Verified",
    "runningBalance": 508250214000169.0
  },
  {
    "id": "payment-201",
    "clientId": "client-40",
    "clientName": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "projectId": "project-1",
    "description": "45825",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "90000",
    "amount": 45825.0,
    "penalty": 90000.0,
    "status": "Verified",
    "runningBalance": 617250214000119.0
  },
  {
    "id": "payment-202",
    "clientId": "client-40",
    "clientName": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "projectId": "project-1",
    "description": "45868",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "90000",
    "amount": 45868.0,
    "penalty": 90000.0,
    "status": "Verified",
    "runningBalance": 730250212000204.0
  },
  {
    "id": "payment-203",
    "clientId": "client-40",
    "clientName": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "projectId": "project-1",
    "description": "45899",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "59167",
    "amount": 45879.0,
    "penalty": 59167.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-204",
    "clientId": "client-40",
    "clientName": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "projectId": "project-1",
    "description": "45930",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "59167",
    "amount": 45879.0,
    "penalty": 59167.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-205",
    "clientId": "client-40",
    "clientName": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "projectId": "project-1",
    "description": "45739",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45739.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-206",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "projectId": "project-1",
    "description": "45757",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45757.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 68208991.0
  },
  {
    "id": "payment-207",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "projectId": "project-1",
    "description": "45793",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "40417",
    "amount": 45790.0,
    "penalty": 40417.0,
    "status": "Verified",
    "runningBalance": 116959.0
  },
  {
    "id": "payment-208",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "projectId": "project-1",
    "description": "45824",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "40417",
    "amount": 45818.0,
    "penalty": 40417.0,
    "status": "Verified",
    "runningBalance": 640985.0
  },
  {
    "id": "payment-209",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "projectId": "project-1",
    "description": "45854",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "40417",
    "amount": 45848.0,
    "penalty": 40417.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-210",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "projectId": "project-1",
    "description": "45885",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "40417",
    "amount": 45879.0,
    "penalty": 40417.0,
    "status": "Verified",
    "runningBalance": 923052.0
  },
  {
    "id": "payment-211",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "projectId": "project-1",
    "description": "45916",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "40417",
    "amount": 45911.0,
    "penalty": 40417.0,
    "status": "Verified",
    "runningBalance": 2340741748.0
  },
  {
    "id": "payment-212",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "projectId": "project-1",
    "description": "45757",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45757.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 68208991.0
  },
  {
    "id": "payment-213",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "projectId": "project-1",
    "description": "45793",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "40417",
    "amount": 45790.0,
    "penalty": 40417.0,
    "status": "Verified",
    "runningBalance": 116959.0
  },
  {
    "id": "payment-214",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "projectId": "project-1",
    "description": "45824",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "40417",
    "amount": 45818.0,
    "penalty": 40417.0,
    "status": "Verified",
    "runningBalance": 640985.0
  },
  {
    "id": "payment-215",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "projectId": "project-1",
    "description": "45854",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "40417",
    "amount": 45848.0,
    "penalty": 40417.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-216",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "projectId": "project-1",
    "description": "45885",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "40417",
    "amount": 45879.0,
    "penalty": 40417.0,
    "status": "Verified",
    "runningBalance": 923052.0
  },
  {
    "id": "payment-217",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "projectId": "project-1",
    "description": "45916",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "40417",
    "amount": 45911.0,
    "penalty": 40417.0,
    "status": "Verified",
    "runningBalance": 2340741748.0
  },
  {
    "id": "payment-218",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45766",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "50000",
    "amount": 45766.0,
    "penalty": 50000.0,
    "status": "Verified",
    "runningBalance": 213167793.0
  },
  {
    "id": "payment-219",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45766",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "87362.5",
    "amount": 45766.0,
    "penalty": 87362.5,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-220",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45827",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "20000",
    "amount": 45825.0,
    "penalty": 20000.0,
    "status": "Verified",
    "runningBalance": 287574820.0
  },
  {
    "id": "payment-221",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45857",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "20000",
    "amount": 45856.0,
    "penalty": 20000.0,
    "status": "Verified",
    "runningBalance": 368353781.0
  },
  {
    "id": "payment-222",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45888",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "20000",
    "amount": 45876.0,
    "penalty": 20000.0,
    "status": "Verified",
    "runningBalance": 421581631.0
  },
  {
    "id": "payment-223",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45919",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "20000",
    "amount": 45916.0,
    "penalty": 20000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-224",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45949",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "20000",
    "amount": 45940.0,
    "penalty": 20000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-225",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45980",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "20000",
    "amount": 45961.0,
    "penalty": 20000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-226",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "46010",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "20000",
    "amount": 45263.0,
    "penalty": 20000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-227",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45676",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "20000",
    "amount": 46058.0,
    "penalty": 20000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-228",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45707",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "20000",
    "amount": 46058.0,
    "penalty": 20000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-229",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45735",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "20000",
    "amount": 46083.0,
    "penalty": 20000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-230",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45766",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "20000",
    "amount": 46112.0,
    "penalty": 20000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-231",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45796",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "20000",
    "amount": 46143.0,
    "penalty": 20000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-232",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45827",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "20000",
    "amount": 46169.0,
    "penalty": 20000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-233",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45766",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "50000",
    "amount": 45766.0,
    "penalty": 50000.0,
    "status": "Verified",
    "runningBalance": 213167793.0
  },
  {
    "id": "payment-234",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45766",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "87362.5",
    "amount": 45766.0,
    "penalty": 87362.5,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-235",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45827",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "20000",
    "amount": 45825.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 287574820.0
  },
  {
    "id": "payment-236",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45857",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "20000",
    "amount": 45856.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 368353781.0
  },
  {
    "id": "payment-237",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "projectId": "project-1",
    "description": "45888",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "20000",
    "amount": 45876.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 421581631.0
  },
  {
    "id": "payment-238",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "projectId": "project-1",
    "description": "45795",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45795.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 3000188716.0
  },
  {
    "id": "payment-239",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "projectId": "project-1",
    "description": "45797",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10125",
    "amount": 45797.0,
    "penalty": 10125.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-240",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "projectId": "project-1",
    "description": "45797",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "128375",
    "amount": 45797.0,
    "penalty": 128375.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-241",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "projectId": "project-1",
    "description": "45870",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "28875",
    "amount": 45797.0,
    "penalty": 28875.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-242",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "projectId": "project-1",
    "description": "45901",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "28875",
    "amount": 45797.0,
    "penalty": 28875.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-243",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "projectId": "project-1",
    "description": "45931",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "28875",
    "amount": 45917.0,
    "penalty": 28875.0,
    "status": "Verified",
    "runningBalance": 3000061486.0
  },
  {
    "id": "payment-244",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "projectId": "project-1",
    "description": "45962",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "28875",
    "amount": 45945.0,
    "penalty": 28875.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-245",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "projectId": "project-1",
    "description": "45992",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "28875",
    "amount": 45946.0,
    "penalty": 28875.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-246",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "projectId": "project-1",
    "description": "46023",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "28875",
    "amount": 45959.0,
    "penalty": 28875.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-247",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "projectId": "project-1",
    "description": "45795",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45795.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 3000188716.0
  },
  {
    "id": "payment-248",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "projectId": "project-1",
    "description": "45797",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10125",
    "amount": 45797.0,
    "penalty": 10125.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-249",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "projectId": "project-1",
    "description": "45797",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "128375",
    "amount": 45797.0,
    "penalty": 128375.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-250",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "projectId": "project-1",
    "description": "45870",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "28875",
    "amount": 45797.0,
    "penalty": 28875.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-251",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "projectId": "project-1",
    "description": "45901",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "28875",
    "amount": 45797.0,
    "penalty": 28875.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-252",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "45807",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "10000",
    "amount": 45807.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 530250813000268.0
  },
  {
    "id": "payment-253",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "45807",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "128375",
    "amount": 45807.0,
    "penalty": 128375.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-254",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "45807",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "8987",
    "amount": 45807.0,
    "penalty": 8987.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-255",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "45843",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "19250",
    "amount": 45840.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 327295895.0
  },
  {
    "id": "payment-256",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "45874",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "19250",
    "amount": 45871.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 408004359.0
  },
  {
    "id": "payment-257",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "45905",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "19250",
    "amount": 45904.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-258",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "45935",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "19250",
    "amount": 45935.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-259",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "45966",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "19250",
    "amount": 45961.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-260",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "45996",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "19250",
    "amount": 45994.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-261",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "46027",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "19250",
    "amount": 46024.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-262",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "46058",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "19250",
    "amount": 46058.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-263",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "46086",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "19250",
    "amount": 46083.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-264",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "46117",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "19250",
    "amount": 46112.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-265",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "46147",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "19250",
    "amount": 46143.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-266",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "45807",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45807.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 530250813000268.0
  },
  {
    "id": "payment-267",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "45807",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "128375",
    "amount": 45735.0,
    "penalty": 137362.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-268",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "45843",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "19250",
    "amount": 45840.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 327295895.0
  },
  {
    "id": "payment-269",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "45874",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "19250",
    "amount": 45871.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 408004359.0
  },
  {
    "id": "payment-270",
    "clientId": "client-46",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "projectId": "project-1",
    "description": "45905",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "12/30/1899",
    "referenceNumber": "19250",
    "amount": 45904.0,
    "penalty": 19250.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-271",
    "clientId": "client-49",
    "clientName": "ALAMER, JAZZIE",
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "projectId": "project-1",
    "description": "11441",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 11441.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 297986.0
  },
  {
    "id": "payment-272",
    "clientId": "client-49",
    "clientName": "ALAMER, JAZZIE",
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "projectId": "project-1",
    "description": "11441",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 11441.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 218378.0
  },
  {
    "id": "payment-273",
    "clientId": "client-49",
    "clientName": "ALAMER, JAZZIE",
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "projectId": "project-1",
    "description": "45688",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "20000",
    "amount": 45688.0,
    "penalty": 20000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-274",
    "clientId": "client-49",
    "clientName": "ALAMER, JAZZIE",
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "projectId": "project-1",
    "description": "45793",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "255000",
    "amount": 45735.0,
    "penalty": 0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-275",
    "clientId": "client-55",
    "clientName": "GALENG, ANGELITA",
    "unitId": "LA-0809",
    "projectId": "project-1",
    "description": "45802",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45802.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  },
  {
    "id": "payment-276",
    "clientId": "client-55",
    "clientName": "GALENG, ANGELITA",
    "unitId": "LA-0809",
    "projectId": "project-1",
    "description": "45802",
    "bank": "BANK",
    "accountNumber": "-",
    "date": "",
    "referenceNumber": "10000",
    "amount": 45802.0,
    "penalty": 10000.0,
    "status": "Verified",
    "runningBalance": 0
  }
]
export const commissionRules: CommissionRule[] = [
  {
    "id": "rule-1",
    "projectId": "project-1",
    "agentId": "agent-1",
    "agentRate": 0.05,
    "managerRate": 0.02,
    "releaseThreshold": 0.3,
    "retentionRate": 0.25,
    "status": "Active"
  },
  {
    "id": "rule-2",
    "projectId": "project-1",
    "agentId": "agent-3",
    "agentRate": 0.05,
    "managerRate": 0.02,
    "releaseThreshold": 0.3,
    "retentionRate": 0.25,
    "status": "Active"
  },
  {
    "id": "rule-3",
    "projectId": "project-1",
    "agentId": "agent-4",
    "agentRate": 0.05,
    "managerRate": 0.02,
    "releaseThreshold": 0.3,
    "retentionRate": 0.25,
    "status": "Active"
  },
  {
    "id": "rule-4",
    "projectId": "project-1",
    "agentId": "agent-5",
    "agentRate": 0.05,
    "managerRate": 0.02,
    "releaseThreshold": 0.3,
    "retentionRate": 0.25,
    "status": "Active"
  },
  {
    "id": "rule-5",
    "projectId": "project-1",
    "agentId": "agent-6",
    "agentRate": 0.05,
    "managerRate": 0.02,
    "releaseThreshold": 0.3,
    "retentionRate": 0.25,
    "status": "Active"
  },
  {
    "id": "rule-6",
    "projectId": "project-1",
    "agentId": "agent-7",
    "agentRate": 0.05,
    "managerRate": 0.02,
    "releaseThreshold": 0.3,
    "retentionRate": 0.25,
    "status": "Active"
  },
  {
    "id": "rule-7",
    "projectId": "project-1",
    "agentId": "agent-8",
    "agentRate": 0.05,
    "managerRate": 0.02,
    "releaseThreshold": 0.3,
    "retentionRate": 0.25,
    "status": "Active"
  },
  {
    "id": "rule-8",
    "projectId": "project-1",
    "agentId": "agent-9",
    "agentRate": 0.05,
    "managerRate": 0.02,
    "releaseThreshold": 0.3,
    "retentionRate": 0.25,
    "status": "Active"
  },
  {
    "id": "rule-9",
    "projectId": "project-1",
    "agentId": "agent-10",
    "agentRate": 0.05,
    "managerRate": 0.02,
    "releaseThreshold": 0.3,
    "retentionRate": 0.25,
    "status": "Active"
  },
  {
    "id": "rule-10",
    "projectId": "project-1",
    "agentId": "agent-11",
    "agentRate": 0.05,
    "managerRate": 0.02,
    "releaseThreshold": 0.3,
    "retentionRate": 0.25,
    "status": "Active"
  },
  {
    "id": "rule-11",
    "projectId": "project-1",
    "agentId": "agent-13",
    "agentRate": 0.05,
    "managerRate": 0.02,
    "releaseThreshold": 0.3,
    "retentionRate": 0.25,
    "status": "Active"
  },
  {
    "id": "rule-12",
    "projectId": "project-1",
    "agentId": "agent-14",
    "agentRate": 0.05,
    "managerRate": 0.02,
    "releaseThreshold": 0.3,
    "retentionRate": 0.25,
    "status": "Active"
  },
  {
    "id": "rule-13",
    "projectId": "project-1",
    "agentId": "agent-15",
    "agentRate": 0.05,
    "managerRate": 0.02,
    "releaseThreshold": 0.3,
    "retentionRate": 0.25,
    "status": "Active"
  }
]
export const clientDocuments = [
  {
    "id": "doc-1-1",
    "clientId": "client-1",
    "clientName": "SILVA, ISABEL LAYUG L.",
    "unitId": "LA-0204",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-1-2",
    "clientId": "client-1",
    "clientName": "SILVA, ISABEL LAYUG L.",
    "unitId": "LA-0204",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-1-3",
    "clientId": "client-1",
    "clientName": "SILVA, ISABEL LAYUG L.",
    "unitId": "LA-0204",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-1-4",
    "clientId": "client-1",
    "clientName": "SILVA, ISABEL LAYUG L.",
    "unitId": "LA-0204",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-1-5",
    "clientId": "client-1",
    "clientName": "SILVA, ISABEL LAYUG L.",
    "unitId": "LA-0204",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-1-6",
    "clientId": "client-1",
    "clientName": "SILVA, ISABEL LAYUG L.",
    "unitId": "LA-0204",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-1-7",
    "clientId": "client-1",
    "clientName": "SILVA, ISABEL LAYUG L.",
    "unitId": "LA-0204",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-2-1",
    "clientId": "client-2",
    "clientName": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0401",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-2-2",
    "clientId": "client-2",
    "clientName": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0401",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-2-3",
    "clientId": "client-2",
    "clientName": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0401",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-2-4",
    "clientId": "client-2",
    "clientName": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0401",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-2-5",
    "clientId": "client-2",
    "clientName": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0401",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-2-6",
    "clientId": "client-2",
    "clientName": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0401",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-2-7",
    "clientId": "client-2",
    "clientName": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0401",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-3-1",
    "clientId": "client-3",
    "clientName": "CABISON, AVA MAXINE E.",
    "unitId": "LA-0403",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-3-2",
    "clientId": "client-3",
    "clientName": "CABISON, AVA MAXINE E.",
    "unitId": "LA-0403",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-3-3",
    "clientId": "client-3",
    "clientName": "CABISON, AVA MAXINE E.",
    "unitId": "LA-0403",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-3-4",
    "clientId": "client-3",
    "clientName": "CABISON, AVA MAXINE E.",
    "unitId": "LA-0403",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-3-5",
    "clientId": "client-3",
    "clientName": "CABISON, AVA MAXINE E.",
    "unitId": "LA-0403",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-3-6",
    "clientId": "client-3",
    "clientName": "CABISON, AVA MAXINE E.",
    "unitId": "LA-0403",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-3-7",
    "clientId": "client-3",
    "clientName": "CABISON, AVA MAXINE E.",
    "unitId": "LA-0403",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-4-1",
    "clientId": "client-4",
    "clientName": "CABISON, SOPHIA CLAIRE E.",
    "unitId": "LA-0404",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-4-2",
    "clientId": "client-4",
    "clientName": "CABISON, SOPHIA CLAIRE E.",
    "unitId": "LA-0404",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-4-3",
    "clientId": "client-4",
    "clientName": "CABISON, SOPHIA CLAIRE E.",
    "unitId": "LA-0404",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-4-4",
    "clientId": "client-4",
    "clientName": "CABISON, SOPHIA CLAIRE E.",
    "unitId": "LA-0404",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-4-5",
    "clientId": "client-4",
    "clientName": "CABISON, SOPHIA CLAIRE E.",
    "unitId": "LA-0404",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-4-6",
    "clientId": "client-4",
    "clientName": "CABISON, SOPHIA CLAIRE E.",
    "unitId": "LA-0404",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-4-7",
    "clientId": "client-4",
    "clientName": "CABISON, SOPHIA CLAIRE E.",
    "unitId": "LA-0404",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-5-1",
    "clientId": "client-5",
    "clientName": "AQUINO, JAYMILYN BERNARDO",
    "unitId": "LA-0103",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "01/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-5-2",
    "clientId": "client-5",
    "clientName": "AQUINO, JAYMILYN BERNARDO",
    "unitId": "LA-0103",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "01/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-5-3",
    "clientId": "client-5",
    "clientName": "AQUINO, JAYMILYN BERNARDO",
    "unitId": "LA-0103",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "01/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-5-4",
    "clientId": "client-5",
    "clientName": "AQUINO, JAYMILYN BERNARDO",
    "unitId": "LA-0103",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "01/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-5-5",
    "clientId": "client-5",
    "clientName": "AQUINO, JAYMILYN BERNARDO",
    "unitId": "LA-0103",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "01/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-5-6",
    "clientId": "client-5",
    "clientName": "AQUINO, JAYMILYN BERNARDO",
    "unitId": "LA-0103",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "01/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-5-7",
    "clientId": "client-5",
    "clientName": "AQUINO, JAYMILYN BERNARDO",
    "unitId": "LA-0103",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "01/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-6-1",
    "clientId": "client-6",
    "clientName": "DIZON, ELORA ANDREI",
    "unitId": "LA-0416",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-6-2",
    "clientId": "client-6",
    "clientName": "DIZON, ELORA ANDREI",
    "unitId": "LA-0416",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-6-3",
    "clientId": "client-6",
    "clientName": "DIZON, ELORA ANDREI",
    "unitId": "LA-0416",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-6-4",
    "clientId": "client-6",
    "clientName": "DIZON, ELORA ANDREI",
    "unitId": "LA-0416",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-6-5",
    "clientId": "client-6",
    "clientName": "DIZON, ELORA ANDREI",
    "unitId": "LA-0416",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-6-6",
    "clientId": "client-6",
    "clientName": "DIZON, ELORA ANDREI",
    "unitId": "LA-0416",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-6-7",
    "clientId": "client-6",
    "clientName": "DIZON, ELORA ANDREI",
    "unitId": "LA-0416",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-7-1",
    "clientId": "client-7",
    "clientName": "DACAYO, JENNIFER MOROJO",
    "unitId": "LA-0101",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "01/31/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-7-2",
    "clientId": "client-7",
    "clientName": "DACAYO, JENNIFER MOROJO",
    "unitId": "LA-0101",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "01/31/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-7-3",
    "clientId": "client-7",
    "clientName": "DACAYO, JENNIFER MOROJO",
    "unitId": "LA-0101",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "01/31/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-7-4",
    "clientId": "client-7",
    "clientName": "DACAYO, JENNIFER MOROJO",
    "unitId": "LA-0101",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "01/31/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-7-5",
    "clientId": "client-7",
    "clientName": "DACAYO, JENNIFER MOROJO",
    "unitId": "LA-0101",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "01/31/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-7-6",
    "clientId": "client-7",
    "clientName": "DACAYO, JENNIFER MOROJO",
    "unitId": "LA-0101",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "01/31/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-7-7",
    "clientId": "client-7",
    "clientName": "DACAYO, JENNIFER MOROJO",
    "unitId": "LA-0101",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "01/31/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-8-1",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-8-2",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-8-3",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-8-4",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-8-5",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-8-6",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-8-7",
    "clientId": "client-8",
    "clientName": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-9-1",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-9-2",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-9-3",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-9-4",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-9-5",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-9-6",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-9-7",
    "clientId": "client-9",
    "clientName": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-10-1",
    "clientId": "client-10",
    "clientName": "RUSIT, ERIC C.",
    "unitId": "LA-0305 LA0306 & LA-0307 COMBINED",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "02/07/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-10-2",
    "clientId": "client-10",
    "clientName": "RUSIT, ERIC C.",
    "unitId": "LA-0305 LA0306 & LA-0307 COMBINED",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "02/07/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-10-3",
    "clientId": "client-10",
    "clientName": "RUSIT, ERIC C.",
    "unitId": "LA-0305 LA0306 & LA-0307 COMBINED",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "02/07/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-10-4",
    "clientId": "client-10",
    "clientName": "RUSIT, ERIC C.",
    "unitId": "LA-0305 LA0306 & LA-0307 COMBINED",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "02/07/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-10-5",
    "clientId": "client-10",
    "clientName": "RUSIT, ERIC C.",
    "unitId": "LA-0305 LA0306 & LA-0307 COMBINED",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "02/07/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-10-6",
    "clientId": "client-10",
    "clientName": "RUSIT, ERIC C.",
    "unitId": "LA-0305 LA0306 & LA-0307 COMBINED",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "02/07/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-10-7",
    "clientId": "client-10",
    "clientName": "RUSIT, ERIC C.",
    "unitId": "LA-0305 LA0306 & LA-0307 COMBINED",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "02/07/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-11-1",
    "clientId": "client-11",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0408",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-11-2",
    "clientId": "client-11",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0408",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-11-3",
    "clientId": "client-11",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0408",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-11-4",
    "clientId": "client-11",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0408",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-11-5",
    "clientId": "client-11",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0408",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-11-6",
    "clientId": "client-11",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0408",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-11-7",
    "clientId": "client-11",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0408",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-12-1",
    "clientId": "client-12",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0410",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-12-2",
    "clientId": "client-12",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0410",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-12-3",
    "clientId": "client-12",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0410",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-12-4",
    "clientId": "client-12",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0410",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-12-5",
    "clientId": "client-12",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0410",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-12-6",
    "clientId": "client-12",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0410",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-12-7",
    "clientId": "client-12",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0410",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-13-1",
    "clientId": "client-13",
    "clientName": "BORAC, LARRY S.",
    "unitId": "LA-0405",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-13-2",
    "clientId": "client-13",
    "clientName": "BORAC, LARRY S.",
    "unitId": "LA-0405",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-13-3",
    "clientId": "client-13",
    "clientName": "BORAC, LARRY S.",
    "unitId": "LA-0405",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-13-4",
    "clientId": "client-13",
    "clientName": "BORAC, LARRY S.",
    "unitId": "LA-0405",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-13-5",
    "clientId": "client-13",
    "clientName": "BORAC, LARRY S.",
    "unitId": "LA-0405",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-13-6",
    "clientId": "client-13",
    "clientName": "BORAC, LARRY S.",
    "unitId": "LA-0405",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-13-7",
    "clientId": "client-13",
    "clientName": "BORAC, LARRY S.",
    "unitId": "LA-0405",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-14-1",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "LA-0412 & LA-0414 COMBINED",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-14-2",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "LA-0412 & LA-0414 COMBINED",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-14-3",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "LA-0412 & LA-0414 COMBINED",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-14-4",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "LA-0412 & LA-0414 COMBINED",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-14-5",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "LA-0412 & LA-0414 COMBINED",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-14-6",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "LA-0412 & LA-0414 COMBINED",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-14-7",
    "clientId": "client-14",
    "clientName": "OCAMPO, RACQUEL",
    "unitId": "LA-0412 & LA-0414 COMBINED",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-15-1",
    "clientId": "client-15",
    "clientName": "CABISON, CHERRY MAE E.",
    "unitId": "LA-0406",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-15-2",
    "clientId": "client-15",
    "clientName": "CABISON, CHERRY MAE E.",
    "unitId": "LA-0406",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-15-3",
    "clientId": "client-15",
    "clientName": "CABISON, CHERRY MAE E.",
    "unitId": "LA-0406",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-15-4",
    "clientId": "client-15",
    "clientName": "CABISON, CHERRY MAE E.",
    "unitId": "LA-0406",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-15-5",
    "clientId": "client-15",
    "clientName": "CABISON, CHERRY MAE E.",
    "unitId": "LA-0406",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-15-6",
    "clientId": "client-15",
    "clientName": "CABISON, CHERRY MAE E.",
    "unitId": "LA-0406",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-15-7",
    "clientId": "client-15",
    "clientName": "CABISON, CHERRY MAE E.",
    "unitId": "LA-0406",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-16-1",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-16-2",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-16-3",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-16-4",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-16-5",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-16-6",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-16-7",
    "clientId": "client-16",
    "clientName": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-17-1",
    "clientId": "client-17",
    "clientName": "TUBORO, MARILOU GRIMALDO",
    "unitId": "LA-0411",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-17-2",
    "clientId": "client-17",
    "clientName": "TUBORO, MARILOU GRIMALDO",
    "unitId": "LA-0411",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-17-3",
    "clientId": "client-17",
    "clientName": "TUBORO, MARILOU GRIMALDO",
    "unitId": "LA-0411",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-17-4",
    "clientId": "client-17",
    "clientName": "TUBORO, MARILOU GRIMALDO",
    "unitId": "LA-0411",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-17-5",
    "clientId": "client-17",
    "clientName": "TUBORO, MARILOU GRIMALDO",
    "unitId": "LA-0411",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-17-6",
    "clientId": "client-17",
    "clientName": "TUBORO, MARILOU GRIMALDO",
    "unitId": "LA-0411",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-17-7",
    "clientId": "client-17",
    "clientName": "TUBORO, MARILOU GRIMALDO",
    "unitId": "LA-0411",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-18-1",
    "clientId": "client-18",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-18-2",
    "clientId": "client-18",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-18-3",
    "clientId": "client-18",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-18-4",
    "clientId": "client-18",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-18-5",
    "clientId": "client-18",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-18-6",
    "clientId": "client-18",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-18-7",
    "clientId": "client-18",
    "clientName": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-19-1",
    "clientId": "client-19",
    "clientName": "SIAZON, JEFFERSON C.",
    "unitId": "LA-0108 (CORNER) A",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-19-2",
    "clientId": "client-19",
    "clientName": "SIAZON, JEFFERSON C.",
    "unitId": "LA-0108 (CORNER) A",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-19-3",
    "clientId": "client-19",
    "clientName": "SIAZON, JEFFERSON C.",
    "unitId": "LA-0108 (CORNER) A",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-19-4",
    "clientId": "client-19",
    "clientName": "SIAZON, JEFFERSON C.",
    "unitId": "LA-0108 (CORNER) A",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-19-5",
    "clientId": "client-19",
    "clientName": "SIAZON, JEFFERSON C.",
    "unitId": "LA-0108 (CORNER) A",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-19-6",
    "clientId": "client-19",
    "clientName": "SIAZON, JEFFERSON C.",
    "unitId": "LA-0108 (CORNER) A",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-19-7",
    "clientId": "client-19",
    "clientName": "SIAZON, JEFFERSON C.",
    "unitId": "LA-0108 (CORNER) A",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-20-1",
    "clientId": "client-20",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0304",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-20-2",
    "clientId": "client-20",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0304",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-20-3",
    "clientId": "client-20",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0304",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-20-4",
    "clientId": "client-20",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0304",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-20-5",
    "clientId": "client-20",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0304",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-20-6",
    "clientId": "client-20",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0304",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-20-7",
    "clientId": "client-20",
    "clientName": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0304",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-21-1",
    "clientId": "client-21",
    "clientName": "SALAMAT, ANTONIO, MIGUEL",
    "unitId": "LA-0413",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-21-2",
    "clientId": "client-21",
    "clientName": "SALAMAT, ANTONIO, MIGUEL",
    "unitId": "LA-0413",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-21-3",
    "clientId": "client-21",
    "clientName": "SALAMAT, ANTONIO, MIGUEL",
    "unitId": "LA-0413",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-21-4",
    "clientId": "client-21",
    "clientName": "SALAMAT, ANTONIO, MIGUEL",
    "unitId": "LA-0413",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-21-5",
    "clientId": "client-21",
    "clientName": "SALAMAT, ANTONIO, MIGUEL",
    "unitId": "LA-0413",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-21-6",
    "clientId": "client-21",
    "clientName": "SALAMAT, ANTONIO, MIGUEL",
    "unitId": "LA-0413",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-21-7",
    "clientId": "client-21",
    "clientName": "SALAMAT, ANTONIO, MIGUEL",
    "unitId": "LA-0413",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-22-1",
    "clientId": "client-22",
    "clientName": "COMIA, GRAZELYN M.",
    "unitId": "LA-0415",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-22-2",
    "clientId": "client-22",
    "clientName": "COMIA, GRAZELYN M.",
    "unitId": "LA-0415",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-22-3",
    "clientId": "client-22",
    "clientName": "COMIA, GRAZELYN M.",
    "unitId": "LA-0415",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-22-4",
    "clientId": "client-22",
    "clientName": "COMIA, GRAZELYN M.",
    "unitId": "LA-0415",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-22-5",
    "clientId": "client-22",
    "clientName": "COMIA, GRAZELYN M.",
    "unitId": "LA-0415",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-22-6",
    "clientId": "client-22",
    "clientName": "COMIA, GRAZELYN M.",
    "unitId": "LA-0415",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-22-7",
    "clientId": "client-22",
    "clientName": "COMIA, GRAZELYN M.",
    "unitId": "LA-0415",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-23-1",
    "clientId": "client-23",
    "clientName": "GULLA, SHERYL",
    "unitId": "LA-0718",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "03/01/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-23-2",
    "clientId": "client-23",
    "clientName": "GULLA, SHERYL",
    "unitId": "LA-0718",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "03/01/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-23-3",
    "clientId": "client-23",
    "clientName": "GULLA, SHERYL",
    "unitId": "LA-0718",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "03/01/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-23-4",
    "clientId": "client-23",
    "clientName": "GULLA, SHERYL",
    "unitId": "LA-0718",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "03/01/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-23-5",
    "clientId": "client-23",
    "clientName": "GULLA, SHERYL",
    "unitId": "LA-0718",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "03/01/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-23-6",
    "clientId": "client-23",
    "clientName": "GULLA, SHERYL",
    "unitId": "LA-0718",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "03/01/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-23-7",
    "clientId": "client-23",
    "clientName": "GULLA, SHERYL",
    "unitId": "LA-0718",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "03/01/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-24-1",
    "clientId": "client-24",
    "clientName": "DE SAN PERDRO, JOHN MHELCON",
    "unitId": "COMBINED: LA-0501 & LA-0502",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-24-2",
    "clientId": "client-24",
    "clientName": "DE SAN PERDRO, JOHN MHELCON",
    "unitId": "COMBINED: LA-0501 & LA-0502",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-24-3",
    "clientId": "client-24",
    "clientName": "DE SAN PERDRO, JOHN MHELCON",
    "unitId": "COMBINED: LA-0501 & LA-0502",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-24-4",
    "clientId": "client-24",
    "clientName": "DE SAN PERDRO, JOHN MHELCON",
    "unitId": "COMBINED: LA-0501 & LA-0502",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-24-5",
    "clientId": "client-24",
    "clientName": "DE SAN PERDRO, JOHN MHELCON",
    "unitId": "COMBINED: LA-0501 & LA-0502",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-24-6",
    "clientId": "client-24",
    "clientName": "DE SAN PERDRO, JOHN MHELCON",
    "unitId": "COMBINED: LA-0501 & LA-0502",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-24-7",
    "clientId": "client-24",
    "clientName": "DE SAN PERDRO, JOHN MHELCON",
    "unitId": "COMBINED: LA-0501 & LA-0502",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-25-1",
    "clientId": "client-25",
    "clientName": "GARCIA, JANICE M.",
    "unitId": "LA-0302",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-25-2",
    "clientId": "client-25",
    "clientName": "GARCIA, JANICE M.",
    "unitId": "LA-0302",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-25-3",
    "clientId": "client-25",
    "clientName": "GARCIA, JANICE M.",
    "unitId": "LA-0302",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-25-4",
    "clientId": "client-25",
    "clientName": "GARCIA, JANICE M.",
    "unitId": "LA-0302",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-25-5",
    "clientId": "client-25",
    "clientName": "GARCIA, JANICE M.",
    "unitId": "LA-0302",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-25-6",
    "clientId": "client-25",
    "clientName": "GARCIA, JANICE M.",
    "unitId": "LA-0302",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-25-7",
    "clientId": "client-25",
    "clientName": "GARCIA, JANICE M.",
    "unitId": "LA-0302",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-26-1",
    "clientId": "client-26",
    "clientName": "CHANG, IMELDA A.",
    "unitId": "LA-0417 (CORNER)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-26-2",
    "clientId": "client-26",
    "clientName": "CHANG, IMELDA A.",
    "unitId": "LA-0417 (CORNER)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-26-3",
    "clientId": "client-26",
    "clientName": "CHANG, IMELDA A.",
    "unitId": "LA-0417 (CORNER)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-26-4",
    "clientId": "client-26",
    "clientName": "CHANG, IMELDA A.",
    "unitId": "LA-0417 (CORNER)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-26-5",
    "clientId": "client-26",
    "clientName": "CHANG, IMELDA A.",
    "unitId": "LA-0417 (CORNER)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-26-6",
    "clientId": "client-26",
    "clientName": "CHANG, IMELDA A.",
    "unitId": "LA-0417 (CORNER)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-26-7",
    "clientId": "client-26",
    "clientName": "CHANG, IMELDA A.",
    "unitId": "LA-0417 (CORNER)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-27-1",
    "clientId": "client-27",
    "clientName": "BAGAOISAN, LILIA A.",
    "unitId": "LA-0108 (INNER) B",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-27-2",
    "clientId": "client-27",
    "clientName": "BAGAOISAN, LILIA A.",
    "unitId": "LA-0108 (INNER) B",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-27-3",
    "clientId": "client-27",
    "clientName": "BAGAOISAN, LILIA A.",
    "unitId": "LA-0108 (INNER) B",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-27-4",
    "clientId": "client-27",
    "clientName": "BAGAOISAN, LILIA A.",
    "unitId": "LA-0108 (INNER) B",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-27-5",
    "clientId": "client-27",
    "clientName": "BAGAOISAN, LILIA A.",
    "unitId": "LA-0108 (INNER) B",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-27-6",
    "clientId": "client-27",
    "clientName": "BAGAOISAN, LILIA A.",
    "unitId": "LA-0108 (INNER) B",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-27-7",
    "clientId": "client-27",
    "clientName": "BAGAOISAN, LILIA A.",
    "unitId": "LA-0108 (INNER) B",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-28-1",
    "clientId": "client-28",
    "clientName": "TAYLOR, WENDY B.",
    "unitId": "LA-0108 (END) C",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-28-2",
    "clientId": "client-28",
    "clientName": "TAYLOR, WENDY B.",
    "unitId": "LA-0108 (END) C",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-28-3",
    "clientId": "client-28",
    "clientName": "TAYLOR, WENDY B.",
    "unitId": "LA-0108 (END) C",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-28-4",
    "clientId": "client-28",
    "clientName": "TAYLOR, WENDY B.",
    "unitId": "LA-0108 (END) C",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-28-5",
    "clientId": "client-28",
    "clientName": "TAYLOR, WENDY B.",
    "unitId": "LA-0108 (END) C",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-28-6",
    "clientId": "client-28",
    "clientName": "TAYLOR, WENDY B.",
    "unitId": "LA-0108 (END) C",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-28-7",
    "clientId": "client-28",
    "clientName": "TAYLOR, WENDY B.",
    "unitId": "LA-0108 (END) C",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-29-1",
    "clientId": "client-29",
    "clientName": "JOHNSON, CHERRY F.",
    "unitId": "LA-1201 (CORNER)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-29-2",
    "clientId": "client-29",
    "clientName": "JOHNSON, CHERRY F.",
    "unitId": "LA-1201 (CORNER)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-29-3",
    "clientId": "client-29",
    "clientName": "JOHNSON, CHERRY F.",
    "unitId": "LA-1201 (CORNER)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-29-4",
    "clientId": "client-29",
    "clientName": "JOHNSON, CHERRY F.",
    "unitId": "LA-1201 (CORNER)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-29-5",
    "clientId": "client-29",
    "clientName": "JOHNSON, CHERRY F.",
    "unitId": "LA-1201 (CORNER)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-29-6",
    "clientId": "client-29",
    "clientName": "JOHNSON, CHERRY F.",
    "unitId": "LA-1201 (CORNER)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-29-7",
    "clientId": "client-29",
    "clientName": "JOHNSON, CHERRY F.",
    "unitId": "LA-1201 (CORNER)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-30-1",
    "clientId": "client-30",
    "clientName": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "03/23/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-30-2",
    "clientId": "client-30",
    "clientName": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "03/23/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-30-3",
    "clientId": "client-30",
    "clientName": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "03/23/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-30-4",
    "clientId": "client-30",
    "clientName": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "03/23/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-30-5",
    "clientId": "client-30",
    "clientName": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "03/23/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-30-6",
    "clientId": "client-30",
    "clientName": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "03/23/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-30-7",
    "clientId": "client-30",
    "clientName": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "03/23/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-31-1",
    "clientId": "client-31",
    "clientName": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "04/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-31-2",
    "clientId": "client-31",
    "clientName": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "04/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-31-3",
    "clientId": "client-31",
    "clientName": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "04/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-31-4",
    "clientId": "client-31",
    "clientName": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "04/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-31-5",
    "clientId": "client-31",
    "clientName": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "04/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-31-6",
    "clientId": "client-31",
    "clientName": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "04/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-31-7",
    "clientId": "client-31",
    "clientName": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "04/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-32-1",
    "clientId": "client-32",
    "clientName": "PERALTA, GERRY Q.",
    "unitId": "LA-1105",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "03/23/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-32-2",
    "clientId": "client-32",
    "clientName": "PERALTA, GERRY Q.",
    "unitId": "LA-1105",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "03/23/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-32-3",
    "clientId": "client-32",
    "clientName": "PERALTA, GERRY Q.",
    "unitId": "LA-1105",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "03/23/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-32-4",
    "clientId": "client-32",
    "clientName": "PERALTA, GERRY Q.",
    "unitId": "LA-1105",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "03/23/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-32-5",
    "clientId": "client-32",
    "clientName": "PERALTA, GERRY Q.",
    "unitId": "LA-1105",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "03/23/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-32-6",
    "clientId": "client-32",
    "clientName": "PERALTA, GERRY Q.",
    "unitId": "LA-1105",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "03/23/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-32-7",
    "clientId": "client-32",
    "clientName": "PERALTA, GERRY Q.",
    "unitId": "LA-1105",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "03/23/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-33-1",
    "clientId": "client-33",
    "clientName": "LAYUG, EDWARD JO S.",
    "unitId": "LA-0205",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-33-2",
    "clientId": "client-33",
    "clientName": "LAYUG, EDWARD JO S.",
    "unitId": "LA-0205",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-33-3",
    "clientId": "client-33",
    "clientName": "LAYUG, EDWARD JO S.",
    "unitId": "LA-0205",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-33-4",
    "clientId": "client-33",
    "clientName": "LAYUG, EDWARD JO S.",
    "unitId": "LA-0205",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-33-5",
    "clientId": "client-33",
    "clientName": "LAYUG, EDWARD JO S.",
    "unitId": "LA-0205",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-33-6",
    "clientId": "client-33",
    "clientName": "LAYUG, EDWARD JO S.",
    "unitId": "LA-0205",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-33-7",
    "clientId": "client-33",
    "clientName": "LAYUG, EDWARD JO S.",
    "unitId": "LA-0205",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-34-1",
    "clientId": "client-34",
    "clientName": "HATEM, HANNOUSH MARC ANDREEI B.",
    "unitId": "LA-1201 (INNER)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-34-2",
    "clientId": "client-34",
    "clientName": "HATEM, HANNOUSH MARC ANDREEI B.",
    "unitId": "LA-1201 (INNER)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-34-3",
    "clientId": "client-34",
    "clientName": "HATEM, HANNOUSH MARC ANDREEI B.",
    "unitId": "LA-1201 (INNER)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-34-4",
    "clientId": "client-34",
    "clientName": "HATEM, HANNOUSH MARC ANDREEI B.",
    "unitId": "LA-1201 (INNER)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-34-5",
    "clientId": "client-34",
    "clientName": "HATEM, HANNOUSH MARC ANDREEI B.",
    "unitId": "LA-1201 (INNER)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-34-6",
    "clientId": "client-34",
    "clientName": "HATEM, HANNOUSH MARC ANDREEI B.",
    "unitId": "LA-1201 (INNER)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-34-7",
    "clientId": "client-34",
    "clientName": "HATEM, HANNOUSH MARC ANDREEI B.",
    "unitId": "LA-1201 (INNER)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-35-1",
    "clientId": "client-35",
    "clientName": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (CORNER)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "03/29/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-35-2",
    "clientId": "client-35",
    "clientName": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (CORNER)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "03/29/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-35-3",
    "clientId": "client-35",
    "clientName": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (CORNER)",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "03/29/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-35-4",
    "clientId": "client-35",
    "clientName": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (CORNER)",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "03/29/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-35-5",
    "clientId": "client-35",
    "clientName": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (CORNER)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "03/29/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-35-6",
    "clientId": "client-35",
    "clientName": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (CORNER)",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "03/29/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-35-7",
    "clientId": "client-35",
    "clientName": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (CORNER)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "03/29/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-36-1",
    "clientId": "client-36",
    "clientName": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (END)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "03/29/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-36-2",
    "clientId": "client-36",
    "clientName": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (END)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "03/29/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-36-3",
    "clientId": "client-36",
    "clientName": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (END)",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "03/29/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-36-4",
    "clientId": "client-36",
    "clientName": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (END)",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "03/29/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-36-5",
    "clientId": "client-36",
    "clientName": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (END)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "03/29/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-36-6",
    "clientId": "client-36",
    "clientName": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (END)",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "03/29/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-36-7",
    "clientId": "client-36",
    "clientName": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (END)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "03/29/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-37-1",
    "clientId": "client-37",
    "clientName": "BELIGON, ERDELYN F.",
    "unitId": "LA-1103",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-37-2",
    "clientId": "client-37",
    "clientName": "BELIGON, ERDELYN F.",
    "unitId": "LA-1103",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-37-3",
    "clientId": "client-37",
    "clientName": "BELIGON, ERDELYN F.",
    "unitId": "LA-1103",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-37-4",
    "clientId": "client-37",
    "clientName": "BELIGON, ERDELYN F.",
    "unitId": "LA-1103",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-37-5",
    "clientId": "client-37",
    "clientName": "BELIGON, ERDELYN F.",
    "unitId": "LA-1103",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-37-6",
    "clientId": "client-37",
    "clientName": "BELIGON, ERDELYN F.",
    "unitId": "LA-1103",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-37-7",
    "clientId": "client-37",
    "clientName": "BELIGON, ERDELYN F.",
    "unitId": "LA-1103",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-38-1",
    "clientId": "client-38",
    "clientName": "MORIONES, CHERRY",
    "unitId": "LA-0719",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "04/05/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-38-2",
    "clientId": "client-38",
    "clientName": "MORIONES, CHERRY",
    "unitId": "LA-0719",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "04/05/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-38-3",
    "clientId": "client-38",
    "clientName": "MORIONES, CHERRY",
    "unitId": "LA-0719",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "04/05/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-38-4",
    "clientId": "client-38",
    "clientName": "MORIONES, CHERRY",
    "unitId": "LA-0719",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "04/05/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-38-5",
    "clientId": "client-38",
    "clientName": "MORIONES, CHERRY",
    "unitId": "LA-0719",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "04/05/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-38-6",
    "clientId": "client-38",
    "clientName": "MORIONES, CHERRY",
    "unitId": "LA-0719",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "04/05/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-38-7",
    "clientId": "client-38",
    "clientName": "MORIONES, CHERRY",
    "unitId": "LA-0719",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "04/05/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-39-1",
    "clientId": "client-39",
    "clientName": "MAGORA, JOANNA MARIE",
    "unitId": "LA-0602",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-39-2",
    "clientId": "client-39",
    "clientName": "MAGORA, JOANNA MARIE",
    "unitId": "LA-0602",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-39-3",
    "clientId": "client-39",
    "clientName": "MAGORA, JOANNA MARIE",
    "unitId": "LA-0602",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-39-4",
    "clientId": "client-39",
    "clientName": "MAGORA, JOANNA MARIE",
    "unitId": "LA-0602",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-39-5",
    "clientId": "client-39",
    "clientName": "MAGORA, JOANNA MARIE",
    "unitId": "LA-0602",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-39-6",
    "clientId": "client-39",
    "clientName": "MAGORA, JOANNA MARIE",
    "unitId": "LA-0602",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-39-7",
    "clientId": "client-39",
    "clientName": "MAGORA, JOANNA MARIE",
    "unitId": "LA-0602",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-40-1",
    "clientId": "client-40",
    "clientName": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "04/06/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-40-2",
    "clientId": "client-40",
    "clientName": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "04/06/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-40-3",
    "clientId": "client-40",
    "clientName": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "04/06/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-40-4",
    "clientId": "client-40",
    "clientName": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "04/06/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-40-5",
    "clientId": "client-40",
    "clientName": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "04/06/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-40-6",
    "clientId": "client-40",
    "clientName": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "04/06/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-40-7",
    "clientId": "client-40",
    "clientName": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "04/06/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-41-1",
    "clientId": "client-41",
    "clientName": "ARGETE, RICHELL",
    "unitId": "LA-0604",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-41-2",
    "clientId": "client-41",
    "clientName": "ARGETE, RICHELL",
    "unitId": "LA-0604",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-41-3",
    "clientId": "client-41",
    "clientName": "ARGETE, RICHELL",
    "unitId": "LA-0604",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-41-4",
    "clientId": "client-41",
    "clientName": "ARGETE, RICHELL",
    "unitId": "LA-0604",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-41-5",
    "clientId": "client-41",
    "clientName": "ARGETE, RICHELL",
    "unitId": "LA-0604",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-41-6",
    "clientId": "client-41",
    "clientName": "ARGETE, RICHELL",
    "unitId": "LA-0604",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-41-7",
    "clientId": "client-41",
    "clientName": "ARGETE, RICHELL",
    "unitId": "LA-0604",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-42-1",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0504",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-42-2",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0504",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-42-3",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0504",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-42-4",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0504",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-42-5",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0504",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-42-6",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0504",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-42-7",
    "clientId": "client-42",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0504",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-43-1",
    "clientId": "client-43",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-43-2",
    "clientId": "client-43",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-43-3",
    "clientId": "client-43",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-43-4",
    "clientId": "client-43",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-43-5",
    "clientId": "client-43",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-43-6",
    "clientId": "client-43",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-43-7",
    "clientId": "client-43",
    "clientName": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-44-1",
    "clientId": "client-44",
    "clientName": "DERILO, GENEVIEVE O.",
    "unitId": "LA-0612",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-44-2",
    "clientId": "client-44",
    "clientName": "DERILO, GENEVIEVE O.",
    "unitId": "LA-0612",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-44-3",
    "clientId": "client-44",
    "clientName": "DERILO, GENEVIEVE O.",
    "unitId": "LA-0612",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-44-4",
    "clientId": "client-44",
    "clientName": "DERILO, GENEVIEVE O.",
    "unitId": "LA-0612",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-44-5",
    "clientId": "client-44",
    "clientName": "DERILO, GENEVIEVE O.",
    "unitId": "LA-0612",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-44-6",
    "clientId": "client-44",
    "clientName": "DERILO, GENEVIEVE O.",
    "unitId": "LA-0612",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-44-7",
    "clientId": "client-44",
    "clientName": "DERILO, GENEVIEVE O.",
    "unitId": "LA-0612",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-45-1",
    "clientId": "client-45",
    "clientName": "OLANO, ALLAN RAYMUND P.",
    "unitId": "LA-0613",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-45-2",
    "clientId": "client-45",
    "clientName": "OLANO, ALLAN RAYMUND P.",
    "unitId": "LA-0613",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-45-3",
    "clientId": "client-45",
    "clientName": "OLANO, ALLAN RAYMUND P.",
    "unitId": "LA-0613",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-45-4",
    "clientId": "client-45",
    "clientName": "OLANO, ALLAN RAYMUND P.",
    "unitId": "LA-0613",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-45-5",
    "clientId": "client-45",
    "clientName": "OLANO, ALLAN RAYMUND P.",
    "unitId": "LA-0613",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-45-6",
    "clientId": "client-45",
    "clientName": "OLANO, ALLAN RAYMUND P.",
    "unitId": "LA-0613",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-45-7",
    "clientId": "client-45",
    "clientName": "OLANO, ALLAN RAYMUND P.",
    "unitId": "LA-0613",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-46-1",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-46-2",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-46-3",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-46-4",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-46-5",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-46-6",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-46-7",
    "clientId": "client-46",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-47-1",
    "clientId": "client-47",
    "clientName": "PANGHULAN, RUTH Q.",
    "unitId": "LA-0610",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "04/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-47-2",
    "clientId": "client-47",
    "clientName": "PANGHULAN, RUTH Q.",
    "unitId": "LA-0610",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "04/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-47-3",
    "clientId": "client-47",
    "clientName": "PANGHULAN, RUTH Q.",
    "unitId": "LA-0610",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "04/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-47-4",
    "clientId": "client-47",
    "clientName": "PANGHULAN, RUTH Q.",
    "unitId": "LA-0610",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "04/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-47-5",
    "clientId": "client-47",
    "clientName": "PANGHULAN, RUTH Q.",
    "unitId": "LA-0610",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "04/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-47-6",
    "clientId": "client-47",
    "clientName": "PANGHULAN, RUTH Q.",
    "unitId": "LA-0610",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "04/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-47-7",
    "clientId": "client-47",
    "clientName": "PANGHULAN, RUTH Q.",
    "unitId": "LA-0610",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "04/26/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-48-1",
    "clientId": "client-48",
    "clientName": "ARAYATA, RICHELLE C.",
    "unitId": "LA-0703 & LA-0705 COMBINED",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-48-2",
    "clientId": "client-48",
    "clientName": "ARAYATA, RICHELLE C.",
    "unitId": "LA-0703 & LA-0705 COMBINED",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-48-3",
    "clientId": "client-48",
    "clientName": "ARAYATA, RICHELLE C.",
    "unitId": "LA-0703 & LA-0705 COMBINED",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-48-4",
    "clientId": "client-48",
    "clientName": "ARAYATA, RICHELLE C.",
    "unitId": "LA-0703 & LA-0705 COMBINED",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-48-5",
    "clientId": "client-48",
    "clientName": "ARAYATA, RICHELLE C.",
    "unitId": "LA-0703 & LA-0705 COMBINED",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-48-6",
    "clientId": "client-48",
    "clientName": "ARAYATA, RICHELLE C.",
    "unitId": "LA-0703 & LA-0705 COMBINED",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-48-7",
    "clientId": "client-48",
    "clientName": "ARAYATA, RICHELLE C.",
    "unitId": "LA-0703 & LA-0705 COMBINED",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-49-1",
    "clientId": "client-49",
    "clientName": "ALAMER, JAZZIE",
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "04/28/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-49-2",
    "clientId": "client-49",
    "clientName": "ALAMER, JAZZIE",
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "04/28/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-49-3",
    "clientId": "client-49",
    "clientName": "ALAMER, JAZZIE",
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "04/28/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-49-4",
    "clientId": "client-49",
    "clientName": "ALAMER, JAZZIE",
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "04/28/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-49-5",
    "clientId": "client-49",
    "clientName": "ALAMER, JAZZIE",
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "04/28/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-49-6",
    "clientId": "client-49",
    "clientName": "ALAMER, JAZZIE",
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "04/28/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-49-7",
    "clientId": "client-49",
    "clientName": "ALAMER, JAZZIE",
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "04/28/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-50-1",
    "clientId": "client-50",
    "clientName": "ORAPA, LOUEL M.",
    "unitId": "LA-0707 (INNER)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-50-2",
    "clientId": "client-50",
    "clientName": "ORAPA, LOUEL M.",
    "unitId": "LA-0707 (INNER)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-50-3",
    "clientId": "client-50",
    "clientName": "ORAPA, LOUEL M.",
    "unitId": "LA-0707 (INNER)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-50-4",
    "clientId": "client-50",
    "clientName": "ORAPA, LOUEL M.",
    "unitId": "LA-0707 (INNER)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-50-5",
    "clientId": "client-50",
    "clientName": "ORAPA, LOUEL M.",
    "unitId": "LA-0707 (INNER)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-50-6",
    "clientId": "client-50",
    "clientName": "ORAPA, LOUEL M.",
    "unitId": "LA-0707 (INNER)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-50-7",
    "clientId": "client-50",
    "clientName": "ORAPA, LOUEL M.",
    "unitId": "LA-0707 (INNER)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-51-1",
    "clientId": "client-51",
    "clientName": "ORAPA, MARILOU",
    "unitId": "LA-0709 & LA-0711 COMBINED",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-51-2",
    "clientId": "client-51",
    "clientName": "ORAPA, MARILOU",
    "unitId": "LA-0709 & LA-0711 COMBINED",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-51-3",
    "clientId": "client-51",
    "clientName": "ORAPA, MARILOU",
    "unitId": "LA-0709 & LA-0711 COMBINED",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-51-4",
    "clientId": "client-51",
    "clientName": "ORAPA, MARILOU",
    "unitId": "LA-0709 & LA-0711 COMBINED",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-51-5",
    "clientId": "client-51",
    "clientName": "ORAPA, MARILOU",
    "unitId": "LA-0709 & LA-0711 COMBINED",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-51-6",
    "clientId": "client-51",
    "clientName": "ORAPA, MARILOU",
    "unitId": "LA-0709 & LA-0711 COMBINED",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-51-7",
    "clientId": "client-51",
    "clientName": "ORAPA, MARILOU",
    "unitId": "LA-0709 & LA-0711 COMBINED",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-52-1",
    "clientId": "client-52",
    "clientName": "MIRASOL, ROSARIO L.",
    "unitId": "LA-0713",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "05/10/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-52-2",
    "clientId": "client-52",
    "clientName": "MIRASOL, ROSARIO L.",
    "unitId": "LA-0713",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "05/10/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-52-3",
    "clientId": "client-52",
    "clientName": "MIRASOL, ROSARIO L.",
    "unitId": "LA-0713",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "05/10/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-52-4",
    "clientId": "client-52",
    "clientName": "MIRASOL, ROSARIO L.",
    "unitId": "LA-0713",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "05/10/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-52-5",
    "clientId": "client-52",
    "clientName": "MIRASOL, ROSARIO L.",
    "unitId": "LA-0713",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "05/10/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-52-6",
    "clientId": "client-52",
    "clientName": "MIRASOL, ROSARIO L.",
    "unitId": "LA-0713",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "05/10/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-52-7",
    "clientId": "client-52",
    "clientName": "MIRASOL, ROSARIO L.",
    "unitId": "LA-0713",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "05/10/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-53-1",
    "clientId": "client-53",
    "clientName": "FABABIER, ANNABELLE B.",
    "unitId": "LA-0715",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-53-2",
    "clientId": "client-53",
    "clientName": "FABABIER, ANNABELLE B.",
    "unitId": "LA-0715",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-53-3",
    "clientId": "client-53",
    "clientName": "FABABIER, ANNABELLE B.",
    "unitId": "LA-0715",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-53-4",
    "clientId": "client-53",
    "clientName": "FABABIER, ANNABELLE B.",
    "unitId": "LA-0715",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-53-5",
    "clientId": "client-53",
    "clientName": "FABABIER, ANNABELLE B.",
    "unitId": "LA-0715",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-53-6",
    "clientId": "client-53",
    "clientName": "FABABIER, ANNABELLE B.",
    "unitId": "LA-0715",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-53-7",
    "clientId": "client-53",
    "clientName": "FABABIER, ANNABELLE B.",
    "unitId": "LA-0715",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-54-1",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-54-2",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-54-3",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-54-4",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-54-5",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-54-6",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-54-7",
    "clientId": "client-54",
    "clientName": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-55-1",
    "clientId": "client-55",
    "clientName": "GALENG, ANGELITA",
    "unitId": "LA-0809",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "05/25/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-55-2",
    "clientId": "client-55",
    "clientName": "GALENG, ANGELITA",
    "unitId": "LA-0809",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "05/25/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-55-3",
    "clientId": "client-55",
    "clientName": "GALENG, ANGELITA",
    "unitId": "LA-0809",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "05/25/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-55-4",
    "clientId": "client-55",
    "clientName": "GALENG, ANGELITA",
    "unitId": "LA-0809",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "05/25/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-55-5",
    "clientId": "client-55",
    "clientName": "GALENG, ANGELITA",
    "unitId": "LA-0809",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "05/25/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-55-6",
    "clientId": "client-55",
    "clientName": "GALENG, ANGELITA",
    "unitId": "LA-0809",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "05/25/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-55-7",
    "clientId": "client-55",
    "clientName": "GALENG, ANGELITA",
    "unitId": "LA-0809",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "05/25/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-56-1",
    "clientId": "client-56",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "05/30/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-56-2",
    "clientId": "client-56",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "05/30/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-56-3",
    "clientId": "client-56",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "05/30/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-56-4",
    "clientId": "client-56",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "05/30/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-56-5",
    "clientId": "client-56",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "05/30/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-56-6",
    "clientId": "client-56",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "05/30/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-56-7",
    "clientId": "client-56",
    "clientName": "RIL, MARVIN",
    "unitId": "LA-0706",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "05/30/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-57-1",
    "clientId": "client-57",
    "clientName": "OROPESA, ROGELIO",
    "unitId": "LA-0702",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "06/02/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-57-2",
    "clientId": "client-57",
    "clientName": "OROPESA, ROGELIO",
    "unitId": "LA-0702",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "06/02/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-57-3",
    "clientId": "client-57",
    "clientName": "OROPESA, ROGELIO",
    "unitId": "LA-0702",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "06/02/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-57-4",
    "clientId": "client-57",
    "clientName": "OROPESA, ROGELIO",
    "unitId": "LA-0702",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "06/02/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-57-5",
    "clientId": "client-57",
    "clientName": "OROPESA, ROGELIO",
    "unitId": "LA-0702",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "06/02/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-57-6",
    "clientId": "client-57",
    "clientName": "OROPESA, ROGELIO",
    "unitId": "LA-0702",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "06/02/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-57-7",
    "clientId": "client-57",
    "clientName": "OROPESA, ROGELIO",
    "unitId": "LA-0702",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "06/02/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-58-1",
    "clientId": "client-58",
    "clientName": "PAYOFELIN, LIZALE ANNE G.",
    "unitId": "LA-0605",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "07/05/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-58-2",
    "clientId": "client-58",
    "clientName": "PAYOFELIN, LIZALE ANNE G.",
    "unitId": "LA-0605",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "07/05/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-58-3",
    "clientId": "client-58",
    "clientName": "PAYOFELIN, LIZALE ANNE G.",
    "unitId": "LA-0605",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "07/05/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-58-4",
    "clientId": "client-58",
    "clientName": "PAYOFELIN, LIZALE ANNE G.",
    "unitId": "LA-0605",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "07/05/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-58-5",
    "clientId": "client-58",
    "clientName": "PAYOFELIN, LIZALE ANNE G.",
    "unitId": "LA-0605",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "07/05/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-58-6",
    "clientId": "client-58",
    "clientName": "PAYOFELIN, LIZALE ANNE G.",
    "unitId": "LA-0605",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "07/05/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-58-7",
    "clientId": "client-58",
    "clientName": "PAYOFELIN, LIZALE ANNE G.",
    "unitId": "LA-0605",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "07/05/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-59-1",
    "clientId": "client-59",
    "clientName": "NEPOMUCENO, ERWIN",
    "unitId": "LA-0901",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "07/06/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-59-2",
    "clientId": "client-59",
    "clientName": "NEPOMUCENO, ERWIN",
    "unitId": "LA-0901",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "07/06/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-59-3",
    "clientId": "client-59",
    "clientName": "NEPOMUCENO, ERWIN",
    "unitId": "LA-0901",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "07/06/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-59-4",
    "clientId": "client-59",
    "clientName": "NEPOMUCENO, ERWIN",
    "unitId": "LA-0901",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "07/06/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-59-5",
    "clientId": "client-59",
    "clientName": "NEPOMUCENO, ERWIN",
    "unitId": "LA-0901",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "07/06/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-59-6",
    "clientId": "client-59",
    "clientName": "NEPOMUCENO, ERWIN",
    "unitId": "LA-0901",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "07/06/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-59-7",
    "clientId": "client-59",
    "clientName": "NEPOMUCENO, ERWIN",
    "unitId": "LA-0901",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "07/06/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-60-1",
    "clientId": "client-60",
    "clientName": "AURE, ALICIA ALEGRE",
    "unitId": "LA-0708 & LA-0710 (COMBINED)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-60-2",
    "clientId": "client-60",
    "clientName": "AURE, ALICIA ALEGRE",
    "unitId": "LA-0708 & LA-0710 (COMBINED)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-60-3",
    "clientId": "client-60",
    "clientName": "AURE, ALICIA ALEGRE",
    "unitId": "LA-0708 & LA-0710 (COMBINED)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-60-4",
    "clientId": "client-60",
    "clientName": "AURE, ALICIA ALEGRE",
    "unitId": "LA-0708 & LA-0710 (COMBINED)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-60-5",
    "clientId": "client-60",
    "clientName": "AURE, ALICIA ALEGRE",
    "unitId": "LA-0708 & LA-0710 (COMBINED)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-60-6",
    "clientId": "client-60",
    "clientName": "AURE, ALICIA ALEGRE",
    "unitId": "LA-0708 & LA-0710 (COMBINED)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-60-7",
    "clientId": "client-60",
    "clientName": "AURE, ALICIA ALEGRE",
    "unitId": "LA-0708 & LA-0710 (COMBINED)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-61-1",
    "clientId": "client-61",
    "clientName": "ORDO\u00d1EZ, LEONISA G.",
    "unitId": "LA-0417 (END) *A",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "08/27/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-61-2",
    "clientId": "client-61",
    "clientName": "ORDO\u00d1EZ, LEONISA G.",
    "unitId": "LA-0417 (END) *A",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "08/27/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-61-3",
    "clientId": "client-61",
    "clientName": "ORDO\u00d1EZ, LEONISA G.",
    "unitId": "LA-0417 (END) *A",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "08/27/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-61-4",
    "clientId": "client-61",
    "clientName": "ORDO\u00d1EZ, LEONISA G.",
    "unitId": "LA-0417 (END) *A",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "08/27/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-61-5",
    "clientId": "client-61",
    "clientName": "ORDO\u00d1EZ, LEONISA G.",
    "unitId": "LA-0417 (END) *A",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "08/27/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-61-6",
    "clientId": "client-61",
    "clientName": "ORDO\u00d1EZ, LEONISA G.",
    "unitId": "LA-0417 (END) *A",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "08/27/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-61-7",
    "clientId": "client-61",
    "clientName": "ORDO\u00d1EZ, LEONISA G.",
    "unitId": "LA-0417 (END) *A",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "08/27/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-62-1",
    "clientId": "client-62",
    "clientName": "MANGLALLAN, JEMMABEL G.",
    "unitId": "LA-0417 (END) *B",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "08/27/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-62-2",
    "clientId": "client-62",
    "clientName": "MANGLALLAN, JEMMABEL G.",
    "unitId": "LA-0417 (END) *B",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "08/27/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-62-3",
    "clientId": "client-62",
    "clientName": "MANGLALLAN, JEMMABEL G.",
    "unitId": "LA-0417 (END) *B",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "08/27/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-62-4",
    "clientId": "client-62",
    "clientName": "MANGLALLAN, JEMMABEL G.",
    "unitId": "LA-0417 (END) *B",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "08/27/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-62-5",
    "clientId": "client-62",
    "clientName": "MANGLALLAN, JEMMABEL G.",
    "unitId": "LA-0417 (END) *B",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "08/27/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-62-6",
    "clientId": "client-62",
    "clientName": "MANGLALLAN, JEMMABEL G.",
    "unitId": "LA-0417 (END) *B",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "08/27/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-62-7",
    "clientId": "client-62",
    "clientName": "MANGLALLAN, JEMMABEL G.",
    "unitId": "LA-0417 (END) *B",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "08/27/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-63-1",
    "clientId": "client-63",
    "clientName": "VILLEGAS, STEVE RANDY N.",
    "unitId": "LA-0705",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "11/02/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-63-2",
    "clientId": "client-63",
    "clientName": "VILLEGAS, STEVE RANDY N.",
    "unitId": "LA-0705",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "11/02/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-63-3",
    "clientId": "client-63",
    "clientName": "VILLEGAS, STEVE RANDY N.",
    "unitId": "LA-0705",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "11/02/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-63-4",
    "clientId": "client-63",
    "clientName": "VILLEGAS, STEVE RANDY N.",
    "unitId": "LA-0705",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "11/02/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-63-5",
    "clientId": "client-63",
    "clientName": "VILLEGAS, STEVE RANDY N.",
    "unitId": "LA-0705",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "11/02/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-63-6",
    "clientId": "client-63",
    "clientName": "VILLEGAS, STEVE RANDY N.",
    "unitId": "LA-0705",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "11/02/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-63-7",
    "clientId": "client-63",
    "clientName": "VILLEGAS, STEVE RANDY N.",
    "unitId": "LA-0705",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "11/02/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-64-1",
    "clientId": "client-64",
    "clientName": "GOMEZ, BRYAN ANTAZO",
    "unitId": "LA-0604",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "11/04/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-64-2",
    "clientId": "client-64",
    "clientName": "GOMEZ, BRYAN ANTAZO",
    "unitId": "LA-0604",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "11/04/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-64-3",
    "clientId": "client-64",
    "clientName": "GOMEZ, BRYAN ANTAZO",
    "unitId": "LA-0604",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "11/04/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-64-4",
    "clientId": "client-64",
    "clientName": "GOMEZ, BRYAN ANTAZO",
    "unitId": "LA-0604",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "11/04/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-64-5",
    "clientId": "client-64",
    "clientName": "GOMEZ, BRYAN ANTAZO",
    "unitId": "LA-0604",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "11/04/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-64-6",
    "clientId": "client-64",
    "clientName": "GOMEZ, BRYAN ANTAZO",
    "unitId": "LA-0604",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "11/04/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-64-7",
    "clientId": "client-64",
    "clientName": "GOMEZ, BRYAN ANTAZO",
    "unitId": "LA-0604",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "11/04/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-65-1",
    "clientId": "client-65",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0703",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Approved",
    "submittedDate": "12/03/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-65-2",
    "clientId": "client-65",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0703",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Approved",
    "submittedDate": "12/03/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-65-3",
    "clientId": "client-65",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0703",
    "documentType": "Buyer's Information Form",
    "status": "Approved",
    "submittedDate": "12/03/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-65-4",
    "clientId": "client-65",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0703",
    "documentType": "Intent to Buy",
    "status": "Approved",
    "submittedDate": "12/03/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-65-5",
    "clientId": "client-65",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0703",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Approved",
    "submittedDate": "12/03/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-65-6",
    "clientId": "client-65",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0703",
    "documentType": "Deed of Absolute Sale",
    "status": "Approved",
    "submittedDate": "12/03/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-65-7",
    "clientId": "client-65",
    "clientName": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0703",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Approved",
    "submittedDate": "12/03/2025",
    "rejectionRemark": ""
  },
  {
    "id": "doc-66-1",
    "clientId": "client-66",
    "clientName": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1208 (NEW)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-66-2",
    "clientId": "client-66",
    "clientName": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1208 (NEW)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-66-3",
    "clientId": "client-66",
    "clientName": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1208 (NEW)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-66-4",
    "clientId": "client-66",
    "clientName": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1208 (NEW)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-66-5",
    "clientId": "client-66",
    "clientName": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1208 (NEW)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-66-6",
    "clientId": "client-66",
    "clientName": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1208 (NEW)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-66-7",
    "clientId": "client-66",
    "clientName": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1208 (NEW)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-67-1",
    "clientId": "client-67",
    "clientName": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1207 (NEW)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-67-2",
    "clientId": "client-67",
    "clientName": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1207 (NEW)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-67-3",
    "clientId": "client-67",
    "clientName": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1207 (NEW)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-67-4",
    "clientId": "client-67",
    "clientName": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1207 (NEW)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-67-5",
    "clientId": "client-67",
    "clientName": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1207 (NEW)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-67-6",
    "clientId": "client-67",
    "clientName": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1207 (NEW)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-67-7",
    "clientId": "client-67",
    "clientName": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1207 (NEW)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-68-1",
    "clientId": "client-68",
    "clientName": "GELUZ, CONRADO JR, A.",
    "unitId": "LA-1205 (NEW)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-68-2",
    "clientId": "client-68",
    "clientName": "GELUZ, CONRADO JR, A.",
    "unitId": "LA-1205 (NEW)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-68-3",
    "clientId": "client-68",
    "clientName": "GELUZ, CONRADO JR, A.",
    "unitId": "LA-1205 (NEW)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-68-4",
    "clientId": "client-68",
    "clientName": "GELUZ, CONRADO JR, A.",
    "unitId": "LA-1205 (NEW)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-68-5",
    "clientId": "client-68",
    "clientName": "GELUZ, CONRADO JR, A.",
    "unitId": "LA-1205 (NEW)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-68-6",
    "clientId": "client-68",
    "clientName": "GELUZ, CONRADO JR, A.",
    "unitId": "LA-1205 (NEW)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-68-7",
    "clientId": "client-68",
    "clientName": "GELUZ, CONRADO JR, A.",
    "unitId": "LA-1205 (NEW)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-69-1",
    "clientId": "client-69",
    "clientName": "JANDUSAY, JOHN WENDELL F.",
    "unitId": "LA-0801 (NEW)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-69-2",
    "clientId": "client-69",
    "clientName": "JANDUSAY, JOHN WENDELL F.",
    "unitId": "LA-0801 (NEW)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-69-3",
    "clientId": "client-69",
    "clientName": "JANDUSAY, JOHN WENDELL F.",
    "unitId": "LA-0801 (NEW)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-69-4",
    "clientId": "client-69",
    "clientName": "JANDUSAY, JOHN WENDELL F.",
    "unitId": "LA-0801 (NEW)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-69-5",
    "clientId": "client-69",
    "clientName": "JANDUSAY, JOHN WENDELL F.",
    "unitId": "LA-0801 (NEW)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-69-6",
    "clientId": "client-69",
    "clientName": "JANDUSAY, JOHN WENDELL F.",
    "unitId": "LA-0801 (NEW)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-69-7",
    "clientId": "client-69",
    "clientName": "JANDUSAY, JOHN WENDELL F.",
    "unitId": "LA-0801 (NEW)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-70-1",
    "clientId": "client-70",
    "clientName": "AHMED, SARAH NACINO",
    "unitId": "LA-0414 & LA-0415",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-70-2",
    "clientId": "client-70",
    "clientName": "AHMED, SARAH NACINO",
    "unitId": "LA-0414 & LA-0415",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-70-3",
    "clientId": "client-70",
    "clientName": "AHMED, SARAH NACINO",
    "unitId": "LA-0414 & LA-0415",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-70-4",
    "clientId": "client-70",
    "clientName": "AHMED, SARAH NACINO",
    "unitId": "LA-0414 & LA-0415",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-70-5",
    "clientId": "client-70",
    "clientName": "AHMED, SARAH NACINO",
    "unitId": "LA-0414 & LA-0415",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-70-6",
    "clientId": "client-70",
    "clientName": "AHMED, SARAH NACINO",
    "unitId": "LA-0414 & LA-0415",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-70-7",
    "clientId": "client-70",
    "clientName": "AHMED, SARAH NACINO",
    "unitId": "LA-0414 & LA-0415",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-71-1",
    "clientId": "client-71",
    "clientName": "ISO, DENMARK S.",
    "unitId": "LA-0408 & LA 0409",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-71-2",
    "clientId": "client-71",
    "clientName": "ISO, DENMARK S.",
    "unitId": "LA-0408 & LA 0409",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-71-3",
    "clientId": "client-71",
    "clientName": "ISO, DENMARK S.",
    "unitId": "LA-0408 & LA 0409",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-71-4",
    "clientId": "client-71",
    "clientName": "ISO, DENMARK S.",
    "unitId": "LA-0408 & LA 0409",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-71-5",
    "clientId": "client-71",
    "clientName": "ISO, DENMARK S.",
    "unitId": "LA-0408 & LA 0409",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-71-6",
    "clientId": "client-71",
    "clientName": "ISO, DENMARK S.",
    "unitId": "LA-0408 & LA 0409",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-71-7",
    "clientId": "client-71",
    "clientName": "ISO, DENMARK S.",
    "unitId": "LA-0408 & LA 0409",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-72-1",
    "clientId": "client-72",
    "clientName": "DE CHAVEZ, MARIA ANGELICA G.",
    "unitId": "LA-1207 (NEW)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-72-2",
    "clientId": "client-72",
    "clientName": "DE CHAVEZ, MARIA ANGELICA G.",
    "unitId": "LA-1207 (NEW)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-72-3",
    "clientId": "client-72",
    "clientName": "DE CHAVEZ, MARIA ANGELICA G.",
    "unitId": "LA-1207 (NEW)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-72-4",
    "clientId": "client-72",
    "clientName": "DE CHAVEZ, MARIA ANGELICA G.",
    "unitId": "LA-1207 (NEW)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-72-5",
    "clientId": "client-72",
    "clientName": "DE CHAVEZ, MARIA ANGELICA G.",
    "unitId": "LA-1207 (NEW)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-72-6",
    "clientId": "client-72",
    "clientName": "DE CHAVEZ, MARIA ANGELICA G.",
    "unitId": "LA-1207 (NEW)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-72-7",
    "clientId": "client-72",
    "clientName": "DE CHAVEZ, MARIA ANGELICA G.",
    "unitId": "LA-1207 (NEW)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-73-1",
    "clientId": "client-73",
    "clientName": "CHRISTINE B. BOLISAY",
    "unitId": "LA-0411 & LA-0412 (NEW)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-73-2",
    "clientId": "client-73",
    "clientName": "CHRISTINE B. BOLISAY",
    "unitId": "LA-0411 & LA-0412 (NEW)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-73-3",
    "clientId": "client-73",
    "clientName": "CHRISTINE B. BOLISAY",
    "unitId": "LA-0411 & LA-0412 (NEW)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-73-4",
    "clientId": "client-73",
    "clientName": "CHRISTINE B. BOLISAY",
    "unitId": "LA-0411 & LA-0412 (NEW)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-73-5",
    "clientId": "client-73",
    "clientName": "CHRISTINE B. BOLISAY",
    "unitId": "LA-0411 & LA-0412 (NEW)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-73-6",
    "clientId": "client-73",
    "clientName": "CHRISTINE B. BOLISAY",
    "unitId": "LA-0411 & LA-0412 (NEW)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-73-7",
    "clientId": "client-73",
    "clientName": "CHRISTINE B. BOLISAY",
    "unitId": "LA-0411 & LA-0412 (NEW)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-74-1",
    "clientId": "client-74",
    "clientName": "BACUS, ERLOVE",
    "unitId": "LA-1209 (NEW)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-74-2",
    "clientId": "client-74",
    "clientName": "BACUS, ERLOVE",
    "unitId": "LA-1209 (NEW)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-74-3",
    "clientId": "client-74",
    "clientName": "BACUS, ERLOVE",
    "unitId": "LA-1209 (NEW)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-74-4",
    "clientId": "client-74",
    "clientName": "BACUS, ERLOVE",
    "unitId": "LA-1209 (NEW)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-74-5",
    "clientId": "client-74",
    "clientName": "BACUS, ERLOVE",
    "unitId": "LA-1209 (NEW)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-74-6",
    "clientId": "client-74",
    "clientName": "BACUS, ERLOVE",
    "unitId": "LA-1209 (NEW)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-74-7",
    "clientId": "client-74",
    "clientName": "BACUS, ERLOVE",
    "unitId": "LA-1209 (NEW)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-75-1",
    "clientId": "client-75",
    "clientName": "REGIS, GERALDINE O.",
    "unitId": "LA-0410 (NEW)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-75-2",
    "clientId": "client-75",
    "clientName": "REGIS, GERALDINE O.",
    "unitId": "LA-0410 (NEW)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-75-3",
    "clientId": "client-75",
    "clientName": "REGIS, GERALDINE O.",
    "unitId": "LA-0410 (NEW)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-75-4",
    "clientId": "client-75",
    "clientName": "REGIS, GERALDINE O.",
    "unitId": "LA-0410 (NEW)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-75-5",
    "clientId": "client-75",
    "clientName": "REGIS, GERALDINE O.",
    "unitId": "LA-0410 (NEW)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-75-6",
    "clientId": "client-75",
    "clientName": "REGIS, GERALDINE O.",
    "unitId": "LA-0410 (NEW)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-75-7",
    "clientId": "client-75",
    "clientName": "REGIS, GERALDINE O.",
    "unitId": "LA-0410 (NEW)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-76-1",
    "clientId": "client-76",
    "clientName": "CODON, MA. CZARINA A.",
    "unitId": "LA-0407 (NEW)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-76-2",
    "clientId": "client-76",
    "clientName": "CODON, MA. CZARINA A.",
    "unitId": "LA-0407 (NEW)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-76-3",
    "clientId": "client-76",
    "clientName": "CODON, MA. CZARINA A.",
    "unitId": "LA-0407 (NEW)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-76-4",
    "clientId": "client-76",
    "clientName": "CODON, MA. CZARINA A.",
    "unitId": "LA-0407 (NEW)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-76-5",
    "clientId": "client-76",
    "clientName": "CODON, MA. CZARINA A.",
    "unitId": "LA-0407 (NEW)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-76-6",
    "clientId": "client-76",
    "clientName": "CODON, MA. CZARINA A.",
    "unitId": "LA-0407 (NEW)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-76-7",
    "clientId": "client-76",
    "clientName": "CODON, MA. CZARINA A.",
    "unitId": "LA-0407 (NEW)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-77-1",
    "clientId": "client-77",
    "clientName": "SALONGA, EDWIN L.",
    "unitId": "LA-1203 & LA-1204 (NEW)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-77-2",
    "clientId": "client-77",
    "clientName": "SALONGA, EDWIN L.",
    "unitId": "LA-1203 & LA-1204 (NEW)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-77-3",
    "clientId": "client-77",
    "clientName": "SALONGA, EDWIN L.",
    "unitId": "LA-1203 & LA-1204 (NEW)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-77-4",
    "clientId": "client-77",
    "clientName": "SALONGA, EDWIN L.",
    "unitId": "LA-1203 & LA-1204 (NEW)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-77-5",
    "clientId": "client-77",
    "clientName": "SALONGA, EDWIN L.",
    "unitId": "LA-1203 & LA-1204 (NEW)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-77-6",
    "clientId": "client-77",
    "clientName": "SALONGA, EDWIN L.",
    "unitId": "LA-1203 & LA-1204 (NEW)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-77-7",
    "clientId": "client-77",
    "clientName": "SALONGA, EDWIN L.",
    "unitId": "LA-1203 & LA-1204 (NEW)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-78-1",
    "clientId": "client-78",
    "clientName": "GERMANO, ERICO C. JR",
    "unitId": "LA-0704 (NEW)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-78-2",
    "clientId": "client-78",
    "clientName": "GERMANO, ERICO C. JR",
    "unitId": "LA-0704 (NEW)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-78-3",
    "clientId": "client-78",
    "clientName": "GERMANO, ERICO C. JR",
    "unitId": "LA-0704 (NEW)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-78-4",
    "clientId": "client-78",
    "clientName": "GERMANO, ERICO C. JR",
    "unitId": "LA-0704 (NEW)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-78-5",
    "clientId": "client-78",
    "clientName": "GERMANO, ERICO C. JR",
    "unitId": "LA-0704 (NEW)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-78-6",
    "clientId": "client-78",
    "clientName": "GERMANO, ERICO C. JR",
    "unitId": "LA-0704 (NEW)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-78-7",
    "clientId": "client-78",
    "clientName": "GERMANO, ERICO C. JR",
    "unitId": "LA-0704 (NEW)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-79-1",
    "clientId": "client-79",
    "clientName": "CABALIDA, MADELYN G.",
    "unitId": "LA-0201",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-79-2",
    "clientId": "client-79",
    "clientName": "CABALIDA, MADELYN G.",
    "unitId": "LA-0201",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-79-3",
    "clientId": "client-79",
    "clientName": "CABALIDA, MADELYN G.",
    "unitId": "LA-0201",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-79-4",
    "clientId": "client-79",
    "clientName": "CABALIDA, MADELYN G.",
    "unitId": "LA-0201",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-79-5",
    "clientId": "client-79",
    "clientName": "CABALIDA, MADELYN G.",
    "unitId": "LA-0201",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-79-6",
    "clientId": "client-79",
    "clientName": "CABALIDA, MADELYN G.",
    "unitId": "LA-0201",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-79-7",
    "clientId": "client-79",
    "clientName": "CABALIDA, MADELYN G.",
    "unitId": "LA-0201",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-80-1",
    "clientId": "client-80",
    "clientName": "LOMAN, KURT ERNEST M.",
    "unitId": "LA-0405 & LA-0406",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-80-2",
    "clientId": "client-80",
    "clientName": "LOMAN, KURT ERNEST M.",
    "unitId": "LA-0405 & LA-0406",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-80-3",
    "clientId": "client-80",
    "clientName": "LOMAN, KURT ERNEST M.",
    "unitId": "LA-0405 & LA-0406",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-80-4",
    "clientId": "client-80",
    "clientName": "LOMAN, KURT ERNEST M.",
    "unitId": "LA-0405 & LA-0406",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-80-5",
    "clientId": "client-80",
    "clientName": "LOMAN, KURT ERNEST M.",
    "unitId": "LA-0405 & LA-0406",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-80-6",
    "clientId": "client-80",
    "clientName": "LOMAN, KURT ERNEST M.",
    "unitId": "LA-0405 & LA-0406",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-80-7",
    "clientId": "client-80",
    "clientName": "LOMAN, KURT ERNEST M.",
    "unitId": "LA-0405 & LA-0406",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-81-1",
    "clientId": "client-81",
    "clientName": "MEDILO, LARRY D.",
    "unitId": "LA-0502",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-81-2",
    "clientId": "client-81",
    "clientName": "MEDILO, LARRY D.",
    "unitId": "LA-0502",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-81-3",
    "clientId": "client-81",
    "clientName": "MEDILO, LARRY D.",
    "unitId": "LA-0502",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-81-4",
    "clientId": "client-81",
    "clientName": "MEDILO, LARRY D.",
    "unitId": "LA-0502",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-81-5",
    "clientId": "client-81",
    "clientName": "MEDILO, LARRY D.",
    "unitId": "LA-0502",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-81-6",
    "clientId": "client-81",
    "clientName": "MEDILO, LARRY D.",
    "unitId": "LA-0502",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-81-7",
    "clientId": "client-81",
    "clientName": "MEDILO, LARRY D.",
    "unitId": "LA-0502",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-82-1",
    "clientId": "client-82",
    "clientName": "MICHELLE C. SAQUILAYAN",
    "unitId": "LA-1208 (NEW)",
    "documentType": "Client Registration Form (Seller's Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-82-2",
    "clientId": "client-82",
    "clientName": "MICHELLE C. SAQUILAYAN",
    "unitId": "LA-1208 (NEW)",
    "documentType": "Client Registration Form (Administrator Copy)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-82-3",
    "clientId": "client-82",
    "clientName": "MICHELLE C. SAQUILAYAN",
    "unitId": "LA-1208 (NEW)",
    "documentType": "Buyer's Information Form",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-82-4",
    "clientId": "client-82",
    "clientName": "MICHELLE C. SAQUILAYAN",
    "unitId": "LA-1208 (NEW)",
    "documentType": "Intent to Buy",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-82-5",
    "clientId": "client-82",
    "clientName": "MICHELLE C. SAQUILAYAN",
    "unitId": "LA-1208 (NEW)",
    "documentType": "Offer to Buy & Buyer's Profile",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-82-6",
    "clientId": "client-82",
    "clientName": "MICHELLE C. SAQUILAYAN",
    "unitId": "LA-1208 (NEW)",
    "documentType": "Deed of Absolute Sale",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  },
  {
    "id": "doc-82-7",
    "clientId": "client-82",
    "clientName": "MICHELLE C. SAQUILAYAN",
    "unitId": "LA-1208 (NEW)",
    "documentType": "Contract to Sell (Undivided Share)",
    "status": "Not Submitted",
    "submittedDate": "",
    "rejectionRemark": ""
  }
]

export const usersV2 = [
  { id: 'user-1', fullName: 'Admin', email: 'admin@dcprime.com', role: 'admin', status: 'Active', dateCreated: '01/01/2026', lastLogin: '06/03/2026', permissions: featureKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {}) },
  { id: 'user-2', fullName: 'Treasury One', email: 'treasury1@dcprime.com', role: 'treasury', status: 'Active', dateCreated: '01/05/2026', lastLogin: '06/02/2026', permissions: rolePresets.treasury },
  ...agents.slice(0, 6).map((agent, index) => ({ id: `user-${index + 3}`, fullName: agent.fullName, email: agent.email, role: 'agent', status: agent.status, dateCreated: '02/01/2026', lastLogin: '06/01/2026', permissions: rolePresets.agent })),
  ...clients.slice(0, 2).map((client, index) => ({ id: `user-client-${index + 1}`, fullName: client.buyer, email: client.email ?? `client${index + 1}@dcprime.test`, role: 'client', status: 'Active', dateCreated: client.reservationDate, lastLogin: '05/29/2026', permissions: rolePresets.client })),
]

const auditActions = ['Payment recorded', 'Document approved', 'Commission released', 'Admin logged in', 'Listing updated', 'Client registered']

export const auditLogsV2 = auditActions.flatMap((action, actionIndex) =>
  clients.slice(0, 8).map((client, index) => ({
    id: `audit-${actionIndex + 1}-${index + 1}`,
    timestamp: `06/${String(index + 1).padStart(2, '0')}/2026 ${String((index % 12) + 1).padStart(2, '0')}:15 PM`,
    userId: actionIndex % 2 === 0 ? 'user-1' : `user-${index + 3}`,
    userName: actionIndex % 2 === 0 ? 'Admin' : client.agent,
    role: actionIndex % 2 === 0 ? 'admin' : 'agent',
    action,
    details: `${action} - ${client.buyer} (${client.unitId})`,
    ipAddress: `192.168.1.${(actionIndex * 8 + index) + 1}`,
  })),
)
