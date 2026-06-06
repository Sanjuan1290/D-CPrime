import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import FormField from '../../components/admin/FormField'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { useToast } from '../../components/admin/Toast'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import {
  useClientDocuments,
  useCreateClientDocument,
  useCreateDocumentRequirement,
  useDocumentRequirements,
  useUpdateClientDocument,
  useUpdateDocumentRequirement,
} from '../../hooks/useAdminResources'
import type {
  ClientDocumentPayload,
  ClientDocumentRecord,
  DocumentRequirementPayload,
  DocumentRequirementRecord,
} from '../../hooks/useAdminResources'
import { useBalances } from '../../hooks/useBalances'
import { cloudinaryFolders, uploadToCloudinary } from '../../lib/cloudinary'

type DocumentEditor = ClientDocumentRecord | 'new' | null
type RequirementEditor = DocumentRequirementRecord | 'new' | null

const documentStatuses = ['not_submitted', 'pending', 'approved', 'rejected']

function DocumentsPage() {
  const toast = useToast()
  const documentsQuery = useClientDocuments()
  const requirementsQuery = useDocumentRequirements()
  const balancesQuery = useBalances()
  const createDocument = useCreateClientDocument()
  const updateDocument = useUpdateClientDocument()
  const createRequirement = useCreateDocumentRequirement()
  const updateRequirement = useUpdateDocumentRequirement()
  const [documentEditor, setDocumentEditor] = useState<DocumentEditor>(null)
  const [requirementEditor, setRequirementEditor] = useState<RequirementEditor>(null)

  const documents = documentsQuery.data?.data ?? []
  const requirements = requirementsQuery.data?.data ?? []
  const balances = balancesQuery.data?.data ?? []
  const requirementById = useMemo(() => new Map(requirements.map((requirement) => [requirement.id, requirement])), [requirements])
  const balanceByClientUnit = useMemo(() => new Map(balances.map((balance) => [balance.client_unit_id, balance])), [balances])
  const totals = useMemo(() => {
    const approved = documents.filter((document) => document.status === 'approved').length
    const pending = documents.filter((document) => document.status === 'pending').length
    const missing = documents.filter((document) => document.status === 'not_submitted').length
    return { approved, pending, missing }
  }, [documents])

  async function saveDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const clientUnitId = Number(formData.get('client_unit_id'))
    const balance = balanceByClientUnit.get(clientUnitId)
    const file = formData.get('file') instanceof File && (formData.get('file') as File).size > 0 ? (formData.get('file') as File) : null
    let file_url = documentEditor === 'new' ? null : documentEditor?.file_url ?? null
    let file_public_id = documentEditor === 'new' ? null : documentEditor?.file_public_id ?? null

    try {
      if (file) {
        const upload = await uploadToCloudinary(file, {
          folder: cloudinaryFolders.clientDocuments({
            clientUnitId,
            buyer: balance?.buyer_name,
            unitId: balance?.unit_id,
          }),
          resourceType: 'auto',
          tags: ['client_document', 'dc_prime'],
        })
        file_url = upload.secure_url
        file_public_id = upload.public_id
      }

      const payload: ClientDocumentPayload = {
        client_unit_id: clientUnitId,
        document_id: Number(formData.get('document_id')),
        file_url,
        file_public_id,
        status: String(formData.get('status')) as ClientDocumentRecord['status'],
        reviewed_by: numberOrNull(formData.get('reviewed_by')),
        reviewed_at: normalizeDateTime(clean(formData.get('reviewed_at'))),
      }

      if (!payload.client_unit_id || !payload.document_id) {
        toast.error('Client account and requirement are required.')
        return
      }

      if (documentEditor === 'new') {
        await createDocument.mutateAsync(payload)
      } else if (documentEditor) {
        await updateDocument.mutateAsync({ id: documentEditor.id, ...payload })
      }
      toast.success('Document saved.')
      setDocumentEditor(null)
    } catch {
      toast.error('Document could not be saved.')
    }
  }

  async function saveRequirement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload: DocumentRequirementPayload = {
      name: String(formData.get('name')).trim(),
      description: clean(formData.get('description')),
      is_required: formData.get('is_required') === 'on',
      status: String(formData.get('status')) as DocumentRequirementRecord['status'],
    }

    if (!payload.name) {
      toast.error('Requirement name is required.')
      return
    }

    try {
      if (requirementEditor === 'new') {
        await createRequirement.mutateAsync(payload)
      } else if (requirementEditor) {
        await updateRequirement.mutateAsync({ id: requirementEditor.id, ...payload })
      }
      toast.success('Requirement saved.')
      setRequirementEditor(null)
    } catch {
      toast.error('Requirement could not be saved.')
    }
  }

  const isLoading = documentsQuery.isLoading || requirementsQuery.isLoading || balancesQuery.isLoading
  const isError = documentsQuery.isError || requirementsQuery.isError || balancesQuery.isError

  if (isLoading) return <LoadingSkeleton rows={8} />
  if (isError) return <ErrorState message="Documents could not be loaded from MySQL." onRetry={() => window.location.reload()} />

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Approved" value={totals.approved.toString()} note="Requirements completed" />
        <StatCard label="Pending Review" value={totals.pending.toString()} note="Uploaded and waiting" />
        <StatCard label="Not Submitted" value={totals.missing.toString()} note="Open requirements" />
      </div>

      <Panel
        title="Client Documents"
        subtitle="Editable document checklist records stored in MySQL"
        actions={<button onClick={() => setDocumentEditor('new')} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white">Add Document</button>}
      >
        <DataTable
          headers={['Client', 'Unit', 'Requirement', 'Status', 'File', 'Reviewed By', 'Actions']}
          rows={documents.map((document) => {
            const balance = balanceByClientUnit.get(document.client_unit_id)
            return [
              balance?.buyer_name ?? `Account #${document.client_unit_id}`,
              balance?.unit_id ?? '-',
              requirementById.get(document.document_id)?.name ?? `Requirement #${document.document_id}`,
              <Badge key={`${document.id}-status`}>{titleCase(document.status)}</Badge>,
              document.file_url ? (
                <a key={`${document.id}-file`} href={document.file_url} target="_blank" rel="noreferrer" className="font-semibold text-[#1A1A2E]">
                  Open File
                </a>
              ) : (
                '-'
              ),
              document.reviewed_by ?? '-',
              <button key={document.id} onClick={() => setDocumentEditor(document)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E]">
                Edit
              </button>,
            ]
          })}
        />
      </Panel>

      <Panel
        title="Document Requirements"
        subtitle="Editable master checklist"
        actions={<button onClick={() => setRequirementEditor('new')} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white">Add Requirement</button>}
      >
        <DataTable
          headers={['Name', 'Description', 'Required', 'Status', 'Actions']}
          rows={requirements.map((requirement) => [
            requirement.name,
            requirement.description ?? '-',
            Number(requirement.is_required) ? 'Yes' : 'No',
            <Badge key={`${requirement.id}-status`}>{titleCase(requirement.status)}</Badge>,
            <button key={requirement.id} onClick={() => setRequirementEditor(requirement)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E]">
              Edit
            </button>,
          ])}
        />
      </Panel>

      <DocumentModal editor={documentEditor} balances={balances} requirements={requirements} isSaving={createDocument.isPending || updateDocument.isPending} onClose={() => setDocumentEditor(null)} onSubmit={saveDocument} />
      <RequirementModal editor={requirementEditor} isSaving={createRequirement.isPending || updateRequirement.isPending} onClose={() => setRequirementEditor(null)} onSubmit={saveRequirement} />
    </div>
  )
}

