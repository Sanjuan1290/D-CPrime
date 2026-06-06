import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import FilterBar from '../../components/admin/FilterBar'
import FormField from '../../components/admin/FormField'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { Edit2, Eye, Plus } from '../../components/admin/Icons'
import { formatCurrency } from '../../components/admin/formatters'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import { useCreateListing, useListings, useUpdateListing } from '../../hooks/useListings'
import type { ListingPayload, ListingRecord } from '../../hooks/useListings'
import { useProjects } from '../../hooks/useProjects'

const inputClass = 'rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20'

const listingStatuses = [
  { label: 'Available', value: 'available', color: '#059669' },
  { label: 'Reserved', value: 'reserved', color: '#D97706' },
  { label: 'Hold', value: 'hold', color: '#6B7280' },
  { label: 'Sold', value: 'sold', color: '#2563EB' },
  { label: 'Inactive', value: 'inactive', color: '#9CA3AF' },
]

const lotTypes = [
  { label: 'Residential', value: 'residential' },
  { label: 'Corner', value: 'corner' },
  { label: 'Inner', value: 'inner' },
  { label: 'End', value: 'end' },
]

type ListingEditorState = ListingRecord | 'new' | null

function ListingsPage() {
  const toast = useToast()
  const listingsQuery = useListings()
  const projectsQuery = useProjects()
  const createListing = useCreateListing()
  const updateListing = useUpdateListing()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [lotTypeFilter, setLotTypeFilter] = useState('all')
  const [editor, setEditor] = useState<ListingEditorState>(null)
  const [detailListing, setDetailListing] = useState<ListingRecord | null>(null)

  const listings = listingsQuery.data?.data ?? []
  const projects = projectsQuery.data?.data ?? []
  const projectById = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects])

  const statusTabs = [
    { label: 'All', value: 'all', count: listings.length },
    ...listingStatuses.map((status) => ({
      label: status.label,
      value: status.value,
      count: listings.filter((listing) => listing.status === status.value).length,
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
        const project = projectById.get(listing.project_id)?.name ?? ''
        return `${listing.unit_id} ${listing.lot_type ?? ''} ${project}`.toLowerCase().includes(term)
      })
      .sort((a, b) => a.unit_id.localeCompare(b.unit_id, undefined, { numeric: true }))
  }, [listings, lotTypeFilter, projectById, projectFilter, search, statusFilter])

  function resetFilters() {
    setSearch('')
    setStatusFilter('all')
    setProjectFilter('all')
    setLotTypeFilter('all')
  }

  async function saveListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const lotArea = Number(formData.get('lot_area_sqm')) || 0
    const pricePerSqm = Number(formData.get('price_per_sqm')) || 0
    const legalMiscRate = Number(formData.get('legal_misc_rate')) || 10
    const netSellingPrice = Number(formData.get('net_selling_price')) || lotArea * pricePerSqm
    const legalMiscFee = Number(formData.get('legal_misc_fee')) || netSellingPrice * (legalMiscRate / 100)
    const payload: ListingPayload = {
      project_id: Number(formData.get('project_id')),
      cadastral_lot_no: cleanFormValue(formData.get('cadastral_lot_no')),
      administrator_group: cleanFormValue(formData.get('administrator_group')),
      unit_id: String(formData.get('unit_id')).trim(),
      reloc_unit_id: cleanFormValue(formData.get('reloc_unit_id')),
      lot_type: cleanFormValue(formData.get('lot_type')),
      lot_area_sqm: lotArea,
      new_area_sqm: Number(formData.get('new_area_sqm')) || null,
      price_per_sqm: pricePerSqm,
      net_selling_price: netSellingPrice,
      legal_misc_rate: legalMiscRate,
      legal_misc_fee: legalMiscFee,
      total_contract_price: Number(formData.get('total_contract_price')) || netSellingPrice + legalMiscFee,
      reservation_fee: Number(formData.get('reservation_fee')) || 0,
      promo_discount: Number(formData.get('promo_discount')) || 0,
      status: String(formData.get('status')) as ListingRecord['status'],
    }

    if (!payload.project_id || !payload.unit_id) {
      toast.error('Project and unit ID are required.')
      return
    }

    try {
      if (editor === 'new') {
        await createListing.mutateAsync(payload)
        toast.success('Listing created.')
      } else if (editor) {
        await updateListing.mutateAsync({ id: editor.id, ...payload })
        toast.success('Listing updated.')
      }
      setEditor(null)
    } catch {
      toast.error('Listing could not be saved.')
    }
  }

  if (listingsQuery.isLoading || projectsQuery.isLoading) {
    return <LoadingSkeleton rows={8} />
  }

  if (listingsQuery.isError || projectsQuery.isError) {
    return (
      <ErrorState
        message="Listings could not be loaded from MySQL."
        onRetry={() => {
          void listingsQuery.refetch()
          void projectsQuery.refetch()
        }}
      />
    )
  }

  return (
    <Panel title="Listings / Units" subtitle="Live inventory imported from company files and editable in MySQL">
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
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <select value={lotTypeFilter} onChange={(event) => setLotTypeFilter(event.target.value)} className={inputClass}>
              <option value="all">All Lot Types</option>
              {lotTypes.map((lotType) => (
                <option key={lotType.value} value={lotType.value}>
                  {lotType.label}
                </option>
              ))}
            </select>
            <button onClick={() => setEditor('new')} className="inline-flex items-center gap-2 rounded-lg bg-[#1A1A2E] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#2A2A4E]">
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
            return [
              listing.unit_id,
              projectById.get(listing.project_id)?.name ?? `Project #${listing.project_id}`,
              formatLotType(listing.lot_type),
              `${Number(listing.lot_area_sqm ?? 0).toLocaleString()} sqm`,
              formatCurrency(Number(listing.price_per_sqm ?? 0)),
              formatCurrency(Number(listing.net_selling_price ?? 0)),
              formatCurrency(Number(listing.legal_misc_fee ?? 0)),
              <ColorBadge key={`${listing.id}-status`} label={status.label} color={status.color} />,
              <div key={`${listing.id}-actions`} className="flex flex-wrap gap-2">
                <button onClick={() => setDetailListing(listing)} className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-[#374151] hover:bg-gray-100">
                  <Eye className="h-3.5 w-3.5" />
                  Details
                </button>
                <button onClick={() => setEditor(listing)} className="inline-flex items-center gap-1 rounded-md border border-[#1A1A2E]/20 bg-[#1A1A2E]/5 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E] hover:bg-[#1A1A2E]/10">
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </button>
              </div>,
            ]
          })}
        />
      </div>

      <ListingModal
        editor={editor}
        projects={projects}
        isSaving={createListing.isPending || updateListing.isPending}
        onClose={() => setEditor(null)}
        onSubmit={saveListing}
      />

      <Modal title={detailListing?.unit_id ?? 'Listing'} isOpen={detailListing !== null} onClose={() => setDetailListing(null)}>
        {detailListing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <ColorBadge label={getListingStatus(detailListing.status).label} color={getListingStatus(detailListing.status).color} />
              <Badge>{formatLotType(detailListing.lot_type)}</Badge>
            </div>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <InfoRow label="Project" value={projectById.get(detailListing.project_id)?.name ?? `Project #${detailListing.project_id}`} />
              <InfoRow label="Area" value={`${Number(detailListing.lot_area_sqm ?? 0).toLocaleString()} sqm`} />
              <InfoRow label="Price / SQM" value={formatCurrency(Number(detailListing.price_per_sqm ?? 0))} />
              <InfoRow label="Reservation Fee" value={formatCurrency(Number(detailListing.reservation_fee ?? 0))} />
              <InfoRow label="Legal / Misc" value={formatCurrency(Number(detailListing.legal_misc_fee ?? 0))} />
              <InfoRow label="Net Selling Price" value={formatCurrency(Number(detailListing.net_selling_price ?? 0))} />
              <InfoRow label="Total Contract Price" value={formatCurrency(Number(detailListing.total_contract_price ?? 0))} />
            </div>
          </div>
        )}
      </Modal>
    </Panel>
  )
}

