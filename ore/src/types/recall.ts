export type RecallInfo = {
  recallId: string;
  productId: string;

  // 대상 제품
  productName: string;
  productDescription: string;
  productImageUrl: string | null;

  // 리콜 정보
  title: string;
  images: string[];
  riskDescription: string[];
  actionDescription: string[];

  // 상세 정보
  detailUrl: string;
};
