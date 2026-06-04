import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import Drawer from '../../components/admin/Drawer'
import FormField from '../../components/admin/FormField'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { useToast } from '../../components/admin/Toast'
import { Check, Edit2, Eye, SpinnerIcon, UserGroup } from '../../components/admin/Icons'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import {
  agentRecords,
  auditLogsV2,
  brokerRecords,
  clientsV2,
  employeeRecords,
  projects,
} from '../../data/adminMockData'
import type { AgentRecord, BrokerRecord, EmployeeRecord } from '../../data/adminMockData'
import { commissionDetails } from '../../data/sourceDetails'
import type { CommissionDetail } from '../../data/sourceDetails'
import { useMutation } from '../../hooks/useMutation'

type PeopleTab = 'Agents' | 'Brokers' | 'Employees'
type AgentProfileTab = 'Profile' | 'Clients' | 'Commissions' | 'Activity'
type AgentCommissionSummary = {
  details: CommissionDetail[]
  totalEarned: number
  released: number
  pending: number
  advances: number
}

const smallViewButton = 'inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-[#374151] hover:bg-gray-100'
const smallEditButton = 'inline-flex items-center gap-1 rounded-md border border-[#1A1A2E]/20 bg-[#1A1A2E]/5 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E] hover:bg-[#1A1A2E]/10'
const smallHoldButton = 'inline-flex items-center gap-1 rounded-md border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100'

