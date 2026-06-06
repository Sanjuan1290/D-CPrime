import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import FormField from '../../components/admin/FormField'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import { company, mockStorageKeys, paymentTracker, readMockStorage, soaRecords, writeMockStorage } from '../../data/adminMockData'
import type { Payment } from '../../data/adminMockData'
import { paymentDetails } from '../../data/sourceDetails'
import type { PaymentDetail, PaymentScheduleStatus } from '../../data/sourceDetails'

type PaymentsPageProps = {
  initialTab?: 'all' | 'due' | 'overdue'
}

type PaymentIdentity = {
  buyer: string
  unitId: string
}

type MonthlyPayment = PaymentDetail['monthlyPayments'][number]
type StoredMonthlyPayment = Partial<MonthlyPayment>
type StoredPaymentDetail = Partial<Omit<PaymentDetail, 'monthlyPayments'>> & {
  monthlyPayments?: StoredMonthlyPayment[]
}
type SoaScheduleLine = {
  dueDate?: string
  dueAmount: number
  datePaid?: string
  amountPaid?: number
  scheduleStatus?: PaymentScheduleStatus
}

type ReceiptTarget = {
  detailKey: string
  paymentIndex: number
  label: string
}

type ReceiptPreview = {
  title: string
  image: string
  fileName?: string
}

const PAYMENT_DETAILS_STORAGE_KEY = 'dcprime_payment_details_v2'
const scheduleStatusOptions: PaymentScheduleStatus[] = ['unpaid', 'partial', 'paid', 'overdue']

function normalizePaymentScheduleStatus(value: unknown): PaymentScheduleStatus {
  return scheduleStatusOptions.includes(value as PaymentScheduleStatus) ? (value as PaymentScheduleStatus) : 'unpaid'
}

function formatScheduleStatus(value: PaymentScheduleStatus) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function parseScheduleDate(value?: string) {
  if (!value) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T00:00:00`)
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (match) {
    const [, month, day, year] = match
    return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`)
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function getSoaScheduleStatus(line: SoaScheduleLine): PaymentScheduleStatus {
  if (line.scheduleStatus) return normalizePaymentScheduleStatus(line.scheduleStatus)
  if (line.datePaid) return (line.amountPaid ?? 0) >= line.dueAmount ? 'paid' : 'partial'

  const dueDate = parseScheduleDate(line.dueDate)
  if (!dueDate) return 'unpaid'

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return dueDate.getTime() < today.getTime() ? 'overdue' : 'unpaid'
}

function normalizeMonthlyPayment(payment: StoredMonthlyPayment): MonthlyPayment {
  return {
    period: payment.period ?? 'Monthly amortization',
    dueDate: payment.dueDate,
    amount: Number(payment.amount) || 0,
    penalty: Number(payment.penalty) || 0,
    scheduleStatus: normalizePaymentScheduleStatus(payment.scheduleStatus ?? (payment.datePaid ? 'paid' : 'unpaid')),
    datePaid: payment.datePaid,
    reference: payment.reference,
    receiptImage: payment.receiptImage,
    receiptFileName: payment.receiptFileName,
  }
}

function normalizePaymentDetail(detail: StoredPaymentDetail): PaymentDetail {
  return {
    unitId: detail.unitId ?? '',
    lotType: detail.lotType,
    unitVariant: detail.unitVariant,
    buyer: detail.buyer ?? '',
    mode: detail.mode ?? 'INSTALLMENT',
    dueDay: detail.dueDay,
    monthlyPayments: Array.isArray(detail.monthlyPayments) ? detail.monthlyPayments.map(normalizeMonthlyPayment) : [],
    paymentMade: Number(detail.paymentMade) || 0,
    totalContractPrice: Number(detail.totalContractPrice) || 0,
    balance: Number(detail.balance) || 0,
    paymentPercentage: Number(detail.paymentPercentage) || 0,
    commissionReleasedPercent: Number(detail.commissionReleasedPercent) || 0,
    fr: detail.fr,
  }
}

