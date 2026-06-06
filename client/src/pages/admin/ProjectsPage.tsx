import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import FormField from '../../components/admin/FormField'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import { useBalances } from '../../hooks/useBalances'
import { useListings } from '../../hooks/useListings'
import { useCreateProject, useProjects, useUpdateProject } from '../../hooks/useProjects'
import type { ProjectRecord } from '../../hooks/useProjects'

type EditorState = ProjectRecord | 'new' | null

function ProjectsPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const projectsQuery = useProjects()
  const listingsQuery = useListings()
  const balancesQuery = useBalances()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const [editor, setEditor] = useState<EditorState>(null)
  const [detailProject, setDetailProject] = useState<ProjectRecord | null>(null)

  const projects = projectsQuery.data?.data ?? []
  const listings = listingsQuery.data?.data ?? []
  const balances = balancesQuery.data?.data ?? []

  const statsByProject = useMemo(() => {
    const map = new Map<number, { total: number; available: number; reserved: number; sold: number; hold: number; value: number; balance: number }>()

    for (const project of projects) {
      map.set(project.id, { total: 0, available: 0, reserved: 0, sold: 0, hold: 0, value: 0, balance: 0 })
    }

    for (const listing of listings) {
      const stats = map.get(listing.project_id) ?? { total: 0, available: 0, reserved: 0, sold: 0, hold: 0, value: 0, balance: 0 }
      stats.total += 1
      stats.value += Number(listing.total_contract_price || 0)
      if (listing.status === 'available') stats.available += 1
      if (listing.status === 'reserved') stats.reserved += 1
      if (listing.status === 'sold') stats.sold += 1
      if (listing.status === 'hold') stats.hold += 1
      map.set(listing.project_id, stats)
    }

    for (const balance of balances) {
      const project = projects.find((item) => item.name === balance.project_name)
      if (!project) continue
      const stats = map.get(project.id)
      if (stats) stats.balance += Number(balance.balance || 0)
    }

    return map
  }, [balances, listings, projects])

  const totals = useMemo(() => {
    const active = projects.filter((project) => project.status === 'active').length
    const listedValue = listings.reduce((total, listing) => total + Number(listing.total_contract_price || 0), 0)
    const receivables = balances.reduce((total, balance) => total + Number(balance.balance || 0), 0)
    return { active, listedValue, receivables }
  }, [balances, listings, projects])

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload = {
      name: String(formData.get('name')).trim(),
      location: clean(formData.get('location')),
      administrator: clean(formData.get('administrator')),
      tax_declaration_no: clean(formData.get('tax_declaration_no')),
      pin: clean(formData.get('pin')),
      status: String(formData.get('status')) as ProjectRecord['status'],
    }

    if (!payload.name) {
      toast.error('Project name is required.')
      return
    }

    try {
      if (editor === 'new') {
        await createProject.mutateAsync(payload)
      } else if (editor) {
        await updateProject.mutateAsync({ id: editor.id, ...payload })
      }
      toast.success('Project saved.')
      setEditor(null)
    } catch {
      toast.error('Project could not be saved.')
    }
  }

  async function archiveProject(project: ProjectRecord) {
    try {
      await updateProject.mutateAsync({ id: project.id, status: 'inactive' })
      toast.success('Project marked inactive.')
    } catch {
      toast.error('Project could not be archived.')
    }
  }

  if (projectsQuery.isLoading || listingsQuery.isLoading || balancesQuery.isLoading) return <LoadingSkeleton rows={8} />
  if (projectsQuery.isError || listingsQuery.isError || balancesQuery.isError) {
    return (
      <ErrorState
        message="Projects could not be loaded from MySQL."
        onRetry={() => {
          void projectsQuery.refetch()
          void listingsQuery.refetch()
          void balancesQuery.refetch()
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Projects" value={projects.length.toString()} note={`${totals.active} active`} />
        <StatCard label="Listed Value" value={formatCurrency(totals.listedValue)} note="Current inventory value" />
        <StatCard label="Receivables" value={formatCurrency(totals.receivables)} note="Open balances by project" />
      </div>

      <Panel
        title="Projects"
        subtitle="Company projects from MySQL with editable project records"
        actions={<button onClick={() => setEditor('new')} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white">Add Project</button>}
      >
        <DataTable
          headers={['Project', 'Location', 'Status', 'Lots', 'Available', 'Reserved', 'Sold', 'Value', 'Balance', 'Actions']}
          rows={projects.map((project) => {
            const stats = statsByProject.get(project.id) ?? { total: 0, available: 0, reserved: 0, sold: 0, hold: 0, value: 0, balance: 0 }
            const soldPercent = stats.total ? stats.sold / stats.total : 0
            return [
              <button key={`${project.id}-name`} onClick={() => setDetailProject(project)} className="block text-left">
                <span className="font-semibold text-[#1A1A2E]">{project.name}</span>
                <span className="mt-1 block text-xs text-[#6B7280]">{formatPercent(soldPercent)} sold</span>
              </button>,
              project.location ?? '-',
              <Badge key={`${project.id}-status`}>{titleCase(project.status)}</Badge>,
              stats.total,
              <button key={`${project.id}-available`} onClick={() => navigate(`/admin/listings?project=${project.id}&status=available`)} className="font-semibold text-[#1A1A2E]">{stats.available}</button>,
              stats.reserved,
              stats.sold,
              formatCurrency(stats.value),
              formatCurrency(stats.balance),
              <div key={`${project.id}-actions`} className="flex flex-wrap gap-2">
                <button onClick={() => setDetailProject(project)} className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#374151]">
                  View
                </button>
                <button onClick={() => setEditor(project)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E]">
                  Edit
                </button>
                {project.status === 'active' && (
                  <button onClick={() => void archiveProject(project)} className="rounded-md border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                    Archive
                  </button>
                )}
              </div>,
            ]
          })}
        />
      </Panel>

      <Modal title={editor === 'new' ? 'Add Project' : 'Edit Project'} isOpen={editor !== null} onClose={() => setEditor(null)}>
        <form onSubmit={saveProject} className="grid gap-4 md:grid-cols-2">
          <FormField label="Project Name" name="name" defaultValue={editor === 'new' ? '' : editor?.name ?? ''} required />
          <FormField label="Location" name="location" defaultValue={editor === 'new' ? '' : editor?.location ?? ''} />
          <FormField label="Administrator" name="administrator" defaultValue={editor === 'new' ? '' : editor?.administrator ?? ''} />
          <FormField label="Tax Declaration No." name="tax_declaration_no" defaultValue={editor === 'new' ? '' : editor?.tax_declaration_no ?? ''} />
          <FormField label="PIN" name="pin" defaultValue={editor === 'new' ? '' : editor?.pin ?? ''} />
          <FormField label="Status" name="status" defaultValue={editor === 'new' ? 'active' : editor?.status ?? 'active'} selectOptions={['active', 'inactive'].map((status) => ({ label: titleCase(status), value: status }))} />
          <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
            <button type="button" onClick={() => setEditor(null)} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151]">
              Cancel
            </button>
            <button disabled={createProject.isPending || updateProject.isPending} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
              {createProject.isPending || updateProject.isPending ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal title={detailProject?.name ?? 'Project'} isOpen={detailProject !== null} onClose={() => setDetailProject(null)}>
        {detailProject && (
          <div className="space-y-3 text-sm">
            <InfoRow label="Location" value={detailProject.location ?? '-'} />
            <InfoRow label="Administrator" value={detailProject.administrator ?? '-'} />
            <InfoRow label="Tax Declaration No." value={detailProject.tax_declaration_no ?? '-'} />
            <InfoRow label="PIN" value={detailProject.pin ?? '-'} />
            <InfoRow label="Status" value={<Badge>{titleCase(detailProject.status)}</Badge>} />
          </div>
        )}
      </Modal>
    </div>
  )
}

function titleCase(value?: string | null) {
  return String(value ?? '-').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function clean(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim()
  return text || null
}

export default ProjectsPage
