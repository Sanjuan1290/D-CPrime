/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import type { ReactNode } from 'react'
import type { FeatureKey, Role } from '../types'

const AuditLogsPage = lazy(() => import('../pages/admin/AuditLogsPage'))
const AttendancePage = lazy(() => import('../pages/admin/AttendancePage'))
const BalancesPage = lazy(() => import('../pages/admin/BalancesPage'))
const ClientDetailPage = lazy(() => import('../pages/admin/ClientDetailPage'))
const ClientsPage = lazy(() => import('../pages/admin/ClientsPage'))
const CommissionsPage = lazy(() => import('../pages/admin/CommissionsPage'))
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'))
const DocumentsPage = lazy(() => import('../pages/admin/DocumentsPage'))
const ListingsPage = lazy(() => import('../pages/admin/ListingsPage'))
const LookupsPage = lazy(() => import('../pages/admin/LookupsPage'))
const PaymentsPage = lazy(() => import('../pages/admin/PaymentsPage'))
const PeoplePage = lazy(() => import('../pages/admin/PeoplePage'))
const ProjectsPage = lazy(() => import('../pages/admin/ProjectsPage'))
const ReportsPage = lazy(() => import('../pages/admin/ReportsPage'))
const ReservationsPage = lazy(() => import('../pages/admin/ReservationsPage'))
const SettingsPage = lazy(() => import('../pages/admin/SettingsPage'))
const SoaPage = lazy(() => import('../pages/admin/SoaPage'))
const UserManagementPage = lazy(() => import('../pages/admin/UserManagementPage'))
const ViewClientsPage = lazy(() => import('../pages/admin/ViewClientsPage'))

export type AdminPageKey =
  | 'dashboard'
  | 'users'
  | 'projects'
  | 'listings'
  | 'reservations'
  | 'clients'
  | 'people'
  | 'attendance'
  | 'payments'
  | 'commissions'
  | 'documents'
  | 'reports'
  | 'viewClients'
  | 'balances'
  | 'auditLogs'
  | 'settings'
  | 'lookups'

export type AdminRoute = {
  path: string
  label: string
  element: ReactNode
  feature: FeatureKey
  allowedRoles: Role[]
  activeKey: AdminPageKey
}

export type AdminNavItem = {
  key: AdminPageKey
  label: string
  icon: string
  path: string
  feature: FeatureKey
  allowedRoles: Role[]
}

export type AdminNavGroup = {
  title: string
  items: AdminNavItem[]
}

const adminOnly: Role[] = ['owner', 'admin']
const staffRoles: Role[] = ['owner', 'admin', 'manager', 'treasury', 'broker', 'agent']
const managementRoles: Role[] = ['owner', 'admin', 'manager']
const salesRoles: Role[] = ['owner', 'admin', 'manager', 'broker', 'agent']
const financeRoles: Role[] = ['owner', 'admin', 'manager', 'treasury', 'broker', 'agent']
const documentRoles: Role[] = ['owner', 'admin', 'manager', 'treasury', 'broker', 'agent']
const attendanceRoles: Role[] = ['owner', 'admin', 'manager', 'treasury']

