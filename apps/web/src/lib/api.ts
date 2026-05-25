// apps/web/src/lib/api.ts
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// ── Token management (in-memory only — no localStorage for access tokens) ──
// Refresh token lives in an httpOnly cookie managed by the server.
// Access token is kept only in memory to reduce XSS exposure.
let accessToken: string | null = null;
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

function processQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
  });
  pendingQueue = [];
}

// ── Axios instance ─────────────────────────────────────────────────────────
const baseURL = process.env.NEXT_PUBLIC_API_URL;
if (!baseURL && typeof window !== 'undefined') {
  console.error('[api] NEXT_PUBLIC_API_URL is not set — API calls will fail');
}

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true, // send/receive httpOnly refresh cookie
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // helps distinguish AJAX from browser nav
  },
});

// ── Request interceptor: attach access token ───────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: refresh token rotation on 401 ───────────────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const is401 = error.response?.status === 401;
    const alreadyRetried = originalRequest._retry;
    const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh');

    if (is401 && !alreadyRetried && !isRefreshEndpoint) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise<string>((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post<{ access_token: string }>('/auth/refresh');
        const newToken = data.access_token;
        setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        // Let the app handle redirect to login
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:session-expired'));
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ── Auth API ───────────────────────────────────────────────────────────────
export const authApi = {
  register: async (data: { name: string; email: string; password: string; phone?: string }) => {
    const res = await api.post<{ access_token: string; user: AuthUser }>('/auth/register', data);
    setAccessToken(res.data.access_token);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post<{ access_token: string; user: AuthUser }>('/auth/login', data);
    setAccessToken(res.data.access_token);
    return res.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
    }
  },

  me: async (): Promise<AuthUser> => {
    const res = await api.get<AuthUser>('/auth/me');
    return res.data;
  },
};

// ── Listings API ───────────────────────────────────────────────────────────
export const listingsApi = {
  getAll: async (params?: Record<string, unknown>) => {
    const res = await api.get('/listings', { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get(`/listings/${id}`);
    return res.data;
  },
};

// ── Vehicles API ───────────────────────────────────────────────────────────
export const vehiclesApi = {
  getBrands: async () => {
    const res = await api.get('/vehicles/brands');
    return res.data;
  },

  getModels: async (brandId: string) => {
    const res = await api.get(`/vehicles/brands/${brandId}/models`);
    return res.data;
  },

  getYears: async (modelId: string) => {
    const res = await api.get(`/vehicles/models/${modelId}/years`);
    return res.data;
  },

  getTrims: async (modelId: string, year: string) => {
    const res = await api.get(`/vehicles/models/${modelId}/trims`, {
      params: { year },
    });
    return res.data;
  },
};

// ── Types ──────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'USER' | 'DEALER' | 'ADMIN';
  verified: boolean;
}
