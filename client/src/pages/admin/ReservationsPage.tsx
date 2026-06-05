import { useMemo, useState } from 'react'
import Badge from '../../components/admin/Badge'
import ConfirmModal from '../../components/admin/ConfirmModal'
import DataTable from '../../components/admin/DataTable'
import FilterBar from '../../components/admin/FilterBar'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency } from '../../components/admin/formatters'
import {
  createMockDbAuditLog,
  getListingStatusId,
  getNextMockId,
  mockDbAuditLogs,
  mockDbClients,
  mockDbClientUnitDocuments,
  mockDbClientUnitSellers,
  mockDbClientUnits,
  mockDbCommissionPlans,
  mockDbListings,
  mockDbProjectDocuments,
  mockDbProjects,
  mockDbReservations,
  mockDbUsers,
} from '../../data/adminMockData'
import type {
  MockDbAuditLog,
  MockDbClient,
  MockDbClientUnit,
  MockDbClientUnitDocument,
  MockDbClientUnitSeller,
  MockDbListing,
  MockDbReservation,
  MockDbReservationStatus,
} from '../../data/adminMockData'

type ConfirmAction = 'confirm' | 'convert' | 'cancel'

const statuses: Array<'all' | MockDbReservationStatus> = ['all', 'pending', 'confirmed', 'converted', 'expired', 'cancelled']

