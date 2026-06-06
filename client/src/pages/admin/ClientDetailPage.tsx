import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ClientUnitSellersPanel from '../../components/admin/ClientUnitSellersPanel'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import FormField from '../../components/admin/FormField'
import InfoRow from '../../components/admin/InfoRow'
import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency } from '../../components/admin/formatters'
import {
  createMockDbAuditLog,
  getClientLifecycleStatus,
  getNextMockId,
  getScheduleSummary,
  getLotType,
  mockDbAuditLogs,
  mockDbClientUnitSellers,
  mockDbClientUnits,
  mockDbClients,
  mockDbListings,
  mockDbPaymentSchedules,
  mockDbProjects,
  mockDbUsers,
  mockStorageKeys,
  readMockStorage,
  writeMockStorage,
} from '../../data/adminMockData'
import type { MockDbAuditLog, MockDbClient, MockDbClientUnit, MockDbClientUnitSeller, MockDbPaymentSchedule } from '../../data/adminMockData'

type ClientDetailPageProps = {
  mode?: 'view' | 'edit' | 'new'
}

function timestamp() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function emptyClient(nextId: number): MockDbClient {
  return {
    id: nextId,
    buyer_name: '',
    spouse_co_owner_name: '',
    aif_administrator_name: '',
    email: '',
    contact_no: '',
    age: null,
    address: '',
    created_at: timestamp(),
    updated_at: timestamp(),
  }
}

