import { useEffect, useState } from 'react'
import Badge from '../../components/admin/Badge'
import Field from '../../components/admin/Field'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { featureKeys, featureLabels, rolePresets, users as initialUsers } from '../../data/adminMockData'
import type { AdminUser, Role, UserStatus } from '../../data/adminMockData'

type PresetRole = keyof typeof rolePresets

function UserManagementPage() {
  const toast = useToast()
  const [users, setUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('dcprime_users')
    return saved ? JSON.parse(saved) as AdminUser[] : initialUsers
  })
  const [selectedId, setSelectedId] = useState(initialUsers[1].id)
  const [userPage, setUserPage] = useState(1)
  const pageSize = Number(localStorage.getItem('dcprime_page_size') ?? 20)
  const totalUserPages = Math.max(1, Math.ceil(users.length / pageSize))
  const currentUserPage = Math.min(userPage, totalUserPages)
  const visibleUsers = users.slice((currentUserPage - 1) * pageSize, currentUserPage * pageSize)
  const selectedUser = users.find((user) => user.id === selectedId) ?? users[0]

  useEffect(() => {
    localStorage.setItem('dcprime_users', JSON.stringify(users))
  }, [users])

  function updateSelected(updates: Partial<AdminUser>) {
    setUsers((current) => current.map((user) => (user.id === selectedUser.id ? { ...user, ...updates } : user)))
  }

  function applyPreset(role: PresetRole) {
    updateSelected({ role, permissions: { ...rolePresets[role] } })
  }

  function addUser() {
    const nextId = Math.max(...users.map((user) => user.id)) + 1
    const user: AdminUser = {
      id: nextId,
      fullName: 'NEW ACCREDITED SELLER',
      email: `seller${nextId}@dcprime.test`,
      password: 'Auto123!',
      role: 'agent',
      assignedProjects: ['Gen. Emilio Aguinaldo, Cavite'],
      status: 'Active',
      permissions: { ...rolePresets.agent },
    }
    setUsers((current) => [...current, user])
    setSelectedId(nextId)
    setUserPage(Math.ceil((users.length + 1) / pageSize))
    toast.success('User created successfully.')
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.45fr]">
      <Panel title="Users" subtitle="Admin can create, edit, and deactivate">
        <button onClick={addUser} className="mb-4 rounded-md bg-[#C9A84C] px-4 py-2 text-sm font-bold text-black">
          Add User
        </button>
        <div className="space-y-3">
          {visibleUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedId(user.id)}
              className={`w-full rounded-lg border p-4 text-left transition ${
                selectedId === user.id ? 'border-[#C9A84C] bg-[#C9A84C]/10' : 'border-white/10 bg-black hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{user.fullName}</p>
                  <p className="mt-1 text-sm text-zinc-500">{user.email}</p>
                </div>
                <Badge>{user.status}</Badge>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{user.role}</p>
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
          <span>
            Showing {(currentUserPage - 1) * pageSize + 1}-{Math.min(currentUserPage * pageSize, users.length)} of {users.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setUserPage(Math.max(1, currentUserPage - 1))}
              disabled={currentUserPage === 1}
              className="rounded-md border border-white/10 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setUserPage(Math.min(totalUserPages, currentUserPage + 1))}
              disabled={currentUserPage === totalUserPages}
              className="rounded-md border border-white/10 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </Panel>

      <Panel title="Profile And Feature Permissions" subtitle="Per-user JSON toggle set">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full Name" value={selectedUser.fullName} onChange={(value) => updateSelected({ fullName: value })} />
          <Field label="Email" value={selectedUser.email} onChange={(value) => updateSelected({ email: value })} />
          <Field label="Password" value={selectedUser.password} onChange={(value) => updateSelected({ password: value })} />
          <label className="block text-sm font-semibold text-zinc-300">
            Role
            <select
              value={selectedUser.role}
              onChange={(event) => updateSelected({ role: event.target.value as Role })}
              className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-3 text-white"
            >
              <option value="owner">owner</option>
              <option value="admin">admin</option>
              <option value="treasury">treasury</option>
              <option value="broker">broker</option>
              <option value="manager">manager</option>
              <option value="agent">agent</option>
              <option value="client">client</option>
            </select>
          </label>
          <Field
            label="Assigned Project(s)"
            value={selectedUser.assignedProjects.join(', ')}
            onChange={(value) =>
              updateSelected({ assignedProjects: value.split(',').map((project) => project.trim()).filter(Boolean) })
            }
          />
          <label className="block text-sm font-semibold text-zinc-300">
            Status
            <select
              value={selectedUser.status}
              onChange={(event) => updateSelected({ status: event.target.value as UserStatus })}
              className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-3 text-white"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={() => applyPreset('agent')} className="rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-zinc-200">Apply Agent Defaults</button>
          <button onClick={() => applyPreset('treasury')} className="rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-zinc-200">Apply Treasury Defaults</button>
          <button onClick={() => applyPreset('broker')} className="rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-zinc-200">Apply Broker Defaults</button>
          <button onClick={() => applyPreset('manager')} className="rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-zinc-200">Apply Manager Defaults</button>
          <button onClick={() => applyPreset('client')} className="rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-zinc-200">Apply Client Defaults</button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {featureKeys.map((key) => (
            <label key={key} className="flex min-h-14 items-center justify-between gap-3 rounded-lg border border-white/10 bg-black px-4 py-3">
              <span className="text-sm font-semibold text-zinc-300">{featureLabels[key]}</span>
              <input
                type="checkbox"
                checked={selectedUser.permissions[key]}
                onChange={(event) =>
                  updateSelected({ permissions: { ...selectedUser.permissions, [key]: event.target.checked } })
                }
                className="h-5 w-5 accent-amber-500"
              />
            </label>
          ))}
        </div>
        <div className="sticky bottom-0 mt-6 border-t border-white/10 bg-[#111111] pt-4">
          <button onClick={() => toast.success('User permissions saved.')} className="rounded-md bg-[#C9A84C] px-4 py-2 text-sm font-bold text-black">
            Save Changes
          </button>
        </div>
      </Panel>
    </div>
  )
}

export default UserManagementPage