function ListingModal({
  editor,
  projects,
  isSaving,
  onClose,
  onSubmit,
}: {
  editor: ListingEditorState
  projects: Array<{ id: number; name: string }>
  isSaving: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const listing = editor === 'new' ? null : editor
  const firstProjectId = projects[0]?.id ? String(projects[0].id) : ''

  return (
    <Modal title={editor === 'new' ? 'Add Listing' : 'Edit Listing'} isOpen={editor !== null} onClose={onClose}>
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <FormField label="Project" name="project_id" defaultValue={listing?.project_id ? String(listing.project_id) : firstProjectId} selectOptions={projects.map((project) => ({ label: project.name, value: String(project.id) }))} required />
        <FormField label="Unit ID" name="unit_id" defaultValue={listing?.unit_id ?? ''} required />
        <FormField label="Reloc Unit ID" name="reloc_unit_id" defaultValue={listing?.reloc_unit_id ?? ''} />
        <FormField label="Cadastral / Block" name="cadastral_lot_no" defaultValue={listing?.cadastral_lot_no ?? ''} />
        <FormField label="Administrator Group" name="administrator_group" defaultValue={listing?.administrator_group ?? ''} />
        <FormField label="Lot Type" name="lot_type" defaultValue={listing?.lot_type ?? 'residential'} selectOptions={lotTypes} />
        <FormField label="Area SQM" name="lot_area_sqm" type="number" defaultValue={String(listing?.lot_area_sqm ?? 0)} required />
        <FormField label="New Area SQM" name="new_area_sqm" type="number" defaultValue={listing?.new_area_sqm ? String(listing.new_area_sqm) : ''} />
        <FormField label="Price / SQM" name="price_per_sqm" type="number" defaultValue={String(listing?.price_per_sqm ?? 0)} required />
        <FormField label="Net Selling Price" name="net_selling_price" type="number" defaultValue={String(listing?.net_selling_price ?? 0)} />
        <FormField label="Legal / Misc Rate %" name="legal_misc_rate" type="number" defaultValue={String(listing?.legal_misc_rate ?? 10)} />
        <FormField label="Legal / Misc Fee" name="legal_misc_fee" type="number" defaultValue={String(listing?.legal_misc_fee ?? 0)} />
        <FormField label="Total Contract Price" name="total_contract_price" type="number" defaultValue={String(listing?.total_contract_price ?? 0)} />
        <FormField label="Reservation Fee" name="reservation_fee" type="number" defaultValue={String(listing?.reservation_fee ?? 0)} />
        <FormField label="Promo Discount" name="promo_discount" type="number" defaultValue={String(listing?.promo_discount ?? 0)} />
        <FormField label="Status" name="status" defaultValue={listing?.status ?? 'available'} selectOptions={listingStatuses.map((status) => ({ label: status.label, value: status.value }))} />
        <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#F8F7F4]">
            Cancel
          </button>
          <button disabled={isSaving} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white hover:bg-[#2A2A4E] disabled:cursor-not-allowed disabled:opacity-60">
            {isSaving ? 'Saving...' : 'Save Listing'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function ColorBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E4DC] bg-white px-2.5 py-1 text-xs font-semibold text-[#374151]">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

function getListingStatus(status: ListingRecord['status']) {
  return listingStatuses.find((item) => item.value === status) ?? listingStatuses[0]
}

function formatLotType(value?: string | null) {
  if (!value) return 'Residential'
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function cleanFormValue(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim()
  return text || null
}

export default ListingsPage