function ClientDetailPage({ mode = 'view' }: ClientDetailPageProps) {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [clients, setClients] = useState<MockDbClient[]>(() => readMockStorage(mockStorageKeys.clients, mockDbClients))
  const [clientUnits] = useState<MockDbClientUnit[]>(() => readMockStorage(mockStorageKeys.clientUnits, mockDbClientUnits))
  const [listings] = useState(() => readMockStorage(mockStorageKeys.listings, mockDbListings))
  const [sellers, setSellers] = useState<MockDbClientUnitSeller[]>(() => readMockStorage(mockStorageKeys.clientUnitSellers, mockDbClientUnitSellers))
  const [paymentSchedules] = useState<MockDbPaymentSchedule[]>(() => readMockStorage(mockStorageKeys.paymentSchedules, mockDbPaymentSchedules))
  const [auditLogs, setAuditLogs] = useState<MockDbAuditLog[]>(() => readMockStorage(mockStorageKeys.auditLogs, mockDbAuditLogs))
  const numericClientId = Number(clientId)
  const isNew = mode === 'new'
  const client = useMemo(() => (isNew ? emptyClient(getNextMockId(clients)) : clients.find((item) => item.id === numericClientId)), [clients, isNew, numericClientId])
  const units = useMemo(() => (client ? clientUnits.filter((unit) => unit.client_id === client.id) : []), [client, clientUnits])
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null)
  const selectedUnit = units.find((unit) => unit.id === selectedUnitId) ?? units[0]
  const listingById = useMemo(() => new Map(listings.map((listing) => [listing.id, listing])), [listings])
  const projectById = useMemo(() => new Map(mockDbProjects.map((project) => [project.id, project])), [])
  const status = client ? getClientLifecycleStatus(client.id, clientUnits) : null
  const totalBalance = units.reduce((total, unit) => total + getScheduleSummary(unit.id).remaining, 0)
  const totalPaid = units.reduce((total, unit) => total + getScheduleSummary(unit.id).paid, 0)
  const unitSchedules = selectedUnit ? paymentSchedules.filter((schedule) => schedule.client_unit_id === selectedUnit.id) : []

  useEffect(() => {
    writeMockStorage(mockStorageKeys.clients, clients)
  }, [clients])

  useEffect(() => {
    writeMockStorage(mockStorageKeys.clientUnitSellers, sellers)
  }, [sellers])

  useEffect(() => {
    writeMockStorage(mockStorageKeys.auditLogs, auditLogs)
  }, [auditLogs])

  function log(action: string, description: string) {
    setAuditLogs((current) => [createMockDbAuditLog(action, 'Clients', description, getNextMockId(current)), ...current])
  }

  function saveClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!client) return
    const formData = new FormData(event.currentTarget)
    const nextClient: MockDbClient = {
      ...client,
      buyer_name: String(formData.get('buyer_name')).trim(),
      spouse_co_owner_name: String(formData.get('spouse_co_owner_name') || '').trim(),
      aif_administrator_name: String(formData.get('aif_administrator_name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      contact_no: String(formData.get('contact_no') || '').trim(),
      age: Number(formData.get('age')) || null,
      address: String(formData.get('address') || '').trim(),
      updated_at: timestamp(),
    }

    setClients((current) => {
      const exists = current.some((item) => item.id === nextClient.id)
      return exists ? current.map((item) => (item.id === nextClient.id ? nextClient : item)) : [nextClient, ...current]
    })
    log(isNew ? 'Create client' : 'Update client', `${nextClient.buyer_name} was saved.`)
    toast.success(isNew ? 'Client created.' : 'Client updated.')
    navigate(`/admin/clients/${nextClient.id}`)
  }

  if (!client) {
    return (
      <Panel title="Client Not Found" subtitle="The selected client record does not exist in the current mock data.">
        <button onClick={() => navigate('/admin/clients')} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white hover:bg-[#2A2A4E]">
          Back to Clients
        </button>
      </Panel>
    )
  }

  if (mode === 'edit' || mode === 'new') {
    return (
      <Panel
        title={isNew ? 'New Client' : `Edit ${client.buyer_name}`}
        subtitle={isNew ? 'Create a client profile before linking reservations or units' : 'Update the client profile record'}
        actions={<button onClick={() => navigate(isNew ? '/admin/clients' : `/admin/clients/${client.id}`)} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#F8F7F4]">Cancel</button>}
      >
        <form onSubmit={saveClient} className="grid gap-4 md:grid-cols-2">
          <FormField label="Buyer Name" name="buyer_name" defaultValue={client.buyer_name} required />
          <FormField label="Spouse / Co-owner" name="spouse_co_owner_name" defaultValue={client.spouse_co_owner_name ?? ''} />
          <FormField label="Email" name="email" type="email" defaultValue={client.email ?? ''} />
          <FormField label="Contact No." name="contact_no" defaultValue={client.contact_no ?? ''} />
          <FormField label="Age" name="age" type="number" defaultValue={String(client.age ?? '')} />
          <FormField label="AIF / Administrator" name="aif_administrator_name" defaultValue={client.aif_administrator_name ?? ''} />
          <div className="md:col-span-2">
            <FormField label="Address" name="address" defaultValue={client.address ?? ''} textarea />
          </div>
          <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
            <button type="button" onClick={() => navigate(isNew ? '/admin/clients' : `/admin/clients/${client.id}`)} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#F8F7F4]">
              Cancel
            </button>
            <button className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white hover:bg-[#2A2A4E]">
              Save Client
            </button>
          </div>
        </form>
      </Panel>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <button onClick={() => navigate('/admin/clients')} className="mb-3 text-sm font-semibold text-[#9A7A22] hover:text-[#6F5618]">
            Back to Clients
          </button>
          <h1 className="font-serif text-3xl text-[#1A1A2E]">{client.buyer_name}</h1>
          <p className="mt-1 text-sm text-[#6B7280]">{client.email} | {client.contact_no}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => navigate(`/admin/clients/${client.id}/edit`)} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white hover:bg-[#2A2A4E]">
            Edit Client
          </button>
          <button onClick={() => navigate('/admin/clients/new')} className="rounded-lg border border-[#C9A84C]/40 px-4 py-2 text-sm font-semibold text-[#9A7A22] hover:bg-[#FFF8E1]">
            Add Client
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Status" value={status?.display_name ?? 'Lead'} note="Derived from linked units" />
        <StatCard label="Units" value={units.length.toString()} note="Linked client units" />
        <StatCard label="Paid" value={formatCurrency(totalPaid)} note="Schedule-derived paid amount" />
        <StatCard label="Balance" value={formatCurrency(totalBalance)} note="Remaining scheduled amount" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Panel title="Profile" subtitle="Primary client information">
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <InfoRow label="Client ID" value={`#${client.id}`} />
              <InfoRow label="Status" value={<Badge>{status?.display_name ?? 'Lead'}</Badge>} />
              <InfoRow label="Spouse / Co-owner" value={client.spouse_co_owner_name || '-'} />
              <InfoRow label="AIF / Administrator" value={client.aif_administrator_name || '-'} />
              <InfoRow label="Email" value={client.email || '-'} />
              <InfoRow label="Contact" value={client.contact_no || '-'} />
              <InfoRow label="Age" value={client.age ?? '-'} />
              <InfoRow label="Created" value={client.created_at} />
              <div className="md:col-span-2">
                <InfoRow label="Address" value={client.address || '-'} />
              </div>
            </div>
          </Panel>

          <Panel title="Client Units" subtitle="Units, contracts, and balances linked to this client">
            <DataTable
              searchable={false}
              headers={['Unit', 'Project', 'Lot Type', 'TCP', 'Paid', 'Balance', 'Status', 'Action']}
              rows={units.map((unit) => {
                const listing = listingById.get(unit.listing_id)
                const project = projectById.get(listing?.project_id ?? 0)
                const summary = getScheduleSummary(unit.id)
                return [
                  listing?.unit_id ?? `Listing #${unit.listing_id}`,
                  project?.name ?? 'Unassigned',
                  listing ? getLotType(listing.lot_type).display_name : '-',
                  formatCurrency(unit.total_contract_price ?? 0),
                  formatCurrency(summary.paid),
                  formatCurrency(summary.remaining),
                  `${unit.payment_status.replace(/_/g, ' ')} / ${unit.account_status}`,
                  <button key={`${unit.id}-select`} onClick={() => setSelectedUnitId(unit.id)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E] hover:bg-[#1A1A2E]/5">
                    Select
                  </button>,
                ]
              })}
            />
          </Panel>

          {selectedUnit && (
            <Panel title="Payment Schedule" subtitle="Schedule rows for the selected unit">
              <DataTable
                searchable={false}
                headers={['Due Date', 'Description', 'Amount', 'Penalty', 'Status']}
                rows={unitSchedules.map((schedule) => [
                  schedule.due_date,
                  schedule.description ?? '-',
                  formatCurrency(schedule.due_amount),
                  formatCurrency(schedule.penalty),
                  <Badge key={`${schedule.id}-status`}>{schedule.status.replace(/_/g, ' ')}</Badge>,
                ])}
              />
            </Panel>
          )}
        </div>

        <div className="space-y-6">
          {selectedUnit ? (
            <ClientUnitSellersPanel clientUnitId={selectedUnit.id} users={mockDbUsers} sellers={sellers} setSellers={setSellers} />
          ) : (
            <Panel title="Sellers" subtitle="No client unit is linked yet">
              <p className="text-sm text-[#6B7280]">Create or convert a reservation to assign sellers.</p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientDetailPage
