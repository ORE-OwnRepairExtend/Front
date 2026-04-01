export type ProductStatus = "expired" | "danger" | "imminent" | "valid";

export type ProductSummary = {
  productId: string;
  productName: string;
  nickname: string;
  isFavorite: boolean;
  isRepair: boolean;
  purchaseDate: string;
  createdAt: string;
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
