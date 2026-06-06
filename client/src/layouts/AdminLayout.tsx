import { useMemo, useState } from 'react'
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
import {
  agentRecords,
  auditLogsV2,
  brokerRecords,
  employeeRecords,
  listingsV2,
  mockDbClients,
  mockStorageKeys,
  paymentTracker,
  readMockStorage,
} from '../data/adminMockData'
import { company } from '../data/mockData'
import { adminNavGroups, getActiveAdminPage, getAdminRouteLabel, routeByKey } from '../routes/adminRoutes'
import type { AdminPageKey } from '../routes/adminRoutes'

function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const activePage = getActiveAdminPage(location.pathname)
  const activeLabel = getAdminRouteLabel(activePage)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const adminName = localStorage.getItem('dcprime_name') ?? 'Admin'
  const clientSearchRows = readMockStorage(mockStorageKeys.clients, mockDbClients)
  const globalResults = useMemo(() => {
    const term = globalSearch.trim().toLowerCase()
    if (!term) return []

    const records = [
      ...clientSearchRows.map((client) => ({
        type: 'Client',
        label: client.buyer_name,
        detail: `${client.email ?? 'No email'} | ${client.contact_no ?? 'No contact'}`,
        path: `/admin/clients/${client.id}`,
      })),
      ...listingsV2.map((listing) => ({
        type: 'Listing',
        label: listing.unitId,
        detail: `${listing.status} | ${listing.areaSqm} sqm`,
        path: '/admin/listings',
      })),
      ...paymentTracker.map((payment) => ({
        type: 'Payment',
        label: payment.buyer,
        detail: `${payment.unitId} | ${payment.mode}`,
        path: '/admin/payments',
      })),
    ]

    return records
      .filter((record) => `${record.type} ${record.label} ${record.detail}`.toLowerCase().includes(term))
      .slice(0, 6)
  }, [clientSearchRows, globalSearch])
  const notificationItems = auditLogsV2.slice(0, 5)

  function handleNavigate(page: AdminPageKey) {
    navigate(routeByKey[page])
    setIsMobileOpen(false)
  }

  function handleLogout() {
    localStorage.removeItem('dcprime_role')
    localStorage.removeItem('dcprime_name')
    localStorage.removeItem('dcprime_token')
    window.location.reload()
  }

  function openGlobalResult(path: string) {
    navigate(path)
    setGlobalSearch('')
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111827]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[260px] shrink-0 border-r border-[#0F1020] bg-[#1A1A2E] text-[#E8E8F0] shadow-xl lg:flex lg:flex-col">
          <SidebarContent activePage={activePage} onNavigate={handleNavigate} />
        </aside>

        {isMobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" onClick={() => setIsMobileOpen(false)} aria-label="Close menu" />
            <aside className="relative z-10 h-full w-[280px] border-r border-[#0F1020] bg-[#1A1A2E] shadow-2xl">
              <SidebarContent activePage={activePage} onNavigate={handleNavigate} />
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
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">{company.name}</p>
                  <h2 className="mt-0.5 truncate font-serif text-2xl text-[#1A1A2E]">{activeLabel}</h2>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
                <div className="relative hidden md:block">
                  <label className="flex h-10 min-w-[260px] items-center gap-2 rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] px-3 text-sm text-[#6B7280]">
                    <Search className="h-4 w-4 text-[#C9A84C]" />
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
                            <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9A84C]">{result.type}</span>
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
                            navigate('/admin/settings')
                            setIsNotificationsOpen(false)
                          }}
                          className="block w-full border-b border-[#F0EDE8] px-4 py-3 text-left last:border-b-0 hover:bg-[#FAF8F5]"
                        >
                          <span className="text-sm font-semibold text-[#111827]">{item.action}</span>
                          <span className="mt-0.5 block text-xs text-[#6B7280]">{item.details}</span>
                          <span className="mt-1 block text-[11px] text-[#9CA3AF]">{item.timestamp}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-[#1A1A2E]">{adminName}</p>
                  <p className="text-[11px] uppercase tracking-widest text-[#9CA3AF]">Administrator</p>
                </div>
                <button onClick={handleLogout} className="grid h-10 w-10 place-items-center rounded-lg border border-[#C9A84C]/40 bg-white text-[#9A7A22] shadow-sm hover:bg-[#FFF8E1]" aria-label="Logout">
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

function SidebarContent({ activePage, onNavigate }: { activePage: AdminPageKey; onNavigate: (page: AdminPageKey) => void }) {
  const peopleCount = agentRecords.length + brokerRecords.length + employeeRecords.length
  const clientCount = readMockStorage(mockStorageKeys.clients, mockDbClients).length
  const navCountByKey: Partial<Record<AdminPageKey, number>> = {
    clients: clientCount,
    people: peopleCount,
  }

  return (
    <>
      <div className="border-b border-white/10 p-5">
        <div className="mb-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#F2D77E]" />
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#C9A84C] text-xs font-black text-[#1A1A2E] shadow-lg shadow-black/20">DC</div>
          <div>
            <p className="font-serif text-lg leading-tight text-white">D&C Prime</p>
            <p className="text-xs text-white/45">Realty Admin</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-4 overflow-y-auto px-3 pb-5 pt-4">
        {adminNavGroups.map((group) => (
          <div key={group.title} className="border-b border-white/10 pb-3 last:border-b-0">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9A84C]/50">{group.title}</p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`group flex w-full items-center gap-3 rounded-r-lg border-l-2 px-3 py-2.5 text-left text-[13px] font-semibold transition ${
                    activePage === item.key
                      ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]'
                      : 'border-transparent text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
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
