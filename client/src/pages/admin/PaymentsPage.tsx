import { useState } from 'react'
import type { FormEvent } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import { company, paymentTracker, soaRecords } from '../../data/adminMockData'
import type { Payment } from '../../data/adminMockData'
import { paymentDetails } from '../../data/sourceDetails'

type PaymentsPageProps = {
  initialTab?: 'all' | 'due' | 'overdue'
}

function PaymentsPage({ initialTab = 'all' }: PaymentsPageProps) {
  const toast = useToast()
  const [payments, setPayments] = useState(paymentTracker)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)
  const selectedPaymentDetail = selectedPayment
    ? paymentDetails.find((detail) => detail.unitId === selectedPayment.unitId && detail.buyer === selectedPayment.buyer)
    : undefined
  const soa = soaRecords[0]
  const title =
    initialTab === 'due' ? 'Due Payments' : initialTab === 'overdue' ? 'Overdue Accounts' : 'Payment Made Tracker'
  const visiblePayments = payments.filter((payment) => {
    if (initialTab === 'due') return payment.balance > 0
    if (initialTab === 'overdue') return payment.balance > 0 && payment.dueDay !== undefined
    return true
  })

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

    setPayments((current) =>
      current.map((item) => (item.buyer === editingPayment.buyer && item.unitId === editingPayment.unitId ? payment : item)),
    )
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
    toast.success('Payment voided.')
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

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
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
                headers={['Due Date', 'Description', 'Due Amount', 'Penalty', 'Date Paid', 'Amount Paid', 'Reference', 'Running Balance']}
                rows={soa.schedule.map((line) => [
                  line.dueDate,
                  line.description,
                  formatCurrency(line.dueAmount),
                  formatCurrency(line.penalty),
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

        <Panel title="Acknowledgement Receipt" subtitle="Receipt preview">
          <div className="rounded-lg border border-white/10 bg-black p-5 text-sm leading-7">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">{company.name}</p>
            <h2 className="mt-2 text-xl font-bold">Acknowledgement Receipt</h2>
            <p className="mt-5">
              This is to acknowledge receiving from <strong>{soa.buyer}</strong> the amount of{' '}
              <strong>Ten Thousand Pesos Only</strong> ({formatCurrency(10000)}) as <strong>Reservation Fee</strong> for
              Unit ID: <strong>{soa.unitNo}</strong> in Project: <strong>{company.propertyAddress}</strong>.
            </p>
            <div className="mt-5 space-y-1">
              <InfoRow label="Bank" value="CASH" />
              <InfoRow label="Date" value="01/29/2025" />
              <InfoRow label="Reference Number" value="CASH" />
              <InfoRow label="Broker / PRC No." value="MOJICA, JONATHAN / For encoding" />
              <InfoRow label="Location" value="Indang, Cavite" />
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="border-t border-zinc-400 pt-2">Witness</div>
              <div className="border-t border-zinc-400 pt-2">Principal</div>
              <div className="border-t border-zinc-400 pt-2">Spouse</div>
            </div>
          </div>
        </Panel>
      </div>
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
              <h3 className="mb-3 text-sm font-bold text-zinc-100">Monthly Payment History</h3>
              {selectedPaymentDetail?.monthlyPayments.length ? (
                <DataTable
                  headers={['Period', 'Amount']}
                  rows={selectedPaymentDetail.monthlyPayments.map((payment) => [
                    payment.period,
                    formatCurrency(payment.amount),
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
          <label className="block font-semibold text-zinc-300">
            Buyer
            <input name="buyer" defaultValue="NEW MOCK CLIENT" className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
          </label>
          <label className="block font-semibold text-zinc-300">
            Unit ID
            <input name="unitId" defaultValue="LA-MOCK-01" className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
          </label>
          <label className="block font-semibold text-zinc-300">
            Amount
            <input name="amount" type="number" defaultValue="15000" className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
          </label>
          <label className="block font-semibold text-zinc-300">
            Total Contract Price
            <input name="totalContractPrice" type="number" defaultValue="396000" className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
          </label>
          <label className="block font-semibold text-zinc-300">
            Due Day
            <input name="dueDay" defaultValue="15th" className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
          </label>
          <div className="flex items-end justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(false)}
              className="rounded-md border border-white/10 px-4 py-2 font-semibold text-zinc-300"
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
            <PaymentInput label="Buyer" name="buyer" value={editingPayment.buyer} />
            <PaymentInput label="Unit ID" name="unitId" value={editingPayment.unitId} />
            <label className="block font-semibold text-zinc-300">
              Mode
              <select name="mode" defaultValue={editingPayment.mode} className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white">
                <option>CASH</option>
                <option>INSTALLMENT</option>
              </select>
            </label>
            <PaymentInput label="Due Day" name="dueDay" value={editingPayment.dueDay ?? ''} />
            <PaymentInput label="Payment Made" name="paymentMade" value={String(editingPayment.paymentMade)} type="number" />
            <PaymentInput label="Total Contract Price" name="totalContractPrice" value={String(editingPayment.totalContractPrice)} type="number" />
            <PaymentInput
              label="Commission Released %"
              name="commissionReleasedPercent"
              value={(editingPayment.commissionReleasedPercent * 100).toFixed(2)}
              type="number"
            />
            <div className="flex items-end justify-end gap-2">
              <button type="button" onClick={() => setEditingPayment(null)} className="rounded-md border border-white/10 px-4 py-2 font-semibold text-zinc-300">
                Cancel
              </button>
              <button className="rounded-md bg-[#C9A84C] px-4 py-2 font-bold text-black">Save Payment</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

function PaymentInput({ label, name, value, type = 'text' }: { label: string; name: string; value: string; type?: string }) {
  return (
    <label className="block font-semibold text-zinc-300">
      {label}
      <input name={name} type={type} defaultValue={value} className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white" />
    </label>
  )
}

export default PaymentsPage
