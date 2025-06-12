import axios from "./axios";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}

export async function getNotifications(userId) {
  const response = await axios.get(`/notification/getAll/${userId}`, {
    headers: authHeader(),
  });
  return response.data.notifications || [];
}

export async function sendNotification({ user, type, text }) {
  const response = await axios.post(
    '/notification/sendNotification',
    { user, type, text },
    { headers: authHeader() }
  );
  return response.data;
}

export async function setNotificationAsSeen(userId) {
  const response = await axios.put(`/notification/setNotification/${userId}`);
  return response.data;
}
