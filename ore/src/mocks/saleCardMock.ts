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
  score: 79,

  purchaseDate: purchaseDate ?? "정보 없음",
  usagePeriod: "7개월",
  repairCount: 1,
  repairCost: 0,
  componentReplacement: "N",
  recallStatus: "N",

  aiSummary:
    "제품의 사용 이력과 수리 기록을 바탕으로 생성한 AI 분석 요약입니다. 실제 API 연동 이후 제품별 관리 이력을 기반으로 표시됩니다.",

  ownerName: "ORE Owner",
  issuedAt: "2026.08.13",
});
