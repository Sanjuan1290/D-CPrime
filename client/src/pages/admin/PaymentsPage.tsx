import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import FormField from '../../components/admin/FormField'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency, formatDate } from '../../components/admin/formatters'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import {
  useClientUnits,
  useCreatePayment,
  usePaymentSchedules,
  usePayments,
  useUpdatePayment,
} from '../../hooks/useAdminResources'
import type { PaymentPayload, PaymentRecord } from '../../hooks/useAdminResources'
import { useBalances } from '../../hooks/useBalances'
import { cloudinaryFolders, uploadToCloudinary } from '../../lib/cloudinary'

type PaymentsPageProps = {
  initialTab?: 'all' | 'due' | 'overdue'
}

type EditorState = PaymentRecord | 'new' | null

const paymentTypes = ['reservation', 'downpayment', 'monthly', 'legal_misc', 'full_payment', 'other']
const paymentStatuses = ['pending', 'verified', 'rejected']

function PaymentsPage({ initialTab = 'all' }: PaymentsPageProps) {
  const toast = useToast()
  const paymentsQuery = usePayments()
  const balancesQuery = useBalances()
  const clientUnitsQuery = useClientUnits()
  const schedulesQuery = usePaymentSchedules(initialTab === 'overdue' ? { status: 'overdue' } : undefined)
  const createPayment = useCreatePayment()
  const updatePayment = useUpdatePayment()
  const [editor, setEditor] = useState<EditorState>(null)
  const [selectedClientUnitId, setSelectedClientUnitId] = useState<number | null>(null)

  const payments = paymentsQuery.data?.data ?? []
  const balances = balancesQuery.data?.data ?? []
  const clientUnits = clientUnitsQuery.data?.data ?? []
  const schedules = schedulesQuery.data?.data ?? []
  const balanceByClientUnit = useMemo(() => new Map(balances.map((balance) => [balance.client_unit_id, balance])), [balances])
  const overdueClientUnitIds = useMemo(() => new Set(schedules.map((schedule) => schedule.client_unit_id)), [schedules])

  const visibleBalances = useMemo(() => {
    if (initialTab === 'all') return balances
    return balances.filter((balance) => {
      if (Number(balance.balance || 0) <= 0) return false
      if (initialTab === 'overdue') return overdueClientUnitIds.has(balance.client_unit_id)
      return true
    })
  }, [balances, initialTab, overdueClientUnitIds])

  const totals = useMemo(() => {
    const verified = payments.filter((payment) => payment.status === 'verified').reduce((total, payment) => total + Number(payment.amount || 0), 0)
    const pending = payments.filter((payment) => payment.status === 'pending').reduce((total, payment) => total + Number(payment.amount || 0), 0)
    const receivable = balances.reduce((total, balance) => total + Number(balance.balance || 0), 0)
    return { verified, pending, receivable }
  }, [balances, payments])

  function openNewPayment(clientUnitId?: number) {
    setSelectedClientUnitId(clientUnitId ?? null)
    setEditor('new')
  }

  async function savePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const clientUnitId = Number(formData.get('client_unit_id'))
    const balance = balanceByClientUnit.get(clientUnitId)
    const receiptFile = formData.get('receipt') instanceof File && (formData.get('receipt') as File).size > 0 ? (formData.get('receipt') as File) : null
    let receipt_url = editor === 'new' ? null : editor?.receipt_url ?? null
    let receipt_public_id = editor === 'new' ? null : editor?.receipt_public_id ?? null

    if (receiptFile) {
      const upload = await uploadToCloudinary(receiptFile, {
        folder: cloudinaryFolders.receipts({
          buyer: balance?.buyer_name,
          unitId: balance?.unit_id ?? clientUnitId,
        }),
        tags: ['payment_receipt', 'dc_prime'],
      })
      receipt_url = upload.secure_url
      receipt_public_id = upload.public_id
    }

    const status = String(formData.get('status')) as PaymentRecord['status']
    const payload: PaymentPayload = {
      client_unit_id: clientUnitId,
      payment_date: String(formData.get('payment_date')),
      amount: Number(formData.get('amount')) || 0,
      payment_type: String(formData.get('payment_type')) as PaymentRecord['payment_type'],
      payment_method: clean(formData.get('payment_method')),
      bank_name: clean(formData.get('bank_name')),
      reference_no: clean(formData.get('reference_no')),
      status,
      verified_by: numberOrNull(formData.get('verified_by')),
      verified_at: status === 'verified' ? (clean(formData.get('verified_at')) ?? new Date().toISOString().slice(0, 19).replace('T', ' ')) : null,
      remarks: clean(formData.get('remarks')),
      receipt_url,
      receipt_public_id,
    }

    if (!payload.client_unit_id || !payload.payment_date || !payload.amount || !payload.payment_type) {
      toast.error('Client account, date, amount, and payment type are required.')
      return
    }

    try {
      if (editor === 'new') {
        await createPayment.mutateAsync(payload)
      } else if (editor) {
        await updatePayment.mutateAsync({ id: editor.id, ...payload })
      }
      toast.success('Payment saved.')
      setEditor(null)
      setSelectedClientUnitId(null)
    } catch {
      toast.error('Payment could not be saved.')
    }
  }

  const isLoading = paymentsQuery.isLoading || balancesQuery.isLoading || clientUnitsQuery.isLoading || schedulesQuery.isLoading
  const isError = paymentsQuery.isError || balancesQuery.isError || clientUnitsQuery.isError || schedulesQuery.isError

  if (isLoading) return <LoadingSkeleton rows={8} />
  if (isError) {
    return (
      <ErrorState
        message="Payments could not be loaded from MySQL."
        onRetry={() => {
          void paymentsQuery.refetch()
          void balancesQuery.refetch()
          void clientUnitsQuery.refetch()
          void schedulesQuery.refetch()
        }}
      />
    )
  }

  const title = initialTab === 'due' ? 'Due Payments' : initialTab === 'overdue' ? 'Overdue Accounts' : 'Payment Made Tracker'

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Verified Collections" value={formatCurrency(totals.verified)} note="Posted payments" />
        <StatCard label="Pending Verification" value={formatCurrency(totals.pending)} note="Payments waiting for review" />
        <StatCard label="Receivables" value={formatCurrency(totals.receivable)} note="Open balances" />
      </div>

      <Panel
        title={title}
        subtitle={initialTab === 'all' ? 'Editable collection records stored in MySQL' : 'Open accounts from imported balances and SOA schedules'}
        actions={<button onClick={() => openNewPayment()} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white">Record Payment</button>}
      >
        {initialTab === 'all' ? (
          <DataTable
            headers={['Date', 'Client', 'Unit', 'Type', 'Method', 'Reference', 'Amount', 'Status', 'Actions']}
            rows={payments.map((payment) => {
              const balance = balanceByClientUnit.get(payment.client_unit_id)
              return [
                formatDate(payment.payment_date),
                balance?.buyer_name ?? `Account #${payment.client_unit_id}`,
                balance?.unit_id ?? '-',
                titleCase(payment.payment_type),
                payment.payment_method ?? '-',
                payment.reference_no ?? '-',
                formatCurrency(Number(payment.amount || 0)),
                <Badge key={`${payment.id}-status`}>{titleCase(payment.status)}</Badge>,
                <div key={`${payment.id}-actions`} className="flex flex-wrap gap-2">
                  <Link to={`/admin/payments/soa/${payment.client_unit_id}`} className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#374151]">
                    SOA
                  </Link>
                  {payment.receipt_url && (
                    <a href={payment.receipt_url} target="_blank" rel="noreferrer" className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#374151]">
                      Receipt
                    </a>
                  )}
                  <button onClick={() => setEditor(payment)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E]">
                    Edit
                  </button>
                </div>,
              ]
            })}
          />
        ) : (
          <DataTable
            headers={['Client', 'Unit', 'Project', 'Mode', 'Payment Status', 'Paid', 'Balance', 'Actions']}
            rows={visibleBalances.map((balance) => [
              balance.buyer_name,
              balance.unit_id,
              balance.project_name,
              titleCase(balance.mode_of_payment),
              <Badge key={`${balance.client_unit_id}-status`}>{titleCase(balance.payment_status)}</Badge>,
              formatCurrency(Number(balance.total_paid || 0)),
              formatCurrency(Number(balance.balance || 0)),
              <div key={`${balance.client_unit_id}-actions`} className="flex flex-wrap gap-2">
                <button onClick={() => openNewPayment(balance.client_unit_id)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E]">
                  Record
                </button>
                <Link to={`/admin/payments/soa/${balance.client_unit_id}`} className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#374151]">
                  SOA
                </Link>
              </div>,
            ])}
          />
        )}
      </Panel>

      <PaymentModal
        editor={editor}
        selectedClientUnitId={selectedClientUnitId}
        clientUnits={clientUnits}
        balances={balances}
        isSaving={createPayment.isPending || updatePayment.isPending}
        onClose={() => {
          setEditor(null)
          setSelectedClientUnitId(null)
        }}
        onSubmit={savePayment}
      />
    </div>
  )
}

