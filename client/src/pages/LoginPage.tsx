import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { company } from '../data/mockData'

function LoginPage() {
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = localStorage.getItem('dcprime_role') === 'admin'
  const from = (location.state as { from?: string } | null)?.from ?? '/admin/dashboard'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))

    if (email === 'admin@dcprime.com' && password === 'admin123') {
      localStorage.setItem('dcprime_role', 'admin')
      localStorage.setItem('dcprime_name', 'Admin')
      localStorage.setItem('dcprime_token', 'mock-admin-jwt')
      navigate(from, { replace: true })
      return
    }

    setError('Use admin@dcprime.com and admin123 for the mock admin login.')
  }

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] p-4 text-white">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-[#C9A84C]/25 bg-[#111111] shadow-2xl shadow-black/40 lg:grid-cols-[1fr_420px]">
        <div className="flex min-h-[560px] flex-col justify-between bg-[#0A0A0A] p-8 text-white md:p-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md border border-[#C9A84C] bg-[#C9A84C] text-sm font-black text-black">
                DC
              </div>
              <div>
                <p className="text-sm font-bold">{company.name}</p>
                <p className="text-xs text-zinc-400">Admin management system</p>
              </div>
            </div>
            <div className="mt-16 max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A84C]">Secure admin access</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                Manage clients, lots, payments, and SOA records.
              </h1>
              <p className="mt-5 text-sm leading-6 text-zinc-300">
                Mock workspace using the sample masterlist, SOA installment records, commission tracker, and computation
                values you provided.
              </p>
            </div>
          </div>
          <div className="grid gap-3 border-t border-white/10 pt-5 text-xs text-zinc-400 md:grid-cols-3">
            <span>Master List</span>
            <span>SOA Installment</span>
            <span>Admin Role</span>
          </div>
        </div>

        <div className="flex items-center bg-[#151515] p-6 md:p-8">
          <form onSubmit={handleSubmit} className="w-full">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A84C]">Admin Login</p>
            <h2 className="mt-3 text-2xl font-bold">Welcome back</h2>
            <p className="mt-2 text-sm text-zinc-400">Use the mock credentials to preview the admin panel.</p>
            <label className="mt-8 block text-sm font-semibold text-zinc-300">
              Email
              <input
                name="email"
                defaultValue="admin@dcprime.com"
                className="mt-2 w-full rounded-md border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold text-zinc-300">
              Password
              <input
                name="password"
                type="password"
                defaultValue="admin123"
                className="mt-2 w-full rounded-md border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20"
              />
            </label>
            {error && <p className="mt-4 rounded-md border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
            <button className="mt-6 w-full rounded-md bg-[#C9A84C] px-4 py-3 text-sm font-bold text-black hover:bg-[#d8b95d]">
              Login
            </button>
            <div className="mt-5 rounded-md border border-white/10 bg-white/5 p-3 text-xs text-zinc-400">
              admin@dcprime.com / admin123
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
