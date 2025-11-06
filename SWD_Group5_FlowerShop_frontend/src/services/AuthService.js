import api from './axiosConfig';

export const authService = {
  async login(credentials) {
    try {
  const response = await api.post('/auth/login', credentials);
      const authData = response.data?.data || response.data || response;

      // Persist token and user (support multiple backend shapes)
      const token = authData?.access_token || authData?.token || authData?.data?.access_token || authData?.data?.token;
      if (token) {
        api.setAuthToken(token);
        if (typeof window !== 'undefined') {
          // Backend may return user at authData.user or authData.data.user
          const userObj = authData?.user || authData?.data?.user || authData;
          try { localStorage.setItem('user', JSON.stringify(userObj)); } catch (e) { /* ignore */ }
          localStorage.setItem('auth_token', token);
        }
      }

      return authData;
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Login failed');
    }
  },

  async register(userData) {
    try {
  const response = await api.post('/auth/register', userData);
      const authData = response.data?.data || response.data || response;

      const regToken = authData?.access_token || authData?.token || authData?.data?.access_token || authData?.data?.token;
      if (regToken) {
        api.setAuthToken(regToken);
        if (typeof window !== 'undefined') {
          const userObj = authData?.user || authData?.data?.user || authData;
          try { localStorage.setItem('user', JSON.stringify(userObj)); } catch (e) { /* ignore */ }
          localStorage.setItem('auth_token', regToken);
        }
      }

      return authData;
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Registration failed');
    }
  },

  logout() {
    api.clearAuthToken();
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    } catch (e) {
      // ignore
    }
  },

  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  isAuthenticated() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('user');
      return Boolean(token && user);
    }
    return false;
  },
};
export default authService;
