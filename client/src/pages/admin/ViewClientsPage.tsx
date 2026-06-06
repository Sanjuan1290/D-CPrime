import { useEffect, useMemo, useState } from 'react'
import ClientUnitSellersPanel from '../../components/admin/ClientUnitSellersPanel'
import DataTable from '../../components/admin/DataTable'
import FilterBar from '../../components/admin/FilterBar'
import InfoRow from '../../components/admin/InfoRow'
import Panel from '../../components/admin/Panel'
import { formatCurrency } from '../../components/admin/formatters'
import {
  getClientLifecycleStatus,
  getLotType,
  getScheduleSummary,
  mockStorageKeys,
  mockDbClientUnitSellers,
  mockDbClientUnits,
  mockDbClients,
  mockDbListings,
  mockDbProjects,
  mockDbUsers,
  readMockStorage,
  writeMockStorage,
} from '../../data/adminMockData'
import type { MockDbClientUnit, MockDbClientUnitSeller } from '../../data/adminMockData'

function ColorBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E4DC] bg-white px-2.5 py-1 text-xs font-semibold text-[#374151]">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

function ViewClientsPage() {
  const [clients] = useState(() => readMockStorage(mockStorageKeys.clients, mockDbClients))
  const [storedClientUnits] = useState(() => readMockStorage(mockStorageKeys.clientUnits, mockDbClientUnits))
  const [listings] = useState(() => readMockStorage(mockStorageKeys.listings, mockDbListings))
  const [search, setSearch] = useState('')
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id ?? 0)
  const [selectedUnitId, setSelectedUnitId] = useState(storedClientUnits.find((unit) => unit.client_id === selectedClientId)?.id ?? 0)
  const [sellers, setSellers] = useState<MockDbClientUnitSeller[]>(() => readMockStorage(mockStorageKeys.clientUnitSellers, mockDbClientUnitSellers))
  const listingById = new Map(listings.map((listing) => [listing.id, listing]))
  const projectById = new Map(mockDbProjects.map((project) => [project.id, project]))
  const selectedClient = clients.find((client) => client.id === selectedClientId) ?? clients[0]

  useEffect(() => {
    writeMockStorage(mockStorageKeys.clientUnitSellers, sellers)
  }, [sellers])

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return clients
    return clients.filter((client) => `${client.buyer_name} ${client.email ?? ''}`.toLowerCase().includes(term))
  }, [clients, search])

  const clientUnits: MockDbClientUnit[] = selectedClient
    ? storedClientUnits.filter((unit) => unit.client_id === selectedClient.id)
    : []

  const selectedUnit = clientUnits.find((unit) => unit.id === selectedUnitId) ?? clientUnits[0]

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Panel title="View Clients" subtitle="Read-only lookup with multi-unit client records">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          placeholder="Search client..."
          onReset={() => setSearch('')}
        />
        <div className="space-y-2">
          {filteredClients.slice(0, 24).map((client) => {
            const status = getClientLifecycleStatus(client.id, storedClientUnits)
            return (
              <button
                key={client.id}
                onClick={() => {
                  setSelectedClientId(client.id)
                  setSelectedUnitId(storedClientUnits.find((unit) => unit.client_id === client.id)?.id ?? 0)
                }}
                className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                  selectedClientId === client.id
                    ? 'border-[#C9A84C] bg-[#FFF8E1]'
                    : 'border-[#E8E4DC] bg-white hover:bg-[#F8F7F4]'
                }`}
              >
                <span className="block text-sm font-semibold text-[#111827]">{client.buyer_name}</span>
                <span className="mt-1 flex items-center justify-between gap-2 text-xs text-[#6B7280]">
                  <span>{client.email ?? client.contact_no ?? 'No contact saved'}</span>
                  <ColorBadge label={status.display_name} color={status.color_hex} />
                </span>
              </button>
            )
          })}
        </div>
      </Panel>

      {selectedClient && (
        <div className="space-y-6">
          <Panel title={selectedClient.buyer_name} subtitle="Client profile and linked units">
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <InfoRow label="Email" value={selectedClient.email ?? '-'} />
              <InfoRow label="Contact" value={selectedClient.contact_no ?? '-'} />
              <InfoRow label="Address" value={selectedClient.address ?? '-'} />
              <InfoRow label="Status" value={getClientLifecycleStatus(selectedClient.id, storedClientUnits).display_name} />
            </div>
          </Panel>

          <Panel title="Client Units" subtitle="All units linked to this client">
            <DataTable
              searchable={false}
              headers={['Unit ID', 'Project', 'Lot Type', 'Selling Price', 'Paid', 'Remaining', 'Status', 'Action']}
              rows={clientUnits.map((clientUnit) => {
                const listing = listingById.get(clientUnit.listing_id)
                const schedule = getScheduleSummary(clientUnit.id)
                return [
                  listing?.unit_id ?? `Listing #${clientUnit.listing_id}`,
                  projectById.get(listing?.project_id ?? 0)?.name ?? 'Unassigned',
                  listing ? getLotType(listing.lot_type).display_name : '-',
                  formatCurrency(clientUnit.total_contract_price ?? 0),
                  formatCurrency(schedule.paid),
                  formatCurrency(schedule.remaining),
                  `${clientUnit.payment_status.replace(/_/g, ' ')} / ${clientUnit.account_status}`,
                  <button key={`${clientUnit.id}-select`} onClick={() => setSelectedUnitId(clientUnit.id)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E] hover:bg-[#1A1A2E]/5">
                    Select
                  </button>,
                ]
              })}
            />
          </Panel>

          {selectedUnit && (
            <ClientUnitSellersPanel
              clientUnitId={selectedUnit.id}
              users={mockDbUsers}
              sellers={sellers}
              setSellers={setSellers}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default ViewClientsPage
