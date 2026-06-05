import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/admin/Badge'
import ConfirmModal from '../../components/admin/ConfirmModal'
import DataTable from '../../components/admin/DataTable'
import FormField from '../../components/admin/FormField'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import {
  agents,
  commissionRules as initialCommissionRules,
  commissions,
  getNextMockId,
  mockDbCashAdvanceDeductions,
  mockDbCashAdvances,
  mockDbCommissions,
  mockDbCommissionReleases,
  mockDbUsers,
  projects,
} from '../../data/adminMockData'
import type { CommissionRule, MockDbCashAdvance, MockDbCashAdvanceDeduction, MockDbCommissionRelease } from '../../data/adminMockData'
import { commissionDetails } from '../../data/sourceDetails'
import type { CommissionDetail, CommissionPartyRelease } from '../../data/sourceDetails'

const CASH_ADVANCES_STORAGE_KEY = 'dcprime_cash_advances'
const CASH_ADVANCE_DEDUCTIONS_STORAGE_KEY = 'dcprime_cash_advance_deductions'
const COMMISSION_RELEASES_STORAGE_KEY = 'dcprime_commission_releases'

function timestamp() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function CommissionsPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const [tracker, setTracker] = useState(commissions)
  const [rules, setRules] = useState<CommissionRule[]>(() => {
    const saved = localStorage.getItem('dcprime_commission_rules')
    return saved ? (JSON.parse(saved) as CommissionRule[]) : initialCommissionRules
  })
  const [selectedRule, setSelectedRule] = useState<CommissionRule | null>(null)
  const [selectedDetail, setSelectedDetail] = useState<CommissionDetail | null>(null)
  const [rulePendingDelete, setRulePendingDelete] = useState<CommissionRule | null>(null)
  const [cashAdvances, setCashAdvances] = useState<MockDbCashAdvance[]>(() => loadRows(CASH_ADVANCES_STORAGE_KEY, mockDbCashAdvances))
  const [cashAdvanceDeductions, setCashAdvanceDeductions] = useState<MockDbCashAdvanceDeduction[]>(() =>
    loadRows(CASH_ADVANCE_DEDUCTIONS_STORAGE_KEY, mockDbCashAdvanceDeductions),
  )
  const [commissionReleases, setCommissionReleases] = useState<MockDbCommissionRelease[]>(() => loadRows(COMMISSION_RELEASES_STORAGE_KEY, mockDbCommissionReleases))
  const [isCashAdvanceModalOpen, setIsCashAdvanceModalOpen] = useState(false)
  const [deductionTarget, setDeductionTarget] = useState<MockDbCashAdvance | null>(null)
  const totalCommissionPayable = commissionDetails.reduce((total, detail) => total + detail.manager.commission + detail.agent.commission, 0)
  const totalCommissionReleased = commissionDetails.reduce(
    (total, detail) =>
      total +
      detail.manager.firstRelease20 +
      detail.manager.secondRelease40 +
      detail.manager.thirdRelease60 +
      detail.manager.fourthRelease75 +
      detail.agent.firstRelease20 +
      detail.agent.secondRelease40 +
      detail.agent.thirdRelease60 +
      detail.agent.fourthRelease75,
    0,
  )
  const totalCommissionRemaining = commissionDetails.reduce((total, detail) => total + detail.manager.totalRemaining + detail.agent.totalRemaining, 0)
  const totalCashAdvance = cashAdvances.reduce((total, advance) => total + advance.amount, 0)
  const totalCashAdvanceDeducted = cashAdvanceDeductions.reduce((total, deduction) => total + deduction.deducted_amount, 0)
  const totalRetention = commissionDetails.reduce((total, detail) => total + detail.manager.retention25 + detail.agent.retention25, 0)
  const sellers = mockDbUsers.filter((user) => ['agent', 'broker', 'manager'].includes(user.role) && user.status === 'active')

  useEffect(() => {
    localStorage.setItem('dcprime_commission_rules', JSON.stringify(rules))
  }, [rules])

  useEffect(() => {
    localStorage.setItem(CASH_ADVANCES_STORAGE_KEY, JSON.stringify(cashAdvances))
  }, [cashAdvances])

  useEffect(() => {
    localStorage.setItem(CASH_ADVANCE_DEDUCTIONS_STORAGE_KEY, JSON.stringify(cashAdvanceDeductions))
  }, [cashAdvanceDeductions])

  useEffect(() => {
    localStorage.setItem(COMMISSION_RELEASES_STORAGE_KEY, JSON.stringify(commissionReleases))
  }, [commissionReleases])

  function openRule(rule?: CommissionRule) {
    setSelectedRule(
      rule ?? {
        id: `rule-${Date.now()}`,
        projectId: projects[0].id,
        agentId: agents[0].id,
        agentRate: 0.05,
        managerRate: 0.02,
        releaseThreshold: 0.3,
        retentionRate: 0.25,
        status: 'Active',
      },
    )
  }

  function saveRule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedRule) return

    const formData = new FormData(event.currentTarget)
    const rule: CommissionRule = {
      ...selectedRule,
      projectId: String(formData.get('projectId')),
      agentId: String(formData.get('agentId')),
      agentRate: Number(formData.get('agentRate')) / 100,
      managerRate: Number(formData.get('managerRate')) / 100,
      releaseThreshold: Number(formData.get('releaseThreshold')) / 100,
      retentionRate: Number(formData.get('retentionRate')) / 100,
      status: String(formData.get('status')) as CommissionRule['status'],
    }

    setRules((current) => {
      const exists = current.some((item) => item.id === rule.id)
      return exists ? current.map((item) => (item.id === rule.id ? rule : item)) : [rule, ...current]
    })
    setSelectedRule(null)
    toast.success('Commission rule saved.')
  }

  function deleteRule() {
    if (!rulePendingDelete) return

    setRules((current) => current.filter((item) => item.id !== rulePendingDelete.id))
    setRulePendingDelete(null)
    toast.success('Commission rule deleted.')
  }

  function approveCommission(unitId: string) {
    setTracker((current) =>
      current.map((commission) =>
        commission.unitId === unitId ? { ...commission, releasedPercent: Math.max(commission.releasedPercent, 0.75) } : commission,
      ),
    )
    toast.success('Commission approved.')
  }

  function releaseCommission(unitId: string) {
    setTracker((current) =>
      current.map((commission) => (commission.unitId === unitId ? { ...commission, releasedPercent: 1 } : commission)),
    )
    toast.success('Commission released.')
  }

  function getProjectName(projectId: string) {
    return projects.find((project) => project.id === projectId)?.name ?? projectId
  }

  function getAgentName(agentId: string) {
    return agents.find((agent) => agent.id === agentId)?.fullName ?? agentId
  }

  function getCommissionDetail(unitId: string, buyer: string) {
    return commissionDetails.find((detail) => detail.unitId === unitId && detail.buyer === buyer)
  }

  function userName(userId: number) {
    return mockDbUsers.find((user) => user.id === userId)?.full_name ?? `User #${userId}`
  }

  function commissionLabel(commissionId: number | null) {
    if (!commissionId) return 'Unlinked'
    const commission = mockDbCommissions.find((item) => item.id === commissionId)
    if (!commission) return `Commission #${commissionId}`
    return `${titleCase(commission.commission_type)} - ${userName(commission.user_id)} (${formatCurrency(commission.gross_commission)})`
  }

  function releaseLabel(releaseId: number) {
    const release = commissionReleases.find((item) => item.id === releaseId)
    if (!release) return `Release #${releaseId}`
    return `#${release.id} ${titleCase(release.release_stage)} - ${formatCurrency(release.net_release_amount)} net`
  }

  function deductedAmount(cashAdvanceId: number) {
    return cashAdvanceDeductions
      .filter((deduction) => deduction.cash_advance_id === cashAdvanceId)
      .reduce((total, deduction) => total + deduction.deducted_amount, 0)
  }

  function remainingAdvance(cashAdvance: MockDbCashAdvance) {
    return Math.max(cashAdvance.amount - deductedAmount(cashAdvance.id), 0)
  }

  function saveCashAdvance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const amount = Number(formData.get('amount'))

    if (!amount || amount <= 0) {
      toast.error('Enter a valid cash advance amount.')
      return
    }

    const commissionId = Number(formData.get('commission_id')) || null
    const commission = commissionId ? mockDbCommissions.find((item) => item.id === commissionId) : null
    const cashAdvance: MockDbCashAdvance = {
      id: getNextMockId(cashAdvances),
      user_id: Number(formData.get('user_id')),
      client_unit_id: commission?.client_unit_id ?? null,
      commission_id: commission?.id ?? null,
      amount,
      reason: String(formData.get('reason') || '').trim() || null,
      status: 'pending',
      approved_by: null,
      approved_at: null,
      created_at: timestamp(),
      updated_at: timestamp(),
    }

    setCashAdvances((current) => [cashAdvance, ...current])
    setIsCashAdvanceModalOpen(false)
    toast.success('Cash advance request added.')
  }

  function updateCashAdvance(cashAdvanceId: number, updates: Partial<MockDbCashAdvance>) {
    setCashAdvances((current) =>
      current.map((advance) => (advance.id === cashAdvanceId ? { ...advance, ...updates, updated_at: timestamp() } : advance)),
    )
  }

  function approveCashAdvance(cashAdvance: MockDbCashAdvance) {
    updateCashAdvance(cashAdvance.id, { status: 'approved', approved_by: 1, approved_at: timestamp() })
    toast.success('Cash advance approved.')
  }

  function disapproveCashAdvance(cashAdvance: MockDbCashAdvance) {
    updateCashAdvance(cashAdvance.id, { status: 'disapproved', approved_by: 1, approved_at: timestamp() })
    toast.success('Cash advance disapproved.')
  }

  function applyCashAdvanceDeduction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!deductionTarget) return

    const formData = new FormData(event.currentTarget)
    const commissionReleaseId = Number(formData.get('commission_release_id'))
    const amount = Number(formData.get('amount'))
    const release = commissionReleases.find((item) => item.id === commissionReleaseId)

    if (!release || !amount || amount <= 0) {
      toast.error('Choose a release and enter a valid deduction amount.')
      return
    }

    const remaining = remainingAdvance(deductionTarget)
    if (amount > remaining) {
      toast.error('Deduction exceeds the remaining cash advance balance.')
      return
    }

    if (amount > release.net_release_amount) {
      toast.error('Deduction exceeds the release net amount.')
      return
    }

    const deduction: MockDbCashAdvanceDeduction = {
      id: getNextMockId(cashAdvanceDeductions),
      cash_advance_id: deductionTarget.id,
      commission_release_id: release.id,
      deducted_amount: amount,
      created_at: timestamp(),
    }
    const nextRemaining = remaining - amount

    setCashAdvanceDeductions((current) => [deduction, ...current])
    setCommissionReleases((current) =>
      current.map((item) =>
        item.id === release.id
          ? {
              ...item,
              cash_advance_deduction: item.cash_advance_deduction + amount,
              net_release_amount: Math.max(item.net_release_amount - amount, 0),
            }
          : item,
      ),
    )
    updateCashAdvance(deductionTarget.id, { status: nextRemaining <= 0 ? 'deducted' : 'partially_deducted' })
    setDeductionTarget(null)
    toast.success('Cash advance deduction applied.')
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Commission Payable" value={formatCurrency(totalCommissionPayable)} note="Manager + agent commissions" />
        <StatCard label="Released" value={formatCurrency(totalCommissionReleased)} note="1st to 4th release total" />
        <StatCard label="Remaining" value={formatCurrency(totalCommissionRemaining)} note="Total remaining from workbook" />
        <StatCard label="Retention" value={formatCurrency(totalRetention)} note="25% retention total" />
        <StatCard label="Cash Advance" value={formatCurrency(totalCashAdvance)} note={`${formatCurrency(totalCashAdvanceDeducted)} deducted`} />
      </div>

      <Panel title="Commission Settings" subtitle="Admin-controlled commission rules by project and agent">
        <div className="mb-5 flex justify-end">
          <button onClick={() => openRule()} className="rounded-lg bg-[#C9A84C] px-4 py-2 text-sm font-bold text-[#1A1A2E] shadow-sm hover:bg-[#B9973C]">
            Add Rule
          </button>
        </div>
        <DataTable
          headers={['Project', 'Agent', 'Agent Rate', 'Manager Rate', 'Release Threshold', 'Retention', 'Status', 'Action']}
          rows={rules.map((rule) => [
            getProjectName(rule.projectId),
            getAgentName(rule.agentId),
            formatPercent(rule.agentRate),
            formatPercent(rule.managerRate),
            formatPercent(rule.releaseThreshold),
            formatPercent(rule.retentionRate),
            <Badge key={`${rule.id}-status`}>{rule.status}</Badge>,
            <div key={`${rule.id}-actions`} className="flex gap-2">
              <button
                onClick={() => openRule(rule)}
                className="rounded-lg border border-[#C9A84C]/40 px-3 py-1 text-xs font-semibold text-[#9A7A22] hover:bg-[#C9A84C]/10"
              >
                Edit
              </button>
              <button
                onClick={() => setRulePendingDelete(rule)}
                className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
              >
                Delete
              </button>
            </div>,
          ])}
        />
      </Panel>

      <Panel title="Commission Tracker" subtitle="Manager and agent commission rows from workbook">
        <DataTable
          headers={['Buyer', 'Unit', 'Agent', 'Manager', 'Net Selling Price', 'Agent Commission', 'Released', 'Action']}
          rows={tracker.map((commission) => [
            commission.buyer,
            commission.unitId,
            <div key={`${commission.unitId}-agent`} className="flex items-center gap-2">
              <span>{commission.agent}</span>
              <button onClick={() => navigate('/admin/people')} className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] font-semibold text-[#374151] hover:bg-gray-100">
                View Agent
              </button>
            </div>,
            commission.manager,
            formatCurrency(commission.netSellingPrice),
            formatCurrency(commission.agentCommission),
            formatPercent(commission.releasedPercent),
            <div key={`${commission.unitId}-actions`} className="flex gap-2">
              <button
                onClick={() => {
                  const detail = getCommissionDetail(commission.unitId, commission.buyer)
                  if (detail) setSelectedDetail(detail)
                }}
                className="rounded-lg border border-[#E8E4DC] px-3 py-1 text-xs font-semibold text-[#374151] hover:bg-[#F8F7F4]"
              >
                Details
              </button>
              <button
                onClick={() => approveCommission(commission.unitId)}
                className="rounded-lg border border-[#C9A84C]/40 px-3 py-1 text-xs font-semibold text-[#9A7A22] hover:bg-[#C9A84C]/10"
              >
                Approve
              </button>
              <button
                onClick={() => releaseCommission(commission.unitId)}
                className="rounded-lg border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Release
              </button>
            </div>,
          ])}
        />
      </Panel>

      <Panel title="Cash Advances" subtitle="Requests, approvals, and deductions against commission releases">
        <div className="mb-5 flex justify-end">
          <button onClick={() => setIsCashAdvanceModalOpen(true)} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white hover:bg-[#2A2A4E]">
            Add Cash Advance
          </button>
        </div>
        <DataTable
          searchable={false}
          headers={['Seller', 'Amount', 'Deducted', 'Remaining', 'Status', 'Linked Commission', 'Created', 'Actions']}
          rows={cashAdvances.map((advance) => {
            const remaining = remainingAdvance(advance)
            return [
              userName(advance.user_id),
              formatCurrency(advance.amount),
              formatCurrency(deductedAmount(advance.id)),
              formatCurrency(remaining),
              <Badge key={`${advance.id}-status`}>{titleCase(advance.status)}</Badge>,
              commissionLabel(advance.commission_id),
              advance.created_at,
              <div key={`${advance.id}-actions`} className="flex flex-wrap gap-2">
                {advance.status === 'pending' && (
                  <>
                    <button onClick={() => approveCashAdvance(advance)} className="rounded-lg border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
                      Approve
                    </button>
                    <button onClick={() => disapproveCashAdvance(advance)} className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50">
                      Disapprove
                    </button>
                  </>
                )}
                {(advance.status === 'approved' || advance.status === 'partially_deducted') && remaining > 0 && (
                  <button onClick={() => setDeductionTarget(advance)} className="rounded-lg border border-[#C9A84C]/40 px-3 py-1 text-xs font-semibold text-[#9A7A22] hover:bg-[#C9A84C]/10">
                    Deduct
                  </button>
                )}
              </div>,
            ]
          })}
        />

        <div className="mt-5">
          <DataTable
            searchable={false}
            headers={['Cash Advance', 'Commission Release', 'Deducted Amount', 'Date']}
            rows={cashAdvanceDeductions.map((deduction) => [
              `Advance #${deduction.cash_advance_id} - ${userName(cashAdvances.find((advance) => advance.id === deduction.cash_advance_id)?.user_id ?? 0)}`,
              releaseLabel(deduction.commission_release_id),
              formatCurrency(deduction.deducted_amount),
              deduction.created_at,
            ])}
          />
        </div>
      </Panel>

      <Modal title="Commission Rule" isOpen={selectedRule !== null} onClose={() => setSelectedRule(null)}>
        {selectedRule && (
          <form onSubmit={saveRule} className="grid gap-4 text-sm md:grid-cols-2">
            <label className="block font-semibold text-[#374151]">
              Project
              <select
                name="projectId"
                defaultValue={selectedRule.projectId}
                className="mt-2 w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-3 text-[#111827] outline-none focus:border-[#C9A84C]"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block font-semibold text-[#374151]">
              Agent
              <select
                name="agentId"
                defaultValue={selectedRule.agentId}
                className="mt-2 w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-3 text-[#111827] outline-none focus:border-[#C9A84C]"
              >
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.fullName}
                  </option>
                ))}
              </select>
            </label>
            <PercentInput label="Agent Rate" name="agentRate" value={selectedRule.agentRate} />
            <PercentInput label="Manager Rate" name="managerRate" value={selectedRule.managerRate} />
            <PercentInput label="Release Threshold" name="releaseThreshold" value={selectedRule.releaseThreshold} />
            <PercentInput label="Retention Rate" name="retentionRate" value={selectedRule.retentionRate} />
            <label className="block font-semibold text-[#374151]">
              Status
              <select
                name="status"
                defaultValue={selectedRule.status}
                className="mt-2 w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-3 text-[#111827] outline-none focus:border-[#C9A84C]"
              >
                <option>Active</option>
                <option>Paused</option>
              </select>
            </label>
            <div className="flex items-end justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedRule(null)}
                className="rounded-lg border border-[#E8E4DC] px-4 py-2 font-semibold text-[#374151] hover:bg-[#F8F7F4]"
              >
                Cancel
              </button>
              <button className="rounded-lg bg-[#C9A84C] px-4 py-2 font-bold text-[#1A1A2E] hover:bg-[#B9973C]">Save Rule</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal title="Commission Release Breakdown" isOpen={selectedDetail !== null} onClose={() => setSelectedDetail(null)}>
        {selectedDetail && (
          <div className="space-y-5">
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <InfoRow label="Buyer" value={selectedDetail.buyer} />
              <InfoRow label="Unit" value={selectedDetail.unitId} />
              <InfoRow label="Mode" value={selectedDetail.mode || '-'} />
              <InfoRow label="Sale Type" value={selectedDetail.saleType || '-'} />
              <InfoRow label="Net Selling Price" value={formatCurrency(selectedDetail.netSellingPrice)} />
              <InfoRow label="Cash Kaliwaan" value={formatCurrency(selectedDetail.cashKaliwaan)} />
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <ReleaseCard title="Manager Release" release={selectedDetail.manager} />
              <ReleaseCard title="Agent Release" release={selectedDetail.agent} />
            </div>
          </div>
        )}
      </Modal>

      <Modal title="Cash Advance Request" isOpen={isCashAdvanceModalOpen} onClose={() => setIsCashAdvanceModalOpen(false)}>
        <form onSubmit={saveCashAdvance} className="grid gap-4 text-sm md:grid-cols-2">
          <FormField
            label="Seller"
            name="user_id"
            required
            selectOptions={sellers.map((seller) => ({ label: `${seller.full_name} (${titleCase(seller.role)})`, value: String(seller.id) }))}
          />
          <FormField
            label="Linked Commission"
            name="commission_id"
            selectOptions={[
              { label: 'Unlinked', value: '' },
              ...mockDbCommissions.map((commission) => ({ label: commissionLabel(commission.id), value: String(commission.id) })),
            ]}
          />
          <FormField label="Amount" name="amount" type="number" min="0" step="0.01" defaultValue="5000" required />
          <div className="md:col-span-2">
            <FormField label="Reason" name="reason" textarea placeholder="Transportation, processing allowance, or advance note" />
          </div>
          <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
            <button type="button" onClick={() => setIsCashAdvanceModalOpen(false)} className="rounded-lg border border-[#E8E4DC] px-4 py-2 font-semibold text-[#374151] hover:bg-[#F8F7F4]">
              Cancel
            </button>
            <button className="rounded-lg bg-[#1A1A2E] px-4 py-2 font-bold text-white hover:bg-[#2A2A4E]">Save Request</button>
          </div>
        </form>
      </Modal>

      <Modal title="Apply Cash Advance Deduction" isOpen={deductionTarget !== null} onClose={() => setDeductionTarget(null)}>
        {deductionTarget && (
          <form onSubmit={applyCashAdvanceDeduction} className="grid gap-4 text-sm md:grid-cols-2">
            <div className="rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] p-4 md:col-span-2">
              <InfoRow label="Seller" value={userName(deductionTarget.user_id)} />
              <InfoRow label="Remaining Advance" value={formatCurrency(remainingAdvance(deductionTarget))} />
            </div>
            <FormField
              label="Commission Release"
              name="commission_release_id"
              required
              selectOptions={commissionReleases.map((release) => ({ label: releaseLabel(release.id), value: String(release.id) }))}
            />
            <FormField
              label="Deduction Amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              defaultValue={String(Math.min(remainingAdvance(deductionTarget), commissionReleases[0]?.net_release_amount ?? 0))}
              required
            />
            <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
              <button type="button" onClick={() => setDeductionTarget(null)} className="rounded-lg border border-[#E8E4DC] px-4 py-2 font-semibold text-[#374151] hover:bg-[#F8F7F4]">
                Cancel
              </button>
              <button className="rounded-lg bg-[#1A1A2E] px-4 py-2 font-bold text-white hover:bg-[#2A2A4E]">Apply Deduction</button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmModal
        title="Delete Commission Rule"
        message={`Delete the commission rule for ${rulePendingDelete ? getAgentName(rulePendingDelete.agentId) : 'this agent'}? This only changes the mock data in this browser.`}
        confirmLabel="Delete Rule"
        isOpen={rulePendingDelete !== null}
        onClose={() => setRulePendingDelete(null)}
        onConfirm={deleteRule}
      />
    </div>
  )
}

