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

  category: "mobile" | "kitchen"; //api 맞게 수정 필요
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
