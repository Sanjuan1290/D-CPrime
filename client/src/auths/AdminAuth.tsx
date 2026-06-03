import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

type AdminAuthProps = {
  children: ReactNode
}

function AdminAuth({ children }: AdminAuthProps) {
  const location = useLocation()
  const isAdmin = localStorage.getItem('dcprime_role') === 'admin'

  if (!isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}

export default AdminAuth
