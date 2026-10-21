import api from './api';

export const groupService = {
  async createGroup(name) {
    const res = await api.post('/groups', { name });
    return res.data;
  },

  async getUserGroups() {
    const res = await api.get('/groups');
    return res.data;
  },

  async getGroupById(id) {
    const res = await api.get(`/groups/${id}`);
    return res.data;
  },

  async joinGroup(inviteCode) {
    const res = await api.post('/groups/join', { inviteCode });
    return res.data;
  },

  async getGroupMembers(id) {
    const res = await api.get(`/groups/${id}/members`);
    return res.data;
  },

  async recordGroupSwipe(groupId, activityId, action) {
    const res = await api.post(`/groups/${groupId}/swipes`, { activityId, action });
    return res.data;
  },

  async getGroupMatches(groupId) {
    const res = await api.get(`/groups/${groupId}/matches`);
    return res.data;
  },
};
