import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import FormField from '../../components/admin/FormField'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency } from '../../components/admin/formatters'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import {
  useCashAdvances,
  useCommissionReleases,
  useCommissions,
  useCreateCashAdvance,
  useCreateCommission,
  useCreateCommissionRelease,
  useUpdateCashAdvance,
  useUpdateCommission,
  useUpdateCommissionRelease,
  useUsers,
} from '../../hooks/useAdminResources'
import type {
  CashAdvancePayload,
  CashAdvanceRecord,
  CommissionPayload,
  CommissionRecord,
  CommissionReleasePayload,
  CommissionReleaseRecord,
} from '../../hooks/useAdminResources'
import { useBalances } from '../../hooks/useBalances'

type CommissionEditor = CommissionRecord | 'new' | null
type ReleaseEditor = CommissionReleaseRecord | 'new' | null
type CashAdvanceEditor = CashAdvanceRecord | 'new' | null

const commissionTypes = ['agent', 'manager', 'broker']
const saleTypes = ['direct', 'distributed']
const commissionStatuses = ['pending', 'approved', 'partially_released', 'released', 'cancelled']
const releaseStages = ['first_20', 'second_40', 'third_60', 'fourth_75', 'retention_25', 'manual']
const cashAdvanceStatuses = ['pending', 'approved', 'partially_deducted', 'deducted', 'disapproved']

