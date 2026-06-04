import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import Badge from '../../components/admin/Badge'
import ConfirmModal from '../../components/admin/ConfirmModal'
import DataTable from '../../components/admin/DataTable'
import Drawer from '../../components/admin/Drawer'
import FilterBar from '../../components/admin/FilterBar'
import FormField from '../../components/admin/FormField'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { Check, Edit2, Eye, LayoutGrid, SpinnerIcon, UserGroup } from '../../components/admin/Icons'
import { formatCurrency } from '../../components/admin/formatters'
import { clientsV2, listings as initialListings, projects } from '../../data/adminMockData'
import type { Listing } from '../../data/adminMockData'
import { listingInstallmentDetails } from '../../data/sourceDetails'
import { useMutation } from '../../hooks/useMutation'

type ListingStatus = Listing['status']
type ViewMode = 'table' | 'cards'

const statusOptions: ListingStatus[] = ['Available', 'Reserved', 'Sold', 'Hold']
const actionView = 'inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-[#374151] hover:bg-gray-100'
const actionEdit = 'inline-flex items-center gap-1 rounded-md border border-[#1A1A2E]/20 bg-[#1A1A2E]/5 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E] hover:bg-[#1A1A2E]/10'
const actionHold = 'rounded-md border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100'

function ListingsPage() {
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialStatus = (searchParams.get('status') as ListingStatus | null) ?? 'All'
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('dcprime_listings')
    return saved ? (JSON.parse(saved) as Listing[]) : initialListings
  })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ListingStatus | 'All'>(initialStatus || 'All')
  const [projectFilter, setProjectFilter] = useState(searchParams.get('project') ?? 'All')
  const [blockFilter, setBlockFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minArea, setMinArea] = useState('')
  const [maxArea, setMaxArea] = useState('')
  const [sortBy, setSortBy] = useState('Unit ID')
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [detailListing, setDetailListing] = useState<Listing | null>(null)
  const [pendingStatus, setPendingStatus] = useState<{ listing: Listing; status: ListingStatus } | null>(null)

  useEffect(() => {
    localStorage.setItem('dcprime_listings', JSON.stringify(listings))
  }, [listings])

  useEffect(() => {
    const next = new URLSearchParams()
    if (projectFilter !== 'All') next.set('project', projectFilter)
    if (statusFilter !== 'All') next.set('status', statusFilter)
    setSearchParams(next, { replace: true })
  }, [projectFilter, setSearchParams, statusFilter])

  const blockOptions = Array.from(new Set(listings.map((listing) => listing.block))).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  const typeOptions = Array.from(new Set(listings.map((listing) => listing.lotType))).sort()
  const stats = {
    All: listings.length,
    Available: listings.filter((listing) => listing.status === 'Available').length,
    Reserved: listings.filter((listing) => listing.status === 'Reserved').length,
    Sold: listings.filter((listing) => listing.status === 'Sold').length,
    Hold: listings.filter((listing) => listing.status === 'Hold').length,
  }
  const activeFilterCount = [projectFilter !== 'All', blockFilter !== 'All', typeFilter !== 'All', minPrice, maxPrice, minArea, maxArea].filter(Boolean).length

  const visibleListings = useMemo(() => {
    const term = search.trim().toLowerCase()
    return [...listings]
      .filter((listing) => {
        if (projectFilter !== 'All' && projectFilter !== 'project-1') return false
        if (statusFilter !== 'All' && listing.status !== statusFilter) return false
        if (blockFilter !== 'All' && listing.block !== blockFilter) return false
        if (typeFilter !== 'All' && listing.lotType !== typeFilter) return false
        if (minPrice && listing.totalContractPrice < Number(minPrice)) return false
        if (maxPrice && listing.totalContractPrice > Number(maxPrice)) return false
        if (minArea && listing.area < Number(minArea)) return false
        if (maxArea && listing.area > Number(maxArea)) return false
        if (!term) return true
        return `${listing.unitId} ${listing.block} ${listing.lotType}`.toLowerCase().includes(term)
      })
      .sort((a, b) => {
        if (sortBy === 'Price ↑') return a.totalContractPrice - b.totalContractPrice
        if (sortBy === 'Price ↓') return b.totalContractPrice - a.totalContractPrice
        if (sortBy === 'Area ↑') return a.area - b.area
        if (sortBy === 'Area ↓') return b.area - a.area
        return a.unitId.localeCompare(b.unitId, undefined, { numeric: true })
      })
  }, [blockFilter, listings, maxArea, maxPrice, minArea, minPrice, projectFilter, search, sortBy, statusFilter, typeFilter])

  const saveMutation = useMutation<FormData>(
    (formData) => {
      if (!selectedListing) return
      const area = Number(formData.get('area'))
      const pricePerSqm = Number(formData.get('pricePerSqm'))
      const legalMiscFee = Number(formData.get('legalMiscFee')) / 100
      const netSellingPrice = area * pricePerSqm
      const listing: Listing = {
        ...selectedListing,
        unitId: String(formData.get('unitId')),
        block: String(formData.get('block')),
        lotType: String(formData.get('lotType')),
        area,
        pricePerSqm,
        legalMiscFee,
        netSellingPrice,
        totalContractPrice: netSellingPrice + netSellingPrice * legalMiscFee,
        status: String(formData.get('status')) as ListingStatus,
      }

      setListings((current) => {
        const exists = current.some((item) => item.unitId === selectedListing.unitId)
        return exists ? current.map((item) => (item.unitId === selectedListing.unitId ? listing : item)) : [listing, ...current]
      })
      setSelectedListing(null)
      toast.success('Listing saved successfully.')
    },
    { onError: () => toast.error('Failed to save. Try again.') },
  )

  const statusMutation = useMutation<{ listing: Listing; status: ListingStatus }>((data) => {
    setListings((current) => current.map((item) => (item.unitId === data.listing.unitId ? { ...item, status: data.status } : item)))
    setPendingStatus(null)
    toast.success('Listing status updated.')
  })

  function openListing(listing?: Listing) {
    setSelectedListing(
      listing ?? {
        unitId: `LA-${Date.now().toString().slice(-4)}`,
        block: '1',
        lotType: 'INNER',
        area: 300,
        pricePerSqm: 1200,
        netSellingPrice: 360000,
        legalMiscFee: 0.1,
        totalContractPrice: 396000,
        status: 'Available',
      },
    )
  }

  function resetAllFilters() {
    setSearch('')
    setStatusFilter('All')
    setProjectFilter('All')
    setBlockFilter('All')
    setTypeFilter('All')
    setMinPrice('')
    setMaxPrice('')
    setMinArea('')
    setMaxArea('')
    setSortBy('Unit ID')
  }

  function getAssignedClient(listing: Listing) {
    if (listing.status !== 'Reserved' && listing.status !== 'Sold') return null
    return clientsV2.find((client) => client.unitId === listing.unitId)
  }

  function renderStatusControl(listing: Listing) {
    return (
      <select
        value={listing.status}
        onChange={(event) => setPendingStatus({ listing, status: event.target.value as ListingStatus })}
        className="rounded-full border border-[#E8E4DC] bg-white px-2 py-1 text-xs font-semibold text-[#374151]"
      >
        {statusOptions.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>
    )
  }

  return (
    <Panel title="Listings / LA Inventory" subtitle="Create, edit, filter, and hold lot inventory">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(['All', 'Available', 'Reserved', 'Sold', 'Hold'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                statusFilter === status ? 'border-[#1A1A2E] bg-[#1A1A2E] text-white' : 'border-[#E8E4DC] bg-white text-[#374151] hover:bg-[#F8F7F4]'
              }`}
            >
              {status}: {stats[status]}
            </button>
          ))}
        </div>

        <div className="grid gap-3 xl:grid-cols-[1fr_auto] xl:items-start">
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search unit ID, block, or lot type..."
            tabs={(['All', 'Available', 'Reserved', 'Sold', 'Hold'] as const).map((status) => ({ label: status, value: status, count: stats[status] }))}
            activeTab={statusFilter}
            onTabChange={(value) => setStatusFilter(value as ListingStatus | 'All')}
            onReset={resetAllFilters}
          />
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setIsMoreOpen((current) => !current)} className="rounded-lg border border-[#E8E4DC] bg-white px-4 py-2.5 text-sm font-semibold text-[#374151] hover:bg-[#F8F7F4]">
              More Filters {activeFilterCount > 0 && <span className="ml-1 text-[#9A7A22]">({activeFilterCount})</span>}
            </button>
            <button onClick={() => setViewMode('table')} className={`grid h-10 w-10 place-items-center rounded-lg border ${viewMode === 'table' ? 'border-[#1A1A2E] bg-[#1A1A2E] text-white' : 'border-[#E8E4DC] bg-white text-[#374151]'}`} aria-label="Table view">
              <UserGroup className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode('cards')} className={`grid h-10 w-10 place-items-center rounded-lg border ${viewMode === 'cards' ? 'border-[#1A1A2E] bg-[#1A1A2E] text-white' : 'border-[#E8E4DC] bg-white text-[#374151]'}`} aria-label="Card view">
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button onClick={() => openListing()} className="rounded-lg bg-[#1A1A2E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2A2A4E] active:scale-[0.98]">
              Add Listing
            </button>
          </div>
        </div>

        {isMoreOpen && (
          <div className="grid gap-3 rounded-xl border border-[#E8E4DC] bg-[#F8F7F4] p-4 md:grid-cols-2 xl:grid-cols-6">
            <select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} className="rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827]">
              <option value="All">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            <select value={blockFilter} onChange={(event) => setBlockFilter(event.target.value)} className="rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827]">
              <option value="All">All Blocks</option>
              {blockOptions.map((block) => <option key={block}>{block}</option>)}
            </select>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827]">
              <option value="All">All Types</option>
              {typeOptions.map((type) => <option key={type}>{type}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="Min ₱" className="rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF]" />
              <input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Max ₱" className="rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF]" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input value={minArea} onChange={(event) => setMinArea(event.target.value)} placeholder="Min sqm" className="rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF]" />
              <input value={maxArea} onChange={(event) => setMaxArea(event.target.value)} placeholder="Max sqm" className="rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF]" />
            </div>
            <div className="flex gap-2">
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827]">
                {['Unit ID', 'Price ↑', 'Price ↓', 'Area ↑', 'Area ↓'].map((item) => <option key={item}>{item}</option>)}
              </select>
              <button onClick={resetAllFilters} className="rounded-lg bg-[#C9A84C] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#B8973B]">Reset</button>
            </div>
          </div>
        )}

        {viewMode === 'table' ? (
          <DataTable
            searchable={false}
            headers={['Unit ID', 'Block', 'Lot Type', 'Area', 'Price/SQM', 'Net Price', 'TCP', 'Status', 'Assigned Client', 'Actions']}
            rows={visibleListings.map((listing) => {
              const assignedClient = getAssignedClient(listing)
              return [
                listing.unitId,
                listing.block,
                listing.lotType,
                `${listing.area} sqm`,
                formatCurrency(listing.pricePerSqm),
                formatCurrency(listing.netSellingPrice),
                formatCurrency(listing.totalContractPrice),
                renderStatusControl(listing),
                assignedClient?.buyer ?? '—',
                <div key={`${listing.unitId}-actions`} className="flex flex-wrap gap-2">
                  <button onClick={() => setDetailListing(listing)} className={actionView}><Eye className="h-3.5 w-3.5" /> Details</button>
                  <button onClick={() => openListing(listing)} className={actionEdit}><Edit2 className="h-3.5 w-3.5" /> Edit</button>
                  <button onClick={() => setPendingStatus({ listing, status: 'Hold' })} className={actionHold}>Hold</button>
                </div>,
              ]
            })}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {visibleListings.map((listing) => {
              const assignedClient = getAssignedClient(listing)
              const paidPercent = assignedClient ? assignedClient.paymentPercentage : 0
              return (
                <article key={listing.unitId} className="rounded-xl border border-[#E8E4DC] bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">Unit ID</p>
                      <h3 className="mt-1 text-2xl font-semibold text-[#1A1A2E]">{listing.unitId}</h3>
                    </div>
                    <Badge>{listing.status}</Badge>
                  </div>
                  <div className="mt-4 space-y-1 text-sm">
                    <InfoRow label="Block / Type" value={`${listing.block} / ${listing.lotType}`} />
                    <InfoRow label="Area" value={`${listing.area} sqm`} />
                    <InfoRow label="TCP" value={formatCurrency(listing.totalContractPrice)} />
                  </div>
                  {assignedClient && (
                    <div className="mt-4">
                      <div className="h-1.5 rounded-full bg-[#F0EDE8]">
                        <div className="h-1.5 rounded-full bg-[#C9A84C]" style={{ width: `${Math.min(100, paidPercent * 100)}%` }} />
                      </div>
                      <p className="mt-1 text-xs text-[#6B7280]">{assignedClient.buyer}</p>
                    </div>
                  )}
                  <button onClick={() => openListing(listing)} className="mt-4 w-full rounded-lg border border-[#1A1A2E]/20 bg-[#1A1A2E]/5 px-3 py-2 text-sm font-semibold text-[#1A1A2E] hover:bg-[#1A1A2E]/10">
                    Edit
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </div>

      <Modal title="Listing Record" isOpen={selectedListing !== null} onClose={() => setSelectedListing(null)}>
        {selectedListing && (
          <form
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault()
              void saveMutation.mutate(new FormData(event.currentTarget))
            }}
            className="grid gap-4 text-sm md:grid-cols-2"
          >
            <FormField label="Unit ID" name="unitId" defaultValue={selectedListing.unitId} required />
            <FormField label="Block" name="block" defaultValue={selectedListing.block} required />
            <FormField label="Lot Type" name="lotType" defaultValue={selectedListing.lotType} required />
            <FormField label="Area" name="area" defaultValue={String(selectedListing.area)} type="number" required />
            <FormField label="Price / SQM" name="pricePerSqm" defaultValue={String(selectedListing.pricePerSqm)} type="number" required />
            <FormField label="Legal / Misc %" name="legalMiscFee" defaultValue={String(selectedListing.legalMiscFee * 100)} type="number" required />
            <FormField
              label="Status"
              name="status"
              defaultValue={selectedListing.status}
              selectOptions={statusOptions.map((status) => ({ label: status, value: status }))}
            />
            <div className="sticky bottom-0 flex items-end justify-end gap-2 border-t border-[#E8E4DC] bg-white py-4 md:col-span-2">
              <button type="button" onClick={() => setSelectedListing(null)} className="rounded-lg border border-[#E8E4DC] bg-white px-4 py-2.5 text-sm font-semibold text-[#374151] hover:bg-[#F8F7F4]">
                Cancel
              </button>
              <button disabled={saveMutation.isLoading} className="inline-flex items-center gap-2 rounded-lg bg-[#1A1A2E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2A2A4E] disabled:cursor-not-allowed disabled:opacity-50">
                {saveMutation.isLoading ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : saveMutation.state === 'success' ? <Check className="h-4 w-4" /> : null}
                {saveMutation.isLoading ? 'Saving...' : saveMutation.state === 'success' ? 'Saved!' : 'Save Listing'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <ListingDrawer listing={detailListing} onClose={() => setDetailListing(null)} onEdit={(listing) => { setDetailListing(null); openListing(listing) }} assignedClient={detailListing ? getAssignedClient(detailListing) ?? null : null} />

      <ConfirmModal
        title="Change Listing Status"
        message={`Change ${pendingStatus?.listing.unitId ?? 'this listing'} to ${pendingStatus?.status ?? 'the selected status'}?`}
        confirmLabel="Confirm Change"
        loadingLabel="Updating..."
        tone="primary"
        isOpen={pendingStatus !== null}
        isLoading={statusMutation.isLoading}
        onClose={() => setPendingStatus(null)}
        onConfirm={() => {
          if (pendingStatus) void statusMutation.mutate(pendingStatus)
        }}
      />
    </Panel>
  )
}

function ListingDrawer({
  listing,
  assignedClient,
  onClose,
  onEdit,
}: {
  listing: Listing | null
  assignedClient: (typeof clientsV2)[number] | null
  onClose: () => void
  onEdit: (listing: Listing) => void
}) {
  if (!listing) return null
  const selectedInstallment = listingInstallmentDetails.find((detail) => detail.unitId === listing.unitId)

  return (
    <Drawer
      title={listing.unitId}
      subtitle={`${listing.block} | ${listing.lotType}`}
      isOpen={listing !== null}
      onClose={onClose}
      actions={
        <>
          <button onClick={() => onEdit(listing)} className="rounded-lg border border-[#1A1A2E]/20 bg-white px-3 py-2 text-sm font-semibold text-[#1A1A2E] hover:bg-[#1A1A2E]/5">
            Edit
          </button>
          <button className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100">
            Hold
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Badge>{listing.status}</Badge>
          {assignedClient ? <button className="text-sm font-semibold text-[#9A7A22]">View Client Profile</button> : <button className="text-sm font-semibold text-[#9A7A22]">Assign Client</button>}
        </div>
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <InfoRow label="Area" value={`${listing.area} sqm`} />
          <InfoRow label="Price / SQM" value={formatCurrency(listing.pricePerSqm)} />
          <InfoRow label="Net Price" value={formatCurrency(listing.netSellingPrice)} />
          <InfoRow label="Total Contract Price" value={formatCurrency(listing.totalContractPrice)} />
        </div>
        <section className="rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] p-4">
          <h3 className="mb-3 text-sm font-semibold text-[#374151]">Installment Terms From Inventory</h3>
          {selectedInstallment ? (
            <div className="grid gap-3 text-sm">
              <InfoRow label="DP" value={formatCurrency(selectedInstallment.dp ?? 0)} />
              <InfoRow label="Spot DP Discount" value={formatCurrency(selectedInstallment.spotDpDiscount ?? 0)} />
              <InfoRow label="Spot DP" value={formatCurrency(selectedInstallment.spotDp ?? 0)} />
              <InfoRow label="Balance" value={formatCurrency(selectedInstallment.balance ?? 0)} />
              <InfoRow label="Monthly 3 Years" value={formatCurrency(selectedInstallment.monthly3Years ?? 0)} />
              <InfoRow label="Monthly 5 Years" value={formatCurrency(selectedInstallment.monthly5Years ?? 0)} />
              <InfoRow label="Monthly 10 Years" value={formatCurrency(selectedInstallment.monthly10Years ?? 0)} />
            </div>
          ) : (
            <p className="text-sm text-[#6B7280]">No installment values found for this unit.</p>
          )}
        </section>
      </div>
    </Drawer>
  )
}

export default ListingsPage
