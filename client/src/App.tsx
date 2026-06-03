import { Navigate, Route, Routes } from 'react-router-dom'
import AdminAuth from './auths/AdminAuth'
import { ToastProvider } from './components/admin/Toast'
import AdminLayout from './layouts/AdminLayout'
import AuditLogsPage from './pages/admin/AuditLogsPage'
import BalancesPage from './pages/admin/BalancesPage'
import ClientsPage from './pages/admin/ClientsPage'
import CommissionsPage from './pages/admin/CommissionsPage'
import DashboardPage from './pages/admin/DashboardPage'
import DocumentsPage from './pages/admin/DocumentsPage'
import ListingsPage from './pages/admin/ListingsPage'
import LoginPage from './pages/LoginPage'
import PaymentsPage from './pages/admin/PaymentsPage'
import ProjectsPage from './pages/admin/ProjectsPage'
import ReceiptPage from './pages/admin/ReceiptPage'
import ReportsPage from './pages/admin/ReportsPage'
import SettingsPage from './pages/admin/SettingsPage'
import SoaPage from './pages/admin/SoaPage'
import UserManagementPage from './pages/admin/UserManagementPage'
import ViewClientsPage from './pages/admin/ViewClientsPage'

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminAuth>
              <AdminLayout />
            </AdminAuth>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="listings" element={<ListingsPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="payments/due" element={<PaymentsPage initialTab="due" />} />
          <Route path="payments/overdue" element={<PaymentsPage initialTab="overdue" />} />
          <Route path="payments/soa/:clientId" element={<SoaPage />} />
          <Route path="payments/receipt/:paymentId" element={<ReceiptPage />} />
          <Route path="commissions" element={<CommissionsPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="records/clients" element={<ViewClientsPage />} />
          <Route path="records/balances" element={<BalancesPage />} />
          <Route path="records/reports" element={<ReportsPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </ToastProvider>
  )
}

export default App
