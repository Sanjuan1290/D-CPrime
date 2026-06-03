export type Role = 'admin' | 'agent' | 'treasury' | 'client'
export type UserStatus = 'Active' | 'Inactive'
export type FeatureKey = keyof typeof featureLabels

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
  status: 'Available' | 'Reserved' | 'Sold' | 'Hold'
}

export const listings: Listing[] = [
  { unitId: 'LA-0101', block: '1', lotType: 'END', area: 300, pricePerSqm: 1000, netSellingPrice: 300000, legalMiscFee: 0.1, totalContractPrice: 330000, status: 'Sold' },
  { unitId: 'LA-0102', block: '1', lotType: 'INNER', area: 1200, pricePerSqm: 1200, netSellingPrice: 1440000, legalMiscFee: 0.1, totalContractPrice: 1584000, status: 'Sold' },
  { unitId: 'LA-0208', block: '2', lotType: 'END', area: 300, pricePerSqm: 2600, netSellingPrice: 780000, legalMiscFee: 0.1, totalContractPrice: 858000, status: 'Available' },
  { unitId: 'LA-0301', block: '3', lotType: 'CORNER', area: 546, pricePerSqm: 1200, netSellingPrice: 655200, legalMiscFee: 0, totalContractPrice: 655200, status: 'Sold' },
  { unitId: 'LA-0416', block: '4', lotType: 'INNER', area: 300, pricePerSqm: 1200, netSellingPrice: 360000, legalMiscFee: 0.1, totalContractPrice: 396000, status: 'Sold' },
  { unitId: 'LA-0704', block: '7', lotType: 'INNER', area: 311, pricePerSqm: 1700, netSellingPrice: 528700, legalMiscFee: 0, totalContractPrice: 528700, status: 'Sold' },
  { unitId: 'LA-1201 (CORNER)', block: '12', lotType: 'CORNER', area: 529, pricePerSqm: 1500, netSellingPrice: 794250, legalMiscFee: 0.1, totalContractPrice: 882750, status: 'Reserved' },
]

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

export const clients: ClientRecord[] = [
  { reservationDate: '01/21/2025', buyer: 'SILVA, ISABEL LAYUG L.', spouse: 'SILVA, EDWARD JAMES M.', unitId: 'LA-0204', relocatedUnit: 'LA-0104 (CORNER)', agent: 'SARTE, JOHN CHRISTOPHER', manager: 'SARTE, JOHN CHRISTOPHER', area: 446, pricePerSqm: 1000, totalContractPrice: 490600, paymentMode: 'CASH', paymentMade: 490600, balance: 0, paymentPercentage: 1.1, documentStatus: 'INC', contactNo: '0939-938-0205', email: 'johnmateosilva@gmail.com', address: 'GEN. TRI CAVITE', accountStatus: 'COMPLETE PAID', salesStatus: 'GOOD SALE' },
  { reservationDate: '01/25/2025', buyer: 'RABAGO, ELIZABETH L.', spouse: 'RABAGO, DOMINADOR S.', unitId: 'LA-0401', relocatedUnit: 'LA-0302 COMB, COR.', agent: 'SARTE, JOHN CHRISTOPHER', manager: 'SARTE, JOHN CHRISTOPHER', area: 546, pricePerSqm: 1200, totalContractPrice: 655200, paymentMode: 'INSTALLMENT', paymentMade: 655200, balance: 0, paymentPercentage: 1, documentStatus: 'INC', contactNo: '0917-324-5227', email: 'dannybeth21@yahoo.com', address: 'TAGUIG CITY', accountStatus: 'PARTIALLY PAID', salesStatus: 'GOOD SALE' },
  { reservationDate: '01/29/2025', buyer: 'DIZON, ELORA ANDREI', spouse: 'DIZON, ROBIEMERZ', unitId: 'LA-0416', relocatedUnit: 'LA-0315', agent: 'MOJICA, JONATHAN', manager: 'HERNANDEZ, JULIE ANN', area: 300, pricePerSqm: 1200, totalContractPrice: 396000, paymentMode: 'INSTALLMENT', paymentMade: 341640, balance: 54360, paymentPercentage: 0.949, documentStatus: 'INC', contactNo: '0917-113-9345', email: 'robiemerz@gmail.com', address: 'ROSARIO CAVITE', accountStatus: 'PARTIALLY PAID', salesStatus: 'GOOD SALE' },
  { reservationDate: '02/07/2025', buyer: 'RAMIREZ, PRINCE RUPERT', unitId: 'LA-0203', relocatedUnit: 'LA-0102 (INNER)', agent: 'RUSIT, ERIC', manager: 'GERO, STANLEY', area: 1200, pricePerSqm: 1200, totalContractPrice: 1584000, paymentMode: 'INSTALLMENT', paymentMade: 818532, balance: 765468, paymentPercentage: 0.568425, documentStatus: 'INC', contactNo: '0967-315-3279', email: 'princerupert_ramirez@yahoo.com', address: 'DASMA CAVITE', accountStatus: 'PARTIALLY PAID', salesStatus: 'GOOD SALE' },
  { reservationDate: '02/08/2025', buyer: 'RUSIT, ERIC C.', unitId: 'LA-0305 LA0306 & LA-0307 COMBINED', relocatedUnit: 'LA-0205, 0206, 0207', agent: 'GERO, STANLEY', manager: 'GERO, STANLEY', area: 900, pricePerSqm: 1200, totalContractPrice: 1188000, paymentMode: 'INSTALLMENT', paymentMade: 726066, balance: 461934, paymentPercentage: 0.6722833333, documentStatus: 'COMPLETE', contactNo: '0926-061-3218', email: 'ericrusit09@gmail.com', address: 'TAGAYTAY CITY', accountStatus: 'PARTIALLY PAID', salesStatus: 'GOOD SALE' },
]

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

