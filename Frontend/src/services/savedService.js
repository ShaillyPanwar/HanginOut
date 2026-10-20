import api from './api';

export const savedService = {
  async getSavedActivities(params = {}) {
    const res = await api.get('/saved', { params });
    return res.data;
  },

  async saveActivity(activityId) {
    const res = await api.post(`/saved/${activityId}`);
    return res.data;
  },

  async unsaveActivity(activityId) {
    const res = await api.delete(`/saved/${activityId}`);
    return res.data;
  },
};
