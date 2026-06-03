import { useState } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { formatCurrency } from '../../components/admin/formatters'
import { listings } from '../../data/adminMockData'
import type { Listing } from '../../data/adminMockData'

function ListingsPage() {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)

  return (
    <Panel title="Listings / LA Inventory" subtitle="Unit data from inventory workbook tabs">
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
          <button
            key={`${listing.unitId}-view`}
            onClick={() => setSelectedListing(listing)}
            className="rounded-md border border-[#C9A84C]/40 px-3 py-1 text-xs font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10"
          >
            View
          </button>,
        ])}
      />
      <Modal title="Listing Details" isOpen={selectedListing !== null} onClose={() => setSelectedListing(null)}>
        {selectedListing && (
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <InfoRow label="Unit ID" value={selectedListing.unitId} />
            <InfoRow label="Block" value={selectedListing.block} />
            <InfoRow label="Lot Type" value={selectedListing.lotType} />
            <InfoRow label="Area" value={`${selectedListing.area} sqm`} />
            <InfoRow label="Price / SQM" value={formatCurrency(selectedListing.pricePerSqm)} />
            <InfoRow label="Net Selling Price" value={formatCurrency(selectedListing.netSellingPrice)} />
            <InfoRow label="Legal / Misc Fee" value={formatCurrency(selectedListing.netSellingPrice * selectedListing.legalMiscFee)} />
            <InfoRow label="Total Contract Price" value={formatCurrency(selectedListing.totalContractPrice)} />
            <InfoRow label="Status" value={selectedListing.status} />
          </div>
        )}
      </Modal>
    </Panel>
  )
}

export default ListingsPage
