/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AlertCircle, Check, Clock, SpinnerIcon } from './Icons'

type ToastType = 'success' | 'error' | 'warning' | 'loading'
type Toast = { id: number; type: ToastType; message: string }
type ToastContextValue = {
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
  loading: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  function push(type: ToastType, message: string) {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current.slice(-2), { id, type, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3000)
  }

  const value = useMemo(
    () => ({
      success: (message: string) => push('success', message),
      error: (message: string) => push('error', message),
      warning: (message: string) => push('warning', message),
      loading: (message: string) => push('loading', message),
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
            className={`relative flex min-w-72 animate-[toast-slide-in_180ms_ease-out] overflow-hidden rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-[#111827] shadow-lg ${
              toast.type === 'success'
                ? 'border-l-4 border-l-emerald-500'
                : toast.type === 'error'
                  ? 'border-l-4 border-l-red-500'
                  : toast.type === 'warning'
                    ? 'border-l-4 border-l-amber-500'
                    : 'border-l-4 border-l-gray-400'
            }`}
          >
            <span className={toast.type === 'success' ? 'text-emerald-600' : toast.type === 'error' ? 'text-red-600' : toast.type === 'warning' ? 'text-amber-600' : 'text-gray-500'}>
              {toast.type === 'success' ? (
                <Check />
              ) : toast.type === 'error' ? (
                <AlertCircle />
              ) : toast.type === 'loading' ? (
                <SpinnerIcon className="h-4 w-4 animate-spin" />
              ) : (
                <Clock />
              )}
            </span>
            <span>{toast.message}</span>
            <span
              className={`absolute bottom-0 left-0 h-0.5 animate-[toast-progress_3000ms_linear_forwards] ${
                toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-red-500' : toast.type === 'warning' ? 'bg-amber-500' : 'bg-gray-400'
              }`}
            />
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
