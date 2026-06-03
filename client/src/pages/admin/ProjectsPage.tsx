import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { company, listings } from '../../data/adminMockData'

function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Project" value="Gen. Emilio Aguinaldo" note="Property address in SOA sheets" />
        <StatCard label="Office" value="Indang, Cavite" note={company.address} />
        <StatCard label="Sample Units" value={listings.length.toString()} note="From inventory workbook rows" />
      </div>
      <Panel title="Project Record" subtitle="Admin create/edit/archive placeholder">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-black p-5">
            <p className="text-sm font-semibold text-zinc-500">Project Name</p>
            <h2 className="mt-2 text-2xl font-bold">D&C Prime Realty - LA Inventory</h2>
            <p className="mt-4 text-sm leading-6 text-zinc-600">
              This project record is based on the OLD LA, NEW LA, SOA, and Master List workbook tabs.
            </p>
          </div>
          <div className="rounded-lg border border-dashed border-white/20 bg-black p-5">
            <p className="text-sm font-semibold text-zinc-500">Cover Image</p>
            <p className="mt-2 text-sm text-zinc-600">Cloudinary upload placeholder for project media.</p>
          </div>
        </div>
      </Panel>
    </div>
  )
}

export default ProjectsPage
