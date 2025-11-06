// axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`, // thay đổi nếu cần
  withCredentials: true, // BẮT BUỘC để gửi cookie
});

// Attach Authorization header from localStorage if token exists
api.interceptors.request.use((config) => {
  try {
    const tokenKeys = [
      'auth_token',
      'access_token',
      'token',
    ];
    let token = null;
    for (const k of tokenKeys) {
      const v = localStorage.getItem(k);
      if (v) {
        token = v;
        break;
      }
    }
    if (!token) {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        try {
          const userObj = JSON.parse(userRaw);
          token = userObj?.access_token || userObj?.token || null;
        } catch (e) {
          // ignore
        }
      }
    }

    if (token) {
      // debug: indicate whether a token was found (do not print the token value)
      try {
        if (import.meta.env && import.meta.env.MODE === 'development') {
          console.debug('[api] auth token present:', true);
        }
      } catch (e) {
        // ignore in environments that don't support import.meta
      }
      config.headers = config.headers || {};
      if (!config.headers.Authorization && !config.headers.authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    // ignore
  }
  return config;
});

export default api;

// Helper to set/clear auth token programmatically (used by AuthService)
api.setAuthToken = (token) => {
  try {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }
    }
  } catch (e) {
    // ignore
  }
};

api.clearAuthToken = () => {
  try {
    delete api.defaults.headers.common['Authorization'];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  } catch (e) {
    // ignore
  }
};
