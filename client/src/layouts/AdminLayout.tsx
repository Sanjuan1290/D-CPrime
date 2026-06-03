import { useState } from 'react'
import type { ReactNode } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { company } from '../data/mockData'
import { adminNavGroups, getActiveAdminPage, getAdminRouteLabel, routeByKey } from '../routes/adminRoutes'
import type { AdminPageKey } from '../routes/adminRoutes'

function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const activePage = getActiveAdminPage(location.pathname)
  const activeLabel = getAdminRouteLabel(activePage)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const adminName = localStorage.getItem('dcprime_name') ?? 'Admin'

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

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#0A0A0A] text-zinc-200 lg:flex lg:flex-col">
          <SidebarContent activePage={activePage} onNavigate={handleNavigate} />
        </aside>

        {isMobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button className="absolute inset-0 bg-black/70" onClick={() => setIsMobileOpen(false)} aria-label="Close menu" />
            <aside className="relative z-10 h-full w-72 border-r border-white/10 bg-[#0A0A0A]">
              <SidebarContent activePage={activePage} onNavigate={handleNavigate} />
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0A0A0A]/95 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileOpen(true)}
                  className="rounded-md border border-white/10 px-3 py-2 text-sm font-bold text-zinc-200 lg:hidden"
                >
                  Menu
                </button>
                <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">{company.name}</p>
                <h2 className="mt-1 text-2xl font-bold">{activeLabel}</h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-sm text-zinc-400 sm:inline">{adminName}</span>
                <button onClick={handleLogout} className="rounded-md border border-[#C9A84C]/40 px-3 py-2 text-sm font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10">
                  Logout
                </button>
              </div>
            </div>
          </header>

          <section className="px-4 py-6 md:px-8">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ activePage, onNavigate }: { activePage: AdminPageKey; onNavigate: (page: AdminPageKey) => void }) {
  return (
    <>
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-[#C9A84C] text-xs font-black text-black">DC</div>
          <div>
            <p className="text-sm font-bold text-white">D&C Prime Realty</p>
            <p className="text-xs text-zinc-500">Admin</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-3 overflow-y-auto px-3 pb-5 pt-4">
        {adminNavGroups.map((group) => (
          <div key={group.title} className="border-b border-white/10 pb-2.5 last:border-b-0">
            <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-wide text-zinc-500">{group.title}</p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`group flex w-full items-center gap-2.5 border-l-2 px-3 py-2 text-left text-[13px] font-semibold transition ${
                    activePage === item.key
                      ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]'
                      : 'border-transparent text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </>
  )
}

function NavIcon({ name }: { name: string }) {
  const common = 'h-3.5 w-3.5 shrink-0 text-current opacity-75'

  if (name === 'shield') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    )
  }

  const paths: Record<string, ReactNode> = {
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </>
    ),
    building: (
      <>
        <path d="M6 22V3h12v19" />
        <path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" />
        <path d="M4 22h16" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v11h14V10" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    card: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
      </>
    ),
    percent: (
      <>
        <path d="m19 5-14 14" />
        <circle cx="7" cy="7" r="2" />
        <circle cx="17" cy="17" r="2" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
      </>
    ),
    clipboard: (
      <>
        <path d="M8 4h8v4H8z" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14H4V6a2 2 0 0 1 2-2h2" />
      </>
    ),
    id: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="11" r="2" />
        <path d="M7 16a2 2 0 0 1 4 0M14 10h4M14 14h4" />
      </>
    ),
    wallet: (
      <>
        <path d="M4 7h16v12H4z" />
        <path d="M4 7V5h13v2" />
        <path d="M16 13h4" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 16v-5M12 16V8M16 16v-3" />
      </>
    ),
    userCog: (
      <>
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h3" />
        <path d="M17 14v6M14 17h6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1-2 2-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V20h-3v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1-2-2 .1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H4v-3h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1 2-2 .1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V4h3v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1 2 2-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1h.1v3h-.1a1.7 1.7 0 0 0-1.5 1Z" />
      </>
    ),
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] ?? paths.grid}
    </svg>
  )
}

export default AdminLayout
