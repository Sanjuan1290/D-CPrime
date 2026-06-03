import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import Panel from '../../components/admin/Panel'
import { formatCurrency } from '../../components/admin/formatters'
import { listings } from '../../data/adminMockData'

function ListingsPage() {
  return (
    <Panel title="Listings / LA Inventory" subtitle="Unit data from inventory workbook tabs">
      <DataTable
        headers={['Unit ID', 'Block', 'Lot Type', 'Area', 'Price / SQM', 'Net Selling Price', 'TCP', 'Status']}
        rows={listings.map((listing) => [
          listing.unitId,
          listing.block,
          listing.lotType,
          `${listing.area} sqm`,
          formatCurrency(listing.pricePerSqm),
          formatCurrency(listing.netSellingPrice),
          formatCurrency(listing.totalContractPrice),
          <Badge key={listing.unitId}>{listing.status}</Badge>,
        ])}
      />
    </Panel>
  )
}

export default ListingsPage
