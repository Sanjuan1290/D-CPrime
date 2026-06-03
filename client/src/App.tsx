import { useState } from 'react'
import type { ReactElement } from 'react'
import AdminAuth from './auths/AdminAuth'
import AdminLayout, { type AdminPageKey } from './layouts/AdminLayout'
import AuditLogsPage from './pages/admin/AuditLogsPage'
import BalancesPage from './pages/admin/BalancesPage'
import ClientsPage from './pages/admin/ClientsPage'
import CommissionsPage from './pages/admin/CommissionsPage'
import DashboardPage from './pages/admin/DashboardPage'
import DocumentsPage from './pages/admin/DocumentsPage'
import ListingsPage from './pages/admin/ListingsPage'
import PaymentsPage from './pages/admin/PaymentsPage'
import ProjectsPage from './pages/admin/ProjectsPage'
import ReportsPage from './pages/admin/ReportsPage'
import SettingsPage from './pages/admin/SettingsPage'
import UserManagementPage from './pages/admin/UserManagementPage'

const pages: Record<AdminPageKey, () => ReactElement> = {
  dashboard: DashboardPage,
  users: UserManagementPage,
  projects: ProjectsPage,
  listings: ListingsPage,
  clients: ClientsPage,
  payments: PaymentsPage,
  commissions: CommissionsPage,
  documents: DocumentsPage,
  reports: ReportsPage,
  viewClients: ClientsPage,
  balances: BalancesPage,
  auditLogs: AuditLogsPage,
  settings: SettingsPage,
}

function App() {
  const [activePage, setActivePage] = useState<AdminPageKey>('dashboard')
  const Page = pages[activePage]

  return (
    <AdminAuth>
      <AdminLayout activePage={activePage} onNavigate={setActivePage}>
        <Page />
      </AdminLayout>
    </AdminAuth>
  )
}

export default App
