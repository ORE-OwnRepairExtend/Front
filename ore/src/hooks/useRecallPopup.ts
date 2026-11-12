import { useEffect, useState } from "react";

import { getRecalls } from "../api/recall";
import type { RecallInfo } from "../types/recall";

import { getHiddenRecallIds, hideRecallById } from "../utils/recallStorage";

export function useRecallPopup(userId: string) {
  const [recalls, setRecalls] = useState<RecallInfo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // 리콜 목록 조회
  useEffect(() => {
    let cancelled = false;

    const fetchRecalls = async () => {
      try {
        setIsOpen(false);
        setRecalls([]);
        setCurrentIndex(0);

        const data = await getRecalls();

        if (cancelled) return;

        const hiddenIds = getHiddenRecallIds(userId);

        const visibleRecalls = data.filter(
          (recall) => !hiddenIds.includes(recall.recallId),
        );

        setRecalls(visibleRecalls);
        setIsOpen(visibleRecalls.length > 0);
      } catch (error) {
        if (!cancelled) {
          console.error("리콜 정보 조회 실패:", error);
          setIsOpen(false);
        }
      }
    };

    void fetchRecalls();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const currentRecall = isOpen ? (recalls[currentIndex] ?? null) : null;

  // 다음 리콜 표시
  const showNextRecall = () => {
    if (currentIndex + 1 < recalls.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsOpen(false);
    }
  };

  // X 버튼: 다시 보지 않기 저장 없이 닫기
  const closeRecall = () => {
    showNextRecall();
  };

  // 다시 보지 않기
  const hideRecall = () => {
    if (!currentRecall) return;

    const saved = hideRecallById(userId, currentRecall.recallId);

    if (!saved) return;

    showNextRecall();
  };

  return {
    currentRecall,
    isOpen,
    closeRecall,
    hideRecall,
  };
}
