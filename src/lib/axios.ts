import axios from 'axios';
import { redirect } from 'next/navigation';

const api = axios.create({
  baseURL: '/api', // все запросы будут идти на /api/...
  withCredentials: true, // важно для отправки cookies
});

// Интерцептор ответа
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен недействителен – перенаправляем на логин
      // Используем window.location.href, так как это клиентский код
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;