import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { clientDocuments, clientsV2 } from '../../data/adminMockData'

type ClientDocument = (typeof clientDocuments)[number]
type DocumentStatus = ClientDocument['status']

const passedStatuses: DocumentStatus[] = ['Approved', 'Submitted']
const initialRequirements = Array.from(new Set(clientDocuments.map((document) => document.documentType)))

function DocumentsPage() {
  const toast = useToast()
  const [records, setRecords] = useState(clientDocuments)
  const [requirements, setRequirements] = useState(initialRequirements)
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const selectedClient = selectedClientId ? clientsV2[Number(selectedClientId.replace('client-', '')) - 1] : null
  const selectedDocuments = selectedClientId ? records.filter((document) => document.clientId === selectedClientId) : []

  const clientSummaries = useMemo(
    () =>
      clientsV2.map((client, index) => {
        const clientId = `client-${index + 1}`
        const docs = records.filter((document) => document.clientId === clientId)
        const passed = docs.filter((document) => passedStatuses.includes(document.status)).length
        const approved = docs.filter((document) => document.status === 'Approved').length
        const rejected = docs.filter((document) => document.status === 'Rejected').length
        return {
          clientId,
          client,
          docs,
          passed,
          approved,
          rejected,
          completion: docs.length > 0 ? passed / docs.length : 0,
        }
      }),
    [records],
  )

  function updateDocument(documentId: string, status: DocumentStatus) {
    setRecords((current) =>
      current.map((document) =>
        document.id === documentId
          ? {
              ...document,
              status,
              submittedDate: status === 'Not Submitted' ? '' : document.submittedDate || '06/03/2026',
              rejectionRemark: status === 'Rejected' ? document.rejectionRemark || 'Needs admin follow-up.' : '',
            }
          : document,
      ),
    )
  }

  function togglePassed(document: ClientDocument) {
    updateDocument(document.id, passedStatuses.includes(document.status) ? 'Not Submitted' : 'Approved')
  }

  function saveChecklist() {
    toast.success('Document checklist updated.')
    setSelectedClientId(null)
  }

  function addRequirement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const documentType = String(formData.get('documentType')).trim()
    if (!documentType || requirements.includes(documentType)) return

    setRequirements((current) => [...current, documentType])
    setRecords((current) => [
      ...current,
      ...clientsV2.map((client, index) => ({
        id: `doc-custom-${Date.now()}-${index + 1}`,
        clientId: `client-${index + 1}`,
        clientName: client.buyer,
        unitId: client.unitId,
        documentType,
        status: 'Not Submitted',
        submittedDate: '',
        rejectionRemark: '',
      })),
    ])
    setIsRequirementModalOpen(false)
    toast.success('Document requirement added.')
  }

  function deleteRequirement(documentType: string) {
    setRequirements((current) => current.filter((item) => item !== documentType))
    setRecords((current) => current.filter((document) => document.documentType !== documentType))
    toast.success('Document requirement deleted.')
  }

  return (
    <div className="space-y-6">
      <Panel title="Document Requirement Template" subtitle="Create or remove required document types">
        <div className="mb-5 flex justify-end">
          <button onClick={() => setIsRequirementModalOpen(true)} className="rounded-md bg-[#C9A84C] px-4 py-2 text-sm font-bold text-black">
            Add Requirement
          </button>
        </div>
        <DataTable
          headers={['Required Document', 'Clients Assigned', 'Action']}
          rows={requirements.map((requirement) => [
            requirement,
            records.filter((document) => document.documentType === requirement).length,
            <button
              key={`${requirement}-delete`}
              onClick={() => deleteRequirement(requirement)}
              className="rounded-md border border-rose-400/40 px-3 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-400/10"
            >
              Delete
            </button>,
          ])}
        />
      </Panel>

      <Panel title="Client Document Checklists" subtitle="Required documents per client with admin pass toggles">
        <DataTable
          headers={['Client', 'Unit ID', 'Submitted / Required', 'Approved', 'Rejected', 'Document Status', 'Action']}
          rows={clientSummaries.map((summary) => [
            summary.client.buyer,
            summary.client.unitId,
            `${summary.passed}/${summary.docs.length}`,
            summary.approved,
            summary.rejected,
            <Badge key={`${summary.clientId}-status`}>
              {summary.passed === summary.docs.length ? 'COMPLETE' : summary.rejected > 0 ? 'FOR REVIEW' : 'INC'}
            </Badge>,
            <button
              key={`${summary.clientId}-review`}
              onClick={() => setSelectedClientId(summary.clientId)}
              className="rounded-md border border-[#C9A84C]/40 px-3 py-1 text-xs font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10"
            >
              Checklist
            </button>,
          ])}
        />
      </Panel>

      <Modal title="Required Documents" isOpen={selectedClientId !== null} onClose={() => setSelectedClientId(null)}>
        {selectedClient && (
          <div className="space-y-5">
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <InfoRow label="Client" value={selectedClient.buyer} />
              <InfoRow label="Unit" value={selectedClient.unitId} />
              <InfoRow label="Email" value={selectedClient.email ?? '-'} />
              <InfoRow label="Contact" value={selectedClient.contactNo ?? '-'} />
            </div>

            <div className="space-y-3">
              {selectedDocuments.map((document) => (
                <div key={document.id} className="grid gap-3 rounded-lg border border-white/10 bg-black p-4 md:grid-cols-[1fr_130px_150px] md:items-center">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={passedStatuses.includes(document.status)}
                      onChange={() => togglePassed(document)}
                      className="mt-1 h-5 w-5 accent-amber-500"
                    />
                    <span>
                      <span className="block font-semibold text-zinc-100">{document.documentType}</span>
                      <span className="mt-1 block text-xs text-zinc-500">
                        {document.submittedDate ? `Submitted ${document.submittedDate}` : 'Not yet submitted'}
                      </span>
                    </span>
                  </label>
                  <Badge>{document.status}</Badge>
                  <select
                    value={document.status}
                    onChange={(event) => updateDocument(document.id, event.target.value as DocumentStatus)}
                    className="rounded-md border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white"
                  >
                    <option>Not Submitted</option>
                    <option>Submitted</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
              <button onClick={() => setSelectedClientId(null)} className="rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300">
                Cancel
              </button>
              <button onClick={saveChecklist} className="rounded-md bg-[#C9A84C] px-4 py-2 text-sm font-bold text-black">
                Save Checklist
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal title="Add Required Document" isOpen={isRequirementModalOpen} onClose={() => setIsRequirementModalOpen(false)}>
        <form onSubmit={addRequirement} className="space-y-4 text-sm">
          <label className="block font-semibold text-zinc-300">
            Document Name
            <input
              name="documentType"
              placeholder="Example: Proof of Billing"
              className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-3 text-white"
            />
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsRequirementModalOpen(false)} className="rounded-md border border-white/10 px-4 py-2 font-semibold text-zinc-300">
              Cancel
            </button>
            <button className="rounded-md bg-[#C9A84C] px-4 py-2 font-bold text-black">Add Requirement</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default DocumentsPage
