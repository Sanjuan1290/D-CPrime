import { useState } from 'react'
import type { FormEvent } from 'react'
import DataTable from '../../components/admin/DataTable'
import FormField from '../../components/admin/FormField'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import { useCreateLookup, useLookups, useUpdateLookup } from '../../hooks/useAdminResources'
import type { LookupPayload, LookupRecord } from '../../hooks/useAdminResources'

type EditorState = LookupRecord | 'new' | null

function LookupsPage() {
  const toast = useToast()
  const lookupsQuery = useLookups()
  const createLookup = useCreateLookup()
  const updateLookup = useUpdateLookup()
  const [editor, setEditor] = useState<EditorState>(null)
  const lookups = lookupsQuery.data?.data ?? []

  async function saveLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload: LookupPayload = {
      feature_key: String(formData.get('feature_key')).trim(),
      module_name: String(formData.get('module_name')).trim(),
      display_name: String(formData.get('display_name')).trim(),
    }

    if (!payload.feature_key || !payload.module_name || !payload.display_name) {
      toast.error('All lookup fields are required.')
      return
    }

    try {
      if (editor === 'new') {
        await createLookup.mutateAsync(payload)
      } else if (editor) {
        await updateLookup.mutateAsync({ id: editor.id, ...payload })
      }
      toast.success('Lookup saved.')
      setEditor(null)
    } catch {
      toast.error('Lookup could not be saved.')
    }
  }

  if (lookupsQuery.isLoading) return <LoadingSkeleton rows={8} />
  if (lookupsQuery.isError) return <ErrorState message="Lookup records could not be loaded from MySQL." onRetry={() => void lookupsQuery.refetch()} />

  return (
    <Panel
      title="Lookup Tables"
      subtitle="Editable application feature records stored in MySQL"
      actions={<button onClick={() => setEditor('new')} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white">Add Lookup</button>}
    >
      <DataTable
        headers={['Module', 'Feature Key', 'Display Name', 'Actions']}
        rows={lookups.map((lookup) => [
          lookup.module_name,
          lookup.feature_key,
          lookup.display_name,
          <button key={lookup.id} onClick={() => setEditor(lookup)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E]">
            Edit
          </button>,
        ])}
      />

      <Modal title={editor === 'new' ? 'Add Lookup' : 'Edit Lookup'} isOpen={editor !== null} onClose={() => setEditor(null)}>
        <form onSubmit={saveLookup} className="grid gap-4 md:grid-cols-2">
          <FormField label="Feature Key" name="feature_key" defaultValue={editor === 'new' ? '' : editor?.feature_key ?? ''} required />
          <FormField label="Module Name" name="module_name" defaultValue={editor === 'new' ? '' : editor?.module_name ?? ''} required />
          <FormField label="Display Name" name="display_name" defaultValue={editor === 'new' ? '' : editor?.display_name ?? ''} required className="md:col-span-2" />
          <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
            <button type="button" onClick={() => setEditor(null)} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151]">
              Cancel
            </button>
            <button disabled={createLookup.isPending || updateLookup.isPending} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
              {createLookup.isPending || updateLookup.isPending ? 'Saving...' : 'Save Lookup'}
            </button>
          </div>
        </form>
      </Modal>
    </Panel>
  )
}

export default LookupsPage
