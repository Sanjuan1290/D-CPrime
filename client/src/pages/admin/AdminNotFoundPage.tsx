import { Link } from 'react-router-dom'
import Panel from '../../components/admin/Panel'

function AdminNotFoundPage() {
  return (
    <Panel title="Page Not Found" subtitle="The admin page you opened is not registered in the mock route map.">
      <div className="rounded-lg border border-white/10 bg-black p-5">
        <p className="text-sm text-zinc-300">Check the URL or return to the dashboard.</p>
        <Link
          to="/admin/dashboard"
          className="mt-5 inline-flex rounded-md bg-[#C9A84C] px-4 py-2 text-sm font-bold text-black hover:bg-[#d8b95d]"
        >
          Go to Dashboard
        </Link>
      </div>
    </Panel>
  )
}

export default AdminNotFoundPage
