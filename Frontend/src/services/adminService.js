import api from './api';

export const adminService = {
  // Analytics
  getAnalytics: async () => {
    const res = await api.get('/admin/analytics');
    return res.data;
  },

  // Users
  getUsers: async (params = {}) => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  updateUserStatus: async (userId, active) => {
    const res = await api.patch(`/admin/users/${userId}/status`, { active });
    return res.data;
  },

  updateUserRole: async (userId, role) => {
    const res = await api.patch(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  // Activities
  getActivities: async (params = {}) => {
    const res = await api.get('/admin/activities', { params });
    return res.data;
  },

  getActivity: async (id) => {
    const res = await api.get(`/admin/activities/${id}`);
    return res.data;
  },

  createActivity: async (data) => {
    const res = await api.post('/admin/activities', data);
    return res.data;
  },

  updateActivity: async (id, data) => {
    const res = await api.put(`/admin/activities/${id}`, data);
    return res.data;
  },

  deleteActivity: async (id) => {
    const res = await api.delete(`/admin/activities/${id}`);
    return res.data;
  },

  // Spots
  getSpots: async (params = {}) => {
    const res = await api.get('/admin/spots', { params });
    return res.data;
  },

  getSpot: async (id) => {
    const res = await api.get(`/admin/spots/${id}`);
    return res.data;
  },

  createSpot: async (data) => {
    const res = await api.post('/admin/spots', data);
    return res.data;
  },

  updateSpot: async (id, data) => {
    const res = await api.put(`/admin/spots/${id}`, data);
    return res.data;
  },

  deleteSpot: async (id) => {
    const res = await api.delete(`/admin/spots/${id}`);
    return res.data;
  },

  uploadSpotImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/admin/spots/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Categories
  getCategories: async () => {
    const res = await api.get('/admin/categories');
    return res.data;
  },

  createCategory: async (data) => {
    const res = await api.post('/admin/categories', data);
    return res.data;
  },

  updateCategory: async (id, data) => {
    const res = await api.put(`/admin/categories/${id}`, data);
    return res.data;
  },

  deleteCategory: async (id) => {
    const res = await api.delete(`/admin/categories/${id}`);
    return res.data;
  },

  // Feedback
  getFeedback: async (params = {}) => {
    const res = await api.get('/admin/feedback', { params });
    return res.data;
  },

  submitFeedback: async (data) => {
    const res = await api.post('/feedback', data);
    return res.data;
  },
};

export default adminService;