function DocumentModal({
  editor,
  balances,
  requirements,
  isSaving,
  onClose,
  onSubmit,
}: {
  editor: DocumentEditor
  balances: Array<{ client_unit_id: number; buyer_name: string; unit_id: string; project_name: string }>
  requirements: DocumentRequirementRecord[]
  isSaving: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const document = editor === 'new' ? null : editor
  return (
    <Modal title={editor === 'new' ? 'Add Document' : 'Edit Document'} isOpen={editor !== null} onClose={onClose}>
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <FormField label="Client Account" name="client_unit_id" defaultValue={String(document?.client_unit_id ?? balances[0]?.client_unit_id ?? '')} selectOptions={balances.map((balance) => ({ label: `${balance.buyer_name} | ${balance.unit_id} | ${balance.project_name}`, value: String(balance.client_unit_id) }))} required />
        <FormField label="Requirement" name="document_id" defaultValue={String(document?.document_id ?? requirements[0]?.id ?? '')} selectOptions={requirements.map((requirement) => ({ label: requirement.name, value: String(requirement.id) }))} required />
        <FormField label="Status" name="status" defaultValue={document?.status ?? 'not_submitted'} selectOptions={documentStatuses.map((status) => ({ label: titleCase(status), value: status }))} />
        <FormField label="Reviewed By User ID" name="reviewed_by" type="number" defaultValue={document?.reviewed_by ? String(document.reviewed_by) : ''} />
        <FormField label="Reviewed At" name="reviewed_at" type="datetime-local" defaultValue={toDateTimeLocal(document?.reviewed_at)} />
        <label className="block text-sm font-semibold text-[#374151]">
          <span className="mb-1.5 block">Upload File</span>
          <input name="file" type="file" className="w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827]" />
        </label>
        <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151]">
            Cancel
          </button>
          <button disabled={isSaving} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
            {isSaving ? 'Saving...' : 'Save Document'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function RequirementModal({
  editor,
  isSaving,
  onClose,
  onSubmit,
}: {
  editor: RequirementEditor
  isSaving: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const requirement = editor === 'new' ? null : editor
  return (
    <Modal title={editor === 'new' ? 'Add Requirement' : 'Edit Requirement'} isOpen={editor !== null} onClose={onClose}>
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <FormField label="Name" name="name" defaultValue={requirement?.name ?? ''} required />
        <FormField label="Status" name="status" defaultValue={requirement?.status ?? 'active'} selectOptions={['active', 'inactive'].map((status) => ({ label: titleCase(status), value: status }))} />
        <label className="flex items-center gap-3 rounded-lg border border-[#E8E4DC] px-3 py-2.5 text-sm font-semibold text-[#374151]">
          <input name="is_required" type="checkbox" defaultChecked={requirement ? Boolean(Number(requirement.is_required)) : true} className="h-4 w-4 accent-[#1A1A2E]" />
          Required
        </label>
        <FormField label="Description" name="description" defaultValue={requirement?.description ?? ''} textarea />
        <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151]">
            Cancel
          </button>
          <button disabled={isSaving} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
            {isSaving ? 'Saving...' : 'Save Requirement'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function titleCase(value?: string | null) {
  return String(value ?? '-').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return ''
  return value.replace(' ', 'T').slice(0, 16)
}

function normalizeDateTime(value?: string | null) {
  return value ? value.replace('T', ' ') : null
}

function clean(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim()
  return text || null
}

function numberOrNull(value: FormDataEntryValue | null) {
  const number = Number(value)
  return Number.isFinite(number) && String(value ?? '').trim() ? number : null
}

export default DocumentsPage