export const paymentTracker: Payment[] = [
  { unitId: 'LA-0204', buyer: 'SILVA, ISABEL LAYUG L.', mode: 'CASH', paymentMade: 490600, totalContractPrice: 490600, balance: 0, paymentPercentage: 1.1, commissionReleasedPercent: 1 },
  { unitId: 'LA-0416', buyer: 'DIZON, ELORA ANDREI', mode: 'INSTALLMENT', dueDay: '28th', paymentMade: 341640, totalContractPrice: 396000, balance: 54360, paymentPercentage: 0.949, commissionReleasedPercent: 0.75 },
  { unitId: 'LA-0201 (1.1)', buyer: 'CAMANTIGUE, ESTELISA V.', mode: 'INSTALLMENT', dueDay: '10th', paymentMade: 241998, totalContractPrice: 396000, balance: 154002, paymentPercentage: 0.6722166667, commissionReleasedPercent: 0.6 },
  { unitId: 'LA-0203', buyer: 'RAMIREZ, PRINCE RUPERT', mode: 'INSTALLMENT', dueDay: '15th', paymentMade: 818532, totalContractPrice: 1584000, balance: 765468, paymentPercentage: 0.568425, commissionReleasedPercent: 0.2857142857 },
  { unitId: 'LA-0412 & LA-0414 COMBINED', buyer: 'OCAMPO, RACQUEL', mode: 'INSTALLMENT', dueDay: '10th', paymentMade: 446598, totalContractPrice: 792000, balance: 345402, paymentPercentage: 0.620275, commissionReleasedPercent: 0 },
]

export type SoaLine = {
  dueDate: string
  description: string
  dueAmount: number
  penalty: number
  datePaid?: string
  amountPaid?: number
  reference?: string
  runningBalance: number
}

export const soaRecords = [
  {
    buyer: 'ELORA ANDREI A. DIZON',
    unitNo: 'LA-0416',
    area: '300 sqm',
    statementDate: '06/03/2026',
    totalContractPrice: 360000,
    legalMiscFee: 36000,
    totalAmountPayable: 396000,
    totalToFullyPay: 107860,
    schedule: [
      { dueDate: '01/29/2025', description: 'Reservation Fee', dueAmount: 10000, penalty: 0, datePaid: '01/29/2025', amountPaid: 10000, reference: 'CASH', runningBalance: 386000 },
      { dueDate: '01/29/2025', description: 'LESS: SPOT DP DISCOUNT', dueAmount: 8100, penalty: 0, runningBalance: 377900 },
      { dueDate: '02/28/2025', description: 'Spot Downpayment', dueAmount: 100640, penalty: 0, datePaid: '02/28/2025', amountPaid: 100640, reference: '0020304707, 9139208563, 0994536423', runningBalance: 277260 },
      { dueDate: '03/28/2025', description: '1st Monthly Payment', dueAmount: 15400, penalty: 0, datePaid: '03/26/2025', amountPaid: 15400, reference: '3469673863', runningBalance: 261860 },
      { dueDate: '04/28/2025', description: '2nd Monthly Payment', dueAmount: 15400, penalty: 0, datePaid: '04/25/2025', amountPaid: 15400, reference: '3090583624', runningBalance: 246460 },
      { dueDate: '05/28/2025', description: '3rd Monthly Payment', dueAmount: 15400, penalty: 0, datePaid: '06/01/2025', amountPaid: 15400, reference: '2622983914', runningBalance: 231060 },
    ] satisfies SoaLine[],
  },
  {
    buyer: 'GERALDINE O. REGIS',
    unitNo: 'LA-0410 (NEW)',
    area: '300 sqm',
    statementDate: '06/03/2026',
    totalContractPrice: 54000,
    legalMiscFee: 0,
    totalAmountPayable: 54000,
    totalToFullyPay: 0,
    schedule: [
      { dueDate: '04/29/2026', description: 'Reservation Fee', dueAmount: 50000, penalty: 0, datePaid: '04/10/2026', amountPaid: 50000, reference: 'CASH', runningBalance: 4000 },
      { dueDate: '05/30/2026', description: '1st Monthly Payment', dueAmount: 23935, penalty: 0, runningBalance: 0 },
    ] satisfies SoaLine[],
  },
]

