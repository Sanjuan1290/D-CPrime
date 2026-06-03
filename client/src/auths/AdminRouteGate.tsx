import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { FeatureKey, Role } from '../data/mockData'
import Panel from '../components/admin/Panel'

type AdminRouteGateProps = {
  allowedRoles: Role[]
  feature: FeatureKey
  children: ReactNode
}

function AdminRouteGate({ allowedRoles, feature, children }: AdminRouteGateProps) {
  const location = useLocation()
  const role = localStorage.getItem('dcprime_role') as Role | null

  if (!role) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!allowedRoles.includes(role)) {
    return (
      <Panel title="Access Restricted" subtitle="Your mock user role does not have access to this page.">
        <div className="rounded-lg border border-white/10 bg-black p-5 text-sm text-zinc-300">
          <p>Required feature: {feature}</p>
          <p className="mt-2 text-zinc-500">Current role: {role}</p>
        </div>
      </Panel>
    )
  }

  return <>{children}</>
}

export default AdminRouteGate
