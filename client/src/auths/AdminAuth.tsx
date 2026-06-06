import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import LoadingSkeleton from '../components/shared/LoadingSkeleton'
import { useAuth } from '../hooks/useAuth'

type AdminAuthProps = {
  children: ReactNode
}

function AdminAuth({ children }: AdminAuthProps) {
  const location = useLocation()
  const { isAuthenticated, isLoading, role } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] p-6">
        <LoadingSkeleton rows={5} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (role === 'client') {
    return <Navigate to="/client/dashboard" replace />
  }

  return <>{children}</>
}

export default AdminAuth