export const computations = [
  {
    name: '6-Month DP Scheme',
    project: 'PANTIHAN 4, MARAGONDON, CAVITE',
    promo: 16555,
    sellingPrice: 1638945,
    downpaymentPercent: 0.15,
    totalDownpayment: 245841.75,
    reservationFee: 50000,
    dpMonths: 6,
    monthlyDownpayment: 32640.29,
    balance: 1393103.25,
    estimated3Years: 45938.98,
    estimated5Years: 30637.97,
  },
  {
    name: 'Full DP Scheme',
    project: 'PANTIHAN 4, MARAGONDON, CAVITE',
    promo: 74497.5,
    totalContractPrice: 1581002.5,
    downpaymentPercent: 0.3,
    netDownpayment: 413827.4,
    reservationFee: 50000,
    netDpPayable: 363827.4,
    balance: 1106701.75,
    estimated3Years: 34779.84,
    estimated5Years: 23356.38,
  },
]

export const commissions = [
  { buyer: 'SILVA, ISABEL LAYUG L.', unitId: 'LA-0204', agent: 'SARTE, JOHN CHRISTOPHER', manager: 'SARTE, JOHN CHRISTOPHER', netSellingPrice: 446000, managerCommission: 8920, agentCommission: 22300, releasedPercent: 1 },
  { buyer: 'DIZON, ELORA ANDREI', unitId: 'LA-0416', agent: 'MOJICA, JONATHAN', manager: 'HERNANDEZ, JULIE ANN', netSellingPrice: 360000, managerCommission: 7200, agentCommission: 18000, releasedPercent: 0.75 },
  { buyer: 'CABISON, CHERRY MAE E.', unitId: 'LA-0406', agent: 'SARTE, JOHN CHRISTOPHER', manager: 'SARTE, JOHN CHRISTOPHER', netSellingPrice: 300000, managerCommission: 6000, agentCommission: 15000, releasedPercent: 0 },
  { buyer: 'DE LEON, CARMINA VICTORIA', unitId: 'LA-0407', agent: 'SARTE, JOHN CHRISTOPHER', manager: 'SARTE, JOHN CHRISTOPHER', netSellingPrice: 360000, managerCommission: 7200, agentCommission: 18000, releasedPercent: 0.75 },
]

export const agentPerformance = [
  { agent: 'SARTE, JOHN CHRISTOPHER', totalSales: 2006000, active: 4, cancelled: 0, net: 2006000 },
  { agent: 'SILVA, EDWARD JAMES', totalSales: 3835200, active: 11, cancelled: 0, net: 3835200 },
  { agent: 'MOJICA, JONATHAN', totalSales: 1680000, active: 4, cancelled: 0, net: 1680000 },
  { agent: 'HERNANDEZ, JULIE ANN', totalSales: 700000, active: 2, cancelled: 0, net: 700000 },
  { agent: 'RONIO, ALVIN', totalSales: 660000, active: 1, cancelled: 0, net: 660000 },
]

