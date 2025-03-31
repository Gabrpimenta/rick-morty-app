import { API_BASE_URL } from '@/constants/api';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((request) => {
  // console.log('Starting Request', request);
  return request;
});

apiClient.interceptors.response.use((response) => {
  // console.log('Received Response', response);
  return response;
});

export default apiClient;
