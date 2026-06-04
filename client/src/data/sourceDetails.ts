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

export type PaymentDetail = {
  unitId: string
  lotType?: string
  unitVariant?: string
  buyer: string
  mode: string
  dueDay?: string
  monthlyPayments: {
    period: string
    amount: number
    datePaid?: string
    reference?: string
    receiptImage?: string
    receiptFileName?: string
  }[]
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

const canonicalCommissionDetails: CommissionDetail[] = [
  {
    "buyer": "SILVA, ISABEL LAYUG L.",
    "unitId": "LA-0204",
    "mode": "CASH",
    "area": 446.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 446000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 8920.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1784.0,
      "secondRelease40": 1784.0,
      "thirdRelease60": 1784.0,
      "fourthRelease75": 1338.0,
      "retention25": 2230.0,
      "totalReceivedPercent": 1.0,
      "totalRemaining": 0.0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.05,
      "commission": 22300.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 4460.0,
      "secondRelease40": 4460.0,
      "thirdRelease60": 4460.0,
      "fourthRelease75": 3345.0,
      "retention25": 5575.0,
      "totalReceivedPercent": 1.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "01-19-2025"
  },
  {
    "buyer": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0401",
    "mode": "CASH",
    "area": 546.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 655200.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 13104.0,
      "paymentPercentage": 1.0,
      "firstRelease20": 2620.8,
      "secondRelease40": 2620.8,
      "thirdRelease60": 2620.8,
      "fourthRelease75": 1965.6,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.05,
      "commission": 32760.0,
      "paymentPercentage": 1.0,
      "firstRelease20": 6552.0,
      "secondRelease40": 6552.0,
      "thirdRelease60": 6552.0,
      "fourthRelease75": 4914.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "CABISON, AVA MAXINE E.",
    "unitId": "LA-0403",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 6000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1200.0,
      "secondRelease40": 1200.0,
      "thirdRelease60": 1200.0,
      "fourthRelease75": 900.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.05,
      "commission": 15000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3000.0,
      "secondRelease40": 3000.0,
      "thirdRelease60": 3000.0,
      "fourthRelease75": 2250.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "CABISON, SOPHIA CLAIRE E.",
    "unitId": "LA-0404",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 6000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1200.0,
      "secondRelease40": 1200.0,
      "thirdRelease60": 1200.0,
      "fourthRelease75": 900.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.05,
      "commission": 15000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3000.0,
      "secondRelease40": 3000.0,
      "thirdRelease60": 3000.0,
      "fourthRelease75": 2250.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "AQUINO, JAYMILYN BERNARDO",
    "unitId": "LA-0103",
    "mode": "CASH",
    "area": 466.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 466000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "GERO, STANLEY",
      "rate": 0.02,
      "commission": 9320.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1864.0,
      "secondRelease40": 1864.0,
      "thirdRelease60": 1864.0,
      "fourthRelease75": 1398.0,
      "retention25": 2330.0,
      "totalReceivedPercent": 1.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "GERO, STANLEY",
      "rate": 0.05,
      "commission": 23300.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 4660.0,
      "secondRelease40": 4660.0,
      "thirdRelease60": 4660.0,
      "fourthRelease75": 3495.0,
      "retention25": 5825.0,
      "totalReceivedPercent": 1.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "01/29/2025"
  },
  {
    "buyer": "DIZON, ELORA ANDREI",
    "unitId": "LA-0416",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.02,
      "commission": 7200.0,
      "paymentPercentage": 0.949,
      "firstRelease20": 1440.0,
      "secondRelease40": 1440.0,
      "thirdRelease60": 1440.0,
      "fourthRelease75": 1080.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "MOJICA, JONATHAN",
      "rate": 0.05,
      "commission": 18000.0,
      "paymentPercentage": 0.949,
      "firstRelease20": 3600.0,
      "secondRelease40": 3600.0,
      "thirdRelease60": 3600.0,
      "fourthRelease75": 2700.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "01/29/2025"
  },
  {
    "buyer": "DACAYO, JENNIFER MOROJO",
    "unitId": "LA-0101",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.02,
      "commission": 6000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1200.0,
      "secondRelease40": 1200.0,
      "thirdRelease60": 1200.0,
      "fourthRelease75": 900.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.05,
      "commission": 15000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3000.0,
      "secondRelease40": 3000.0,
      "thirdRelease60": 3000.0,
      "fourthRelease75": 2250.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "01/31/2025"
  },
  {
    "buyer": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.02,
      "commission": 7200.0,
      "paymentPercentage": 0.672216666666667,
      "firstRelease20": 1440.0,
      "secondRelease40": 1440.0,
      "thirdRelease60": 1440.0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.6,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "RONIO, ALVIN",
      "rate": 0.05,
      "commission": 18000.0,
      "paymentPercentage": 0.672216666666667,
      "firstRelease20": 3600.0,
      "secondRelease40": 3600.0,
      "thirdRelease60": 3600.0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.6,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "02/01/2025"
  },
  {
    "buyer": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "mode": "INSTALLMENT",
    "area": 1200.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 1440000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "GERO, STANLEY",
      "rate": 0.02,
      "commission": 28800.0,
      "paymentPercentage": 0.568425,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "RUSIT, ERIC",
      "rate": 0.05,
      "commission": 72000.0,
      "paymentPercentage": 0.568425,
      "firstRelease20": 14400.0,
      "secondRelease40": 14400.0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.4,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "02/01/2025"
  },
  {
    "buyer": "RUSIT, ERIC C.",
    "unitId": "LA-0305 LA0306 & LA-0307 COMBINED",
    "mode": "INSTALLMENT",
    "area": 900.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 1080000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "GERO, STANLEY",
      "rate": 0.02,
      "commission": 21600.0,
      "paymentPercentage": 0.672283333333333,
      "firstRelease20": 4320.0,
      "secondRelease40": 4320.0,
      "thirdRelease60": 4320.0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.6,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "GERO, STANLEY",
      "rate": 0.05,
      "commission": 54000.0,
      "paymentPercentage": 0.672283333333333,
      "firstRelease20": 10800.0,
      "secondRelease40": 10800.0,
      "thirdRelease60": 10800.0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.6,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "02/07/2025"
  },
  {
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0408",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 6000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1200.0,
      "secondRelease40": 1200.0,
      "thirdRelease60": 1200.0,
      "fourthRelease75": 900.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.05,
      "commission": 15000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3000.0,
      "secondRelease40": 3000.0,
      "thirdRelease60": 3000.0,
      "fourthRelease75": 2250.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "02/07/2025"
  },
  {
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0410",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 6000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1200.0,
      "secondRelease40": 1200.0,
      "thirdRelease60": 1200.0,
      "fourthRelease75": 900.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.05,
      "commission": 15000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3000.0,
      "secondRelease40": 3000.0,
      "thirdRelease60": 3000.0,
      "fourthRelease75": 2250.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "BORAC, LARRY S.",
    "unitId": "LA-0405",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 6000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1200.0,
      "secondRelease40": 1200.0,
      "thirdRelease60": 1200.0,
      "fourthRelease75": 900.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.05,
      "commission": 15000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3000.0,
      "secondRelease40": 3000.0,
      "thirdRelease60": 3000.0,
      "fourthRelease75": 2250.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "OCAMPO, RACQUEL",
    "unitId": "LA-0412 & LA-0414 COMBINED",
    "mode": "CASH",
    "area": 600.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 720000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "DAGALE, ROY",
      "rate": 0.02,
      "commission": 14400.0,
      "paymentPercentage": 0.620275,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "DAGALE, ROY",
      "rate": 0.05,
      "commission": 36000.0,
      "paymentPercentage": 0.620275,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "02/08/2025"
  },
  {
    "buyer": "CABISON, CHERRY MAE E.",
    "unitId": "LA-0406",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 6000.0,
      "paymentPercentage": 0.2,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.05,
      "commission": 15000.0,
      "paymentPercentage": 0.2,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "02/08/2025"
  },
  {
    "buyer": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 7200.0,
      "paymentPercentage": 0.80055,
      "firstRelease20": 1440.0,
      "secondRelease40": 1440.0,
      "thirdRelease60": 1440.0,
      "fourthRelease75": 1080.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.05,
      "commission": 18000.0,
      "paymentPercentage": 0.80055,
      "firstRelease20": 3600.0,
      "secondRelease40": 3600.0,
      "thirdRelease60": 3600.0,
      "fourthRelease75": 2700.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "TUBORO, MARILOU GRIMALDO",
    "unitId": "LA-0411",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 6000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1200.0,
      "secondRelease40": 1200.0,
      "thirdRelease60": 1200.0,
      "fourthRelease75": 900.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.05,
      "commission": 15000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3000.0,
      "secondRelease40": 3000.0,
      "thirdRelease60": 3000.0,
      "fourthRelease75": 2250.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "02/16/2025"
  },
  {
    "buyer": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 7200.0,
      "paymentPercentage": 0.80055,
      "firstRelease20": 1440.0,
      "secondRelease40": 1440.0,
      "thirdRelease60": 1440.0,
      "fourthRelease75": 1080.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.05,
      "commission": 18000.0,
      "paymentPercentage": 0.80055,
      "firstRelease20": 3600.0,
      "secondRelease40": 3600.0,
      "thirdRelease60": 3600.0,
      "fourthRelease75": 2700.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "02/16/2025"
  },
  {
    "buyer": "SIAZON, JEFFERSON C.",
    "unitId": "LA-0108 (CORNER) A",
    "mode": "INSTALLMENT",
    "area": 600.0,
    "pricePerSqm": 1100.0,
    "netSellingPrice": 660000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.02,
      "commission": 13200.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 2640.0,
      "secondRelease40": 2640.0,
      "thirdRelease60": 2640.0,
      "fourthRelease75": 1980.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "MOJICA, JONATHAN",
      "rate": 0.05,
      "commission": 33000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 6600.0,
      "secondRelease40": 6600.0,
      "thirdRelease60": 6600.0,
      "fourthRelease75": 4950.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "02/16/2025"
  },
  {
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0304",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 6000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1200.0,
      "secondRelease40": 1200.0,
      "thirdRelease60": 1200.0,
      "fourthRelease75": 900.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.05,
      "commission": 15000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3000.0,
      "secondRelease40": 3000.0,
      "thirdRelease60": 3000.0,
      "fourthRelease75": 2250.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "SALAMAT, ANTONIO, MIGUEL",
    "unitId": "LA-0413",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "DAGALE, ROY",
      "rate": 0.02,
      "commission": 6000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1200.0,
      "secondRelease40": 1200.0,
      "thirdRelease60": 1200.0,
      "fourthRelease75": 900.0,
      "retention25": 1500.0,
      "totalReceivedPercent": 1.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "DAGALE, ROY",
      "rate": 0.05,
      "commission": 15000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3000.0,
      "secondRelease40": 3000.0,
      "thirdRelease60": 3000.0,
      "fourthRelease75": 2250.0,
      "retention25": 3750.0,
      "totalReceivedPercent": 1.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "COMIA, GRAZELYN M.",
    "unitId": "LA-0415",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "DAGALE, ROY",
      "rate": 0.02,
      "commission": 6000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1200.0,
      "secondRelease40": 1200.0,
      "thirdRelease60": 1200.0,
      "fourthRelease75": 900.0,
      "retention25": 1500.0,
      "totalReceivedPercent": 1.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "DAGALE, ROY",
      "rate": 0.05,
      "commission": 15000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3000.0,
      "secondRelease40": 3000.0,
      "thirdRelease60": 3000.0,
      "fourthRelease75": 2250.0,
      "retention25": 3750.0,
      "totalReceivedPercent": 1.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "02/25/2025"
  },
  {
    "buyer": "GULLA, SHERYL",
    "unitId": "LA-0718",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 6000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1200.0,
      "secondRelease40": 1200.0,
      "thirdRelease60": 1200.0,
      "fourthRelease75": 900.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "RIOJA, KIRSTEN JHOYCE A.",
      "rate": 0.05,
      "commission": 15000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3000.0,
      "secondRelease40": 3000.0,
      "thirdRelease60": 3000.0,
      "fourthRelease75": 2250.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "DE SAN PERDRO, JOHN MHELCON",
    "unitId": "COMBINED: LA-0501 & LA-0502",
    "mode": "CASH",
    "area": 600.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 600000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "DAGALE, ROY",
      "rate": 0.02,
      "commission": 12000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 0.0,
      "secondRelease40": 6000.0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.5,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "DAGALE, WINDRA",
      "rate": 0.05,
      "commission": 30000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 0.0,
      "secondRelease40": 6000.0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.2,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "03/01/2025"
  },
  {
    "buyer": "GARCIA, JANICE M.",
    "unitId": "LA-0302",
    "mode": "INSTALLMENT",
    "area": 400.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 400000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.02,
      "commission": 8000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1600.0,
      "secondRelease40": 1600.0,
      "thirdRelease60": 1600.0,
      "fourthRelease75": 1200.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.05,
      "commission": 20000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 4000.0,
      "secondRelease40": 4000.0,
      "thirdRelease60": 4000.0,
      "fourthRelease75": 3000.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "03/01/2025"
  },
  {
    "buyer": "CHANG, IMELDA A.",
    "unitId": "LA-0417 (CORNER)",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 6000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1200.0,
      "secondRelease40": 1200.0,
      "thirdRelease60": 1200.0,
      "fourthRelease75": 900.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.05,
      "commission": 15000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3000.0,
      "secondRelease40": 3000.0,
      "thirdRelease60": 3000.0,
      "fourthRelease75": 2250.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "03/02/2025"
  },
  {
    "buyer": "BAGAOISAN, LILIA A.",
    "unitId": "LA-0108 (INNER) B",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1100.0,
    "netSellingPrice": 330000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.02,
      "commission": 6600.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1320.0,
      "secondRelease40": 1320.0,
      "thirdRelease60": 1320.0,
      "fourthRelease75": 990.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "MOJICA, JONATHAN",
      "rate": 0.05,
      "commission": 16500.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3300.0,
      "secondRelease40": 3300.0,
      "thirdRelease60": 3300.0,
      "fourthRelease75": 2475.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "03/22/2025"
  },
  {
    "buyer": "TAYLOR, WENDY B.",
    "unitId": "LA-0108 (END) C",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1100.0,
    "netSellingPrice": 330000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.02,
      "commission": 6600.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1320.0,
      "secondRelease40": 1320.0,
      "thirdRelease60": 1320.0,
      "fourthRelease75": 990.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "MOJICA, JONATHAN",
      "rate": 0.05,
      "commission": 16500.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3300.0,
      "secondRelease40": 3300.0,
      "thirdRelease60": 3300.0,
      "fourthRelease75": 2475.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 700.0,
    "date": ""
  },
  {
    "buyer": "JOHNSON, CHERRY F.",
    "unitId": "LA-1201 (CORNER)",
    "mode": "INSTALLMENT",
    "area": 535.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 802500.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "DAGALE, ROY",
      "rate": 0.02,
      "commission": 16050.0,
      "paymentPercentage": 0.0660436137071651,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "DAGALE, ROY",
      "rate": 0.05,
      "commission": 40125.0,
      "paymentPercentage": 0.0660436137071651,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "mode": "CASH",
    "area": 2400.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 2400000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 48000.0,
      "paymentPercentage": 1.05,
      "firstRelease20": 9600.0,
      "secondRelease40": 9600.0,
      "thirdRelease60": 9600.0,
      "fourthRelease75": 7200.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.05,
      "commission": 120000.0,
      "paymentPercentage": 1.05,
      "firstRelease20": 24000.0,
      "secondRelease40": 24000.0,
      "thirdRelease60": 24000.0,
      "fourthRelease75": 18000.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "mode": "CASH",
    "area": 860.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 860000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 17200.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3440.0,
      "secondRelease40": 3440.0,
      "thirdRelease60": 3440.0,
      "fourthRelease75": 2580.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.05,
      "commission": 43000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 8600.0,
      "secondRelease40": 8600.0,
      "thirdRelease60": 8600.0,
      "fourthRelease75": 6450.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "03/23/2025"
  },
  {
    "buyer": "PERALTA, GERRY Q.",
    "unitId": "LA-1105",
    "mode": "CASH",
    "area": 334.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 334000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "DINGLASAN, JERICKO",
      "rate": 0.02,
      "commission": 6680.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1336.0,
      "secondRelease40": 1336.0,
      "thirdRelease60": 1336.0,
      "fourthRelease75": 1002.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "DINGLASAN, JERICKO",
      "rate": 0.05,
      "commission": 16700.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3340.0,
      "secondRelease40": 3340.0,
      "thirdRelease60": 3340.0,
      "fourthRelease75": 2505.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "04/13/2025"
  },
  {
    "buyer": "LAYUG, EDWARD JO S.",
    "unitId": "LA-0205",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 7200.0,
      "paymentPercentage": 0.0277777777777778,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.05,
      "commission": 18000.0,
      "paymentPercentage": 0.0277777777777778,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "01-19-2025"
  },
  {
    "buyer": "HATEM, HANNOUSH MARC ANDREEI B.",
    "unitId": "LA-1201 (INNER)",
    "mode": "INSTALLMENT",
    "area": 530.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 530000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 10600.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 2120.0,
      "secondRelease40": 2120.0,
      "thirdRelease60": 2120.0,
      "fourthRelease75": 1590.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 26500.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 5300.0,
      "secondRelease40": 5300.0,
      "thirdRelease60": 5300.0,
      "fourthRelease75": 3975.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 700.0,
    "date": ""
  },
  {
    "buyer": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (CORNER)",
    "mode": "CASH",
    "area": 535.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 535000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 10700.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 2140.0,
      "secondRelease40": 2140.0,
      "thirdRelease60": 2140.0,
      "fourthRelease75": 1605.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "RIOJA, KIRSTEN JHOYCE A.",
      "rate": 0.05,
      "commission": 26750.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 5350.0,
      "secondRelease40": 5350.0,
      "thirdRelease60": 5350.0,
      "fourthRelease75": 4012.5,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "03/31/2025"
  },
  {
    "buyer": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (END)",
    "mode": "CASH",
    "area": 530.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 530000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 10600.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 2120.0,
      "secondRelease40": 2120.0,
      "thirdRelease60": 2120.0,
      "fourthRelease75": 1590.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "RIOJA, KIRSTEN JHOYCE A.",
      "rate": 0.05,
      "commission": 26500.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 5300.0,
      "secondRelease40": 5300.0,
      "thirdRelease60": 5300.0,
      "fourthRelease75": 3975.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "03/31/2025"
  },
  {
    "buyer": "BELIGON, ERDELYN F.",
    "unitId": "LA-1103",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 6000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1200.0,
      "secondRelease40": 1200.0,
      "thirdRelease60": 1200.0,
      "fourthRelease75": 900.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 15000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3000.0,
      "secondRelease40": 3000.0,
      "thirdRelease60": 3000.0,
      "fourthRelease75": 2250.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "04/06/2025"
  },
  {
    "buyer": "MORIONES, CHERRY",
    "unitId": "LA-0719",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.02,
      "commission": 6000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1200.0,
      "secondRelease40": 1200.0,
      "thirdRelease60": 1200.0,
      "fourthRelease75": 900.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "TENORIO, MARK",
      "rate": 0.05,
      "commission": 15000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3000.0,
      "secondRelease40": 3000.0,
      "thirdRelease60": 3000.0,
      "fourthRelease75": 2250.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "05-22-2025"
  },
  {
    "buyer": "MAGORA, JOANNA MARIE",
    "unitId": "LA-0602",
    "mode": "CASH",
    "area": 430.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 430000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 8600.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1720.0,
      "secondRelease40": 1720.0,
      "thirdRelease60": 1720.0,
      "fourthRelease75": 1290.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 21500.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 4300.0,
      "secondRelease40": 4300.0,
      "thirdRelease60": 4300.0,
      "fourthRelease75": 3225.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "04/05/2025"
  },
  {
    "buyer": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "mode": "CASH",
    "area": 600.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 900000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 18000.0,
      "paymentPercentage": 0.442593333333333,
      "firstRelease20": 3600.0,
      "secondRelease40": 3600.0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.4,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 45000.0,
      "paymentPercentage": 0.442593333333333,
      "firstRelease20": 9000.0,
      "secondRelease40": 9000.0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.4,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 700.0,
    "date": ""
  },
  {
    "buyer": "ARGETE, RICHELL",
    "unitId": "LA-0604",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 300000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 6000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1200.0,
      "secondRelease40": 1200.0,
      "thirdRelease60": 1200.0,
      "fourthRelease75": 900.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 15000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3000.0,
      "secondRelease40": 3000.0,
      "thirdRelease60": 3000.0,
      "fourthRelease75": 2250.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "04/13/2025"
  },
  {
    "buyer": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0504",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 7200.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1440.0,
      "secondRelease40": 1440.0,
      "thirdRelease60": 1440.0,
      "fourthRelease75": 1080.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.05,
      "commission": 18000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3600.0,
      "secondRelease40": 3600.0,
      "thirdRelease60": 3600.0,
      "fourthRelease75": 2700.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "04/13/2025"
  },
  {
    "buyer": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 450000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 9000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1800.0,
      "secondRelease40": 1800.0,
      "thirdRelease60": 1800.0,
      "fourthRelease75": 1350.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.05,
      "commission": 22500.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 4500.0,
      "secondRelease40": 4500.0,
      "thirdRelease60": 4500.0,
      "fourthRelease75": 3375.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "04/13/2025"
  },
  {
    "buyer": "DERILO, GENEVIEVE O.",
    "unitId": "LA-0612",
    "mode": "INSTALLMENT",
    "area": 350.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 350000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 7000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1400.0,
      "secondRelease40": 1400.0,
      "thirdRelease60": 1400.0,
      "fourthRelease75": 1050.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 17500.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3500.0,
      "secondRelease40": 3500.0,
      "thirdRelease60": 3500.0,
      "fourthRelease75": 2625.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "04/06/2025"
  },
  {
    "buyer": "OLANO, ALLAN RAYMUND P.",
    "unitId": "LA-0613",
    "mode": "CASH",
    "area": 442.0,
    "pricePerSqm": 1000.0,
    "netSellingPrice": 442000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 8840.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1768.0,
      "secondRelease40": 1768.0,
      "thirdRelease60": 1768.0,
      "fourthRelease75": 1326.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 22100.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 4420.0,
      "secondRelease40": 4420.0,
      "thirdRelease60": 4420.0,
      "fourthRelease75": 3315.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": "04/06/2025"
  },
  {
    "buyer": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 450000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 9000.0,
      "paymentPercentage": 0.883027777777778,
      "firstRelease20": 1800.0,
      "secondRelease40": 1800.0,
      "thirdRelease60": 1800.0,
      "fourthRelease75": 1350.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "ROXAS, SALIDONIA",
      "rate": 0.05,
      "commission": 22500.0,
      "paymentPercentage": 0.883027777777778,
      "firstRelease20": 4500.0,
      "secondRelease40": 4500.0,
      "thirdRelease60": 4500.0,
      "fourthRelease75": 3375.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 700.0,
    "date": "05/19/2025"
  },
  {
    "buyer": "PANGHULAN, RUTH Q.",
    "unitId": "LA-0610",
    "mode": "INSTALLMENT",
    "area": 350.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 420000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 8400.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1680.0,
      "secondRelease40": 1680.0,
      "thirdRelease60": 1680.0,
      "fourthRelease75": 1260.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 21000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 4200.0,
      "secondRelease40": 4200.0,
      "thirdRelease60": 4200.0,
      "fourthRelease75": 3150.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 5250.0,
      "cashAdvance": 0.0
    },
    "cashKaliwaan": 0,
    "date": "04/26/2025"
  },
  {
    "buyer": "ARAYATA, RICHELLE C.",
    "unitId": "LA-0703 & LA-0705 COMBINED",
    "mode": "",
    "area": 600.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 720000.0,
    "saleType": "",
    "manager": {
      "name": "DAGALE, ROY",
      "rate": 0,
      "commission": 0.0,
      "paymentPercentage": 0.0694444444444444,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "DAGALE, ROY",
      "rate": 0,
      "commission": 0,
      "paymentPercentage": 0,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "ALAMER, JAZZIE",
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "mode": "CASH",
    "area": 600.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 900000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 18000.0,
      "paymentPercentage": 0.861666666666667,
      "firstRelease20": 3600.0,
      "secondRelease40": 3600.0,
      "thirdRelease60": 3600.0,
      "fourthRelease75": 2700.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 45000.0,
      "paymentPercentage": 0.861666666666667,
      "firstRelease20": 9000.0,
      "secondRelease40": 9000.0,
      "thirdRelease60": 9000.0,
      "fourthRelease75": 6750.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 700.0,
    "date": "05-22-2025"
  },
  {
    "buyer": "ORAPA, LOUEL M.",
    "unitId": "LA-0707 (INNER)",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 7200.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1440.0,
      "secondRelease40": 1440.0,
      "thirdRelease60": 1440.0,
      "fourthRelease75": 1080.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 18000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3600.0,
      "secondRelease40": 3600.0,
      "thirdRelease60": 3600.0,
      "fourthRelease75": 2700.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 700.0,
    "date": "10/05/2025"
  },
  {
    "buyer": "ORAPA, MARILOU",
    "unitId": "LA-0709 & LA-0711 COMBINED",
    "mode": "CASH",
    "area": 600.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 720000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 14400.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 2880.0,
      "secondRelease40": 2880.0,
      "thirdRelease60": 2880.0,
      "fourthRelease75": 2160.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 36000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 7200.0,
      "secondRelease40": 7200.0,
      "thirdRelease60": 7200.0,
      "fourthRelease75": 5400.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 700.0,
    "date": ""
  },
  {
    "buyer": "MIRASOL, ROSARIO L.",
    "unitId": "LA-0713",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 7200.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1440.0,
      "secondRelease40": 1440.0,
      "thirdRelease60": 1440.0,
      "fourthRelease75": 1080.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 18000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3600.0,
      "secondRelease40": 3600.0,
      "thirdRelease60": 3600.0,
      "fourthRelease75": 2700.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 700.0,
    "date": "10/05/2025"
  },
  {
    "buyer": "FABABIER, ANNABELLE B.",
    "unitId": "LA-0715",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 7200.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1440.0,
      "secondRelease40": 1440.0,
      "thirdRelease60": 1440.0,
      "fourthRelease75": 1080.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 18000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3600.0,
      "secondRelease40": 3600.0,
      "thirdRelease60": 3600.0,
      "fourthRelease75": 2700.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 700.0,
    "date": "10/05/2025"
  },
  {
    "buyer": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 450000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 9000.0,
      "paymentPercentage": 1.0775,
      "firstRelease20": 1800.0,
      "secondRelease40": 1800.0,
      "thirdRelease60": 1800.0,
      "fourthRelease75": 1350.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 22500.0,
      "paymentPercentage": 1.0775,
      "firstRelease20": 4500.0,
      "secondRelease40": 4500.0,
      "thirdRelease60": 4500.0,
      "fourthRelease75": 3375.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 700.0,
    "date": "05-22-2025"
  },
  {
    "buyer": "GALENG, ANGELITA",
    "unitId": "LA-0809",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 450000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.02,
      "commission": 9000.0,
      "paymentPercentage": 0.843000022222222,
      "firstRelease20": 1800.0,
      "secondRelease40": 1800.0,
      "thirdRelease60": 1800.0,
      "fourthRelease75": 1350.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "ORAPA,  MARILOU",
      "rate": 0.05,
      "commission": 22500.0,
      "paymentPercentage": 0.843000022222222,
      "firstRelease20": 4500.0,
      "secondRelease40": 4500.0,
      "thirdRelease60": 4500.0,
      "fourthRelease75": 3375.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "RIL, MARVIN",
    "unitId": "LA-0706",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 450000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 9000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1800.0,
      "secondRelease40": 1800.0,
      "thirdRelease60": 1800.0,
      "fourthRelease75": 1350.0,
      "retention25": 0,
      "totalReceivedPercent": 0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "RIL, AUNDRIA ATONIO",
      "rate": 0.05,
      "commission": 22500.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 4500.0,
      "secondRelease40": 4500.0,
      "thirdRelease60": 4500.0,
      "fourthRelease75": 3375.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "OROPESA, ROGELIO",
    "unitId": "LA-0702",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1200.0,
    "netSellingPrice": 360000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 7200.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1440.0,
      "secondRelease40": 1440.0,
      "thirdRelease60": 1440.0,
      "fourthRelease75": 1080.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 18000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 3600.0,
      "secondRelease40": 3600.0,
      "thirdRelease60": 3600.0,
      "fourthRelease75": 2700.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 700.0,
    "date": "02/06/2025"
  },
  {
    "buyer": "PAYOFELIN, LIZALE ANNE G.",
    "unitId": "LA-0605",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 450000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.02,
      "commission": 9000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1800.0,
      "secondRelease40": 1800.0,
      "thirdRelease60": 1800.0,
      "fourthRelease75": 1350.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0.0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 22500.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 4500.0,
      "secondRelease40": 4500.0,
      "thirdRelease60": 4500.0,
      "fourthRelease75": 3375.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 700.0,
    "date": "08/08/2025"
  },
  {
    "buyer": "NEPOMUCENO, ERWIN",
    "unitId": "LA-0901",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 450000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.02,
      "commission": 9000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1800.0,
      "secondRelease40": 1800.0,
      "thirdRelease60": 1800.0,
      "fourthRelease75": 1350.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "NEPOMUCENO, ERWIN",
      "rate": 0.05,
      "commission": 22500.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 4500.0,
      "secondRelease40": 4500.0,
      "thirdRelease60": 4500.0,
      "fourthRelease75": 3375.0,
      "retention25": 5625.0,
      "totalReceivedPercent": 1.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 700.0,
    "date": "08/08/2025"
  },
  {
    "buyer": "AURE, ALICIA ALEGRE",
    "unitId": "LA-0708 & LA-0710 (COMBINED)",
    "mode": "CASH",
    "area": 600.0,
    "pricePerSqm": 2000.0,
    "netSellingPrice": 1200000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.02,
      "commission": 24000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 4800.0,
      "secondRelease40": 4800.0,
      "thirdRelease60": 4800.0,
      "fourthRelease75": 3600.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "GARCIA, JHOYCE",
      "rate": 0.05,
      "commission": 60000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 12000.0,
      "secondRelease40": 12000.0,
      "thirdRelease60": 12000.0,
      "fourthRelease75": 9000.0,
      "retention25": 15000.0,
      "totalReceivedPercent": 1.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "ORDO\u00d1EZ, LEONISA G.",
    "unitId": "LA-0417 (END) *A",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 450000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 9000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.05,
      "commission": 22500.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 700.0,
    "date": "08/05/2025"
  },
  {
    "buyer": "MANGLALLAN, JEMMABEL G.",
    "unitId": "LA-0417 (END) *B",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1500.0,
    "netSellingPrice": 450000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 9000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.05,
      "commission": 22500.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "VILLEGAS, STEVE RANDY N.",
    "unitId": "LA-0705",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 2200.0,
    "netSellingPrice": 660000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.02,
      "commission": 13200.0,
      "paymentPercentage": 0.455559090909091,
      "firstRelease20": 2640.0,
      "secondRelease40": 2640.0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.4,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "SUMASTRE, GEMALENE",
      "rate": 0.05,
      "commission": 33000.0,
      "paymentPercentage": 0.455559090909091,
      "firstRelease20": 6600.0,
      "secondRelease40": 6600.0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.4,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "GOMEZ, BRYAN ANTAZO",
    "unitId": "LA-0604",
    "mode": "CASH",
    "area": 1200.0,
    "pricePerSqm": 1700.0,
    "netSellingPrice": 2040000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.02,
      "commission": 40800.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 8160.0,
      "secondRelease40": 8160.0,
      "thirdRelease60": 8160.0,
      "fourthRelease75": 6120.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 102000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 20400.0,
      "secondRelease40": 20400.0,
      "thirdRelease60": 20400.0,
      "fourthRelease75": 15300.0,
      "retention25": 9030.0,
      "totalReceivedPercent": 0.838529411764706,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0703",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1400.0,
    "netSellingPrice": 420000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 8400.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 1680.0,
      "secondRelease40": 1680.0,
      "thirdRelease60": 1680.0,
      "fourthRelease75": 1260.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "RIL, AUNDRIA ATONIO",
      "rate": 0.05,
      "commission": 21000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 4200.0,
      "secondRelease40": 4200.0,
      "thirdRelease60": 4200.0,
      "fourthRelease75": 3150.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 2100.0,
    "date": "11/04/2025"
  },
  {
    "buyer": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1208 (NEW)",
    "mode": "CASH",
    "area": 327.0,
    "pricePerSqm": 1400.0,
    "netSellingPrice": 457800.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.02,
      "commission": 9156.0,
      "paymentPercentage": 1.0,
      "firstRelease20": 1831.2,
      "secondRelease40": 1831.2,
      "thirdRelease60": 1831.2,
      "fourthRelease75": 1373.4,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "GELUZ, JEFFERSON A.",
      "rate": 0.05,
      "commission": 22890.0,
      "paymentPercentage": 1.0,
      "firstRelease20": 4578.0,
      "secondRelease40": 4578.0,
      "thirdRelease60": 4578.0,
      "fourthRelease75": 3433.5,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1207 (NEW)",
    "mode": "CASH",
    "area": 327.0,
    "pricePerSqm": 1400.0,
    "netSellingPrice": 457800.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.02,
      "commission": 9156.0,
      "paymentPercentage": 0.0218435998252512,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "GELUZ, JEFFERSON A.",
      "rate": 0.05,
      "commission": 22890.0,
      "paymentPercentage": 0.0218435998252512,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "GELUZ, CONRADO JR, A.",
    "unitId": "LA-1205 (NEW)",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1400.0,
    "netSellingPrice": 420000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.02,
      "commission": 8400.0,
      "paymentPercentage": 1.0,
      "firstRelease20": 1680.0,
      "secondRelease40": 1680.0,
      "thirdRelease60": 1680.0,
      "fourthRelease75": 1260.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "GELUZ, JEFFERSON A.",
      "rate": 0.05,
      "commission": 21000.0,
      "paymentPercentage": 1.0,
      "firstRelease20": 4200.0,
      "secondRelease40": 4200.0,
      "thirdRelease60": 4200.0,
      "fourthRelease75": 3150.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "JANDUSAY, JOHN WENDELL F.",
    "unitId": "LA-0801 (NEW)",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 2200.0,
    "netSellingPrice": 660000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.02,
      "commission": 13200.0,
      "paymentPercentage": 0.0,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "DETRUZ, FLORIAN A.",
      "rate": 0.05,
      "commission": 33000.0,
      "paymentPercentage": 0.0,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "AHMED, SARAH NACINO",
    "unitId": "LA-0414 & LA-0415",
    "mode": "CASH",
    "area": 600.0,
    "pricePerSqm": 1800.0,
    "netSellingPrice": 1080000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.02,
      "commission": 21600.0,
      "paymentPercentage": 0.237037037037037,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "BRIONES, CONIE A.",
      "rate": 0.05,
      "commission": 54000.0,
      "paymentPercentage": 0.237037037037037,
      "firstRelease20": 10800.0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.2,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "ISO, DENMARK S.",
    "unitId": "LA-0408 & LA 0409",
    "mode": "INSTALLMENT",
    "area": 600.0,
    "pricePerSqm": 1400.0,
    "netSellingPrice": 840000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "HERNANDEZ, JULIE ANN",
      "rate": 0.02,
      "commission": 16800.0,
      "paymentPercentage": 1.0,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "VINLUAN, MA. ANGELICA L.",
      "rate": 0.05,
      "commission": 42000.0,
      "paymentPercentage": 1.0,
      "firstRelease20": 8400.0,
      "secondRelease40": 8400.0,
      "thirdRelease60": 8400.0,
      "fourthRelease75": 6300.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "DE CHAVEZ, MARIA ANGELICA G.",
    "unitId": "LA-1207 (NEW)",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1600.0,
    "netSellingPrice": 480000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 9600.0,
      "paymentPercentage": 1.0,
      "firstRelease20": 1920.0,
      "secondRelease40": 1920.0,
      "thirdRelease60": 1920.0,
      "fourthRelease75": 1440.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "RIOJA, KIRSTEN JHOYCE A.",
      "rate": 0.05,
      "commission": 24000.0,
      "paymentPercentage": 1.0,
      "firstRelease20": 4800.0,
      "secondRelease40": 4800.0,
      "thirdRelease60": 4800.0,
      "fourthRelease75": 3600.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "CHRISTINE B. BOLISAY",
    "unitId": "LA-0411 & LA-0412 (NEW)",
    "mode": "CASH",
    "area": 600.0,
    "pricePerSqm": 1600.0,
    "netSellingPrice": 960000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 19200.0,
      "paymentPercentage": 1.0,
      "firstRelease20": 3840.0,
      "secondRelease40": 3840.0,
      "thirdRelease60": 3840.0,
      "fourthRelease75": 2880.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "RIOJA, KIRSTEN JHOYCE A.",
      "rate": 0.05,
      "commission": 48000.0,
      "paymentPercentage": 1.0,
      "firstRelease20": 9600.0,
      "secondRelease40": 9600.0,
      "thirdRelease60": 9600.0,
      "fourthRelease75": 7200.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "BACUS, ERLOVE",
    "unitId": "LA-1209 (NEW)",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1800.0,
    "netSellingPrice": 540000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 10800.0,
      "paymentPercentage": 0.203703703703704,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "QUINTO, GRACE T.",
      "rate": 0.05,
      "commission": 27000.0,
      "paymentPercentage": 0.203703703703704,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "REGIS, GERALDINE O.",
    "unitId": "LA-0410 (NEW)",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1800.0,
    "netSellingPrice": 540000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 10800.0,
      "paymentPercentage": 0.0925925925925926,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "RIOJA, KIRSTEN JHOYCE A.",
      "rate": 0.05,
      "commission": 27000.0,
      "paymentPercentage": 0.0925925925925926,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "CODON, MA. CZARINA A.",
    "unitId": "LA-0407 (NEW)",
    "mode": "INSTALLMENT",
    "area": 300.0,
    "pricePerSqm": 1800.0,
    "netSellingPrice": 540000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 10800.0,
      "paymentPercentage": 0.183333333333333,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "RIOJA, KIRSTEN JHOYCE A.",
      "rate": 0.05,
      "commission": 27000.0,
      "paymentPercentage": 0.183333333333333,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "SALONGA, EDWIN L.",
    "unitId": "LA-1203 & LA-1204 (NEW)",
    "mode": "INSTALLMENT",
    "area": 600.0,
    "pricePerSqm": 1600.0,
    "netSellingPrice": 960000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "CORTEZ, ROWENA",
      "rate": 0.03,
      "commission": 28800.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 5760.0,
      "secondRelease40": 5760.0,
      "thirdRelease60": 5760.0,
      "fourthRelease75": 4320.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "AVILA, KRISHTINA A.",
      "rate": 0.05,
      "commission": 48000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 9600.0,
      "secondRelease40": 9600.0,
      "thirdRelease60": 9600.0,
      "fourthRelease75": 7200.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "GERMANO, ERICO C. JR",
    "unitId": "LA-0704 (NEW)",
    "mode": "CASH",
    "area": 311.0,
    "pricePerSqm": 1700.0,
    "netSellingPrice": 528700.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 10574.0,
      "paymentPercentage": 0.18511443162474,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "RIOJA, KIRSTEN JHOYCE A.",
      "rate": 0.05,
      "commission": 26435.0,
      "paymentPercentage": 0.18511443162474,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "CABALIDA, MADELYN G.",
    "unitId": "LA-0201",
    "mode": "CASH",
    "area": 400.0,
    "pricePerSqm": 1600.0,
    "netSellingPrice": 640000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.02,
      "commission": 12800.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 2560.0,
      "secondRelease40": 2560.0,
      "thirdRelease60": 2560.0,
      "fourthRelease75": 1920.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 32000.0,
      "paymentPercentage": 1.1,
      "firstRelease20": 6400.0,
      "secondRelease40": 6400.0,
      "thirdRelease60": 6400.0,
      "fourthRelease75": 4800.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "LOMAN, KURT ERNEST M.",
    "unitId": "LA-0405 & LA-0406",
    "mode": "INSTALLMENT",
    "area": 600.0,
    "pricePerSqm": 1800.0,
    "netSellingPrice": 1080000.0,
    "saleType": "DISTRIBUTED",
    "manager": {
      "name": "SARTE, JOHN CHRISTOPHER",
      "rate": 0.02,
      "commission": 21600.0,
      "paymentPercentage": 0.0989814814814815,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "RUSIT, ERIC",
      "rate": 0.05,
      "commission": 54000.0,
      "paymentPercentage": 0.0989814814814815,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "MEDILO, LARRY D.",
    "unitId": "LA-0502",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1900.0,
    "netSellingPrice": 570000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "TESORO, FRITZGERARD",
      "rate": 0.02,
      "commission": 11400.0,
      "paymentPercentage": 1.0,
      "firstRelease20": 2280.0,
      "secondRelease40": 2280.0,
      "thirdRelease60": 2280.0,
      "fourthRelease75": 1710.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "RIOJA, KIRSTEN JHOYCE A.",
      "rate": 0.05,
      "commission": 28500.0,
      "paymentPercentage": 1.0,
      "firstRelease20": 5700.0,
      "secondRelease40": 5700.0,
      "thirdRelease60": 5700.0,
      "fourthRelease75": 4275.0,
      "retention25": 0,
      "totalReceivedPercent": 0.75,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  },
  {
    "buyer": "MICHELLE C. SAQUILAYAN",
    "unitId": "LA-1208 (NEW)",
    "mode": "CASH",
    "area": 300.0,
    "pricePerSqm": 1900.0,
    "netSellingPrice": 570000.0,
    "saleType": "DIRECT",
    "manager": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.02,
      "commission": 11400.0,
      "paymentPercentage": 0.087719298245614,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "agent": {
      "name": "PARROCHO, JOSEPH",
      "rate": 0.05,
      "commission": 28500.0,
      "paymentPercentage": 0.087719298245614,
      "firstRelease20": 0,
      "secondRelease40": 0,
      "thirdRelease60": 0,
      "fourthRelease75": 0,
      "retention25": 0,
      "totalReceivedPercent": 0.0,
      "totalRemaining": 0,
      "cashAdvance": 0
    },
    "cashKaliwaan": 0,
    "date": ""
  }
]

const canonicalPaymentDetails: PaymentDetail[] = [
  {
    "unitId": "LA-0204",
    "buyer": "SILVA, ISABEL LAYUG L.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "JANUARY",
        "amount": 410000.0
      },
      {
        "period": "FEBRUARY",
        "amount": 80600.0
      }
    ],
    "paymentMade": 490600.0,
    "totalContractPrice": 490600.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 1.0,
    "fr": ""
  },
  {
    "unitId": "LA-0401",
    "buyer": "RABAGO, ELIZABETH L.",
    "mode": "INSTALLMENT",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "JANUARY",
        "amount": 20000.0
      },
      {
        "period": "MARCH",
        "amount": 36266.0
      },
      {
        "period": "FEB",
        "amount": 598934.0
      }
    ],
    "paymentMade": 655200.0,
    "totalContractPrice": 655200.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0403",
    "buyer": "CABISON, AVA MAXINE E.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "JANUARY",
        "amount": 330000.0
      }
    ],
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0404",
    "buyer": "CABISON, SOPHIA CLAIRE E.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "JANUARY",
        "amount": 330000.0
      }
    ],
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0103",
    "buyer": "AQUINO, JAYMILYN BERNARDO",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "JANUARY",
        "amount": 512600.0
      }
    ],
    "paymentMade": 512600.0,
    "totalContractPrice": 512600.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 1.0,
    "fr": ""
  },
  {
    "unitId": "LA-0416",
    "buyer": "DIZON, ELORA ANDREI",
    "mode": "INSTALLMENT",
    "dueDay": "28th",
    "monthlyPayments": [
      {
        "period": "JANUARY",
        "amount": 10000.0
      },
      {
        "period": "FEBRUARY",
        "amount": 100640.0
      },
      {
        "period": "MARCH",
        "amount": 15400.0
      },
      {
        "period": "APRIL",
        "amount": 15400.0
      },
      {
        "period": "MAY",
        "amount": 15400.0
      },
      {
        "period": "JUNE",
        "amount": 15400.0
      },
      {
        "period": "JULY",
        "amount": 15400.0
      },
      {
        "period": "AUGUST",
        "amount": 15400.0
      },
      {
        "period": "SEPTEMBER",
        "amount": 15400.0
      },
      {
        "period": "OCTOBER",
        "amount": 15400.0
      },
      {
        "period": "NOVEMBER",
        "amount": 15400.0
      },
      {
        "period": "DECEMBER",
        "amount": 15400.0
      },
      {
        "period": "JAN",
        "amount": 15400.0
      },
      {
        "period": "FEB",
        "amount": 15400.0
      },
      {
        "period": "MAR",
        "amount": 15400.0
      },
      {
        "period": "APR",
        "amount": 15400.0
      },
      {
        "period": "MAY",
        "amount": 15400.0
      }
    ],
    "paymentMade": 341640.0,
    "totalContractPrice": 396000.0,
    "balance": 54360.0,
    "paymentPercentage": 0.949,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0101",
    "buyer": "DACAYO, JENNIFER MOROJO",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "JANUARY",
        "amount": 10000.0
      },
      {
        "period": "FEBRUARY",
        "amount": 320000.0
      }
    ],
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0201 (1.1)",
    "buyer": "CAMANTIGUE, ESTELISA V.",
    "mode": "INSTALLMENT",
    "dueDay": "10th",
    "monthlyPayments": [
      {
        "period": "JANUARY",
        "amount": 10000.0
      },
      {
        "period": "MARCH",
        "amount": 18133.0
      },
      {
        "period": "APRIL",
        "amount": 18133.0
      },
      {
        "period": "MAY",
        "amount": 18133.0
      },
      {
        "period": "JUNE",
        "amount": 18133.0
      },
      {
        "period": "JULY",
        "amount": 18133.0
      },
      {
        "period": "AUGUST",
        "amount": 18133.0
      },
      {
        "period": "SEPTEMBER",
        "amount": 15400.0
      },
      {
        "period": "OCTOBER",
        "amount": 15400.0
      },
      {
        "period": "NOVEMBER",
        "amount": 15400.0
      },
      {
        "period": "DECEMBER",
        "amount": 15400.0
      },
      {
        "period": "JAN",
        "amount": 15400.0
      },
      {
        "period": "FEB",
        "amount": 15400.0
      },
      {
        "period": "MAR",
        "amount": 15400.0
      },
      {
        "period": "APR",
        "amount": 15400.0
      }
    ],
    "paymentMade": 241998.0,
    "totalContractPrice": 396000.0,
    "balance": 154002.0,
    "paymentPercentage": 0.672216666666667,
    "commissionReleasedPercent": 0.6,
    "fr": "22"
  },
  {
    "unitId": "LA-0203",
    "buyer": "RAMIREZ, PRINCE RUPERT",
    "mode": "INSTALLMENT",
    "dueDay": "15th",
    "monthlyPayments": [
      {
        "period": "FEBRUARY",
        "amount": 30000.0
      },
      {
        "period": "MARCH",
        "amount": 54400.0
      },
      {
        "period": "APRIL",
        "amount": 54400.0
      },
      {
        "period": "JULY",
        "amount": 232599.0
      },
      {
        "period": "AUGUST",
        "amount": 77533.0
      },
      {
        "period": "SEPTEMBER",
        "amount": 61600.0
      },
      {
        "period": "OCTOBER",
        "amount": 61600.0
      },
      {
        "period": "NOVEMBER",
        "amount": 61600.0
      },
      {
        "period": "DECEMBER",
        "amount": 61600.0
      },
      {
        "period": "JAN",
        "amount": 61600.0
      },
      {
        "period": "FEB",
        "amount": 61600.0
      }
    ],
    "paymentMade": 818532.0,
    "totalContractPrice": 1584000.0,
    "balance": 765468.0,
    "paymentPercentage": 0.568425,
    "commissionReleasedPercent": 0.285714285714286,
    "fr": ""
  },
  {
    "unitId": "LA-0305 LA0306 & LA-0307 COMBINED",
    "buyer": "RUSIT, ERIC C.",
    "mode": "INSTALLMENT",
    "dueDay": "20th",
    "monthlyPayments": [
      {
        "period": "FEBRUARY",
        "amount": 30000.0
      },
      {
        "period": "MARCH",
        "amount": 77533.0
      },
      {
        "period": "APRIL",
        "amount": 77533.0
      },
      {
        "period": "JULY",
        "amount": 163200.0
      },
      {
        "period": "AUGUST",
        "amount": 54400.0
      },
      {
        "period": "SEPTEMBER",
        "amount": 46200.0
      },
      {
        "period": "OCTOBER",
        "amount": 46200.0
      },
      {
        "period": "NOVEMBER",
        "amount": 46200.0
      },
      {
        "period": "DECEMBER",
        "amount": 46200.0
      },
      {
        "period": "JAN",
        "amount": 46200.0
      },
      {
        "period": "FEB",
        "amount": 46200.0
      },
      {
        "period": "MAR",
        "amount": 46200.0
      }
    ],
    "paymentMade": 726066.0,
    "totalContractPrice": 1188000.0,
    "balance": 461934.0,
    "paymentPercentage": 0.672283333333333,
    "commissionReleasedPercent": 0.6,
    "fr": ""
  },
  {
    "unitId": "LA-0408",
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "FEBRUARY",
        "amount": 330000.0
      }
    ],
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0410",
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "FEBRUARY",
        "amount": 330000.0
      }
    ],
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0405",
    "buyer": "BORAC, LARRY S.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "FEBRUARY",
        "amount": 330000.0
      }
    ],
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0412 & LA-0414 COMBINED",
    "buyer": "OCAMPO, RACQUEL",
    "mode": "INSTALLMENT",
    "dueDay": "10th",
    "monthlyPayments": [
      {
        "period": "FEBRUARY",
        "amount": 10000.0
      },
      {
        "period": "MARCH",
        "amount": 37933.0
      },
      {
        "period": "APRIL",
        "amount": 37933.0
      },
      {
        "period": "MAY",
        "amount": 37933.0
      },
      {
        "period": "JUNE",
        "amount": 37933.0
      },
      {
        "period": "JULY",
        "amount": 37933.0
      },
      {
        "period": "AUGUST",
        "amount": 37933.0
      },
      {
        "period": "SEPTEMBER",
        "amount": 30000.0
      },
      {
        "period": "OCTOBER",
        "amount": 30000.0
      },
      {
        "period": "NOVEMBER",
        "amount": 30000.0
      },
      {
        "period": "DECEMBER",
        "amount": 30000.0
      },
      {
        "period": "JAN",
        "amount": 30000.0
      },
      {
        "period": "FEB",
        "amount": 30000.0
      },
      {
        "period": "MAR",
        "amount": 29000.0
      }
    ],
    "paymentMade": 446598.0,
    "totalContractPrice": 792000.0,
    "balance": 345402.0,
    "paymentPercentage": 0.620275,
    "commissionReleasedPercent": 0.0,
    "fr": ""
  },
  {
    "unitId": "LA-0406",
    "buyer": "CABISON, CHERRY MAE E.",
    "mode": "INSTALLMENT",
    "dueDay": "19th",
    "monthlyPayments": [
      {
        "period": "FEBRUARY",
        "amount": 10000.0
      },
      {
        "period": "MARCH",
        "amount": 50000.0
      }
    ],
    "paymentMade": 60000.0,
    "totalContractPrice": 330000.0,
    "balance": 270000.0,
    "paymentPercentage": 0.2,
    "commissionReleasedPercent": 0.0,
    "fr": ""
  },
  {
    "unitId": "LA-0407",
    "buyer": "DE LEON, CARMINA VICTORIA",
    "mode": "INSTALLMENT",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "FEBRUARY",
        "amount": 10000.0
      },
      {
        "period": "MARCH",
        "amount": 36266.0
      },
      {
        "period": "APRIL",
        "amount": 36266.0
      },
      {
        "period": "MAY",
        "amount": 36266.0
      },
      {
        "period": "JUNE",
        "amount": 15400.0
      },
      {
        "period": "JULY",
        "amount": 15400.0
      },
      {
        "period": "AUGUST",
        "amount": 15400.0
      },
      {
        "period": "SEPTEMBER",
        "amount": 15400.0
      },
      {
        "period": "OCTOBER",
        "amount": 15400.0
      },
      {
        "period": "NOVEMBER",
        "amount": 15400.0
      },
      {
        "period": "DECEMBER",
        "amount": 15400.0
      },
      {
        "period": "JAN",
        "amount": 15400.0
      },
      {
        "period": "FEB",
        "amount": 15400.0
      },
      {
        "period": "MAR",
        "amount": 15400.0
      },
      {
        "period": "APR",
        "amount": 15400.0
      }
    ],
    "paymentMade": 288198.0,
    "totalContractPrice": 396000.0,
    "balance": 107802.0,
    "paymentPercentage": 0.80055,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0411",
    "buyer": "TUBORO, MARILOU GRIMALDO",
    "mode": "CASH",
    "dueDay": "28th",
    "monthlyPayments": [
      {
        "period": "FEBRUARY",
        "amount": 10000.0
      },
      {
        "period": "MARCH",
        "amount": 320000.0
      }
    ],
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0409",
    "buyer": "DE LEON, CHARLENE MAE T.",
    "mode": "INSTALLMENT",
    "dueDay": "28th",
    "monthlyPayments": [
      {
        "period": "FEBRUARY",
        "amount": 10000.0
      },
      {
        "period": "MARCH",
        "amount": 36266.0
      },
      {
        "period": "APRIL",
        "amount": 36266.0
      },
      {
        "period": "MAY",
        "amount": 36266.0
      },
      {
        "period": "JUNE",
        "amount": 15400.0
      },
      {
        "period": "JULY",
        "amount": 15400.0
      },
      {
        "period": "AUGUST",
        "amount": 15400.0
      },
      {
        "period": "SEPTEMBER",
        "amount": 15400.0
      },
      {
        "period": "OCTOBER",
        "amount": 15400.0
      },
      {
        "period": "NOVEMBER",
        "amount": 15400.0
      },
      {
        "period": "DECEMBER",
        "amount": 15400.0
      },
      {
        "period": "JAN",
        "amount": 15400.0
      },
      {
        "period": "FEB",
        "amount": 15400.0
      },
      {
        "period": "MAR",
        "amount": 15400.0
      },
      {
        "period": "APR",
        "amount": 15400.0
      }
    ],
    "paymentMade": 288198.0,
    "totalContractPrice": 396000.0,
    "balance": 107802.0,
    "paymentPercentage": 0.80055,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0108 (CORNER) A",
    "buyer": "SIAZON, JEFFERSON C.",
    "mode": "INSTALLMENT",
    "dueDay": "15th",
    "monthlyPayments": [
      {
        "period": "FEBRUARY",
        "amount": 10000.0
      },
      {
        "period": "APRIL",
        "amount": 40000.0
      },
      {
        "period": "MAY",
        "amount": 40000.0
      },
      {
        "period": "JUNE",
        "amount": 40000.0
      },
      {
        "period": "AUGUST",
        "amount": 596000.0
      }
    ],
    "paymentMade": 726000.0,
    "totalContractPrice": 726000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0304",
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "FEBRUARY",
        "amount": 330000.0
      }
    ],
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0413",
    "buyer": "SALAMAT, ANTONIO, MIGUEL",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "FEBRUARY",
        "amount": 100000.0
      },
      {
        "period": "MARCH",
        "amount": 230000.0
      }
    ],
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 1.0,
    "fr": ""
  },
  {
    "unitId": "LA-0415",
    "buyer": "COMIA, GRAZELYN M.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "FEBRUARY",
        "amount": 100000.0
      },
      {
        "period": "MARCH",
        "amount": 230000.0
      }
    ],
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 1.0,
    "fr": ""
  },
  {
    "unitId": "LA-0718",
    "buyer": "GULLA, SHERYL",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MARCH",
        "amount": 330000.0
      }
    ],
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "COMBINED: LA-0501 & LA-0502",
    "buyer": "DE SAN PERDRO, JOHN MHELCON",
    "mode": "INSTALLMENT",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MARCH",
        "amount": 210000.0
      },
      {
        "period": "APRIL",
        "amount": 140000.0
      },
      {
        "period": "MAY",
        "amount": 60000.0
      },
      {
        "period": "JUNE",
        "amount": 50000.0
      },
      {
        "period": "JULY",
        "amount": 60000.0
      },
      {
        "period": "AUGUST",
        "amount": 140000.0
      }
    ],
    "paymentMade": 660000.0,
    "totalContractPrice": 660000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.285714285714286,
    "fr": ""
  },
  {
    "unitId": "LA-0302",
    "buyer": "GARCIA, JANICE M.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MARCH",
        "amount": 10000.0
      },
      {
        "period": "APRIL",
        "amount": 430000.0
      }
    ],
    "paymentMade": 440000.0,
    "totalContractPrice": 440000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0417 (CORNER)",
    "buyer": "CHANG, IMELDA A.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MARCH",
        "amount": 330000.0
      }
    ],
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0108 (INNER) B",
    "buyer": "BAGAOISAN, LILIA A.",
    "mode": "INSTALLMENT",
    "dueDay": "28th",
    "monthlyPayments": [
      {
        "period": "MARCH",
        "amount": 10000.0
      },
      {
        "period": "AUGUST",
        "amount": 353000.0
      }
    ],
    "paymentMade": 363000.0,
    "totalContractPrice": 363000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0108 (END) C",
    "buyer": "TAYLOR, WENDY B.",
    "mode": "INSTALLMENT",
    "dueDay": "15th",
    "monthlyPayments": [
      {
        "period": "MARCH",
        "amount": 10000.0
      },
      {
        "period": "AUGUST",
        "amount": 353000.0
      }
    ],
    "paymentMade": 363000.0,
    "totalContractPrice": 363000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-1201 (CORNER)",
    "buyer": "JOHNSON, CHERRY F.",
    "mode": "CASH",
    "dueDay": "17th",
    "monthlyPayments": [
      {
        "period": "MARCH",
        "amount": 10000.0
      },
      {
        "period": "APRIL",
        "amount": 43000.0
      }
    ],
    "paymentMade": 53000.0,
    "totalContractPrice": 882750.0,
    "balance": 829750.0,
    "paymentPercentage": 0.0660436137071651,
    "commissionReleasedPercent": 0.0,
    "fr": ""
  },
  {
    "unitId": "LA-1205",
    "buyer": "RICO, MAY LYN B.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MARCH",
        "amount": 2520000.0
      }
    ],
    "paymentMade": 2520000.0,
    "totalContractPrice": 2520000.0,
    "balance": 0.0,
    "paymentPercentage": 1.05,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-1205",
    "buyer": "RICO, MAY LYN B.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MARCH",
        "amount": 946000.0
      }
    ],
    "paymentMade": 946000.0,
    "totalContractPrice": 946000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-1105",
    "buyer": "PERALTA, GERRY Q.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MARCH",
        "amount": 10000.0
      },
      {
        "period": "APRIL",
        "amount": 357400.0
      }
    ],
    "paymentMade": 367400.0,
    "totalContractPrice": 367400.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0205",
    "buyer": "LAYUG, EDWARD JO S.",
    "mode": "INSTALLMENT",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MARCH",
        "amount": 10000.0
      }
    ],
    "paymentMade": 10000.0,
    "totalContractPrice": 396000.0,
    "balance": 386000.0,
    "paymentPercentage": 0.0277777777777778,
    "commissionReleasedPercent": 0.0,
    "fr": ""
  },
  {
    "unitId": "LA-1201 (INNER)",
    "buyer": "HATEM, HANNOUSH MARC ANDREEI B.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MARCH",
        "amount": 10000.0
      },
      {
        "period": "APRIL",
        "amount": 573000.0
      }
    ],
    "paymentMade": 583000.0,
    "totalContractPrice": 583000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-1202 (CORNER)",
    "buyer": "MIRADOR, LEO M.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MARCH",
        "amount": 588500.0
      }
    ],
    "paymentMade": 588500.0,
    "totalContractPrice": 588500.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-1202 (END)",
    "buyer": "MIRADOR, LEO M.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MARCH",
        "amount": 583000.0
      }
    ],
    "paymentMade": 583000.0,
    "totalContractPrice": 583000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-1103",
    "buyer": "BELIGON, ERDELYN F.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MARCH",
        "amount": 10000.0
      },
      {
        "period": "JUNE",
        "amount": 320000.0
      }
    ],
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0719",
    "buyer": "MORIONES, CHERRY",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "APRIL",
        "amount": 330000.0
      }
    ],
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0602",
    "buyer": "MAGORA, JOANNA MARIE",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "APRIL",
        "amount": 10000.0
      },
      {
        "period": "MAY",
        "amount": 463000.0
      }
    ],
    "paymentMade": 473000.0,
    "totalContractPrice": 473000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0603",
    "buyer": "ALCASABAS, ROMEO ESO",
    "mode": "INSTALLMENT",
    "dueDay": "30th",
    "monthlyPayments": [
      {
        "period": "APRIL",
        "amount": 10000.0
      },
      {
        "period": "MAY",
        "amount": 90000.0
      },
      {
        "period": "JUNE",
        "amount": 90000.0
      },
      {
        "period": "JULY",
        "amount": 90000.0
      },
      {
        "period": "AUGUST",
        "amount": 59167.0
      },
      {
        "period": "SEPTEMBER",
        "amount": 59167.0
      }
    ],
    "paymentMade": 398334.0,
    "totalContractPrice": 990000.0,
    "balance": 591666.0,
    "paymentPercentage": 0.442593333333333,
    "commissionReleasedPercent": 0.4,
    "fr": ""
  },
  {
    "unitId": "LA-0604",
    "buyer": "ARGETE, RICHELL",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "APRIL",
        "amount": 170000.0
      },
      {
        "period": "MAY",
        "amount": 160000.0
      }
    ],
    "paymentMade": 330000.0,
    "totalContractPrice": 330000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0504",
    "buyer": "ALITAGTAG, RIZZ ANN",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "APRIL",
        "amount": 396000.0
      }
    ],
    "paymentMade": 396000.0,
    "totalContractPrice": 396000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0503",
    "buyer": "ALITAGTAG, RIZZ ANN",
    "mode": "INSTALLMENT",
    "dueDay": "16th",
    "monthlyPayments": [
      {
        "period": "APRIL",
        "amount": 10000.0
      },
      {
        "period": "MAY",
        "amount": 40417.0
      },
      {
        "period": "JUNE",
        "amount": 40417.0
      },
      {
        "period": "JULY",
        "amount": 40417.0
      },
      {
        "period": "AUGUST",
        "amount": 40417.0
      },
      {
        "period": "SEPTEMBER",
        "amount": 40417.0
      },
      {
        "period": "OCTOBER",
        "amount": 40417.0
      },
      {
        "period": "NOVEMBER",
        "amount": 40417.0
      },
      {
        "period": "DECEMBER",
        "amount": 40417.0
      },
      {
        "period": "JAN",
        "amount": 40417.0
      },
      {
        "period": "FEB",
        "amount": 40417.0
      },
      {
        "period": "MAR",
        "amount": 40417.0
      },
      {
        "period": "APR",
        "amount": 40413.0
      }
    ],
    "paymentMade": 495000.0,
    "totalContractPrice": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0612",
    "buyer": "DERILO, GENEVIEVE O.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "APRIL",
        "amount": 330000.0
      },
      {
        "period": "MAY",
        "amount": 55000.0
      }
    ],
    "paymentMade": 385000.0,
    "totalContractPrice": 385000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0613",
    "buyer": "OLANO, ALLAN RAYMUND P.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "APRIL",
        "amount": 330000.0
      },
      {
        "period": "MAY",
        "amount": 156200.0
      }
    ],
    "paymentMade": 486200.0,
    "totalContractPrice": 486200.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0704",
    "buyer": "RIL, AUNDRIA ANTONIO",
    "mode": "INSTALLMENT",
    "dueDay": "19th",
    "monthlyPayments": [
      {
        "period": "APRIL",
        "amount": 137362.5
      },
      {
        "period": "JUNE",
        "amount": 20000.0
      },
      {
        "period": "JULY",
        "amount": 20000.0
      },
      {
        "period": "AUGUST",
        "amount": 20000.0
      },
      {
        "period": "SEPTEMBER",
        "amount": 20000.0
      },
      {
        "period": "OCTOBER",
        "amount": 20000.0
      },
      {
        "period": "NOVEMBER",
        "amount": 20000.0
      },
      {
        "period": "DECEMBER",
        "amount": 20000.0
      },
      {
        "period": "JAN",
        "amount": 20000.0
      },
      {
        "period": "FEB",
        "amount": 20000.0
      },
      {
        "period": "MAR",
        "amount": 20000.0
      },
      {
        "period": "APR",
        "amount": 20000.0
      },
      {
        "period": "MAY",
        "amount": 20000.0
      },
      {
        "period": "JUN",
        "amount": 20000.0
      }
    ],
    "paymentMade": 397362.5,
    "totalContractPrice": 495000.0,
    "balance": 97637.5,
    "paymentPercentage": 0.883027777777778,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0610",
    "buyer": "PANGHULAN, RUTH Q.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "APRIL",
        "amount": 10000.0
      },
      {
        "period": "MAY",
        "amount": 452000.0
      }
    ],
    "paymentMade": 462000.0,
    "totalContractPrice": 462000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0703 & LA-0705 COMBINED",
    "buyer": "ARAYATA, RICHELLE C.",
    "mode": "CASH",
    "dueDay": "26th",
    "monthlyPayments": [
      {
        "period": "APRIL",
        "amount": 50000.0
      }
    ],
    "paymentMade": 50000.0,
    "totalContractPrice": 792000.0,
    "balance": 742000.0,
    "paymentPercentage": 0.0694444444444444,
    "commissionReleasedPercent": 0.0,
    "fr": ""
  },
  {
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "buyer": "ALAMER, JAZZIE",
    "mode": "INSTALLMENT",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "APRIL",
        "amount": 20000.0
      },
      {
        "period": "MAY",
        "amount": 255000.0
      },
      {
        "period": "JUNE",
        "amount": 38500.0
      },
      {
        "period": "JULY",
        "amount": 38500.0
      },
      {
        "period": "AUGUST",
        "amount": 38500.0
      },
      {
        "period": "SEPTEMBER",
        "amount": 38500.0
      },
      {
        "period": "OCTOBER",
        "amount": 38500.0
      },
      {
        "period": "NOVEMBER",
        "amount": 38500.0
      },
      {
        "period": "DECEMBER",
        "amount": 38500.0
      },
      {
        "period": "JAN",
        "amount": 38500.0
      },
      {
        "period": "FEB",
        "amount": 38500.0
      },
      {
        "period": "MAR",
        "amount": 38500.0
      },
      {
        "period": "APR",
        "amount": 38500.0
      },
      {
        "period": "MAY",
        "amount": 38500.0
      },
      {
        "period": "JUN",
        "amount": 38500.0
      }
    ],
    "paymentMade": 775500.0,
    "totalContractPrice": 990000.0,
    "balance": 214500.0,
    "paymentPercentage": 0.861666666666667,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0707 (INNER)",
    "buyer": "ORAPA, LOUEL M.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MAY",
        "amount": 10000.0
      },
      {
        "period": "JULY",
        "amount": 386000.0
      }
    ],
    "paymentMade": 396000.0,
    "totalContractPrice": 396000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0709 & LA-0711 COMBINED",
    "buyer": "ORAPA, MARILOU",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MAY",
        "amount": 10000.0
      },
      {
        "period": "JULY",
        "amount": 782000.0
      }
    ],
    "paymentMade": 792000.0,
    "totalContractPrice": 792000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0713",
    "buyer": "MIRASOL, ROSARIO L.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MAY",
        "amount": 10000.0
      },
      {
        "period": "JULY",
        "amount": 386000.0
      }
    ],
    "paymentMade": 396000.0,
    "totalContractPrice": 396000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0715",
    "buyer": "FABABIER, ANNABELLE B.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "JUNE",
        "amount": 10000.0
      },
      {
        "period": "JULY",
        "amount": 386000.0
      }
    ],
    "paymentMade": 396000.0,
    "totalContractPrice": 396000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0303",
    "buyer": "CANTOR, VIEN QUINA",
    "mode": "INSTALLMENT",
    "dueDay": "1st",
    "monthlyPayments": [
      {
        "period": "MAY",
        "amount": 10000.0
      },
      {
        "period": "JUNE",
        "amount": 128375.0
      },
      {
        "period": "AUGUST",
        "amount": 28875.0
      },
      {
        "period": "SEPTEMBER",
        "amount": 28875.0
      },
      {
        "period": "OCTOBER",
        "amount": 28875.0
      },
      {
        "period": "NOVEMBER",
        "amount": 28875.0
      },
      {
        "period": "DECEMBER",
        "amount": 28875.0
      },
      {
        "period": "JAN",
        "amount": 28875.0
      },
      {
        "period": "FEB",
        "amount": 28875.0
      },
      {
        "period": "MAR",
        "amount": 28875.0
      },
      {
        "period": "APR",
        "amount": 28875.0
      },
      {
        "period": "MAY",
        "amount": 28875.0
      },
      {
        "period": "JUN",
        "amount": 28875.0
      },
      {
        "period": "JUL",
        "amount": 28875.0
      }
    ],
    "paymentMade": 484875.0,
    "totalContractPrice": 484875.0,
    "balance": 0.0,
    "paymentPercentage": 1.0775,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0809",
    "buyer": "GALENG, ANGELITA",
    "mode": "INSTALLMENT",
    "dueDay": "5th",
    "monthlyPayments": [
      {
        "period": "MAY",
        "amount": 10000.0
      },
      {
        "period": "JULY",
        "amount": 46116.67
      },
      {
        "period": "AUGUST",
        "amount": 46116.67
      },
      {
        "period": "SEPTEMBER",
        "amount": 46116.67
      },
      {
        "period": "OCTOBER",
        "amount": 28875.0
      },
      {
        "period": "NOVEMBER",
        "amount": 28875.0
      },
      {
        "period": "DECEMBER",
        "amount": 28875.0
      },
      {
        "period": "JAN",
        "amount": 28875.0
      },
      {
        "period": "FEB",
        "amount": 28875.0
      },
      {
        "period": "MAR",
        "amount": 28875.0
      },
      {
        "period": "APR",
        "amount": 28875.0
      },
      {
        "period": "MAY",
        "amount": 28875.0
      }
    ],
    "paymentMade": 379350.01,
    "totalContractPrice": 495000.0,
    "balance": 115649.99,
    "paymentPercentage": 0.843000022222222,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0706",
    "buyer": "RIL, MARVIN",
    "mode": "INSTALLMENT",
    "dueDay": "5th",
    "monthlyPayments": [
      {
        "period": "MAY",
        "amount": 138375.0
      },
      {
        "period": "JUNE",
        "amount": 8987.0
      },
      {
        "period": "JULY",
        "amount": 19250.0
      },
      {
        "period": "AUGUST",
        "amount": 19250.0
      },
      {
        "period": "SEPTEMBER",
        "amount": 19250.0
      },
      {
        "period": "OCTOBER",
        "amount": 19250.0
      },
      {
        "period": "NOVEMBER",
        "amount": 19250.0
      },
      {
        "period": "DECEMBER",
        "amount": 19250.0
      },
      {
        "period": "JAN",
        "amount": 19250.0
      },
      {
        "period": "FEB",
        "amount": 19250.0
      },
      {
        "period": "MAR",
        "amount": 19250.0
      },
      {
        "period": "APR",
        "amount": 19250.0
      },
      {
        "period": "MAY",
        "amount": 19250.0
      },
      {
        "period": "JUN",
        "amount": 135888.0
      }
    ],
    "paymentMade": 495000.0,
    "totalContractPrice": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0702",
    "buyer": "OROPESA, ROGELIO",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "JUNE",
        "amount": 10000.0
      },
      {
        "period": "JULY",
        "amount": 386000.0
      }
    ],
    "paymentMade": 396000.0,
    "totalContractPrice": 396000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0605",
    "buyer": "PAYOFELIN, LIZALE ANNE G.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "JUNE",
        "amount": 10000.0
      },
      {
        "period": "JULY",
        "amount": 485000.0
      }
    ],
    "paymentMade": 495000.0,
    "totalContractPrice": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0901",
    "buyer": "NEPOMUCENO, ERWIN",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "JULY",
        "amount": 495000.0
      }
    ],
    "paymentMade": 495000.0,
    "totalContractPrice": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.928571428571428,
    "fr": ""
  },
  {
    "unitId": "LA-0708 & LA-0710 (COMBINED)",
    "buyer": "AURE, ALICIA ALEGRE",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "AUGUST",
        "amount": 1320000.0
      }
    ],
    "paymentMade": 1320000.0,
    "totalContractPrice": 1320000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.928571428571428,
    "fr": ""
  },
  {
    "unitId": "LA-0417 (END) *A",
    "buyer": "ORDO\u00d1EZ, LEONISA G.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "AUGUST",
        "amount": 495000.0
      }
    ],
    "paymentMade": 495000.0,
    "totalContractPrice": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.0,
    "fr": ""
  },
  {
    "unitId": "LA-0417 (END) *B",
    "buyer": "MANGLALLAN, JEMMABEL G.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "AUGUST",
        "amount": 495000.0
      }
    ],
    "paymentMade": 495000.0,
    "totalContractPrice": 495000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.0,
    "fr": ""
  },
  {
    "unitId": "LA-0705",
    "buyer": "VILLEGAS, STEVE RANDY N.",
    "mode": "INSTALLMENT",
    "dueDay": "2nd",
    "monthlyPayments": [
      {
        "period": "OCTOBER",
        "amount": 10000.0
      },
      {
        "period": "DECEMBER",
        "amount": 62667.0
      },
      {
        "period": "JAN",
        "amount": 62667.0
      },
      {
        "period": "FEB",
        "amount": 62667.0
      },
      {
        "period": "MAR",
        "amount": 25667.0
      },
      {
        "period": "APR",
        "amount": 25667.0
      },
      {
        "period": "MAY",
        "amount": 25667.0
      },
      {
        "period": "JUN",
        "amount": 25667.0
      }
    ],
    "paymentMade": 300669.0,
    "totalContractPrice": 660000.0,
    "balance": 359331.0,
    "paymentPercentage": 0.455559090909091,
    "commissionReleasedPercent": 0.4,
    "fr": ""
  },
  {
    "unitId": "LA-0604",
    "buyer": "GOMEZ, BRYAN ANTAZO",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "NOVEMBER",
        "amount": 2244000.0
      }
    ],
    "paymentMade": 2244000.0,
    "totalContractPrice": 2244000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.813235294117647,
    "fr": ""
  },
  {
    "unitId": "LA-0703",
    "buyer": "RIL, AUNDRIA ANTONIO",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "DECEMBER",
        "amount": 250000.0
      },
      {
        "period": "JAN",
        "amount": 212000.0
      }
    ],
    "paymentMade": 462000.0,
    "totalContractPrice": 462000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-1208 (NEW)",
    "buyer": "DELA CRUZ, JENNY ANN G.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "DECEMBER",
        "amount": 457800.0
      }
    ],
    "paymentMade": 457800.0,
    "totalContractPrice": 457800.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-1207 (NEW)",
    "buyer": "DELA CRUZ, JENNY ANN G.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "DECEMBER",
        "amount": 10000.0
      }
    ],
    "paymentMade": 10000.0,
    "totalContractPrice": 457800.0,
    "balance": 447800.0,
    "paymentPercentage": 0.0218435998252512,
    "commissionReleasedPercent": 0.0,
    "fr": ""
  },
  {
    "unitId": "LA-1205 (NEW)",
    "buyer": "GELUZ, CONRADO JR, A.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "DECEMBER",
        "amount": 10000.0
      },
      {
        "period": "FEB",
        "amount": 410000.0
      }
    ],
    "paymentMade": 420000.0,
    "totalContractPrice": 420000.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0414 & LA-0415",
    "buyer": "AHMED, SARAH NACINO",
    "mode": "INSTALLMENT",
    "dueDay": "27th",
    "monthlyPayments": [
      {
        "period": "JAN",
        "amount": 50000.0
      },
      {
        "period": "FEB",
        "amount": 51500.0
      },
      {
        "period": "MAR",
        "amount": 51500.0
      },
      {
        "period": "APR",
        "amount": 51500.0
      },
      {
        "period": "MAY",
        "amount": 51500.0
      }
    ],
    "paymentMade": 256000.0,
    "totalContractPrice": 1188000.0,
    "balance": 932000.0,
    "paymentPercentage": 0.237037037037037,
    "commissionReleasedPercent": 0.142857142857143,
    "fr": ""
  },
  {
    "unitId": "LA-1207 (NEW)",
    "buyer": "DE CHAVEZ, MARIA ANGELICA G.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MAR",
        "amount": 50000.0
      },
      {
        "period": "APR",
        "amount": 430000.0
      }
    ],
    "paymentMade": 480000.0,
    "totalContractPrice": 480000.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0411 & LA-0412 (NEW)",
    "buyer": "CHRISTINE B. BOLISAY",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "FEB",
        "amount": 50000.0
      },
      {
        "period": "MAR",
        "amount": 427900.0
      },
      {
        "period": "APR",
        "amount": 482100.0
      }
    ],
    "paymentMade": 960000.0,
    "totalContractPrice": 960000.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-1209 (NEW)",
    "buyer": "BACUS, ERLOVE",
    "mode": "INSTALLMENT",
    "dueDay": "30th",
    "monthlyPayments": [
      {
        "period": "FEB",
        "amount": 50000.0
      },
      {
        "period": "MAR",
        "amount": 20000.0
      },
      {
        "period": "APR",
        "amount": 20000.0
      },
      {
        "period": "MAY",
        "amount": 20000.0
      }
    ],
    "paymentMade": 110000.0,
    "totalContractPrice": 594000.0,
    "balance": 484000.0,
    "paymentPercentage": 0.203703703703704,
    "commissionReleasedPercent": 0.0,
    "fr": "7"
  },
  {
    "unitId": "LA-0410 (NEW)",
    "buyer": "REGIS, GERALDINE O.",
    "mode": "INSTALLMENT",
    "dueDay": "22th",
    "monthlyPayments": [
      {
        "period": "MAR",
        "amount": 50000.0
      }
    ],
    "paymentMade": 50000.0,
    "totalContractPrice": 594000.0,
    "balance": 544000.0,
    "paymentPercentage": 0.0925925925925926,
    "commissionReleasedPercent": 0.0,
    "fr": ""
  },
  {
    "unitId": "LA-0407 (NEW)",
    "buyer": "CODON, MA. CZARINA A.",
    "mode": "INSTALLMENT",
    "dueDay": "25th",
    "monthlyPayments": [
      {
        "period": "MAR",
        "amount": 50000.0
      },
      {
        "period": "APR",
        "amount": 24500.0
      },
      {
        "period": "MAY",
        "amount": 24500.0
      }
    ],
    "paymentMade": 99000.0,
    "totalContractPrice": 540000.0,
    "balance": 441000.0,
    "paymentPercentage": 0.183333333333333,
    "commissionReleasedPercent": 0.0,
    "fr": ""
  },
  {
    "unitId": "LA-1203 & LA-1204 (NEW)",
    "buyer": "SALONGA, EDWIN L.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "MAR",
        "amount": 1056000.0
      }
    ],
    "paymentMade": 1056000.0,
    "totalContractPrice": 1056000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.857142857142857,
    "fr": ""
  },
  {
    "unitId": "LA-0704 (NEW)",
    "buyer": "GERMANO, ERICO C. JR",
    "mode": "INSTALLMENT",
    "dueDay": "29TH",
    "monthlyPayments": [
      {
        "period": "MAR",
        "amount": 50000.0
      },
      {
        "period": "APR",
        "amount": 23935.0
      },
      {
        "period": "MAY",
        "amount": 23935.0
      }
    ],
    "paymentMade": 97870.0,
    "totalContractPrice": 528700.0,
    "balance": 430830.0,
    "paymentPercentage": 0.18511443162474,
    "commissionReleasedPercent": 0.0,
    "fr": ""
  },
  {
    "unitId": "LA-0201",
    "buyer": "CABALIDA, MADELYN G.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "APR",
        "amount": 704000.0
      }
    ],
    "paymentMade": 704000.0,
    "totalContractPrice": 704000.0,
    "balance": 0.0,
    "paymentPercentage": 1.1,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  },
  {
    "unitId": "LA-0405 & LA-0406",
    "buyer": "LOMAN, KURT ERNEST M.",
    "mode": "INSTALLMENT",
    "dueDay": "25TH",
    "monthlyPayments": [
      {
        "period": "APR",
        "amount": 50000.0
      },
      {
        "period": "MAY",
        "amount": 56900.0
      }
    ],
    "paymentMade": 106900.0,
    "totalContractPrice": 1188000.0,
    "balance": 1081100.0,
    "paymentPercentage": 0.0989814814814815,
    "commissionReleasedPercent": 0.0,
    "fr": ""
  },
  {
    "unitId": "LA-0502",
    "buyer": "MEDILO, LARRY D.",
    "mode": "CASH",
    "dueDay": "",
    "monthlyPayments": [
      {
        "period": "APR",
        "amount": 570000.0
      }
    ],
    "paymentMade": 570000.0,
    "totalContractPrice": 570000.0,
    "balance": 0.0,
    "paymentPercentage": 1.0,
    "commissionReleasedPercent": 0.75,
    "fr": ""
  }
]
const canonicalListingInstallmentDetails: ListingInstallmentDetail[] = [
  {
    "unitId": "LA-0101",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0102",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0103",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0104",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0201",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0202",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0203",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0204",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0205",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0206",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0207",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0208",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0208",
    "dp": 207400.0,
    "spotDpDiscount": 15555.0,
    "spotDp": 191845.0,
    "balance": 643500.0,
    "monthly3Years": 53625.0,
    "monthly5Years": 35750.0,
    "monthly10Years": 32175.0
  },
  {
    "unitId": "LA-0301",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0302",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0303",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0304",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0305",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0306",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0307",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0308",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0309",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0310",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0311",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0312",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0313",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0314",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0315",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0401",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0401",
    "dp": 0.3,
    "spotDpDiscount": 0.075,
    "spotDp": 0,
    "balance": 0.75,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0401",
    "dp": 207400.0,
    "spotDpDiscount": 15555.0,
    "spotDp": 191845.0,
    "balance": 643500.0,
    "monthly3Years": 53625.0,
    "monthly5Years": 35750.0,
    "monthly10Years": 32175.0
  },
  {
    "unitId": "LA-0402",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0403",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0404",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0405",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0406",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0407",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0408",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0409",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0410",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0411",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0412",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0413",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0414",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0415",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0501",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0502",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0503",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0503",
    "dp": 0.3,
    "spotDpDiscount": 0.075,
    "spotDp": 0,
    "balance": 0.75,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0503",
    "dp": 385600.0,
    "spotDpDiscount": 28920.0,
    "spotDp": 356680.0,
    "balance": 1089000.0,
    "monthly3Years": 90750.0,
    "monthly5Years": 60500.0,
    "monthly10Years": 54450.0
  },
  {
    "unitId": "LA-0504",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0504",
    "dp": 1019200.0,
    "spotDpDiscount": 76440.0,
    "spotDp": 942760.0,
    "balance": 2673000.0,
    "monthly3Years": 222750.0,
    "monthly5Years": 148500.0,
    "monthly10Years": 133650.0
  },
  {
    "unitId": "LA-0601",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0601",
    "dp": 310855.0,
    "spotDpDiscount": 23314.125,
    "spotDp": 287540.875,
    "balance": 902137.5,
    "monthly3Years": 75178.125,
    "monthly5Years": 50118.75,
    "monthly10Years": 45106.875
  },
  {
    "unitId": "LA-0602",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0603",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0603",
    "dp": 309370.0,
    "spotDpDiscount": 23202.75,
    "spotDp": 286167.25,
    "balance": 898425.0,
    "monthly3Years": 74868.75,
    "monthly5Years": 49912.5,
    "monthly10Years": 44921.25
  },
  {
    "unitId": "LA-0604",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0604",
    "dp": 167800.0,
    "spotDpDiscount": 12585.0,
    "spotDp": 155215.0,
    "balance": 544500.0,
    "monthly3Years": 45375.0,
    "monthly5Years": 30250.0,
    "monthly10Years": 27225.0
  },
  {
    "unitId": "LA-0605",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0605",
    "dp": 264028.0,
    "spotDpDiscount": 19802.1,
    "spotDp": 244225.9,
    "balance": 785070.0,
    "monthly3Years": 65422.5,
    "monthly5Years": 43615.0,
    "monthly10Years": 39253.5
  },
  {
    "unitId": "LA-0606",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0606",
    "dp": 207400.0,
    "spotDpDiscount": 15555.0,
    "spotDp": 191845.0,
    "balance": 643500.0,
    "monthly3Years": 53625.0,
    "monthly5Years": 35750.0,
    "monthly10Years": 32175.0
  },
  {
    "unitId": "LA-0701",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0701",
    "dp": 217300.0,
    "spotDpDiscount": 16297.5,
    "spotDp": 201002.5,
    "balance": 668250.0,
    "monthly3Years": 55687.5,
    "monthly5Years": 37125.0,
    "monthly10Years": 33412.5
  },
  {
    "unitId": "LA-0702",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0702",
    "dp": 207400.0,
    "spotDpDiscount": 15555.0,
    "spotDp": 191845.0,
    "balance": 643500.0,
    "monthly3Years": 53625.0,
    "monthly5Years": 35750.0,
    "monthly10Years": 32175.0
  },
  {
    "unitId": "LA-0703",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0703",
    "dp": 167800.0,
    "spotDpDiscount": 12585.0,
    "spotDp": 155215.0,
    "balance": 544500.0,
    "monthly3Years": 45375.0,
    "monthly5Years": 30250.0,
    "monthly10Years": 27225.0
  },
  {
    "unitId": "LA-0704",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0801",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0802",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0803",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0804",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0805",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0806",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0807",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0808",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0809",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0810",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0811",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0812",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0813",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0814",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0815",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0815",
    "dp": 167800.0,
    "spotDpDiscount": 12585.0,
    "spotDp": 155215.0,
    "balance": 544500.0,
    "monthly3Years": 45375.0,
    "monthly5Years": 30250.0,
    "monthly10Years": 27225.0
  },
  {
    "unitId": "LA-0816",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0817",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0817",
    "dp": 236044.0,
    "spotDpDiscount": 17703.3,
    "spotDp": 218340.7,
    "balance": 715110.0,
    "monthly3Years": 59592.5,
    "monthly5Years": 39728.3333333333,
    "monthly10Years": 35755.5
  },
  {
    "unitId": "LA-0818",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0819",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0901",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0901",
    "dp": 235120.0,
    "spotDpDiscount": 17634.0,
    "spotDp": 217486.0,
    "balance": 712800.0,
    "monthly3Years": 59400.0,
    "monthly5Years": 39600.0,
    "monthly10Years": 35640.0
  },
  {
    "unitId": "LA-0902",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0903",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0903",
    "dp": 167800.0,
    "spotDpDiscount": 12585.0,
    "spotDp": 155215.0,
    "balance": 544500.0,
    "monthly3Years": 45375.0,
    "monthly5Years": 30250.0,
    "monthly10Years": 27225.0
  },
  {
    "unitId": "LA-0904",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0904",
    "dp": 167800.0,
    "spotDpDiscount": 12585.0,
    "spotDp": 155215.0,
    "balance": 544500.0,
    "monthly3Years": 45375.0,
    "monthly5Years": 30250.0,
    "monthly10Years": 27225.0
  },
  {
    "unitId": "LA-0905",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0905",
    "dp": 167800.0,
    "spotDpDiscount": 12585.0,
    "spotDp": 155215.0,
    "balance": 544500.0,
    "monthly3Years": 45375.0,
    "monthly5Years": 30250.0,
    "monthly10Years": 27225.0
  },
  {
    "unitId": "LA-0906",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0907",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-0908",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1001",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1002",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1003",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1004",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1005",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1006",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1007",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1008",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1009",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1010",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1101",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1102",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1103",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1104",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1105",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1106",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1107",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1108",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1109",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1110",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1201",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1202",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1203",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1204",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1205",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1206",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1207",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1208",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1208",
    "dp": 167800.0,
    "spotDpDiscount": 12585.0,
    "spotDp": 155215.0,
    "balance": 544500.0,
    "monthly3Years": 45375.0,
    "monthly5Years": 30250.0,
    "monthly10Years": 27225.0
  },
  {
    "unitId": "LA-1209",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1210",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1211",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1212",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1501",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1502",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1503",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1504",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1505",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1506",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1601",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1602",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1603",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1604",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1605",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1605",
    "dp": 167800.0,
    "spotDpDiscount": 12585.0,
    "spotDp": 155215.0,
    "balance": 544500.0,
    "monthly3Years": 45375.0,
    "monthly5Years": 30250.0,
    "monthly10Years": 27225.0
  },
  {
    "unitId": "LA-1606",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1606",
    "dp": 167800.0,
    "spotDpDiscount": 12585.0,
    "spotDp": 155215.0,
    "balance": 544500.0,
    "monthly3Years": 45375.0,
    "monthly5Years": 30250.0,
    "monthly10Years": 27225.0
  },
  {
    "unitId": "LA-1607",
    "dp": 0,
    "spotDpDiscount": 0,
    "spotDp": 0,
    "balance": 0,
    "monthly3Years": 0,
    "monthly5Years": 0,
    "monthly10Years": 0
  },
  {
    "unitId": "LA-1607",
    "dp": 207400.0,
    "spotDpDiscount": 15555.0,
    "spotDp": 191845.0,
    "balance": 643500.0,
    "monthly3Years": 53625.0,
    "monthly5Years": 35750.0,
    "monthly10Years": 32175.0
  }
]
const canonicalClientSourceDetails: ClientSourceDetail[] = [
  {
    "buyer": "SILVA, ISABEL LAYUG L.",
    "unitId": "LA-0204",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "38",
    "region": "REGION IV-A"
  },
  {
    "buyer": "RABAGO, ELIZABETH L.",
    "unitId": "LA-0401",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "age": "62",
    "region": "NCR"
  },
  {
    "buyer": "CABISON, AVA MAXINE E.",
    "unitId": "LA-0403",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "40",
    "region": "REGION IV-A"
  },
  {
    "buyer": "CABISON, SOPHIA CLAIRE E.",
    "unitId": "LA-0404",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "40",
    "region": "REGION IV-A"
  },
  {
    "buyer": "AQUINO, JAYMILYN BERNARDO",
    "unitId": "LA-0103",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "31",
    "region": "REGION IV-A"
  },
  {
    "buyer": "DIZON, ELORA ANDREI",
    "unitId": "LA-0416",
    "remarks": "PARTIAL PAYMENT",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "region": "REGION IV-A"
  },
  {
    "buyer": "DACAYO, JENNIFER MOROJO",
    "unitId": "LA-0101",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "34",
    "region": "REGION IV-A"
  },
  {
    "buyer": "CAMANTIGUE, ESTELISA V.",
    "unitId": "LA-0201 (1.1)",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "age": "38",
    "region": "REGION IV-A"
  },
  {
    "buyer": "RAMIREZ, PRINCE RUPERT",
    "unitId": "LA-0203",
    "remarks": "PARTIAL PAYMENT",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "age": "35",
    "region": "REGION IV-A"
  },
  {
    "buyer": "RUSIT, ERIC C.",
    "unitId": "LA-0305 LA0306 & LA-0307 COMBINED",
    "remarks": "PARTIAL PAYMENT",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "age": "47",
    "region": "REGION IV-A"
  },
  {
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0408",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "41",
    "region": "REGION IV-A"
  },
  {
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0410",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "41",
    "region": "REGION IV-A"
  },
  {
    "buyer": "BORAC, LARRY S.",
    "unitId": "LA-0405",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "39",
    "region": "REGION IV-A"
  },
  {
    "buyer": "OCAMPO, RACQUEL",
    "unitId": "LA-0412 & LA-0414 COMBINED",
    "remarks": "PARTIAL PAYMENT",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "age": "43",
    "region": "REGION IV-A"
  },
  {
    "buyer": "CABISON, CHERRY MAE E.",
    "unitId": "LA-0406",
    "remarks": "PARTIAL PAYMENT",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "age": "40",
    "region": "REGION IV-A"
  },
  {
    "buyer": "DE LEON, CARMINA VICTORIA",
    "unitId": "LA-0407",
    "remarks": "PARTIAL PAYMENT",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "age": "34",
    "region": "NCR"
  },
  {
    "buyer": "TUBORO, MARILOU GRIMALDO",
    "unitId": "LA-0411",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "53",
    "region": "NCR"
  },
  {
    "buyer": "DE LEON, CHARLENE MAE T.",
    "unitId": "LA-0409",
    "remarks": "PARTIAL PAYMENT",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "age": "31",
    "region": "NCR"
  },
  {
    "buyer": "SIAZON, JEFFERSON C.",
    "unitId": "LA-0108 (CORNER) A",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "48",
    "region": "REGION IV-A"
  },
  {
    "buyer": "PRADEZ, JACKIELOU RIA G.",
    "unitId": "LA-0304",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "41",
    "region": "REGION IV-A"
  },
  {
    "buyer": "SALAMAT, ANTONIO, MIGUEL",
    "unitId": "LA-0413",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "30",
    "region": "REGION IV-A"
  },
  {
    "buyer": "COMIA, GRAZELYN M.",
    "unitId": "LA-0415",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "30-",
    "region": "REGION IV-A"
  },
  {
    "buyer": "GULLA, SHERYL",
    "unitId": "LA-0718",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "39",
    "region": "NCR"
  },
  {
    "buyer": "DE SAN PERDRO, JOHN MHELCON",
    "unitId": "COMBINED: LA-0501 & LA-0502",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "28"
  },
  {
    "buyer": "GARCIA, JANICE M.",
    "unitId": "LA-0302",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "41",
    "region": "REGION IV-A"
  },
  {
    "buyer": "CHANG, IMELDA A.",
    "unitId": "LA-0417 (CORNER)",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "48",
    "region": "REGION IV-A"
  },
  {
    "buyer": "BAGAOISAN, LILIA A.",
    "unitId": "LA-0108 (INNER) B",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "73",
    "region": "REGION IV-A"
  },
  {
    "buyer": "TAYLOR, WENDY B.",
    "unitId": "LA-0108 (END) C",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "52",
    "region": "REGION IV-A"
  },
  {
    "buyer": "JOHNSON, CHERRY F.",
    "unitId": "LA-1201 (CORNER)",
    "remarks": "PARTIAL PAYMENT",
    "status": "INACTIVE",
    "paymentStatus": "PARTIALLY PAID"
  },
  {
    "buyer": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "41",
    "region": "REGION IV-A"
  },
  {
    "buyer": "RICO, MAY LYN B.",
    "unitId": "LA-1205",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "41",
    "region": "REGION IV-A"
  },
  {
    "buyer": "PERALTA, GERRY Q.",
    "unitId": "LA-1105",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "34",
    "region": "REGION IV-A"
  },
  {
    "buyer": "LAYUG, EDWARD JO S.",
    "unitId": "LA-0205",
    "remarks": "PARTIAL PAYMENT",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "age": "32",
    "region": "REGION IV-A"
  },
  {
    "buyer": "HATEM, HANNOUSH MARC ANDREEI B.",
    "unitId": "LA-1201 (INNER)",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "region": "REGION IV-A"
  },
  {
    "buyer": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (CORNER)",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "43",
    "region": "NCR"
  },
  {
    "buyer": "MIRADOR, LEO M.",
    "unitId": "LA-1202 (END)",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "43",
    "region": "NCR"
  },
  {
    "buyer": "BELIGON, ERDELYN F.",
    "unitId": "LA-1103",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "50",
    "region": "REGION IV-A"
  },
  {
    "buyer": "MORIONES, CHERRY",
    "unitId": "LA-0719",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "region": "REGION IV-A"
  },
  {
    "buyer": "MAGORA, JOANNA MARIE",
    "unitId": "LA-0602",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "35",
    "region": "REGION IV-A"
  },
  {
    "buyer": "ALCASABAS, ROMEO ESO",
    "unitId": "LA-0603",
    "kubo": "NO",
    "remarks": "PARTIAL PAYMENT",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "age": "48",
    "region": "NCR"
  },
  {
    "buyer": "ARGETE, RICHELL",
    "unitId": "LA-0604",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "43",
    "region": "NCR"
  },
  {
    "buyer": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0504",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "33",
    "region": "REGION IV-A"
  },
  {
    "buyer": "ALITAGTAG, RIZZ ANN",
    "unitId": "LA-0503",
    "kubo": "NO",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "age": "33",
    "region": "REGION IV-A"
  },
  {
    "buyer": "DERILO, GENEVIEVE O.",
    "unitId": "LA-0612",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "36",
    "region": "NCR"
  },
  {
    "buyer": "OLANO, ALLAN RAYMUND P.",
    "unitId": "LA-0613",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "51",
    "region": "REGION IV-A"
  },
  {
    "buyer": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0704",
    "kubo": "NO",
    "remarks": "PARTIAL PAYMENT",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "region": "REGION IV-A"
  },
  {
    "buyer": "PANGHULAN, RUTH Q.",
    "unitId": "LA-0610",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID"
  },
  {
    "buyer": "ARAYATA, RICHELLE C.",
    "unitId": "LA-0703 & LA-0705 COMBINED",
    "kubo": "YES",
    "number": "2",
    "status": "CANCELLED",
    "paymentStatus": "OFFICIALLY BACKED OUT"
  },
  {
    "buyer": "ALAMER, JAZZIE",
    "unitId": "COMBINED: LA-0803 & LA-0805",
    "kubo": "NO",
    "remarks": "PARTIAL PAYMENT",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "age": "46",
    "region": "REGION IV-A"
  },
  {
    "buyer": "ORAPA, LOUEL M.",
    "unitId": "LA-0707 (INNER)",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "26",
    "region": "REGION IV-A"
  },
  {
    "buyer": "ORAPA, MARILOU",
    "unitId": "LA-0709 & LA-0711 COMBINED",
    "kubo": "YES",
    "number": "2",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "52",
    "region": "REGION IV-A"
  },
  {
    "buyer": "MIRASOL, ROSARIO L.",
    "unitId": "LA-0713",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "58",
    "region": "REGION IV-A"
  },
  {
    "buyer": "FABABIER, ANNABELLE B.",
    "unitId": "LA-0715",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "57",
    "region": "REGION IV-A"
  },
  {
    "buyer": "CANTOR, VIEN QUINA",
    "unitId": "LA-0303",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "27"
  },
  {
    "buyer": "GALENG, ANGELITA",
    "unitId": "LA-0809",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "59"
  },
  {
    "buyer": "RIL, MARVIN",
    "unitId": "LA-0706",
    "kubo": "NO",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "region": "REGION IV-A"
  },
  {
    "buyer": "OROPESA, ROGELIO",
    "unitId": "LA-0702",
    "kubo": "YES",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID"
  },
  {
    "buyer": "PAYOFELIN, LIZALE ANNE G.",
    "unitId": "LA-0605",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID"
  },
  {
    "buyer": "NEPOMUCENO, ERWIN",
    "unitId": "LA-0901",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "region": "REGION IV-A"
  },
  {
    "buyer": "AURE, ALICIA ALEGRE",
    "unitId": "LA-0708 & LA-0710 (COMBINED)",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID"
  },
  {
    "buyer": "ORDO\u00d1EZ, LEONISA G.",
    "unitId": "LA-0417 (END) *A",
    "kubo": "NO",
    "remarks": "c/o LAND ACQUISITION - LORENZA",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID"
  },
  {
    "buyer": "MANGLALLAN, JEMMABEL G.",
    "unitId": "LA-0417 (END) *B",
    "kubo": "NO",
    "remarks": "c/o LAND ACQUISITION - LORENZA",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID"
  },
  {
    "buyer": "VILLEGAS, STEVE RANDY N.",
    "unitId": "LA-0705",
    "kubo": "NO",
    "remarks": "PARTIAL PAYMENT",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "region": "REGION IV-A"
  },
  {
    "buyer": "GOMEZ, BRYAN ANTAZO",
    "unitId": "LA-0604",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "region": "REGION IV-A"
  },
  {
    "buyer": "RIL, AUNDRIA ANTONIO",
    "unitId": "LA-0703",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "region": "REGION IV-A"
  },
  {
    "buyer": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1208 (NEW)",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "40",
    "region": "REGION IV-A"
  },
  {
    "buyer": "DELA CRUZ, JENNY ANN G.",
    "unitId": "LA-1207 (NEW)",
    "kubo": "YES",
    "number": "1",
    "remarks": "RESERVATION FEE",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "40",
    "region": "REGION IV-A"
  },
  {
    "buyer": "GELUZ, CONRADO JR, A.",
    "unitId": "LA-1205 (NEW)",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "39",
    "region": "REGION IV-A"
  },
  {
    "buyer": "JANDUSAY, JOHN WENDELL F.",
    "unitId": "LA-0801 (NEW)",
    "remarks": "RESERVATION FEE",
    "status": "ACTIVE",
    "paymentStatus": "RESERVATION",
    "region": "REGION IV-A"
  },
  {
    "buyer": "AHMED, SARAH NACINO",
    "unitId": "LA-0414 & LA-0415",
    "kubo": "YES",
    "number": "1",
    "remarks": "PARTIAL PAYMENT",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "age": "33",
    "region": "REGION IV-A"
  },
  {
    "buyer": "ISO, DENMARK S.",
    "unitId": "LA-0408 & LA 0409",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "41",
    "region": "REGION IV-A"
  },
  {
    "buyer": "DE CHAVEZ, MARIA ANGELICA G.",
    "unitId": "LA-1207 (NEW)",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "31",
    "region": "NCR",
    "team": "CALLIPSO"
  },
  {
    "buyer": "CHRISTINE B. BOLISAY",
    "unitId": "LA-0411 & LA-0412 (NEW)",
    "kubo": "YES",
    "number": "1",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "PARTIALLY PAID",
    "region": "REGION IV-A",
    "team": "CALLIPSO"
  },
  {
    "buyer": "BACUS, ERLOVE",
    "unitId": "LA-1209 (NEW)",
    "remarks": "PARTIAL PAYMENT",
    "status": "ACTIVE",
    "paymentStatus": "PARTIAL PAYMENT",
    "age": "22",
    "region": "REGION IV-A",
    "team": "CALLIPSO"
  },
  {
    "buyer": "REGIS, GERALDINE O.",
    "unitId": "LA-0410 (NEW)",
    "remarks": "RESERVATION FEE",
    "status": "ACTIVE",
    "paymentStatus": "RESERVATION",
    "age": "34",
    "region": "REGION IV-A",
    "team": "CALLIPSO"
  },
  {
    "buyer": "CODON, MA. CZARINA A.",
    "unitId": "LA-0407 (NEW)",
    "remarks": "RESERVATION FEE",
    "status": "ACTIVE",
    "paymentStatus": "RESERVATION",
    "region": "REGION IV-A",
    "team": "CALLIPSO"
  },
  {
    "buyer": "SALONGA, EDWIN L.",
    "unitId": "LA-1203 & LA-1204 (NEW)",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "region": "REGION IV-A",
    "team": "POLARIS"
  },
  {
    "buyer": "GERMANO, ERICO C. JR",
    "unitId": "LA-0704 (NEW)",
    "kubo": "YES",
    "remarks": "RESERVATION FEE",
    "status": "ACTIVE",
    "paymentStatus": "RESERVATION",
    "region": "REGION IV-A",
    "team": "CALLIPSO"
  },
  {
    "buyer": "CABALIDA, MADELYN G.",
    "unitId": "LA-0201",
    "kubo": "YES",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "region": "REGION IV-A",
    "team": "VENUS"
  },
  {
    "buyer": "LOMAN, KURT ERNEST M.",
    "unitId": "LA-0405 & LA-0406",
    "remarks": "RESERVATION FEE",
    "status": "ACTIVE",
    "paymentStatus": "RESERVATION",
    "team": "POLARIS"
  },
  {
    "buyer": "MEDILO, LARRY D.",
    "unitId": "LA-0502",
    "kubo": "YES",
    "remarks": "FULLY PAID",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "region": "REGION IV-A",
    "team": "CALLIPSO"
  },
  {
    "buyer": "MICHELLE C. SAQUILAYAN",
    "unitId": "LA-1208 (NEW)",
    "kubo": "YES",
    "remarks": "RESERVATION FEE",
    "status": "ACTIVE",
    "paymentStatus": "COMPLETE PAID",
    "age": "46",
    "region": "REGION IV-A",
    "team": "VENUS"
  }
]

