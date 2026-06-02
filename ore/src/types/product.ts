import type { ApiProductCategory } from "./category";

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
  category: ApiProductCategory;
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
