import axios from 'axios';

console.log('API BASE URL:', import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // You can add other default configs here (headers, timeout, etc.)
});

export default api; 