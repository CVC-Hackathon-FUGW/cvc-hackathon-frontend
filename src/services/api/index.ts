import axios from 'axios';
import JSONbig from 'json-bigint';

const url = import.meta.env.VITE_API_URL;
const prefix = 'v1';
const baseURL = `${url}/${prefix}`;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((request) => {
  request.transformRequest = (data) => JSONbig.stringify(data);
  request.headers['Content-Type'] = 'application/json';
  return request;
});

api.interceptors.response.use((response) => response.data);

export default api;
