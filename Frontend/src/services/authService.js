import api from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(data) {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  async getCurrentUser() {
    const res = await api.get('/users/me');
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.put('/users/me', data);
    return res.data;
  },

  logout() {
    localStorage.removeItem('hanginout_token');
    localStorage.removeItem('hanginout_user');
  },
};
