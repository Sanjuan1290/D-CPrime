import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  Building2,
  CreditCard,
  FileText,
  Home,
  LayoutGrid,
  Clock,
  LogOut,
  Menu,
  Percent,
  Search,
  Settings,
  UserCog,
  UserGroup,
  Users,
} from '../components/admin/Icons'
import { useAuth } from '../hooks/useAuth'
import { useClients } from '../hooks/useClients'
import { useListings } from '../hooks/useListings'
import { company } from '../lib/brand'
import api from '../lib/api'
import { adminNavGroups, getActiveAdminPage, getAdminRouteLabel, routeByKey } from '../routes/adminRoutes'
import type { AdminNavGroup, AdminPageKey } from '../routes/adminRoutes'
import type { PaginatedResponse } from '../types'
import type { Role } from '../types'

type AuditLogRow = {
  id: number
  action: string
  module_name?: string | null
  entity_table?: string | null
  created_at?: string
}

const roleTheme: Record<Role, { primary: string; light: string; label: string }> = {
  owner: { primary: '#0F172A', light: '#E2E8F0', label: 'Owner' },
  admin: { primary: '#C9A84C', light: '#FFF8E1', label: 'Administrator' },
  manager: { primary: '#4F46E5', light: '#EEF2FF', label: 'Manager' },
  treasury: { primary: '#059669', light: '#ECFDF5', label: 'Treasury' },
  broker: { primary: '#D97706', light: '#FFFBEB', label: 'Broker' },
  agent: { primary: '#0284C7', light: '#F0F9FF', label: 'Agent' },
  client: { primary: '#E11D48', light: '#FFF1F2', label: 'Client' },
}

