import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency } from '../../components/admin/formatters'
import { listings as initialListings } from '../../data/adminMockData'
import type { Listing } from '../../data/adminMockData'
import { listingInstallmentDetails } from '../../data/sourceDetails'

function ListingsPage() {
  const toast = useToast()
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('dcprime_listings')
    return saved ? (JSON.parse(saved) as Listing[]) : initialListings
  })
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [detailListing, setDetailListing] = useState<Listing | null>(null)
  const selectedInstallment = detailListing
    ? listingInstallmentDetails.find((detail) => detail.unitId === detailListing.unitId)
    : undefined

  useEffect(() => {
    localStorage.setItem('dcprime_listings', JSON.stringify(listings))
  }, [listings])

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

  function saveListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedListing) return

    const formData = new FormData(event.currentTarget)
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
      status: String(formData.get('status')) as Listing['status'],
    }

    setListings((current) => {
      const exists = current.some((item) => item.unitId === selectedListing.unitId)
      return exists ? current.map((item) => (item.unitId === selectedListing.unitId ? listing : item)) : [listing, ...current]
    })
    setSelectedListing(null)
    toast.success('Listing saved.')
  }

  function archiveListing(listing: Listing) {
    setListings((current) => current.map((item) => (item.unitId === listing.unitId ? { ...item, status: 'Hold' } : item)))
    toast.success('Listing moved to hold.')
  }

  return (
    <Panel title="Listings / LA Inventory" subtitle="Create, edit, and hold lot inventory">
      <div className="mb-5 flex justify-end">
        <button onClick={() => openListing()} className="rounded-md bg-[#C9A84C] px-4 py-2 text-sm font-bold text-black">
          Add Listing
        </button>
      </div>
      <DataTable
        headers={['Unit ID', 'Block', 'Lot Type', 'Area', 'Price / SQM', 'Net Selling Price', 'TCP', 'Status', 'Action']}
        rows={listings.map((listing) => [
          listing.unitId,
          listing.block,
          listing.lotType,
          `${listing.area} sqm`,
          formatCurrency(listing.pricePerSqm),
          formatCurrency(listing.netSellingPrice),
          formatCurrency(listing.totalContractPrice),
          <Badge key={listing.unitId}>{listing.status}</Badge>,
          <div key={`${listing.unitId}-actions`} className="flex gap-2">
            <button
              onClick={() => setDetailListing(listing)}
              className="rounded-md border border-white/20 px-3 py-1 text-xs font-semibold text-zinc-300 hover:bg-white/5"
            >
              Details
            </button>
            <button
              onClick={() => openListing(listing)}
              className="rounded-md border border-[#C9A84C]/40 px-3 py-1 text-xs font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10"
            >
              Edit
            </button>
            <button
              onClick={() => archiveListing(listing)}
              className="rounded-md border border-rose-400/40 px-3 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-400/10"
            >
              Hold
            </button>
          </div>,
        ])}
      />

      <Modal title="Listing Record" isOpen={selectedListing !== null} onClose={() => setSelectedListing(null)}>
        {selectedListing && (
          <form onSubmit={saveListing} className="grid gap-4 text-sm md:grid-cols-2">
            <TextInput label="Unit ID" name="unitId" value={selectedListing.unitId} />
            <TextInput label="Block" name="block" value={selectedListing.block} />
            <TextInput label="Lot Type" name="lotType" value={selectedListing.lotType} />
            <TextInput label="Area" name="area" value={String(selectedListing.area)} type="number" />
            <TextInput label="Price / SQM" name="pricePerSqm" value={String(selectedListing.pricePerSqm)} type="number" />
            <TextInput label="Legal / Misc %" name="legalMiscFee" value={String(selectedListing.legalMiscFee * 100)} type="number" />
            <label className="block font-semibold text-zinc-300">
              Status
              <select
                name="status"
                defaultValue={selectedListing.status}
                className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-3 text-white"
              >
                <option>Available</option>
                <option>Reserved</option>
                <option>Sold</option>
                <option>Hold</option>
              </select>
            </label>
            <div className="flex items-end justify-end gap-2">
              <button type="button" onClick={() => setSelectedListing(null)} className="rounded-md border border-white/10 px-4 py-2 font-semibold text-zinc-300">
                Cancel
              </button>
              <button className="rounded-md bg-[#C9A84C] px-4 py-2 font-bold text-black">Save Listing</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal title="Listing Details" isOpen={detailListing !== null} onClose={() => setDetailListing(null)}>
        {detailListing && (
          <div className="space-y-5">
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <InfoRow label="Unit ID" value={detailListing.unitId} />
              <InfoRow label="Block" value={detailListing.block} />
              <InfoRow label="Lot Type" value={detailListing.lotType} />
              <InfoRow label="Area" value={`${detailListing.area} sqm`} />
              <InfoRow label="Price / SQM" value={formatCurrency(detailListing.pricePerSqm)} />
              <InfoRow label="Total Contract Price" value={formatCurrency(detailListing.totalContractPrice)} />
            </div>
            <section className="rounded-lg border border-white/10 bg-black p-4">
              <h3 className="mb-3 text-sm font-bold text-zinc-100">Installment Terms From Inventory</h3>
              {selectedInstallment ? (
                <div className="grid gap-3 text-sm md:grid-cols-2">
                  <InfoRow label="DP" value={formatCurrency(selectedInstallment.dp ?? 0)} />
                  <InfoRow label="Spot DP Discount" value={formatCurrency(selectedInstallment.spotDpDiscount ?? 0)} />
                  <InfoRow label="Spot DP" value={formatCurrency(selectedInstallment.spotDp ?? 0)} />
                  <InfoRow label="Balance" value={formatCurrency(selectedInstallment.balance ?? 0)} />
                  <InfoRow label="Monthly 3 Years" value={formatCurrency(selectedInstallment.monthly3Years ?? 0)} />
                  <InfoRow label="Monthly 5 Years" value={formatCurrency(selectedInstallment.monthly5Years ?? 0)} />
                  <InfoRow label="Monthly 10 Years" value={formatCurrency(selectedInstallment.monthly10Years ?? 0)} />
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No installment values found for this unit.</p>
              )}
            </section>
          </div>
        )}
      </Modal>
    </Panel>
  )
}

function TextInput({ label, name, value, type = 'text' }: { label: string; name: string; value: string; type?: string }) {
  return (
    <label className="block font-semibold text-zinc-300">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={value}
        className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-3 text-white"
      />
    </label>
  )
}

export default ListingsPage
