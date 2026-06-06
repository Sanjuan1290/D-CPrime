import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/admin/DataTable'
import FilterBar from '../../components/admin/FilterBar'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency } from '../../components/admin/formatters'
import {
  createMockDbAuditLog,
  getClientLifecycleStatus,
  getNextMockId,
  getScheduleSummary,
  mockStorageKeys,
  mockDbAuditLogs,
  mockDbClientStatuses,
  mockDbClientUnits,
  mockDbClients,
  readMockStorage,
  writeMockStorage,
} from '../../data/adminMockData'
import type { MockDbAuditLog, MockDbClient, MockDbClientUnit } from '../../data/adminMockData'

function timestamp() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function ColorBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E4DC] bg-white px-2.5 py-1 text-xs font-semibold text-[#374151]">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

function ClientsPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const [clients] = useState<MockDbClient[]>(() => readMockStorage(mockStorageKeys.clients, mockDbClients))
  const [clientUnitRows, setClientUnitRows] = useState<MockDbClientUnit[]>(() => readMockStorage(mockStorageKeys.clientUnits, mockDbClientUnits))
  const [auditLogs, setAuditLogs] = useState<MockDbAuditLog[]>(() => readMockStorage(mockStorageKeys.auditLogs, mockDbAuditLogs))
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    writeMockStorage(mockStorageKeys.clients, clients)
  }, [clients])

  useEffect(() => {
    writeMockStorage(mockStorageKeys.clientUnits, clientUnitRows)
  }, [clientUnitRows])

  useEffect(() => {
    writeMockStorage(mockStorageKeys.auditLogs, auditLogs)
  }, [auditLogs])

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase()
    return clients
      .filter((client) => {
        if (statusFilter !== 'all' && getClientLifecycleStatus(client.id, clientUnitRows).name !== statusFilter) return false
        if (!term) return true
        return `${client.buyer_name} ${client.email ?? ''} ${client.contact_no ?? ''}`.toLowerCase().includes(term)
      })
      .sort((a, b) => a.buyer_name.localeCompare(b.buyer_name))
  }, [clientUnitRows, clients, search, statusFilter])

  function log(action: string, description: string) {
    setAuditLogs((current) => [createMockDbAuditLog(action, 'Clients', description, getNextMockId(current)), ...current])
  }

  function markCancelled(client: MockDbClient) {
    setClientUnitRows((current) =>
      current.map((item) =>
        item.client_id === client.id
          ? { ...item, account_status: 'cancelled', sales_status: 'cancelled', updated_at: timestamp() }
          : item,
      ),
    )
    log('Cancel client', `${client.buyer_name} was marked cancelled.`)
    toast.success('Client marked cancelled.')
  }

  function unitsForClient(clientId: number) {
    return clientUnitRows.filter((clientUnit) => clientUnit.client_id === clientId)
  }

  function clientBalance(clientId: number) {
    return unitsForClient(clientId).reduce((total, clientUnit) => total + getScheduleSummary(clientUnit.id).remaining, 0)
  }

  return (
    <Panel
      title="Client Master List"
      subtitle="Search clients and open full profile pages"
      actions={<button onClick={() => navigate('/admin/clients/new')} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white hover:bg-[#2A2A4E]">Add Client</button>}
    >
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search client name, email, or contact..."
        tabs={[
          { label: 'All', value: 'all', count: clients.length },
          ...mockDbClientStatuses.map((status) => ({
            label: status.display_name,
            value: status.name,
            count: clients.filter((client) => getClientLifecycleStatus(client.id, clientUnitRows).name === status.name).length,
          })),
        ]}
        activeTab={statusFilter}
        onTabChange={setStatusFilter}
        onReset={() => {
          setSearch('')
          setStatusFilter('all')
        }}
      />

      <DataTable
        searchable={false}
        headers={['Client Name', 'Email', 'Contact', 'Units', 'Balance', 'Status', 'Actions']}
        rows={filteredClients.map((client) => {
          const status = getClientLifecycleStatus(client.id, clientUnitRows)
          return [
            <button key={`${client.id}-name`} onClick={() => navigate(`/admin/clients/${client.id}`)} className="text-left font-semibold text-[#1A1A2E] hover:text-[#9A7A22]">
              {client.buyer_name}
            </button>,
            client.email ?? '-',
            client.contact_no ?? '-',
            unitsForClient(client.id).length,
            formatCurrency(clientBalance(client.id)),
            <ColorBadge key={`${client.id}-status`} label={status.display_name} color={status.color_hex} />,
            <div key={`${client.id}-actions`} className="flex flex-wrap gap-2">
              <button onClick={() => navigate(`/admin/clients/${client.id}`)} className="rounded-md border border-[#C9A84C]/40 px-3 py-1.5 text-xs font-semibold text-[#9A7A22] hover:bg-[#FFF8E1]">
                View
              </button>
              <button onClick={() => navigate(`/admin/clients/${client.id}/edit`)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E] hover:bg-[#1A1A2E]/5">
                Edit
              </button>
              <button onClick={() => markCancelled(client)} className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                Cancel
              </button>
            </div>,
          ]
        })}
      />
    </Panel>
  )
}

export default ClientsPage
