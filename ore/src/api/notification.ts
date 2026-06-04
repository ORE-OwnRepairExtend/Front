import { api } from "./api";

type UnreadNotificationCountResponse = {
  unreadCount: number;
};

export const getUnreadNotificationCount = async () => {
  const response = await api.get<UnreadNotificationCountResponse>(
    "/notifications/unread-count",
  );

  return response.data;
};