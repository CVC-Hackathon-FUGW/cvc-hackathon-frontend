import axios from 'axios';

const url = import.meta.env.VITE_API_URL;
const prefix = 'v1';
const baseURL = `${url}/${prefix}`;

const api = axios.create({
  baseURL,
});

export default api;
