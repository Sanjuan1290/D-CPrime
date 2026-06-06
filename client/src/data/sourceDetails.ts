export type CommissionPartyRelease = {
  name: string
  rate: number
  commission: number
  paymentPercentage: number
  firstRelease20: number
  secondRelease40: number
  thirdRelease60: number
  fourthRelease75: number
  retention25: number
  totalReceivedPercent: number
  totalRemaining: number
  cashAdvance: number
}

export type CommissionDetail = {
  buyer: string
  unitId: string
  lotType?: string
  unitVariant?: string
  mode: string
  area: number
  pricePerSqm: number
  netSellingPrice: number
  saleType: string
  manager: CommissionPartyRelease
  agent: CommissionPartyRelease
  cashKaliwaan: number
  date?: string
}

export type PaymentScheduleStatus = 'unpaid' | 'partial' | 'paid' | 'overdue'

export type MonthlyPaymentDetail = {
  period: string
  dueDate?: string
  amount: number
  penalty: number
  scheduleStatus: PaymentScheduleStatus
  datePaid?: string
  reference?: string
  receiptImage?: string
  receiptFileName?: string
}

export type PaymentDetail = {
  unitId: string
  lotType?: string
  unitVariant?: string
  buyer: string
  mode: string
  dueDay?: string
  monthlyPayments: MonthlyPaymentDetail[]
  paymentMade: number
  totalContractPrice: number
  balance: number
  paymentPercentage: number
  commissionReleasedPercent: number
  fr?: string
}

export type ListingInstallmentDetail = {
  unitId: string
  lotType?: string
  unitVariant?: string
  dp?: number
  spotDpDiscount?: number
  spotDp?: number
  balance?: number
  monthly3Years?: number
  monthly5Years?: number
  monthly10Years?: number
}

export type ClientSourceDetail = {
  buyer: string
  unitId: string
  lotType?: string
  unitVariant?: string
  ld?: string
  kubo?: string
  number?: string
  remarks?: string
  status?: string
  paymentStatus?: string
  age?: string
  region?: string
  team?: string
}

function money(value: number) {
  return Math.round(value * 100) / 100
}

function buildRelease(name: string, rate: number, netSellingPrice: number, paymentPercentage: number, cashAdvance = 0): CommissionPartyRelease {
  const commission = money(netSellingPrice * rate)
  const releaseBase = money(commission * Math.min(paymentPercentage, 0.75))
  const firstRelease20 = paymentPercentage >= 0.2 ? money(commission * 0.2) : 0
  const secondRelease40 = paymentPercentage >= 0.4 ? money(commission * 0.2) : 0
  const thirdRelease60 = paymentPercentage >= 0.6 ? money(commission * 0.2) : 0
  const fourthRelease75 = paymentPercentage >= 0.75 ? money(commission * 0.15) : 0
  const released = firstRelease20 + secondRelease40 + thirdRelease60 + fourthRelease75
  const retention25 = money(commission * 0.25)

  return {
    name,
    rate,
    commission,
    paymentPercentage,
    firstRelease20,
    secondRelease40,
    thirdRelease60,
    fourthRelease75,
    retention25,
    totalReceivedPercent: commission > 0 ? released / commission : 0,
    totalRemaining: money(Math.max(commission - releaseBase - cashAdvance, 0)),
    cashAdvance,
  }
}

export const commissionDetails: CommissionDetail[] = [
  {
    buyer: 'Reyes, Angela Mae',
    unitId: 'LA-0101',
    lotType: 'Inner Lot',
    mode: 'INSTALLMENT',
    area: 180,
    pricePerSqm: 4500,
    netSellingPrice: 810000,
    saleType: 'direct',
    manager: buildRelease('Carlo Mercado', 0.05, 810000, 0.314, 0),
    agent: buildRelease('Mara Santos', 0.07, 810000, 0.314, 15000),
    cashKaliwaan: 0,
    date: '2026-01-15',
  },
  {
    buyer: 'Dela Cruz, Paolo',
    unitId: 'LA-0102',
    lotType: 'Corner Lot',
    mode: 'CASH',
    area: 220,
    pricePerSqm: 4800,
    netSellingPrice: 1056000,
    saleType: 'distributed',
    manager: buildRelease('Carlo Mercado', 0.05, 1056000, 1),
    agent: buildRelease('Nico Ramos', 0.07, 1056000, 1, 10000),
    cashKaliwaan: 1161600,
    date: '2026-02-10',
  },
  {
    buyer: 'Villanueva, Sofia',
    unitId: 'LA-0103',
    lotType: 'End Lot',
    mode: 'INSTALLMENT',
    area: 200,
    pricePerSqm: 4650,
    netSellingPrice: 930000,
    saleType: 'direct',
    manager: buildRelease('Carlo Mercado', 0.05, 930000, 0.01),
    agent: buildRelease('Mara Santos', 0.07, 930000, 0.01),
    cashKaliwaan: 0,
    date: '2026-03-05',
  },
]

