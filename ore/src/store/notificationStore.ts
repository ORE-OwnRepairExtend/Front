import { create } from "zustand";

type Notification = {
  id: number;
  productId: number;
  title: string;
  subtitle?: string;
  message: string;
  date: string;
  isRead: boolean;
  remainingDays: number;
};

type NotificationStore = {
  notifications: Notification[];
  setNotifications: (data: Notification[]) => void;
  markAsRead: (id: number) => void;
  deleteNotifications: (ids: number[]) => void;
  markAllAsRead: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  setNotifications: (data) => set({ notifications: data }),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((item) =>
        item.id === id ? { ...item, isRead: true } : item
      ),
    })),

  deleteNotifications: (ids) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (item) => !ids.includes(item.id)
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({
        ...item,
        isRead: true,
      })),
    })),
}));