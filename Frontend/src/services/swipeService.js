import api from './api';

export const swipeService = {
  async recordSwipe(activityId, action) {
    const res = await api.post('/swipes', { activityId, action });
    return res.data;
  },

  async getAllSwipes(params = {}) {
    const res = await api.get('/swipes', { params });
    return res.data;
  },

  async getLikedSwipes(params = {}) {
    const res = await api.get('/swipes/liked', { params });
    return res.data;
  },
};
