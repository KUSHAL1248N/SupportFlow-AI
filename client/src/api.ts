import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4002/api', timeout: 30000 });
api.interceptors.request.use((config) => { const token = sessionStorage.getItem('accessToken'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.response?.data?.error;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string') return message;
    if (!error.response) return 'Cannot reach the API. Check that the backend is running.';
  }
  return 'Something went wrong. Please try again.';
}
