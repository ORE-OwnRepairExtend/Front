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

  // 가족 제품 리콜 여부
  isFamilyRecall?: boolean;

  // 가족 제품 소유자 이름
  userName?: string;

  // 알림 생성 날짜
  createdAt?: string;
};