export const adminRoutes: AdminRoute[] = [
  { path: 'dashboard', label: 'Dashboard', element: <DashboardPage />, feature: 'dashboard', allowedRoles: staffRoles, activeKey: 'dashboard' },
  { path: 'projects', label: 'Projects', element: <ProjectsPage />, feature: 'projects', allowedRoles: managementRoles, activeKey: 'projects' },
  { path: 'listings', label: 'Listings', element: <ListingsPage />, feature: 'listings', allowedRoles: salesRoles, activeKey: 'listings' },
  { path: 'reservations', label: 'Reservations', element: <ReservationsPage />, feature: 'reservations', allowedRoles: salesRoles, activeKey: 'reservations' },
  { path: 'clients', label: 'Clients', element: <ClientsPage />, feature: 'clients_manage', allowedRoles: managementRoles, activeKey: 'clients' },
  { path: 'clients/new', label: 'New Client', element: <ClientDetailPage mode="new" />, feature: 'clients_manage', allowedRoles: managementRoles, activeKey: 'clients' },
  { path: 'clients/:clientId/edit', label: 'Edit Client', element: <ClientDetailPage mode="edit" />, feature: 'clients_manage', allowedRoles: managementRoles, activeKey: 'clients' },
  { path: 'clients/:clientId', label: 'Client Profile', element: <ClientDetailPage />, feature: 'clients_view', allowedRoles: financeRoles, activeKey: 'clients' },
  { path: 'people', label: 'People', element: <PeoplePage />, feature: 'clients_manage', allowedRoles: adminOnly, activeKey: 'people' },
  { path: 'attendance', label: 'Attendance', element: <AttendancePage />, feature: 'attendance', allowedRoles: attendanceRoles, activeKey: 'attendance' },
  { path: 'payments', label: 'Payments', element: <PaymentsPage />, feature: 'payments_view', allowedRoles: financeRoles, activeKey: 'payments' },
  { path: 'payments/due', label: 'Due Payments', element: <PaymentsPage initialTab="due" />, feature: 'payments_view', allowedRoles: financeRoles, activeKey: 'payments' },
  { path: 'payments/overdue', label: 'Overdue Accounts', element: <PaymentsPage initialTab="overdue" />, feature: 'payments_view', allowedRoles: financeRoles, activeKey: 'payments' },
  { path: 'payments/soa/:clientId', label: 'Statement Of Account', element: <SoaPage />, feature: 'soa_view', allowedRoles: financeRoles, activeKey: 'payments' },
  { path: 'commissions', label: 'Commissions', element: <CommissionsPage />, feature: 'commissions_view', allowedRoles: financeRoles, activeKey: 'commissions' },
  { path: 'documents', label: 'Documents', element: <DocumentsPage />, feature: 'documents_view', allowedRoles: documentRoles, activeKey: 'documents' },
  { path: 'reports', label: 'Reports', element: <ReportsPage />, feature: 'reports_view', allowedRoles: ['owner', 'admin', 'manager', 'treasury'], activeKey: 'reports' },
  { path: 'audit-logs', label: 'Audit Logs', element: <AuditLogsPage />, feature: 'audit_logs_view', allowedRoles: adminOnly, activeKey: 'auditLogs' },
  { path: 'records/clients', label: 'View Clients', element: <ViewClientsPage />, feature: 'clients_view', allowedRoles: financeRoles, activeKey: 'viewClients' },
  { path: 'records/balances', label: 'Balances', element: <BalancesPage />, feature: 'balances_view', allowedRoles: financeRoles, activeKey: 'balances' },
  { path: 'records/reports', label: 'Reports', element: <ReportsPage />, feature: 'reports_view', allowedRoles: ['owner', 'admin', 'manager', 'treasury'], activeKey: 'reports' },
  { path: 'users', label: 'User Management', element: <UserManagementPage />, feature: 'user_management', allowedRoles: adminOnly, activeKey: 'users' },
  { path: 'settings', label: 'Settings', element: <SettingsPage />, feature: 'settings', allowedRoles: adminOnly, activeKey: 'settings' },
  { path: 'settings/lookups', label: 'Lookup Tables', element: <LookupsPage />, feature: 'lookups', allowedRoles: adminOnly, activeKey: 'lookups' },
]

export const adminNavGroups: AdminNavGroup[] = [
  {
    title: 'Overview',
    items: [navItem('dashboard', 'Dashboard', 'grid', 'dashboard')],
  },
  {
    title: 'Management',
    items: [
      navItem('projects', 'Projects', 'building', 'projects'),
      navItem('listings', 'Listings', 'home', 'listings'),
      navItem('reservations', 'Reservations', 'clock', 'reservations'),
      navItem('clients', 'Clients', 'users', 'clients_manage'),
    ],
  },
  {
    title: 'People',
    items: [
      navItem('people', 'People', 'userGroup', 'clients_manage', adminOnly),
      navItem('attendance', 'Attendance', 'clock', 'attendance', attendanceRoles),
    ],
  },
  {
    title: 'Finance',
    items: [
      navItem('payments', 'Payments', 'card', 'payments_view'),
      navItem('commissions', 'Commissions', 'percent', 'commissions_view'),
    ],
  },
  {
    title: 'Compliance',
    items: [navItem('documents', 'Documents', 'file', 'documents_view')],
  },
  {
    title: 'Insights',
    items: [navItem('reports', 'Reports', 'chart', 'reports_view')],
  },
  {
    title: 'Admin',
    items: [
      navItem('users', 'User management', 'userCog', 'user_management'),
      navItem('auditLogs', 'Audit logs', 'chart', 'audit_logs_view', adminOnly),
      navItem('settings', 'Settings', 'settings', 'settings'),
      navItem('lookups', 'Lookup tables', 'settings', 'lookups'),
    ],
  },
]

export const adminNavItems = adminNavGroups.flatMap((group) => group.items)

export const routeByKey = adminNavItems.reduce(
  (routes, item) => ({ ...routes, [item.key]: item.path }),
  {} as Record<AdminPageKey, string>,
)

export function getActiveAdminPage(pathname: string): AdminPageKey {
  const matchedRoute = adminRoutes
    .map((route) => ({ ...route, absolutePath: `/admin/${route.path.split('/:')[0]}` }))
    .sort((a, b) => b.absolutePath.length - a.absolutePath.length)
    .find((route) => pathname.startsWith(route.absolutePath))

  return matchedRoute?.activeKey ?? 'dashboard'
}

export function getAdminRouteLabel(page: AdminPageKey) {
  return adminNavItems.find((item) => item.key === page)?.label ?? 'Dashboard'
}

function navItem(
  key: AdminPageKey,
  label: string,
  icon: string,
  feature: FeatureKey,
  allowedRoles: Role[] = adminOnly,
): AdminNavItem {
  const route = adminRoutes.find((item) => item.activeKey === key)

  return {
    key,
    label,
    icon,
    feature,
    allowedRoles,
    path: `/admin/${route?.path ?? 'dashboard'}`,
  }
}
