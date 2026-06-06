/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import type { AuthUser, Role } from '../types'

type LoginInput = {
  email: string
  password: string
}

type AuthContextValue = {
  user: AuthUser | null
  role: Role | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (input: LoginInput) => Promise<AuthUser>
  logout: () => Promise<void>
  refetchUser: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get<AuthUser>('/auth/me'),
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => api.post<{ user: AuthUser }>('/auth/login', input),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(['auth', 'me'], user)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => api.post<{ message: string }>('/auth/logout'),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['auth'] })
    },
  })

  const value = useMemo<AuthContextValue>(
    () => ({
      user: meQuery.data ?? null,
      role: meQuery.data?.role ?? null,
      isAuthenticated: Boolean(meQuery.data),
      isLoading: meQuery.isLoading || loginMutation.isPending || logoutMutation.isPending,
      login: async (input) => {
        const response = await loginMutation.mutateAsync(input)
        return response.user
      },
      logout: async () => {
        await logoutMutation.mutateAsync()
      },
      refetchUser: () => {
        void meQuery.refetch()
      },
    }),
    [loginMutation, logoutMutation, meQuery],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return value
}
