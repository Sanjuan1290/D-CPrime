import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import FormField from '../../components/admin/FormField'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency, formatDate } from '../../components/admin/formatters'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import { useSoa, useUpdatePaymentSchedule } from '../../hooks/useAdminResources'
import type { PaymentScheduleRecord } from '../../hooks/useAdminResources'

type EditorState = PaymentScheduleRecord | null

const scheduleStatuses = ['unpaid', 'partial', 'paid', 'overdue']

function SoaPage() {
  const { clientId } = useParams()
  const toast = useToast()
  const soaQuery = useSoa(clientId)
  const updateSchedule = useUpdatePaymentSchedule()
  const [editor, setEditor] = useState<EditorState>(null)
  const soa = soaQuery.data

  const totals = useMemo(() => {
    const scheduleTotal = soa?.schedule.reduce((total, item) => total + Number(item.due_amount || 0) + Number(item.penalty || 0), 0) ?? 0
    const paidTotal = soa?.payments.reduce((total, payment) => total + Number(payment.amount || 0), 0) ?? 0
    return { scheduleTotal, paidTotal, balance: scheduleTotal - paidTotal }
  }, [soa])

  async function saveSchedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editor) return

    const formData = new FormData(event.currentTarget)
    try {
      await updateSchedule.mutateAsync({
        id: editor.id,
        client_unit_id: editor.client_unit_id,
        due_date: String(formData.get('due_date')),
        description: clean(formData.get('description')),
        due_amount: Number(formData.get('due_amount')) || 0,
        penalty: Number(formData.get('penalty')) || 0,
        status: String(formData.get('status')) as PaymentScheduleRecord['status'],
      })
      toast.success('SOA schedule updated.')
      await soaQuery.refetch()
      setEditor(null)
    } catch {
      toast.error('SOA schedule could not be saved.')
    }
  }

  if (soaQuery.isLoading) return <LoadingSkeleton rows={8} />
  if (soaQuery.isError || !soa) return <ErrorState message="SOA could not be loaded from MySQL." onRetry={() => void soaQuery.refetch()} />

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Scheduled" value={formatCurrency(totals.scheduleTotal)} note="Due amount plus penalties" />
        <StatCard label="Verified Paid" value={formatCurrency(totals.paidTotal)} note="Posted collections for this account" />
        <StatCard label="Balance" value={formatCurrency(totals.balance)} note="Schedule less verified payments" />
      </div>

      <Panel title="Statement Of Account" subtitle={`${soa.clientUnit.buyer_name} | ${soa.clientUnit.project_name} | ${soa.clientUnit.unit_id}`}>
        <div className="mb-5 grid gap-3 text-sm md:grid-cols-2">
          <InfoRow label="Mode" value={titleCase(soa.clientUnit.mode_of_payment)} />
          <InfoRow label="Account Status" value={<Badge>{titleCase(soa.clientUnit.account_status)}</Badge>} />
          <InfoRow label="Payment Status" value={titleCase(soa.clientUnit.payment_status)} />
          <InfoRow label="Total Contract Price" value={formatCurrency(Number(soa.clientUnit.total_contract_price || 0))} />
        </div>

        <DataTable
          headers={['Due Date', 'Description', 'Due Amount', 'Penalty', 'Status', 'Actions']}
          rows={soa.schedule.map((line) => [
            formatDate(line.due_date),
            line.description ?? '-',
            formatCurrency(Number(line.due_amount || 0)),
            formatCurrency(Number(line.penalty || 0)),
            <Badge key={`${line.id}-status`}>{titleCase(line.status)}</Badge>,
            <button key={line.id} onClick={() => setEditor(line)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E]">
              Edit
            </button>,
          ])}
        />
      </Panel>

      <Panel title="Verified Payments" subtitle="Collections posted against this account">
        <DataTable
          headers={['Date', 'Type', 'Method', 'Reference', 'Amount', 'Status']}
          rows={soa.payments.map((payment) => [
            formatDate(payment.payment_date),
            titleCase(payment.payment_type),
            payment.payment_method ?? '-',
            payment.reference_no ?? '-',
            formatCurrency(Number(payment.amount || 0)),
            <Badge key={payment.id}>{titleCase(payment.status)}</Badge>,
          ])}
        />
      </Panel>

      <Modal title="Edit SOA Line" isOpen={editor !== null} onClose={() => setEditor(null)}>
        {editor && (
          <form onSubmit={saveSchedule} className="grid gap-4 md:grid-cols-2">
            <FormField label="Due Date" name="due_date" type="date" defaultValue={normalizeDate(editor.due_date)} required />
            <FormField label="Description" name="description" defaultValue={editor.description ?? ''} />
            <FormField label="Due Amount" name="due_amount" type="number" defaultValue={String(editor.due_amount ?? 0)} required />
            <FormField label="Penalty" name="penalty" type="number" defaultValue={String(editor.penalty ?? 0)} />
            <FormField label="Status" name="status" defaultValue={editor.status} selectOptions={scheduleStatuses.map((status) => ({ label: titleCase(status), value: status }))} />
            <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
              <button type="button" onClick={() => setEditor(null)} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151]">
                Cancel
              </button>
              <button disabled={updateSchedule.isPending} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
                {updateSchedule.isPending ? 'Saving...' : 'Save Line'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

function normalizeDate(value?: string | null) {
  return value ? value.slice(0, 10) : ''
}

function titleCase(value?: string | null) {
  return String(value ?? '-').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function clean(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim()
  return text || null
}

export default SoaPage
