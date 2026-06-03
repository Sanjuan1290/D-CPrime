import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminAuth from './auths/AdminAuth'
import AdminRouteGate from './auths/AdminRouteGate'
import { ToastProvider } from './components/admin/Toast'
import AdminLayout from './layouts/AdminLayout'
import LoginPage from './pages/LoginPage'
import { adminRoutes } from './routes/adminRoutes'

const AdminNotFoundPage = lazy(() => import('./pages/admin/AdminNotFoundPage'))

function App() {
  return (
    <ToastProvider>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminAuth>
                <AdminLayout />
              </AdminAuth>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            {adminRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <AdminRouteGate allowedRoles={route.allowedRoles} feature={route.feature}>
                    {route.element}
                  </AdminRouteGate>
                }
              />
            ))}
            <Route path="*" element={<AdminNotFoundPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </ToastProvider>
  )
}

function RouteLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#0A0A0A] text-sm font-semibold text-[#C9A84C]">
      Loading workspace...
    </div>
  )
}

export default App