function splitUnitIds(unitId: string) {
  const matches = unitId.match(/LA[-\s]?\d{4}/gi)
  if (!matches) return [unitId.replace(/\bCOMBINED\b/gi, '').replace(/^COMBINED:\s*/i, '').trim()]

  return Array.from(new Set(matches.map((unit) => unit.toUpperCase().replace(/LA[-\s]?(\d{4})/, 'LA-$1'))))
}

function getLotTypeFromUnitLabel(unitId: string) {
  return unitId.match(/\((CORNER|INNER|END)\)/i)?.[1].toUpperCase()
}

function getUnitVariantFromUnitLabel(unitId: string) {
  return unitId.match(/\)\s*\*?([A-Z])\b/i)?.[1]
}

function splitNumber(value: number | undefined, count: number) {
  if (value === undefined) return undefined
  return count > 1 ? value / count : value
}

function normalizeUnitRows<T extends { unitId: string }>(
  records: T[],
  splitValues?: (record: T, count: number) => Partial<T>,
) {
  return records.flatMap((record) => {
    const units = splitUnitIds(record.unitId)
    const lotType = getLotTypeFromUnitLabel(record.unitId)
    const unitVariant = getUnitVariantFromUnitLabel(record.unitId)

    return units.map((unitId) => ({
      ...record,
      ...splitValues?.(record, units.length),
      unitId,
      ...(lotType ? { lotType } : {}),
      ...(unitVariant ? { unitVariant } : {}),
    }))
  })
}