export const accreditedSellers = [
  { status: 'ACTIVE', name: 'NEPOMUCENO, ERWIN', manager: 'PARROCHO, JOSEPH E.', contact: '0991-995-8155', email: 'phproperty13@gmail.com' },
  { status: 'ACTIVE', name: 'BRIONES, CONIE, A.', manager: 'HERNANDEZ, JULIE ANN D.', contact: '09948685799', email: '-' },
  { status: 'ACTIVE', name: 'CORTEZ, ROWENA', manager: 'SARTE, JOHN CHRISTPOHER', contact: '09330264680', email: 'rowenamcortez16@gmail.com' },
  { status: 'INACTIVE', name: 'ORAPA, MARILOU', manager: 'PARROCHO, JOSEPH E.', contact: '-', email: '-' },
]

export const documents = [
  { buyer: 'SILVA, ISABEL LAYUG L.', unitId: 'LA-0204', documentStatus: 'INC', remarks: 'Master List marks document status as INC' },
  { buyer: 'AQUINO, JAYMILYN BERNARDO', unitId: 'LA-0103', documentStatus: 'COMPLETE', remarks: 'Complete per Master List' },
  { buyer: 'DIZON, ELORA ANDREI', unitId: 'LA-0416', documentStatus: 'INC', remarks: 'Pending completion' },
  { buyer: 'RUSIT, ERIC C.', unitId: 'LA-0305 LA0306 & LA-0307 COMBINED', documentStatus: 'COMPLETE', remarks: 'Complete per Master List' },
]

export const auditLogs = [
  ['06/03/2026 09:45 PM', 'Admin User', 'Loaded SOA INSTALLMENT.xlsx sample data', 'Data Import'],
  ['06/03/2026 09:46 PM', 'Admin User', 'Loaded CLIENT MASTERLIST sample rows', 'Data Import'],
  ['06/03/2026 09:47 PM', 'Admin User', 'Reviewed Pantihan 4 sample computation images', 'Computation'],
]

export const projects = [
  { id: 'project-1', name: 'Luntiang Aguinaldo', location: 'Gen. Emilio Aguinaldo, Cavite', status: 'Active', description: 'LA inventory from the provided masterlist.', coverImage: '', totalLots: 72 },
  { id: 'project-2', name: 'Pantihan 4', location: 'Maragondon, Cavite', status: 'Active', description: 'Pantihan 4 sample computation project.', coverImage: '', totalLots: 48 },
  { id: 'project-3', name: 'Gentry', location: 'TBD', status: 'Active', description: 'Mock project for phase 1 coverage.', coverImage: '', totalLots: 36 },
]

export const agents = [
  { id: 'agent-1', fullName: 'SARTE, JOHN CHRISTOPHER', email: 'sarte.john@dcprime.com', phone: '0917-111-0001', assignedProjects: ['project-1'], status: 'Active' },
  { id: 'agent-2', fullName: 'MOJICA, JONATHAN', email: 'mojica.jonathan@dcprime.com', phone: '0917-111-0002', assignedProjects: ['project-1'], status: 'Active' },
  { id: 'agent-3', fullName: 'HERNANDEZ, JULIE ANN', email: 'hernandez.julie@dcprime.com', phone: '0917-111-0003', assignedProjects: ['project-1', 'project-2'], status: 'Active' },
  { id: 'agent-4', fullName: 'GERO, STANLEY', email: 'gero.stanley@dcprime.com', phone: '0917-111-0004', assignedProjects: ['project-1'], status: 'Active' },
]

export const listingsV2 = Array.from({ length: 15 }, (_, index) => {
  const source = listings[index % listings.length]
  const status = index < 8 ? 'Available' : index < 12 ? 'Reserved' : 'Sold'
  return {
    id: `listing-${index + 1}`,
    unitId: index < listings.length ? source.unitId : `PT4-${String(index + 1).padStart(3, '0')}`,
    projectId: index < 7 ? 'project-1' : index < 12 ? 'project-2' : 'project-3',
    areaSqm: source.area,
    sellingPrice: source.totalContractPrice,
    status,
    assignedClientId: status === 'Available' ? null : `client-${(index % 10) + 1}`,
    images: [],
  }
})