function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, role, user } = useAuth()
  const currentRole = role ?? 'admin'
  const theme = roleTheme[currentRole]
  const activePage = getActiveAdminPage(location.pathname)
  const activeLabel = getAdminRouteLabel(activePage)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const adminName = user?.full_name ?? user?.fullName ?? 'Admin'
  const clientsQuery = useClients()
  const listingsQuery = useListings()
  const auditLogsQuery = useQuery({
    queryKey: ['audit-logs', 'recent'],
    queryFn: () => api.get<PaginatedResponse<AuditLogRow>>('/audit-logs', { params: { limit: 5 } }),
  })
  const clientSearchRows = clientsQuery.data?.data ?? []
  const listingSearchRows = listingsQuery.data?.data ?? []
  const visibleNavGroups = useMemo(
    () =>
      adminNavGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.allowedRoles.includes(currentRole)),
        }))
        .filter((group) => group.items.length > 0),
    [currentRole],
  )
  const globalResults = useMemo(() => {
    const term = globalSearch.trim().toLowerCase()
    if (!term) return []

    const records = [
      ...clientSearchRows.map((client) => ({
        type: 'Client',
        label: client.buyer_name,
        detail: `${client.email ?? 'No email'} | ${client.contact_no ?? 'No contact'}`,
        path: '/admin/clients',
      })),
      ...listingSearchRows.map((listing) => ({
        type: 'Listing',
        label: listing.unit_id,
        detail: `${listing.status} | ${listing.lot_area_sqm ?? 0} sqm`,
        path: '/admin/listings',
      })),
    ]

    return records
      .filter((record) => `${record.type} ${record.label} ${record.detail}`.toLowerCase().includes(term))
      .slice(0, 6)
  }, [clientSearchRows, globalSearch, listingSearchRows])
  const notificationItems = auditLogsQuery.data?.data ?? []

  function handleNavigate(page: AdminPageKey) {
    navigate(routeByKey[page])
    setIsMobileOpen(false)
  }

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  function openGlobalResult(path: string) {
    navigate(path)
    setGlobalSearch('')
  }

  return (
    <div
      className="min-h-screen bg-[#F8F7F4] text-[#111827]"
      style={
        {
          '--role-primary': theme.primary,
          '--role-primary-light': theme.light,
        } as CSSProperties
      }
      data-role={currentRole}
    >
      <div className="flex min-h-screen">
        <aside className="hidden w-[260px] shrink-0 border-r border-[#0F1020] bg-[#1A1A2E] text-[#E8E8F0] shadow-xl lg:flex lg:flex-col">
          <SidebarContent
            activePage={activePage}
            navGroups={visibleNavGroups}
            clientCount={clientSearchRows.length}
            listingCount={listingSearchRows.length}
            onNavigate={handleNavigate}
          />
        </aside>

        {isMobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" onClick={() => setIsMobileOpen(false)} aria-label="Close menu" />
            <aside className="relative z-10 h-full w-[280px] border-r border-[#0F1020] bg-[#1A1A2E] shadow-2xl">
              <SidebarContent
                activePage={activePage}
                navGroups={visibleNavGroups}
                clientCount={clientSearchRows.length}
                listingCount={listingSearchRows.length}
                onNavigate={handleNavigate}
              />
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 border-b border-[#E8E4DC] bg-white/90 px-4 py-3 backdrop-blur md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  onClick={() => setIsMobileOpen(true)}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-[#E8E4DC] bg-white text-[#1A1A2E] shadow-sm lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--role-primary)]">{company.name}</p>
                  <h2 className="mt-0.5 truncate font-serif text-2xl text-[#1A1A2E]">{activeLabel}</h2>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
                <div className="relative hidden md:block">
                  <label className="flex h-10 min-w-[260px] items-center gap-2 rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] px-3 text-sm text-[#6B7280]">
                    <Search className="h-4 w-4 text-[var(--role-primary)]" />
                    <input
                      value={globalSearch}
                      onChange={(event) => setGlobalSearch(event.target.value)}
                      className="w-full bg-transparent text-[#111827] outline-none placeholder:text-[#9CA3AF]"
                      placeholder="Search clients, lots, payments"
                    />
                  </label>
                  {globalSearch.trim() && (
                    <div className="absolute right-0 top-12 z-20 w-[360px] overflow-hidden rounded-xl border border-[#E8E4DC] bg-white shadow-xl">
                      <div className="border-b border-[#F0EDE8] px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
                        Global Search
                      </div>
                      {globalResults.length > 0 ? (
                        globalResults.map((result) => (
                          <button
                            key={`${result.type}-${result.label}-${result.detail}`}
                            onClick={() => openGlobalResult(result.path)}
                            className="block w-full border-b border-[#F0EDE8] px-4 py-3 text-left last:border-b-0 hover:bg-[#FAF8F5]"
                          >
                            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--role-primary)]">{result.type}</span>
                            <span className="mt-1 block text-sm font-semibold text-[#1A1A2E]">{result.label}</span>
                            <span className="mt-0.5 block text-xs text-[#6B7280]">{result.detail}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-5 text-sm text-[#6B7280]">No records found.</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationsOpen((current) => !current)}
                    className="relative grid h-10 w-10 place-items-center rounded-lg border border-[#E8E4DC] bg-white text-[#1A1A2E] shadow-sm"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-600 px-1 text-[9px] font-bold text-white">
                      {notificationItems.length}
                    </span>
                  </button>
                  {isNotificationsOpen && (
                    <div className="absolute right-0 top-12 z-20 w-[320px] overflow-hidden rounded-xl border border-[#E8E4DC] bg-white shadow-xl">
                      <div className="border-b border-[#F0EDE8] px-4 py-3">
                        <p className="font-serif text-lg text-[#1A1A2E]">Recent Activity</p>
                        <p className="text-xs text-[#6B7280]">Latest audit entries</p>
                      </div>
                      {notificationItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            navigate('/admin/audit-logs')
                            setIsNotificationsOpen(false)
                          }}
                          className="block w-full border-b border-[#F0EDE8] px-4 py-3 text-left last:border-b-0 hover:bg-[#FAF8F5]"
                        >
                          <span className="text-sm font-semibold text-[#111827]">{item.action}</span>
                          <span className="mt-0.5 block text-xs text-[#6B7280]">{item.module_name ?? item.entity_table ?? 'System activity'}</span>
                          <span className="mt-1 block text-[11px] text-[#9CA3AF]">{item.created_at ?? ''}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-[#1A1A2E]">{adminName}</p>
                  <p className="text-[11px] uppercase tracking-widest text-[#9CA3AF]">{theme.label}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="grid h-10 w-10 place-items-center rounded-lg border bg-white text-[var(--role-primary)] shadow-sm hover:bg-[var(--role-primary-light)]"
                  style={{ borderColor: `${theme.primary}66` }}
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          <section key={location.pathname} className="animate-[admin-fade-in_200ms_ease-out] px-4 py-6 md:px-8">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({
  activePage,
  navGroups,
  clientCount,
  listingCount,
  onNavigate,
}: {
  activePage: AdminPageKey
  navGroups: AdminNavGroup[]
  clientCount: number
  listingCount: number
  onNavigate: (page: AdminPageKey) => void
}) {
  const navCountByKey: Partial<Record<AdminPageKey, number>> = {
    clients: clientCount,
    listings: listingCount,
  }

  return (
    <>
      <div className="border-b border-white/10 p-5">
        <div className="mb-4 h-1 w-20 rounded-full bg-[var(--role-primary)]" />
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--role-primary)] text-xs font-black text-white shadow-lg shadow-black/20">DC</div>
          <div>
            <p className="font-serif text-lg leading-tight text-white">D&C Prime</p>
            <p className="text-xs text-white/45">Realty Admin</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-4 overflow-y-auto px-3 pb-5 pt-4">
        {navGroups.map((group) => (
          <div key={group.title} className="border-b border-white/10 pb-3 last:border-b-0">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">{group.title}</p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`group flex w-full items-center gap-3 rounded-r-lg border-l-2 px-3 py-2.5 text-left text-[13px] font-semibold transition ${
                    activePage === item.key
                      ? 'bg-white/10 text-white'
                      : 'border-transparent text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  style={activePage === item.key ? { borderColor: 'var(--role-primary)' } : undefined}
                >
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                  {navCountByKey[item.key] !== undefined && (
                    <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70">
                      {navCountByKey[item.key]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </>
  )
}

const iconByName: Record<string, typeof LayoutGrid> = {
  grid: LayoutGrid,
  building: Building2,
  home: Home,
  users: Users,
  card: CreditCard,
  percent: Percent,
  file: FileText,
  chart: BarChart3,
  userCog: UserCog,
  settings: Settings,
  userGroup: UserGroup,
  clock: Clock,
}

function NavIcon({ name }: { name: string }) {
  const Icon = iconByName[name] ?? LayoutGrid
  return <Icon className="h-4 w-4 shrink-0 text-current opacity-85" />
}

export default AdminLayout
