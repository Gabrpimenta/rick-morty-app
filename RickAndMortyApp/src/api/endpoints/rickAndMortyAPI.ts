import axios from 'axios';

const RICK_AND_MORTY_API_BASE_URL = 'https://rickandmortyapi.com/api';

const apiClient = axios.create({
  baseURL: RICK_AND_MORTY_API_BASE_URL,
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
