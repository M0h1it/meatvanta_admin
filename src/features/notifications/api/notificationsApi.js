import apiClient from "../../../lib/apiClient";

export async function fetchNotifications({ unreadOnly = false, limit = 20 } = {}) {
  const { data } = await apiClient.get("/notifications", { params: { unreadOnly, limit } });
  return data.data.notifications;
}

/** Lightweight - this is what gets polled every 30s for the bell badge. */
export async function fetchUnreadCount() {
  const { data } = await apiClient.get("/notifications/unread-count");
  return data.data.count;
}

export async function markNotificationRead(id) {
  const { data } = await apiClient.patch(`/notifications/${id}/read`);
  return data.data.notification;
}

export async function markAllNotificationsRead() {
  const { data } = await apiClient.post("/notifications/read-all");
  return data.data;
}
