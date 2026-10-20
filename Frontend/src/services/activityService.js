import api from './api';

export const activityService = {
  async getActivities(params = {}) {
    const res = await api.get('/activities', { params });
    return res.data;
  },

  async getRecommendedActivities(params = {}) {
    const res = await api.get('/activities/recommended', { params });
    return res.data;
  },

  async getActivityById(id) {
    const res = await api.get(`/activities/${id}`);
    return res.data;
  },

  async getCategories() {
    const res = await api.get('/activities/categories');
    return res.data;
  },
};