function ReleaseCard({ title, release }: { title: string; release: CommissionPartyRelease }) {
  const released =
    release.firstRelease20 + release.secondRelease40 + release.thirdRelease60 + release.fourthRelease75

  return (
    <section className="rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] p-4">
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-[#E8E4DC] pb-3">
        <div>
          <h3 className="font-bold text-[#1A1A2E]">{title}</h3>
          <p className="mt-1 text-xs text-[#6B7280]">{release.name || '-'}</p>
        </div>
        <Badge>{formatPercent(release.totalReceivedPercent)}</Badge>
      </div>
      <div className="space-y-1 text-sm">
        <InfoRow label="Rate" value={formatPercent(release.rate)} />
        <InfoRow label="Commission" value={formatCurrency(release.commission)} />
        <InfoRow label="Payment %" value={formatPercent(release.paymentPercentage)} />
        <InfoRow label="1st Release 20%" value={formatCurrency(release.firstRelease20)} />
        <InfoRow label="2nd Release 40%" value={formatCurrency(release.secondRelease40)} />
        <InfoRow label="3rd Release 60%" value={formatCurrency(release.thirdRelease60)} />
        <InfoRow label="4th Release 75%" value={formatCurrency(release.fourthRelease75)} />
        <InfoRow label="Released Total" value={formatCurrency(released)} />
        <InfoRow label="Retention 25%" value={formatCurrency(release.retention25)} />
        <InfoRow label="Cash Advance" value={formatCurrency(release.cashAdvance)} />
        <InfoRow label="Remaining" value={formatCurrency(release.totalRemaining)} />
      </div>
    </section>
  )
}

function PercentInput({ label, name, value }: { label: string; name: string; value: number }) {
  return (
    <label className="block font-semibold text-[#374151]">
      {label}
      <input
        name={name}
        type="number"
        min="0"
        step="0.01"
        defaultValue={(value * 100).toFixed(2)}
        className="mt-2 w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-3 text-[#111827] outline-none focus:border-[#C9A84C]"
      />
    </label>
  )
}

function loadRows<T>(key: string, fallback: T[]): T[] {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return fallback
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export default CommissionsPage
