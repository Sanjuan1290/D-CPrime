import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import FilterBar from '../../components/admin/FilterBar'
import FormField from '../../components/admin/FormField'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from '../../hooks/useAdminResources'
import type { UserPayload, UserRecord } from '../../hooks/useAdminResources'
import type { Role } from '../../types'

type EditorState = UserRecord | 'new' | null

const roles: Role[] = ['owner', 'admin', 'treasury', 'broker', 'manager', 'agent', 'client']

function UserManagementPage() {
  const toast = useToast()
  const usersQuery = useUsers()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [editor, setEditor] = useState<EditorState>(null)
  const users = usersQuery.data?.data ?? []

  const visibleUsers = useMemo(() => {
    const term = search.trim().toLowerCase()
    return users
      .filter((user) => roleFilter === 'all' || user.role === roleFilter)
      .filter((user) => {
        if (!term) return true
        return `${user.full_name} ${user.email ?? ''} ${user.contact_no ?? ''} ${user.role}`.toLowerCase().includes(term)
      })
      .sort((a, b) => a.full_name.localeCompare(b.full_name))
  }, [roleFilter, search, users])

  async function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password') ?? '').trim()
    const payload: UserPayload = {
      full_name: String(formData.get('full_name')).trim(),
      email: clean(formData.get('email')),
      contact_no: clean(formData.get('contact_no')),
      role: String(formData.get('role')) as Role,
      status: String(formData.get('status')) as UserPayload['status'],
      accreditation_date: clean(formData.get('accreditation_date')),
      barcode_value: clean(formData.get('barcode_value')),
      avatar_url: clean(formData.get('avatar_url')),
      ...(password ? { password } : {}),
    }

    if (!payload.full_name || !payload.role) {
      toast.error('Full name and role are required.')
      return
    }

    try {
      if (editor === 'new') {
        await createUser.mutateAsync(payload)
      } else if (editor) {
        await updateUser.mutateAsync({ id: editor.id, ...payload })
      }
      toast.success('User saved.')
      setEditor(null)
    } catch {
      toast.error('User could not be saved.')
    }
  }

  async function deactivateUser(user: UserRecord) {
    try {
      await deleteUser.mutateAsync(user.id)
      toast.success('User deactivated.')
    } catch {
      toast.error('User could not be deactivated.')
    }
  }

  if (usersQuery.isLoading) return <LoadingSkeleton rows={8} />
  if (usersQuery.isError) return <ErrorState message="Users could not be loaded from MySQL." onRetry={() => void usersQuery.refetch()} />

  return (
    <Panel
      title="User Management"
      subtitle="Editable staff, sellers, managers, and client user accounts from MySQL"
      actions={<button onClick={() => setEditor('new')} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white">Add User</button>}
    >
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search name, email, contact, or role..."
        tabs={[{ label: 'All', value: 'all', count: users.length }, ...roles.map((role) => ({ label: titleCase(role), value: role, count: users.filter((user) => user.role === role).length }))]}
        activeTab={roleFilter}
        onTabChange={setRoleFilter}
        onReset={() => {
          setSearch('')
          setRoleFilter('all')
        }}
      />

      <DataTable
        searchable={false}
        headers={['Name', 'Email', 'Contact', 'Role', 'Status', 'Barcode', 'Actions']}
        rows={visibleUsers.map((user) => [
          <span key={`${user.id}-name`} className="font-semibold text-[#1A1A2E]">{user.full_name}</span>,
          user.email ?? '-',
          user.contact_no ?? '-',
          titleCase(user.role),
          <Badge key={`${user.id}-status`}>{titleCase(user.status)}</Badge>,
          user.barcode_value ?? '-',
          <div key={`${user.id}-actions`} className="flex flex-wrap gap-2">
            <button onClick={() => setEditor(user)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E]">
              Edit
            </button>
            {user.status === 'active' && (
              <button onClick={() => void deactivateUser(user)} className="rounded-md border border-rose-100 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
                Deactivate
              </button>
            )}
          </div>,
        ])}
      />

      <Modal title={editor === 'new' ? 'Add User' : 'Edit User'} isOpen={editor !== null} onClose={() => setEditor(null)}>
        <form onSubmit={saveUser} className="grid gap-4 md:grid-cols-2">
          <FormField label="Full Name" name="full_name" defaultValue={editor === 'new' ? '' : editor?.full_name ?? ''} required />
          <FormField label="Email" name="email" type="email" defaultValue={editor === 'new' ? '' : editor?.email ?? ''} />
          <FormField label="Contact No." name="contact_no" defaultValue={editor === 'new' ? '' : editor?.contact_no ?? ''} />
          <FormField label="Role" name="role" defaultValue={editor === 'new' ? 'agent' : editor?.role ?? 'agent'} selectOptions={roles.map((role) => ({ label: titleCase(role), value: role }))} />
          <FormField label="Status" name="status" defaultValue={editor === 'new' ? 'active' : editor?.status ?? 'active'} selectOptions={['active', 'inactive'].map((status) => ({ label: titleCase(status), value: status }))} />
          <FormField label="Accreditation Date" name="accreditation_date" type="date" defaultValue={editor === 'new' ? '' : normalizeDate(editor?.accreditation_date)} />
          <FormField label="Barcode Value" name="barcode_value" defaultValue={editor === 'new' ? '' : editor?.barcode_value ?? ''} />
          <FormField label="Avatar URL" name="avatar_url" defaultValue={editor === 'new' ? '' : editor?.avatar_url ?? ''} />
          <FormField label={editor === 'new' ? 'Password' : 'New Password'} name="password" type="password" placeholder={editor === 'new' ? '' : 'Leave blank to keep current password'} />
          <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
            <button type="button" onClick={() => setEditor(null)} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151]">
              Cancel
            </button>
            <button disabled={createUser.isPending || updateUser.isPending} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
              {createUser.isPending || updateUser.isPending ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </Modal>
    </Panel>
  )
}

function titleCase(value?: string | null) {
  return String(value ?? '-').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function normalizeDate(value?: string | null) {
  return value ? value.slice(0, 10) : ''
}

function clean(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim()
  return text || null
}

export default UserManagementPage
