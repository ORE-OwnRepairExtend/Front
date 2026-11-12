import { useCallback, useEffect, useState } from "react";
import { getRecalls } from "../api/recall";
import type { RecallInfo } from "../types/recall";

export function useRecallPopup(userId: string) {
  const [recalls, setRecalls] = useState<RecallInfo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const storageKey = `hiddenRecalls:${userId}`;

  // 다시 보지 않기로 저장한 리콜 ID 조회
  const getHiddenRecallIds = useCallback((): string[] => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return [];

      const parsed: unknown = JSON.parse(saved);

      return Array.isArray(parsed)
        ? parsed.filter((id): id is string => typeof id === "string")
        : [];
    } catch {
      return [];
    }
  }, [storageKey]);

  // 리콜 목록 불러오기
  useEffect(() => {
    let cancelled = false;

    const fetchRecalls = async () => {
      try {
        setIsOpen(false);
        setRecalls([]);
        setCurrentIndex(0);

        const data = await getRecalls();

        if (cancelled) return;

        const hiddenIds = getHiddenRecallIds();

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

    fetchRecalls();

    return () => {
      cancelled = true;
    };
  }, [getHiddenRecallIds]);

  const currentRecall = isOpen ? (recalls[currentIndex] ?? null) : null;

  // 다음 리콜 표시
  const showNextRecall = () => {
    if (currentIndex + 1 < recalls.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsOpen(false);
    }
  };

  // X 버튼: 저장하지 않고 닫기
  const closeRecall = () => {
    showNextRecall();
  };

  // 다시 보지 않기: 해당 리콜 ID 저장
  const hideRecall = () => {
    if (!currentRecall) return;

    const hiddenIds = getHiddenRecallIds();

    const updatedIds = [...new Set([...hiddenIds, currentRecall.recallId])];

    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedIds));
    } catch (error) {
      console.error("리콜 숨김 상태 저장 실패:", error);
      return;
    }

    showNextRecall();
  };

  return {
    currentRecall,
    isOpen,
    closeRecall,
    hideRecall,
  };
}
