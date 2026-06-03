import { useState } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { documents } from '../../data/adminMockData'

type DocumentRecord = (typeof documents)[number]
type DocumentAction = 'Approve' | 'Reject'

function DocumentsPage() {
  const toast = useToast()
  const [records, setRecords] = useState(documents)
  const [selectedDocument, setSelectedDocument] = useState<DocumentRecord | null>(null)
  const [action, setAction] = useState<DocumentAction>('Approve')

  function openReview(document: DocumentRecord, nextAction: DocumentAction) {
    setSelectedDocument(document)
    setAction(nextAction)
  }

  function confirmReview() {
    if (!selectedDocument) return

    setRecords((current) =>
      current.map((document) =>
        document.unitId === selectedDocument.unitId
          ? {
              ...document,
              documentStatus: action === 'Approve' ? 'COMPLETE' : 'INC',
              remarks: action === 'Approve' ? 'Approved in mock review.' : 'Rejected in mock review.',
            }
          : document,
      ),
    )
    toast.success(action === 'Approve' ? 'Document approved.' : 'Document rejected.')
    setSelectedDocument(null)
  }

  return (
    <Panel title="Document Status" subtitle="From Master List document status column">
      <DataTable
        headers={['Buyer', 'Unit ID', 'Document Status', 'Remarks', 'Admin Action']}
        rows={records.map((document) => [
          document.buyer,
          document.unitId,
          <Badge key={`${document.unitId}-docs`}>{document.documentStatus}</Badge>,
          document.remarks,
          <div key={`${document.unitId}-actions`} className="flex gap-2">
            <button
              onClick={() => openReview(document, 'Approve')}
              className="rounded-md border border-emerald-400/50 px-3 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-400/10"
            >
              Approve
            </button>
            <button
              onClick={() => openReview(document, 'Reject')}
              className="rounded-md border border-rose-400/50 px-3 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-400/10"
            >
              Reject
            </button>
          </div>,
        ])}
      />
      <Modal title={`${action} Document`} isOpen={selectedDocument !== null} onClose={() => setSelectedDocument(null)}>
        {selectedDocument && (
          <div className="space-y-5">
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <InfoRow label="Buyer" value={selectedDocument.buyer} />
              <InfoRow label="Unit" value={selectedDocument.unitId} />
              <InfoRow label="Current Status" value={selectedDocument.documentStatus} />
              <InfoRow label="Remarks" value={selectedDocument.remarks} />
            </div>
            <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
              <button
                onClick={() => setSelectedDocument(null)}
                className="rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300"
              >
                Cancel
              </button>
              <button onClick={confirmReview} className="rounded-md bg-[#C9A84C] px-4 py-2 text-sm font-bold text-black">
                Confirm {action}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Panel>
  )
}

export default DocumentsPage
