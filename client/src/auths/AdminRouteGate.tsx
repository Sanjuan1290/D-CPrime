import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import Panel from '../components/admin/Panel'
import { useAuth } from '../hooks/useAuth'
import type { FeatureKey, Role } from '../types'

type AdminRouteGateProps = {
  allowedRoles: Role[]
  feature: FeatureKey
  children: ReactNode
}

function AdminRouteGate({ allowedRoles, feature, children }: AdminRouteGateProps) {
  const location = useLocation()
  const { user, role } = useAuth()

  if (!role) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  const hasFeature = user?.permissions?.[feature] ?? true

  if (!allowedRoles.includes(role) || !hasFeature) {
    return (
      <Panel title="Access Restricted" subtitle="Your user role does not have access to this page.">
        <div className="rounded-lg border border-[#E8E4DC] bg-white p-5 text-sm text-[#374151]">
          <p>Required feature: {feature}</p>
          <p className="mt-2 text-[#6B7280]">Current role: {role}</p>
        </div>
      </Panel>
    )
  }

  return <>{children}</>
}

export default AdminRouteGate
