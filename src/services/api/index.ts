import axios from 'axios';

const url = import.meta.env.VITE_API_URL;
const prefix = 'v1';
const baseURL = `${url}/${prefix}`;

const api = axios.create({
  baseURL,
});

api.interceptors.response.use((response) => response.data);

export default api;
