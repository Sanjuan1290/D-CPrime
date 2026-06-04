/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AlertCircle, Check, Clock } from './Icons'

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
            className={`flex min-w-72 items-start gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-[#111827] shadow-lg ${
              toast.type === 'success'
                ? 'border-l-4 border-l-emerald-500'
                : toast.type === 'error'
                  ? 'border-l-4 border-l-red-500'
                  : 'border-l-4 border-l-amber-500'
            }`}
          >
            <span className={toast.type === 'success' ? 'text-emerald-600' : toast.type === 'error' ? 'text-red-600' : 'text-amber-600'}>
              {toast.type === 'success' ? <Check /> : toast.type === 'error' ? <AlertCircle /> : <Clock />}
            </span>
            <span>{toast.message}</span>
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
