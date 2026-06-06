import { useState } from 'react'
import type { FormEvent } from 'react'
import DataTable from '../../components/admin/DataTable'
import FormField from '../../components/admin/FormField'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import { useCreateSetting, useSettings, useUpdateSetting } from '../../hooks/useAdminResources'
import type { SettingPayload, SettingRecord } from '../../hooks/useAdminResources'

type EditorState = SettingRecord | 'new' | null

function SettingsPage() {
  const toast = useToast()
  const settingsQuery = useSettings()
  const createSetting = useCreateSetting()
  const updateSetting = useUpdateSetting()
  const [editor, setEditor] = useState<EditorState>(null)
  const settings = settingsQuery.data?.data ?? []

  async function saveSetting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload: SettingPayload = {
      setting_key: String(formData.get('setting_key')).trim(),
      setting_value: clean(formData.get('setting_value')),
      module_group: clean(formData.get('module_group')),
      updated_by: Number(formData.get('updated_by')) || null,
    }

    if (!payload.setting_key) {
      toast.error('Setting key is required.')
      return
    }

    try {
      if (editor === 'new') {
        await createSetting.mutateAsync(payload)
      } else if (editor) {
        await updateSetting.mutateAsync({ id: editor.id, ...payload })
      }
      toast.success('Setting saved.')
      setEditor(null)
    } catch {
      toast.error('Setting could not be saved.')
    }
  }

  if (settingsQuery.isLoading) return <LoadingSkeleton rows={8} />
  if (settingsQuery.isError) return <ErrorState message="Settings could not be loaded from MySQL." onRetry={() => void settingsQuery.refetch()} />

  return (
    <Panel
      title="System Settings"
      subtitle="Editable runtime settings stored in MySQL"
      actions={<button onClick={() => setEditor('new')} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white">Add Setting</button>}
    >
      <DataTable
        headers={['Group', 'Key', 'Value', 'Updated By', 'Actions']}
        rows={settings.map((setting) => [
          setting.module_group ?? '-',
          setting.setting_key,
          setting.setting_value ?? '-',
          setting.updated_by ?? '-',
          <button key={setting.id} onClick={() => setEditor(setting)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E]">
            Edit
          </button>,
        ])}
      />

      <Modal title={editor === 'new' ? 'Add Setting' : 'Edit Setting'} isOpen={editor !== null} onClose={() => setEditor(null)}>
        <form onSubmit={saveSetting} className="grid gap-4 md:grid-cols-2">
          <FormField label="Setting Key" name="setting_key" defaultValue={editor === 'new' ? '' : editor?.setting_key ?? ''} required />
          <FormField label="Group" name="module_group" defaultValue={editor === 'new' ? 'general' : editor?.module_group ?? ''} />
          <FormField label="Updated By User ID" name="updated_by" type="number" defaultValue={editor === 'new' || !editor?.updated_by ? '' : String(editor.updated_by)} />
          <FormField label="Value" name="setting_value" defaultValue={editor === 'new' ? '' : editor?.setting_value ?? ''} textarea className="md:col-span-2" />
          <Actions isSaving={createSetting.isPending || updateSetting.isPending} onCancel={() => setEditor(null)} />
        </form>
      </Modal>
    </Panel>
  )
}

function Actions({ isSaving, onCancel }: { isSaving: boolean; onCancel: () => void }) {
  return (
    <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
      <button type="button" onClick={onCancel} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151]">
        Cancel
      </button>
      <button disabled={isSaving} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}

function clean(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim()
  return text || null
}

export default SettingsPage
