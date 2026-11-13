import type { SaleCardData } from "../types/sale";

type SaleCardMockParams = {
  productName: string;
  purchaseDate: string | null;
};

export const createMockSaleCardData = ({
  productName,
  purchaseDate,
}: SaleCardMockParams): SaleCardData => ({
  productName,
  modelName: productName,
  category: "전자기기",
  score: 79,

  purchaseDate: purchaseDate ?? "정보 없음",
  warrantyPeriod: "2027.03.15",
  repairCount: 1,
  recallStatus: "N",
  transferStatus: "N",

  aiSummary:
    "제품의 사용 이력과 수리 기록을 바탕으로 생성한 AI 분석 요약입니다. 실제 API 연동 이후 제품별 관리 이력을 기반으로 표시됩니다.",

  ownerName: "ORE Owner",
  issuedAt: "2026.08.13",
});
