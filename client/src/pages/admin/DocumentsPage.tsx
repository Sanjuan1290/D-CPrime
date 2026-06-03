import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import Panel from '../../components/admin/Panel'
import { documents } from '../../data/adminMockData'

function DocumentsPage() {
  return (
    <Panel title="Document Status" subtitle="From Master List document status column">
      <DataTable
        headers={['Buyer', 'Unit ID', 'Document Status', 'Remarks', 'Admin Action']}
        rows={documents.map((document) => [
          document.buyer,
          document.unitId,
          <Badge key={`${document.unitId}-docs`}>{document.documentStatus}</Badge>,
          document.remarks,
          <div key={`${document.unitId}-actions`} className="flex gap-2">
            <button className="rounded-md border border-emerald-300 px-3 py-1 text-xs font-semibold text-emerald-700">Approve</button>
            <button className="rounded-md border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-700">Reject</button>
          </div>,
        ])}
      />
    </Panel>
  )
}

export default DocumentsPage
