import api from './api';

export const planService = {
  async createPlan(groupId, data) {
    const res = await api.post(`/groups/${groupId}/plans`, data);
    return res.data;
  },

  async getGroupPlans(groupId) {
    const res = await api.get(`/groups/${groupId}/plans`);
    return res.data;
  },

  async updatePlan(planId, data) {
    const res = await api.put(`/plans/${planId}`, data);
    return res.data;
  },

  async deletePlan(planId) {
    const res = await api.delete(`/plans/${planId}`);
    return res.data;
  },
};
