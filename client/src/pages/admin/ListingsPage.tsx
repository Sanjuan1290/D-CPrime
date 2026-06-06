import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import Drawer from '../../components/admin/Drawer'
import FilterBar from '../../components/admin/FilterBar'
import FormField from '../../components/admin/FormField'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import ReservationDrawer from '../../components/admin/ReservationDrawer'
import { useToast } from '../../components/admin/Toast'
import { Edit2, Eye, Plus } from '../../components/admin/Icons'
import { formatCurrency } from '../../components/admin/formatters'
import {
  getListingStatus,
  getListingStatusId,
  getLotType,
  getNextMockId,
  mockStorageKeys,
  mockDbClients,
  mockDbListingStatuses,
  mockDbListings,
  mockDbLotTypes,
  mockDbProjects,
  mockDbReservations,
  mockDbSettings,
  mockDbUsers,
  readMockStorage,
  writeMockStorage,
} from '../../data/adminMockData'
import type { MockDbClient, MockDbListing, MockDbReservation } from '../../data/adminMockData'

const inputClass = 'rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20'

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

function ListingsPage() {
  const toast = useToast()
  const [listings, setListings] = useState<MockDbListing[]>(() => readMockStorage(mockStorageKeys.listings, mockDbListings))
  const [clients, setClients] = useState<MockDbClient[]>(() => readMockStorage(mockStorageKeys.clients, mockDbClients))
  const [reservations, setReservations] = useState<MockDbReservation[]>(() => readMockStorage(mockStorageKeys.reservations, mockDbReservations))
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [lotTypeFilter, setLotTypeFilter] = useState('all')
  const [editingListing, setEditingListing] = useState<MockDbListing | null>(null)
  const [detailListing, setDetailListing] = useState<MockDbListing | null>(null)
  const [reservationListing, setReservationListing] = useState<MockDbListing | null>(null)

  const projectById = useMemo(() => new Map(mockDbProjects.map((project) => [project.id, project])), [])

  useEffect(() => {
    writeMockStorage(mockStorageKeys.listings, listings)
  }, [listings])

  useEffect(() => {
    writeMockStorage(mockStorageKeys.clients, clients)
  }, [clients])

  useEffect(() => {
    writeMockStorage(mockStorageKeys.reservations, reservations)
  }, [reservations])
  const statusTabs = [
    { label: 'All', value: 'all', count: listings.length },
    ...mockDbListingStatuses.map((status) => ({
      label: status.display_name,
      value: status.name,
      count: listings.filter((listing) => listing.status === status.name).length,
    })),
  ]

  const visibleListings = useMemo(() => {
    const term = search.trim().toLowerCase()
    return listings
      .filter((listing) => {
        if (statusFilter !== 'all' && listing.status !== statusFilter) return false
        if (projectFilter !== 'all' && listing.project_id !== Number(projectFilter)) return false
        if (lotTypeFilter !== 'all' && listing.lot_type !== lotTypeFilter) return false
        if (!term) return true
        const lotType = getLotType(listing.lot_type).display_name
        const project = projectById.get(listing.project_id)?.name ?? ''
        return `${listing.unit_id} ${lotType} ${project}`.toLowerCase().includes(term)
      })
      .sort((a, b) => a.unit_id.localeCompare(b.unit_id, undefined, { numeric: true }))
  }, [listings, lotTypeFilter, projectById, projectFilter, search, statusFilter])

  function resetFilters() {
    setSearch('')
    setStatusFilter('all')
    setProjectFilter('all')
    setLotTypeFilter('all')
  }

  function saveListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editingListing) return
    const formData = new FormData(event.currentTarget)
    const lotArea = Number(formData.get('lot_area_sqm'))
    const pricePerSqm = Number(formData.get('price_per_sqm'))
    const legalMiscFee = Number(formData.get('legal_misc_fee'))
    const netSellingPrice = lotArea * pricePerSqm
    const legalMiscRate = netSellingPrice > 0 ? (legalMiscFee / netSellingPrice) * 100 : 0
    const nextListing: MockDbListing = {
      ...editingListing,
      project_id: Number(formData.get('project_id')),
      unit_id: String(formData.get('unit_id')),
      lot_type: String(formData.get('lot_type')),
      lot_area_sqm: lotArea,
      price_per_sqm: pricePerSqm,
      reservation_fee: Number(formData.get('reservation_fee')),
      legal_misc_rate: legalMiscRate,
      legal_misc_fee: legalMiscFee,
      net_selling_price: netSellingPrice,
      total_contract_price: netSellingPrice + legalMiscFee,
      status: String(formData.get('status')) as MockDbListing['status'],
      updated_at: timestamp(),
    }

    setListings((current) => {
      const exists = current.some((listing) => listing.id === nextListing.id)
      return exists ? current.map((listing) => (listing.id === nextListing.id ? nextListing : listing)) : [nextListing, ...current]
    })
    setEditingListing(null)
    toast.success('Listing saved successfully.')
  }

  function openNewListing() {
    setEditingListing({
      id: getNextMockId(listings),
      project_id: mockDbProjects[0]?.id ?? 1,
      cadastral_lot_no: null,
      administrator_group: null,
      unit_id: `LA-${String(Date.now()).slice(-4)}`,
      reloc_unit_id: null,
      lot_type: mockDbLotTypes[0]?.name ?? 'residential',
      lot_area_sqm: 300,
      new_area_sqm: null,
      price_per_sqm: 1200,
      net_selling_price: 360000,
      legal_misc_rate: 10,
      legal_misc_fee: 36000,
      total_contract_price: 396000,
      reservation_fee: Number(mockDbSettings.find((setting) => setting.setting_key === 'default_reservation_fee')?.setting_value ?? 5000),
      promo_discount: 0,
      status: getListingStatusId('available'),
      created_at: timestamp(),
      updated_at: timestamp(),
    })
  }

  return (
    <Panel title="Listings / Units" subtitle="Inventory is resolved through lookup-backed lot and status tables">
      <div className="space-y-4">
        <div className="grid gap-3 xl:grid-cols-[1fr_auto] xl:items-start">
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search unit, lot type, or project..."
            tabs={statusTabs}
            activeTab={statusFilter}
            onTabChange={setStatusFilter}
            onReset={resetFilters}
          />
          <div className="flex flex-wrap gap-2">
            <select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} className={inputClass}>
              <option value="all">All Projects</option>
              {mockDbProjects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            <select value={lotTypeFilter} onChange={(event) => setLotTypeFilter(event.target.value)} className={inputClass}>
              <option value="all">All Lot Types</option>
              {mockDbLotTypes.map((lotType) => (
                <option key={lotType.id} value={lotType.name}>{lotType.display_name}</option>
              ))}
            </select>
            <button onClick={openNewListing} className="inline-flex items-center gap-2 rounded-lg bg-[#1A1A2E] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#2A2A4E]">
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        <DataTable
          searchable={false}
          headers={['Unit ID', 'Project', 'Lot Type', 'Area', 'Price / SQM', 'Net Price', 'Legal / Misc', 'Status', 'Actions']}
          rows={visibleListings.map((listing) => {
            const status = getListingStatus(listing.status)
            const lotType = getLotType(listing.lot_type)
            const isAvailable = status.name === 'available'
            return [
              listing.unit_id,
              projectById.get(listing.project_id)?.name ?? `Project #${listing.project_id}`,
              lotType.display_name,
              `${(listing.lot_area_sqm ?? 0).toLocaleString()} sqm`,
              formatCurrency(listing.price_per_sqm ?? 0),
              formatCurrency(listing.net_selling_price ?? 0),
              formatCurrency(listing.legal_misc_fee ?? 0),
              <ColorBadge key={`${listing.id}-status`} label={status.display_name} color={status.color_hex} />,
              <div key={`${listing.id}-actions`} className="flex flex-wrap gap-2">
                <button onClick={() => setDetailListing(listing)} className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-[#374151] hover:bg-gray-100">
                  <Eye className="h-3.5 w-3.5" />
                  Details
                </button>
                <button onClick={() => setEditingListing(listing)} className="inline-flex items-center gap-1 rounded-md border border-[#1A1A2E]/20 bg-[#1A1A2E]/5 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E] hover:bg-[#1A1A2E]/10">
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </button>
                {isAvailable && (
                  <button onClick={() => setReservationListing(listing)} className="rounded-md border border-[#C9A84C]/40 bg-[#FFF8E1] px-3 py-1.5 text-xs font-bold text-[#9A7A22] hover:bg-[#F2D77E]/30">
                    Reserve
                  </button>
                )}
              </div>,
            ]
          })}
        />
      </div>

      <Modal title="Listing Record" isOpen={editingListing !== null} onClose={() => setEditingListing(null)}>
        {editingListing && (
          <form onSubmit={saveListing} className="grid gap-4 md:grid-cols-2">
            <FormField label="Project" name="project_id" defaultValue={String(editingListing.project_id)} selectOptions={mockDbProjects.map((project) => ({ label: project.name, value: String(project.id) }))} />
            <FormField label="Unit ID" name="unit_id" defaultValue={editingListing.unit_id} required />
            <FormField label="Lot Type" name="lot_type" defaultValue={editingListing.lot_type ?? ''} selectOptions={mockDbLotTypes.map((lotType) => ({ label: lotType.display_name, value: lotType.name }))} />
            <FormField label="Area SQM" name="lot_area_sqm" type="number" defaultValue={String(editingListing.lot_area_sqm ?? 0)} required />
            <FormField label="Price / SQM" name="price_per_sqm" type="number" defaultValue={String(editingListing.price_per_sqm ?? 0)} required />
            <FormField label="Reservation Fee" name="reservation_fee" type="number" defaultValue={String(editingListing.reservation_fee)} required />
            <FormField label="Legal / Misc Fee" name="legal_misc_fee" type="number" defaultValue={String(editingListing.legal_misc_fee ?? 0)} required />
            <FormField label="Status" name="status" defaultValue={editingListing.status} selectOptions={mockDbListingStatuses.map((status) => ({ label: status.display_name, value: status.name }))} />
            <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
              <button type="button" onClick={() => setEditingListing(null)} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#F8F7F4]">
                Cancel
              </button>
              <button className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white hover:bg-[#2A2A4E]">
                Save Listing
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Drawer
        title={detailListing?.unit_id ?? 'Listing'}
        subtitle={detailListing ? projectById.get(detailListing.project_id)?.name : undefined}
        isOpen={detailListing !== null}
        onClose={() => setDetailListing(null)}
      >
        {detailListing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <ColorBadge label={getListingStatus(detailListing.status).display_name} color={getListingStatus(detailListing.status).color_hex} />
              <Badge>{getLotType(detailListing.lot_type).display_name}</Badge>
            </div>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <InfoRow label="Area" value={`${(detailListing.lot_area_sqm ?? 0).toLocaleString()} sqm`} />
              <InfoRow label="Price / SQM" value={formatCurrency(detailListing.price_per_sqm ?? 0)} />
              <InfoRow label="Reservation Fee" value={formatCurrency(detailListing.reservation_fee)} />
              <InfoRow label="Legal / Misc" value={formatCurrency(detailListing.legal_misc_fee ?? 0)} />
              <InfoRow label="Net Selling Price" value={formatCurrency(detailListing.net_selling_price ?? 0)} />
              <InfoRow label="Total Contract Price" value={formatCurrency(detailListing.total_contract_price ?? 0)} />
              <InfoRow label="Updated" value={detailListing.updated_at} />
            </div>
          </div>
        )}
      </Drawer>

      <ReservationDrawer
        isOpen={reservationListing !== null}
        listing={reservationListing}
        clients={clients}
        users={mockDbUsers}
        reservations={reservations}
        settings={mockDbSettings}
        setClients={setClients}
        setReservations={setReservations}
        setListings={setListings}
        onClose={() => setReservationListing(null)}
      />
    </Panel>
  )
}

export default ListingsPage
