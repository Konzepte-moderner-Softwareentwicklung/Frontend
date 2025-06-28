import axios from 'axios';

// Create instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor – attach token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('UserId');
  if (token && config.headers) {
    config.headers['Authorization'] = `${token}`;
  }
  if(userId&& token) {
    config.headers['UserId'] = `${userId}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Optional: Response Interceptor – error logging, token refresh, etc.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Fehler:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
