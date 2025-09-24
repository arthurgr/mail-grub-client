import axios, {
  AxiosInstance,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from 'axios';
import { firebaseAuth } from '../lib/firebase';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api: AxiosInstance = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  const user = firebaseAuth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);

    if (config.url && !config.url.startsWith('/tenants/')) {
      config.url = `/tenants/${user.uid}${config.url}`;
    }
  }

  return config;
});
