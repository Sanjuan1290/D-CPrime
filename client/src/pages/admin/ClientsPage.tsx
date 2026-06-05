import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import DataTable from '../../components/admin/DataTable'
import FilterBar from '../../components/admin/FilterBar'
import FormField from '../../components/admin/FormField'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency } from '../../components/admin/formatters'
import {
  createMockDbAuditLog,
  getClientLifecycleStatus,
  getNextMockId,
  getScheduleSummary,
  mockDbAuditLogs,
  mockDbClientStatuses,
  mockDbClientUnits,
  mockDbClients,
  mockDbListings,
  mockDbProjects,
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
  const [clients, setClients] = useState<MockDbClient[]>(mockDbClients)
  const [clientUnitRows, setClientUnitRows] = useState<MockDbClientUnit[]>(mockDbClientUnits)
  const [, setAuditLogs] = useState<MockDbAuditLog[]>(mockDbAuditLogs)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedClient, setSelectedClient] = useState<MockDbClient | null>(null)
  const [editingClient, setEditingClient] = useState<MockDbClient | null>(null)
  const listingById = new Map(mockDbListings.map((listing) => [listing.id, listing]))
  const projectById = new Map(mockDbProjects.map((project) => [project.id, project]))

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

  function openNewClient() {
    setEditingClient({
      id: getNextMockId(clients),
      buyer_name: '',
      spouse_co_owner_name: null,
      aif_administrator_name: null,
      email: null,
      contact_no: null,
      age: null,
      address: null,
      created_at: timestamp(),
      updated_at: timestamp(),
    })
  }

  function saveClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editingClient) return
    const formData = new FormData(event.currentTarget)
    const nextClient: MockDbClient = {
      ...editingClient,
      buyer_name: String(formData.get('buyer_name')),
      spouse_co_owner_name: String(formData.get('spouse_co_owner_name') || '') || null,
      aif_administrator_name: String(formData.get('aif_administrator_name') || '') || null,
      email: String(formData.get('email') || '') || null,
      contact_no: String(formData.get('contact_no') || '') || null,
      age: Number(formData.get('age')) || null,
      address: String(formData.get('address') || '') || null,
      updated_at: timestamp(),
    }

    setClients((current) => {
      const exists = current.some((client) => client.id === nextClient.id)
      return exists ? current.map((client) => (client.id === nextClient.id ? nextClient : client)) : [nextClient, ...current]
    })
    log('Save client', `${nextClient.buyer_name} was saved.`)
    setEditingClient(null)
    toast.success('Client saved.')
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
      subtitle="Client lifecycle is derived from linked unit records"
      actions={<button onClick={openNewClient} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white hover:bg-[#2A2A4E]">Add Client</button>}
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
            client.buyer_name,
            client.email ?? '-',
            client.contact_no ?? '-',
            unitsForClient(client.id).length,
            formatCurrency(clientBalance(client.id)),
            <ColorBadge key={`${client.id}-status`} label={status.display_name} color={status.color_hex} />,
            <div key={`${client.id}-actions`} className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedClient(client)} className="rounded-md border border-[#C9A84C]/40 px-3 py-1.5 text-xs font-semibold text-[#9A7A22] hover:bg-[#FFF8E1]">
                View
              </button>
              <button onClick={() => setEditingClient(client)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E] hover:bg-[#1A1A2E]/5">
                Edit
              </button>
              <button onClick={() => markCancelled(client)} className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                Cancel
              </button>
            </div>,
          ]
        })}
      />

      <Modal title="Client Details" isOpen={selectedClient !== null} onClose={() => setSelectedClient(null)}>
        {selectedClient && (
          <div className="space-y-5">
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <InfoRow label="Client Name" value={selectedClient.buyer_name} />
              <InfoRow label="Spouse / Co-owner" value={selectedClient.spouse_co_owner_name ?? '-'} />
              <InfoRow label="Email" value={selectedClient.email ?? '-'} />
              <InfoRow label="Contact" value={selectedClient.contact_no ?? '-'} />
              <InfoRow label="Age" value={selectedClient.age ?? '-'} />
              <InfoRow label="Address" value={selectedClient.address ?? '-'} />
              <InfoRow label="Status" value={getClientLifecycleStatus(selectedClient.id, clientUnitRows).display_name} />
              <InfoRow label="Created" value={selectedClient.created_at} />
            </div>
            <DataTable
              searchable={false}
              headers={['Unit', 'Project', 'Contract Price', 'Paid', 'Balance', 'Status']}
              rows={unitsForClient(selectedClient.id).map((clientUnit) => {
                const listing = listingById.get(clientUnit.listing_id)
                const project = projectById.get(listing?.project_id ?? 0)
                const schedule = getScheduleSummary(clientUnit.id)
                return [
                  listing?.unit_id ?? `Listing #${clientUnit.listing_id}`,
                  project?.name ?? 'Unassigned',
                  formatCurrency(listing?.total_contract_price ?? 0),
                  formatCurrency(schedule.paid),
                  formatCurrency(schedule.remaining),
                  `${clientUnit.payment_status.replace(/_/g, ' ')} / ${clientUnit.account_status}`,
                ]
              })}
            />
          </div>
        )}
      </Modal>

      <Modal title="Client Form" isOpen={editingClient !== null} onClose={() => setEditingClient(null)}>
        {editingClient && (
          <form onSubmit={saveClient} className="grid gap-4 md:grid-cols-2">
            <FormField label="Buyer Name" name="buyer_name" defaultValue={editingClient.buyer_name} required />
            <FormField label="Spouse / Co-owner" name="spouse_co_owner_name" defaultValue={editingClient.spouse_co_owner_name ?? ''} />
            <FormField label="Email" name="email" type="email" defaultValue={editingClient.email ?? ''} />
            <FormField label="Contact No." name="contact_no" defaultValue={editingClient.contact_no ?? ''} />
            <FormField label="Age" name="age" type="number" defaultValue={String(editingClient.age ?? '')} />
            <FormField label="AIF / Administrator" name="aif_administrator_name" defaultValue={editingClient.aif_administrator_name ?? ''} />
            <div className="md:col-span-2">
              <FormField label="Address" name="address" defaultValue={editingClient.address ?? ''} textarea />
            </div>
            <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
              <button type="button" onClick={() => setEditingClient(null)} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#F8F7F4]">
                Cancel
              </button>
              <button className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white hover:bg-[#2A2A4E]">
                Save Client
              </button>
            </div>
          </form>
        )}
      </Modal>
    </Panel>
  )
}

export default ClientsPage
