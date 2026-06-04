import { api } from "./api";

type UnreadNotificationCountResponse = {
  unreadCount: number;
};

type ReadNotificationResponse = {
  notificationId: string;
  isRead: boolean;
};

type ReadAllNotificationsResponse = {
  updatedCount: number;
};

export const getUnreadNotificationCount = async () => {
  const response = await api.get<UnreadNotificationCountResponse>(
    "/notifications/unread-count",
  );

  return response.data;
};

export const readNotification = async (notificationId: string) => {
  const response = await api.patch<ReadNotificationResponse>(
    `/notifications/${notificationId}/read`,
  );

  return response.data;
};

export const readAllNotifications = async () => {
  const response = await api.patch<ReadAllNotificationsResponse>(
    "/notifications/read-all",
  );

  return response.data;
};