export const paymentDetails: PaymentDetail[] = [
  {
    unitId: 'LA-0101',
    lotType: 'Inner Lot',
    buyer: 'Reyes, Angela Mae',
    mode: 'INSTALLMENT',
    dueDay: '15th',
    monthlyPayments: [
      { period: 'Reservation Fee', dueDate: '2026-01-15', amount: 10000, penalty: 0, scheduleStatus: 'paid', datePaid: '2026-01-15', reference: 'BDO-00101' },
      { period: 'Downpayment', dueDate: '2026-02-15', amount: 170000, penalty: 0, scheduleStatus: 'paid', datePaid: '2026-02-15', reference: 'BPI-00102' },
      { period: 'Monthly Amortization', dueDate: '2026-03-15', amount: 100000, penalty: 0, scheduleStatus: 'paid', datePaid: '2026-03-15', reference: 'OR-00103' },
      { period: 'Monthly Amortization', dueDate: '2026-04-15', amount: 0, penalty: 750, scheduleStatus: 'overdue', reference: 'DUE-00104' },
    ],
    paymentMade: 280000,
    totalContractPrice: 891000,
    balance: 611000,
    paymentPercentage: 280000 / 891000,
    commissionReleasedPercent: 0.4,
    fr: 'FR-001',
  },
  {
    unitId: 'LA-0102',
    lotType: 'Corner Lot',
    buyer: 'Dela Cruz, Paolo',
    mode: 'CASH',
    dueDay: 'On demand',
    monthlyPayments: [
      { period: 'Full Payment', dueDate: '2026-02-10', amount: 1161600, penalty: 0, scheduleStatus: 'paid', datePaid: '2026-02-10', reference: 'MBTC-00201' },
    ],
    paymentMade: 1161600,
    totalContractPrice: 1161600,
    balance: 0,
    paymentPercentage: 1,
    commissionReleasedPercent: 1,
    fr: 'FR-002',
  },
  {
    unitId: 'LA-0103',
    lotType: 'End Lot',
    buyer: 'Villanueva, Sofia',
    mode: 'INSTALLMENT',
    dueDay: '15th',
    monthlyPayments: [
      { period: 'Reservation Fee', dueDate: '2026-03-05', amount: 10000, penalty: 0, scheduleStatus: 'paid', datePaid: '2026-03-05', reference: 'UB-00301' },
      { period: 'Downpayment', dueDate: '2026-04-05', amount: 0, penalty: 1500, scheduleStatus: 'overdue', reference: 'DUE-00302' },
    ],
    paymentMade: 10000,
    totalContractPrice: 1023000,
    balance: 1013000,
    paymentPercentage: 10000 / 1023000,
    commissionReleasedPercent: 0,
    fr: 'FR-003',
  },
]

export const listingInstallmentDetails: ListingInstallmentDetail[] = [
  { unitId: 'LA-0101', lotType: 'Inner Lot', dp: 178200, spotDpDiscount: 0, spotDp: 178200, balance: 712800, monthly3Years: 19800, monthly5Years: 11880, monthly10Years: 5940 },
  { unitId: 'LA-0102', lotType: 'Corner Lot', dp: 1161600, spotDpDiscount: 25000, spotDp: 1136600, balance: 0, monthly3Years: 0, monthly5Years: 0, monthly10Years: 0 },
  { unitId: 'LA-0103', lotType: 'End Lot', dp: 204600, spotDpDiscount: 0, spotDp: 204600, balance: 818400, monthly3Years: 22733.33, monthly5Years: 13640, monthly10Years: 6820 },
]

export const clientSourceDetails: ClientSourceDetail[] = [
  { buyer: 'Reyes, Angela Mae', unitId: 'LA-0101', lotType: 'Inner Lot', remarks: 'Active installment account', status: 'GOOD SALE', paymentStatus: 'PARTIALLY PAID', age: '34', region: 'Cavite', team: 'Mara Santos' },
  { buyer: 'Dela Cruz, Paolo', unitId: 'LA-0102', lotType: 'Corner Lot', remarks: 'Fully paid cash buyer', status: 'GOOD SALE', paymentStatus: 'COMPLETE PAID', age: '42', region: 'Cavite', team: 'Nico Ramos' },
  { buyer: 'Villanueva, Sofia', unitId: 'LA-0103', lotType: 'End Lot', remarks: 'Pending downpayment and CTS', status: 'FOR REVIEW', paymentStatus: 'PARTIALLY PAID', age: '29', region: 'Cavite', team: 'Mara Santos' },
]
