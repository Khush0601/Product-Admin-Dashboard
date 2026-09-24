import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dummyjson.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = {
      status: error?.response?.status ?? null,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong. Please try again.',
      isCancelled: axios.isCancel(error),
      original: error,
    };

    if (normalizedError.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');

      if (!window.location.pathname.startsWith('/login')) {
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }
    }

    return Promise.reject(normalizedError);
  }
);

export default api;
