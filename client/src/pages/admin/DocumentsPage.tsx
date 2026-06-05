import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Badge from '../../components/admin/Badge'
import ConfirmModal from '../../components/admin/ConfirmModal'
import DataTable from '../../components/admin/DataTable'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { clientDocuments, clientsV2, documentRequirements } from '../../data/adminMockData'

type DocumentStatus = (typeof clientDocuments)[number]['status']
type ClientDocument = {
  id: string
  clientId: string
  clientName: string
  unitId: string
  requirementId: string
  category: string
  documentType: string
  status: DocumentStatus
  submittedDate: string
  rejectionRemark: string
}
type Requirement = {
  id: string
  category: string
  documentType: string
  sortOrder: number
}

const passedStatuses: DocumentStatus[] = ['Approved', 'Submitted']
const initialRequirements: Requirement[] = documentRequirements.map((requirement) => ({ ...requirement }))
const documentCategoryOptions = Array.from(new Set(documentRequirements.map((requirement) => requirement.category)))

function DocumentsPage() {
  const toast = useToast()
  const [records, setRecords] = useState<ClientDocument[]>(clientDocuments)
  const [requirements, setRequirements] = useState(initialRequirements)
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [requirementPendingDelete, setRequirementPendingDelete] = useState<string | null>(null)
  const selectedClient = selectedClientId ? clientsV2.find((client) => client.clientId === selectedClientId) : null
  const selectedDocuments = selectedClientId
    ? records
        .filter((document) => document.clientId === selectedClientId)
        .sort((first, second) => getRequirementOrder(first.requirementId, requirements) - getRequirementOrder(second.requirementId, requirements))
    : []
  const groupedSelectedDocuments = groupDocumentsByCategory(selectedDocuments)
  const pendingRequirement = requirementPendingDelete ? requirements.find((requirement) => requirement.id === requirementPendingDelete) : null

  const clientSummaries = useMemo(
    () =>
      clientsV2.map((client) => {
        const clientId = client.clientId
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
              submittedDate: status === 'Not Submitted' ? '' : document.submittedDate || '06/05/2026',
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
    const category = String(formData.get('category')).trim() || 'Custom'
    if (!documentType || requirements.some((requirement) => requirement.category === category && requirement.documentType.toLowerCase() === documentType.toLowerCase())) return

    const requirement: Requirement = {
      id: `custom-${Date.now()}`,
      category,
      documentType,
      sortOrder: requirements.length + 1,
    }

    setRequirements((current) => [...current, requirement])
    setRecords((current) => [
      ...current,
      ...clientsV2.map((client, index) => ({
        id: `doc-custom-${Date.now()}-${index + 1}`,
        clientId: client.clientId,
        clientName: client.buyer,
        unitId: client.unitId,
        requirementId: requirement.id,
        category: requirement.category,
        documentType,
        status: 'Not Submitted' as DocumentStatus,
        submittedDate: '',
        rejectionRemark: '',
      })),
    ])
    setIsRequirementModalOpen(false)
    toast.success('Document requirement added.')
  }

  function deleteRequirement() {
    if (!requirementPendingDelete) return

    setRequirements((current) => current.filter((item) => item.id !== requirementPendingDelete))
    setRecords((current) => current.filter((document) => document.requirementId !== requirementPendingDelete))
    setRequirementPendingDelete(null)
    toast.success('Document requirement deleted.')
  }

  return (
    <div className="space-y-6">
      <Panel title="Document Requirement Template" subtitle="Canonical checklist from submitted document list">
        <div className="mb-5 flex justify-end">
          <button onClick={() => setIsRequirementModalOpen(true)} className="rounded-lg bg-[#C9A84C] px-4 py-2 text-sm font-bold text-[#1A1A2E] shadow-sm hover:bg-[#B9973C]">
            Add Requirement
          </button>
        </div>
        <DataTable
          headers={['Category', 'Required Document', 'Clients Assigned', 'Action']}
          rows={requirements.map((requirement) => [
            requirement.category,
            requirement.documentType,
            records.filter((document) => document.requirementId === requirement.id).length,
            <button
              key={`${requirement.id}-delete`}
              onClick={() => setRequirementPendingDelete(requirement.id)}
              className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
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
              className="rounded-lg border border-[#C9A84C]/40 px-3 py-1 text-xs font-semibold text-[#9A7A22] hover:bg-[#C9A84C]/10"
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

            <div className="space-y-4">
              {groupedSelectedDocuments.map((group) => (
                <section key={group.category} className="rounded-xl border border-[#E8E4DC] bg-white">
                  <div className="border-b border-[#F0EDE8] bg-[#F8F7F4] px-4 py-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A2E]">{group.category}</h3>
                  </div>
                  <div className="space-y-3 p-4">
                    {group.documents.map((document) => (
                      <div key={document.id} className="grid gap-3 rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] p-4 md:grid-cols-[1fr_130px_150px] md:items-center">
                        <label className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={passedStatuses.includes(document.status)}
                            onChange={() => togglePassed(document)}
                            className="mt-1 h-5 w-5 accent-amber-500"
                          />
                          <span>
                            <span className="block font-semibold text-[#1A1A2E]">{document.documentType}</span>
                            <span className="mt-1 block text-xs text-[#6B7280]">
                              {document.submittedDate ? `Submitted ${document.submittedDate}` : 'Not yet submitted'}
                            </span>
                          </span>
                        </label>
                        <Badge>{document.status}</Badge>
                        <select
                          value={document.status}
                          onChange={(event) => updateDocument(document.id, event.target.value as DocumentStatus)}
                          className="rounded-lg border border-[#E8E4DC] bg-white px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#C9A84C]"
                        >
                          <option>Not Submitted</option>
                          <option>Submitted</option>
                          <option>Approved</option>
                          <option>Rejected</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="flex justify-end gap-2 border-t border-[#F0EDE8] pt-4">
              <button onClick={() => setSelectedClientId(null)} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#F8F7F4]">
                Cancel
              </button>
              <button onClick={saveChecklist} className="rounded-lg bg-[#C9A84C] px-4 py-2 text-sm font-bold text-[#1A1A2E] hover:bg-[#B9973C]">
                Save Checklist
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal title="Add Required Document" isOpen={isRequirementModalOpen} onClose={() => setIsRequirementModalOpen(false)}>
        <form onSubmit={addRequirement} className="space-y-4 text-sm">
          <label className="block font-semibold text-[#374151]">
            Category
            <select
              name="category"
              defaultValue="Required for Submission"
              className="mt-2 w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-3 text-[#111827] outline-none focus:border-[#C9A84C]"
            >
              {documentCategoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="Custom">Custom</option>
            </select>
          </label>
          <label className="block font-semibold text-[#374151]">
            Document Name
            <input
              name="documentType"
              placeholder="Example: Proof of Billing"
              className="mt-2 w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-3 text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#C9A84C]"
            />
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsRequirementModalOpen(false)} className="rounded-lg border border-[#E8E4DC] px-4 py-2 font-semibold text-[#374151] hover:bg-[#F8F7F4]">
              Cancel
            </button>
            <button className="rounded-lg bg-[#C9A84C] px-4 py-2 font-bold text-[#1A1A2E] hover:bg-[#B9973C]">Add Requirement</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        title="Delete Document Requirement"
        message={`Remove ${pendingRequirement?.documentType ?? 'this document'} from every client checklist? This only changes the mock data in this browser.`}
        confirmLabel="Delete Requirement"
        isOpen={requirementPendingDelete !== null}
        onClose={() => setRequirementPendingDelete(null)}
        onConfirm={deleteRequirement}
      />
    </div>
  )
}

function getRequirementOrder(requirementId: string, requirements: Requirement[]) {
  return requirements.find((requirement) => requirement.id === requirementId)?.sortOrder ?? Number.MAX_SAFE_INTEGER
}

function groupDocumentsByCategory(documents: ClientDocument[]) {
  return documents.reduce<{ category: string; documents: ClientDocument[] }[]>((groups, document) => {
    const existingGroup = groups.find((group) => group.category === document.category)
    if (existingGroup) {
      existingGroup.documents.push(document)
      return groups
    }

    return [...groups, { category: document.category, documents: [document] }]
  }, [])
}

export default DocumentsPage
