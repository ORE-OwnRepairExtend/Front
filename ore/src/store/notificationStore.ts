import { create } from "zustand";
import type { ProductStatus } from "../types/product";

type NotificationStatus = Exclude<ProductStatus, "valid" | "empty">;

export type Notification = {
  id: string;
  productId: string;
  title: string;
  subtitle?: string;
  message: string;
  date: string;
  isRead: boolean;
  status: NotificationStatus;

  // 신규: 알림 유형 식별
  notificationType?: string;
  referenceId?: string | null;
  referenceType?: string | null;

  // 신규: Mock 리콜 알림 구분
  isMockRecall?: boolean;

  // 신규: 가족 제품 리콜 구분
  isFamilyRecall?: boolean;
};

type NotificationStore = {
  notifications: Notification[];
  setNotifications: (data: Notification[]) => void;
  markAsRead: (id: string) => void;
  deleteNotifications: (ids: string[]) => void;
  markAllAsRead: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  setNotifications: (data) => set({ notifications: data }),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((item) =>
        item.id === id ? { ...item, isRead: true } : item,
      ),
    })),

  deleteNotifications: (ids) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (item) => !ids.includes(item.id),
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
