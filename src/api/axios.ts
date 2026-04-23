import axios from 'axios';

const apiClient = axios.create({
  baseURL: "https://fip.tadbeer.sa/fip_tadbeer/tracking_system/public/api",
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
