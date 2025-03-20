import axios from 'axios';

const api = axios.create({
  baseURL: 'https://giat-cerika.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Response interceptor (hanya untuk error handling)
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;