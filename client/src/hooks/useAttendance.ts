import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import type { AttendanceLog, AttendanceType, AuthUser, PaginatedResponse } from '../types'

type AttendanceFilters = {
  date?: string
  user_id?: number | string
  type?: AttendanceType
  page?: number
  limit?: number
}

type ScanAttendanceInput = {
  barcode_value: string
  type: AttendanceType
}

type ScanAttendanceResponse = {
  user: AuthUser
  log: AttendanceLog
}

type TodayAttendanceResponse = {
  date: string
  logs: AttendanceLog[]
  summary: AttendanceLog[]
}

export function useAttendance(filters: AttendanceFilters) {
  return useQuery({
    queryKey: ['attendance', filters],
    queryFn: () => api.get<PaginatedResponse<AttendanceLog>>('/attendance', { params: filters }),
  })
}

export function useTodayAttendance() {
  return useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: () => api.get<TodayAttendanceResponse>('/attendance/today'),
  })
}

export function useScanAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ScanAttendanceInput) => api.post<ScanAttendanceResponse>('/attendance/scan', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['attendance'] })
    },
  })
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...input }: { id: number; scanned_at?: string; notes?: string }) =>
      api.patch<AttendanceLog>(`/attendance/${id}`, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['attendance'] })
    },
  })
}
