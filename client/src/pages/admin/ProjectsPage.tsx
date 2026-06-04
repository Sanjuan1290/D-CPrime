import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { useToast } from '../../components/admin/Toast'
import { company, listingsV2, projects as initialProjects } from '../../data/adminMockData'

type ProjectRecord = (typeof initialProjects)[number]

function ProjectsPage() {
  const toast = useToast()
  const [projects, setProjects] = useState<ProjectRecord[]>(() => {
    const saved = localStorage.getItem('dcprime_projects')
    return saved ? (JSON.parse(saved) as ProjectRecord[]) : initialProjects
  })
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null)

  useEffect(() => {
    localStorage.setItem('dcprime_projects', JSON.stringify(projects))
  }, [projects])

  function openProject(project?: ProjectRecord) {
    setSelectedProject(
      project ?? {
        id: `project-${Date.now()}`,
        name: 'New Project',
        location: 'Cavite',
        status: 'Active',
        description: 'Mock project record.',
        coverImage: '',
        totalLots: 0,
      },
    )
  }

  function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedProject) return

    const formData = new FormData(event.currentTarget)
    const project: ProjectRecord = {
      ...selectedProject,
      name: String(formData.get('name')),
      location: String(formData.get('location')),
      status: String(formData.get('status')),
      description: String(formData.get('description')),
      totalLots: Number(formData.get('totalLots')),
    }

    setProjects((current) => {
      const exists = current.some((item) => item.id === project.id)
      return exists ? current.map((item) => (item.id === project.id ? project : item)) : [project, ...current]
    })
    setSelectedProject(null)
    toast.success('Project saved.')
  }

  function archiveProject(project: ProjectRecord) {
    setProjects((current) => current.map((item) => (item.id === project.id ? { ...item, status: 'Archived' } : item)))
    toast.success('Project archived.')
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Projects" value={projects.length.toString()} note="Mock project records" />
        <StatCard label="Office" value="Indang, Cavite" note={company.address} />
        <StatCard label="Listed Lots" value={listingsV2.length.toString()} note="Lots connected to projects" />
      </div>

      <Panel title="Projects" subtitle="Create, edit, and archive project records">
        <div className="mb-5 flex justify-end">
          <button onClick={() => openProject()} className="rounded-md bg-[#C9A84C] px-4 py-2 text-sm font-bold text-black">
            Add Project
          </button>
        </div>
        <DataTable
          headers={['Project', 'Location', 'Status', 'Total Lots', 'Description', 'Action']}
          rows={projects.map((project) => [
            project.name,
            project.location,
            <Badge key={`${project.id}-status`}>{project.status}</Badge>,
            project.totalLots,
            project.description,
            <div key={`${project.id}-actions`} className="flex gap-2">
              <button
                onClick={() => openProject(project)}
                className="rounded-md border border-[#C9A84C]/40 px-3 py-1 text-xs font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10"
              >
                Edit
              </button>
              <button
                onClick={() => archiveProject(project)}
                className="rounded-md border border-rose-400/40 px-3 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-400/10"
              >
                Archive
              </button>
            </div>,
          ])}
        />
      </Panel>

      <Modal title="Project Record" isOpen={selectedProject !== null} onClose={() => setSelectedProject(null)}>
        {selectedProject && (
          <form onSubmit={saveProject} className="grid gap-4 text-sm md:grid-cols-2">
            <TextInput label="Project Name" name="name" value={selectedProject.name} />
            <TextInput label="Location" name="location" value={selectedProject.location} />
            <label className="block font-semibold text-zinc-300">
              Status
              <select
                name="status"
                defaultValue={selectedProject.status}
                className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-3 text-white"
              >
                <option>Active</option>
                <option>Paused</option>
                <option>Archived</option>
              </select>
            </label>
            <TextInput label="Total Lots" name="totalLots" value={String(selectedProject.totalLots)} type="number" />
            <label className="block font-semibold text-zinc-300 md:col-span-2">
              Description
              <textarea
                name="description"
                defaultValue={selectedProject.description}
                className="mt-2 min-h-28 w-full rounded-md border border-white/10 bg-black px-3 py-3 text-white"
              />
            </label>
            <div className="flex justify-end gap-2 md:col-span-2">
              <button type="button" onClick={() => setSelectedProject(null)} className="rounded-md border border-white/10 px-4 py-2 font-semibold text-zinc-300">
                Cancel
              </button>
              <button className="rounded-md bg-[#C9A84C] px-4 py-2 font-bold text-black">Save Project</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

function TextInput({ label, name, value, type = 'text' }: { label: string; name: string; value: string; type?: string }) {
  return (
    <label className="block font-semibold text-zinc-300">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={value}
        className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-3 text-white"
      />
    </label>
  )
}

export default ProjectsPage
