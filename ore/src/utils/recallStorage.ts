const getRecallStorageKey = (userId: string) => {
  return `hiddenRecalls:${userId}`;
};

// 다시 보지 않기로 저장한 리콜 ID 조회
export const getHiddenRecallIds = (userId: string): string[] => {
  try {
    const saved = localStorage.getItem(getRecallStorageKey(userId));

    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
};

// 특정 리콜을 다시 보지 않기로 저장
export const hideRecallById = (userId: string, recallId: string): boolean => {
  const hiddenIds = getHiddenRecallIds(userId);

  const updatedIds = [...new Set([...hiddenIds, recallId])];

  try {
    localStorage.setItem(
      getRecallStorageKey(userId),
      JSON.stringify(updatedIds),
    );

    return true;
  } catch (error) {
    console.error("리콜 확인 상태 저장 실패:", error);
    return false;
  }
};

// 해당 리콜을 다시 보지 않기로 설정했는지 확인
export const isRecallHidden = (userId: string, recallId: string): boolean => {
  return getHiddenRecallIds(userId).includes(recallId);
};
