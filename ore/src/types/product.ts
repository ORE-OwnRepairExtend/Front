export type ProductStatus =
  | "expired"
  | "danger"
  | "imminent"
  | "valid"
  | "empty";

export type ProductSummary = {
  productId: string;
  productName: string;
  nickname: string;
  imageUrl: string;
  isFavorite: boolean;
  hasRepairHistory: boolean;
  purchaseDate: string;
  createdAt: string;

  category:
    | "모바일 기기"
    | "PC 기기"
    | "주방 가전"
    | "생활 가전"
    | "영상·음향"
    | "기타";
};

export type WarrantyInfo = {
  productId: string;
  purchaseDate: string;
  warrantyMonths: number;
  warrantyEndDate: string;
  remainingDays: number;
};

export type ProductWithStatus = ProductSummary & {
  status: ProductStatus;
};

export type WarrantyTimelineItem = {
  status: ProductStatus;
  label: string;
  date: string;
};
