import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'warning'
type Toast = { id: number; type: ToastType; message: string }
type ToastContextValue = {
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  function push(type: ToastType, message: string) {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, type, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3000)
  }

  const value = useMemo(
    () => ({
      success: (message: string) => push('success', message),
      error: (message: string) => push('error', message),
      warning: (message: string) => push('warning', message),
    }),
    [],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-72 rounded-lg border px-4 py-3 text-sm font-semibold shadow-xl shadow-black/30 ${
              toast.type === 'success'
                ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                : toast.type === 'error'
                  ? 'border-red-400/30 bg-red-400/10 text-red-200'
                  : 'border-orange-400/30 bg-orange-400/10 text-orange-200'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const value = useContext(ToastContext)
  if (!value) {
    throw new Error('useToast must be used inside ToastProvider')
  }
  return value
}
