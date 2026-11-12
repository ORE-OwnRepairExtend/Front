import type { RecallInfo } from "../types/recall";
import { mockRecalls } from "../mocks/recallMock";

export const getRecalls = async (): Promise<RecallInfo[]> => {
  // TODO: 실제 API 개발 완료 후 교체
  return mockRecalls;
};
