import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/admin/Badge'
import ConfirmModal from '../../components/admin/ConfirmModal'
import DataTable from '../../components/admin/DataTable'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import { agents, commissionRules as initialCommissionRules, commissions, projects } from '../../data/adminMockData'
import type { CommissionRule } from '../../data/adminMockData'
import { commissionDetails } from '../../data/sourceDetails'
import type { CommissionDetail, CommissionPartyRelease } from '../../data/sourceDetails'

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
  const totalCashAdvance = commissionDetails.reduce((total, detail) => total + detail.manager.cashAdvance + detail.agent.cashAdvance, 0)
  const totalRetention = commissionDetails.reduce((total, detail) => total + detail.manager.retention25 + detail.agent.retention25, 0)

  useEffect(() => {
    localStorage.setItem('dcprime_commission_rules', JSON.stringify(rules))
  }, [rules])

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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Commission Payable" value={formatCurrency(totalCommissionPayable)} note="Manager + agent commissions" />
        <StatCard label="Released" value={formatCurrency(totalCommissionReleased)} note="1st to 4th release total" />
        <StatCard label="Remaining" value={formatCurrency(totalCommissionRemaining)} note="Total remaining from workbook" />
        <StatCard label="Retention" value={formatCurrency(totalRetention)} note="25% retention total" />
        <StatCard label="Cash Advance" value={formatCurrency(totalCashAdvance)} note="Manager + agent advances" />
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

export default CommissionsPage
