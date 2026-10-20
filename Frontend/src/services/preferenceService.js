import api from './api';

export const preferenceService = {
  async getPreferences() {
    const res = await api.get('/preferences');
    return res.data;
  },

  async updatePreferences(data) {
    const res = await api.put('/preferences', data);
    return res.data;
  },
};
