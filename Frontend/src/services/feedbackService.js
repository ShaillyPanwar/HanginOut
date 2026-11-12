import api from './api';

export const feedbackService = {
  /**
   * Submit or update feedback for an activity
   * @param {number|string} activityId 
   * @param {{ rating: number, comment?: string, visitDate?: string, groupId?: number, enjoyed?: boolean }} data 
   */
  async submitActivityFeedback(activityId, data) {
    const res = await api.post(`/activities/${activityId}/feedback`, data);
    return res.data;
  },

  /**
   * Get the authenticated user's feedback for an activity
   * @param {number|string} activityId 
   */
  async getMyFeedback(activityId) {
    const res = await api.get(`/activities/${activityId}/feedback/me`);
    return res.data;
  },

  /**
   * Get aggregated feedback summary (average rating, count) for an activity
   * @param {number|string} activityId 
   */
  async getFeedbackSummary(activityId) {
    const res = await api.get(`/activities/${activityId}/feedback/summary`);
    return res.data;
  },

  /**
   * Get all public reviews for an activity
   * @param {number|string} activityId 
   */
  async getActivityReviews(activityId) {
    const res = await api.get(`/activities/${activityId}/feedback`);
    return res.data;
  },

  /**
   * Update feedback by feedback ID
   * @param {number|string} feedbackId 
   * @param {{ rating: number, comment?: string, visitDate?: string, enjoyed?: boolean }} data 
   */
  async updateFeedback(feedbackId, data) {
    const res = await api.put(`/feedback/${feedbackId}`, data);
    return res.data;
  },
};
