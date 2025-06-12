import axios from "../api/axios";
import create from 'zustand';

export const useNotificationsStore = create(set => ({
  notifications: [],
  fetchNotifications: async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const accessToken = localStorage.getItem("accessToken");
    if (!user || !accessToken) return;

    try {
      const response = await axios.get(`/notification/getAll/${user._id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      set({ notifications: response.data.notifications || [] });
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  },
  addNotification: (notification) =>
    set(state => ({ notifications: [notification, ...state.notifications] })),
  markAllSeen: async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return;
    try {
      await axios.put(`/notification/setNotification/${user._id}`);
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, isSeen: true })),
      }));
    } catch (err) {
      console.error('Error marking notifications as seen:', err);
    }
  },
}));