export const clientsV2 = clients.concat([
  { reservationDate: '02/10/2025', buyer: 'CAMANTIGUE, ESTELISA V.', unitId: 'LA-0201 (1.1)', agent: 'RONIO, ALVIN', manager: 'HERNANDEZ, JULIE ANN', area: 300, pricePerSqm: 1200, totalContractPrice: 396000, paymentMode: 'INSTALLMENT', paymentMade: 241998, balance: 154002, paymentPercentage: 0.6722166667, documentStatus: 'INC', contactNo: '0997-118-0563', email: 'evcamantigue87@gmail.com', address: 'KAWIT CAVITE', accountStatus: 'PARTIALLY PAID', salesStatus: 'GOOD SALE' },
  { reservationDate: '02/13/2025', buyer: 'PRADEZ, JACKIELOU RIA G.', unitId: 'LA-0408', agent: 'SARTE, JOHN CHRISTOPHER', manager: 'SARTE, JOHN CHRISTOPHER', area: 300, pricePerSqm: 1000, totalContractPrice: 330000, paymentMode: 'CASH', paymentMade: 330000, balance: 0, paymentPercentage: 1.1, documentStatus: 'INC', contactNo: '0917-590-3452', email: 'pradezjg@bsp.gov.ph', address: 'GEN. TRI CAVITE', accountStatus: 'COMPLETE PAID', salesStatus: 'GOOD SALE' },
  { reservationDate: '02/16/2025', buyer: 'OCAMPO, RACQUEL', unitId: 'LA-0412 & LA-0414 COMBINED', agent: 'DAGALE, ROY', manager: 'DAGALE, ROY', area: 600, pricePerSqm: 1200, totalContractPrice: 792000, paymentMode: 'INSTALLMENT', paymentMade: 446598, balance: 345402, paymentPercentage: 0.620275, documentStatus: 'INC', contactNo: '0939-934-3253', email: 'ocampo.racquel@gmail.com', address: 'IMUS, CAVITE', accountStatus: 'PARTIALLY PAID', salesStatus: 'GOOD SALE' },
  { reservationDate: '02/18/2025', buyer: 'DE LEON, CARMINA VICTORIA', unitId: 'LA-0407', agent: 'SARTE, JOHN CHRISTOPHER', manager: 'SARTE, JOHN CHRISTOPHER', area: 300, pricePerSqm: 1200, totalContractPrice: 396000, paymentMode: 'INSTALLMENT', paymentMade: 288198, balance: 107802, paymentPercentage: 0.80055, documentStatus: 'INC', contactNo: '???', email: 'carminavictoriatdeleon@gmail.com', address: 'QUEZON CITY', accountStatus: 'PARTIALLY PAID', salesStatus: 'GOOD SALE' },
  { reservationDate: '02/20/2025', buyer: 'TUBORO, MARILOU GRIMALDO', unitId: 'LA-0411', agent: 'SARTE, JOHN CHRISTOPHER', manager: 'SARTE, JOHN CHRISTOPHER', area: 300, pricePerSqm: 1000, totalContractPrice: 330000, paymentMode: 'CASH', paymentMade: 330000, balance: 0, paymentPercentage: 1.1, documentStatus: 'INC', contactNo: '0908-874-1609', email: 'malou.taburo@yahoo.com', address: 'QUEZON CITY', accountStatus: 'COMPLETE PAID', salesStatus: 'GOOD SALE' },
])

export const payments = Array.from({ length: 20 }, (_, index) => {
  const client = clientsV2[index % clientsV2.length]
  const amount = index === 0 ? 10000 : index < 4 ? 15400 : 28875 + index * 250
  const runningBalance = Math.max(0, client.totalContractPrice - client.paymentMade + amount * (index % 3))
  return {
    id: `payment-${index + 1}`,
    clientId: `client-${(index % clientsV2.length) + 1}`,
    clientName: client.buyer,
    unitId: client.unitId,
    projectId: index % 3 === 0 ? 'project-1' : index % 3 === 1 ? 'project-2' : 'project-3',
    description: index === 0 ? 'Reservation Fee' : index < 4 ? `${index}st Downpayment` : `${index - 3}th Monthly Payment`,
    bank: index % 2 === 0 ? 'CASH' : 'BDO',
    accountNumber: index % 2 === 0 ? 'OFFICE' : `00${index}-123-456`,
    date: `05/${String((index % 28) + 1).padStart(2, '0')}/2026`,
    referenceNumber: index % 2 === 0 ? 'CASH' : `IP-090125-RQGY${index}`,
    amount,
    penalty: index % 6 === 0 ? 500 : 0,
    status: index % 5 === 0 ? 'Pending Verification' : 'Verified',
    runningBalance,
  }
})

