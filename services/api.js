import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Laravel API URL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json', // Set content type
    'Accept': 'application/json', // Define accepted response format
  },
});

export default api;
