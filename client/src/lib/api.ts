import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  withCredentials: true,
})

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => axiosClient.get<T, T>(url, config),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => axiosClient.post<T, T>(url, data, config),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => axiosClient.patch<T, T>(url, data, config),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => axiosClient.put<T, T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => axiosClient.delete<T, T>(url, config),
}

export default api