export const commissionsV2 = Array.from({ length: 8 }, (_, index) => {
  const client = clientsV2[index % clientsV2.length]
  const sellingPrice = client.totalContractPrice
  const grossCommission = sellingPrice * 0.05
  const withholdingTax = grossCommission * 0.05
  return {
    id: `commission-${index + 1}`,
    agentId: `agent-${(index % agents.length) + 1}`,
    agentName: agents[index % agents.length].fullName,
    clientId: `client-${(index % clientsV2.length) + 1}`,
    clientName: client.buyer,
    unitId: client.unitId,
    projectId: index % 3 === 0 ? 'project-1' : index % 3 === 1 ? 'project-2' : 'project-3',
    sellingPrice,
    commissionRate: 0.05,
    grossCommission,
    withholdingTax,
    netCommission: grossCommission - withholdingTax,
    eligibility: {
      reservationFeePaid: true,
      requiredDocsSubmitted: index % 3 !== 0,
      dpThresholdReached: index % 2 === 0,
      contractSigned: index % 4 !== 0,
      managementApproval: index > 2,
    },
    status: index < 3 ? 'Pending' : index < 6 ? 'Approved' : 'Released',
  }
})

const requiredDocumentTypes = [
  "Client Registration Form (Seller's Copy)",
  'Client Registration Form (Administrator Copy)',
  "Buyer's Information Form",
  'Intent to Buy',
  "Offer to Buy & Buyer's Profile",
  'Deed of Absolute Sale',
  'Contract to Sell (Undivided Share)',
]

export const clientDocuments = clientsV2.flatMap((client, clientIndex) =>
  requiredDocumentTypes.map((documentType, docIndex) => ({
    id: `doc-${clientIndex + 1}-${docIndex + 1}`,
    clientId: `client-${clientIndex + 1}`,
    clientName: client.buyer,
    unitId: client.unitId,
    documentType,
    status: docIndex < 2 ? 'Approved' : docIndex === 2 ? 'Submitted' : docIndex === 3 && clientIndex % 2 === 0 ? 'Rejected' : 'Not Submitted',
    submittedDate: docIndex < 3 ? `05/${String(docIndex + 10).padStart(2, '0')}/2026` : '',
    rejectionRemark: docIndex === 3 && clientIndex % 2 === 0 ? 'Needs corrected signature.' : '',
  })),
)

export const usersV2 = [
  { id: 'user-1', fullName: 'Admin', email: 'admin@dcprime.com', role: 'admin', status: 'Active', dateCreated: '01/01/2026', lastLogin: '06/03/2026', permissions: featureKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {}) },
  { id: 'user-2', fullName: 'Treasury One', email: 'treasury1@dcprime.com', role: 'treasury', status: 'Active', dateCreated: '01/05/2026', lastLogin: '06/02/2026', permissions: rolePresets.treasury },
  { id: 'user-3', fullName: 'Treasury Two', email: 'treasury2@dcprime.com', role: 'treasury', status: 'Active', dateCreated: '01/08/2026', lastLogin: '06/01/2026', permissions: rolePresets.treasury },
  ...agents.map((agent, index) => ({ id: `user-${index + 4}`, fullName: agent.fullName, email: agent.email, role: 'agent', status: 'Active', dateCreated: '02/01/2026', lastLogin: '06/01/2026', permissions: rolePresets.agent })),
  { id: 'user-8', fullName: clientsV2[0].buyer, email: clientsV2[0].email ?? 'client1@dcprime.com', role: 'client', status: 'Active', dateCreated: '02/14/2026', lastLogin: '05/29/2026', permissions: rolePresets.client },
  { id: 'user-9', fullName: clientsV2[2].buyer, email: clientsV2[2].email ?? 'client2@dcprime.com', role: 'client', status: 'Active', dateCreated: '02/18/2026', lastLogin: '05/28/2026', permissions: rolePresets.client },
]

const auditActions = ['Payment recorded', 'Document approved', 'Commission released', 'Admin logged in', 'Listing updated', 'Client registered']

export const auditLogsV2 = Array.from({ length: 50 }, (_, index) => {
  const client = clientsV2[index % clientsV2.length]
  const action = auditActions[index % auditActions.length]
  return {
    id: `audit-${index + 1}`,
    timestamp: `05/${String((index % 30) + 1).padStart(2, '0')}/2026 ${String((index % 12) + 1).padStart(2, '0')}:15 PM`,
    userId: index % 4 === 0 ? 'user-1' : `user-${(index % 8) + 1}`,
    userName: index % 4 === 0 ? 'Admin' : agents[index % agents.length].fullName,
    role: index % 4 === 0 ? 'admin' : 'agent',
    action,
    details: `${action} - ${client.buyer} (${client.unitId})`,
    ipAddress: `192.168.1.${(index % 90) + 1}`,
  }
})
