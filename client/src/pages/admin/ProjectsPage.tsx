import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/admin/Badge'
import ConfirmModal from '../../components/admin/ConfirmModal'
import DataTable from '../../components/admin/DataTable'
import Drawer from '../../components/admin/Drawer'
import FilterBar from '../../components/admin/FilterBar'
import FormField from '../../components/admin/FormField'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { useToast } from '../../components/admin/Toast'
import { Check, Eye, SpinnerIcon } from '../../components/admin/Icons'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import { clientsV2, company, listingsV2, paymentTracker, projects as initialProjects } from '../../data/adminMockData'
import { useMutation } from '../../hooks/useMutation'

type ProjectRecord = (typeof initialProjects)[number] & {
  code?: string
  accentColor?: string
  createdAt?: string
}
type ProjectFilter = 'All' | 'Active' | 'Paused' | 'Archived'
type ProjectStats = {
  total: number
  available: number
  reserved: number
  sold: number
  hold: number
  fullyPaid: number
  ongoing: number
  soldPercent: number
}

const accentSwatches = [
  { label: 'Navy', value: '#1A1A2E' },
  { label: 'Gold', value: '#C9A84C' },
  { label: 'Emerald', value: '#16A34A' },
]

function ProjectsPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ProjectRecord[]>(() => {
    const saved = localStorage.getItem('dcprime_projects')
    return saved ? (JSON.parse(saved) as ProjectRecord[]) : initialProjects
  })
  const [filter, setFilter] = useState<ProjectFilter>('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('Name A-Z')
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null)
  const [detailProject, setDetailProject] = useState<ProjectRecord | null>(null)
  const [archivePending, setArchivePending] = useState<ProjectRecord | null>(null)

  useEffect(() => {
    localStorage.setItem('dcprime_projects', JSON.stringify(projects))
  }, [projects])

  const projectStats = useMemo(() => {
    return projects.reduce<Record<string, ProjectStats>>((stats, project) => {
      stats[project.id] = buildProjectStats(project.id)
      return stats
    }, {})
  }, [projects])

  const visibleProjects = useMemo(() => {
    const term = search.trim().toLowerCase()
    return [...projects]
      .filter((project) => {
        if (filter !== 'All' && project.status !== filter) return false
        if (!term) return true
        return `${project.name} ${project.location}`.toLowerCase().includes(term)
      })
      .sort((a, b) => {
        const aStats = projectStats[a.id]
        const bStats = projectStats[b.id]
        if (sortBy === 'Most Lots') return bStats.total - aStats.total
        if (sortBy === 'Most Sold') return bStats.sold - aStats.sold
        if (sortBy === 'Recently Added') return String(b.createdAt ?? b.id).localeCompare(String(a.createdAt ?? a.id))
        return a.name.localeCompare(b.name)
      })
  }, [filter, projectStats, projects, search, sortBy])

  const saveMutation = useMutation<FormData>(
    (formData) => {
      if (!editingProject) return

      const project: ProjectRecord = {
        ...editingProject,
        code: String(formData.get('code')),
        name: String(formData.get('name')),
        location: String(formData.get('location')),
        status: String(formData.get('status')),
        accentColor: String(formData.get('accentColor')),
        description: String(formData.get('description')),
        totalLots: Number(formData.get('totalLots')),
        coverImage: '',
        createdAt: editingProject.createdAt ?? new Date().toISOString(),
      }

      setProjects((current) => {
        const exists = current.some((item) => item.id === project.id)
        return exists ? current.map((item) => (item.id === project.id ? project : item)) : [project, ...current]
      })
      setEditingProject(null)
      toast.success('Project saved successfully.')
    },
    { onError: () => toast.error('Failed to save. Try again.') },
  )

  const archiveMutation = useMutation<ProjectRecord>(
    (project) => {
      setProjects((current) => current.map((item) => (item.id === project.id ? { ...item, status: 'Archived' } : item)))
      setArchivePending(null)
      toast.warning('Project archived.')
    },
    { onError: () => toast.error('Failed to archive. Try again.') },
  )

  function buildProjectStats(projectId: string) {
    const lots = listingsV2.filter((listing) => listing.projectId === projectId)
    const units = new Set(lots.map((listing) => listing.unitId))
    const projectClients = clientsV2.filter((client) => units.has(client.unitId))
    const total = lots.length
    const available = lots.filter((listing) => listing.status === 'Available').length
    const reserved = lots.filter((listing) => listing.status === 'Reserved').length
    const sold = lots.filter((listing) => listing.status === 'Sold').length
    const hold = lots.filter((listing) => listing.status === 'Hold').length
    const fullyPaid = projectClients.filter((client) => client.balance === 0 || client.paymentPercentage >= 1).length
    const ongoing = projectClients.filter((client) => client.balance > 0 && client.paymentMade > 0).length
    return { total, available, reserved, sold, hold, fullyPaid, ongoing, soldPercent: total ? sold / total : 0 }
  }

  function openProject(project?: ProjectRecord) {
    setEditingProject(
      project ?? {
        id: `project-${Date.now()}`,
        code: 'LA',
        name: 'New Project',
        location: 'Cavite',
        status: 'Active',
        description: 'Mock project record.',
        coverImage: '',
        accentColor: '#1A1A2E',
        totalLots: 0,
        createdAt: new Date().toISOString(),
      },
    )
  }

  function goToListings(projectId: string, status?: string) {
    const params = new URLSearchParams({ project: projectId })
    if (status) params.set('status', status)
    navigate(`/admin/listings?${params.toString()}`)
  }

  function CountChip({ count, label, projectId, status }: { count: number; label: string; projectId: string; status?: string }) {
    return (
      <button
        onClick={() => goToListings(projectId, status)}
        className="rounded-full border border-[#E8E4DC] bg-[#F8F7F4] px-3 py-1 text-xs font-semibold text-[#374151] hover:border-[#C9A84C] hover:text-[#9A7A22]"
      >
        {label} ({count})
      </button>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Projects" value={projects.length.toString()} note="Mock project records" />
        <StatCard label="Office" value="Indang, Cavite" note={company.address} />
        <StatCard label="Listed Lots" value={listingsV2.length.toString()} note="Lots connected to projects" />
      </div>

      <Panel title="Projects" subtitle="Create, edit, archive, and inspect project lot status">
        <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-start">
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search project name or location..."
            tabs={(['All', 'Active', 'Paused', 'Archived'] as ProjectFilter[]).map((item) => ({
              label: item,
              value: item,
              count: item === 'All' ? projects.length : projects.filter((project) => project.status === item).length,
            }))}
            activeTab={filter}
            onTabChange={(value) => setFilter(value as ProjectFilter)}
            onReset={() => {
              setSearch('')
              setFilter('All')
              setSortBy('Name A-Z')
            }}
          />
          <div className="flex gap-2">
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm font-semibold text-[#374151]">
              {['Name A-Z', 'Most Lots', 'Most Sold', 'Recently Added'].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <button onClick={() => openProject()} className="rounded-lg bg-[#1A1A2E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2A2A4E] active:scale-[0.98]">
              Add Project
            </button>
          </div>
        </div>

        <DataTable
          searchable={false}
          headers={['Project Name', 'Location', 'Status', 'Total', 'Available', 'Reserved', 'Sold', 'Hold', 'Fully Paid', 'Ongoing', 'Actions']}
          rows={visibleProjects.map((project) => {
            const stats = projectStats[project.id]
            return [
              <button key={`${project.id}-name`} onClick={() => setDetailProject(project)} className="block w-full text-left">
                <span className="font-semibold text-[#111827]">{project.name}</span>
                <span className="mt-2 block h-1 rounded-full bg-[#F0EDE8]">
                  <span className="block h-1 rounded-full bg-[#C9A84C]" style={{ width: `${stats.soldPercent * 100}%` }} />
                </span>
                <span className="mt-1 block text-xs text-[#6B7280]">{formatPercent(stats.soldPercent)} sold</span>
              </button>,
              project.location,
              <Badge key={`${project.id}-status`}>{project.status}</Badge>,
              <CountChip key={`${project.id}-total`} label="Total" count={stats.total} projectId={project.id} />,
              <CountChip key={`${project.id}-available`} label="Available" count={stats.available} projectId={project.id} status="Available" />,
              <CountChip key={`${project.id}-reserved`} label="Reserved" count={stats.reserved} projectId={project.id} status="Reserved" />,
              <CountChip key={`${project.id}-sold`} label="Sold" count={stats.sold} projectId={project.id} status="Sold" />,
              <CountChip key={`${project.id}-hold`} label="Hold" count={stats.hold} projectId={project.id} status="Hold" />,
              stats.fullyPaid,
              stats.ongoing,
              <div key={`${project.id}-actions`} className="flex flex-wrap gap-2">
                <button onClick={() => setDetailProject(project)} className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-[#374151] hover:bg-gray-100">
                  <Eye className="h-3.5 w-3.5" /> View
                </button>
                <button onClick={() => openProject(project)} className="rounded-md border border-[#1A1A2E]/20 bg-[#1A1A2E]/5 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E] hover:bg-[#1A1A2E]/10">
                  Edit
                </button>
                <button onClick={() => setArchivePending(project)} className="rounded-md border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100">
                  Archive
                </button>
              </div>,
            ]
          })}
        />
      </Panel>

      <ProjectDrawer
        project={detailProject}
        stats={detailProject ? projectStats[detailProject.id] : undefined}
        onClose={() => setDetailProject(null)}
        onEdit={(project) => {
          setDetailProject(null)
          openProject(project)
        }}
        onViewListings={(projectId) => goToListings(projectId)}
      />

      <Modal title="Project Record" isOpen={editingProject !== null} onClose={() => setEditingProject(null)}>
        {editingProject && (
          <form
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault()
              void saveMutation.mutate(new FormData(event.currentTarget))
            }}
            className="grid gap-4 text-sm md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <ProjectThumbnail project={editingProject} />
            </div>
            <FormField label="Project Code" name="code" defaultValue={editingProject.code ?? 'LA'} required />
            <FormField label="Project Name" name="name" defaultValue={editingProject.name} required />
            <FormField label="Location" name="location" defaultValue={editingProject.location} required />
            <FormField
              label="Status"
              name="status"
              defaultValue={editingProject.status}
              selectOptions={['Active', 'Paused', 'Archived'].map((item) => ({ label: item, value: item }))}
            />
            <FormField label="Total Lots" name="totalLots" defaultValue={String(editingProject.totalLots)} type="number" />
            <FormField
              label="Accent Color"
              name="accentColor"
              defaultValue={editingProject.accentColor ?? '#1A1A2E'}
              selectOptions={accentSwatches.map((swatch) => ({ label: swatch.label, value: swatch.value }))}
            />
            <FormField label="Description" name="description" defaultValue={editingProject.description} textarea className="md:col-span-2" />
            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-[#E8E4DC] bg-white py-4 md:col-span-2">
              <button type="button" onClick={() => setEditingProject(null)} className="rounded-lg border border-[#E8E4DC] bg-white px-4 py-2.5 text-sm font-semibold text-[#374151] transition hover:bg-[#F8F7F4]">
                Cancel
              </button>
              <button disabled={saveMutation.isLoading} className="inline-flex items-center gap-2 rounded-lg bg-[#1A1A2E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2A2A4E] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
                {saveMutation.isLoading ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : saveMutation.state === 'success' ? <Check className="h-4 w-4" /> : null}
                {saveMutation.isLoading ? 'Saving...' : saveMutation.state === 'success' ? 'Saved!' : 'Save Project'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmModal
        title="Archive Project"
        message={`Archive ${archivePending?.name ?? 'this project'}? It will be hidden from active views but data is preserved.`}
        confirmLabel="Archive Project"
        loadingLabel="Archiving..."
        isOpen={archivePending !== null}
        isLoading={archiveMutation.isLoading}
        tone="danger"
        onClose={() => setArchivePending(null)}
        onConfirm={() => {
          if (archivePending) void archiveMutation.mutate(archivePending)
        }}
      />
    </div>
  )
}

function ProjectThumbnail({ project }: { project: ProjectRecord }) {
  const initials = (project.code || project.name.slice(0, 2)).toUpperCase()
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#E8E4DC] bg-[#F8F7F4] p-4">
      <div className="grid h-16 w-16 place-items-center rounded-xl text-lg font-bold text-white" style={{ backgroundColor: project.accentColor ?? '#1A1A2E' }}>
        {initials}
      </div>
      <div>
        <p className="text-sm font-semibold text-[#374151]">Project Thumbnail</p>
        <p className="mt-1 text-xs text-[#6B7280]">Image upload is disabled while Cloudinary is not connected.</p>
      </div>
    </div>
  )
}

function ProjectDrawer({
  project,
  stats,
  onClose,
  onEdit,
  onViewListings,
}: {
  project: ProjectRecord | null
  stats?: ProjectStats
  onClose: () => void
  onEdit: (project: ProjectRecord) => void
  onViewListings: (projectId: string) => void
}) {
  if (!project || !stats) return null
  const chartData = [
    { name: 'Available', value: stats.available, color: '#059669' },
    { name: 'Reserved', value: stats.reserved, color: '#D97706' },
    { name: 'Sold', value: stats.sold, color: '#2563EB' },
    { name: 'Hold', value: stats.hold, color: '#6B7280' },
  ].filter((item) => item.value > 0)
  const projectUnits = new Set(listingsV2.filter((listing) => listing.projectId === project.id).map((listing) => listing.unitId))
  const recentActivity = paymentTracker.filter((payment) => projectUnits.has(payment.unitId)).slice(0, 5)

  return (
    <Drawer
      title={project.name}
      subtitle={project.location}
      isOpen={project !== null}
      onClose={onClose}
      actions={
        <>
          <button onClick={() => onEdit(project)} className="rounded-lg border border-[#1A1A2E]/20 bg-white px-3 py-2 text-sm font-semibold text-[#1A1A2E] hover:bg-[#1A1A2E]/5">
            Edit Project
          </button>
          <button onClick={() => onViewListings(project.id)} className="rounded-lg bg-[#1A1A2E] px-3 py-2 text-sm font-semibold text-white hover:bg-[#2A2A4E]">
            View All Listings
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="space-y-1 text-sm">
          <InfoRow label="Status" value={<Badge>{project.status}</Badge>} />
          <InfoRow label="Project Code" value={project.code ?? '-'} />
          <InfoRow label="Description" value={project.description} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Total', stats.total],
            ['Available', stats.available],
            ['Reserved', stats.reserved],
            ['Sold', stats.sold],
            ['Hold', stats.hold],
            ['Fully Paid', stats.fullyPaid],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] p-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280]">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-[#1A1A2E]">{value}</p>
            </div>
          ))}
        </div>
        <div className="h-64 rounded-lg border border-[#E8E4DC] bg-white p-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={88}>
                {chartData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#374151]">Recent Activity</h3>
          <div className="mt-3 space-y-2">
            {recentActivity.map((payment) => (
              <div key={`${payment.buyer}-${payment.unitId}`} className="rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] p-3">
                <p className="text-sm font-semibold text-[#111827]">{payment.buyer}</p>
                <p className="text-xs text-[#6B7280]">
                  {payment.unitId} | {formatCurrency(payment.paymentMade)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default ProjectsPage
