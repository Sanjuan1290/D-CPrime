import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { company } from '../lib/brand'

function LoginPage() {
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading, login, role } = useAuth()
  const from = (location.state as { from?: string } | null)?.from ?? '/admin/dashboard'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))

    try {
      const user = await login({ email, password })
      navigate(user.role === 'client' ? '/client/dashboard' : from, { replace: true })
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setError(message ?? 'Unable to sign in. Check your email and password.')
    }
  }

  if (isAuthenticated) {
    return <Navigate to={role === 'client' ? '/client/dashboard' : '/admin/dashboard'} replace />
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
                Real API-backed access for D&C Prime Realty staff and client accounts.
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
            <p className="mt-2 text-sm text-zinc-400">Sign in with your D&C Prime Realty account.</p>
            <label className="mt-8 block text-sm font-semibold text-zinc-300">
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                className="mt-2 w-full rounded-md border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold text-zinc-300">
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                className="mt-2 w-full rounded-md border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20"
              />
            </label>
            {error && <p className="mt-4 rounded-md border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
            <button
              disabled={isLoading}
              className="mt-6 w-full rounded-md bg-[#C9A84C] px-4 py-3 text-sm font-bold text-black hover:bg-[#d8b95d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