function PaymentsPage({ initialTab = 'all' }: PaymentsPageProps) {
  const toast = useToast()
  const [payments, setPayments] = useState(() => readMockStorage(mockStorageKeys.paymentTracker, paymentTracker))
  const [paymentRecords, setPaymentRecords] = useState<PaymentDetail[]>(loadPaymentRecords)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)
  const [monthlyPaymentTarget, setMonthlyPaymentTarget] = useState<Payment | null>(null)
  const [receiptTarget, setReceiptTarget] = useState<ReceiptTarget | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<ReceiptPreview | null>(null)
  const selectedPaymentDetail = selectedPayment
    ? paymentRecords.find((detail) => getPaymentKey(detail) === getPaymentKey(selectedPayment))
    : undefined
  const soa = soaRecords[0]
  const title =
    initialTab === 'due' ? 'Due Payments' : initialTab === 'overdue' ? 'Overdue Accounts' : 'Payment Made Tracker'
  const visiblePayments = payments.filter((payment) => {
    if (initialTab === 'due') return payment.balance > 0
    if (initialTab === 'overdue') return payment.balance > 0 && payment.dueDay !== undefined
    return true
  })

  useEffect(() => {
    writeMockStorage(mockStorageKeys.paymentTracker, payments)
  }, [payments])

  function commitPaymentRecords(getNext: (current: PaymentDetail[]) => PaymentDetail[]) {
    setPaymentRecords((current) => {
      const next = getNext(current)
      persistPaymentRecords(next)
      return next
    })
  }

  function recordPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const buyer = String(formData.get('buyer'))
    const unitId = String(formData.get('unitId'))
    const amount = Number(formData.get('amount'))
    const totalContractPrice = Number(formData.get('totalContractPrice'))
    const balance = Math.max(0, totalContractPrice - amount)
    const payment: Payment = {
      buyer,
      unitId,
      mode: 'INSTALLMENT',
      dueDay: String(formData.get('dueDay')),
      paymentMade: amount,
      totalContractPrice,
      balance,
      paymentPercentage: totalContractPrice > 0 ? amount / totalContractPrice : 0,
      commissionReleasedPercent: 0,
    }

    setPayments((current) => [payment, ...current])
    commitPaymentRecords((current) => upsertPaymentDetail(current, payment, (detail) => detail))
    setIsRecordModalOpen(false)
    toast.success('Mock payment recorded.')
  }

  function savePaymentEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editingPayment) return

    const formData = new FormData(event.currentTarget)
    const paymentMade = Number(formData.get('paymentMade'))
    const totalContractPrice = Number(formData.get('totalContractPrice'))
    const payment: Payment = {
      ...editingPayment,
      buyer: String(formData.get('buyer')),
      unitId: String(formData.get('unitId')),
      mode: String(formData.get('mode')) as Payment['mode'],
      dueDay: String(formData.get('dueDay')) || undefined,
      paymentMade,
      totalContractPrice,
      balance: Math.max(0, totalContractPrice - paymentMade),
      paymentPercentage: totalContractPrice > 0 ? paymentMade / totalContractPrice : 0,
      commissionReleasedPercent: Number(formData.get('commissionReleasedPercent')) / 100,
    }
    const previousKey = getPaymentKey(editingPayment)

    setPayments((current) =>
      current.map((item) => (item.buyer === editingPayment.buyer && item.unitId === editingPayment.unitId ? payment : item)),
    )
    commitPaymentRecords((current) => {
      let found = false
      const next = current.map((detail) => {
        if (getPaymentKey(detail) !== previousKey) return detail
        found = true
        return {
          ...detail,
          buyer: payment.buyer,
          unitId: payment.unitId,
          mode: payment.mode,
          dueDay: payment.dueDay,
          paymentMade: payment.paymentMade,
          totalContractPrice: payment.totalContractPrice,
          balance: payment.balance,
          paymentPercentage: payment.paymentPercentage,
          commissionReleasedPercent: payment.commissionReleasedPercent,
        }
      })

      return found ? next : [createPaymentDetail(payment), ...current]
    })
    if (selectedPayment && getPaymentKey(selectedPayment) === previousKey) {
      setSelectedPayment(payment)
    }
    setEditingPayment(null)
    toast.success('Payment updated.')
  }

  function voidPayment(payment: Payment) {
    setPayments((current) =>
      current.map((item) =>
        item.buyer === payment.buyer && item.unitId === payment.unitId
          ? { ...item, paymentMade: 0, balance: item.totalContractPrice, paymentPercentage: 0, commissionReleasedPercent: 0 }
          : item,
      ),
    )
    commitPaymentRecords((current) =>
      upsertPaymentDetail(current, payment, (detail) => ({
        ...detail,
        paymentMade: 0,
        balance: detail.totalContractPrice,
        paymentPercentage: 0,
        commissionReleasedPercent: 0,
      })),
    )
    if (selectedPayment && getPaymentKey(selectedPayment) === getPaymentKey(payment)) {
      setSelectedPayment({ ...payment, paymentMade: 0, balance: payment.totalContractPrice, paymentPercentage: 0, commissionReleasedPercent: 0 })
    }
    toast.success('Payment voided.')
  }

  async function addMonthlyPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!monthlyPaymentTarget) return

    const formData = new FormData(event.currentTarget)
    const amount = Number(formData.get('amount'))

    if (!amount || amount <= 0) {
      toast.error('Enter a valid payment amount.')
      return
    }

    const receiptFile = formData.get('receiptImage') as File | null
    const receiptData = await getReceiptData(receiptFile)
    if (receiptData === null) return

    const monthlyPayment: MonthlyPayment = {
      period: String(formData.get('period')).trim(),
      dueDate: String(formData.get('dueDate')).trim() || undefined,
      amount,
      penalty: Number(formData.get('penalty')) || 0,
      scheduleStatus: normalizePaymentScheduleStatus(String(formData.get('scheduleStatus'))),
      datePaid: String(formData.get('datePaid')).trim() || undefined,
      reference: String(formData.get('reference')).trim() || undefined,
      ...(receiptData
        ? {
            receiptImage: receiptData.image,
            receiptFileName: receiptData.fileName,
          }
        : {}),
    }

    if (!monthlyPayment.period) {
      toast.error('Enter the payment period or description.')
      return
    }

    commitPaymentRecords((current) =>
      upsertPaymentDetail(current, monthlyPaymentTarget, (detail) => {
        const paymentMade = detail.paymentMade + amount
        return {
          ...detail,
          monthlyPayments: [monthlyPayment, ...detail.monthlyPayments],
          paymentMade,
          balance: Math.max(0, detail.totalContractPrice - paymentMade),
          paymentPercentage: detail.totalContractPrice > 0 ? paymentMade / detail.totalContractPrice : 0,
        }
      }),
    )
    setPayments((current) =>
      current.map((payment) => {
        if (getPaymentKey(payment) !== getPaymentKey(monthlyPaymentTarget)) return payment
        const paymentMade = payment.paymentMade + amount
        return {
          ...payment,
          paymentMade,
          balance: Math.max(0, payment.totalContractPrice - paymentMade),
          paymentPercentage: payment.totalContractPrice > 0 ? paymentMade / payment.totalContractPrice : 0,
        }
      }),
    )
    if (selectedPayment && getPaymentKey(selectedPayment) === getPaymentKey(monthlyPaymentTarget)) {
      const paymentMade = selectedPayment.paymentMade + amount
      setSelectedPayment({
        ...selectedPayment,
        paymentMade,
        balance: Math.max(0, selectedPayment.totalContractPrice - paymentMade),
        paymentPercentage: selectedPayment.totalContractPrice > 0 ? paymentMade / selectedPayment.totalContractPrice : 0,
      })
    }

    setMonthlyPaymentTarget(null)
    toast.success('Monthly payment added.')
  }

  async function saveReceiptUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!receiptTarget) return

    const formData = new FormData(event.currentTarget)
    const receiptFile = formData.get('receiptImage') as File | null
    const receiptData = await getReceiptData(receiptFile)

    if (!receiptData) {
      toast.error('Choose a receipt image first.')
      return
    }

    commitPaymentRecords((current) =>
      current.map((detail) => {
        if (getPaymentKey(detail) !== receiptTarget.detailKey) return detail
        return {
          ...detail,
          monthlyPayments: detail.monthlyPayments.map((payment, index) =>
            index === receiptTarget.paymentIndex
              ? {
                  ...payment,
                  receiptImage: receiptData.image,
                  receiptFileName: receiptData.fileName,
                }
              : payment,
          ),
        }
      }),
    )
    setReceiptTarget(null)
    toast.success('Receipt image saved.')
  }

  async function getReceiptData(file: File | null) {
    if (!file || file.size === 0) return undefined
    if (!file.type.startsWith('image/')) {
      toast.error('Receipt must be an image file.')
      return null
    }

    try {
      return {
        image: await readFileAsDataUrl(file),
        fileName: file.name,
      }
    } catch {
      toast.error('Receipt image could not be read.')
      return null
    }
  }

  return (
    <div className="space-y-6">
      <Panel title={title} subtitle="Payment totals from workbook">
        <div className="mb-5 flex justify-end">
          <button onClick={() => setIsRecordModalOpen(true)} className="rounded-md bg-[#C9A84C] px-4 py-2 text-sm font-bold text-black">
            Record Payment
          </button>
        </div>
        <DataTable
          headers={['Unit ID', 'Buyer', 'Mode', 'Due', 'Payment Made', 'TCP', 'Balance', 'Payment %', 'Action']}
          rows={visiblePayments.map((payment) => [
            payment.unitId,
            payment.buyer,
            <Badge key={`${payment.unitId}-mode`}>{payment.mode}</Badge>,
            payment.dueDay ?? '-',
            formatCurrency(payment.paymentMade),
            formatCurrency(payment.totalContractPrice),
            formatCurrency(payment.balance),
            formatPercent(payment.paymentPercentage),
            <div key={`${payment.unitId}-actions`} className="flex gap-2">
              <button
                onClick={() => setSelectedPayment(payment)}
                className="rounded-md border border-[#C9A84C]/40 px-3 py-1 text-xs font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10"
              >
                View
              </button>
              <button
                onClick={() => setEditingPayment(payment)}
                className="rounded-md border border-white/20 px-3 py-1 text-xs font-semibold text-zinc-300 hover:bg-white/5"
              >
                Edit
              </button>
              <button
                onClick={() => voidPayment(payment)}
                className="rounded-md border border-rose-400/40 px-3 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-400/10"
              >
                Void
              </button>
            </div>,
          ])}
        />
      </Panel>

      <Panel title="Statement Of Account" subtitle="From SOA INSTALLMENT.xlsx">
        <div className="rounded-lg border border-white/10 bg-black p-5">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">{company.name}</p>
              <h2 className="mt-2 text-xl font-bold">Statement of Account</h2>
              <p className="mt-1 text-sm text-zinc-500">{company.address}</p>
            </div>
            <p className="text-sm font-semibold text-zinc-600">Statement Date: {soa.statementDate}</p>
          </div>
          <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
            <InfoRow label="Property Address" value={company.propertyAddress} />
            <InfoRow label="Buyer's Name" value={soa.buyer} />
            <InfoRow label="Unit No." value={soa.unitNo} />
            <InfoRow label="Area" value={soa.area} />
            <InfoRow label="Total Contract Price" value={formatCurrency(soa.totalContractPrice)} />
            <InfoRow label="Legal Miscellaneous Fee" value={formatCurrency(soa.legalMiscFee)} />
            <InfoRow label="Total Amount Payable" value={formatCurrency(soa.totalAmountPayable)} />
          </div>
          <div className="mt-5">
            <DataTable
              headers={['Due Date', 'Description', 'Due Amount', 'Penalty', 'Status', 'Date Paid', 'Amount Paid', 'Reference', 'Running Balance']}
              rows={soa.schedule.map((line) => [
                line.dueDate,
                line.description,
                formatCurrency(line.dueAmount),
                formatCurrency(line.penalty),
                <Badge key={`${line.description}-schedule-status`}>{formatScheduleStatus(getSoaScheduleStatus(line))}</Badge>,
                line.datePaid ?? '-',
                line.amountPaid ? formatCurrency(line.amountPaid) : '-',
                line.reference ?? '-',
                formatCurrency(line.runningBalance),
              ])}
            />
          </div>
          <p className="mt-5 text-sm font-bold">Total amount to fully pay as of statement date: {formatCurrency(soa.totalToFullyPay)}</p>
          <div className="mt-8 grid gap-6 text-sm md:grid-cols-2">
            <div className="border-t border-zinc-400 pt-2">
              Prepared by: {company.preparedBy}
              <br />
              Position: {company.preparedByPosition}
            </div>
            <div className="border-t border-zinc-400 pt-2">Acknowledged by: Client Name and Signature</div>
          </div>
        </div>
      </Panel>

      <Modal title="Payment Details" isOpen={selectedPayment !== null} onClose={() => setSelectedPayment(null)}>
        {selectedPayment && (
          <div className="space-y-5">
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <InfoRow label="Buyer" value={selectedPayment.buyer} />
              <InfoRow label="Unit" value={selectedPayment.unitId} />
              <InfoRow label="Mode" value={selectedPayment.mode} />
              <InfoRow label="Due Day" value={selectedPayment.dueDay ?? '-'} />
              <InfoRow label="Payment Made" value={formatCurrency(selectedPayment.paymentMade)} />
              <InfoRow label="Total Contract Price" value={formatCurrency(selectedPayment.totalContractPrice)} />
              <InfoRow label="Balance" value={formatCurrency(selectedPayment.balance)} />
              <InfoRow label="Payment Progress" value={formatPercent(selectedPayment.paymentPercentage)} />
              <InfoRow label="Commission Released" value={formatPercent(selectedPayment.commissionReleasedPercent)} />
            </div>
            <section className="rounded-lg border border-white/10 bg-black p-4">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Monthly Payment History</h3>
                  <p className="mt-1 text-xs font-semibold text-zinc-500">
                    Total posted: {formatCurrency(selectedPaymentDetail?.monthlyPayments.reduce((total, payment) => total + payment.amount, 0) ?? 0)}
                  </p>
                </div>
                <button
                  onClick={() => setMonthlyPaymentTarget(selectedPayment)}
                  className="rounded-md bg-[#C9A84C] px-3 py-2 text-xs font-bold text-black hover:bg-[#d8b85d]"
                >
                  Add Payment
                </button>
              </div>
              {selectedPaymentDetail?.monthlyPayments.length ? (
                <DataTable
                  headers={['Period', 'Due Date', 'Status', 'Date Paid', 'Amount', 'Penalty', 'Reference', 'Receipt Status', 'Action']}
                  rows={selectedPaymentDetail.monthlyPayments.map((payment, index) => [
                    payment.period,
                    payment.dueDate ?? '-',
                    <Badge key={`${payment.period}-schedule-status`}>{formatScheduleStatus(payment.scheduleStatus)}</Badge>,
                    payment.datePaid ?? '-',
                    formatCurrency(payment.amount),
                    formatCurrency(payment.penalty),
                    payment.reference ?? '-',
                    <Badge key={`${payment.period}-receipt-status`}>{payment.receiptImage ? 'Uploaded' : 'Missing'}</Badge>,
                    <div key={`${payment.period}-receipt-actions`} className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          setReceiptTarget({
                            detailKey: getPaymentKey(selectedPaymentDetail),
                            paymentIndex: index,
                            label: `${payment.period} - ${selectedPaymentDetail.buyer}`,
                          })
                        }
                        className="rounded-md border border-[#C9A84C]/40 px-3 py-1 text-xs font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          payment.receiptImage &&
                          setReceiptPreview({
                            title: `${payment.period} - ${selectedPaymentDetail.buyer}`,
                            image: payment.receiptImage,
                            fileName: payment.receiptFileName,
                          })
                        }
                        disabled={!payment.receiptImage}
                        className="rounded-md border border-white/20 px-3 py-1 text-xs font-semibold text-zinc-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Receipt
                      </button>
                    </div>,
                  ])}
                />
              ) : (
                <p className="text-sm text-zinc-500">No monthly payment entries found for this account.</p>
              )}
            </section>
          </div>
        )}
      </Modal>
      <Modal title="Record Payment" isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)}>
        <form onSubmit={recordPayment} className="grid gap-4 text-sm md:grid-cols-2">
          <FormField label="Buyer" name="buyer" defaultValue="NEW MOCK CLIENT" required />
          <FormField label="Unit ID" name="unitId" defaultValue="LA-MOCK-01" required />
          <FormField label="Amount" name="amount" type="number" defaultValue="15000" min="0" step="0.01" required />
          <FormField label="Total Contract Price" name="totalContractPrice" type="number" defaultValue="396000" min="0" step="0.01" required />
          <FormField label="Due Day" name="dueDay" defaultValue="15th" />
          <div className="flex items-end justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(false)}
              className="rounded-md border border-[#E8E4DC] px-4 py-2 font-semibold text-[#374151]"
            >
              Cancel
            </button>
            <button className="rounded-md bg-[#C9A84C] px-4 py-2 font-bold text-black">Save</button>
          </div>
        </form>
      </Modal>
      <Modal title="Edit Payment" isOpen={editingPayment !== null} onClose={() => setEditingPayment(null)}>
        {editingPayment && (
          <form onSubmit={savePaymentEdit} className="grid gap-4 text-sm md:grid-cols-2">
            <FormField label="Buyer" name="buyer" defaultValue={editingPayment.buyer} required />
            <FormField label="Unit ID" name="unitId" defaultValue={editingPayment.unitId} required />
            <FormField
              label="Mode"
              name="mode"
              defaultValue={editingPayment.mode}
              selectOptions={[
                { label: 'Cash', value: 'CASH' },
                { label: 'Installment', value: 'INSTALLMENT' },
              ]}
            />
            <FormField label="Due Day" name="dueDay" defaultValue={editingPayment.dueDay ?? ''} />
            <FormField label="Payment Made" name="paymentMade" defaultValue={String(editingPayment.paymentMade)} type="number" min="0" step="0.01" required />
            <FormField
              label="Total Contract Price"
              name="totalContractPrice"
              defaultValue={String(editingPayment.totalContractPrice)}
              type="number"
              min="0"
              step="0.01"
              required
            />
            <FormField
              label="Commission Released %"
              name="commissionReleasedPercent"
              defaultValue={(editingPayment.commissionReleasedPercent * 100).toFixed(2)}
              type="number"
              min="0"
              step="0.01"
            />
            <div className="flex items-end justify-end gap-2">
              <button type="button" onClick={() => setEditingPayment(null)} className="rounded-md border border-[#E8E4DC] px-4 py-2 font-semibold text-[#374151]">
                Cancel
              </button>
              <button className="rounded-md bg-[#C9A84C] px-4 py-2 font-bold text-black">Save Payment</button>
            </div>
          </form>
        )}
      </Modal>
      <Modal title="Add Monthly Payment" isOpen={monthlyPaymentTarget !== null} onClose={() => setMonthlyPaymentTarget(null)}>
        {monthlyPaymentTarget && (
          <form onSubmit={addMonthlyPayment} className="grid gap-4 text-sm md:grid-cols-2">
            <div className="rounded-lg border border-[#E8E4DC] bg-[#FAF8F5] p-4 md:col-span-2">
              <div className="grid gap-2 text-sm md:grid-cols-2">
                <InfoRow label="Buyer" value={monthlyPaymentTarget.buyer} />
                <InfoRow label="Unit" value={monthlyPaymentTarget.unitId} />
              </div>
            </div>
            <FormField label="Period / Description" name="period" defaultValue="Monthly amortization" required />
            <FormField label="Due Date" name="dueDate" type="date" />
            <FormField label="Amount Paid" name="amount" type="number" defaultValue="10000" min="0" step="0.01" required />
            <FormField label="Penalty" name="penalty" type="number" defaultValue="0" min="0" step="0.01" />
            <FormField
              label="Schedule Status"
              name="scheduleStatus"
              defaultValue="paid"
              selectOptions={scheduleStatusOptions.map((status) => ({ label: formatScheduleStatus(status), value: status }))}
            />
            <FormField label="Date Paid" name="datePaid" type="date" />
            <FormField label="Reference No." name="reference" placeholder="Bank ref, OR no., or cash note" />
            <FormField label="Receipt Image" name="receiptImage" type="file" accept="image/*" className="file:mr-3 file:rounded-md file:border-0 file:bg-[#1A1A2E] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white" />
            <div className="flex items-end justify-end gap-2">
              <button type="button" onClick={() => setMonthlyPaymentTarget(null)} className="rounded-md border border-[#E8E4DC] px-4 py-2 font-semibold text-[#374151]">
                Cancel
              </button>
              <button className="rounded-md bg-[#C9A84C] px-4 py-2 font-bold text-black">Add Payment</button>
            </div>
          </form>
        )}
      </Modal>
      <Modal title="Upload Receipt Image" isOpen={receiptTarget !== null} onClose={() => setReceiptTarget(null)}>
        {receiptTarget && (
          <form onSubmit={saveReceiptUpload} className="space-y-4 text-sm">
            <div className="rounded-lg border border-[#E8E4DC] bg-[#FAF8F5] p-4">
              <InfoRow label="Payment" value={receiptTarget.label} />
            </div>
            <FormField label="Receipt Image" name="receiptImage" type="file" accept="image/*" required className="file:mr-3 file:rounded-md file:border-0 file:bg-[#1A1A2E] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setReceiptTarget(null)} className="rounded-md border border-[#E8E4DC] px-4 py-2 font-semibold text-[#374151]">
                Cancel
              </button>
              <button className="rounded-md bg-[#C9A84C] px-4 py-2 font-bold text-black">Save Image</button>
            </div>
          </form>
        )}
      </Modal>
      <Modal title="Payment Receipt" isOpen={receiptPreview !== null} onClose={() => setReceiptPreview(null)}>
        {receiptPreview && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E8E4DC] bg-[#FAF8F5] p-4 text-sm">
              <InfoRow label="Payment" value={receiptPreview.title} />
              <InfoRow label="File" value={receiptPreview.fileName ?? 'Uploaded receipt image'} />
            </div>
            <div className="overflow-hidden rounded-lg border border-[#E8E4DC] bg-[#111827]">
              <img src={receiptPreview.image} alt={`Receipt for ${receiptPreview.title}`} className="max-h-[70vh] w-full object-contain" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function getPaymentKey(payment: PaymentIdentity) {
  return `${payment.buyer.trim().toLowerCase()}::${payment.unitId.trim().toLowerCase()}`
}

function createPaymentDetail(payment: Payment): PaymentDetail {
  return {
    unitId: payment.unitId,
    buyer: payment.buyer,
    mode: payment.mode,
    dueDay: payment.dueDay,
    monthlyPayments: [],
    paymentMade: payment.paymentMade,
    totalContractPrice: payment.totalContractPrice,
    balance: payment.balance,
    paymentPercentage: payment.paymentPercentage,
    commissionReleasedPercent: payment.commissionReleasedPercent,
  }
}

function upsertPaymentDetail(
  records: PaymentDetail[],
  payment: Payment,
  updateDetail: (detail: PaymentDetail) => PaymentDetail,
) {
  const targetKey = getPaymentKey(payment)
  let found = false
  const nextRecords = records.map((detail) => {
    if (getPaymentKey(detail) !== targetKey) return detail
    found = true
    return updateDetail(detail)
  })

  return found ? nextRecords : [updateDetail(createPaymentDetail(payment)), ...records]
}

function loadPaymentRecords(): PaymentDetail[] {
  try {
    const stored = window.localStorage.getItem(PAYMENT_DETAILS_STORAGE_KEY)
    if (!stored) return paymentDetails.map(normalizePaymentDetail)
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.map(normalizePaymentDetail) : paymentDetails.map(normalizePaymentDetail)
  } catch {
    return paymentDetails.map(normalizePaymentDetail)
  }
}

function persistPaymentRecords(records: PaymentDetail[]) {
  try {
    window.localStorage.setItem(PAYMENT_DETAILS_STORAGE_KEY, JSON.stringify(records))
  } catch {
    return undefined
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Unsupported receipt data.'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export default PaymentsPage