function timestamp() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function ReservationsPage() {
  const toast = useToast()
  const [reservations, setReservations] = useState<MockDbReservation[]>(mockDbReservations)
  const [listings, setListings] = useState<MockDbListing[]>(mockDbListings)
  const [clients, setClients] = useState<MockDbClient[]>(mockDbClients)
  const [clientUnits, setClientUnits] = useState<MockDbClientUnit[]>(mockDbClientUnits)
  const [clientUnitSellers, setClientUnitSellers] = useState<MockDbClientUnitSeller[]>(mockDbClientUnitSellers)
  const [clientUnitDocuments, setClientUnitDocuments] = useState<MockDbClientUnitDocument[]>(mockDbClientUnitDocuments)
  const [, setAuditLogs] = useState<MockDbAuditLog[]>(mockDbAuditLogs)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [confirmState, setConfirmState] = useState<{ action: ConfirmAction; reservation: MockDbReservation } | null>(null)

  const listingById = useMemo(() => new Map(listings.map((listing) => [listing.id, listing])), [listings])
  const clientById = useMemo(() => new Map(clients.map((client) => [client.id, client])), [clients])
  const projectById = useMemo(() => new Map(mockDbProjects.map((project) => [project.id, project])), [])

  const filteredReservations = useMemo(() => {
    const term = search.trim().toLowerCase()
    return reservations.filter((reservation) => {
      const listing = listingById.get(reservation.listing_id)
      const client = clientById.get(reservation.client_id)
      if (statusFilter !== 'all' && reservation.status !== statusFilter) return false
      if (projectFilter !== 'all' && listing?.project_id !== Number(projectFilter)) return false
      if (!term) return true
      return `${client?.buyer_name ?? ''} ${listing?.unit_id ?? ''} ${projectById.get(listing?.project_id ?? 0)?.name ?? ''}`.toLowerCase().includes(term)
    })
  }, [clientById, listingById, projectById, projectFilter, reservations, search, statusFilter])

  function log(action: string, moduleName: string, description: string) {
    setAuditLogs((current) => [createMockDbAuditLog(action, moduleName, description, getNextMockId(current)), ...current])
  }

  function confirmReservation(reservation: MockDbReservation) {
    setReservations((current) =>
      current.map((item) =>
        item.id === reservation.id ? { ...item, status: 'confirmed', updated_at: timestamp() } : item,
      ),
    )
    log('Confirm reservation', 'Reservations', `Reservation #${reservation.id} confirmed.`)
    toast.success('Reservation confirmed')
  }

  function cancelReservation(reservation: MockDbReservation) {
    setReservations((current) =>
      current.map((item) =>
        item.id === reservation.id ? { ...item, status: 'cancelled', updated_at: timestamp() } : item,
      ),
    )
    setListings((current) =>
      current.map((listing) =>
        listing.id === reservation.listing_id
          ? { ...listing, status: getListingStatusId('available'), updated_at: timestamp() }
          : listing,
      ),
    )
    log('Cancel reservation', 'Reservations', `Reservation #${reservation.id} cancelled.`)
    toast.success('Reservation cancelled')
  }

  function convertReservation(reservation: MockDbReservation) {
    const listing = listingById.get(reservation.listing_id)
    const client = clientById.get(reservation.client_id)
    if (!listing || !client) return

    const plan = mockDbCommissionPlans.find((item) => item.project_id === listing.project_id) ?? mockDbCommissionPlans[0]
    const newClientUnitId = getNextMockId(clientUnits)
    const totalContractPrice = listing.total_contract_price ?? listing.net_selling_price ?? 0
    const contractPrice = listing.net_selling_price ?? totalContractPrice
    const legalMiscFee = listing.legal_misc_fee ?? Math.max(totalContractPrice - contractPrice, 0)
    const paymentTermsMonths = 60
    const manager = mockDbUsers.find((user) => user.role === 'manager')
    const newClientUnit: MockDbClientUnit = {
      id: newClientUnitId,
      client_id: reservation.client_id,
      listing_id: reservation.listing_id,
      reservation_id: reservation.id,
      assigned_agent_id: reservation.reserved_by,
      assigned_manager_id: manager?.id ?? null,
      reservation_date: reservation.reservation_date,
      contract_date: new Date().toISOString().slice(0, 10),
      mode_of_payment: 'installment',
      contract_price: contractPrice,
      legal_misc_fee: legalMiscFee,
      total_contract_price: totalContractPrice,
      payment_terms_months: paymentTermsMonths,
      monthly_amortization: paymentTermsMonths > 0 ? Math.max(0, totalContractPrice - reservation.reservation_fee) / paymentTermsMonths : null,
      due_day: 15,
      document_status: 'incomplete',
      account_status: 'active',
      payment_status: reservation.reservation_fee >= totalContractPrice ? 'complete_paid' : 'partially_paid',
      sales_status: 'good_sale',
      remarks: `Converted from reservation #${reservation.id} with plan ${plan.name}.`,
      created_at: timestamp(),
      updated_at: timestamp(),
    }

    const broker = mockDbUsers.find((user) => user.role === 'broker')
    const nextSellerId = getNextMockId(clientUnitSellers)
    const sellerRows: MockDbClientUnitSeller[] = [
      { id: nextSellerId, client_unit_id: newClientUnitId, user_id: reservation.reserved_by, role: 'agent', assigned_at: timestamp() },
      { id: nextSellerId + 1, client_unit_id: newClientUnitId, user_id: broker?.id ?? reservation.reserved_by, role: 'broker', assigned_at: timestamp() },
      { id: nextSellerId + 2, client_unit_id: newClientUnitId, user_id: manager?.id ?? reservation.reserved_by, role: 'manager', assigned_at: timestamp() },
    ]

    const projectDocuments = mockDbProjectDocuments.filter((document) => document.project_id === listing.project_id)
    const nextDocumentId = getNextMockId(clientUnitDocuments)
    const documentRows: MockDbClientUnitDocument[] = projectDocuments.map((projectDocument, index) => ({
      id: nextDocumentId + index,
      client_unit_id: newClientUnitId,
      document_id: projectDocument.document_id,
      file_url: null,
      status: 'not_submitted',
      reviewed_by: null,
      reviewed_at: null,
      created_at: timestamp(),
      updated_at: timestamp(),
    }))

    setClientUnits((current) => [newClientUnit, ...current])
    setClientUnitSellers((current) => [...sellerRows, ...current])
    setClientUnitDocuments((current) => [...documentRows, ...current])
    setReservations((current) =>
      current.map((item) =>
        item.id === reservation.id
          ? { ...item, status: 'converted', converted_to_client_unit_id: newClientUnitId, updated_at: timestamp() }
          : item,
      ),
    )
    setListings((current) =>
      current.map((item) =>
        item.id === listing.id
          ? { ...item, status: getListingStatusId('sold'), updated_at: timestamp() }
          : item,
      ),
    )
    setClients((current) => current.map((item) => (item.id === client.id ? { ...item, updated_at: timestamp() } : item)))
    log('Convert reservation', 'Reservations', `Contract created for ${client.buyer_name}.`)
    toast.success(`Contract created for ${client.buyer_name}`)
  }

  function runConfirmAction() {
    if (!confirmState) return
    if (confirmState.action === 'confirm') confirmReservation(confirmState.reservation)
    if (confirmState.action === 'convert') convertReservation(confirmState.reservation)
    if (confirmState.action === 'cancel') cancelReservation(confirmState.reservation)
    setConfirmState(null)
  }

  return (
    <Panel title="Reservations" subtitle="Manage reservations before contract conversion">
      <div className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-start">
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search client, unit, or project..."
            tabs={statuses.map((status) => ({
              label: status === 'all' ? 'All' : titleCase(status),
              value: status,
              count: status === 'all' ? reservations.length : reservations.filter((reservation) => reservation.status === status).length,
            }))}
            activeTab={statusFilter}
            onTabChange={setStatusFilter}
            onReset={() => {
              setSearch('')
              setStatusFilter('all')
              setProjectFilter('all')
            }}
          />
          <select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} className="rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#C9A84C]">
            <option value="all">All Projects</option>
            {mockDbProjects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>

        <DataTable
          searchable={false}
          headers={['Client Name', 'Unit ID', 'Project', 'Reserved By', 'Reservation Date', 'Expiry Date', 'Reservation Fee', 'Status', 'Actions']}
          rows={filteredReservations.map((reservation) => {
            const listing = listingById.get(reservation.listing_id)
            const client = clientById.get(reservation.client_id)
            const project = projectById.get(listing?.project_id ?? 0)
            const reservedBy = mockDbUsers.find((user) => user.id === reservation.reserved_by)
            return [
              client?.buyer_name ?? `Client #${reservation.client_id}`,
              listing?.unit_id ?? `Listing #${reservation.listing_id}`,
              project?.name ?? 'Unassigned',
              reservedBy?.full_name ?? 'Unknown',
              reservation.reservation_date,
              reservation.expires_at ?? '-',
              formatCurrency(reservation.reservation_fee),
              <Badge key={`${reservation.id}-status`}>{titleCase(reservation.status)}</Badge>,
              <div key={`${reservation.id}-actions`} className="flex flex-wrap gap-2">
                {reservation.status === 'pending' && (
                  <button onClick={() => setConfirmState({ action: 'confirm', reservation })} className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100">
                    Confirm
                  </button>
                )}
                {reservation.status === 'confirmed' && (
                  <button onClick={() => setConfirmState({ action: 'convert', reservation })} className="rounded-md border border-[#C9A84C]/40 bg-[#FFF8E1] px-3 py-1.5 text-xs font-bold text-[#9A7A22] hover:bg-[#F2D77E]/30">
                    Convert
                  </button>
                )}
                {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                  <button onClick={() => setConfirmState({ action: 'cancel', reservation })} className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100">
                    Cancel
                  </button>
                )}
              </div>,
            ]
          })}
        />
      </div>

      <ConfirmModal
        title={
          confirmState?.action === 'convert'
            ? 'Convert to Contract'
            : confirmState?.action === 'cancel'
              ? 'Cancel Reservation'
              : 'Confirm Reservation'
        }
        message={
          confirmState?.action === 'convert'
            ? 'This will create a contract and mark the unit as Sold. Continue?'
            : confirmState?.action === 'cancel'
              ? 'Cancel this reservation and return the listing to available inventory?'
              : 'Confirm this reservation?'
        }
        confirmLabel={confirmState?.action === 'convert' ? 'Create Contract' : 'Confirm'}
        tone={confirmState?.action === 'cancel' ? 'danger' : 'primary'}
        isOpen={confirmState !== null}
        onClose={() => setConfirmState(null)}
        onConfirm={runConfirmAction}
      />
    </Panel>
  )
}

export default ReservationsPage