function PeoplePage() {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState<PeopleTab>('Agents')
  const [agentStatus, setAgentStatus] = useState('All')
  const [agentProject, setAgentProject] = useState('All')
  const [agentProfileTab, setAgentProfileTab] = useState<AgentProfileTab>('Profile')
  const [agents, setAgents] = useState<AgentRecord[]>(() => {
    const saved = localStorage.getItem('dcprime_people_agents')
    return saved ? (JSON.parse(saved) as AgentRecord[]) : agentRecords
  })
  const [brokers] = useState<BrokerRecord[]>(() => {
    const saved = localStorage.getItem('dcprime_people_brokers')
    return saved ? (JSON.parse(saved) as BrokerRecord[]) : brokerRecords
  })
  const [employees] = useState<EmployeeRecord[]>(() => {
    const saved = localStorage.getItem('dcprime_people_employees')
    return saved ? (JSON.parse(saved) as EmployeeRecord[]) : employeeRecords
  })
  const [selectedAgent, setSelectedAgent] = useState<AgentRecord | null>(null)
  const [selectedBroker, setSelectedBroker] = useState<BrokerRecord | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRecord | null>(null)
  const [editingAgent, setEditingAgent] = useState<AgentRecord | null>(null)

  const visibleAgents = useMemo(
    () =>
      agents.filter((agent) => {
        if (agentStatus !== 'All' && agent.status !== agentStatus) return false
        if (agentProject !== 'All' && !agent.assignedProjects.includes(agentProject)) return false
        return true
      }),
    [agentProject, agentStatus, agents],
  )

  const saveAgentMutation = useMutation<FormData>(
    (formData) => {
      if (!editingAgent) return

      const agent: AgentRecord = {
        ...editingAgent,
        employeeId: String(formData.get('employeeId')),
        fullName: String(formData.get('fullName')),
        licenseType: String(formData.get('licenseType')) as AgentRecord['licenseType'],
        licenseNumber: String(formData.get('licenseNumber')),
        prcNumber: String(formData.get('prcNumber')),
        contactNumber: String(formData.get('contactNumber')),
        email: String(formData.get('email')),
        address: String(formData.get('address')),
        assignedProjects: [String(formData.get('assignedProject'))],
        managerId: String(formData.get('managerId')) || null,
        status: String(formData.get('status')) as AgentRecord['status'],
        hireDate: String(formData.get('hireDate')),
        commissionRate: Number(formData.get('commissionRate')) / 100,
        notes: String(formData.get('notes')),
      }

      setAgents((current) => {
        const exists = current.some((item) => item.id === agent.id)
        const next = exists ? current.map((item) => (item.id === agent.id ? agent : item)) : [agent, ...current]
        localStorage.setItem('dcprime_people_agents', JSON.stringify(next))
        return next
      })
      setEditingAgent(null)
      toast.success('Agent saved successfully.')
    },
    { onError: () => toast.error('Failed to save. Try again.') },
  )

  function openAgentForm(agent?: AgentRecord) {
    setEditingAgent(
      agent ?? {
        id: `agent-${Date.now()}`,
        employeeId: `AGT-${String(agents.length + 1).padStart(3, '0')}`,
        fullName: '',
        licenseType: 'Accredited Seller',
        licenseNumber: '',
        prcNumber: '',
        contactNumber: '',
        email: '',
        address: '',
        assignedProjects: [projects[0]?.id ?? 'project-1'],
        managerId: brokers[0]?.id ?? null,
        status: 'Active',
        hireDate: '06/04/2026',
        commissionRate: 0.05,
        linkedUserId: null,
        notes: '',
      },
    )
  }

  function deactivateAgent(agent: AgentRecord) {
    setAgents((current) => {
      const next = current.map((item) => (item.id === agent.id ? { ...item, status: 'Inactive' as const } : item))
      localStorage.setItem('dcprime_people_agents', JSON.stringify(next))
      return next
    })
    toast.warning('Agent deactivated.')
  }

  function getProjectName(projectId: string) {
    return projects.find((project) => project.id === projectId)?.name ?? projectId
  }

  function getAgentClients(agent: AgentRecord) {
    return clientsV2.filter((client) => client.agent.toLowerCase().includes(agent.fullName.split(',')[0].toLowerCase()))
  }

  function getAgentCommissionSummary(agent: AgentRecord) {
    const details = commissionDetails.filter((detail) => detail.agent.name.toLowerCase().includes(agent.fullName.split(',')[0].toLowerCase()))
    const totalEarned = details.reduce((total, detail) => total + detail.agent.commission, 0)
    const released = details.reduce(
      (total, detail) =>
        total +
        detail.agent.firstRelease20 +
        detail.agent.secondRelease40 +
        detail.agent.thirdRelease60 +
        detail.agent.fourthRelease75,
      0,
    )
    const pending = details.reduce((total, detail) => total + detail.agent.totalRemaining, 0)
    const advances = details.reduce((total, detail) => total + detail.agent.cashAdvance, 0)
    return { details, totalEarned, released, pending, advances }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Agents" value={agents.length.toString()} note="Sales people and accredited sellers" icon={<UserGroup className="h-5 w-5" />} />
        <StatCard label="Brokers" value={brokers.length.toString()} note="Licensed broker and manager records" icon={<UserGroup className="h-5 w-5" />} />
        <StatCard label="Employees" value={employees.length.toString()} note="Admin, treasury, and documentation staff" icon={<UserGroup className="h-5 w-5" />} />
      </div>

      <Panel
        title="People Management"
        subtitle="Manage real-world people records separately from system user accounts"
        actions={
          activeTab === 'Agents' ? (
            <button onClick={() => openAgentForm()} className="rounded-lg bg-[#1A1A2E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2A2A4E] active:scale-[0.98]">
              Add Agent
            </button>
          ) : undefined
        }
      >
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex flex-wrap gap-1 rounded-xl border border-[#E8E4DC] bg-[#F8F7F4] p-1">
            {(['Agents', 'Brokers', 'Employees'] as PeopleTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${activeTab === tab ? 'bg-[#1A1A2E] text-white' : 'text-[#6B7280] hover:bg-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Agents' && (
            <div className="grid gap-2 sm:grid-cols-2">
              <select value={agentStatus} onChange={(event) => setAgentStatus(event.target.value)} className="rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827]">
                {['All', 'Active', 'Inactive', 'Suspended'].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <select value={agentProject} onChange={(event) => setAgentProject(event.target.value)} className="rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827]">
                <option value="All">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {activeTab === 'Agents' && (
          <DataTable
            headers={['Employee ID', 'Full Name', 'License', 'PRC No.', 'Assigned Projects', 'Status', 'Clients', 'Actions']}
            rows={visibleAgents.map((agent) => [
              agent.employeeId,
              agent.fullName,
              agent.licenseType,
              agent.prcNumber,
              agent.assignedProjects.map(getProjectName).join(', '),
              <Badge key={`${agent.id}-status`}>{agent.status}</Badge>,
              getAgentClients(agent).length,
              <div key={`${agent.id}-actions`} className="flex flex-wrap gap-2">
                <button onClick={() => setSelectedAgent(agent)} className={smallViewButton}>
                  <Eye className="h-3.5 w-3.5" /> View
                </button>
                <button onClick={() => openAgentForm(agent)} className={smallEditButton}>
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </button>
                <button onClick={() => deactivateAgent(agent)} className={smallHoldButton}>
                  Hold
                </button>
              </div>,
            ])}
          />
        )}

        {activeTab === 'Brokers' && (
          <DataTable
            headers={['Employee ID', 'Full Name', 'REB No.', 'Agents Under', 'Projects', 'Status', 'Actions']}
            rows={brokers.map((broker) => [
              broker.employeeId,
              broker.fullName,
              broker.rebNumber,
              broker.assignedAgents.length,
              broker.assignedProjects.map(getProjectName).join(', '),
              <Badge key={`${broker.id}-status`}>{broker.status}</Badge>,
              <button key={`${broker.id}-view`} onClick={() => setSelectedBroker(broker)} className={smallViewButton}>
                <Eye className="h-3.5 w-3.5" /> View
              </button>,
            ])}
          />
        )}

        {activeTab === 'Employees' && (
          <DataTable
            headers={['Employee ID', 'Full Name', 'Position', 'Department', 'Status', 'System Access', 'Actions']}
            rows={employees.map((employee) => [
              employee.employeeId,
              employee.fullName,
              employee.position,
              employee.department,
              <Badge key={`${employee.id}-status`}>{employee.status}</Badge>,
              <Badge key={`${employee.id}-access`}>{employee.linkedUserId ? 'Has Access' : 'No Account'}</Badge>,
              <button key={`${employee.id}-view`} onClick={() => setSelectedEmployee(employee)} className={smallViewButton}>
                <Eye className="h-3.5 w-3.5" /> View
              </button>,
            ])}
          />
        )}
      </Panel>

      <AgentDrawer
        agent={selectedAgent}
        activeTab={agentProfileTab}
        onTabChange={setAgentProfileTab}
        onClose={() => setSelectedAgent(null)}
        getProjectName={getProjectName}
        clients={selectedAgent ? getAgentClients(selectedAgent) : []}
        commissionSummary={selectedAgent ? getAgentCommissionSummary(selectedAgent) : undefined}
      />

      <BrokerDrawer
        broker={selectedBroker}
        onClose={() => setSelectedBroker(null)}
        getProjectName={getProjectName}
        agents={agents}
      />

      <EmployeeDrawer employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />

      <Modal title="Agent Form" isOpen={editingAgent !== null} onClose={() => setEditingAgent(null)}>
        {editingAgent && (
          <form
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault()
              void saveAgentMutation.mutate(new FormData(event.currentTarget))
            }}
            className="grid gap-4 text-sm md:grid-cols-2"
          >
            <FormField label="Employee ID" name="employeeId" defaultValue={editingAgent.employeeId} required />
            <FormField label="Full Name" name="fullName" defaultValue={editingAgent.fullName} required />
            <FormField
              label="License Type"
              name="licenseType"
              defaultValue={editingAgent.licenseType}
              selectOptions={['REB', 'REA', 'Accredited Seller', 'None'].map((item) => ({ label: item, value: item }))}
            />
            <FormField label="License Number" name="licenseNumber" defaultValue={editingAgent.licenseNumber} />
            <FormField label="PRC Number" name="prcNumber" defaultValue={editingAgent.prcNumber} />
            <FormField label="Contact" name="contactNumber" defaultValue={editingAgent.contactNumber} required />
            <FormField label="Email" name="email" type="email" defaultValue={editingAgent.email} required />
            <FormField
              label="Assigned Project"
              name="assignedProject"
              defaultValue={editingAgent.assignedProjects[0]}
              selectOptions={projects.map((project) => ({ label: project.name, value: project.id }))}
            />
            <FormField
              label="Manager"
              name="managerId"
              defaultValue={editingAgent.managerId ?? ''}
              selectOptions={[{ label: 'No manager', value: '' }, ...brokers.map((broker) => ({ label: broker.fullName, value: broker.id }))]}
            />
            <FormField
              label="Status"
              name="status"
              defaultValue={editingAgent.status}
              selectOptions={['Active', 'Inactive', 'Suspended'].map((item) => ({ label: item, value: item }))}
            />
            <FormField label="Hire Date" name="hireDate" defaultValue={editingAgent.hireDate} required />
            <FormField label="Commission Rate %" name="commissionRate" type="number" step="0.01" defaultValue={(editingAgent.commissionRate * 100).toFixed(2)} />
            <FormField label="Address" name="address" defaultValue={editingAgent.address} textarea className="md:col-span-2" />
            <FormField label="Notes" name="notes" defaultValue={editingAgent.notes} textarea className="md:col-span-2" />
            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-[#E8E4DC] bg-white py-4 md:col-span-2">
              <button type="button" onClick={() => setEditingAgent(null)} className="rounded-lg border border-[#E8E4DC] bg-white px-4 py-2.5 text-sm font-semibold text-[#374151] transition hover:bg-[#F8F7F4]">
                Cancel
              </button>
              <button
                disabled={saveAgentMutation.isLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1A1A2E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2A2A4E] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saveAgentMutation.isLoading ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : saveAgentMutation.state === 'success' ? <Check className="h-4 w-4" /> : null}
                {saveAgentMutation.isLoading ? 'Saving...' : saveAgentMutation.state === 'success' ? 'Saved!' : 'Save Agent'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

function AgentDrawer({
  agent,
  activeTab,
  onTabChange,
  onClose,
  getProjectName,
  clients,
  commissionSummary,
}: {
  agent: AgentRecord | null
  activeTab: AgentProfileTab
  onTabChange: (tab: AgentProfileTab) => void
  onClose: () => void
  getProjectName: (projectId: string) => string
  clients: typeof clientsV2
  commissionSummary?: AgentCommissionSummary
}) {
  if (!agent) return null
  const summary = commissionSummary

  return (
    <Drawer title={agent.fullName} subtitle={`${agent.employeeId} | ${agent.licenseType}`} isOpen={agent !== null} onClose={onClose}>
      <div className="mb-5 inline-flex flex-wrap gap-1 rounded-xl border border-[#E8E4DC] bg-[#F8F7F4] p-1">
        {(['Profile', 'Clients', 'Commissions', 'Activity'] as AgentProfileTab[]).map((tab) => (
          <button key={tab} onClick={() => onTabChange(tab)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${activeTab === tab ? 'bg-[#1A1A2E] text-white' : 'text-[#6B7280] hover:bg-white'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Profile' && (
        <div className="space-y-1 text-sm">
          <InfoRow label="Status" value={<Badge>{agent.status}</Badge>} />
          <InfoRow label="PRC Number" value={agent.prcNumber || '-'} />
          <InfoRow label="License Number" value={agent.licenseNumber || '-'} />
          <InfoRow label="Contact" value={agent.contactNumber} />
          <InfoRow label="Email" value={agent.email} />
          <InfoRow label="Projects" value={agent.assignedProjects.map(getProjectName).join(', ')} />
          <InfoRow label="Commission Rate" value={formatPercent(agent.commissionRate)} />
          <InfoRow label="System User" value={agent.linkedUserId ? 'Linked' : 'No user account'} />
          <p className="mt-4 rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] p-3 text-sm text-[#374151]">{agent.notes || 'No notes.'}</p>
        </div>
      )}

      {activeTab === 'Clients' && (
        <DataTable
          searchable={false}
          headers={['Buyer', 'Unit', 'TCP', 'Balance', 'Status']}
          rows={clients.map((client) => [
            client.buyer,
            client.unitId,
            formatCurrency(client.totalContractPrice),
            formatCurrency(client.balance),
            <Badge key={`${client.clientId}-status`}>{client.salesStatus}</Badge>,
          ])}
        />
      )}

      {activeTab === 'Commissions' && summary && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label="Total Earned" value={formatCurrency(summary.totalEarned)} note="Agent gross commission" />
            <StatCard label="Released" value={formatCurrency(summary.released)} note="1st to 4th release" />
            <StatCard label="Pending" value={formatCurrency(summary.pending)} note="Remaining commission" />
            <StatCard label="Cash Advance" value={formatCurrency(summary.advances)} note="Total advances" />
          </div>
          <DataTable
            searchable={false}
            headers={['Buyer', 'Unit', 'Commission', 'Remaining']}
            rows={summary.details.map((detail) => [
              detail.buyer,
              detail.unitId,
              formatCurrency(detail.agent.commission),
              formatCurrency(detail.agent.totalRemaining),
            ])}
          />
        </div>
      )}

      {activeTab === 'Activity' && (
        <div className="space-y-3">
          {auditLogsV2
            .filter((log) => log.userName.toLowerCase().includes(agent.fullName.split(',')[0].toLowerCase()))
            .slice(0, 8)
            .map((log) => (
              <div key={log.id} className="rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] p-3">
                <p className="text-sm font-semibold text-[#111827]">{log.action}</p>
                <p className="mt-1 text-xs text-[#6B7280]">{log.details}</p>
                <p className="mt-2 text-[11px] text-[#9CA3AF]">{log.timestamp}</p>
              </div>
            ))}
        </div>
      )}
    </Drawer>
  )
}

function BrokerDrawer({ broker, onClose, getProjectName, agents }: { broker: BrokerRecord | null; onClose: () => void; getProjectName: (projectId: string) => string; agents: AgentRecord[] }) {
  if (!broker) return null

  return (
    <Drawer title={broker.fullName} subtitle={`${broker.employeeId} | Broker`} isOpen={broker !== null} onClose={onClose}>
      <div className="space-y-1 text-sm">
        <InfoRow label="Status" value={<Badge>{broker.status}</Badge>} />
        <InfoRow label="REB Number" value={broker.rebNumber} />
        <InfoRow label="PRC Number" value={broker.prcNumber} />
        <InfoRow label="Contact" value={broker.contactNumber} />
        <InfoRow label="Email" value={broker.email} />
        <InfoRow label="Projects" value={broker.assignedProjects.map(getProjectName).join(', ')} />
        <InfoRow label="Manager Rate" value={formatPercent(broker.commissionRate)} />
      </div>
      <h3 className="mt-6 text-sm font-semibold text-[#374151]">Team</h3>
      <div className="mt-3 space-y-2">
        {agents
          .filter((agent) => broker.assignedAgents.includes(agent.id))
          .map((agent) => (
            <div key={agent.id} className="rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] p-3">
              <p className="font-semibold text-[#111827]">{agent.fullName}</p>
              <p className="text-xs text-[#6B7280]">{agent.employeeId}</p>
            </div>
          ))}
      </div>
    </Drawer>
  )
}

function EmployeeDrawer({ employee, onClose }: { employee: EmployeeRecord | null; onClose: () => void }) {
  if (!employee) return null

  return (
    <Drawer title={employee.fullName} subtitle={`${employee.employeeId} | ${employee.position}`} isOpen={employee !== null} onClose={onClose}>
      <div className="space-y-1 text-sm">
        <InfoRow label="Status" value={<Badge>{employee.status}</Badge>} />
        <InfoRow label="Department" value={employee.department} />
        <InfoRow label="Contact" value={employee.contactNumber} />
        <InfoRow label="Email" value={employee.email} />
        <InfoRow label="Hire Date" value={employee.hireDate} />
        <InfoRow label="System Access" value={<Badge>{employee.linkedUserId ? 'Has Access' : 'No Account'}</Badge>} />
      </div>
      <p className="mt-5 rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] p-3 text-sm text-[#374151]">{employee.notes || 'No notes.'}</p>
    </Drawer>
  )
}

export default PeoplePage