function CommissionsPage() {
  const toast = useToast()
  const commissionsQuery = useCommissions()
  const releasesQuery = useCommissionReleases()
  const cashAdvancesQuery = useCashAdvances()
  const usersQuery = useUsers()
  const balancesQuery = useBalances()
  const createCommission = useCreateCommission()
  const updateCommission = useUpdateCommission()
  const createRelease = useCreateCommissionRelease()
  const updateRelease = useUpdateCommissionRelease()
  const createCashAdvance = useCreateCashAdvance()
  const updateCashAdvance = useUpdateCashAdvance()
  const [commissionEditor, setCommissionEditor] = useState<CommissionEditor>(null)
  const [releaseEditor, setReleaseEditor] = useState<ReleaseEditor>(null)
  const [cashAdvanceEditor, setCashAdvanceEditor] = useState<CashAdvanceEditor>(null)

  const commissions = commissionsQuery.data?.data ?? []
  const releases = releasesQuery.data?.data ?? []
  const cashAdvances = cashAdvancesQuery.data?.data ?? []
  const users = usersQuery.data?.data ?? []
  const balances = balancesQuery.data?.data ?? []
  const userById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users])
  const balanceByClientUnit = useMemo(() => new Map(balances.map((balance) => [balance.client_unit_id, balance])), [balances])
  const releasedByCommission = useMemo(() => {
    const map = new Map<number, number>()
    for (const release of releases) {
      map.set(release.commission_id, (map.get(release.commission_id) ?? 0) + Number(release.net_release_amount || 0))
    }
    return map
  }, [releases])
  const totals = useMemo(() => {
    const gross = commissions.reduce((total, commission) => total + Number(commission.gross_commission || 0), 0)
    const released = releases.reduce((total, release) => total + Number(release.net_release_amount || 0), 0)
    const advances = cashAdvances.reduce((total, advance) => total + Number(advance.amount || 0), 0)
    return { gross, released, remaining: gross - released, advances }
  }, [cashAdvances, commissions, releases])

  async function saveCommission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const status = String(formData.get('status')) as CommissionRecord['status']
    const payload: CommissionPayload = {
      client_unit_id: Number(formData.get('client_unit_id')),
      user_id: Number(formData.get('user_id')),
      commission_type: String(formData.get('commission_type')) as CommissionRecord['commission_type'],
      sale_type: String(formData.get('sale_type')) as CommissionRecord['sale_type'],
      rate: Number(formData.get('rate')) || 0,
      gross_commission: Number(formData.get('gross_commission')) || 0,
      status,
      approved_by: numberOrNull(formData.get('approved_by')),
      approved_at: ['approved', 'partially_released', 'released'].includes(status) ? normalizeDateTime(clean(formData.get('approved_at'))) ?? new Date().toISOString().slice(0, 19).replace('T', ' ') : null,
    }

    try {
      if (commissionEditor === 'new') {
        await createCommission.mutateAsync(payload)
      } else if (commissionEditor) {
        await updateCommission.mutateAsync({ id: commissionEditor.id, ...payload })
      }
      toast.success('Commission saved.')
      setCommissionEditor(null)
    } catch {
      toast.error('Commission could not be saved.')
    }
  }

  async function saveRelease(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const gross = Number(formData.get('gross_release_amount')) || 0
    const deduction = Number(formData.get('cash_advance_deduction')) || 0
    const payload: CommissionReleasePayload = {
      commission_id: Number(formData.get('commission_id')),
      release_stage: String(formData.get('release_stage')) as CommissionReleaseRecord['release_stage'],
      release_percentage: numberOrNull(formData.get('release_percentage')),
      gross_release_amount: gross,
      cash_advance_deduction: deduction,
      net_release_amount: Number(formData.get('net_release_amount')) || gross - deduction,
      released_by: Number(formData.get('released_by')),
      released_at: normalizeDateTime(clean(formData.get('released_at'))) ?? new Date().toISOString().slice(0, 19).replace('T', ' '),
      remarks: clean(formData.get('remarks')),
    }

    try {
      if (releaseEditor === 'new') {
        await createRelease.mutateAsync(payload)
      } else if (releaseEditor) {
        await updateRelease.mutateAsync({ id: releaseEditor.id, ...payload })
      }
      toast.success('Commission release saved.')
      setReleaseEditor(null)
    } catch {
      toast.error('Commission release could not be saved.')
    }
  }

  async function saveCashAdvance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const status = String(formData.get('status')) as CashAdvanceRecord['status']
    const payload: CashAdvancePayload = {
      user_id: Number(formData.get('user_id')),
      client_unit_id: numberOrNull(formData.get('client_unit_id')),
      commission_id: numberOrNull(formData.get('commission_id')),
      amount: Number(formData.get('amount')) || 0,
      reason: clean(formData.get('reason')),
      status,
      approved_by: numberOrNull(formData.get('approved_by')),
      approved_at: ['approved', 'partially_deducted', 'deducted'].includes(status) ? normalizeDateTime(clean(formData.get('approved_at'))) ?? new Date().toISOString().slice(0, 19).replace('T', ' ') : null,
    }

    try {
      if (cashAdvanceEditor === 'new') {
        await createCashAdvance.mutateAsync(payload)
      } else if (cashAdvanceEditor) {
        await updateCashAdvance.mutateAsync({ id: cashAdvanceEditor.id, ...payload })
      }
      toast.success('Cash advance saved.')
      setCashAdvanceEditor(null)
    } catch {
      toast.error('Cash advance could not be saved.')
    }
  }

  const isLoading = commissionsQuery.isLoading || releasesQuery.isLoading || cashAdvancesQuery.isLoading || usersQuery.isLoading || balancesQuery.isLoading
  const isError = commissionsQuery.isError || releasesQuery.isError || cashAdvancesQuery.isError || usersQuery.isError || balancesQuery.isError

  if (isLoading) return <LoadingSkeleton rows={8} />
  if (isError) return <ErrorState message="Commissions could not be loaded from MySQL." onRetry={() => window.location.reload()} />

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Gross Commission" value={formatCurrency(totals.gross)} note="Earned commission records" />
        <StatCard label="Released" value={formatCurrency(totals.released)} note="Net releases posted" />
        <StatCard label="Remaining" value={formatCurrency(totals.remaining)} note="Gross less releases" />
        <StatCard label="Cash Advances" value={formatCurrency(totals.advances)} note="Open and historical advances" />
      </div>

      <Panel
        title="Commissions"
        subtitle="Editable commissions imported from company sheets"
        actions={<button onClick={() => setCommissionEditor('new')} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white">Add Commission</button>}
      >
        <DataTable
          headers={['Seller', 'Client / Unit', 'Type', 'Rate', 'Gross', 'Released', 'Remaining', 'Status', 'Actions']}
          rows={commissions.map((commission) => {
            const released = releasedByCommission.get(commission.id) ?? 0
            const balance = balanceByClientUnit.get(commission.client_unit_id)
            return [
              userById.get(commission.user_id)?.full_name ?? `User #${commission.user_id}`,
              balance ? `${balance.buyer_name} | ${balance.unit_id}` : `Account #${commission.client_unit_id}`,
              titleCase(commission.commission_type),
              `${Number(commission.rate || 0).toLocaleString()}%`,
              formatCurrency(Number(commission.gross_commission || 0)),
              formatCurrency(released),
              formatCurrency(Number(commission.gross_commission || 0) - released),
              <Badge key={`${commission.id}-status`}>{titleCase(commission.status)}</Badge>,
              <button key={commission.id} onClick={() => setCommissionEditor(commission)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E]">
                Edit
              </button>,
            ]
          })}
        />
      </Panel>

      <Panel
        title="Commission Releases"
        subtitle="Editable release records and deductions"
        actions={<button onClick={() => setReleaseEditor('new')} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white">Add Release</button>}
      >
        <DataTable
          headers={['Commission', 'Stage', 'Gross', 'Deduction', 'Net', 'Released By', 'Released At', 'Actions']}
          rows={releases.map((release) => [
            `#${release.commission_id}`,
            titleCase(release.release_stage),
            formatCurrency(Number(release.gross_release_amount || 0)),
            formatCurrency(Number(release.cash_advance_deduction || 0)),
            formatCurrency(Number(release.net_release_amount || 0)),
            userById.get(release.released_by)?.full_name ?? `User #${release.released_by}`,
            release.released_at ? new Date(release.released_at).toLocaleDateString('en-PH') : '-',
            <button key={release.id} onClick={() => setReleaseEditor(release)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E]">
              Edit
            </button>,
          ])}
        />
      </Panel>

      <Panel
        title="Cash Advances"
        subtitle="Editable advances connected to sellers and commissions"
        actions={<button onClick={() => setCashAdvanceEditor('new')} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white">Add Cash Advance</button>}
      >
        <DataTable
          headers={['Seller', 'Amount', 'Status', 'Related Account', 'Commission', 'Reason', 'Actions']}
          rows={cashAdvances.map((advance) => [
            userById.get(advance.user_id)?.full_name ?? `User #${advance.user_id}`,
            formatCurrency(Number(advance.amount || 0)),
            <Badge key={`${advance.id}-status`}>{titleCase(advance.status)}</Badge>,
            advance.client_unit_id ? balanceByClientUnit.get(advance.client_unit_id)?.unit_id ?? `Account #${advance.client_unit_id}` : '-',
            advance.commission_id ?? '-',
            advance.reason ?? '-',
            <button key={advance.id} onClick={() => setCashAdvanceEditor(advance)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E]">
              Edit
            </button>,
          ])}
        />
      </Panel>

      <CommissionModal editor={commissionEditor} balances={balances} users={users} isSaving={createCommission.isPending || updateCommission.isPending} onClose={() => setCommissionEditor(null)} onSubmit={saveCommission} />
      <ReleaseModal editor={releaseEditor} commissions={commissions} users={users} isSaving={createRelease.isPending || updateRelease.isPending} onClose={() => setReleaseEditor(null)} onSubmit={saveRelease} />
      <CashAdvanceModal editor={cashAdvanceEditor} commissions={commissions} balances={balances} users={users} isSaving={createCashAdvance.isPending || updateCashAdvance.isPending} onClose={() => setCashAdvanceEditor(null)} onSubmit={saveCashAdvance} />
    </div>
  )
}

function CommissionModal({
  editor,
  balances,
  users,
  isSaving,
  onClose,
  onSubmit,
}: {
  editor: CommissionEditor
  balances: Array<{ client_unit_id: number; buyer_name: string; unit_id: string }>
  users: Array<{ id: number; full_name: string; role: string }>
  isSaving: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const commission = editor === 'new' ? null : editor
  const sellers = users.filter((user) => ['agent', 'broker', 'manager'].includes(user.role))
  return (
    <Modal title={editor === 'new' ? 'Add Commission' : 'Edit Commission'} isOpen={editor !== null} onClose={onClose}>
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <FormField label="Client Account" name="client_unit_id" defaultValue={String(commission?.client_unit_id ?? balances[0]?.client_unit_id ?? '')} selectOptions={balances.map((balance) => ({ label: `${balance.buyer_name} | ${balance.unit_id}`, value: String(balance.client_unit_id) }))} required />
        <FormField label="Seller" name="user_id" defaultValue={String(commission?.user_id ?? sellers[0]?.id ?? '')} selectOptions={sellers.map((user) => ({ label: `${user.full_name} (${titleCase(user.role)})`, value: String(user.id) }))} required />
        <FormField label="Commission Type" name="commission_type" defaultValue={commission?.commission_type ?? 'agent'} selectOptions={commissionTypes.map((type) => ({ label: titleCase(type), value: type }))} />
        <FormField label="Sale Type" name="sale_type" defaultValue={commission?.sale_type ?? 'distributed'} selectOptions={saleTypes.map((type) => ({ label: titleCase(type), value: type }))} />
        <FormField label="Rate %" name="rate" type="number" defaultValue={String(commission?.rate ?? 0)} />
        <FormField label="Gross Commission" name="gross_commission" type="number" defaultValue={String(commission?.gross_commission ?? 0)} />
        <FormField label="Status" name="status" defaultValue={commission?.status ?? 'pending'} selectOptions={commissionStatuses.map((status) => ({ label: titleCase(status), value: status }))} />
        <FormField label="Approved By User ID" name="approved_by" type="number" defaultValue={commission?.approved_by ? String(commission.approved_by) : ''} />
        <FormField label="Approved At" name="approved_at" type="datetime-local" defaultValue={toDateTimeLocal(commission?.approved_at)} />
        <SubmitActions isSaving={isSaving} onClose={onClose} label="Save Commission" />
      </form>
    </Modal>
  )
}

function ReleaseModal({
  editor,
  commissions,
  users,
  isSaving,
  onClose,
  onSubmit,
}: {
  editor: ReleaseEditor
  commissions: CommissionRecord[]
  users: Array<{ id: number; full_name: string }>
  isSaving: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const release = editor === 'new' ? null : editor
  return (
    <Modal title={editor === 'new' ? 'Add Release' : 'Edit Release'} isOpen={editor !== null} onClose={onClose}>
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <FormField label="Commission" name="commission_id" defaultValue={String(release?.commission_id ?? commissions[0]?.id ?? '')} selectOptions={commissions.map((commission) => ({ label: `#${commission.id} | ${titleCase(commission.commission_type)} | ${formatCurrency(Number(commission.gross_commission || 0))}`, value: String(commission.id) }))} required />
        <FormField label="Stage" name="release_stage" defaultValue={release?.release_stage ?? 'manual'} selectOptions={releaseStages.map((stage) => ({ label: titleCase(stage), value: stage }))} />
        <FormField label="Release %" name="release_percentage" type="number" defaultValue={release?.release_percentage ? String(release.release_percentage) : ''} />
        <FormField label="Gross Release" name="gross_release_amount" type="number" defaultValue={String(release?.gross_release_amount ?? 0)} required />
        <FormField label="Cash Advance Deduction" name="cash_advance_deduction" type="number" defaultValue={String(release?.cash_advance_deduction ?? 0)} />
        <FormField label="Net Release" name="net_release_amount" type="number" defaultValue={String(release?.net_release_amount ?? 0)} />
        <FormField label="Released By" name="released_by" defaultValue={String(release?.released_by ?? users[0]?.id ?? '')} selectOptions={users.map((user) => ({ label: user.full_name, value: String(user.id) }))} required />
        <FormField label="Released At" name="released_at" type="datetime-local" defaultValue={toDateTimeLocal(release?.released_at) || new Date().toISOString().slice(0, 16)} />
        <FormField label="Remarks" name="remarks" defaultValue={release?.remarks ?? ''} textarea />
        <SubmitActions isSaving={isSaving} onClose={onClose} label="Save Release" />
      </form>
    </Modal>
  )
}

function CashAdvanceModal({
  editor,
  commissions,
  balances,
  users,
  isSaving,
  onClose,
  onSubmit,
}: {
  editor: CashAdvanceEditor
  commissions: CommissionRecord[]
  balances: Array<{ client_unit_id: number; buyer_name: string; unit_id: string }>
  users: Array<{ id: number; full_name: string; role: string }>
  isSaving: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const advance = editor === 'new' ? null : editor
  const sellers = users.filter((user) => ['agent', 'broker', 'manager'].includes(user.role))
  return (
    <Modal title={editor === 'new' ? 'Add Cash Advance' : 'Edit Cash Advance'} isOpen={editor !== null} onClose={onClose}>
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <FormField label="Seller" name="user_id" defaultValue={String(advance?.user_id ?? sellers[0]?.id ?? '')} selectOptions={sellers.map((user) => ({ label: `${user.full_name} (${titleCase(user.role)})`, value: String(user.id) }))} required />
        <FormField label="Amount" name="amount" type="number" defaultValue={String(advance?.amount ?? 0)} required />
        <FormField label="Client Account" name="client_unit_id" defaultValue={advance?.client_unit_id ? String(advance.client_unit_id) : ''} selectOptions={[{ label: 'None', value: '' }, ...balances.map((balance) => ({ label: `${balance.buyer_name} | ${balance.unit_id}`, value: String(balance.client_unit_id) }))]} />
        <FormField label="Commission" name="commission_id" defaultValue={advance?.commission_id ? String(advance.commission_id) : ''} selectOptions={[{ label: 'None', value: '' }, ...commissions.map((commission) => ({ label: `#${commission.id} | ${titleCase(commission.commission_type)}`, value: String(commission.id) }))]} />
        <FormField label="Status" name="status" defaultValue={advance?.status ?? 'pending'} selectOptions={cashAdvanceStatuses.map((status) => ({ label: titleCase(status), value: status }))} />
        <FormField label="Approved By User ID" name="approved_by" type="number" defaultValue={advance?.approved_by ? String(advance.approved_by) : ''} />
        <FormField label="Approved At" name="approved_at" type="datetime-local" defaultValue={toDateTimeLocal(advance?.approved_at)} />
        <FormField label="Reason" name="reason" defaultValue={advance?.reason ?? ''} textarea />
        <SubmitActions isSaving={isSaving} onClose={onClose} label="Save Cash Advance" />
      </form>
    </Modal>
  )
}

function SubmitActions({ isSaving, onClose, label }: { isSaving: boolean; onClose: () => void; label: string }) {
  return (
    <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
      <button type="button" onClick={onClose} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151]">
        Cancel
      </button>
      <button disabled={isSaving} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
        {isSaving ? 'Saving...' : label}
      </button>
    </div>
  )
}

function titleCase(value?: string | null) {
  return String(value ?? '-').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return ''
  return value.replace(' ', 'T').slice(0, 16)
}

function normalizeDateTime(value?: string | null) {
  return value ? value.replace('T', ' ') : null
}

function clean(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim()
  return text || null
}

function numberOrNull(value: FormDataEntryValue | null) {
  const number = Number(value)
  return Number.isFinite(number) && String(value ?? '').trim() ? number : null
}

export default CommissionsPage
