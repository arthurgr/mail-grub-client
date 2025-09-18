import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { firebaseAuth } from './firebase';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

// Attach ID token on every request
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const user = firebaseAuth.currentUser;
  const token = user ? await user.getIdToken() : null;

  if (token) {
    // Ensure headers is an AxiosHeaders instance, then set safely
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    } else if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers);
    }
    (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
  }

  return config;
});

// On 401, try once with a forced refresh, then propagate error
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const status = err?.response?.status;
    const cfg = err?.config as InternalAxiosRequestConfig & {
      _retriedOnce?: boolean;
    };

    if (
      status === 401 &&
      firebaseAuth.currentUser &&
      cfg &&
      !cfg._retriedOnce
    ) {
      cfg._retriedOnce = true;
      const fresh = await firebaseAuth.currentUser.getIdToken(true);

      if (!cfg.headers) {
        cfg.headers = new AxiosHeaders();
      } else if (!(cfg.headers instanceof AxiosHeaders)) {
        cfg.headers = new AxiosHeaders(cfg.headers);
      }
      (cfg.headers as AxiosHeaders).set('Authorization', `Bearer ${fresh}`);

      return api.request(cfg);
    }

    return Promise.reject(err);
  },
);
