import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Updated to include /api

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
