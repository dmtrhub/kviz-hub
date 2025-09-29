import axios from 'axios';
import { API_BASE_URL } from '../config';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor za dodavanje Authorization tokena
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - provera da li je token istekao
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token je istekao ili nije validan
      console.log('Token expired or invalid, logging out...');
      
      // Obriši token i podatke korisnika
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirektuj na login stranu
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
