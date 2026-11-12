import type { RecallInfo } from "../types/recall";
import type { Notification } from "../store/notificationStore";
import { getHiddenRecallIds } from "./recallStorage";

export const MOCK_RECALL_PREFIX = "mock-recall:";

export const isMockRecallNotification = (id: string) =>
  id.startsWith(MOCK_RECALL_PREFIX);

export const createMockRecallNotifications = (
  recalls: RecallInfo[],
  userId: string,
): Notification[] => {
  const hiddenIds = new Set(getHiddenRecallIds(userId));

  return recalls.map((recall) => {
    const isFamily = recall.isFamilyRecall ?? false;

    return {
      id: `${MOCK_RECALL_PREFIX}${recall.recallId}`,
      productId: recall.productId,

      title: isFamily ? "Family" : "Recall",
      subtitle: "",

      message: isFamily
        ? `${recall.userName} 님의 제품에 대한 새로운 리콜 안내가 있습니다.`
        : `${recall.productName}(${recall.productDescription}) 제품에 대한 새로운 리콜 안내가 있습니다.`,

      date:
        recall.createdAt?.split("T")[0] ??
        new Date().toISOString().split("T")[0],

      isRead: hiddenIds.has(recall.recallId),

      // 기존 Store의 status 타입 유지
      status: "imminent",

      notificationType: "RECALL",
      referenceId: recall.recallId,
      referenceType: "RECALL",
      isMockRecall: true,
      isFamilyRecall: isFamily,
    };
  });
};