function splitRelease(release: CommissionPartyRelease, count: number): CommissionPartyRelease {
  return {
    ...release,
    commission: splitNumber(release.commission, count) ?? 0,
    firstRelease20: splitNumber(release.firstRelease20, count) ?? 0,
    secondRelease40: splitNumber(release.secondRelease40, count) ?? 0,
    thirdRelease60: splitNumber(release.thirdRelease60, count) ?? 0,
    fourthRelease75: splitNumber(release.fourthRelease75, count) ?? 0,
    retention25: splitNumber(release.retention25, count) ?? 0,
    totalRemaining: splitNumber(release.totalRemaining, count) ?? 0,
    cashAdvance: splitNumber(release.cashAdvance, count) ?? 0,
  }
}

export const commissionDetails = normalizeUnitRows(canonicalCommissionDetails, (detail, count) => ({
  area: splitNumber(detail.area, count) ?? 0,
  netSellingPrice: splitNumber(detail.netSellingPrice, count) ?? 0,
  cashKaliwaan: splitNumber(detail.cashKaliwaan, count) ?? 0,
  manager: splitRelease(detail.manager, count),
  agent: splitRelease(detail.agent, count),
}))

export const paymentDetails = normalizeUnitRows(canonicalPaymentDetails, (payment, count) => ({
  monthlyPayments: payment.monthlyPayments.map((monthly) => ({
    ...monthly,
    amount: splitNumber(monthly.amount, count) ?? 0,
  })),
  paymentMade: splitNumber(payment.paymentMade, count) ?? 0,
  totalContractPrice: splitNumber(payment.totalContractPrice, count) ?? 0,
  balance: splitNumber(payment.balance, count) ?? 0,
}))

export const listingInstallmentDetails = normalizeUnitRows(canonicalListingInstallmentDetails, (detail, count) => ({
  dp: splitNumber(detail.dp, count),
  spotDpDiscount: splitNumber(detail.spotDpDiscount, count),
  spotDp: splitNumber(detail.spotDp, count),
  balance: splitNumber(detail.balance, count),
  monthly3Years: splitNumber(detail.monthly3Years, count),
  monthly5Years: splitNumber(detail.monthly5Years, count),
  monthly10Years: splitNumber(detail.monthly10Years, count),
}))

export const clientSourceDetails = normalizeUnitRows(canonicalClientSourceDetails)