function PaymentModal({
  editor,
  selectedClientUnitId,
  clientUnits,
  balances,
  isSaving,
  onClose,
  onSubmit,
}: {
  editor: EditorState
  selectedClientUnitId: number | null
  clientUnits: Array<{ id: number }>
  balances: Array<{ client_unit_id: number; buyer_name: string; unit_id: string; project_name: string }>
  isSaving: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const payment = editor === 'new' ? null : editor
  const balanceByClientUnit = new Map(balances.map((balance) => [balance.client_unit_id, balance]))
  const selectedValue = payment?.client_unit_id ?? selectedClientUnitId ?? balances[0]?.client_unit_id ?? clientUnits[0]?.id ?? ''
  const accountOptions = (balances.length ? balances.map((balance) => balance.client_unit_id) : clientUnits.map((unit) => unit.id)).map((clientUnitId) => {
    const balance = balanceByClientUnit.get(clientUnitId)
    return {
      value: String(clientUnitId),
      label: balance ? `${balance.buyer_name} | ${balance.unit_id} | ${balance.project_name}` : `Account #${clientUnitId}`,
    }
  })

  return (
    <Modal title={editor === 'new' ? 'Record Payment' : 'Edit Payment'} isOpen={editor !== null} onClose={onClose}>
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <FormField label="Client Account" name="client_unit_id" defaultValue={String(selectedValue)} selectOptions={accountOptions} required />
        <FormField label="Payment Date" name="payment_date" type="date" defaultValue={normalizeDate(payment?.payment_date) || new Date().toISOString().slice(0, 10)} required />
        <FormField label="Amount" name="amount" type="number" defaultValue={String(payment?.amount ?? 0)} required />
        <FormField label="Payment Type" name="payment_type" defaultValue={payment?.payment_type ?? 'monthly'} selectOptions={paymentTypes.map((type) => ({ label: titleCase(type), value: type }))} />
        <FormField label="Payment Method" name="payment_method" defaultValue={payment?.payment_method ?? ''} />
        <FormField label="Bank Name" name="bank_name" defaultValue={payment?.bank_name ?? ''} />
        <FormField label="Reference No." name="reference_no" defaultValue={payment?.reference_no ?? ''} />
        <FormField label="Status" name="status" defaultValue={payment?.status ?? 'pending'} selectOptions={paymentStatuses.map((status) => ({ label: titleCase(status), value: status }))} />
        <FormField label="Verified By User ID" name="verified_by" type="number" defaultValue={payment?.verified_by ? String(payment.verified_by) : ''} />
        <FormField label="Verified At" name="verified_at" type="datetime-local" defaultValue={toDateTimeLocal(payment?.verified_at)} />
        <label className="block text-sm font-semibold text-[#374151]">
          <span className="mb-1.5 block">Receipt File</span>
          <input name="receipt" type="file" accept="image/*,.pdf" className="w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827]" />
        </label>
        <FormField label="Remarks" name="remarks" defaultValue={payment?.remarks ?? ''} textarea />
        <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151]">
            Cancel
          </button>
          <button disabled={isSaving} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
            {isSaving ? 'Saving...' : 'Save Payment'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function titleCase(value?: string | null) {
  return String(value ?? '-').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function normalizeDate(value?: string | null) {
  return value ? value.slice(0, 10) : ''
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return ''
  return value.replace(' ', 'T').slice(0, 16)
}

function clean(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim()
  return text || null
}

function numberOrNull(value: FormDataEntryValue | null) {
  const number = Number(value)
  return Number.isFinite(number) && String(value ?? '').trim() ? number : null
}

export default PaymentsPage
